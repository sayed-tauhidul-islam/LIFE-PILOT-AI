<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body>
    <table>
        <tr>
            <td colspan="6"><strong>LP_AI আর্থিক রিপোর্ট</strong></td>
        </tr>
        <tr>
            <td><strong>ব্যবহারকারী</strong></td>
            <td>{{ $user->name }}</td>
            <td><strong>সময়কাল</strong></td>
            <td>{{ $data['label'] }}</td>
            <td><strong>মুদ্রা</strong></td>
            <td>{{ $currency }}</td>
        </tr>
        <tr>
            <td><strong>মোট আয়</strong></td>
            <td>{{ number_format($data['total_income'], 2) }}</td>
            <td><strong>মোট খরচ</strong></td>
            <td>{{ number_format($data['total_expense'], 2) }}</td>
            <td><strong>মোট সঞ্চয়</strong></td>
            <td>{{ number_format($data['total_saving'], 2) }}</td>
        </tr>
        <tr>
            <td><strong>নিট ব্যালেন্স</strong></td>
            <td>{{ number_format($data['net_balance'], 2) }}</td>
            <td><strong>সঞ্চয় হার</strong></td>
            <td>{{ $data['savings_rate'] }}%</td>
            <td><strong>লেনদেন</strong></td>
            <td>{{ $data['transaction_count'] ?? $transactions->count() }}</td>
        </tr>
    </table>

    <br>

    <table>
        <tr>
            <td colspan="6"><strong>লেনদেনের বিবরণ</strong></td>
        </tr>
        <tr>
            <th>তারিখ</th>
            <th>ধরন</th>
            <th>বিভাগ</th>
            <th>বিবরণ</th>
            <th>পরিমাণ</th>
            <th>পেমেন্ট পদ্ধতি</th>
        </tr>
        @foreach($transactions as $transaction)
            <tr>
                <td>{{ \Carbon\Carbon::parse($transaction->date)->format('Y-m-d') }}</td>
                <td>{{ ucfirst($transaction->type) }}</td>
                <td>{{ $catLabels[$transaction->category] ?? ucfirst($transaction->category) }}</td>
                <td>{{ $transaction->description }}</td>
                <td>{{ number_format($transaction->amount, 2) }}</td>
                <td>{{ ucfirst($transaction->payment_method ?? 'cash') }}</td>
            </tr>
        @endforeach
    </table>
</body>
</html>
