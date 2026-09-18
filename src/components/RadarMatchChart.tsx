import React from 'react';
import { RadarMetrics } from '../types';
import { Activity, ShieldAlert, Clock, Stethoscope, AlertCircle } from 'lucide-react';

interface RadarMatchChartProps {
  metrics: RadarMetrics;
}

export const RadarMatchChart: React.FC<RadarMatchChartProps> = ({ metrics }) => {
  // 5 dimensions for the radar polygon
  const dimensions = [
    { label: '主要症狀強度', key: 'primarySymptomIntensity', value: metrics.primarySymptomIntensity, color: 'text-rose-600', icon: Activity },
    { label: '伴隨危險因子', key: 'accompanyingRiskRatio', value: metrics.accompanyingRiskRatio, color: 'text-amber-600', icon: ShieldAlert },
    { label: '時間急迫度', key: 'timeSensitivity', value: metrics.timeSensitivity, color: 'text-red-600', icon: Clock },
    { label: '科別契合度', key: 'departmentRelevance', value: metrics.departmentRelevance, color: 'text-emerald-600', icon: Stethoscope },
    { label: '處置複雜度', key: 'careComplexity', value: metrics.careComplexity, color: 'text-blue-600', icon: AlertCircle },
  ];

  // Mathematical coordinates for 5-axis radar polygon
  const size = 260;
  const center = size / 2;
  const radius = 95;
  const totalAxes = dimensions.length;

  const getCoordinates = (index: number, val: number) => {
    // Angle in radians starting from top (-pi/2)
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const r = (val / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate background rings (25%, 50%, 75%, 100%)
  const rings = [0.25, 0.5, 0.75, 1.0];

  // Generate polygon points
  const points = dimensions
    .map((dim, idx) => {
      const coord = getCoordinates(idx, dim.value);
      return `${coord.x},${coord.y}`;
    })
    .join(' ');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
        <div>
          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
            症狀指標與就醫風險雷達分析
          </h4>
          <p className="text-xs text-slate-500">
            綜合呈現主訴強度、急迫程度與對應科別契合權重
          </p>
        </div>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
          綜合評估 100%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: SVG Radar */}
        <div className="md:col-span-6 flex justify-center">
          <svg width={size} height={size} className="overflow-visible">
            {/* Background concentric rings */}
            {rings.map((factor, rIdx) => {
              const ringPoints = dimensions
                .map((_, idx) => {
                  const angle = (Math.PI * 2 / totalAxes) * idx - Math.PI / 2;
                  const x = center + radius * factor * Math.cos(angle);
                  const y = center + radius * factor * Math.sin(angle);
                  return `${x},${y}`;
                })
                .join(' ');
              return (
                <polygon
                  key={rIdx}
                  points={ringPoints}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray={factor === 1 ? 'none' : '3 3'}
                />
              );
            })}

            {/* Axes spokes */}
            {dimensions.map((_, idx) => {
              const outerCoord = getCoordinates(idx, 100);
              return (
                <line
                  key={idx}
                  x1={center}
                  y1={center}
                  x2={outerCoord.x}
                  y2={outerCoord.y}
                  stroke="#cbd5e1"
                  strokeWidth="1"
                />
              );
            })}

            {/* The shaded value area polygon */}
            <polygon
              points={points}
              fill="rgba(225, 29, 72, 0.22)"
              stroke="#e11d48"
              strokeWidth="2.5"
            />

            {/* Value vertices points */}
            {dimensions.map((dim, idx) => {
              const coord = getCoordinates(idx, dim.value);
              return (
                <circle
                  key={idx}
                  cx={coord.x}
                  cy={coord.y}
                  r="4.5"
                  fill="#e11d48"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>

        {/* Right: Detailed Metric Bars */}
        <div className="md:col-span-6 space-y-3">
          {dimensions.map((dim) => {
            const Icon = dim.icon;
            return (
              <div key={dim.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <Icon className={`w-3.5 h-3.5 ${dim.color}`} />
                    {dim.label}
                  </span>
                  <span className="font-bold text-slate-900">{dim.value}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      dim.value >= 80
                        ? 'bg-rose-600'
                        : dim.value >= 60
                        ? 'bg-amber-500'
                        : 'bg-slate-400'
                    }`}
                    style={{ width: `${dim.value}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
