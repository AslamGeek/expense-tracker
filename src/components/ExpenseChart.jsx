import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid
} from 'recharts';
import { BarChart3 } from 'lucide-react';
import { CATEGORIES } from '../constants/categories';

// Format currency helper
const formatCurrency = (val) => `$${Number(val).toFixed(2)}`;

// Custom tooltip declared outside of render to prevent remounting
const CustomTooltip = ({ active, payload, totalSpent }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const amount = Number(data.amount) || 0;
    const percentage = totalSpent > 0 ? ((amount / totalSpent) * 100).toFixed(1) : '0.0';

    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-700">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span className="font-semibold text-slate-200">{data.name}</span>
        </div>
        <p className="text-base font-bold text-white">
          {formatCurrency(amount)}
        </p>
        {totalSpent > 0 && (
          <p className="text-slate-400 mt-0.5">
            {percentage}% of total
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function ExpenseChart({ chartData, totalSpent }) {
  const hasData = chartData && chartData.some((item) => item.amount > 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Spending by Category</h2>
            <p className="text-xs text-slate-500">Distribution across categories</p>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[260px] flex items-center justify-center">
        {!hasData ? (
          <div className="text-center py-8 text-slate-400">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <BarChart3 className="w-6 h-6 opacity-40" />
            </div>
            <p className="text-sm font-medium text-slate-500">No category spending data yet</p>
            <p className="text-xs text-slate-400">Add an expense to populate the chart</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 15, right: 10, left: -15, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={{ stroke: '#e2e8f0' }}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <Tooltip
                content={<CustomTooltip totalSpent={totalSpent} />}
                cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }}
              />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]} maxBarSize={48}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${entry.name || index}`} fill={entry.color || '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-5 gap-2 pt-4 border-t border-slate-100 text-center">
        {CATEGORIES.map((cat) => {
          const categoryAmount =
            chartData.find((c) => c.id === cat.id || c.name.toLowerCase() === cat.id.toLowerCase())?.amount || 0;
          return (
            <div key={cat.id} className="flex flex-col items-center">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-[11px] font-medium text-slate-600 truncate max-w-[65px]">
                  {cat.label}
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-800">
                ${categoryAmount.toFixed(0)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
