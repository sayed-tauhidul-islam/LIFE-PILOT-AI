<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $table = 'tasks';

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'priority',
        'status',
        'date',
        'time',
        'completed',
    ];

    protected $casts = [
        'date' => 'date',
        'time' => 'datetime:H:i',
        'completed' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function priorities(): array
    {
        return ['low' => 'Low', 'medium' => 'Medium', 'high' => 'High'];
    }

    public static function statuses(): array
    {
        return [
            'pending' => 'Pending',
            'in-progress' => 'In Progress',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
        ];
    }
}

