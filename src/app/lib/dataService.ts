import { AppData, OverviewMetrics, ChartDataPoint, Transaction } from "../types";

// ─── Helper: check if date is within a period ─────────────────────────────────
function isInPeriod(dateStr: string, start: string, end: string): boolean {
  const date = new Date(dateStr).getTime();
  return date >= new Date(start).getTime() && date <= new Date(end).getTime();
}

// ─── Helper: check if date is within last N days from reference date ──────────
function isInLastNDays(dateStr: string, days: number, referenceDate: Date): boolean {
  const date = new Date(dateStr).getTime();
  const cutoff = referenceDate.getTime() - days * 24 * 60 * 60 * 1000;
  return date >= cutoff && date <= referenceDate.getTime();
}

// ─── Formula 6: Chart data ────────────────────────────────────────────────────
export function calcChartData(transactions: Transaction[], referenceDate: Date): ChartDataPoint[] {
  const adSpending = transactions.filter(
    t => t.category === "ad_spending" && isInLastNDays(t.date, 30, referenceDate)
  );

  const grouped: Record<string, number> = {};
  adSpending.forEach(t => {
    const key = new Date(t.date).toISOString().split("T")[0];
    grouped[key] = (grouped[key] ?? 0) + t.amount;
  });

  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dateKey, amount]) => {
      const date = new Date(dateKey);
      const label = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      return { date: dateKey, amount, label };
    });
}

// ─── Formula 1: Total spent (ad_spending + completed, last 30 days) ──────────
export function calcTotalSpent(transactions: Transaction[], referenceDate: Date): number {
  return transactions
    .filter(
      (t) =>
        t.category === "ad_spending" &&
        t.status === "completed" &&
        isInLastNDays(t.date, 30, referenceDate)
    )
    .reduce((sum, t) => sum + t.amount, 0);
}

// ─── Formula 2: Pending deposit (deposit + pending, last 30 days) ────────────
export function calcPendingDeposit(transactions: Transaction[], referenceDate: Date): number {
  return transactions
    .filter(
      (t) =>
        t.category === "deposit" &&
        t.status === "pending" &&
        isInLastNDays(t.date, 30, referenceDate)
    )
    .reduce((sum, t) => sum + t.amount, 0);
}

// ─── Formula 3: Total allocated (allocation + completed, last 30 days) ────────
export function calcTotalAllocated(transactions: Transaction[], referenceDate: Date): number {
  return transactions
    .filter(
      (t) =>
        t.category === "allocation" &&
        t.status === "completed" &&
        isInLastNDays(t.date, 30, referenceDate)
    )
    .reduce((sum, t) => sum + t.amount, 0);
}

// ─── Formula 4: Pending withdrawal (withdrawal + pending, last 30 days) ───────
export function calcPendingWithdrawal(transactions: Transaction[], referenceDate: Date): number {
  return transactions
    .filter(
      (t) =>
        t.category === "withdrawal" &&
        t.status === "pending" &&
        isInLastNDays(t.date, 30, referenceDate)
    )
    .reduce((sum, t) => sum + t.amount, 0);
}

// ─── Formula 5: Org spending current vs previous period ──────────────────────
export function calcOrgSpending(
  transactions: Transaction[],
  currentPeriod: { start: string; end: string },
  previousPeriod: { start: string; end: string }
): { current: number; previous: number; changePercent: number } {
  const current = transactions
    .filter(
      (t) =>
        t.category === "ad_spending" &&
        isInPeriod(t.date, currentPeriod.start, currentPeriod.end)
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const previous = transactions
    .filter(
      (t) =>
        t.category === "ad_spending" &&
        isInPeriod(t.date, previousPeriod.start, previousPeriod.end)
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const changePercent =
    previous > 0 ? ((current - previous) / previous) * 100 : 0;

  return { current, previous, changePercent };
}


// ─── Formula 7: Current org balance from wallet_001 ──────────────────────────
export function calcCurrentBalance(data: AppData): number {
  const wallet = data.accounts.find((a) => a.id === "wallet_001");
  return wallet?.balance ?? 0;
}

// ─── Master compute function ──────────────────────────────────────────────────
export function computeMetrics(data: AppData): OverviewMetrics {
  const { transactions, periods } = data;

  // ✅ Utiliser la fin de periods.current comme référence, pas new Date()
  // Cela garantit que les calculs correspondent aux données du JSON
  const referenceDate = new Date(periods.current.end);
  const cutoff = new Date(referenceDate.getTime() - 30 * 24 * 60 * 60 * 1000);
  const last30 = (t: Transaction) =>
    new Date(t.date) >= cutoff && new Date(t.date) <= referenceDate;

  const spending = calcOrgSpending(transactions, periods.current, periods.previous);

  // 1. Total spent — ad_spending + completed, 30 derniers jours
  const totalSpent = transactions
    .filter(t => last30(t) && t.category === "ad_spending" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  // 2. Pending deposit — deposit + pending, 30 derniers jours
  const pendingDeposit = transactions
    .filter(t => last30(t) && t.category === "deposit" && t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  // 3. Total allocated — allocation + completed, 30 derniers jours
  const totalAllocated = transactions
    .filter(t => last30(t) && t.category === "allocation" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  // 4. Pending withdrawal — withdrawal + pending, 30 derniers jours
  const pendingWithdrawal = transactions
    .filter(t => last30(t) && t.category === "withdrawal" && t.status === "pending")
    .reduce((sum, t) => sum + t.amount, 0);

  // 5. Pending deposit BalanceCard — wallet_001 uniquement, sans filtre 30j
  const pendingBalanceDeposit = transactions
    .filter(t => t.category === "deposit" && t.status === "pending" && t.accountId === "wallet_001")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalSpent,
    pendingDeposit,
    totalAllocated,
    pendingWithdrawal,
    currentBalance: calcCurrentBalance(data),
    pendingBalanceDeposit,
    orgSpendingCurrent: spending.current,
    orgSpendingPrevious: spending.previous,
    spendingChangePercent: spending.changePercent,
    chartData: calcChartData(transactions, referenceDate), // ← passer referenceDate
  };
}

// ─── Currency formatter ────────────────────────────────────────────────────────
export function formatCurrency(
  amount: number,
  currency = "USD",
  compact = false
): string {
  if (compact && amount >= 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
