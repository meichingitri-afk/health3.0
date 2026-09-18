import { TriageReportData, UrgencyLevel } from '../types';

export interface SymptomQuickOption {
  id: string;
  label: string;
  description: string;
  isUrgent?: boolean;
}

export const COMMON_SYMPTOMS: SymptomQuickOption[] = [
  { id: 'headache', label: '劇烈頭痛 / 眩暈', description: '後腦鈍痛、單側偏頭痛、伴隨眼眶脹痛或天旋地轉' },
  { id: 'cold_flu', label: '流鼻水 / 喉嚨痛 / 發燒', description: '咽喉疼痛吞嚥困難、鼻塞黃鼻涕、畏寒體溫升高' },
  { id: 'chest_pain', label: '急劇胸痛 / 呼吸困難', description: '胸口壓榨感、深呼吸疼痛、喘不過氣、心悸絞痛', isUrgent: true },
  { id: 'stomach', label: '上腹胃痛 / 噁心嘔吐', description: '胃部灼熱、腹脹絞痛、反胃嘔吐、伴隨腹瀉' },
  { id: 'lower_abdomen', label: '下腹急痛 / 消化道異常', description: '右下腹劇痛、排尿灼熱急迫、腹瀉便血', isUrgent: true },
  { id: 'ortho_joint', label: '關節扭傷 / 肢體疼痛', description: '跌倒撞傷、紅腫熱痛、活動受限、頸肩腰背劇痛' },
  { id: 'skin_rash', label: '皮膚紅疹 / 急性過敏', description: '全身搔癢膨疹、紅斑水泡、接觸性發炎' },
  { id: 'weakness_stroke', label: '半邊肢體無力 / 言語不清', description: '單側手腳抬不起、臉部表情不對稱、口齒不清', isUrgent: true },
];

export const RED_FLAG_KEYWORDS = [
  '胸痛', '胸悶壓迫', '呼吸困難', '喘不過氣', '偏癱', '單側無力', '半邊麻木', 
  '口齒不清', '說話模糊', '嘴歪', '劇烈如撕裂', '如雷擊頭痛', '意識模糊', 
  '昏倒', '暈厥', '吐血', '咳血', '大量黑便', '頸部僵硬', '高燒不退抽搐', 
  '劇烈心悸呼吸急促', '嚴重過敏呼吸道腫脹'
];

export function checkRedFlagKeyword(text: string): boolean {
  return RED_FLAG_KEYWORDS.some(kw => text.includes(kw));
}

// Fallback rule-based triage evaluator
export function evaluateSymptomReportOffline(
  symptoms: string[],
  chatHistory: { sender: string; text: string }[]
): TriageReportData {
  const allText = [...symptoms, ...chatHistory.map(m => m.text)].join(' ');
  const hasRedFlag = checkRedFlagKeyword(allText);

  // Detect condition types
  const isChest = /胸痛|心臟|胸悶|喘|呼吸困難|絞痛/i.test(allText);
  const isStroke = /偏癱|單側無力|嘴歪|半邊麻木|口齒不清/i.test(allText);
  const isHeadache = /頭痛|眩暈|暈眩|偏頭痛|頭昏/i.test(allText);
  const isColdENT = /喉嚨痛|鼻水|發燒|咳嗽|鼻塞|中耳|耳鳴/i.test(allText);
  const isGI = /胃痛|腹痛|拉肚子|腹瀉|嘔吐|胃食道逆流|胃灼熱/i.test(allText);
  const isOrtho = /骨折|扭傷|關節|腳踝|腰痛|肩膀/i.test(allText);
  const isDerma = /紅疹|過敏|癢|蕁麻疹|水泡|濕疹/i.test(allText);

  let urgency: UrgencyLevel = 'ROUTINE';
  let urgencyTitle = '一般門診就醫建議';
  let urgencyDescription = '目前症狀評估為常態病程，建議近期預約合適科別門診評估治療，並持續留意身體狀況。';
  let redFlagDetected = false;

  if (hasRedFlag || isStroke || (isChest && /劇烈|壓迫|冒冷汗|呼吸困難/.test(allText))) {
    urgency = 'EMERGENCY';
    urgencyTitle = '🔴 急診警示：建議立即前往急診室或撥打 119';
    urgencyDescription = '檢測到潛在危急重症指標（如突發胸痛、嚴重呼吸困難或疑似腦中風神經徵候），請勿拖延或自行長途開車！';
    redFlagDetected = true;
  } else if (/高燒|持續劇痛|劇烈腹痛|嘔吐不止|無法進食|超過3天|疼痛指數[7-9]/.test(allText)) {
    urgency = 'URGENT_TODAY';
    urgencyTitle = '🟡 建議今日就醫：需由醫師當日門診診斷';
    urgencyDescription = '症狀強度較顯著或已有持續加劇跡象，建議今天內前往鄰近營業中之診所就診，避免病程惡化。';
  }

  // Determine departments
  const departments = [];
  if (isChest) {
    departments.push({
      name: '心臟血管內科 / 胸腔內科',
      code: 'CARDIO',
      matchScore: 95,
      reason: '主訴包含胸悶、呼吸不順或胸口不適，需首要排除心肌缺氧與胸腔肺部病變。'
    });
    departments.push({
      name: '急診醫學科',
      code: 'EMERGENCY',
      matchScore: 90,
      reason: '若伴隨大汗淋漓、左臂輻射痛，急診能即刻完成心電圖與心肌酵素快篩。'
    });
  } else if (isStroke) {
    departments.push({
      name: '神經內科 / 腦中風中心',
      code: 'NEURO',
      matchScore: 98,
      reason: '急性神經學缺損（肢體無力、語言困難）需掌握黃金治療窗口，立即進行腦部影像評估。'
    });
    departments.push({
      name: '急診醫學部',
      code: 'EMERGENCY',
      matchScore: 95,
      reason: '急診室具備急中風綠色通道，可第一時間評估血栓溶解劑施打適應症。'
    });
  } else if (isColdENT) {
    departments.push({
      name: '耳鼻喉科',
      code: 'ENT',
      matchScore: 92,
      reason: '專長於上呼吸道黏膜檢視、咽喉深處發炎、扁桃腺化膿與中耳壓力評估。'
    });
    departments.push({
      name: '家庭醫學科',
      code: 'FAMILY',
      matchScore: 85,
      reason: '提供全身感染性評估、流感/新冠篩檢及整體用藥處方調理。'
    });
  } else if (isGI) {
    departments.push({
      name: '胃腸肝膽科',
      code: 'GI',
      matchScore: 93,
      reason: '針對急性胃炎、腸胃炎、膽囊及闌尾炎提供腹部觸診及超音波影像精準鑑別。'
    });
    departments.push({
      name: '一般內科 / 家醫科',
      code: 'INTERNAL',
      matchScore: 82,
      reason: '初步調節脫水與電解質平衡，並針對非複雜性腸胃機能紊亂給予口服藥物。'
    });
  } else if (isHeadache) {
    departments.push({
      name: '神經內科',
      code: 'NEURO',
      matchScore: 91,
      reason: '專長於偏頭痛、叢發性頭痛、頸椎源性頭痛及腦血管神經反射分析。'
    });
    departments.push({
      name: '家庭醫學科',
      code: 'FAMILY',
      matchScore: 84,
      reason: '綜合量測血壓、評估睡眠壓力及常見感冒引發之全頭性脹痛。'
    });
  } else if (isOrtho) {
    departments.push({
      name: '骨科 / 復健醫學科',
      code: 'ORTHO',
      matchScore: 94,
      reason: '具備數位 X 光機鑑別骨折、韌帶挫傷撕裂，並提供即時固定與消炎注射。'
    });
    departments.push({
      name: '家醫科',
      code: 'FAMILY',
      matchScore: 78,
      reason: '輕度肌肉拉傷止痛與日常姿勢衛教諮詢。'
    });
  } else if (isDerma) {
    departments.push({
      name: '皮膚科',
      code: 'DERMA',
      matchScore: 96,
      reason: '皮膚專科醫師能直接以皮膚鏡鑑別過敏性皮炎、急性蕁麻疹、感染性皮疹。'
    });
    departments.push({
      name: '家庭醫學科',
      code: 'FAMILY',
      matchScore: 80,
      reason: '全身性免疫過敏初步抗組織胺用藥與血液過敏原檢驗諮詢。'
    });
  } else {
    departments.push({
      name: '家庭醫學科',
      code: 'FAMILY',
      matchScore: 89,
      reason: '全方位整合門診，適合初期症狀模糊、尚未明確特定器官系統之初診導引。'
    });
    departments.push({
      name: '一般內科',
      code: 'INTERNAL',
      matchScore: 82,
      reason: '由內科專科醫師進行系統性理學檢查與基礎血液生化檢驗。'
    });
  }

  // Radar metrics
  const intensity = /劇烈|無法忍受|疼痛指數[89]|非常痛/.test(allText) ? 90 : /持續|明顯|疼痛指數[567]/.test(allText) ? 70 : 45;
  const riskRatio = hasRedFlag ? 95 : urgency === 'URGENT_TODAY' ? 65 : 30;
  const timeSens = urgency === 'EMERGENCY' ? 98 : urgency === 'URGENT_TODAY' ? 75 : 40;
  const deptRel = departments[0]?.matchScore || 85;
  const complexity = departments.length > 1 ? 65 : 45;

  // Risk Factors
  const riskFactors: string[] = [];
  if (hasRedFlag) {
    riskFactors.push('危險徵候警示：伴隨緊急紅燈症狀，需排除急性心肌缺血或神經血管病變');
  }
  if (/發燒/.test(allText) && /頭痛|頸部/.test(allText)) {
    riskFactors.push('高燒伴隨頭痛：需留意腦膜刺激徵候或深層感染可能');
  }
  if (/腹痛/.test(allText) && /右下腹|跳痛|轉移/.test(allText)) {
    riskFactors.push('右下腹持續壓痛：需警惕急性闌尾炎或骨盆腔發炎');
  }
  if (riskFactors.length === 0) {
    riskFactors.push('請留意若症狀持續超過 48 小時無好轉或突然加劇，應立即返診檢查');
  }

  // Home Care Tips
  const homeCareTips: string[] = [
    '保持室內通風與充分休息，避免劇烈運動或搬運重物。',
    '暫時避免攝取辛辣、刺激性及過度油膩之飲食，溫水少量多次補充水分。',
    '就醫前請勿自行服用成份不明的強效止痛藥，以免掩蓋核心病徵影響醫師臨床判斷。',
    '記錄體溫變化與不適發作的特定姿勢或時間點，供看診醫師參考。'
  ];

  // Preliminary Doctor Checks
  const preliminaryDoctorChecks: string[] = [
    '耳鼻喉 / 聽診理學檢查：醫師檢視咽喉黏膜、扁桃腺及心肺呼吸音',
    '生命徵象量測：血壓、體溫、心跳速率、血氧飽和度 (SpO2)',
    '特定部位超音波或影像檢驗：依據專科需要執行超音波、X 光或快篩檢查',
    '初步藥物給予與回診評估計劃：開立合適天數健保處方並說明藥物注意事項'
  ];

  return {
    urgency,
    urgencyTitle,
    urgencyDescription,
    departments,
    radarScores: {
      primarySymptomIntensity: intensity,
      accompanyingRiskRatio: riskRatio,
      timeSensitivity: timeSens,
      departmentRelevance: deptRel,
      careComplexity: complexity
    },
    riskFactors,
    redFlagDetected,
    emergencyGuide: redFlagDetected ? {
      title: '🚨 急救警示指引 (119 即刻救援)',
      warning: '請勿自行騎乘機車或開車前往醫院，建議撥打 119 由救護車救護人員提供到院前急救處置！',
      actionSteps: [
        '立即撥打 119 或由身邊親友協助通報，告知目前具體位置與明顯症狀（如：胸悶呼吸喘、單側肢體不聽使喚）。',
        '保持半坐臥或舒適平躺姿勢，解開領口與腰帶，維持呼吸道暢通。',
        '切勿強行灌食溫水或含服他人藥物，靜候救護人員到場接手。'
      ]
    } : undefined,
    homeCareTips,
    preliminaryDoctorChecks,
    summaryNote: '本系統為 AI 醫療導引輔助諮詢，非正式醫療診斷。若症狀急遽惡化，請立刻至就近醫院急診室評估。'
  };
}
