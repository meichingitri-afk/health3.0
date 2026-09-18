import React, { useState } from 'react';
import { X, Navigation, Check, MapPin, Search } from 'lucide-react';
import { POPULAR_DISTRICTS } from '../data/clinics';
import { UserContext } from '../types';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentContext: UserContext;
  onSelectLocation: (city: string, district: string, lat?: number, lng?: number) => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  currentContext,
  onSelectLocation,
}) => {
  const [gpsLoading, setGpsLoading] = useState(false);
  const [customCity, setCustomCity] = useState(currentContext.city);
  const [customDistrict, setCustomDistrict] = useState(currentContext.district);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      setGpsMessage('您的瀏覽器不支援 GPS 定位，請手動選取行政區。');
      return;
    }

    setGpsLoading(true);
    setGpsMessage('正在取得目前 GPS 經緯度...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLoading(false);
        const { latitude, longitude } = position.coords;
        // In prototype, find closest district or default to nearby
        onSelectLocation('台北市', '中正區', latitude, longitude);
        setGpsMessage('已成功定位！');
        setTimeout(() => {
          onClose();
        }, 500);
      },
      (error) => {
        setGpsLoading(false);
        setGpsMessage('無法存取定位（權限拒絕或逾時），請由下方清單直接選取行政區。');
      },
      { timeout: 8000 }
    );
  };

  const handleApplyCustom = () => {
    if (customCity && customDistrict) {
      onSelectLocation(customCity.trim(), customDistrict.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div 
        id="location-picker-modal"
        className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-slate-900">選擇搜尋區域 / 所在地</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5">
          {/* GPS Button */}
          <button
            id="gps-locate-btn"
            onClick={handleUseGps}
            disabled={gpsLoading}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold rounded-xl border border-rose-200 transition-colors disabled:opacity-60"
          >
            <Navigation className={`w-4 h-4 text-rose-600 ${gpsLoading ? 'animate-spin' : ''}`} />
            <span>{gpsLoading ? '定位中...' : '授權使用目前 GPS 定位'}</span>
          </button>

          {gpsMessage && (
            <p className="text-xs text-center text-slate-600 bg-slate-50 py-1.5 px-3 rounded-lg">
              {gpsMessage}
            </p>
          )}

          {/* Quick select districts */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              熱門城區快速選取
            </label>
            <div className="grid grid-cols-2 gap-2">
              {POPULAR_DISTRICTS.map((item) => {
                const isSelected =
                  currentContext.city === item.city && currentContext.district === item.district;
                return (
                  <button
                    key={`${item.city}-${item.district}`}
                    onClick={() => {
                      onSelectLocation(item.city, item.district, item.lat, item.lng);
                      onClose();
                    }}
                    className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg border transition-all text-left ${
                      isSelected
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <span>
                      {item.city} {item.district}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom District Input */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              或自行輸入台灣縣市與行政區
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="例如：新北市"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                className="w-1/2 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <input
                type="text"
                placeholder="例如：板橋區"
                value={customDistrict}
                onChange={(e) => setCustomDistrict(e.target.value)}
                className="w-1/2 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
            <button
              onClick={handleApplyCustom}
              className="mt-2.5 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors"
            >
              確定指定此區域
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
