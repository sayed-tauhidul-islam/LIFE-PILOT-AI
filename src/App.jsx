import React, { useContext, useEffect } from 'react';
import './index.css';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Analysis from './pages/Analysis';
import Assistant from './pages/Assistant';
import Settings from './pages/Settings';
import Security from './pages/Security';
import ThemeSettings from './pages/Settings/Theme';
import ContrastSettings from './pages/Settings/Contrast';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context';
import { FinanceProvider } from './context';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';

function AppInner() {
	const { contrast } = useContext(ThemeContext);
	useEffect(() => {
		const wrapper = document.getElementById('app-root') || document.body;
		wrapper.style.filter = `brightness(${contrast}%)`;
	}, [contrast]);

	return (
		<div
			id="app-root"
			className="app-container layout"
			style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}
		>
			<Sidebar />
			<main
				className="main"
				style={{
					marginLeft: 'var(--sidebar-w, 260px)',
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					minHeight: '100vh'
				}}
			>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route
						path="/dashboard"
						element={
							<ProtectedRoute>
								<Dashboard />
							</ProtectedRoute>
						}
					/>
					<Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
					<Route path="/transactions/new" element={<ProtectedRoute><Transactions mode="new" /></ProtectedRoute>} />
					<Route path="/budgets" element={<ProtectedRoute><Budgets /></ProtectedRoute>} />
					<Route path="/analysis" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
					<Route path="/assistant" element={<ProtectedRoute><Assistant /></ProtectedRoute>} />
					<Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
					<Route path="/settings/theme" element={<ProtectedRoute><ThemeSettings /></ProtectedRoute>} />
					<Route path="/settings/contrast" element={<ProtectedRoute><ContrastSettings /></ProtectedRoute>} />
					<Route path="/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</main>
		</div>
	);
}

export default function App() {
	return (
		<UserProvider>
			<FinanceProvider>
				<ThemeProvider>
					<Router basename={''}>
						<AppInner />
					</Router>
				</ThemeProvider>
			</FinanceProvider>
		</UserProvider>
	);
}
