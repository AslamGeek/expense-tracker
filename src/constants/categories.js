export const CATEGORIES = [
  { id: 'Food', label: 'Food', color: '#f97316', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', icon: 'Utensils' },
  { id: 'Transport', label: 'Transport', color: '#3b82f6', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', icon: 'Car' },
  { id: 'Shopping', label: 'Shopping', color: '#ec4899', bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200', icon: 'ShoppingBag' },
  { id: 'Bills', label: 'Bills', color: '#eab308', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', icon: 'Receipt' },
  { id: 'Other', label: 'Other', color: '#8b5cf6', bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', icon: 'MoreHorizontal' },
];

export const getCategoryConfig = (categoryId) => {
  return CATEGORIES.find(c => c.id === categoryId) || {
    id: categoryId,
    label: categoryId,
    color: '#64748b',
    bg: 'bg-slate-50',
    text: 'text-slate-600',
    border: 'border-slate-200',
    icon: 'Tag'
  };
};
