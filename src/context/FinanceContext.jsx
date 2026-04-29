import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [stats, setStats] = useState({});

  const calculateStats = useCallback((txns) => {
    const income = txns.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = txns.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const saving = txns.filter(t => t.type === 'saving').reduce((sum, t) => sum + t.amount, 0);

    return {
      totalBalance: income - expense,
      totalIncome: income,
      totalExpense: expense,
      totalSavings: saving,
      savingsRate: income > 0 ? ((saving / income) * 100).toFixed(1) : 0,
      finScore: 0
    };
  }, []);

  const isDemoTransactions = (txns) => {
    if (!Array.isArray(txns) || txns.length !== 5) return false;
    const demoCats = ['বেতন', 'মুদিখানা', 'মাসিক সঞ্চয়', 'বিদ্যুৎ বিল', 'বিনোদন'];
    const demoDates = ['2026-04-01', '2026-04-03', '2026-04-05', '2026-04-08', '2026-04-12'];
    return txns.every((t, i) =>
      t && t.id === i + 1 &&
      t.category === demoCats[i] &&
      t.date === demoDates[i]
    );
  };

  const isDemoBudgets = (buds) => {
    if (!Array.isArray(buds) || buds.length !== 4) return false;
    const demoCats = ['খাদ্য', 'বিনোদন', 'পোশাক', 'পরিবহন'];
    return buds.every((b, i) => b && b.id === i + 1 && b.category === demoCats[i]);
  };

  useEffect(() => {
    const savedTx = localStorage.getItem('transactions');
    const savedBud = localStorage.getItem('budgets');

    const parsedTx = savedTx ? JSON.parse(savedTx) : [];
    const parsedBud = savedBud ? JSON.parse(savedBud) : [];

    let safeTx = Array.isArray(parsedTx) ? parsedTx : [];
    let safeBud = Array.isArray(parsedBud) ? parsedBud : [];

    if (isDemoTransactions(safeTx)) {
      safeTx = [];
      localStorage.removeItem('transactions');
    }
    if (isDemoBudgets(safeBud)) {
      safeBud = [];
      localStorage.removeItem('budgets');
    }

    setTransactions(safeTx);
    setBudgets(safeBud);
    setStats(calculateStats(safeTx));
  }, [calculateStats]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    setStats(calculateStats(transactions));
  }, [transactions, calculateStats]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  const value = {
    transactions,
    budgets,
    stats,
    setTransactions,
    setBudgets
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
};

export default FinanceContext;
