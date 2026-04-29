import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Transactions({ mode }) {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: '800' }}>লেনদেন</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>সর্বশেষ লেনদেন ও নতুন এন্ট্রি</div>
        </div>
        <button
          onClick={() => navigate('/transactions/new')}
          style={{ padding: '10px 20px', background: 'linear-gradient(135deg, var(--purple), #a855f7)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: '600', cursor: 'pointer' }}
        >
          নতুন লেনদেন
        </button>
      </div>

      <div style={{ borderRadius: '20px', padding: '20px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
        {mode === 'new' ? (
          <div style={{ color: 'var(--text-muted)' }}>নতুন লেনদেন ফর্ম এখানে থাকবে।</div>
        ) : (
          <div style={{ color: 'var(--text-muted)' }}>আপনার লেনদেন তালিকা এখানে থাকবে।</div>
        )}
      </div>
    </div>
  );
}
