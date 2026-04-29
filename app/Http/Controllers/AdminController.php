<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Model;

class AdminController extends Controller
{
    /**
     * All manageable models/tables in the system
     */
    private array $models = [
        'users' => \App\Models\User::class,
        'transactions' => \App\Models\Transaction::class,
        'budgets' => \App\Models\Budget::class,
        'ai_suggestions' => \App\Models\AISuggestion::class,
        'health_profiles' => \App\Models\HealthProfile::class,
        'reports' => \App\Models\Report::class,
        'routines' => \App\Models\Routine::class,
        'meetings' => \App\Models\Meeting::class,
        'expenses' => \App\Models\Expense::class,
        'tasks' => \App\Models\Task::class,
        'prayer_times' => \App\Models\PrayerTime::class,
        'income_sources' => \App\Models\IncomeSource::class,
        'financial_goals' => \App\Models\FinancialGoal::class,
        'investments' => \App\Models\Investment::class,
        'savings' => \App\Models\Saving::class,
        'user_finance_profiles' => \App\Models\UserFinanceProfile::class,
    ];

    /**
     * Admin dashboard - overview of all tables
     */
    public function index(Request $request)
    {
        $tableStats = [];
        $totalRows = 0;
        $dbSize = 0;

        foreach ($this->models as $table => $modelClass) {
            try {
                $count = $modelClass::count();
                $totalRows += $count;

                // Get table size info
                $columns = Schema::getColumns($table);
                $indexes = Schema::getIndexes($table);

                $tableStats[$table] = [
                    'count' => $count,
                    'columns' => count($columns),
                    'indexes' => count($indexes),
                    'model' => $modelClass,
                    'display_name' => Str::title(str_replace('_', ' ', $table)),
                ];
            } catch (\Exception $e) {
                $tableStats[$table] = [
                    'count' => 0,
                    'columns' => 0,
                    'indexes' => 0,
                    'model' => $modelClass,
                    'display_name' => Str::title(str_replace('_', ' ', $table)),
                ];
            }
        }

        // Get database size from information_schema
        try {
            $dbName = DB::connection()->getDatabaseName();
            $sizeResult = DB::select("SELECT 
                ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS size_mb 
                FROM information_schema.tables 
                WHERE table_schema = ?", [$dbName]);
            $dbSize = $sizeResult[0]->size_mb ?? 0;
        } catch (\Exception $e) {
            $dbSize = 0;
        }

        return view('admin.dashboard', compact('tableStats', 'totalRows', 'dbSize'));
    }

    /**
     * Show schema/structure of a table
     */
    public function schema(string $table)
    {
        $this->validateTable($table);

        $columns = Schema::getColumns($table);
        $indexes = Schema::getIndexes($table);
        $foreignKeys = Schema::getForeignKeys($table) ?? [];

        $displayName = Str::title(str_replace('_', ' ', $table));
        $modelClass = $this->models[$table];

        return view('admin.schema', compact('table', 'columns', 'indexes', 'foreignKeys', 'displayName', 'modelClass'));
    }

    /**
     * Browse data in a table with search and filter
     */
    public function data(Request $request, string $table)
    {
        $this->validateTable($table);

        $modelClass = $this->models[$table];
        $query = $modelClass::query();
        $displayName = Str::title(str_replace('_', ' ', $table));

        // Search
        if ($request->filled('search')) {
            $search = $request->input('search');
            $searchableColumns = $this->getSearchableColumns($table);
            $query->where(function ($q) use ($search, $searchableColumns) {
                foreach ($searchableColumns as $column) {
                    $q->orWhere($column, 'LIKE', "%{$search}%");
                }
            });
        }

        // Column filtering
        foreach ($request->all() as $key => $value) {
            if (str_starts_with($key, 'filter_') && !empty($value)) {
                $column = substr($key, 7);
                $query->where($column, $value);
            }
        }

        // Sorting
        $sortColumn = $request->input('sort', 'id');
        $sortDirection = $request->input('direction', 'desc');
        if (Schema::hasColumn($table, $sortColumn)) {
            $query->orderBy($sortColumn, $sortDirection);
        }

        $perPage = $request->input('per_page', 25);
        $records = $query->paginate($perPage)->withQueryString();

        // Get columns for filter dropdowns
        $columns = Schema::getColumns($table);
        $filterColumns = [];
        foreach ($columns as $col) {
            if (str_contains($col['type'], 'enum') || str_contains($col['type'], 'varchar') || str_contains($col['type'], 'string')) {
                $filterColumns[$col['name']] = $col;
            }
        }

        // Get unique values for key enum columns
        $enumValues = [];
        foreach ($filterColumns as $colName => $colInfo) {
            if (str_contains($colInfo['type'], 'enum')) {
                preg_match_all("/'([^']+)'/", $colInfo['type'], $matches);
                $enumValues[$colName] = $matches[1] ?? [];
            } else {
                try {
                    $uniqueValues = $modelClass::select($colName)->distinct()->limit(20)->pluck($colName)->filter()->values();
                    if ($uniqueValues->count() <= 20) {
                        $enumValues[$colName] = $uniqueValues->toArray();
                    }
                } catch (\Exception $e) {
                    // Ignore
                }
            }
        }

        return view('admin.data', compact('table', 'records', 'columns', 'displayName', 'enumValues', 'sortColumn', 'sortDirection'));
    }

    /**
     * Show form to create a new record
     */
    public function create(string $table)
    {
        $this->validateTable($table);

        $modelClass = $this->models[$table];
        $columns = $this->getEditableColumns($table);
        $displayName = Str::title(str_replace('_', ' ', $table));

        $instance = new $modelClass();

        return view('admin.form', compact('table', 'columns', 'displayName', 'instance'));
    }

    /**
     * Store a new record
     */
    public function store(Request $request, string $table)
    {
        $this->validateTable($table);

        $modelClass = $this->models[$table];
        $columns = $this->getEditableColumns($table);

        $rules = $this->buildValidationRules($table, $columns);
        $validated = $request->validate($rules);

        // Handle JSON fields
        $validated = $this->processJsonFields($table, $validated);

        // Handle boolean fields
        $validated = $this->processBooleanFields($table, $validated);

        $record = $modelClass::create($validated);

        return redirect()->route('admin.data', $table)
            ->with('success', 'Record created successfully! ID: ' . $record->id);
    }

    /**
     * Show form to edit a record
     */
    public function edit(string $table, int $id)
    {
        $this->validateTable($table);

        $modelClass = $this->models[$table];
        $columns = $this->getEditableColumns($table);
        $displayName = Str::title(str_replace('_', ' ', $table));

        $instance = $modelClass::findOrFail($id);

        return view('admin.form', compact('table', 'columns', 'displayName', 'instance'));
    }

    /**
     * Update a record
     */
    public function update(Request $request, string $table, int $id)
    {
        $this->validateTable($table);

        $modelClass = $this->models[$table];
        $columns = $this->getEditableColumns($table);

        $rules = $this->buildValidationRules($table, $columns, $id);
        $validated = $request->validate($rules);

        // Handle JSON fields
        $validated = $this->processJsonFields($table, $validated);

        // Handle boolean fields
        $validated = $this->processBooleanFields($table, $validated);

        $record = $modelClass::findOrFail($id);
        $record->update($validated);

        return redirect()->route('admin.data', $table)
            ->with('success', 'Record updated successfully! ID: ' . $record->id);
    }

    /**
     * Delete a record
     */
    public function destroy(string $table, int $id)
    {
        $this->validateTable($table);

        $modelClass = $this->models[$table];
        $record = $modelClass::findOrFail($id);
        $record->delete();

        return redirect()->route('admin.data', $table)
            ->with('success', 'Record deleted successfully!');
    }

    /**
     * Export database to SQL
     */
    public function export()
    {
        $dbName = DB::connection()->getDatabaseName();
        $timestamp = now()->format('Y-m-d_H-i-s');
        $filename = "lifepilot_ai_backup_{$timestamp}.sql";

        try {
            $tables = array_keys($this->models);
            $sql = "-- Life Pilot AI Database Export\n";
            $sql .= "-- Generated: " . now()->toDateTimeString() . "\n";
            $sql .= "-- Database: {$dbName}\n\n";
            $sql .= "SET FOREIGN_KEY_CHECKS=0;\n\n";

            foreach ($tables as $table) {
                if (!Schema::hasTable($table)) continue;

                // Table structure
                $sql .= "-- Table: {$table}\n";
                $sql .= "DROP TABLE IF EXISTS `{$table}`;\n";

                $createTable = DB::select("SHOW CREATE TABLE `{$table}`")[0]->{'Create Table'} ?? '';
                $sql .= $createTable . ";\n\n";

                // Data
                $rows = DB::table($table)->get();
                if ($rows->isNotEmpty()) {
                    $columns = array_keys((array)$rows->first());
                    $colNames = implode('`, `', $columns);

                    foreach ($rows as $row) {
                        $values = [];
                        foreach ($row as $key => $value) {
                            if ($value === null) {
                                $values[] = 'NULL';
                            } elseif (is_numeric($value)) {
                                $values[] = $value;
                            } elseif (is_array($value) || is_object($value)) {
                                $values[] = "'" . addslashes(json_encode($value)) . "'";
                            } else {
                                $values[] = "'" . addslashes($value) . "'";
                            }
                        }
                        $sql .= "INSERT INTO `{$table}` (`{$colNames}`) VALUES (" . implode(', ', $values) . ");\n";
                    }
                    $sql .= "\n";
                }
            }

            $sql .= "SET FOREIGN_KEY_CHECKS=1;\n";

            return response($sql)
                ->header('Content-Type', 'text/plain')
                ->header('Content-Disposition', "attachment; filename={$filename}");

        } catch (\Exception $e) {
            return redirect()->route('admin.dashboard')
                ->with('error', 'Export failed: ' . $e->getMessage());
        }
    }

    /**
     * AJAX endpoint to get column info
     */
    public function getColumnInfo(Request $request, string $table)
    {
        $this->validateTable($table);
        $column = $request->input('column');

        if (!Schema::hasColumn($table, $column)) {
            return response()->json(['error' => 'Column not found'], 404);
        }

        $columns = Schema::getColumns($table);
        $colInfo = collect($columns)->firstWhere('name', $column);

        // Get unique values for column
        $modelClass = $this->models[$table];
        $uniqueValues = $modelClass::select($column)->distinct()->limit(50)->pluck($column)->filter()->values();

        return response()->json([
            'column' => $colInfo,
            'unique_values' => $uniqueValues,
        ]);
    }

    // ==================== PRIVATE HELPERS ====================

    private function validateTable(string $table): void
    {
        if (!isset($this->models[$table])) {
            abort(404, 'Table not found');
        }
    }

    private function getSearchableColumns(string $table): array
    {
        $columns = Schema::getColumns($table);
        $searchable = [];

        foreach ($columns as $col) {
            $type = strtolower($col['type']);
            if (str_contains($type, 'varchar')
                || str_contains($type, 'text')
                || str_contains($type, 'char')
                || str_contains($type, 'string')
                || str_contains($type, 'longtext')
                || str_contains($type, 'mediumtext')
            ) {
                $searchable[] = $col['name'];
            }
        }

        return $searchable ?: ['id'];
    }

    private function getEditableColumns(string $table): array
    {
        $columns = Schema::getColumns($table);
        $editable = [];

        foreach ($columns as $col) {
            // Skip auto-increment pk, timestamps (managed by Laravel)
            if ($col['auto_increment'] ?? false) continue;
            if (in_array($col['name'], ['created_at', 'updated_at', 'email_verified_at', 'remember_token'])) continue;

            $editable[] = $col;
        }

        return $editable;
    }

    private function buildValidationRules(string $table, array $columns, ?int $ignoreId = null): array
    {
        $rules = [];
        $modelClass = $this->models[$table];

        foreach ($columns as $col) {
            $name = $col['name'];
            $type = strtolower($col['type']);
            $nullable = $col['nullable'] ?? false;
            $rule = [];

            if (!$nullable && !$col['default']) {
                $rule[] = 'required';
            } else {
                $rule[] = 'nullable';
            }

            // Type based rules
            if (str_contains($type, 'int') || str_contains($type, 'bigint')) {
                $rule[] = 'integer';
            } elseif (str_contains($type, 'decimal') || str_contains($type, 'float') || str_contains($type, 'double')) {
                $rule[] = 'numeric';
            } elseif (str_contains($type, 'date')) {
                $rule[] = 'date';
            } elseif (str_contains($type, 'time')) {
                $rule[] = 'date_format:H:i';
            } elseif (str_contains($type, 'varchar') || str_contains($type, 'char')) {
                preg_match('/\((\d+)\)/', $type, $matches);
                $max = $matches[1] ?? 255;
                $rule[] = "string|max:{$max}";
            } elseif (str_contains($type, 'text')) {
                $rule[] = 'string';
            } elseif (str_contains($type, 'json')) {
                $rule[] = 'json';
            } elseif (str_contains($type, 'enum')) {
                preg_match_all("/'([^']+)'/", $type, $matches);
                $values = implode(',', $matches[1] ?? []);
                $rule[] = "in:{$values}";
            } elseif (str_contains($type, 'tinyint(1)') || str_contains($type, 'boolean')) {
                $rule[] = 'boolean';
            }

            // Unique check for email/username
            if ($name === 'email') {
                $uniqueRule = "unique:{$table},email";
                if ($ignoreId) {
                    $uniqueRule .= ",{$ignoreId}";
                }
                $rule[] = $uniqueRule;
            }

            $rules[$name] = implode('|', $rule);
        }

        return $rules;
    }

    private function processJsonFields(string $table, array $data): array
    {
        $columns = Schema::getColumns($table);

        foreach ($columns as $col) {
            $name = $col['name'];
            if (!isset($data[$name])) continue;

            if (str_contains(strtolower($col['type']), 'json')) {
                // If it's a string, try to decode then re-encode properly
                if (is_string($data[$name])) {
                    $decoded = json_decode($data[$name], true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $data[$name] = $decoded;
                    } else {
                        // Try comma-separated or newline separated
                        $lines = preg_split('/[\n,]+/', $data[$name]);
                        $data[$name] = array_map('trim', array_filter($lines));
                    }
                }
            }
        }

        return $data;
    }

    private function processBooleanFields(string $table, array $data): array
    {
        $columns = Schema::getColumns($table);

        foreach ($columns as $col) {
            $name = $col['name'];
            $type = strtolower($col['type']);

            if (str_contains($type, 'tinyint(1)') || str_contains($type, 'boolean')) {
                $data[$name] = isset($data[$name]) && $data[$name] ? 1 : 0;
            }
        }

        return $data;
    }
}

