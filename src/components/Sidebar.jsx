import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context';

const Sidebar = () => {
	const { user, logout } = useUser();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const navItemStyle = ({ isActive }) => ({
		display: 'flex',
		alignItems: 'center',
		gap: '12px',
		padding: '12px 14px',
		borderRadius: '14px',
		fontSize: '14px',
		fontWeight: '500',
		color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
		textDecoration: 'none',
		cursor: 'pointer',
		transition: 'all 0.2s ease',
		marginBottom: '2px',
		background: isActive ? 'rgba(124,58,237,0.14)' : 'transparent',
		border: isActive ? '1px solid rgba(124,58,237,0.25)' : '1px solid transparent'
	});

	const iconStyle = {
		width: '34px',
		height: '34px',
		borderRadius: '10px',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: '14px',
		flexShrink: 0,
		background: 'rgba(255,255,255,0.04)'
	};

	return (
		<aside
			className="sidebar"
			style={{
				position: 'fixed',
				top: 0,
				left: 0,
				bottom: 0,
				width: 'var(--sidebar-w, 260px)',
				background: 'rgba(13,21,37,0.7)',
				borderRight: '1px solid var(--border)',
				backdropFilter: 'blur(24px)',
				padding: '28px 20px',
				display: 'flex',
				flexDirection: 'column'
			}}
		>
			<div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '36px', padding: '0 4px' }}>
				<div
					className="logo-icon"
					style={{
						width: '42px',
						height: '42px',
						borderRadius: '14px',
						background: 'linear-gradient(135deg, var(--purple), #a855f7)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: '18px',
						boxShadow: '0 0 24px rgba(124,58,237,0.5)'
					}}
				>
					💎
				</div>
				<div>
					<div
						className="logo-text"
						style={{
							fontFamily: 'Syne, sans-serif',
							fontSize: '20px',
							fontWeight: '800',
							background: 'linear-gradient(135deg, #f1f5f9, #a78bfa)',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
							backgroundClip: 'text'
						}}
					>
						Life Pilot
					</div>
					<div className="logo-sub" style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '400', marginTop: '1px' }}>
						আর্থিক ব্যবস্থাপনা
					</div>
				</div>
			</div>

			<div className="nav-label" style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', margin: '8px 8px 8px' }}>
				মূল মেনু
			</div>
			<nav>
				<NavLink to="/dashboard" className="nav-item" style={navItemStyle}>
					<div className="nav-icon" style={iconStyle}>
						<i className="fas fa-grid-2"></i>
					</div>
					ড্যাশবোর্ড
				</NavLink>
				<NavLink to="/transactions" className="nav-item" style={navItemStyle}>
					<div className="nav-icon" style={iconStyle}>
						<i className="fas fa-exchange-alt"></i>
					</div>
					লেনদেন
					<span className="nav-badge" style={{ marginLeft: 'auto', background: 'rgba(124,58,237,0.2)', color: 'var(--purple-light)', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '99px' }}>12</span>
				</NavLink>
				<NavLink to="/budgets" className="nav-item" style={navItemStyle}>
					<div className="nav-icon" style={iconStyle}>
						<i className="fas fa-wallet"></i>
					</div>
					বাজেট
				</NavLink>
				<NavLink to="/analysis" className="nav-item" style={navItemStyle}>
					<div className="nav-icon" style={iconStyle}>
						<i className="fas fa-chart-line"></i>
					</div>
					বিশ্লেষণ
				</NavLink>
				<NavLink to="/assistant" className="nav-item" style={navItemStyle}>
					<div className="nav-icon" style={iconStyle}>
						<i className="fas fa-robot"></i>
					</div>
					AI সহায়ক
				</NavLink>
			</nav>

			<div className="nav-label" style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-muted)', margin: '16px 8px 8px' }}>
				সেটিংস
			</div>
			<nav>
				<NavLink to="/settings" className="nav-item" style={navItemStyle}>
					<div className="nav-icon" style={iconStyle}>
						<i className="fas fa-sliders-h"></i>
					</div>
					পছন্দসমূহ
				</NavLink>
				<NavLink to="/security" className="nav-item" style={navItemStyle}>
					<div className="nav-icon" style={iconStyle}>
						<i className="fas fa-shield-alt"></i>
					</div>
					নিরাপত্তা
				</NavLink>
			</nav>

			<div className="sidebar-user" style={{ marginTop: 'auto', padding: '16px', borderRadius: '16px', background: 'var(--glass)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
				{user ? (
					<>
						<div className="avatar" style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--purple), var(--cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: '#fff', flexShrink: 0 }}>
							{user.avatar}
						</div>
						<div>
							<div className="user-name" style={{ fontSize: '14px', fontWeight: '600' }}>{user.name}</div>
							<div className="user-role" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>প্রিমিয়াম সদস্য</div>
						</div>
						<div className="user-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--emerald)', boxShadow: '0 0 6px var(--emerald)', marginLeft: 'auto', flexShrink: 0 }}></div>
						<button onClick={handleLogout} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--rose-light)', fontSize: '12px', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px' }}>
							লগআউট
						</button>
					</>
				) : (
					<div style={{ marginLeft: 'auto' }}>
						<Link to="/login" style={{ color: 'var(--purple-light)', textDecoration: 'none', fontSize: '14px' }}>লগইন</Link>
					</div>
				)}
			</div>
		</aside>
	);
};

export default Sidebar;
