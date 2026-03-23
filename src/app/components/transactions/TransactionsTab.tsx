"use client";
import { useState, useRef, useEffect } from "react";
import { Transaction, TransactionFilters } from "@/app/types";
import { formatCurrency } from "@/app/lib/dataService";
import { Icons } from "@/app/lib/icons";

interface TransactionsTabProps {
  transactions: Transaction[];
}

// ─── Status badge ──────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  completed: { label: "Paid", className: "bg-[#F0FDF4] text-[#15803D]", icon: <Icons.Check size={9} /> },
  failed:    { label: "Failed", className: "bg-[#FEF2F2] text-[#DC2626]", icon: <Icons.X size={9} /> },
  pending:   { label: "Pending", className: "bg-[#FFFBEB] text-[#B45309]", icon: <Icons.Clock size={9} /> },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}>
      {cfg.icon}{cfg.label}
    </span>
  );
}

// ─── Type badge ────────────────────────────────────────────────────────────────
const CATEGORY_TYPE: Record<string, { label: string; dir: "up" | "down" }> = {
  ad_spending: { label: "Debit", dir: "down" },
  deposit:     { label: "Credit", dir: "up" },
  allocation:  { label: "Debit", dir: "down" },
  withdrawal:  { label: "Debit", dir: "down" },
  fees:        { label: "Debit", dir: "down" },
};

function TypeBadge({ category }: { category: string }) {
  const cfg = CATEGORY_TYPE[category] ?? { label: "Debit", dir: "down" };
  const isCredit = cfg.dir === "up";
  return (
    <div className="flex items-center gap-1">
      <span className={isCredit ? "text-[#7C3AED]" : "text-[#16A34A]"}>
        {isCredit ? <Icons.ArrowUp size={12} /> : <Icons.ArrowDown size={12} />}
      </span>
      <span className={`text-sm font-medium ${isCredit ? "text-[#7C3AED]" : "text-[#15803D]"}`}>
        {cfg.label}
      </span>
    </div>
  );
}

// ─── Row dropdown menu ─────────────────────────────────────────────────────────
function RowDropdown({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-8 z-50 w-[180px] bg-white border border-[#E5E5E5] rounded-xl shadow-lg py-1 overflow-hidden"
    >
      {[
        { icon: <Icons.Eye size={14} />, label: "View details" },
        { icon: <Icons.Repeat size={14} />, label: "Repeat transaction" },
        { icon: <Icons.Download size={14} />, label: "Download receipt" },
      ].map((item) => (
        <button
          key={item.label}
          onClick={onClose}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#0A0A0A] hover:bg-[#FAFAFA] transition-colors"
        >
          <span className="text-[#737373]">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  );
}

// ─── Filter chip ───────────────────────────────────────────────────────────────
function FilterChip({
  label,
  value,
  onRemove,
  highlighted,
}: {
  label: string;
  value?: string;
  onRemove?: () => void;
  highlighted?: boolean;
}) {
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
      highlighted
        ? "bg-[#DBEAFE] text-[#1D4ED8] border-[#93C5FD]"
        : "bg-white text-[#0A0A0A] border-[#E5E5E5] hover:border-[#D4D4D4]"
    }`}>
      {onRemove && (
        <button onClick={onRemove} className="hover:opacity-70 transition-opacity">
          <Icons.X size={9} />
        </button>
      )}
      <span>{label}{value ? `: ${value}` : ""}</span>
    </div>
  );
}

// ─── Source icon ───────────────────────────────────────────────────────────────
function SourceIcon({ accountId }: { accountId: string }) {
  if (accountId === "wallet_001" || accountId === "org_fees") return <span className="text-[#737373]"><Icons.Building size={13} /></span>;
  if (accountId.startsWith("team_")) return <span className="text-[#737373]"><Icons.Team /></span>;
  return <span className="text-[#737373]"><Icons.User size={13} /></span>;
}

function getSourceName(accountId: string): string {
  const map: Record<string, string> = {
    "wallet_001": "Organization Balance",
    "ad_account_001": "Google Ads",
    "ad_account_002": "Meta Ads",
    "ad_account_003": "TikTok Ads",
    "team_wallet_001": "Équipe Marketing",
    "team_wallet_002": "Équipe Produit",
    "org_fees": "Platform fees",
  };
  return map[accountId] ?? accountId;
}

// ─── Main Transactions Tab ─────────────────────────────────────────────────────
export default function TransactionsTab({ transactions }: TransactionsTabProps) {
  const [filters, setFilters] = useState<TransactionFilters>({
    dateLabel: "Last 30 days",
    type: "all",
    source: "all",
    search: "",
    page: 1,
    pageSize: 10,
  });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Filter logic
  const filtered = transactions.filter((tx) => {
    const matchType = filters.type === "all" || tx.category === filters.type;
    const matchSource = filters.source === "all" || tx.accountId === filters.source;
    const matchSearch =
      !filters.search ||
      tx.id.includes(filters.search) ||
      tx.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      getSourceName(tx.accountId).toLowerCase().includes(filters.search.toLowerCase());
    return matchType && matchSource && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / filters.pageSize);
  const paginated = filtered.slice(
    (filters.page - 1) * filters.pageSize,
    filters.page * filters.pageSize
  );

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true,
    });

  return (
    <div className="bg-white rounded-2xl border border-[#E5E5E5]">
      {/* Filters bar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F5F5F5]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-[#737373]">Filters</span>

          <FilterChip
            label="Date"
            onRemove={() => {}}
          />
          <FilterChip
            label="Last 30 days"
            highlighted
            onRemove={() => {}}
          />

          {/* Type dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-[#E5E5E5] bg-white text-[#525252] hover:border-[#D4D4D4] transition-colors"
            >
              <Icons.Filter size={11} />
              Type
              <Icons.ChevronDown size={10} />
            </button>
          </div>

          {/* Sources dropdown */}
          <div className="relative">
            <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-[#E5E5E5] bg-white text-[#525252] hover:border-[#D4D4D4] transition-colors">
              <Icons.Filter size={11} />
              Sources
              <Icons.ChevronDown size={10} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA] w-52">
            <span className="text-[#A3A3A3]"><Icons.Search size={13} /></span>
            <input
              type="text"
              placeholder="Search by source or ID"
              value={filters.search}
              onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
              className="flex-1 text-xs text-[#0A0A0A] bg-transparent outline-none placeholder:text-[#A3A3A3]"
            />
          </div>
          <span className="text-xs text-[#737373] whitespace-nowrap font-medium">
            {String(filtered.length).padStart(2, "0")} transactions
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#F5F5F5]">
              {["Transaction ID", "Description", "Type", "Amount", "Status", "Source", "Date", ""].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-xs font-medium text-[#737373] whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-sm text-[#A3A3A3]">
                  No transactions found
                </td>
              </tr>
            ) : (
              paginated.map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-[#F5F5F5] hover:bg-[#FAFAFA] transition-colors group relative"
                >
                  <td className="py-3 px-4 text-sm text-[#525252] font-mono">{tx.id}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[#A3A3A3]"><Icons.Doc size={12} /></span>
                      <span className="text-sm text-[#0A0A0A]">{tx.description}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4"><TypeBadge category={tx.category} /></td>
                  <td className="py-3 px-4 text-sm font-medium text-[#0A0A0A]">
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="py-3 px-4"><StatusBadge status={tx.status} /></td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <SourceIcon accountId={tx.accountId} />
                      <span className="text-sm text-[#525252]">{getSourceName(tx.accountId)}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-[#737373] whitespace-nowrap">
                    {formatDate(tx.date)}
                  </td>
                  <td className="py-3 px-4 relative">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === tx.id ? null : tx.id)}
                      className="text-[#A3A3A3] hover:text-[#0A0A0A] transition-colors"
                    >
                      <Icons.More size={14} />
                    </button>
                    {openDropdown === tx.id && (
                      <RowDropdown onClose={() => setOpenDropdown(null)} />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#F5F5F5]">
        <div className="flex items-center gap-2">
          <button
            disabled={filters.page <= 1}
            onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
            className="px-3 py-1.5 rounded-lg border border-[#E5E5E5] text-xs font-medium text-[#525252] hover:bg-[#FAFAFA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Prev
          </button>
          <button
            disabled={filters.page >= totalPages}
            onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
            className="px-3 py-1.5 rounded-lg border border-[#E5E5E5] text-xs font-medium text-[#525252] hover:bg-[#FAFAFA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
          <span className="text-xs text-[#737373]">
            Page {filters.page} of {Math.max(totalPages, 1)}
          </span>
        </div>

        {/* Page size selector */}
        <div className="flex items-center gap-1.5">
          {([10, 20, 30, 50] as const).map((size) => (
            <button
              key={size}
              onClick={() => setFilters((f) => ({ ...f, pageSize: size, page: 1 }))}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                filters.pageSize === size
                  ? "bg-[#0A0A0A] text-white"
                  : "border border-[#E5E5E5] text-[#525252] hover:bg-[#F5F5F5]"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
