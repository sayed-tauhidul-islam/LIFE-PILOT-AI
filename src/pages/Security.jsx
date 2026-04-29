import React from 'react';

export default function Security() {
  return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>নিরাপত্তা</div>
      <div style={{ borderRadius: '20px', padding: '20px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
        পাসওয়ার্ড, ডিভাইস এবং সেশন সেটিংস এখানে থাকবে।
      </div>
    </div>
  );
}
