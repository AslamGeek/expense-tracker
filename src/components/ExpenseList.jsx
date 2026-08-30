import React from 'react';
import { Trash2, Receipt, Calendar, ArrowDownRight, Tag } from 'lucide-react';
import { getCategoryConfig } from '../constants/categories';

export default function ExpenseList({ expenses, onDeleteExpense }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const [year, month, day] = dateStr.split('-');
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatAmount = (num) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Expense History</h2>
            <p className="text-xs text-slate-500">
              {expenses.length} {expenses.length === 1 ? 'transaction' : 'transactions'} recorded (most recent first)
            </p>
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
      ) : (
        <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
          {expenses.map((expense) => {
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
