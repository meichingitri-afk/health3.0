import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { CLINICS_DATABASE, filterClinics, getClinicOpenStatus } from './src/data/clinics';
import { checkRedFlagKeyword, evaluateSymptomReportOffline } from './src/data/triageRules';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client safely with telemetry user-agent
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// 1. Clarification & Follow-up Endpoint (1-2 rounds of questioning flow)
app.post('/api/triage/clarify', async (req, res) => {
  try {
    const { messages = [], userContext = {} } = req.body;
    const allUserTexts = messages.filter((m: any) => m.sender === 'user').map((m: any) => m.text);
    const combinedText = allUserTexts.join(' ');

    // Fast check for critical red flags
    const hasCriticalRedFlag = checkRedFlagKeyword(combinedText);
    const userMessageCount = allUserTexts.length;

    // If red flag is detected, immediately alert and offer to generate report
    if (hasCriticalRedFlag && userMessageCount >= 1) {
      return res.json({
        readyForReport: true,
        isRedFlagWarning: true,
        aiMessage: '⚠️ 系統偵測到您提到的狀況中包含潛在危急症狀（如劇烈胸悶、呼吸急迫或神經徵候），建議優先評估急診就醫。我們已為您整理好醫療導引，請立即點擊下方按鈕檢視報告與最近急診清單！',
        suggestedReplies: ['立即產出就醫建議與診所清單', '撥打 119 求助', '補充說明症狀']
      });
    }

    // If user has already answered 2 or more follow-up turns, declare ready for report
    if (userMessageCount >= 3) {
      return res.json({
        readyForReport: true,
        isRedFlagWarning: false,
        aiMessage: '感謝您的詳細說明，我已掌握您的主要不適狀況、發作時程與疼痛感受。請點擊下方「生成就醫建議與診所清單」以查看科別推薦與附近營業中的診所！',
        suggestedReplies: ['立即產出就醫建議與診所清單', '修改/補充症狀']
      });
    }

    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `
你是一位具備高度同理心與專業急救分診概念的台灣「AI 醫療導引助手」（健康急救章）。
使用者目前所在地：${userContext.city || '台北市'} ${userContext.district || '中正區'}
使用者目前的對話記錄：
${JSON.stringify(messages, null, 2)}

任務說明：
目前使用者剛提供了症狀說明（對話輪數第 ${userMessageCount} 次）。
- 如果這是使用者的第 1 次主訴輸入：請針對「發作時間/持續多久」進行簡潔親切的追問（1-2句），並提供 3-4 個常見的點選選項（如「剛剛突發(1小時內)」、「今天早晨開始」、「持續1-2天」、「超過一週」）。
- 如果這是第 2 次輸入：請追問「疼痛不適等級 (1-10分)」或「有無伴隨特定紅旗警訊（如發燒、頸部僵硬、噁心想吐、劇烈喘不過氣）」，並提供 3-4 個快速選擇標籤。
- 如果使用者提供的信息已經足夠明確且包含時間與程度：請將 readyForReport 設為 true，並友善提醒使用者可以產出報告。

請務必以繁體中文回答，語氣溫和專業，並嚴格回傳 JSON 格式：
{
  "readyForReport": boolean,
  "isRedFlagWarning": boolean,
  "aiMessage": "給使用者的親切回應與下一輪澄清問題",
  "suggestedReplies": ["選項1", "選項2", "選項3", "選項4"]
}
`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text || '{}';
        const parsed = JSON.parse(text);
        return res.json(parsed);
      } catch (err) {
        console.warn('Gemini clarify API failed, using rule fallback:', err);
      }
    }

    // Rule-based Fallback for Clarification
    if (userMessageCount === 1) {
      return res.json({
        readyForReport: false,
        isRedFlagWarning: false,
        aiMessage: '了解您目前的不適。請問這個狀況是「什麼時候開始發作的」？目前持續了多久呢？',
        suggestedReplies: ['剛剛突發 (1小時內)', '今天早晨開始', '持續1-2天了', '反覆發作超過一週']
      });
    } else if (userMessageCount === 2) {
      return res.json({
        readyForReport: false,
        isRedFlagWarning: false,
        aiMessage: '收到。若以 1 至 10 分來評估（1分微弱，10分無法忍受），您覺得現在的不適程度大概是幾分？是否有伴隨發燒、冒冷汗或劇烈噁心呢？',
        suggestedReplies: ['輕微不適 (1-3分)', '中度疼痛影響活動 (4-6分)', '劇烈難耐 (7-10分)', '無其他伴隨症狀', '伴隨輕微發燒']
      });
    } else {
      return res.json({
        readyForReport: true,
        isRedFlagWarning: false,
        aiMessage: '資訊已充足，系統已完成初步症狀比對。請點擊下方按鈕產出完整就醫導引與即時診所清單！',
        suggestedReplies: ['立即產出就醫建議與診所清單']
      });
    }
  } catch (error: any) {
    console.error('Clarify endpoint error:', error);
    res.status(500).json({ error: 'Failed to process clarification' });
  }
});

// 2. Structured Triage & Analysis Report Endpoint
app.post('/api/triage/analyze', async (req, res) => {
  try {
    const { symptoms = [], messages = [], userContext = {} } = req.body;
    const allUserTexts = messages.filter((m: any) => m.sender === 'user').map((m: any) => m.text);
    const combinedSymptoms = [...symptoms, ...allUserTexts];

    const ai = getGeminiClient();
    if (ai) {
      try {
        const prompt = `
你是一位具備急救分診與台灣分級醫療臨床經驗的專業醫療分診 AI「健康急救章」。
使用者地點：${userContext.city || '台北市'} ${userContext.district || '中正區'}
使用者陳述的所有症狀與對話脈絡：
${JSON.stringify(messages, null, 2)}

請綜合評估並輸出繁體中文的 JSON 結構化分診指引報告：
1. urgency: "EMERGENCY" (紅燈急診警示：胸痛、急性呼吸困難、疑似腦中風FAST徵候、大出血、高燒頸部僵硬等), "URGENT_TODAY" (黃燈建議今日就醫：症狀明顯、高燒持續、劇痛等), "ROUTINE" (綠燈一般門診評估).
2. urgencyTitle: 醒目的急迫性判定標題 (例如 "🔴 急診警示：建議立即前往急診室或撥打 119" 或 "🟡 建議今日就醫：需由專科門診評估" 或 "🟢 一般門診諮詢").
3. urgencyDescription: 簡短白話的急迫性原因說明 (60字內).
4. departments: 1 至 2 個最相符之建議科別清單，包含科別名稱(name)、代碼(code: ENT/FAMILY/GI/CARDIO/NEURO/ORTHO/DERMA/CHEST/EMERGENCY/INTERNAL)、匹配分數(matchScore: 0-100)與推薦就醫原因(reason).
5. radarScores:
   - primarySymptomIntensity: 主要症狀強度分數 (0-100)
   - accompanyingRiskRatio: 伴隨危險因子影響比例 (0-100)
   - timeSensitivity: 時間急迫度 (0-100)
   - departmentRelevance: 科別契合度 (0-100)
   - careComplexity: 處置複雜度 (0-100)
6. riskFactors: 點出 1-3 個需特別留意的危險因子或重症前兆警語 (字句簡潔清楚).
7. redFlagDetected: boolean (是否偵測到紅旗重症).
8. emergencyGuide: 若 redFlagDetected 為 true，提供 119 求救提醒、注意事項與動作步驟 (actionSteps: 3點).
9. homeCareTips: 3-4 點通俗易懂的居家自我照護與就醫前注意事項.
10. preliminaryDoctorChecks: 3-4 點該科別醫師門診通常會進行的初步檢查與問診項目 (例如：耳鼻喉鏡、心電圖、腹部觸診、神經反射測試等).
11. summaryNote: 醫療免責聲明與就醫提醒.

請確保 JSON 格式有效，不要使用 Markdown 代碼框。
`;
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const text = response.text || '{}';
        const parsed = JSON.parse(text);
        return res.json(parsed);
      } catch (err) {
        console.warn('Gemini triage report generation failed, falling back to rule engine:', err);
      }
    }

    // Fallback rule evaluation
    const fallbackReport = evaluateSymptomReportOffline(combinedSymptoms, messages);
    return res.json(fallbackReport);
  } catch (error: any) {
    console.error('Triage analysis error:', error);
    const fallback = evaluateSymptomReportOffline([], []);
    res.json(fallback);
  }
});

// 3. Nearby Clinics Directory Endpoint with Real-Time Opening Status
app.post('/api/clinics', (req, res) => {
  try {
    const {
      city = '台北市',
      district = '中正區',
      departmentCodes = ['FAMILY', 'ENT'],
      isEmergencyOnly = false
    } = req.body;

    const filtered = filterClinics(city, district, departmentCodes, isEmergencyOnly);
    const now = new Date();

    const results = filtered.map(clinic => {
      const openStatus = getClinicOpenStatus(clinic, now);
      return {
        ...clinic,
        openStatus,
      };
    });

    res.json({
      clinics: results,
      totalCount: results.length,
      currentServerTime: now.toLocaleTimeString('zh-TW', { hour12: false }),
    });
  } catch (err: any) {
    console.error('Clinics API error:', err);
    res.status(500).json({ error: 'Failed to retrieve clinics' });
  }
});

// Vite middleware for dev / static for prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[健康急救章] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
