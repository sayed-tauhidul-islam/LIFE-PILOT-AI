@if ($paginator->hasPages())
    <nav role="navigation" aria-label="Pagination Navigation" style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <div>
            @if ($paginator->onFirstPage())
                <span class="btn btn-outline btn-sm" style="opacity:.5;pointer-events:none;">Previous</span>
            @else
                <a class="btn btn-outline btn-sm" href="{{ $paginator->previousPageUrl() }}" rel="prev">Previous</a>
            @endif
        </div>

        <div style="font-size:12px;color:var(--gray);">
            Page {{ $paginator->currentPage() }}
        </div>

        <div>
            @if ($paginator->hasMorePages())
                <a class="btn btn-outline btn-sm" href="{{ $paginator->nextPageUrl() }}" rel="next">Next</a>
            @else
                <span class="btn btn-outline btn-sm" style="opacity:.5;pointer-events:none;">Next</span>
            @endif
        </div>
    </nav>
@endif
