"use client";
import { useState, useRef, useEffect } from "react";
import { Icons } from "@/app/lib/icons";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TeamMember {
  id: string;
  name: string;
  email: string;
  balance: number;
  visible: boolean;
  avatarUrl?: string;
  initials: string;
  color: string;
}

// ─── Mock data from JSON teams + accounts ─────────────────────────────────────
const TEAM_MEMBERS: TeamMember[] = [
  { id: "m1", name: "Richard Karlson", email: "richar.karlson@adxens.com", balance: 5500.50, visible: true, initials: "RK", color: "#60A5FA" },
  { id: "m2", name: "Richard Karlson", email: "richar.karlson@adxens.com", balance: 5500.50, visible: true, initials: "RK", color: "#F472B6" },
  { id: "m3", name: "Richard Karlson", email: "richar.karlson@adxens.com", balance: 5500.50, visible: true, initials: "RK", color: "#34D399" },
  { id: "m4", name: "Richard Karlson", email: "richar.karlson@adxens.com", balance: 5500.50, visible: true, initials: "RK", color: "#FBBF24" },
  { id: "m5", name: "Richard Karlson", email: "richar.karlson@adxens.com", balance: 5500.50, visible: true, initials: "RK", color: "#A78BFA" },
  { id: "m6", name: "Richard Karlson", email: "richar.karlson@adxens.com", balance: 5500.50, visible: true, initials: "RK", color: "#FB923C" },
  { id: "m7", name: "Richard Karlson", email: "richar.karlson@adxens.com", balance: 5500.50, visible: true, initials: "RK", color: "#60A5FA" },
  { id: "m8", name: "Richard Karlson", email: "richar.karlson@adxens.com", balance: 5500.50, visible: true, initials: "RK", color: "#F472B6" },
];

// ─── Dropdown per card ────────────────────────────────────────────────────────
function CardDropdown({ onClose, onAllocate, onDeallocate }: {
  onClose: () => void;
  onAllocate: () => void;
  onDeallocate: () => void;
}) {
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
      style={{ boxShadow: "0px 8px 24px rgba(0,0,0,0.08)" }}
    >
      <button
        onClick={() => { onAllocate(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#0A0A0A] hover:bg-[#FAFAFA] transition-colors text-left"
      >
        <span className="w-4 h-4 rounded-full border-2 border-[#0A0A0A] flex-shrink-0" />
        Allocate funds
      </button>
      <button
        onClick={() => { onDeallocate(); onClose(); }}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-[#0A0A0A] hover:bg-[#FAFAFA] transition-colors text-left"
      >
        <span className="w-4 h-4 rounded-full border-2 border-[#0A0A0A] flex-shrink-0" />
        Disallocate funds
      </button>
    </div>
  );
}

// ─── Individual Wallet Card ────────────────────────────────────────────────────
function UserWalletCard({
  member,
  balanceVisible,
  onToggleBalance,
}: {
  member: TeamMember;
  balanceVisible: boolean;
  onToggleBalance: (id: string) => void;
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border border-[#F5F5F5] rounded-xl hover:border-[#E5E5E5] hover:shadow-sm transition-all group">
      {/* Left: avatar + info */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div
          className="w-[47px] h-[47px] rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm"
          style={{ backgroundColor: member.color }}
        >
          {member.initials}
        </div>

        {/* Name + email */}
        <div>
          <p className="text-sm font-medium text-[#0A0A0A] leading-tight">{member.name}</p>
          <p className="text-xs text-[#737373] mt-0.5">{member.email}</p>
        </div>
      </div>

      {/* Right: balance + actions */}
      <div className="flex items-center gap-2">
        {/* Balance */}
        <span className="text-sm font-medium text-[#0A0A0A]">
          {balanceVisible
            ? `$${member.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
            : "••••••"}
        </span>

        {/* Toggle visibility */}
        <button
          onClick={() => onToggleBalance(member.id)}
          className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[#F5F5F5] text-[#A3A3A3] hover:text-[#0A0A0A] transition-colors"
        >
          {balanceVisible ? <Icons.EyeOff size={13} /> : <Icons.Eye size={13} />}
        </button>

        {/* Three dots menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-[#F5F5F5] text-[#A3A3A3] hover:text-[#0A0A0A] transition-colors"
          >
            <Icons.More size={14} />
          </button>

          {dropdownOpen && (
            <CardDropdown
              onClose={() => setDropdownOpen(false)}
              onAllocate={() => console.log("Allocate", member.id)}
              onDeallocate={() => console.log("Deallocate", member.id)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Team Wallets Tab ─────────────────────────────────────────────────────
export default function TeamWalletsTab() {
  const [search, setSearch] = useState("");
  const [allVisible, setAllVisible] = useState(true);
  const [visibilityMap, setVisibilityMap] = useState<Record<string, boolean>>(
    Object.fromEntries(TEAM_MEMBERS.map((m) => [m.id, true]))
  );

  // Toggle individual balance visibility
  const handleToggleBalance = (id: string) => {
    setVisibilityMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Hide/Show all balances
  const handleToggleAll = () => {
    const next = !allVisible;
    setAllVisible(next);
    setVisibilityMap(Object.fromEntries(TEAM_MEMBERS.map((m) => [m.id, next])));
  };

  // Filter by search
  const filtered = TEAM_MEMBERS.filter(
    (m) =>
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Sub-header: search + hide all */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white w-64">
          <span className="text-[#A3A3A3]">
            <Icons.Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm text-[#0A0A0A] bg-transparent outline-none placeholder:text-[#A3A3A3]"
          />
        </div>

        {/* Hide all / Show all button */}
        <button
          onClick={handleToggleAll}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white text-sm font-medium text-[#0A0A0A] hover:bg-[#FAFAFA] hover:border-[#D4D4D4] transition-all"
        >
          {allVisible ? (
            <>
              <Icons.EyeOff size={14} />
              Hide all
            </>
          ) : (
            <>
              <Icons.Eye size={14} />
              Show all
            </>
          )}
        </button>
      </div>

      {/* 2-column grid of wallet cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-sm text-[#A3A3A3]">
          No team members found
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((member) => (
            <UserWalletCard
              key={member.id}
              member={member}
              balanceVisible={visibilityMap[member.id] ?? true}
              onToggleBalance={handleToggleBalance}
            />
          ))}
        </div>
      )}
    </div>
  );
}
