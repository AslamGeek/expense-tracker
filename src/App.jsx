import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import ExpenseForm from './components/ExpenseForm';
import ExpenseChart from './components/ExpenseChart';
import ExpenseList from './components/ExpenseList';
import { CATEGORIES } from './constants/categories';

export default function App() {
  // In-memory state for expenses
  const [expenses, setExpenses] = useState([]);

  // Handler to add a new expense
  const handleAddExpense = (newExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
  };

  // Handler to delete an expense by id
  const handleDeleteExpense = (id) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
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

        {/* Minimal Footer */}
        <footer className="mt-12 text-center text-xs text-slate-400 pb-4">
          Expense Tracker &bull; In-Memory Data &bull; React & Tailwind CSS
        </footer>
      </div>
    </div>
  );
}
