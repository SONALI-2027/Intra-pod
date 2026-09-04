import { useRef, useState } from "react";
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
  LockKeyhole,
  Mail,
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

const CREDENTIALS_STORAGE_KEY = "spendly-credentials";

const getSavedCredentials = () => {
  const saved = localStorage.getItem(CREDENTIALS_STORAGE_KEY);

  if (!saved) {
    return {};
  }

  try {
    return JSON.parse(saved);
  } catch {
    return {};
  }
};

const saveCredentialForEmail = (email, password) => {
  const savedCredentials = getSavedCredentials();
  const normalizedEmail = email.trim().toLowerCase();

  savedCredentials[normalizedEmail] = password;
  localStorage.setItem(CREDENTIALS_STORAGE_KEY, JSON.stringify(savedCredentials));
};

const getAccountDetails = () => {
  const saved = localStorage.getItem("spendly-account-details");

  if (!saved) {
    return {};
  }

  try {
    return JSON.parse(saved);
  } catch {
    return {};
  }
};

const authenticateUser = (email, password) => {
  const normalizedEmail = email.trim().toLowerCase();
  const savedCredentials = getSavedCredentials();

  if (!(normalizedEmail in savedCredentials)) {
    saveCredentialForEmail(normalizedEmail, password);
    return true;
  }

  return savedCredentials[normalizedEmail] === password;
};

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [authenticated, setAuthenticated] = useState(() => localStorage.getItem("spendly-auth") === "true");
  const [expenseList, setExpenseList] = useState(expenses);
  const [budgetList, setBudgetList] = useState(budgetData);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [accountList, setAccountList] = useState(() => {
    const savedAccounts = JSON.parse(localStorage.getItem("spendly-accounts") || "null");
    return savedAccounts && savedAccounts.length ? savedAccounts : ["Janvi"];
  });
  const [selectedAccount, setSelectedAccount] = useState(() => localStorage.getItem("spendly-selected-account") || "Janvi");

  const handleAddAccount = () => {
    const name = window.prompt("Enter account name:");
    const trimmedName = name?.trim();

    if (!trimmedName) {
      return;
    }

    const email = window.prompt("Enter account email:");
    const trimmedEmail = email?.trim();

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      window.alert("Please enter a valid email address.");
      return;
    }

    const password = window.prompt("Enter password for this account:");
    const trimmedPassword = password?.trim();

    if (!trimmedPassword || trimmedPassword.length < 6) {
      window.alert("Password must be at least 6 characters long.");
      return;
    }

    const accountDetails = getAccountDetails();
    const isDuplicateEmail = Object.values(accountDetails).some(
      (account) => account.email.toLowerCase() === trimmedEmail.toLowerCase()
    );

    if (isDuplicateEmail) {
      window.alert("This email already has an account.");
      return;
    }

    const nextAccounts = [...new Set([...accountList, trimmedName])];
    const nextDetails = { ...accountDetails, [trimmedName]: { email: trimmedEmail, password: trimmedPassword } };

    setAccountList(nextAccounts);
    setSelectedAccount(trimmedName);
    localStorage.setItem("spendly-accounts", JSON.stringify(nextAccounts));
    localStorage.setItem("spendly-account-details", JSON.stringify(nextDetails));
    localStorage.setItem("spendly-selected-account", trimmedName);
    saveCredentialForEmail(trimmedEmail, trimmedPassword);
    setAccountMenuOpen(false);
  };

  const handleAccountSelect = (accountName) => {
    setSelectedAccount(accountName);
    localStorage.setItem("spendly-selected-account", accountName);
    setAccountMenuOpen(false);
  };

  if (!authenticated) {
    return <Login onLogin={() => { localStorage.setItem("spendly-auth", "true"); setAuthenticated(true); }} />;
  }

  const addExpense = (expense) => {
    setExpenseList((current) => [{ ...expense, id: Date.now() }, ...current]);
    setActivePage("Expenses");
  };

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

              <div className="relative hidden sm:block">
                <button
                  onClick={() => setAccountMenuOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                    {selectedAccount.slice(0, 1).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{selectedAccount}</span>
                  <ChevronDown size={15} />
                </button>

                {accountMenuOpen && (
                  <div className="absolute right-0 z-30 mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
                    {accountList.map((account) => (
                      <button
                        key={account}
                        onClick={() => handleAccountSelect(account)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm ${
                          selectedAccount === account
                            ? "bg-indigo-50 text-indigo-600"
                            : "text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <span>{account}</span>
                        {selectedAccount === account && <span className="text-xs font-semibold">Active</span>}
                      </button>
                    ))}

                    <button
                      onClick={handleAddAccount}
                      className="mt-2 flex w-full items-center justify-center rounded-xl border border-dashed border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                      + Add account
                    </button>

                    <button
                      onClick={() => {
                        localStorage.removeItem("spendly-auth");
                        setAuthenticated(false);
                        setAccountMenuOpen(false);
                      }}
                      className="mt-2 w-full rounded-xl px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-7xl p-5 lg:p-8">
          {activePage === "Dashboard" && (
            <Dashboard
              expenseList={expenseList}
              budgetList={budgetList}
              onAddExpense={() => setActivePage("Add Expense")}
              onViewExpenses={() => setActivePage("Expenses")}
            />
          )}
          {activePage === "Expenses" && (
            <Expenses
              expenseList={expenseList}
              onAddExpense={() => setActivePage("Add Expense")}
            />
          )}
          {activePage === "Add Expense" && <AddExpense onSave={addExpense} />}
          {activePage === "Budgets" && (
            <Budgets budgetList={budgetList} onChange={setBudgetList} />
          )}
          {activePage === "More" && <More expenseList={expenseList} />}
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

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submitLogin = (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const isValidLogin = authenticateUser(normalizedEmail, password);

    if (!isValidLogin) {
      setError("Incorrect password for this email.");
      return;
    }

    onLogin();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-5 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:grid-cols-2">
        <div className="hidden bg-indigo-600 p-10 text-white md:flex md:flex-col md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-indigo-600">S</div>
              <span className="text-lg font-bold">Spendly</span>
            </div>
            <h1 className="mt-24 text-4xl font-bold leading-tight">Your money,<br />made clearer.</h1>
            <p className="mt-5 max-w-xs text-indigo-100">A calmer way to understand every rupee you spend.</p>
          </div>
          <p className="text-sm text-indigo-200">Personal finance, without the friction.</p>
        </div>

        <form onSubmit={submitLogin} className="p-7 sm:p-10">
          <div className="mb-10 md:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">S</div>
          </div>
          <p className="text-sm font-semibold text-indigo-600">Welcome back</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Sign in to Spendly</h2>
          <p className="mt-2 text-sm text-slate-500">Pick up where you left off.</p>

          <label htmlFor="login-email" className="mt-8 block text-sm font-medium text-slate-700">Email address</label>
          <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-indigo-500">
            <Mail size={18} className="text-slate-400" />
            <input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="w-full outline-none" />
          </div>

          <label htmlFor="login-password" className="mt-5 block text-sm font-medium text-slate-700">Password</label>
          <div className="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 focus-within:border-indigo-500">
            <LockKeyhole size={18} className="text-slate-400" />
            <input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" className="w-full outline-none" />
          </div>

          {error && <p role="alert" className="mt-4 text-sm text-rose-600">{error}</p>}
          <button type="submit" className="mt-7 w-full rounded-xl bg-indigo-600 px-4 py-3.5 font-semibold text-white hover:bg-indigo-700">Sign in</button>
          <p className="mt-6 text-center text-sm text-slate-500">Forgot your password? <button type="button" onClick={() => setError("Password recovery will be available once authentication is connected.")} className="font-semibold text-indigo-600">Reset it</button></p>
        </form>
      </div>
    </main>
  );
}

function Dashboard({ expenseList, budgetList, onAddExpense, onViewExpenses }) {
  const totalSpent = expenseList.reduce((total, expense) => total + Number(expense.amount), 0);
  const totalBudget = budgetList.reduce((total, item) => total + Number(item.budget), 0);
  const remaining = Math.max(totalBudget - totalSpent, 0);

  return (
    <div className="space-y-6">
  
      <div className="rounded-3xl bg-indigo-600 p-6 text-white shadow-sm lg:p-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm text-indigo-200">September 2026</p>
            <h3 className="text-3xl font-bold">₹{totalSpent.toLocaleString()}</h3>
            <p className="mt-2 text-sm text-indigo-100">
              Total spending this month
            </p>
          </div>

          <button onClick={onAddExpense} className="flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-indigo-600">
            <Plus size={18} />
            Add expense
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Spent"
          value={`₹${totalSpent.toLocaleString()}`}
          change="+8.2%"
          positive={false}
        />

        <StatCard
          title="Monthly Budget"
          value={`₹${totalBudget.toLocaleString()}`}
          change="62.2% used"
          positive
        />

        <StatCard
          title="Remaining"
          value={`₹${remaining.toLocaleString()}`}
          change="37.8% left"
          positive
        />

        <StatCard
          title="Transactions"
          value={expenseList.length}
          change="this month"
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
            {expenseList.slice(0, 4).map((expense) => (
              <ExpenseRow key={expense.id || expense.merchant} expense={expense} />
            ))}
          </div>

          <button onClick={onViewExpenses} className="mt-5 w-full rounded-xl bg-slate-100 py-3 text-sm font-semibold text-slate-600">
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

function Expenses({ expenseList, onAddExpense }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [sort, setSort] = useState("newest");
  const filteredExpenses = expenseList
    .filter((expense) => expense.merchant.toLowerCase().includes(search.toLowerCase()))
    .filter((expense) => category === "All categories" || expense.category === category)
    .sort((first, second) => {
      if (sort === "highest") return second.amount - first.amount;
      if (sort === "lowest") return first.amount - second.amount;
      if (sort === "oldest") return String(first.date).localeCompare(String(second.date));
      return String(second.date).localeCompare(String(first.date));
    });

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-2xl font-bold">Expenses</h3>
          <p className="text-sm text-slate-400">
            Track and manage your transactions
          </p>
        </div>

        <button onClick={onAddExpense} className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white">
          <Plus size={18} />
          Add expense
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search merchant..."
          className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 md:flex-1"
        />

        <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3">
          <option>All categories</option>
          <option>Food</option>
          <option>Transport</option>
          <option>Shopping</option>
          <option>Bills</option>
        </select>

        <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="highest">Highest amount</option>
          <option value="lowest">Lowest amount</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {filteredExpenses.map((expense) => (
          <ExpenseRow key={expense.id || expense.merchant} expense={expense} />
        ))}
        {!filteredExpenses.length && <p className="p-6 text-sm text-slate-500">No expenses found.</p>}
      </div>
    </div>
  );
}

function AddExpense({ onSave }) {
  const [form, setForm] = useState({ amount: "", merchant: "", category: "Food", date: "", notes: "" });
  const [error, setError] = useState("");

  const updateField = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const saveExpense = (event) => {
    event.preventDefault();
    if (!form.merchant.trim() || !form.amount || Number(form.amount) <= 0) {
      setError("Enter a merchant and an amount greater than zero.");
      return;
    }
    onSave({ ...form, amount: Number(form.amount), date: form.date || "Today" });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h3 className="text-2xl font-bold">Add expense</h3>
        <p className="text-sm text-slate-400">
          Quickly record what you spent.
        </p>
      </div>

      <form onSubmit={saveExpense} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <label className="text-sm font-medium text-slate-600">Amount</label>

        <div className="mt-2 flex items-center rounded-2xl bg-slate-50 px-5 py-4">
          <span className="mr-2 text-2xl text-slate-400">₹</span>

          <input
            type="number"
            value={form.amount}
            onChange={(event) => updateField("amount", event.target.value)}
            placeholder="0.00"
            className="w-full bg-transparent text-3xl font-bold outline-none"
          />
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <FormField label="Merchant">
            <input
              value={form.merchant}
              onChange={(event) => updateField("merchant", event.target.value)}
              placeholder="e.g. Amazon"
              className="input"
            />
          </FormField>

          <FormField label="Category">
            <select value={form.category} onChange={(event) => updateField("category", event.target.value)} className="input">
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
            <input value={form.date} onChange={(event) => updateField("date", event.target.value)} type="date" className="input" />
          </FormField>

          <FormField label="Notes">
            <input value={form.notes} onChange={(event) => updateField("notes", event.target.value)} placeholder="Optional" className="input" />
          </FormField>
        </div>

        {error && <p className="mt-5 text-sm text-rose-600">{error}</p>}

        <button type="submit" className="mt-8 w-full rounded-2xl bg-indigo-600 py-4 font-semibold text-white hover:bg-indigo-700">
          Save expense
        </button>

        <button type="button" onClick={() => setError("Receipt scanning is not connected yet.")} className="mt-3 w-full rounded-2xl border border-slate-200 py-4 font-semibold text-slate-600">
          📷 Scan receipt instead
        </button>
      </form>
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

function Budgets({ budgetList, onChange }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold">Monthly budgets</h3>
        <p className="text-sm text-slate-400">
          Keep your spending under control.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {budgetList.map((item) => {
          const percentage = Math.round((item.actual / item.budget) * 100);

          return (
            <div
              key={item.category}
              className="rounded-2xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{item.category}</p>
                  <p className="text-sm text-slate-400">₹{item.actual} of</p>
                  <input
                    aria-label={`${item.category} budget`}
                    type="number"
                    min="0"
                    value={item.budget}
                    onChange={(event) => onChange((current) => current.map((budget) => budget.category === item.category ? { ...budget, budget: Number(event.target.value) } : budget))}
                    className="mt-1 w-28 rounded-lg border border-slate-200 px-2 py-1 text-sm font-semibold"
                  />
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

function More({ expenseList }) {
  const receiptInput = useRef(null);
  const [receiptName, setReceiptName] = useState("");
  const [showContacts, setShowContacts] = useState(false);
  const [showSplit, setShowSplit] = useState(false);
  const [splitExpense, setSplitExpense] = useState(expenseList[0]?.id || expenseList[0]?.merchant || "");
  const [people, setPeople] = useState(2);
  const [message, setMessage] = useState("");

  const exportCsv = () => {
    const header = "Merchant,Category,Date,Amount,Notes";
    const rows = expenseList.map((expense) => [expense.merchant, expense.category, expense.date, expense.amount, expense.notes || ""]
      .map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","));
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "spendly-expenses.csv";
    link.click();
    URL.revokeObjectURL(link.href);
    setMessage("CSV downloaded.");
  };

  const selectedExpense = expenseList.find((expense) => (expense.id || expense.merchant) === splitExpense);

  return (
    <div>
      <h3 className="text-2xl font-bold">More</h3>

      <div className="mt-5 space-y-3">
        <input ref={receiptInput} type="file" accept="image/*,.pdf" className="hidden" onChange={(event) => setReceiptName(event.target.files?.[0]?.name || "")} />
        <button onClick={() => receiptInput.current?.click()} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left font-medium">
          Scan receipt <span>→</span>
        </button>
        {receiptName && <p className="px-2 text-sm text-emerald-600">Selected: {receiptName}</p>}

        <button onClick={() => setShowContacts((current) => !current)} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left font-medium">
          Contacts <span>→</span>
        </button>
        {showContacts && <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600"><p className="font-semibold text-slate-900">Your contacts</p><p className="mt-2">Janvi</p><p className="mt-1">Rahul</p><p className="mt-1">Priya</p></div>}

        <button onClick={() => setShowSplit((current) => !current)} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left font-medium">
          Split expenses <span>→</span>
        </button>
        {showSplit && <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <label className="text-sm font-medium text-slate-600">Expense</label>
          <select value={splitExpense} onChange={(event) => setSplitExpense(event.target.value)} className="input mt-2">
            {expenseList.map((expense) => <option key={expense.id || expense.merchant} value={expense.id || expense.merchant}>{expense.merchant} - ₹{expense.amount}</option>)}
          </select>
          <label htmlFor="split-people" className="mt-4 block text-sm font-medium text-slate-600">People</label>
          <input id="split-people" type="number" min="2" value={people} onChange={(event) => setPeople(Math.max(2, Number(event.target.value)))} className="input mt-2" />
          {selectedExpense && <p className="mt-4 text-sm text-indigo-600">₹{(selectedExpense.amount / people).toFixed(2)} per person</p>}
        </div>}

        <button onClick={exportCsv} className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left font-medium">
          Export CSV <span>→</span>
        </button>
        {message && <p className="px-2 text-sm text-emerald-600">{message}</p>}
      </div>
    </div>
  );
}

export default App;
