import { useState } from "react";
import {
  LayoutDashboard,
  Receipt,
  Plus,
  WalletCards,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

const categoryData = [
  { name: "Food", value: 4200 },
  { name: "Transport", value: 2100 },
  { name: "Shopping", value: 2800 },
  { name: "Bills", value: 1900 },
  { name: "Other", value: 1450 },
];

const trendData = [
  { month: "Apr", amount: 9200 },
  { month: "May", amount: 11300 },
  { month: "Jun", amount: 9800 },
  { month: "Jul", amount: 12400 },
  { month: "Aug", amount: 10800 },
  { month: "Sep", amount: 12450 },
];

const budgetData = [
  { category: "Food", budget: 5000, actual: 4200 },
  { category: "Transport", budget: 3000, actual: 2100 },
  { category: "Shopping", budget: 4000, actual: 2800 },
  { category: "Bills", budget: 2500, actual: 1900 },
];

const expenses = [
  {
    merchant: "Domino's Pizza",
    category: "Food",
    date: "Today",
    amount: 650,
  },
  {
    merchant: "Uber",
    category: "Transport",
    date: "Yesterday",
    amount: 320,
  },
  {
    merchant: "Amazon",
    category: "Shopping",
    date: "Sep 1",
    amount: 1499,
  },
  {
    merchant: "Airtel",
    category: "Bills",
    date: "Aug 29",
    amount: 799,
  },
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Expenses", icon: Receipt },
    { name: "Add Expense", icon: Plus },
    { name: "Budgets", icon: WalletCards },
    { name: "More", icon: MoreHorizontal },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-slate-200 bg-white p-5 lg:block">
        <div className="mb-10 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
            S
          </div>

          <div>
            <h1 className="text-lg font-bold">Spendly</h1>
            <p className="text-xs text-slate-400">Expense tracker</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.name;

            return (
              <button
                key={item.name}
                onClick={() => setActivePage(item.name)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  active
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Icon size={19} />
                {item.name}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="pb-24 lg:ml-64 lg:pb-8">

        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Friday, September 4</p>
              <h2 className="text-xl font-bold">{activePage}</h2>
            </div>

            <div className="flex items-center gap-3">
              <button className="hidden rounded-xl border border-slate-200 p-2.5 sm:block">
                <Search size={19} />
              </button>

              <button className="rounded-xl border border-slate-200 p-2.5">
                <Bell size={19} />
              </button>

              <div className="hidden items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 sm:flex">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                  J
                </div>
                <span className="text-sm font-medium">Janvi</span>
                <ChevronDown size={15} />
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl p-5 lg:p-8">
          {activePage === "Dashboard" && <Dashboard />}
          {activePage === "Expenses" && <Expenses />}
          {activePage === "Add Expense" && <AddExpense />}
          {activePage === "Budgets" && <Budgets />}
          {activePage === "More" && <More />}
        </div>
      </main>


      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white px-2 py-2 lg:hidden">
        <div className="flex justify-around">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.name;

            return (
              <button
                key={item.name}
                onClick={() => setActivePage(item.name)}
                className={`flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs ${
                  active ? "text-indigo-600" : "text-slate-400"
                }`}
              >
                <Icon size={20} />
                <span>{item.name === "Add Expense" ? "Add" : item.name}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="space-y-6">
  
      <div className="rounded-3xl bg-indigo-600 p-6 text-white shadow-sm lg:p-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm text-indigo-200">September 2026</p>
            <h3 className="text-3xl font-bold">₹12,450</h3>
            <p className="mt-2 text-sm text-indigo-100">
              Total spending this month
            </p>
          </div>

          <button className="flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-indigo-600">
            <Plus size={18} />
            Add expense
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Spent"
          value="₹12,450"
          change="+8.2%"
          positive={false}
        />

        <StatCard
          title="Monthly Budget"
          value="₹20,000"
          change="62.2% used"
          positive
        />

        <StatCard
          title="Remaining"
          value="₹7,550"
          change="37.8% left"
          positive
        />

        <StatCard
          title="Transactions"
          value="42"
          change="+6 this month"
          positive
        />
      </div>

    
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Spending by category">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {categoryData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-slate-500">{item.name}</span>
                <span className="font-semibold">₹{item.value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Spending trend">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>


      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Budget vs actual">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="budget" />
                <Bar dataKey="actual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Recent expenses">
          <div className="space-y-3">
            {expenses.map((expense) => (
              <ExpenseRow key={expense.merchant} expense={expense} />
            ))}
          </div>

          <button className="mt-5 w-full rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-600">
            View all expenses
          </button>
        </Card>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <p className="text-sm font-semibold text-amber-800">
          Spending insight
        </p>

        <p className="mt-1 text-sm text-amber-700">
          Groceries are up <strong>61%</strong> compared with your 3-month
          average.
        </p>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, positive }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-400">{title}</p>

      <p className="mt-2 text-2xl font-bold">{value}</p>

      <div
        className={`mt-3 flex items-center gap-1 text-xs font-medium ${
          positive ? "text-emerald-600" : "text-rose-500"
        }`}
      >
        {positive ? (
          <ArrowUpRight size={15} />
        ) : (
          <ArrowDownRight size={15} />
        )}
        {change}
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-5 font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function ExpenseRow({ expense }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <Receipt size={18} />
        </div>

        <div>
          <p className="text-sm font-semibold">{expense.merchant}</p>
          <p className="text-xs text-slate-400">
            {expense.category} · {expense.date}
          </p>
        </div>
      </div>

      <p className="font-semibold">₹{expense.amount}</p>
    </div>
  );
}

function Expenses() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-2xl font-bold">Expenses</h3>
          <p className="text-sm text-slate-400">
            Track and manage your transactions
          </p>
        </div>

        <button className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white">
          <Plus size={18} />
          Add expense
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row">
        <input
          placeholder="Search merchant..."
          className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 md:flex-1"
        />

        <select className="rounded-xl border border-slate-200 px-4 py-3">
          <option>All categories</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Bills</option>
        </select>

        <select className="rounded-xl border border-slate-200 px-4 py-3">
          <option>Newest first</option>
          <option>Oldest first</option>
          <option>Highest amount</option>
          <option>Lowest amount</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {expenses.map((expense) => (
          <ExpenseRow key={expense.merchant} expense={expense} />
        ))}
      </div>
    </div>
  );
}

function AddExpense() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h3 className="text-2xl font-bold">Add expense</h3>
        <p className="text-sm text-slate-400">
          Quickly record what you spent.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <label className="text-sm font-medium text-slate-600">Amount</label>

        <div className="mt-2 flex items-center rounded-2xl bg-slate-50 px-5 py-4">
          <span className="mr-2 text-2xl text-slate-400">₹</span>

          <input
            type="number"
            placeholder="0.00"
            className="w-full bg-transparent text-3xl font-bold outline-none"
          />
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <FormField label="Merchant">
            <input
              placeholder="e.g. Amazon"
              className="input"
            />
          </FormField>

          <FormField label="Category">
            <select className="input">
              <option>Food</option>
              <option>Groceries</option>
              <option>Transport</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Healthcare</option>
              <option>Education</option>
              <option>Other</option>
            </select>
          </FormField>

          <FormField label="Date">
            <input type="date" className="input" />
          </FormField>

          <FormField label="Notes">
            <input placeholder="Optional" className="input" />
          </FormField>
        </div>

        <button className="mt-8 w-full rounded-2xl bg-indigo-600 py-4 font-semibold text-white hover:bg-indigo-700">
          Save expense
        </button>

        <button className="mt-3 w-full rounded-2xl border border-slate-200 py-4 font-semibold text-slate-600">
          📷 Scan receipt instead
        </button>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-600">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Budgets() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Monthly budgets</h3>
        <p className="text-sm text-slate-400">
          Keep your spending under control.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {budgetData.map((item) => {
          const percentage = Math.round((item.actual / item.budget) * 100);

          return (
            <div
              key={item.category}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{item.category}</p>
                  <p className="text-sm text-slate-400">
                    ₹{item.actual} of ₹{item.budget}
                  </p>
                </div>

                <span
                  className={`font-bold ${
                    percentage >= 100
                      ? "text-red-500"
                      : percentage >= 80
                        ? "text-amber-500"
                        : "text-emerald-500"
                  }`}
                >
                  {percentage}%
                </span>
              </div>

              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${
                    percentage >= 100
                      ? "bg-red-500"
                      : percentage >= 80
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function More() {
  return (
    <div>
      <h3 className="text-2xl font-bold">More</h3>

      <div className="mt-5 space-y-3">
        {["Scan receipt", "Contacts", "Split expenses", "Export CSV"].map(
          (item) => (
            <button
              key={item}
              className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left font-medium"
            >
              {item}
              <span>→</span>
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default App;
