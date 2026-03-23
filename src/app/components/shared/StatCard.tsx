"use client";
import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  subtitle?: string;
  icon?: ReactNode;
  trend?: { value: number; isPositive: boolean };
  variant?: "default" | "dark";
}

export default function StatCard({ label, value, subtitle, icon, trend, variant = "default" }: StatCardProps) {
  const isDark = variant === "dark";
  return (
    <div className={`rounded-2xl p-5 flex flex-col justify-between h-full border ${isDark ? "bg-[#0A0A0A] border-[#262626]" : "bg-white border-[#E5E5E5]"}`}>
      <div className="flex items-start justify-between">
        <p className={`text-sm ${isDark ? "text-[#A3A3A3]" : "text-[#737373]"}`}>{label}</p>
        {icon && (
          <div className={`  rounded-lg border flex items-center justify-center ${isDark ? "border-[#262626] text-[#A3A3A3] bg-[#171717]" : "border-[#E5E5E5] text-[#737373] bg-white"}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className={`text-[24px] font-bold ${isDark ? "text-white" : "text-[#0A0A0A]"}`}>{value}</p>
        {subtitle && <p className={`text-xs mt-0.5 ${isDark ? "text-[#737373]" : "text-[#A3A3A3]"}`}>{subtitle}</p>}
        {trend && (
          <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${trend.isPositive ? "bg-[#F0FDF4] text-[#15803D]" : "bg-[#FEF2F2] text-[#DC2626]"}`}>
            {trend.isPositive ? (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            ) : (
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
            )}
            {Math.abs(trend.value).toFixed(1)}%
          </div>
        )}
      </div>
    </div>
  );
}
