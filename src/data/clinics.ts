import { ClinicItem, ClinicOpenStatus } from '../types';

export const POPULAR_DISTRICTS = [
  { city: '台北市', district: '中正區', lat: 25.0324, lng: 121.519 },
  { city: '台北市', district: '大安區', lat: 25.0264, lng: 121.543 },
  { city: '台北市', district: '中山區', lat: 25.0685, lng: 121.533 },
  { city: '台北市', district: '信義區', lat: 25.0339, lng: 121.564 },
  { city: '新北市', district: '板橋區', lat: 25.0116, lng: 121.465 },
  { city: '新北市', district: '中和區', lat: 24.9994, lng: 121.500 },
  { city: '新北市', district: '新莊區', lat: 25.0366, lng: 121.450 },
  { city: '桃園市', district: '桃園區', lat: 24.9936, lng: 121.301 },
  { city: '新竹市', district: '東區', lat: 24.8016, lng: 120.971 },
  { city: '台中市', district: '西屯區', lat: 24.1816, lng: 120.620 },
  { city: '台中市', district: '北區', lat: 24.1565, lng: 120.683 },
  { city: '台南市', district: '東區', lat: 22.9833, lng: 120.222 },
  { city: '高雄市', district: '三民區', lat: 22.6468, lng: 120.302 },
  { city: '高雄市', district: '左營區', lat: 22.6896, lng: 120.301 },
];

export const CLINICS_DATABASE: ClinicItem[] = [
  // 台北市
  {
    id: 'tpe-ent-01',
    name: '宏恩綜合耳鼻喉科家醫聯合診所',
    departmentCodes: ['ENT', 'FAMILY'],
    departmentNames: ['耳鼻喉科', '家醫科'],
    city: '台北市',
    district: '中正區',
    address: '台北市中正區重慶南路一段 88 號',
    phone: '02-2388-1234',
    distanceKm: 0.4,
    hoursDescription: '週一至週六 08:30-12:00, 14:00-17:30, 18:30-21:30',
    shifts: {
      days: [1, 2, 3, 4, 5, 6],
      morning: { start: '08:30', end: '12:00' },
      afternoon: { start: '14:00', end: '17:30' },
      evening: { start: '18:30', end: '21:30' }
    },
    latitude: 25.0441,
    longitude: 121.5133,
    tags: ['健保特約', '備有快速流感篩檢', '附設蒸氣噴喉治療'],
    bookingUrl: 'https://reg.ntu-doctor.tw/clinic/tpe-ent-01'
  },
  {
    id: 'tpe-gi-01',
    name: '康德胃腸肝膽科內科診所',
    departmentCodes: ['GI', 'INTERNAL'],
    departmentNames: ['腸胃肝膽科', '一般內科'],
    city: '台北市',
    district: '中正區',
    address: '台北市中正區羅斯福路二段 45 號 2 樓',
    phone: '02-2396-5678',
    distanceKm: 0.9,
    hoursDescription: '週一至週五 09:00-12:00, 14:30-18:00, 18:30-21:00 / 週六 09:00-12:00',
    shifts: {
      days: [1, 2, 3, 4, 5, 6],
      morning: { start: '09:00', end: '12:00' },
      afternoon: { start: '14:30', end: '18:00' },
      evening: { start: '18:30', end: '21:00' }
    },
    latitude: 25.0298,
    longitude: 121.5215,
    tags: ['超音波檢查', '無痛胃鏡', '幽門螺旋桿菌檢驗'],
    bookingUrl: 'https://kangde-gi.webreg.tw/'
  },
  {
    id: 'tpe-cardio-01',
    name: '大安優活心臟血管胸腔內科診所',
    departmentCodes: ['CARDIO', 'CHEST', 'INTERNAL'],
    departmentNames: ['心臟內科', '胸腔內科', '一般內科'],
    city: '台北市',
    district: '大安區',
    address: '台北市大安區信義路三段 147 號',
    phone: '02-2708-9988',
    distanceKm: 1.2,
    hoursDescription: '週一至週五 09:00-12:00, 14:00-17:30, 18:30-21:30 / 週六上午',
    shifts: {
      days: [1, 2, 3, 4, 5, 6],
      morning: { start: '09:00', end: '12:00' },
      afternoon: { start: '14:00', end: '17:30' },
      evening: { start: '18:30', end: '21:30' }
    },
    latitude: 25.0336,
    longitude: 121.5401,
    tags: ['12導程心電圖', '24小時動態血壓監測', '心臟超音波'],
    bookingUrl: 'https://daan-cardio.webreg.tw/booking'
  },
  {
    id: 'tpe-neuro-01',
    name: '安民腦神經內科頭痛眩暈專科診所',
    departmentCodes: ['NEURO', 'INTERNAL'],
    departmentNames: ['神經內科', '一般內科'],
    city: '台北市',
    district: '大安區',
    address: '台北市大安區和平東路一段 180 號',
    phone: '02-2362-3344',
    distanceKm: 1.4,
    hoursDescription: '週一至週五 09:00-12:00, 14:00-18:00, 19:00-21:30 / 週六上午',
    shifts: {
      days: [1, 2, 3, 4, 5, 6],
      morning: { start: '09:00', end: '12:00' },
      afternoon: { start: '14:00', end: '18:00' },
      evening: { start: '19:00', end: '21:30' }
    },
    latitude: 25.0272,
    longitude: 121.5312,
    tags: ['偏頭痛專門', '耳石復位治療', '自律神經檢測'],
    bookingUrl: 'https://anmin-neuro.webreg.com.tw/'
  },
  {
    id: 'tpe-ortho-01',
    name: '力康骨科復健科聯合診所',
    departmentCodes: ['ORTHO', 'REHAB'],
    departmentNames: ['骨科', '復健科'],
    city: '台北市',
    district: '中山區',
    address: '台北市中山區南京東路二段 101 號',
    phone: '02-2567-2288',
    distanceKm: 1.1,
    hoursDescription: '週一至週六 08:30-12:00, 14:00-17:30, 18:30-21:30',
    shifts: {
      days: [1, 2, 3, 4, 5, 6],
      morning: { start: '08:30', end: '12:00' },
      afternoon: { start: '14:00', end: '17:30' },
      evening: { start: '18:30', end: '21:30' }
    },
    latitude: 25.0521,
    longitude: 121.5322,
    tags: ['數位 X 光機', '超音波導引注射', '急性扭傷處置'],
    bookingUrl: 'https://likang-ortho.webreg.tw/reserve'
  },
  {
    id: 'tpe-derma-01',
    name: '博愛皮膚專科過敏診所',
    departmentCodes: ['DERMA'],
    departmentNames: ['皮膚科'],
    city: '台北市',
    district: '中正區',
    address: '台北市中正區博愛路 112 號',
    phone: '02-2311-7788',
    distanceKm: 0.6,
    hoursDescription: '週一至週五 09:30-12:30, 14:30-17:30, 18:30-21:00 / 週六上午',
    shifts: {
      days: [1, 2, 3, 4, 5, 6],
      morning: { start: '09:30', end: '12:30' },
      afternoon: { start: '14:30', end: '17:30' },
      evening: { start: '18:30', end: '21:00' }
    },
    latitude: 25.0418,
    longitude: 121.5115,
    tags: ['急性蕁麻疹', '帶狀皰疹快速評估', '皮膚鏡檢'],
    bookingUrl: 'https://boai-skin.webreg.tw/appointment'
  },
  // 台北急診醫院
  {
    id: 'hosp-ntuh',
    name: '國立臺灣大學醫學院附設醫院 (台大醫院總院急診室)',
    departmentCodes: ['EMERGENCY', 'ALL'],
    departmentNames: ['24H急診', '各專科醫學中心'],
    city: '台北市',
    district: '中正區',
    address: '台北市中正區中山南路 7 號 (急診處入口近常德街)',
    phone: '02-2356-2135',
    distanceKm: 0.5,
    isEmergencyHospital: true,
    hoursDescription: '24小時全年無休 (急診創傷重症急救中心)',
    shifts: {
      days: [0, 1, 2, 3, 4, 5, 6],
      morning: { start: '00:00', end: '23:59' }
    },
    latitude: 25.0416,
    longitude: 121.5178,
    tags: ['醫學中心', '24小時急診', '重度級急救責任醫院', '急性心肌梗塞/腦中風綠色通道'],
    bookingUrl: 'https://reg.ntuh.gov.tw/WebReg/'
  },
  {
    id: 'hosp-mmh',
    name: '馬偕紀念醫院 (台北院區急診醫學部)',
    departmentCodes: ['EMERGENCY', 'ALL', 'PEDIATRIC'],
    departmentNames: ['24H急診', '小兒急診專門', '各專科'],
    city: '台北市',
    district: '中山區',
    address: '台北市中山區中山北路二段 92 號',
    phone: '02-2543-3535',
    distanceKm: 1.8,
    isEmergencyHospital: true,
    hoursDescription: '24小時全年無休 (設有獨立小兒急診)',
    shifts: {
      days: [0, 1, 2, 3, 4, 5, 6],
      morning: { start: '00:00', end: '23:59' }
    },
    latitude: 25.0592,
    longitude: 121.5226,
    tags: ['醫學中心', '24H急診', '小兒急症專長', '心導管小組隨時待命'],
    bookingUrl: 'https://www.mmh.org.tw/register.php'
  },

  // 新北市
  {
    id: 'ntpc-ent-01',
    name: '板橋信彰耳鼻喉科家醫科診所',
    departmentCodes: ['ENT', 'FAMILY'],
    departmentNames: ['耳鼻喉科', '家醫科'],
    city: '新北市',
    district: '板橋區',
    address: '新北市板橋區文化路一段 188 號',
    phone: '02-2258-4567',
    distanceKm: 0.6,
    hoursDescription: '週一至週日 08:30-12:00, 14:30-17:30, 18:30-21:30 (週日僅早診)',
    shifts: {
      days: [0, 1, 2, 3, 4, 5, 6],
      morning: { start: '08:30', end: '12:00' },
      afternoon: { start: '14:30', end: '17:30' },
      evening: { start: '18:30', end: '21:30' }
    },
    latitude: 25.0152,
    longitude: 121.4645,
    tags: ['週日開診', '公費快篩', '中耳炎顯微鏡檢查'],
    bookingUrl: 'https://xinzhang-ent.webreg.tw/reserve'
  },
  {
    id: 'ntpc-gi-01',
    name: '健昇內科胃腸科聯合診所',
    departmentCodes: ['GI', 'INTERNAL', 'FAMILY'],
    departmentNames: ['腸胃肝膽科', '一般內科'],
    city: '新北市',
    district: '板橋區',
    address: '新北市板橋區府中路 35 號',
    phone: '02-2968-3322',
    distanceKm: 0.8,
    hoursDescription: '週一至週六 09:00-12:00, 14:00-17:30, 18:30-21:30',
    shifts: {
      days: [1, 2, 3, 4, 5, 6],
      morning: { start: '09:00', end: '12:00' },
      afternoon: { start: '14:00', end: '17:30' },
      evening: { start: '18:30', end: '21:30' }
    },
    latitude: 25.0089,
    longitude: 121.4588,
    tags: ['腹部超音波', '幽門螺旋桿菌快檢', '急慢性胃炎處置'],
    bookingUrl: 'https://jiansheng-clinic.webreg.tw/'
  },
  {
    id: 'hosp-femh',
    name: '亞東紀念醫院 (急診醫學部)',
    departmentCodes: ['EMERGENCY', 'ALL'],
    departmentNames: ['24H急診', '重症醫學中心'],
    city: '新北市',
    district: '板橋區',
    address: '新北市板橋區南雅南路二段 21 號',
    phone: '02-7728-2122',
    distanceKm: 1.5,
    isEmergencyHospital: true,
    hoursDescription: '24小時全年無休 (新北首屈一指重度急救)',
    shifts: {
      days: [0, 1, 2, 3, 4, 5, 6],
      morning: { start: '00:00', end: '23:59' }
    },
    latitude: 24.9981,
    longitude: 121.4526,
    tags: ['醫學中心', '24H急診', '急重症救護中心', '外傷中心'],
    bookingUrl: 'https://www.femh.org.tw/visit/visit.aspx'
  },

  // 台中市
  {
    id: 'txg-ent-01',
    name: '逢甲弘仁耳鼻喉科小兒科診所',
    departmentCodes: ['ENT', 'PEDIATRIC', 'FAMILY'],
    departmentNames: ['耳鼻喉科', '小兒科', '家醫科'],
    city: '台中市',
    district: '西屯區',
    address: '台中市西屯區河南路二段 312 號',
    phone: '04-2451-9988',
    distanceKm: 0.5,
    hoursDescription: '週一至週六 08:30-12:00, 14:30-18:00, 18:30-21:30',
    shifts: {
      days: [1, 2, 3, 4, 5, 6],
      morning: { start: '08:30', end: '12:00' },
      afternoon: { start: '14:30', end: '18:00' },
      evening: { start: '18:30', end: '21:30' }
    },
    latitude: 24.1755,
    longitude: 120.6482,
    tags: ['兒科用藥專業', '吸鼻治療', '呼吸道過敏調理'],
    bookingUrl: 'https://hongren-ent.webreg.tw/booking'
  },
  {
    id: 'txg-cardio-01',
    name: '文心心臟血管胸腔內科診所',
    departmentCodes: ['CARDIO', 'INTERNAL', 'CHEST'],
    departmentNames: ['心臟內科', '胸腔內科'],
    city: '台中市',
    district: '西屯區',
    address: '台中市西屯區文心路三段 289 號',
    phone: '04-2317-5678',
    distanceKm: 1.2,
    hoursDescription: '週一至週五 09:00-12:00, 14:00-17:30, 18:30-21:00 / 週六上午',
    shifts: {
      days: [1, 2, 3, 4, 5, 6],
      morning: { start: '09:00', end: '12:00' },
      afternoon: { start: '14:00', end: '17:30' },
      evening: { start: '18:30', end: '21:00' }
    },
    latitude: 24.1678,
    longitude: 120.6542,
    tags: ['心電圖快速判讀', '高血壓胸悶專科', '氣喘噴霧處置'],
    bookingUrl: 'https://wenxin-clinic.webreg.tw/reserve'
  },
  {
    id: 'hosp-vghtc',
    name: '臺中榮民總醫院 (急診醫學部)',
    departmentCodes: ['EMERGENCY', 'ALL'],
    departmentNames: ['24H急診', '國家級醫學中心'],
    city: '台中市',
    district: '西屯區',
    address: '台中市西屯區臺灣大道四段 1650 號',
    phone: '04-2359-2525',
    distanceKm: 2.1,
    isEmergencyHospital: true,
    hoursDescription: '24小時全年無休 (急診急救大樓)',
    shifts: {
      days: [0, 1, 2, 3, 4, 5, 6],
      morning: { start: '00:00', end: '23:59' }
    },
    latitude: 24.1856,
    longitude: 120.6053,
    tags: ['醫學中心', '24H急診', '急救重症專責醫院', '胸痛中心'],
    bookingUrl: 'https://register.vghtc.gov.tw/'
  },

  // 高雄市
  {
    id: 'khh-ent-01',
    name: '裕誠安民耳鼻喉科家醫診所',
    departmentCodes: ['ENT', 'FAMILY'],
    departmentNames: ['耳鼻喉科', '家醫科'],
    city: '高雄市',
    district: '左營區',
    address: '高雄市左營區裕誠路 420 號',
    phone: '07-558-8822',
    distanceKm: 0.5,
    hoursDescription: '週一至週六 08:30-12:00, 14:30-17:30, 18:30-21:30',
    shifts: {
      days: [1, 2, 3, 4, 5, 6],
      morning: { start: '08:30', end: '12:00' },
      afternoon: { start: '14:30', end: '17:30' },
      evening: { start: '18:30', end: '21:30' }
    },
    latitude: 22.6631,
    longitude: 120.3061,
    tags: ['公費篩檢', '感冒咽喉痛', '眩暈急症處理'],
    bookingUrl: 'https://yucheng-ent.webreg.tw/appointment'
  },
  {
    id: 'khh-gi-01',
    name: '博正腸胃肝膽科內科診所',
    departmentCodes: ['GI', 'INTERNAL'],
    departmentNames: ['腸胃肝膽科', '一般內科'],
    city: '高雄市',
    district: '左營區',
    address: '高雄市左營區博愛二路 356 號',
    phone: '07-556-3399',
    distanceKm: 0.7,
    hoursDescription: '週一至週五 09:00-12:00, 14:00-17:30, 18:30-21:00 / 週六上午',
    shifts: {
      days: [1, 2, 3, 4, 5, 6],
      morning: { start: '09:00', end: '12:00' },
      afternoon: { start: '14:00', end: '17:30' },
      evening: { start: '18:30', end: '21:00' }
    },
    latitude: 22.6605,
    longitude: 120.3032,
    tags: ['急慢性腸胃炎', '腹痛膽結石篩檢', '高階超音波'],
    bookingUrl: 'https://bozheng-gi.webreg.tw/reserve'
  },
  {
    id: 'hosp-vghks',
    name: '高雄榮民總醫院 (急診醫學部)',
    departmentCodes: ['EMERGENCY', 'ALL'],
    departmentNames: ['24H急診', '南部重症醫學中心'],
    city: '高雄市',
    district: '左營區',
    address: '高雄市左營區大中一路 386 號',
    phone: '07-342-2121',
    distanceKm: 1.8,
    isEmergencyHospital: true,
    hoursDescription: '24小時全年無休 (急診創傷中心)',
    shifts: {
      days: [0, 1, 2, 3, 4, 5, 6],
      morning: { start: '00:00', end: '23:59' }
    },
    latitude: 22.6806,
    longitude: 120.3197,
    tags: ['醫學中心', '24H急診', '急救責任醫院', '重度創傷救治'],
    bookingUrl: 'https://www6.vghks.gov.tw/register/'
  }
];

function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

export function getClinicOpenStatus(clinic: ClinicItem, date: Date = new Date()): ClinicOpenStatus {
  if (clinic.isEmergencyHospital) {
    return {
      status: 'OPEN',
      label: '24小時急診開診中',
      closesAt: '全天候24H服務'
    };
  }

  const day = date.getDay(); // 0-6
  const currentMinutes = date.getHours() * 60 + date.getMinutes();

  if (!clinic.shifts.days.includes(day)) {
    return {
      status: 'CLOSED',
      label: '今日休診',
      nextOpen: '明日開診'
    };
  }

  const shiftsList: { name: string; start: number; end: number; endStr: string; startStr: string }[] = [];
  if (clinic.shifts.morning) {
    shiftsList.push({
      name: '早診',
      start: timeToMinutes(clinic.shifts.morning.start),
      end: timeToMinutes(clinic.shifts.morning.end),
      endStr: clinic.shifts.morning.end,
      startStr: clinic.shifts.morning.start
    });
  }
  if (clinic.shifts.afternoon) {
    shiftsList.push({
      name: '午診',
      start: timeToMinutes(clinic.shifts.afternoon.start),
      end: timeToMinutes(clinic.shifts.afternoon.end),
      endStr: clinic.shifts.afternoon.end,
      startStr: clinic.shifts.afternoon.start
    });
  }
  if (clinic.shifts.evening) {
    shiftsList.push({
      name: '晚診',
      start: timeToMinutes(clinic.shifts.evening.start),
      end: timeToMinutes(clinic.shifts.evening.end),
      endStr: clinic.shifts.evening.end,
      startStr: clinic.shifts.evening.start
    });
  }

  // Check if currently open in any shift
  for (const s of shiftsList) {
    if (currentMinutes >= s.start && currentMinutes <= s.end) {
      return {
        status: 'OPEN',
        label: `營業中 (${s.name}至 ${s.endStr})`,
        closesAt: s.endStr
      };
    }
  }

  // Check if opening soon (e.g. within 60 mins before shift)
  for (const s of shiftsList) {
    if (currentMinutes < s.start) {
      const diff = s.start - currentMinutes;
      if (diff <= 60) {
        return {
          status: 'OPENING_SOON',
          label: `即將開診 (${s.startStr} 開始)`,
          opensAt: s.startStr
        };
      } else {
        return {
          status: 'CLOSED',
          label: `目前休診 (預計 ${s.startStr} 開診)`,
          nextOpen: s.startStr
        };
      }
    }
  }

  return {
    status: 'CLOSED',
    label: '今日門診已結束',
    nextOpen: '明日開診'
  };
}

export function filterClinics(
  city: string,
  district: string,
  departmentCodes: string[],
  isEmergencyOnly: boolean = false
): ClinicItem[] {
  let list = CLINICS_DATABASE.filter(c => {
    // Check city match or emergency hospital inclusion
    const cityMatch = c.city === city || c.isEmergencyHospital;
    if (!cityMatch) return false;

    if (isEmergencyOnly) {
      return !!c.isEmergencyHospital;
    }

    // Check department match or emergency
    const deptMatch = c.departmentCodes.some(d => departmentCodes.includes(d) || d === 'ALL');
    return deptMatch || c.isEmergencyHospital;
  });

  // Sort by emergency priority, then district match, then distance
  list.sort((a, b) => {
    if (isEmergencyOnly) {
      if (a.isEmergencyHospital && !b.isEmergencyHospital) return -1;
      if (!a.isEmergencyHospital && b.isEmergencyHospital) return 1;
    }
    const aDistrictMatch = a.district === district ? 0 : 1;
    const bDistrictMatch = b.district === district ? 0 : 1;
    if (aDistrictMatch !== bDistrictMatch) return aDistrictMatch - bDistrictMatch;
    return a.distanceKm - b.distanceKm;
  });

  return list;
}
