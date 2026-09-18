import React, { useState, useEffect } from 'react';
import { 
  UserContext, 
  ChatMessage, 
  TriageReportData, 
  ClinicItem, 
  ClinicOpenStatus 
} from './types';
import { Header } from './components/Header';
import { EmergencyBanner } from './components/EmergencyBanner';
import { LocationPickerModal } from './components/LocationPickerModal';
import { ChatConsultation } from './components/ChatConsultation';
import { TriageReport } from './components/TriageReport';
import { checkRedFlagKeyword, evaluateSymptomReportOffline } from './data/triageRules';
import { filterClinics, getClinicOpenStatus } from './data/clinics';

export default function App() {
  const [currentView, setCurrentView] = useState<'CHAT' | 'REPORT'>('CHAT');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [readyForReport, setReadyForReport] = useState(false);
  const [hasRedFlag, setHasRedFlag] = useState(false);

  // User location context (defaults to Taipei Zhongzheng, easily switched)
  const [userContext, setUserContext] = useState<UserContext>({
    city: '台北市',
    district: '中正區',
    coordinates: { latitude: 25.0324, longitude: 121.519 }
  });

  // Chat conversation messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-msg',
      sender: 'ai',
      text: '您好！我是您的智慧醫療導引助手【健康急救章】。\n\n請問您目前感覺哪裡身體不舒服？或者有什麼明顯的異常症狀呢？您可以直接輸入文字、使用語音說話，或點選下方的常見症狀快選標籤。',
      timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
      quickReplies: ['頭痛伴隨發燒', '胸悶呼吸不順', '喉嚨痛流鼻水', '胃部急性悶痛', '急性腹瀉嘔吐']
    }
  ]);

  // Analyzed triage report state
  const [reportData, setReportData] = useState<TriageReportData | null>(null);

  // Nearby clinics matching recommended departments
  const [clinicsList, setClinicsList] = useState<(ClinicItem & { openStatus?: ClinicOpenStatus })[]>([]);

  // Send a user message and trigger 1-2 round follow-up questioning flow
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userTimestamp = new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: userTimestamp
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    // Immediate client-side check for critical red flag words
    const redFlagHit = checkRedFlagKeyword(text);
    if (redFlagHit) {
      setHasRedFlag(true);
    }

    setIsThinking(true);

    try {
      const response = await fetch('/api/triage/clarify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          userContext
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.aiMessage || '了解您的狀況。請提供更多細節或直接產出就醫建議。',
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
        quickReplies: data.suggestedReplies || [],
        isRedFlagWarning: !!data.isRedFlagWarning
      };

      setMessages((prev) => [...prev, aiMsg]);
      if (data.isRedFlagWarning) {
        setHasRedFlag(true);
      }
      if (data.readyForReport) {
        setReadyForReport(true);
      }
    } catch (err) {
      console.warn('Clarify API error, using local fallback:', err);
      // Fallback turn handling
      const userCount = updatedMessages.filter(m => m.sender === 'user').length;
      let nextAiText = '';
      let nextQuick: string[] = [];
      let isReady = false;

      if (userCount === 1) {
        nextAiText = '收到。請問這個不適狀況大約是「什麼時候開始發作的」？目前持續了多久？';
        nextQuick = ['剛剛突發(1小時內)', '今天早晨開始', '持續1-2天', '反覆發作超過一週'];
      } else if (userCount === 2) {
        nextAiText = '請問以 1 至 10 分來評估，目前的疼痛不適感大約幾分？是否有合併發燒、冒冷汗或呼吸喘的狀況？';
        nextQuick = ['輕微不適 (1-3分)', '中度疼痛 (4-6分)', '劇烈難耐 (7-10分)', '無其他伴隨症狀'];
      } else {
        nextAiText = '評估資料已充足！請點擊下方按鈕以產出完整醫療導引與附近營業中的診所清單。';
        nextQuick = ['立即產出就醫建議與診所清單'];
        isReady = true;
      }

      const fallbackAiMsg: ChatMessage = {
        id: `ai-fb-${Date.now()}`,
        sender: 'ai',
        text: nextAiText,
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
        quickReplies: nextQuick,
        isRedFlagWarning: redFlagHit
      };

      setMessages((prev) => [...prev, fallbackAiMsg]);
      if (isReady) setReadyForReport(true);
    } finally {
      setIsThinking(false);
    }
  };

  // Fetch clinics based on recommended departments
  const loadClinicsForReport = async (departments: { code: string }[], isEmergency: boolean) => {
    try {
      const deptCodes = departments.map(d => d.code);
      const res = await fetch('/api/clinics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          city: userContext.city,
          district: userContext.district,
          departmentCodes: deptCodes,
          isEmergencyOnly: isEmergency
        })
      });

      if (res.ok) {
        const data = await res.json();
        setClinicsList(data.clinics || []);
        return;
      }
    } catch (e) {
      console.warn('Clinics API call failed, using local calculation:', e);
    }

    // Local fallback calculation
    const raw = filterClinics(userContext.city, userContext.district, departments.map(d => d.code), isEmergency);
    const now = new Date();
    const enriched = raw.map(c => ({
      ...c,
      openStatus: getClinicOpenStatus(c, now)
    }));
    setClinicsList(enriched);
  };

  // Generate Step 3 Final Triage Report
  const handleGenerateReport = async () => {
    setIsThinking(true);
    try {
      const allUserTexts = messages.filter(m => m.sender === 'user').map(m => m.text);
      const res = await fetch('/api/triage/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: allUserTexts,
          messages,
          userContext
        })
      });

      let report: TriageReportData;
      if (res.ok) {
        report = await res.json();
      } else {
        report = evaluateSymptomReportOffline(allUserTexts, messages);
      }

      setReportData(report);
      if (report.redFlagDetected || report.urgency === 'EMERGENCY') {
        setHasRedFlag(true);
      }

      await loadClinicsForReport(report.departments, report.urgency === 'EMERGENCY');
      setCurrentView('REPORT');
    } catch (err) {
      console.error('Failed to generate report:', err);
      const allUserTexts = messages.filter(m => m.sender === 'user').map(m => m.text);
      const fallback = evaluateSymptomReportOffline(allUserTexts, messages);
      setReportData(fallback);
      await loadClinicsForReport(fallback.departments, fallback.urgency === 'EMERGENCY');
      setCurrentView('REPORT');
    } finally {
      setIsThinking(false);
    }
  };

  // Reset entire consultation
  const handleReset = () => {
    setCurrentView('CHAT');
    setReadyForReport(false);
    setHasRedFlag(false);
    setReportData(null);
    setClinicsList([]);
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'ai',
        text: '您好！我是您的智慧醫療導引助手【健康急救章】。\n\n請問您目前感覺哪裡身體不舒服？或者有什麼明顯的異常症狀呢？您可以直接輸入文字、使用語音說話，或點選下方的常見症狀快選標籤。',
        timestamp: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
        quickReplies: ['頭痛伴隨發燒', '胸悶呼吸不順', '喉嚨痛流鼻水', '胃部急性悶痛', '急性腹瀉嘔吐']
      }
    ]);
  };

  // Update location and reload clinics if currently on report view
  const handleSelectLocation = (city: string, district: string, lat?: number, lng?: number) => {
    const nextContext: UserContext = {
      city,
      district,
      coordinates: lat && lng ? { latitude: lat, longitude: lng } : userContext.coordinates
    };
    setUserContext(nextContext);

    if (reportData) {
      loadClinicsForReport(reportData.departments, reportData.urgency === 'EMERGENCY');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-rose-100 selection:text-rose-900">
      {/* Header */}
      <Header
        userContext={userContext}
        onOpenLocationPicker={() => setIsLocationModalOpen(true)}
        onReset={handleReset}
        hasRedFlag={hasRedFlag}
      />

      {/* Persistent Emergency Top Alert Banner (if red flag detected) */}
      {hasRedFlag && (
        <EmergencyBanner
          onViewReportDirectly={
            currentView === 'CHAT' && readyForReport ? handleGenerateReport : undefined
          }
        />
      )}

      {/* Main Container */}
      <main className="flex-1 pb-10">
        {currentView === 'CHAT' ? (
          <ChatConsultation
            messages={messages}
            onSendMessage={handleSendMessage}
            onGenerateReport={handleGenerateReport}
            isThinking={isThinking}
            readyForReport={readyForReport}
            userContext={userContext}
          />
        ) : (
          reportData && (
            <TriageReport
              report={reportData}
              userContext={userContext}
              clinics={clinicsList}
              onBackToChat={() => setCurrentView('CHAT')}
              onRefreshClinics={() =>
                reportData && loadClinicsForReport(reportData.departments, reportData.urgency === 'EMERGENCY')
              }
            />
          )
        )}
      </main>

      {/* Location Picker Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentContext={userContext}
        onSelectLocation={handleSelectLocation}
      />
    </div>
  );
}
