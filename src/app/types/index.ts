export interface Organization {
  id: string;
  name: string;
  plan: string;
  currency: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: "ad_spending" | "deposit" | "allocation" | "withdrawal" | "fees";
  status: "completed" | "pending" | "failed";
  accountId: string;
}

export interface Account {
  id: string;
  type: "organization" | "personal" | "team" | "ad_account";
  name: string;
  balance?: number;
  platform?: string;
}

export interface Team {
  id: string;
  name: string;
  memberCount: number;
  walletId: string | null;
}

export interface Period {
  start: string;
  end: string;
}

export interface AppData {
  organization: Organization;
  transactions: Transaction[];
  accounts: Account[];
  teams: Team[];
  periods: { current: Period; previous: Period };
}

export interface ChartDataPoint {
  date: string;
  amount: number;
  label: string;
}

export interface OverviewMetrics {
  totalSpent: number;
  pendingDeposit: number;
  totalAllocated: number;
  pendingWithdrawal: number;
  currentBalance: number;
  pendingBalanceDeposit: number;
  orgSpendingCurrent: number;
  orgSpendingPrevious: number;
  spendingChangePercent: number;
  chartData: ChartDataPoint[];
}

export type TabType = "overview" | "transactions" | "teamwallets";
export type TimePeriod = "30D" | "15D" | "7D";

export interface TransactionFilters {
  dateLabel: string;
  type: string;
  source: string;
  search: string;
  page: number;
  pageSize: 10 | 20 | 30 | 50;
}
