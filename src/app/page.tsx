"use client";
import { useState } from "react";
import { TabType } from "./types";
import { computeMetrics } from "./lib/dataService";
import data from "./lib/datas.json";
import { AppData } from "./types";
import Sidebar from "./components/shared/Sidebar";
import Topbar from "./components/shared/Topbar";
import OverviewTab from "./components/overview/OverviewTab";
import TransactionsTab from "./components/transactions/TransactionsTab";
import TeamWalletsTab from "./components/transactions/TeamWalletsTab";
import { Icons } from "./lib/icons";
import Image from "next/image";


const appData = data as AppData;
const metrics = computeMetrics(appData);

export default function OrganizationBalance() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
    const isTransactions = activeTab === "transactions";


  const tabs: { id: TabType; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "transactions", label: "Transactions" },
    { id: "teamwallets", label: "Team wallets" },
  ];

  return (
    <div className="flex h-screen  overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col overflow-hidden ">
        <main className="flex-1 overflow-y-auto   bg-white mt-3 rounded-2xl">
          {/* Page header */}
          <header className=" my-3 flex items-center justify-between px-[26px] border-[#E5E5E5] bg-white flex-shrink-0">
                <div className="mb-5 flex items-center">
                      <h1 className="text-[24px] font-meduim font-semibold text-[#0A0A0A]">Organization Balance</h1>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                  {/* Balance display */}
                  <div className="flex items-center gap-[10px] px-4 py-3 rounded-[28px] border border-[#E5E5E5] bg-[#FAFAFA]">
                    <div className="gap-2 flex items-center">
                        <span className="text-[#2F54D8]"><Image
                                    src="/wallet.png"
                                    alt="Home"
                                    width={20}
                                    height={20}
                                    className="object-contain"
                                  /></span>
                    <span className="text-sm font-medium text-[#0A0A0A]">$0.00</span>
                    </div>
                  
                    <div className="gap-[10px] flex items-center">
                       <button className="text-[#A3A3A3] hover:text-[#0A0A0A] ml-1 transition-colors">
                      <Image
                                    src="/hide.png"
                                    alt="Home"
                                    width={20}
                                    height={20}
                                    className="object-contain"
                                  />
                      </button>
                                      {/* CTA button - changes based on tab */}
                      {isTransactions ? (
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7C3AED] text-white text-sm font-medium hover:bg-[#6D28D9] transition-colors">
                          Allocate Funds
                        </button>
                      ) : (
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1745E8] border-[#F2F4FF59] text-white text-sm font-medium hover:bg-[#6D28D9] transition-colors">
                          Top-Up
                        </button>
                      )}
                    </div>
                   
                  </div>
          

                  <div className="flex items-center gap-[6px] px-2 border-dashed border border-[#27272A] rounded-[28px] py-1">
                    <button className="flex items-center gap-1.5 text-sm text-[#525252] hover:text-[#0A0A0A] transition-colors">
                      <Image
                                    src="/help.png"
                                    alt="Home"
                                    width={20}
                                    height={20}
                                    className="object-contain"
                                  />
                    </button>
                   <span>Help</span>
                  </div>

                  <Image
                                    src="/notif.png"
                                    alt="Home"
                                    width={20}
                                    height={20}
                                    className="object-contain mx-2"
                                  />

                  <div className="flex items-center">
                    <button className="flex items-center gap-2 px-2">
                      <div className="flex items-center justify-center">
                        <Image
                                    src="/img/Image.png"
                                    alt="Home"
                                    width={24}
                                    height={24}
                                    className="rounded-2xl"
                                  />
                      </div>
                      <span className="text-sm font-medium text-[#0A0A0A]">Simon Alt</span>
                      <Image
                                    src="/icon.png"
                                    alt="Home"
                                    width={16}
                                    height={16}
                                    className="object-contain  "
                                  />
                    </button>
                  </div>
                  
                  </div>
                    
                  </div>
          </header>
          <div className="px-6 pb-4">
                      <p className="text-sm text-[#737373] mt-0.5">Manage your organization funds here.</p>
          </div>

{/* Tabs nav — underline style conforme Figma */}
<div className="flex items-center justify-between border-b border-[#E5E5E5] px-5 mb-6">
  <div className="flex items-center gap-0">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`relative px-2 py-4 text-sm font-medium transition-colors mr-4 last:mr-0 ${
          activeTab === tab.id
            ? "text-[#0A0A0A]"
            : "text-[#737373] hover:text-[#525252]"
        }`}
      >
        {tab.label}
        {activeTab === tab.id && (
          <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0A0A0A]" />
        )}
      </button>
    ))}
  </div>
</div>

          {/* Tab content */}
          <div className="px-5">
            {activeTab === "overview" && <OverviewTab metrics={metrics} />}
            {activeTab === "transactions" && (
              <TransactionsTab transactions={appData.transactions} />
            )}
            {activeTab === "teamwallets" && <TeamWalletsTab />}
          </div>
        
        </main>
      </div>

      {/* Floating support chat */}
      <button
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#0A0A0A] flex items-center justify-center shadow-lg hover:bg-[#171717] transition-colors z-40"
        aria-label="Support chat"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    </div>
  );
}
