import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import ExpenseForm from './components/ExpenseForm';
import ExpenseChart from './components/ExpenseChart';
import ExpenseList from './components/ExpenseList';
import { CATEGORIES } from './constants/categories';
import { Sparkles, Trash2 } from 'lucide-react';

const STORAGE_KEY = 'expense_tracker_data_v1';

export default function App() {
  // In-memory state with localStorage fallback
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore storage error
    }
    return [];
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    } catch (err) {
      console.warn('Could not save to localStorage:', err);
    }
  }, [expenses]);

  // Handler to add a new expense
  const handleAddExpense = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
  };

  // Handler to delete an expense by id
  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  // Handler to clear all expenses
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all recorded expenses?')) {
      setExpenses([]);
    }
  };

  // Handler to load realistic demo sample data
  const handleLoadDemoData = () => {
    const today = new Date().toISOString().split('T')[0];
    const demoData = [
      { id: 'demo-1', amount: 45.50, category: 'Food', date: today, createdAt: new Date(Date.now() - 3600000).toISOString() },
      { id: 'demo-2', amount: 24.00, category: 'Transport', date: today, createdAt: new Date(Date.now() - 7200000).toISOString() },
      { id: 'demo-3', amount: 120.00, category: 'Shopping', date: today, createdAt: new Date(Date.now() - 10800000).toISOString() },
      { id: 'demo-4', amount: 85.25, category: 'Bills', date: today, createdAt: new Date(Date.now() - 14400000).toISOString() },
    ];
    setExpenses(demoData);
  };

  // Calculate total spent
  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [expenses]);

  // Aggregate category totals for Recharts bar chart
  const chartData = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const catTotal = expenses
        .filter((item) => item.category.toLowerCase() === cat.id.toLowerCase())
        .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

      return {
        id: cat.id,
        name: cat.label,
        amount: Number(catTotal.toFixed(2)),
        color: cat.color,
      };
    });
  }, [expenses]);

  // Sort expenses with most recent date first
  const sortedExpenses = useMemo(() => {
    return [...expenses].sort((a, b) => {
      // First sort by date descending
      const dateComparison = new Date(b.date) - new Date(a.date);
      if (dateComparison !== 0) return dateComparison;
      // Secondary sort by createdAt descending
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [expenses]);

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <Header totalSpent={totalSpent} expenseCount={expenses.length} />

        {/* Quick Toolbar (Demo Data & Clear) */}
        <div className="flex items-center justify-end gap-2 mb-4">
          {expenses.length === 0 ? (
            <button
              onClick={handleLoadDemoData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50/80 hover:bg-indigo-100/80 rounded-xl transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load Demo Data
            </button>
          ) : (
            <button
              onClick={handleClearAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear All Data
            </button>
          )}
        </div>

        {/* Summary Stats Overview */}
        <StatsCards
          totalSpent={totalSpent}
          expenses={expenses}
          chartData={chartData}
        />

        {/* Form and Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* Add Expense Form Card (5 cols) */}
          <div className="lg:col-span-5">
            <ExpenseForm onAddExpense={handleAddExpense} />
          </div>

          {/* Bar Chart Card (7 cols) */}
          <div className="lg:col-span-7">
            <ExpenseChart chartData={chartData} totalSpent={totalSpent} />
          </div>
        </div>

        {/* Expense List Section (Below Form & Chart) */}
        <div>
          <ExpenseList
            expenses={sortedExpenses}
            onDeleteExpense={handleDeleteExpense}
          />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-slate-400 pb-4">
          Expense Tracker &bull; Local Storage &bull; React & Tailwind CSS
        </footer>
      </div>
    </div>
  );
}
