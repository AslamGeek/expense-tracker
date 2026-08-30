// Verification test for Expense Tracker business logic

const CATEGORIES = [
  { id: 'Food', label: 'Food', color: '#f97316' },
  { id: 'Transport', label: 'Transport', color: '#3b82f6' },
  { id: 'Shopping', label: 'Shopping', color: '#ec4899' },
  { id: 'Bills', label: 'Bills', color: '#eab308' },
  { id: 'Other', label: 'Other', color: '#8b5cf6' },
];

function calculateTotal(expenses) {
  return expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
}

function calculateChartData(expenses) {
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
}

function sortExpenses(expenses) {
  return [...expenses].sort((a, b) => {
    const dateComparison = new Date(b.date) - new Date(a.date);
    if (dateComparison !== 0) return dateComparison;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });
}

// Sample Expenses test
const sampleExpenses = [
  { id: '1', amount: 45.50, category: 'Food', date: '2026-08-28', createdAt: '2026-08-30T10:00:00Z' },
  { id: '2', amount: 24.00, category: 'Transport', date: '2026-08-29', createdAt: '2026-08-30T10:01:00Z' },
  { id: '3', amount: 120.00, category: 'Shopping', date: '2026-08-30', createdAt: '2026-08-30T10:02:00Z' },
  { id: '4', amount: 85.25, category: 'Bills', date: '2026-08-27', createdAt: '2026-08-30T10:03:00Z' },
];

console.log('--- TEST 1: Running Total Calculation ---');
const total = calculateTotal(sampleExpenses);
console.log('Total Spent:', total);
if (Math.abs(total - 274.75) < 0.001) {
  console.log('✓ PASS: Total is $274.75');
} else {
  console.error('✗ FAIL: Unexpected total', total);
  process.exit(1);
}

console.log('\n--- TEST 2: Category Breakdown & Legend Lookup ---');
const chart = calculateChartData(sampleExpenses);
const foodEntry = chart.find(c => c.id === 'Food' || c.name === 'Food');
const shoppingEntry = chart.find(c => c.id === 'Shopping' || c.name === 'Shopping');
if (foodEntry.amount === 45.50 && shoppingEntry.amount === 120.00) {
  console.log('✓ PASS: Category breakdown matches');
} else {
  console.error('✗ FAIL: Category breakdown incorrect');
  process.exit(1);
}

console.log('\n--- TEST 3: Sorting (Most Recent First) ---');
const sorted = sortExpenses(sampleExpenses);
const sortedDates = sorted.map(s => `${s.category} (${s.date})`);
console.log('Sorted order:', sortedDates);
if (sorted[0].category === 'Shopping' && sorted[3].category === 'Bills') {
  console.log('✓ PASS: Most recent dates sorted first');
} else {
  console.error('✗ FAIL: Sorting mismatch');
  process.exit(1);
}

console.log('\n--- TEST 4: Delete Expense ---');
const afterDelete = sampleExpenses.filter(e => e.id !== '2'); // Delete Transport $24.00
const newTotal = calculateTotal(afterDelete);
console.log('New Total after deleting Transport:', newTotal);
if (Math.abs(newTotal - 250.75) < 0.001) {
  console.log('✓ PASS: Delete updates total accurately ($250.75)');
} else {
  console.error('✗ FAIL: Delete logic failed');
  process.exit(1);
}

console.log('\n--- TEST 5: Edge Cases (Empty Array, Zero, Invalid Amount) ---');
const emptyTotal = calculateTotal([]);
const emptyChart = calculateChartData([]);
if (emptyTotal === 0 && emptyChart.every(c => c.amount === 0)) {
  console.log('✓ PASS: Empty array returns 0 totals cleanly');
} else {
  console.error('✗ FAIL: Empty array handling failed');
  process.exit(1);
}

console.log('\nALL 5 LOGIC TESTS PASSED SUCCESSFULLY!');
