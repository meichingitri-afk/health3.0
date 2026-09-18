import React, { useState } from 'react';
import { 
  TriageReportData, 
  UserContext, 
  ClinicItem, 
  ClinicOpenStatus 
} from '../types';
import { RadarMatchChart } from './RadarMatchChart';
import { ClinicDirectory } from './ClinicDirectory';
import { 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Stethoscope, 
  ShieldCheck, 
  FileText, 
  HeartPulse, 
  ArrowLeft, 
  PhoneCall, 
  Share2, 
  Printer, 
  Check, 
  Activity,
  ClipboardList,
  Sparkles
} from 'lucide-react';

interface TriageReportProps {
  report: TriageReportData;
  userContext: UserContext;
  clinics: (ClinicItem & { openStatus?: ClinicOpenStatus })[];
  onBackToChat: () => void;
  onRefreshClinics?: () => void;
}

export const TriageReport: React.FC<TriageReportProps> = ({
  report,
  userContext,
  clinics,
  onBackToChat,
  onRefreshClinics
}) => {
  const [copiedSummary, setCopiedSummary] = useState(false);

  const isEmergency = report.urgency === 'EMERGENCY';
  const isUrgentToday = report.urgency === 'URGENT_TODAY';

  const handleShareOrCopy = () => {
    const textToCopy = `【健康急救章】就醫導引報告
急迫性判定：${report.urgencyTitle}
建議掛號科別：${report.departments.map(d => `${d.name}(匹配度${d.matchScore}%)`).join('、')}
風險提醒：${report.riskFactors.join('；')}
所在區域：${userContext.city} ${userContext.district}
查詢時間：${new Date().toLocaleString('zh-TW')}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-fade-in print:p-0">
      {/* Top Breadcrumb / Action Bar */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-200 print:hidden">
        <button
          id="back-to-consultation-btn"
          onClick={onBackToChat}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>返回症狀對話</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareOrCopy}
            className="flex items-center gap-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-xl transition-colors"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedSummary ? '已複製摘要' : '複製就醫摘要'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-xl transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>列印報告</span>
          </button>
        </div>
      </div>

      {/* Emergency Alert Guidance Card (if Red Flag) */}
      {isEmergency && report.emergencyGuide && (
        <div 
          id="emergency-urgent-card"
          className="bg-red-600 text-white rounded-3xl p-6 shadow-lg border-2 border-red-700 space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-white/20 rounded-2xl">
                <AlertOctagon className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider bg-white text-red-700 px-2 py-0.5 rounded">
                  最優先急診警示
                </span>
                <h2 className="text-xl font-black mt-0.5">
                  {report.emergencyGuide.title}
                </h2>
              </div>
            </div>

            <a
              href="tel:119"
              className="hidden sm:flex items-center gap-2 bg-white text-red-700 hover:bg-red-50 font-black text-sm px-5 py-2.5 rounded-2xl shadow-md transition-all active:scale-95 shrink-0"
            >
              <PhoneCall className="w-4 h-4 text-red-600" />
              <span>撥打 119 求救</span>
            </a>
          </div>

          <p className="text-sm text-red-100 leading-relaxed font-medium bg-red-700/60 p-3.5 rounded-2xl">
            ⚠️ {report.emergencyGuide.warning}
          </p>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-red-200 uppercase tracking-wider">
              緊急應變建議步驟：
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {report.emergencyGuide.actionSteps.map((step, idx) => (
                <div key={idx} className="bg-red-700/40 p-3 rounded-xl text-xs text-white leading-relaxed flex items-start gap-2 border border-red-500/40">
                  <span className="font-bold text-red-300 shrink-0">{idx + 1}.</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile phone dial */}
          <a
            href="tel:119"
            className="sm:hidden flex items-center justify-center gap-2 w-full bg-white text-red-700 font-black text-sm py-3 rounded-2xl shadow-md"
          >
            <PhoneCall className="w-4 h-4 text-red-600" />
            <span>立即撥打 119 救護車</span>
          </a>
        </div>
      )}

      {/* 1. Urgency Level Badge & Summary Banner */}
      <div
        className={`rounded-3xl p-6 border transition-all ${
          isEmergency
            ? 'bg-rose-50/70 border-rose-300'
            : isUrgentToday
            ? 'bg-amber-50/80 border-amber-300'
            : 'bg-emerald-50/80 border-emerald-300'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                  isEmergency
                    ? 'bg-red-600 text-white shadow-xs'
                    : isUrgentToday
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-emerald-600 text-white shadow-xs'
                }`}
              >
                {isEmergency ? (
                  <AlertOctagon className="w-3.5 h-3.5" />
                ) : isUrgentToday ? (
                  <AlertTriangle className="w-3.5 h-3.5" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                <span>就醫急迫性評估結果</span>
              </span>
              <span className="text-xs text-slate-500">
                目標搜尋：{userContext.city} {userContext.district}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {report.urgencyTitle}
            </h3>
            <p className="text-sm text-slate-700 max-w-2xl leading-relaxed">
              {report.urgencyDescription}
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2 bg-white px-4 py-3 rounded-2xl border border-slate-200/80 shadow-2xs">
            <Activity className="w-5 h-5 text-rose-600" />
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">分診狀態</div>
              <div className="text-xs font-bold text-slate-800">
                {isEmergency ? '急診高急迫性' : isUrgentToday ? '建議今日看診' : '一般門診預約'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Recommended Departments (1-2 Departments) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-rose-600" />
            <span>建議掛號科別與契合度</span>
          </h4>
          <span className="text-xs text-slate-500">
            綜合主訴與症狀分析判定
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {report.departments.map((dept, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    推薦順位 #{idx + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-500">匹配度</span>
                    <span className="text-sm font-black text-rose-600">
                      {dept.matchScore}%
                    </span>
                  </div>
                </div>

                <h5 className="font-bold text-slate-900 text-lg">
                  {dept.name}
                </h5>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {dept.reason}
                </p>
              </div>

              {/* Progress visual bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-600 rounded-full"
                  style={{ width: `${dept.matchScore}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Visual Radar & Analytics Chart */}
      <RadarMatchChart metrics={report.radarScores} />

      {/* 4. Risk Factors & Preliminary Examination & Home Care */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Risk Factor Analysis */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h4 className="font-bold text-slate-900 text-sm">
              就醫提醒與危險因子解析
            </h4>
          </div>
          <ul className="space-y-2">
            {report.riskFactors.map((risk, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Preliminary Doctor Checks */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ClipboardList className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-slate-900 text-sm">
              該科別醫師通常會進行的初步檢查
            </h4>
          </div>
          <ul className="space-y-2">
            {report.preliminaryDoctorChecks.map((chk, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>{chk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Home Care Guidance */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-2.5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h4 className="font-bold text-slate-900 text-sm">
            居家照護與就醫前注意事項
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
          {report.homeCareTips.map((tip, i) => (
            <div key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-200/60">
              <span className="text-emerald-600 font-bold shrink-0">✓</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Clinic Directory & Live Open Status */}
      <ClinicDirectory
        clinics={clinics}
        city={userContext.city}
        district={userContext.district}
        recommendedDepartments={report.departments}
        isEmergency={isEmergency}
        onRefresh={onRefreshClinics}
      />

      {/* Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-100 text-slate-500 text-[11px] leading-relaxed text-center space-y-1">
        <p className="font-medium text-slate-600">
          【免責聲明】本系統為 AI 輔助分診資訊工具，非醫師正式診斷，亦無法取代實體醫療諮詢。
        </p>
        <p>
          若您或身旁親友出現無法忍受之劇烈疼痛、胸口壓迫、呼吸短促、劇烈抽搐、大量出血或神智混亂等緊急危象，請即刻撥打 119 或至鄰近醫院急診室求診。
        </p>
      </div>
    </div>
  );
};
