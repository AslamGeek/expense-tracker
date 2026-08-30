import React from 'react';
import { Wallet, TrendingUp, Layers } from 'lucide-react';

export default function Header({ totalSpent, expenseCount = 0 }) {
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(totalSpent);

  return (
    <header className="mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Expense Tracker
              </h1>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Personal
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                <Layers className="w-3 h-3" />
                {expenseCount} {expenseCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage your spending, track budgets, and view category insights
            </p>
          </div>
        </div>

        {/* Running total header highlight */}
        <div className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-3.5 rounded-2xl shadow-md shadow-indigo-100 flex items-center justify-between sm:justify-start gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-medium text-indigo-200 block">
              Total Spent
            </span>
            <span className="text-2xl font-extrabold tracking-tight" id="header-total-spent">
              {formattedTotal}
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
