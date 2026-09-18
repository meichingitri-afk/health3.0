import React, { useState } from 'react';
import { ClinicItem, ClinicOpenStatus } from '../types';
import { ClinicCard } from './ClinicCard';
import { Building2, Filter, AlertOctagon, Clock, RefreshCw } from 'lucide-react';

interface ClinicDirectoryProps {
  clinics: (ClinicItem & { openStatus?: ClinicOpenStatus })[];
  city: string;
  district: string;
  recommendedDepartments: { name: string; code: string }[];
  isEmergency: boolean;
  onRefresh?: () => void;
}

export const ClinicDirectory: React.FC<ClinicDirectoryProps> = ({
  clinics,
  city,
  district,
  recommendedDepartments,
  isEmergency,
  onRefresh
}) => {
  const [filterMode, setFilterMode] = useState<'ALL' | 'OPEN_ONLY' | 'EMERGENCY_ONLY'>(
    isEmergency ? 'EMERGENCY_ONLY' : 'ALL'
  );

  const filtered = clinics.filter((clinic) => {
    if (filterMode === 'EMERGENCY_ONLY') {
      return clinic.isEmergencyHospital;
    }
    if (filterMode === 'OPEN_ONLY') {
      return clinic.openStatus?.status === 'OPEN' || clinic.isEmergencyHospital;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Directory Header and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-rose-600" />
            <h3 className="font-bold text-slate-900 text-base">
              附近對應科別診所與即時營業清單
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            依據目前所在地（{city} {district}）與建議科別精確匹配開診時段
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
              filterMode === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            全部推薦 ({clinics.length})
          </button>

          <button
            onClick={() => setFilterMode('OPEN_ONLY')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
              filterMode === 'OPEN_ONLY'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>僅顯示營業中</span>
          </button>

          <button
            onClick={() => setFilterMode('EMERGENCY_ONLY')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
              filterMode === 'EMERGENCY_ONLY'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>24H 急診中心</span>
          </button>
        </div>
      </div>

      {/* Listing Cards */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((clinic) => (
            <ClinicCard key={clinic.id} clinic={clinic} />
          ))
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
            <Clock className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-bold text-slate-700 text-sm">
              此篩選條件下目前暫無開診中的基層診所
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              若感到身體劇烈不適，請切換至「24H 急診中心」或由附近大型綜合醫院急診室評估。
            </p>
            <button
              onClick={() => setFilterMode('EMERGENCY_ONLY')}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold"
            >
              <AlertOctagon className="w-4 h-4" />
              <span>檢視 24 小時急診醫院</span>
            </button>
          </div>
        )}
      </div>

      {/* Notice */}
      <div className="text-center text-[11px] text-slate-400 py-1">
        * 診所即時營業狀態係依各機構常態門診時段即時比對計算；逢國定假日或臨時異動，建議出發前先致電確認。
      </div>
    </div>
  );
};
