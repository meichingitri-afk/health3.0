import React, { useState } from 'react';
import { 
  Phone, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Copy, 
  Check, 
  Building2, 
  AlertCircle,
  Globe,
  CalendarCheck,
  Link2
} from 'lucide-react';
import { ClinicItem, ClinicOpenStatus } from '../types';

interface ClinicCardProps {
  clinic: ClinicItem & { openStatus?: ClinicOpenStatus };
}

export const ClinicCard: React.FC<ClinicCardProps> = ({ clinic }) => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(clinic.phone.replace(/-/g, ''));
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleCopyUrl = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!clinic.bookingUrl) return;
    navigator.clipboard.writeText(clinic.bookingUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const status = clinic.openStatus || {
    status: 'OPEN',
    label: '營業中',
    closesAt: '請電話洽詢'
  };

  const isEmergency = !!clinic.isEmergencyHospital;

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-xs ${
        isEmergency
          ? 'bg-rose-50/50 border-rose-200 ring-1 ring-rose-200'
          : 'bg-white border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Clinic Name and Tags */}
        <div className="space-y-1.5 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {isEmergency ? (
              <span className="bg-red-600 text-white text-[11px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                24H 急診醫院
              </span>
            ) : (
              <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded">
                {clinic.departmentNames.join(' / ')}
              </span>
            )}

            {/* Live Opening Status Badge */}
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                status.status === 'OPEN'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : status.status === 'OPENING_SOON'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  status.status === 'OPEN'
                    ? 'bg-emerald-500 animate-pulse'
                    : status.status === 'OPENING_SOON'
                    ? 'bg-amber-500'
                    : 'bg-slate-400'
                }`}
              />
              <span>{status.label}</span>
            </span>

            {clinic.bookingUrl && (
              <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                <Globe className="w-3 h-3 text-sky-600" />
                <span>可網路預約</span>
              </span>
            )}

            <span className="text-xs text-slate-400 font-medium">
              約 {clinic.distanceKm} 公里
            </span>
          </div>

          <h4 className="font-bold text-slate-900 text-base leading-snug">
            {clinic.name}
          </h4>

          {/* Address */}
          <div className="flex items-start gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>{clinic.address}</span>
          </div>

          {/* Regular hours description */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>門診時段：{clinic.hoursDescription}</span>
          </div>

          {/* Online booking URL row */}
          {clinic.bookingUrl && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 pt-0.5">
              <Globe className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="font-medium text-slate-700 shrink-0">網路預約網址：</span>
              <a
                href={clinic.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-700 hover:text-sky-900 underline underline-offset-2 font-medium truncate max-w-[240px] sm:max-w-xs flex items-center gap-1 transition-colors"
                title={`前往 ${clinic.name} 線上預約系統`}
              >
                <span className="truncate">{clinic.bookingUrl}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          )}

          {/* Feature tags */}
          {clinic.tags && clinic.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {clinic.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons: Booking, Call & Maps */}
        <div className="flex flex-col items-stretch sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {/* Online Reservation Button (if bookingUrl exists) */}
            {clinic.bookingUrl && (
              <a
                href={clinic.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors text-center"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>網路線上預約</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
              </a>
            )}

            {/* Direct call button */}
            <a
              href={`tel:${clinic.phone.replace(/[^0-9]/g, '')}`}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors text-center"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>電話預約 {clinic.phone}</span>
            </a>
          </div>

          <div className="flex items-center justify-end gap-1.5 pt-0.5">
            {/* Copy booking URL button if available */}
            {clinic.bookingUrl && (
              <button
                onClick={handleCopyUrl}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors text-xs flex items-center gap-1"
                title="複製網路預約網址"
              >
                {copiedUrl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 text-[11px]">已複製網址</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-3.5 h-3.5" />
                    <span className="text-[11px]">複製網址</span>
                  </>
                )}
              </button>
            )}

            {/* Copy phone */}
            <button
              onClick={handleCopyPhone}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors text-xs flex items-center gap-1"
              title="複製診所電話"
            >
              {copiedPhone ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 text-[11px]">已複製電話</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span className="text-[11px]">複製電話</span>
                </>
              )}
            </button>

            {/* External Google Map link */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                clinic.name + ' ' + clinic.address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-slate-200 transition-colors text-xs flex items-center gap-1"
              title="在外部 Google Maps 開啟位置導航"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="text-[11px]">地圖導航</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
