import React, { useState, useMemo } from 'react';
import { Trash2, Receipt, Calendar, Filter, Search, X } from 'lucide-react';
import { CATEGORIES, getCategoryConfig } from '../constants/categories';

export default function ExpenseList({ expenses, onDeleteExpense }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const [year, month, day] = parts;
        const d = new Date(Number(year), Number(month) - 1, Number(day));
        return d.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const formatAmount = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Number(num) || 0);
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const matchesCategory =
        selectedCategory === 'ALL' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.category.toLowerCase().includes(q) ||
        item.date.includes(q) ||
        String(item.amount).includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [expenses, selectedCategory, searchQuery]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Expense History</h2>
            <p className="text-xs text-slate-500">
              {filteredExpenses.length} of {expenses.length} {expenses.length === 1 ? 'transaction' : 'transactions'} shown
            </p>
          </div>
        </div>

        {/* Controls: Search and Filter Pills */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-44 pl-8 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory.toLowerCase() === cat.id.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-sm font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Receipt className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No expenses recorded yet</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Fill in the form above and add your first expense to begin tracking.
          </p>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="text-center py-8 border border-slate-200 rounded-xl bg-slate-50/40">
          <Filter className="w-8 h-8 mx-auto mb-2 text-slate-400" />
          <p className="text-sm font-medium text-slate-600">No expenses found for this filter</p>
          <button
            onClick={() => setSelectedCategory('ALL')}
            className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
          >
            Reset category filter
          </button>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
          {filteredExpenses.map((expense) => {
            const catConfig = getCategoryConfig(expense.category);
            return (
              <div
                key={expense.id}
                className="group flex items-center justify-between p-3.5 rounded-xl border border-slate-200/90 bg-white hover:border-indigo-200 hover:shadow-sm transition-all duration-150"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Category icon indicator */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm shadow-sm"
                    style={{ backgroundColor: catConfig.color }}
                  >
                    {catConfig.label.charAt(0)}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800 text-sm">
                        {catConfig.label}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md border ${catConfig.bg} ${catConfig.text} ${catConfig.border}`}
                      >
                        {expense.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(expense.date)}</span>
                    </div>
                  </div>
                </div>

                {/* Amount and Delete Action */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-base font-bold text-slate-900 block">
                      {formatAmount(expense.amount)}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteExpense(expense.id)}
                    aria-label={`Delete ${expense.category} expense of ${formatAmount(expense.amount)}`}
                    title="Delete expense"
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
