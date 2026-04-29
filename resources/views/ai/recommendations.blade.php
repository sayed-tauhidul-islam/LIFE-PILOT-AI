@extends('layouts.app')
@section('title','AI Recommendations')
@section('page-title','AI Recommendations')

@section('content')
<div class="card">
    <h3>AI Recommendations</h3>
    <p>Personalized recommendations to improve your financial health.</p>
    <div style="margin-top:12px;">
        @forelse($suggestions as $s)
            <div style="padding:12px;border:1px solid var(--border);border-radius:10px;margin-bottom:8px;">
                <div style="font-weight:800;margin-bottom:6px;">{{ $s->title ?? 'Recommendation' }} <span style="font-size:12px;color:var(--gray);">{{ optional($s->created_at)->diffForHumans() }}</span></div>
                <div style="font-size:14px;color:var(--dark);">{{ $s->suggestion_text ?? json_encode($s->suggestion_data) }}</div>
            </div>
        @empty
            <div>No recommendations yet. Run AI analysis to generate recommendations.</div>
        @endforelse
    </div>
</div>
@endsection
