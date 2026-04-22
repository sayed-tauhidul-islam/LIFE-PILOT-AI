<!DOCTYPE html>
<html>

<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #1e293b;
            font-size: 13px;
        }

        h1 {
            color: #6366f1;
            font-size: 24px;
        }

        .header {
            border-bottom: 3px solid #6366f1;
            padding-bottom: 16px;
            margin-bottom: 24px;
        }

        .stats-row {
            display: flex;
            gap: 16px;
            margin: 20px 0;
        }

        .stat-box {
            flex: 1;
            padding: 16px;
            border-radius: 8px;
            text-align: center;
        }

        .income-box {
            background: #d1fae5;
        }

        .expense-box {
            background: #fee2e2;
        }

        .saving-box {
            background: #dbeafe;
        }

        .stat-value {
            font-size: 20px;
            font-weight: bold;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 16px 0;
        }

        th {
            background: #6366f1;
            color: white;
            padding: 10px;
            text-align: left;
        }

        td {
            padding: 8px 10px;
            border-bottom: 1px solid #e2e8f0;
        }

        .footer {
            margin-top: 40px;
            font-size: 11px;
            color: #94a3b8;
            text-align: center;
        }

    </style>
</head>

<body>
    <div class="header">
        <h1>💰 LP_AI আর্থিক রিপোর্ট</h1>
        <p><strong>{{ $user->name }}</strong> | তৈরি: {{ now()->translatedFormat('F j, Y') }}</p>
    </div>

    <h2>{{ $data['label'] }}</h2>

    <div class="stats-row">
        <div class="stat-box income-box">
            <div class="stat-value">{{ $currency }}{{ number_format($data['total_income'],0) }}</div>
            <div>মোট আয়</div>
        </div>
        <div class="stat-box expense-box">
            <div class="stat-value">{{ $currency }}{{ number_format($data['total_expense'],0) }}</div>
            <div>মোট খরচ</div>
        </div>
        <div class="stat-box saving-box">
            <div class="stat-value">{{ $currency }}{{ number_format($data['total_saving'],0) }}</div>
            <div>মোট সঞ্চয়</div>
        </div>
    </div>

    <p><strong>সঞ্চয় হার:</strong> {{ $data['savings_rate'] }}% &nbsp;|&nbsp;
        <strong>নিট ব্যালেন্স:</strong> {{ $currency }}{{ number_format($data['net_balance'],0) }}</p>

    @if(!empty($data['category_breakdown']))
        <h3>বিভাগ অনুসারে খরচ বিশ্লেষণ</h3>
        <table>
            <thead>
                <tr>
                    <th>বিভাগ</th>
                    <th>পরিমাণ</th>
                    <th>মোটের %</th>
                </tr>
            </thead>
            <tbody>
                @foreach($data['category_breakdown'] as $cat => $amount)
                    <tr>
                        @php $catLabels = $catLabels ?? array_merge(\App\Models\Transaction::expenseCategories(), \App\Models\Transaction::incomeCategories()); @endphp
                        <td>{{ $catLabels[$cat] ?? ucfirst($cat) }}</td>
                        <td>{{ $currency }}{{ number_format($amount,0) }}</td>
                        <td>{{ $data['total_expense'] > 0 ? round(($amount/$data['total_expense'])*100,1) : 0 }}%
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @endif

    <div class="footer">
        LP_AI দ্বারা তৈরি — এআই-চালিত আর্থিক ব্যবস্থাপনা সিস্টেম<br>
        {{ config('app.url') }}
    </div>
</body>

</html>
