import React from 'react';
import { Link } from 'react-router-dom';

export default function Settings() {
  return (
    <div style={{ padding: '32px 36px' }}>
      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>পছন্দসমূহ</div>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <Link to="/settings/theme" style={{ textDecoration: 'none', color: 'var(--text-primary)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: '12px' }}>থিম</Link>
        <Link to="/settings/contrast" style={{ textDecoration: 'none', color: 'var(--text-primary)', background: 'var(--surface)', border: '1px solid var(--border)', padding: '12px 16px', borderRadius: '12px' }}>উজ্জ্বলতা</Link>
      </div>
    </div>
  );
}
