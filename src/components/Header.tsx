import React from 'react';
import { PhoneCall, MapPin, RefreshCw, ShieldAlert, HeartPulse } from 'lucide-react';
import { UserContext } from '../types';

interface HeaderProps {
  userContext: UserContext;
  onOpenLocationPicker: () => void;
  onReset: () => void;
  hasRedFlag?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  userContext,
  onOpenLocationPicker,
  onReset,
  hasRedFlag
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Left: Brand */}
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={onReset} id="brand-logo-btn">
          <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-sm shadow-rose-200">
            <HeartPulse className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                健康急救章
              </h1>
              <span className="text-[11px] font-semibold uppercase px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                AI 導診
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal">
              醫療導引與即時診所助手
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Location button */}
          <button
            id="header-location-btn"
            onClick={onOpenLocationPicker}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            title="變更搜尋所在位置"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
            <span className="truncate max-w-[120px] sm:max-w-none">
              {userContext.city} {userContext.district}
            </span>
          </button>

          {/* Emergency 119 direct action */}
          <a
            id="emergency-119-top-btn"
            href="tel:119"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
              hasRedFlag
                ? 'bg-rose-600 text-white hover:bg-rose-700 ring-2 ring-rose-300 animate-bounce'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
            title="緊急危急情況請立即撥打 119"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>撥打 119</span>
          </a>

          {/* Reset */}
          <button
            id="header-reset-btn"
            onClick={onReset}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="重新諮詢"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
