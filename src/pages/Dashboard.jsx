import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser, useFinance } from '../context';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { stats, transactions, budgets } = useFinance();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const canvas = chartRef.current;
    if (canvas && !chartInstance.current) {
      const ctx = canvas.getContext('2d');
      chartInstance.current = new window.Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['নভেম্বর', 'ডিসেম্বর', 'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল'],
          datasets: [
            {
              label: 'আয়',
              data: [38000, 42000, 40000, 44000, 43000, 45230],
              backgroundColor: 'rgba(16,185,129,0.75)',
              borderRadius: 8,
              borderSkipped: false
            },
            {
              label: 'ব্যয়',
              data: [31000, 33000, 29000, 36000, 37500, 30756],
              backgroundColor: 'rgba(244,63,94,0.7)',
              borderRadius: 8,
              borderSkipped: false
            },
            {
              label: 'সঞ্চয়',
              data: [7000, 9000, 11000, 8000, 5500, 14474],
              type: 'line',
              borderColor: 'rgba(6,182,212,0.9)',
              backgroundColor: 'rgba(6,182,212,0.08)',
              borderWidth: 2.5,
              pointBackgroundColor: 'rgba(6,182,212,1)',
              pointRadius: 5,
              pointHoverRadius: 8,
              tension: 0.4,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { usePointStyle: true, padding: 20, color: 'rgba(241,245,249,0.7)', font: { size: 12 } }
            },
            tooltip: {
              backgroundColor: 'rgba(13,21,37,0.95)',
              borderColor: 'rgba(255,255,255,0.08)',
              borderWidth: 1,
              padding: 14,
              cornerRadius: 12,
              titleColor: '#f1f5f9',
              bodyColor: '#94a3b8',
              callbacks: { label: ctx => ` ৳${ctx.raw.toLocaleString()}` }
            }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: 'rgba(148,163,184,0.6)', font: { size: 12 } }, border: { display: false } },
            y: {
              grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
              ticks: { color: 'rgba(148,163,184,0.6)', font: { size: 11 }, callback: v => '৳' + v.toLocaleString() },
              border: { display: false }
            }
          },
          interaction: { intersect: false, mode: 'index' }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, []);

  const formatNumber = (num) => new Intl.NumberFormat('bn-BD').format(num);

  return (
    <>
      <div
        className="topbar"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 36px',
          background: 'rgba(7,11,20,0.6)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        <div>
          <div className="page-title" style={{ fontFamily: 'Syne, sans-serif', fontSize: '22px', fontWeight: '800' }}>
            ড্যাশবোর্ড
          </div>
          <div className="page-sub" style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
            এপ্রিল ২০২৬ — সর্বশেষ আপডেট ২ মিনিট আগে
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => navigate('/transactions/new')}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, var(--purple), #a855f7)',
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            নতুন লেনদেন
          </button>
        </div>
      </div>

      <div className="content" style={{ padding: '32px 36px', flex: 1 }}>
        <div
          className="hero-banner"
          style={{
            position: 'relative',
            borderRadius: '28px',
            overflow: 'hidden',
            marginBottom: '32px',
            padding: '36px 40px',
            background: 'linear-gradient(135deg, #1a0d3d 0%, #0d1f3c 50%, #0a2a2a 100%)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <div
            className="hero-inner"
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '24px'
            }}
          >
            <div>
              <div
                className="hero-greeting"
                style={{ fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: '800', lineHeight: '1.2', marginBottom: '8px' }}
              >
                সুপ্রভাত,{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg,#e9d5ff,#a5f3fc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {user?.name || 'ব্যবহারকারী'}
                </span>{' '}
                👋
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.65)', maxWidth: '480px', lineHeight: '1.7' }}>
                আপনার আর্থিক স্বাস্থ্য আজ বেশ ভালো। সঞ্চয়ের হার {stats.savingsRate || 0}%।
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px',
                  padding: '20px 28px',
                  textAlign: 'right',
                  backdropFilter: 'blur(16px)',
                  minWidth: '200px'
                }}
              >
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)', fontWeight: '600', marginBottom: '6px' }}>
                  এই মাসের ব্যালেন্স
                </div>
                <div
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize: '36px',
                    fontWeight: '800',
                    background: 'linear-gradient(135deg, #e9d5ff, #c4b5fd)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    lineHeight: '1'
                  }}
                >
                  ৳{formatNumber(stats.totalBalance || 0)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '28px' }}>
          <div className="stat-card purple" style={{ position: 'relative', borderRadius: '24px', padding: '24px', background: 'var(--surface)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div className="stat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div className="stat-icon" style={{ width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', background: 'rgba(124,58,237,0.15)', color: 'var(--purple-light)' }}>
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="stat-trend trend-up" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '700', padding: '5px 10px', borderRadius: '99px', background: 'rgba(16,185,129,0.12)', color: 'var(--emerald-light)' }}>
                <i className="fas fa-arrow-up" style={{ fontSize: '10px' }}></i> ১২.৪%
              </div>
            </div>
            <div className="stat-label" style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>
              মোট ব্যালেন্স
            </div>
            <div className="stat-value" style={{ fontFamily: 'Syne, sans-serif', fontSize: '30px', fontWeight: '800', lineHeight: '1.1', color: 'var(--text-primary)', marginBottom: '8px' }}>
              ৳{formatNumber(stats.totalBalance || 0)}
            </div>
            <div className="stat-sub" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              গত মাসের চেয়ে বৃদ্ধি
            </div>
          </div>

          <div className="stat-card emerald">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--emerald-light)' }}><i className="fas fa-arrow-down"></i></div>
              <div className="stat-trend trend-up"><i className="fas fa-arrow-up"></i> ৮.৩%</div>
            </div>
            <div className="stat-label">মোট আয়</div>
            <div className="stat-value">৳{formatNumber(stats.totalIncome || 0)}</div>
            <div className="stat-sub">এপ্রিল ২০২৬</div>
          </div>
          <div className="stat-card rose">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'rgba(244,63,94,0.15)', color: 'var(--rose-light)' }}><i className="fas fa-arrow-up"></i></div>
              <div className="stat-trend trend-down"><i className="fas fa-arrow-down"></i> ১৮%</div>
            </div>
            <div className="stat-label">মোট ব্যয়</div>
            <div className="stat-value">৳{formatNumber(stats.totalExpense || 0)}</div>
            <div className="stat-sub">বাজেটের ৬৮% ব্যবহৃত</div>
          </div>
          <div className="stat-card cyan">
            <div className="stat-header">
              <div className="stat-icon" style={{ background: 'rgba(6,182,212,0.15)', color: 'var(--cyan-light)' }}><i className="fas fa-piggy-bank"></i></div>
              <div className="stat-trend trend-up"><i className="fas fa-arrow-up"></i> ২৩%</div>
            </div>
            <div className="stat-label">মোট সঞ্চয়</div>
            <div className="stat-value">৳{formatNumber(stats.totalSavings || 0)}</div>
            <div className="stat-sub">লক্ষ্যমাত্রার ৮৮%</div>
          </div>
        </div>

        <div className="card chart-card" style={{ borderRadius: '24px', padding: '28px', background: 'var(--surface)', border: '1px solid var(--border)', marginBottom: '28px' }}>
          <div className="card-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'Syne, sans-serif', fontSize: '17px', fontWeight: '700' }}>
              <div className="card-title-icon icon-purple" style={{ width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', background: 'rgba(124,58,237,0.15)', color: 'var(--purple-light)' }}>
                <i className="fas fa-chart-bar"></i>
              </div>
              মাসিক আয় বনাম ব্যয়
            </div>
          </div>
          <div style={{ height: '280px', position: 'relative' }}>
            <canvas ref={chartRef} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '28px' }}>
          <div className="card" style={{ borderRadius: '24px', padding: '28px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="card-head" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div className="card-title">
                <div className="card-title-icon icon-emerald" style={{ width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', background: 'rgba(16,185,129,0.15)', color: 'var(--emerald-light)' }}>
                  <i className="fas fa-exchange-alt"></i>
                </div>
                সাম্প্রতিক লেনদেন
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '0 16px 14px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>বিবরণ</th>
                  <th style={{ padding: '0 16px 14px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>ধরন</th>
                  <th style={{ padding: '0 16px 14px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', textAlign: 'left' }}>তারিখ</th>
                  <th style={{ padding: '0 16px 14px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', textAlign: 'right' }}>টাকা</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((tx) => (
                  <tr key={tx.id} style={{ transition: 'background 0.15s' }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="tx-cat-icon" style={{ width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                          💼
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '13px' }}>{tx.category}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{tx.date}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`tx-type type-${tx.type}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: '700' }}>
                        <i className={`fas fa-arrow-${tx.type === 'income' ? 'down' : 'up'}`} style={{ fontSize: '10px' }}></i>
                        {tx.type === 'income' ? 'আয়' : tx.type === 'expense' ? 'ব্যয়' : 'সঞ্চয়'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{tx.date}</td>
                    <td className={`tx-amount amount-${tx.type}`} style={{ fontFamily: 'Syne, sans-serif', fontSize: '15px', fontWeight: '700', textAlign: 'right' }}>
                      {tx.type === 'income' ? '+' : '-'}৳{formatNumber(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card" style={{ borderRadius: '24px', padding: '28px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="card-head">
              <div className="card-title">
                <div className="card-title-icon" style={{ width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', background: 'rgba(245,158,11,0.15)', color: 'var(--amber-light)' }}>
                  <i className="fas fa-wallet"></i>
                </div>
                বাজেট অবস্থা
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {budgets.map((budget) => {
                const pct = budget.limit > 0 ? ((budget.spent / budget.limit) * 100) : 0;
                const status = pct < 80 ? 'ok' : pct < 100 ? 'warn' : 'danger';
                return (
                  <div key={budget.id} className={`budget-card budget-${status}`} style={{ background: 'var(--glass)', border: '1px solid var(--border)', borderRadius: '18px', padding: '18px 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="budget-cat-icon" style={{ width: '34px', height: '34px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>
                          {budget.icon}
                        </div>
                        <div className="budget-cat-name" style={{ fontSize: '14px', fontWeight: '600' }}>{budget.category}</div>
                      </div>
                      <div className={`budget-pct pct-${status}`} style={{ fontSize: '13px', fontWeight: '800', padding: '4px 12px', borderRadius: '99px' }}>
                        {Math.floor(pct)}%
                      </div>
                    </div>
                    <div style={{ height: '6px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden', marginBottom: '10px' }}>
                      <div className={`budget-fill bar-${status}`} style={{ height: '100%', borderRadius: '99px', width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-muted)' }}>
                      <span>৳{formatNumber(budget.spent)} ব্যয়</span>
                      <span>৳{formatNumber(budget.limit)} লিমিট</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
