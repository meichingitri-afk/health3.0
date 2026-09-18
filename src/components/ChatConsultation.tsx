import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  User, 
  Bot, 
  AlertTriangle, 
  FileText, 
  ChevronRight,
  HelpCircle,
  Clock
} from 'lucide-react';
import { ChatMessage, UserContext } from '../types';
import { COMMON_SYMPTOMS } from '../data/triageRules';

interface ChatConsultationProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onGenerateReport: () => void;
  isThinking: boolean;
  readyForReport: boolean;
  userContext: UserContext;
}

export const ChatConsultation: React.FC<ChatConsultationProps> = ({
  messages,
  onSendMessage,
  onGenerateReport,
  isThinking,
  readyForReport,
  userContext
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API for voice-to-text
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'zh-TW';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText((prev) => (prev ? `${prev}，${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleSpeech = () => {
    if (!speechSupported || !recognitionRef.current) {
      alert('您的瀏覽器目前未開啟或不支援語音辨識功能，請直接使用鍵盤輸入文字或點選快捷標籤。');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  };

  const handleSend = () => {
    if (!inputText.trim() || isThinking) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Current suggested quick replies from the latest AI message
  const lastAiMessage = [...messages].reverse().find(m => m.sender === 'ai');
  const activeQuickReplies = lastAiMessage?.quickReplies || [];

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] max-w-4xl mx-auto bg-slate-50 border-x border-slate-200 shadow-sm">
      {/* Top Banner Guide */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-medium text-slate-800">AI 智慧分診諮詢中</span>
          <span className="text-slate-400">|</span>
          <span>區域：{userContext.city} {userContext.district}</span>
        </div>
        <div className="flex items-center gap-1 text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span>動態評估 1-2 輪即可產出報告</span>
        </div>
      </div>

      {/* Message History Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  isAi
                    ? msg.isRedFlagWarning
                      ? 'bg-red-600 text-white'
                      : 'bg-rose-600 text-white'
                    : 'bg-slate-800 text-white'
                }`}
              >
                {isAi ? (
                  msg.isRedFlagWarning ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>

              {/* Speech Bubble */}
              <div className={`max-w-[85%] sm:max-w-xl space-y-2`}>
                <div
                  className={`p-4 rounded-2xl text-sm sm:text-base leading-relaxed shadow-sm ${
                    isAi
                      ? msg.isRedFlagWarning
                        ? 'bg-red-50 text-red-950 border border-red-200 rounded-tl-sm'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm'
                      : 'bg-rose-600 text-white rounded-tr-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Timestamp */}
                <div className={`text-[10px] text-slate-400 px-1 ${isAi ? 'text-left' : 'text-right'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {/* AI Typing indicator */}
        {isThinking && (
          <div className="flex items-start gap-3 justify-start">
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 animate-spin" />
            </div>
            <div className="bg-white border border-slate-200 p-3.5 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-slate-600 font-medium">AI 正在臨床分診思考...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies Pill Carousel */}
      {activeQuickReplies.length > 0 && !isThinking && (
        <div className="px-4 py-2 bg-slate-100/90 border-t border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-slate-500 shrink-0 uppercase tracking-wider">
            快速回覆：
          </span>
          {activeQuickReplies.map((replyText, idx) => (
            <button
              key={idx}
              id={`quick-reply-btn-${idx}`}
              onClick={() => {
                if (replyText.includes('產出就醫建議')) {
                  onGenerateReport();
                } else {
                  onSendMessage(replyText);
                }
              }}
              className="shrink-0 px-3.5 py-1.5 bg-white hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 border border-slate-200 rounded-full text-xs font-medium text-slate-700 shadow-2xs transition-all active:scale-95"
            >
              {replyText}
            </button>
          ))}
        </div>
      )}

      {/* Initial common symptom tag helpers if only 1 message exists */}
      {messages.length <= 2 && !isThinking && (
        <div className="px-4 py-2.5 bg-white border-t border-slate-200">
          <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>常見身體不適快選標籤（點擊立即填入）：</span>
          </p>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_SYMPTOMS.map((item) => (
              <button
                key={item.id}
                onClick={() => onSendMessage(item.label)}
                className={`px-3 py-1 text-xs rounded-lg border transition-all ${
                  item.isUrgent
                    ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 font-medium'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action Area: Either Prompt Input OR "Generate Report" Big Button */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        {readyForReport ? (
          <div className="space-y-2">
            <button
              id="generate-report-btn"
              onClick={onGenerateReport}
              className="w-full py-3.5 px-6 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-bold text-base rounded-xl shadow-md shadow-rose-200 flex items-center justify-center gap-2.5 transition-all transform active:scale-[0.99] animate-pulse-slow"
            >
              <FileText className="w-5 h-5" />
              <span>生成就醫建議與診所清單</span>
              <ChevronRight className="w-5 h-5" />
            </button>
            <p className="text-center text-xs text-slate-400">
              資訊已足夠！點擊立即產出建議科別、症狀雷達評估與附近即時營業診所
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              {/* Voice recognition button */}
              <button
                type="button"
                id="speech-to-text-btn"
                onClick={toggleSpeech}
                className={`p-3 rounded-xl border transition-all ${
                  isListening
                    ? 'bg-rose-600 text-white border-rose-600 ring-4 ring-rose-200 animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                }`}
                title={isListening ? '點擊停止語音輸入' : '點擊開始語音辨識轉文字'}
              >
                {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              {/* Text Input */}
              <div className="flex-1 relative">
                <input
                  id="chat-symptom-input"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isThinking}
                  placeholder={
                    isListening
                      ? '正在聆聽語音中，請直接說話...'
                      : '輸入身體不適症狀（如：頭痛流鼻水發燒、發作2天...）'
                  }
                  className="w-full py-3 pl-4 pr-12 text-sm sm:text-base border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 bg-slate-50 focus:bg-white transition-colors"
                />
                <button
                  id="chat-send-btn"
                  onClick={handleSend}
                  disabled={!inputText.trim() || isThinking}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:hover:bg-rose-600 text-white rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick action to force generate if in rush */}
            <div className="flex items-center justify-between px-1 text-xs text-slate-400">
              <span>{isListening ? '🔴 語音接收中，說完後可再次點擊麥克風' : '支援語音輸入與文字鍵入'}</span>
              {messages.length >= 2 && (
                <button
                  onClick={onGenerateReport}
                  className="text-rose-600 font-medium hover:underline flex items-center gap-0.5"
                >
                  <span>跳過追問，直接產出報告</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
