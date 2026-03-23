"use client";
import { useState } from "react";
import { Icons } from "@/app/lib/icons";
import Image from "next/image";
import { TabType } from "@/app/types";

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [walletsOpen, setWalletsOpen] = useState(true);

  return (
    <aside className="w-[237px] h-[68px] h-screen border-r border-[#E5E5E5] flex flex-col flex-shrink-0 cursor-pointer bg-[#FAFAFA]">
      {/* Logo */}
           {/* ── Userbar (Logo block) — 236×68px, padding 22px top/bottom, 12px left/right ── */}
      <div
        className="flex-shrink-0 flex items-center justify-between cursor-pointer"
        style={{
          height: "68px",
          padding: "22px 12px",
          borderBottom: "1px solid rgba(39,39,42,0.10)",
          gap: "12px",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 relative">
            <Image
              src="/sortui-logo.png"
              alt="SortUI"
              width={24}
              height={24}
              className="object-contain rounded-md"
            />
          </div>
          {/* "SortUI" text — Inter sm/Medium, width 144px */}
          <span
            className="text-sm font-medium text-zinc-900 truncate"
            style={{ width: "144px" }}
          >
            SortUI
          </span>
        </div>

        {/* Tail icon — 20×20px from Figma */}
        <button className="flex-shrink-0 text-zinc-400 hover:text-zinc-600 transition-colors">
          <Image
              src="/icon.png"
              alt="TailIcon"
              width={16}
              height={16}
              className="object-contain"
            />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-4">
        <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-[#27272A0F] border border-[#E5E5E5]">
          <input
            type="text"
            placeholder="Search"
            className="flex-1 text-xs text-[#A3A3A3] bg-transparent outline-none placeholder:text-[#A3A3A3]"
          />          
          <Image
              src="/badge.png"
              alt="Badge"
              width={20}
              height={20}
              className="object-contain"
            />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-1 pb-4 overflow-y-auto ">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2 px-2 py-2 rounded-md text-sm font-medium text-[#525252] hover:bg-[#F5F5F5] hover:text-[#0A0A0A] transition-colors cursor-pointer">
            <Image
              src="/home.png"
              alt="Home"
              width={20}
              height={20}
              className="object-contain"
            />
            <span>Home</span>
          </div>

          <div className="flex items-center justify-between py-2 rounded-md text-sm font-medium text-[#525252] hover:bg-[#F5F5F5] hover:text-[#0A0A0A] transition-colors cursor-pointer">
            
            <div className="flex items-center px-2 gap-2">
              <Image
                src="/account.png"
                alt="Home"
                width={20}
                height={20}
                className="object-contain"
              />
              <span>Ad account</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center text-[12px] font-semibold bg-[#2F54D8] text-[#FFFFFF] rounded-full px-1.5 py-0.5 min-w-[20px] h-[20px] text-center">2</span>
              <Icons.ChevronUp size={16} />
            </div>
          
          </div>

          {/* Wallets */}
          <div>
            <button
              onClick={() => setWalletsOpen(!walletsOpen)}
              className="w-full flex items-center justify-between pl-2 py-2 rounded-md text-sm font-medium text-[#7C3AED] bg-[#F5F3FF] transition-colors"
            >
              <div className="flex items-center gap-2">
              <Image
                src="/wallet.png"
                alt="Home"
                width={20}
                height={20}
                className="object-contain"
              />
              <span>Wallets</span>
              </div>
              <div className="text-[#2F54D8]">
              <Icons.ChevronDown size={16}  />
              </div>
            </button>

            {walletsOpen && (
              <div className="mt-0.5 pl-5 border-l border-[#E5E5E5] space-y-0.5">
                <button
                  onClick={() => onTabChange("overview")}
                  className={`w-full flex items-center justify-between pl-2 py-2 rounded-md text-left transition-colors ${
                    activeTab === "overview" || activeTab === "transactions"
                      ? "bg-[#F5F3FF] text-[#7C3AED]"
                      : "hover:bg-[#F5F5F5] text-[#525252]"
                  }`}
                >
                  <span className="text-sm font-medium">Organization Balance</span>
                  <Icons.ChevronRight size={16} />
                </button>
                <div className="px-2 py-1.5 rounded-md cursor-pointer hover:bg-[#F5F5F5]">
                  <span className="text-sm font-medium text-[#525252]">Personal Balance</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 px-2 py-2 rounded-md text-sm font-medium text-[#525252] hover:bg-[#F5F5F5] hover:text-[#0A0A0A] transition-colors cursor-pointer">
              <Image
                src="/users.png"
                alt="Home"
                width={20}
                height={20}
                className="object-contain"
              />
              <span>Teams</span>
          </div>
          <div className="flex items-center gap-2 px-2 py-2 rounded-md text-sm font-medium text-[#525252] hover:bg-[#F5F5F5] hover:text-[#0A0A0A] transition-colors cursor-pointer">
              <Image
                src="/settings.png"
                alt="Home"
                width={20}
                height={20}
                className="object-contain"
              />
              <span>Affiliate program</span>
          </div>
        </div>
      </nav>

      {/* Upgrade banner */}
      <div className="mx-3 mb-3 p-3 rounded-xl border border-[#E5E5E5] bg-[#FAFAFA]">
        <p className="text-sm text-[#525252] leading-relaxed">
          You&apos;re currently on the{" "}
          <span className="font-semibold text-[#0A0A0A]">Starter plan.</span>{" "}
          Upgrade to access lower fees, advanced features.
        </p>
        <button className="mt-2.5 w-full py-1.5 px-3 rounded-lg border border-[#27272A26] text-xs font-medium text-[#0A0A0A] hover:bg-[#F5F5F5] transition-colors">
          Upgrade
        </button>
      </div>

      {/* Settings */}
      <div className="px-3 pb-4">
        <div className="flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-[#525252] hover:bg-[#F5F5F5] hover:text-[#0A0A0A] transition-colors cursor-pointer">
          <div className="flex items-center gap-2">
            <Image
                src="/set.png"
                alt="Home"
                width={20}
                height={20}
                className="object-contain cursor-pointer"
            />
            <span>Settings</span>
          </div>
          
          <span className="w-[18px] h-5 rounded-full bg-[#F8B12D] flex items-center justify-center">
            <span className="text-[12px] text-white font-bold">1</span>
          </span>
        </div>
      </div>
    </aside>
  );
}
