"use client";
import { Icons } from "@/app/lib/icons";
import { TabType } from "@/app/types";

interface TopbarProps {
  activeTab: TabType;
}

export default function Topbar({ activeTab }: TopbarProps) {
  const isTransactions = activeTab === "transactions";

  return (
    <header className="h-[56px] flex items-center justify-between px-6 border-b border-[#E5E5E5] bg-white flex-shrink-0">
      <div />
      <div className="mb-5">
            <h1 className="text-xl font-semibold text-[#0A0A0A]">Organization Balance</h1>
            <p className="text-sm text-[#737373] mt-0.5">Manage your organization funds here.</p>
          </div>
      <div className="flex items-center gap-3">
        {/* Balance display */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E5E5E5] bg-[#FAFAFA]">
          <span className="text-[#525252]"><Icons.Wallet size={14} /></span>
          <span className="text-sm font-medium text-[#0A0A0A]">$0.00</span>
          <button className="text-[#A3A3A3] hover:text-[#0A0A0A] ml-1 transition-colors">
            <Icons.EyeOff size={14} />
          </button>
        </div>

        {/* CTA button - changes based on tab */}
        {isTransactions ? (
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7C3AED] text-white text-sm font-medium hover:bg-[#6D28D9] transition-colors">
            Allocate Funds
          </button>
        ) : (
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7C3AED] text-white text-sm font-medium hover:bg-[#6D28D9] transition-colors">
            <Icons.Plus size={14} />
            Top-Up
          </button>
        )}

        <div className="w-px h-5 bg-[#E5E5E5]" />

        <button className="flex items-center gap-1.5 text-sm text-[#525252] hover:text-[#0A0A0A] transition-colors">
          <Icons.Help /><span>Help</span>
        </button>
        <button className="text-[#A3A3A3] hover:text-[#0A0A0A] transition-colors">
          <Icons.Bell />
        </button>
        <div className="w-px h-5 bg-[#E5E5E5]" />
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center">
            <span className="text-[10px] text-white font-semibold">SA</span>
          </div>
          <span className="text-sm font-medium text-[#0A0A0A]">Simon Alt</span>
          <Icons.ChevronDown size={12} />
        </button>
      </div>
    </header>
  );
}
