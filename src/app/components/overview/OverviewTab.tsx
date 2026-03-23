"use client";
import { useState } from "react";
import { OverviewMetrics, TimePeriod } from "@/app/types";
import { formatCurrency } from "@/app/lib/dataService";
import StatCard from "../shared/StatCard";
import { Icons } from "@/app/lib/icons";
import Image from "next/image";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

interface OverviewTabProps {
  metrics: OverviewMetrics;
}

// ─── Balance Card ──────────────────────────────────────────────────────────────
function BalanceCard({ balance, pendingDeposit, pendingWithdrawal }: { balance: number; pendingDeposit: number, pendingWithdrawal: number }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col justify-between"
      style={{
    backgroundImage: "url('/img/bg.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    minHeight: "288px",
  }}
    >
      <div className="flex items-start justify-between border border-[#2F54D8] rounded-xl px-6"
       style={{
        background: "linear-gradient(135deg, #00000091 57%, #2F54D8 100%)",
        minHeight: "100px",
      }}>
        <div className="flex items-center gap-3 my-[22px]">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white">
            <Image
                            src="/wallet.png"
                            alt="Home"
                            width={32}
                            height={32}
                            className="object-contain"
                          />
          </div>
          <div className="w-full flex-col gap-[6px] items-center">
          <span className="text-xs text-white/60 font-medium">Organization Balance</span>
          <div className="w-full flex items-center justify-end">
          <p className="text-[32px] font-bold text-white tracking-tight">{formatCurrency(balance)}</p>
          <button className="text-white hover:text-white/60 transition-colors">
           <Image
                            src="/hide.png"
                            alt="Home"
                            width={30}
                            height={30}
                            className="object-contain"
                          />
        </button>
          </div>
          
          </div>

          
        </div>
        
      </div>
       
      <div className="flex gap-2 my-5">
        <button className="flex-1 py-2 px-4 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors">
          Deposit Funds
        </button>
        <button className="flex-1 py-2 px-4 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition-colors">
          Withdraw
        </button>
      </div>
      <div className="flex gap-3 mt-3">
        <div className="flex-1 p-2.5 rounded-lg bg-white/5 border border-white/10">
          <p className="text-[12px] text-white/50">Pending deposit</p>
          <p className="text-[24px] font-semibold text-white mt-0.5">{formatCurrency(pendingDeposit)}</p>
        </div>
        <div className="flex-1 p-2.5 rounded-lg bg-white/5 border border-white/10">
          <p className="text-[12px] text-white/50">Pending withdrawal</p>
          <p className="text-[24px] font-semibold text-white mt-0.5">{formatCurrency(pendingWithdrawal)}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Allocate Card ─────────────────────────────────────────────────────────────
const MEMBERS = [
  { name: "Anna Karlson", email: "anna.karlson@empresa.com", amount: "$2,500.50", avatar: "AK", color: "#F472B6" },
  { name: "Robert Zane", email: "robert.zane@empresa.com", amount: "$3,500.50", avatar: "RZ", color: "#60A5FA" },
  { name: "Isaiya Ndlale", email: "isaiya.ndlale@empresa.com", amount: "$5,500.50", avatar: "IN", color: "#34D399" },
];
function AllocateCard() {
  return (
    <div className="rounded-2xl p-5 h-full flex flex-col" style={{ background: "linear-gradient(135deg, #F8F7FF 0%, #EEF2FF 100%)" }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-[#0A0A0A] leading-snug">Allocate funds to your<br />team members wallet.</h3>
          <p className="text-xs text-[#737373] mt-1.5 leading-relaxed">You can manage funds within<br />you teammate personnal wallet</p>
        </div>
        <div className="rounded-xl p-2.5" style={{ background: "linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%)" }}>
          <div className="w-8 h-8 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED]">
            <Icons.Wallet size={16} />
          </div>
        </div>
      </div>
      <button className="w-full py-2 px-4 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-medium transition-colors mb-4">
        Allocate Funds
      </button>
      <div className="flex flex-col gap-2 flex-1">
        {MEMBERS.map((m) => (
          <div key={m.name} className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/60 border border-white/80">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: m.color }}>
                <span className="text-[10px] text-white font-semibold">{m.avatar}</span>
              </div>
              <div>
                <p className="text-xs font-medium text-[#0A0A0A]">{m.name}</p>
                <p className="text-[10px] text-[#737373]">{m.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#0A0A0A]">{m.amount}</span>
              <button className="text-[#A3A3A3] hover:text-[#7C3AED]"><Icons.ChevronRight size={10} /></button>
              <button className="text-[#A3A3A3] hover:text-[#0A0A0A]"><Icons.More size={10} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Spending Chart ────────────────────────────────────────────────────────────
interface SpendingChartProps {
  metrics: OverviewMetrics;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0A0A0A] text-white text-xs px-3 py-2 rounded-lg shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-[#A3A3A3] mt-0.5">{formatCurrency(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

function SpendingChart({ metrics }: SpendingChartProps) {
  const isPositive = metrics.spendingChangePercent >= 0;

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <p className="text-xs text-[#737373] uppercase tracking-wide font-medium">Organization Spending</p>
          <p className="text-2xl font-bold text-[#0A0A0A] mt-1">{formatCurrency(metrics.orgSpendingCurrent)}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${isPositive ? "bg-[#F0FDF4] text-[#15803D]" : "bg-[#FEF2F2] text-[#DC2626]"}`}>
              {isPositive ? <Icons.TrendUp /> : <Icons.TrendDown />}
              {Math.abs(metrics.spendingChangePercent).toFixed(1)}%
            </div>
            <span className="text-xs text-[#A3A3A3]">vs previous period</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
            <span className="text-xs text-[#737373]">Ad spending</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={metrics.chartData} barSize={24} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F5F5F5" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#A3A3A3" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: string) => {
              const parts = v.split(" ");
              return parts[0] + " " + parts[1].replace(",", "");
            }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#A3A3A3" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `$${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F5F3FF", radius: 4 }} />
          <Bar dataKey="amount" fill="#7C3AED" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Recent Transactions mini table ───────────────────────────────────────────
const RECENT_TX = [
  { id: "813543566846", desc: "User wallet allocation", type: "Debit", amount: "$89.00", status: "Paid", source: "Organization Balance", date: "Feb 03, 2025 10:19 am" },
  { id: "155452106846", desc: "Bank Withdrawal", type: "Debit", amount: "$120.00", status: "Paid", source: "• • • 1090", date: "Feb 03, 2025 10:19 am" },
  { id: "155452106846", desc: "User wallet Withdrawal", type: "Credit", amount: "$90.00", status: "Failed", source: "Emmanuel Tchoffo", date: "Feb 03, 2025 10:19 am" },
  { id: "023184610683", desc: "User wallet Withdrawal", type: "Credit", amount: "$88.00", status: "Paid", source: "Raouf Mekou", date: "Feb 03, 2025 10:19 am" },
  { id: "155452106846", desc: "User wallet allocation", type: "Debit", amount: "$500.00", status: "Pending", source: "Organization Balance", date: "Feb 03, 2025 10:19 am" },
];

const STATUS_STYLES: Record<string, string> = {
  Paid: "bg-[#F0FDF4] text-[#15803D]",
  Failed: "bg-[#FEF2F2] text-[#DC2626]",
  Pending: "bg-[#FFFBEB] text-[#B45309]",
};

function RecentTransactions() {
  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#0A0A0A]">Recent transactions</h3>
        <button className="text-sm font-medium text-[#7C3AED] hover:text-[#6D28D9] transition-colors">View more</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E5E5E5]">
              {["Transaction ID", "Description", "Type", "Amount", "Status", "Source", "Date", ""].map((h) => (
                <th key={h} className="text-left py-2.5 px-3 text-xs font-medium text-[#737373] whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RECENT_TX.map((tx, i) => (
              <tr key={i} className="border-b border-[#F5F5F5] hover:bg-[#FAFAFA] transition-colors group">
                <td className="py-3 px-3 text-sm text-[#525252] font-mono">{tx.id}</td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[#A3A3A3]"><Icons.Doc size={12} /></span>
                    <span className="text-sm text-[#0A0A0A]">{tx.desc}</span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1">
                    {tx.type === "Debit"
                      ? <span className="text-[#16A34A]"><Icons.ArrowDown size={12} /></span>
                      : <span className="text-[#7C3AED]"><Icons.ArrowUp size={12} /></span>}
                    <span className={`text-sm font-medium ${tx.type === "Debit" ? "text-[#15803D]" : "text-[#7C3AED]"}`}>{tx.type}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-sm font-medium text-[#0A0A0A]">{tx.amount}</td>
                <td className="py-3 px-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[tx.status]}`}>
                    {tx.status === "Paid" && <Icons.Check size={9} />}
                    {tx.status === "Failed" && <Icons.X size={9} />}
                    {tx.status === "Pending" && <Icons.Clock size={9} />}
                    {tx.status}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-[#525252]">{tx.source}</span>
                  </div>
                </td>
                <td className="py-3 px-3 text-sm text-[#737373] whitespace-nowrap">{tx.date}</td>
                <td className="py-3 px-3">
                  <button className="text-[#A3A3A3] hover:text-[#0A0A0A] opacity-0 group-hover:opacity-100 transition-all">
                    <Icons.More size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Main Overview Tab ─────────────────────────────────────────────────────────
export default function OverviewTab({ metrics }: OverviewTabProps) {
  const [period, setPeriod] = useState<TimePeriod>("30D");

  return (
    <div>
{/* Time filter — conforme Figma (bouton actif : bg #F5F5F5, border gray/300) */}
<div className="flex justify-end mb-5">
  <div className="flex items-center rounded-lg border border-[#D5D7DA] bg-white overflow-hidden">
    {(["30D", "15D", "7D"] as TimePeriod[]).map((p) => (
      <button
        key={p}
        onClick={() => setPeriod(p)}
        className={`px-3 py-1.5 text-xs font-medium transition-colors ${
          period === p
            ? "bg-[#F5F5F5] text-[#0A0A0A]"
            : "text-[#737373] hover:text-[#525252]"
        }`}
      >
        {p}
      </button>
    ))}
  </div>
</div>

{/* Top row — 3 colonnes */}
<div className="grid grid-cols-3 gap-4 mb-5">
  {/* Balance card */}
  <BalanceCard
    balance={metrics.currentBalance}          // $2,405.50 — solde wallet_001
    pendingDeposit={metrics.pendingDeposit}   // $1,250 — deposit+pending 30j
    pendingWithdrawal={metrics.pendingWithdrawal} // $0 — withdrawal+pending 30j
  />

  {/* Stats — stacked */}
  <div className="flex flex-col gap-4">
    <StatCard
      label="Total allocated"
      value={formatCurrency(metrics.totalAllocated)}  // $10,342.50 — allocation+completed 30j
      subtitle="Last 30 days"
      icon={<Icons.Refresh size={14} />}
    />
    <StatCard
      label="Total spent"
      value={formatCurrency(metrics.totalSpent)}      // $29,342 — ad_spending+completed 30j
      subtitle="Last 30 days"
      icon={
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
        </svg>
      }
    />
  </div>

  {/* Allocate card */}
  <AllocateCard />
</div>
      {/* Chart + bottom stats row */}
 

      {/* Recent transactions */}
      <RecentTransactions />
    </div>
  );
}
