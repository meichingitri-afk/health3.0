import React from 'react';
import { AlertOctagon, PhoneCall, ShieldAlert, ArrowRight } from 'lucide-react';

interface EmergencyBannerProps {
  onViewReportDirectly?: () => void;
}

export const EmergencyBanner: React.FC<EmergencyBannerProps> = ({
  onViewReportDirectly
}) => {
  return (
    <div
      id="emergency-red-flag-banner"
      className="bg-red-600 text-white px-4 py-3 border-b-2 border-red-700 shadow-md animate-pulse-slow"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white/20 rounded-xl shrink-0 mt-0.5 sm:mt-0">
            <AlertOctagon className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-white text-red-700 text-[11px] font-black px-1.5 py-0.5 rounded tracking-wide uppercase">
                紅燈急救警示
              </span>
              <h4 className="font-bold text-sm sm:text-base leading-tight">
                偵測到潛在危急重症關鍵徵候！
              </h4>
            </div>
            <p className="text-xs text-red-100 mt-1 max-w-xl leading-relaxed">
              若目前伴隨胸痛壓榨、單側肢體癱軟、呼吸困難、劇烈如撕裂性頭痛或意識不清，請勿拖延，請立即撥打 119 救護車或由他人陪同前往最近醫院急診室！
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <a
            href="tel:119"
            id="emergency-banner-call-btn"
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-white text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl text-xs font-black shadow transition-transform active:scale-95"
          >
            <PhoneCall className="w-4 h-4 text-red-600" />
            <span>立即撥打 119</span>
          </a>

          {onViewReportDirectly && (
            <button
              onClick={onViewReportDirectly}
              className="flex items-center justify-center gap-1 text-xs text-red-100 hover:text-white underline underline-offset-2 px-2 py-2"
            >
              <span>查看就醫指引</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
