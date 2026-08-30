import React, { useState } from 'react';
import { PlusCircle, DollarSign, Calendar, Tag } from 'lucide-react';
import { CATEGORIES } from '../constants/categories';

export default function ExpenseForm({ onAddExpense }) {
  const getTodayString = () => new Date().toISOString().split('T')[0];

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(getTodayString());
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount greater than $0');
      return;
    }

    if (!category) {
      setError('Please select a category');
      return;
    }

    if (!date) {
      setError('Please choose a date');
      return;
    }

    setError('');
    onAddExpense({
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + Math.random().toString(36).substring(2),
      amount: parsedAmount,
      category,
      date,
      createdAt: new Date().toISOString()
    });

    // Reset amount after adding
    setAmount('');
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
      <div className="flex items-center gap-2 mb-5">
        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
          <PlusCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-800">Add New Expense</h2>
          <p className="text-xs text-slate-500">Record a new transaction to update your totals</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" id="expense-form">
        {/* Amount Field */}
        <div>
          <label htmlFor="amount" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Amount
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <input
              type="number"
              step="0.01"
              min="0.01"
              id="amount"
              name="amount"
              required
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (error) setError('');
              }}
              placeholder="0.00"
              className="block w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
            />
          </div>
        </div>

        {/* Category Field */}
        <div>
          <label htmlFor="category" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Category
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Tag className="w-4 h-4" />
            </div>
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 pl-10 pr-8 py-2.5 text-slate-900 bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Field */}
        <div>
          <label htmlFor="date" className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
            Date
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Calendar className="w-4 h-4" />
            </div>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all cursor-pointer"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          id="add-expense-btn"
          className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Add Expense
        </button>
      </form>
    </div>
  );
}
