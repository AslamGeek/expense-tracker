import React from 'react';
import { DollarSign, Layers, PieChart, TrendingDown } from 'lucide-react';
import { getCategoryConfig } from '../constants/categories';

export default function StatsCards({ totalSpent, expenses, chartData }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  const avgExpense = expenses.length > 0 ? totalSpent / expenses.length : 0;

  // Find top category
  let topCategory = null;
  if (chartData && chartData.length > 0) {
    const sorted = [...chartData].sort((a, b) => b.amount - a.amount);
    if (sorted[0]?.amount > 0) {
      topCategory = sorted[0];
    }
  }

  const topCategoryConfig = topCategory ? getCategoryConfig(topCategory.name) : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* 1. Total Spent Card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            Total Spent
          </span>
          <span className="text-2xl font-bold text-slate-900" id="total-spent-display">
            {formatCurrency(totalSpent)}
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
          <DollarSign className="w-6 h-6" />
        </div>
      </div>

      {/* 2. Total Transactions */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            Transactions
          </span>
          <span className="text-2xl font-bold text-slate-900" id="total-transactions-count">
            {expenses.length}
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          <Layers className="w-6 h-6" />
        </div>
      </div>

      {/* 3. Top Category */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            Top Category
          </span>
          <span className="text-lg font-bold text-slate-900 truncate block max-w-[140px]">
            {topCategory ? topCategory.name : '—'}
          </span>
          {topCategory && (
            <span className="text-xs font-medium text-slate-500">
              {formatCurrency(topCategory.amount)}
            </span>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: topCategoryConfig ? topCategoryConfig.color : '#e2e8f0' }}
        >
          <PieChart className="w-6 h-6" />
        </div>
      </div>

      {/* 4. Average Expense */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            Average Expense
          </span>
          <span className="text-2xl font-bold text-slate-900">
            {formatCurrency(avgExpense)}
          </span>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
          <TrendingDown className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
