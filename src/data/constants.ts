export const PoliceNumbers: Record<string, string> = {
  "基隆市": "0911-510-918",
  "keelung city": "0911-510-918",
  "臺北市": "0911-510-914",
  "台北市": "0911-510-914",
  "taipei city": "0911-510-914",
  "新北市": "0911-510-105",
  "new taipei city": "0911-510-105",
  "桃園市": "0917-110-880",
  "taoyuan city": "0917-110-880",
  "新竹市": "0911-510-919",
  "hsinchu city": "0911-510-919",
  "新竹縣": "0911-510-921",
  "hsinchu county": "0911-510-921",
  "苗栗縣": "0911-510-922",
  "miaoli county": "0911-510-922",
  "臺中市": "0911-510-915",
  "台中市": "0911-510-915",
  "taichung city": "0911-510-915",
  "彰化縣": "0911-510-933",
  "changhua county": "0911-510-933",
  "南投縣": "0911-510-923",
  "nantou county": "0911-510-923",
  "雲林縣": "0911-510-924",
  "yunlin county": "0911-510-924",
  "嘉義市": "0911-510-920",
  "chiayi city": "0911-510-920",
  "嘉義縣": "0911-510-925",
  "chiayi county": "0911-510-925",
  "臺南市": "0911-510-916",
  "台南市": "0911-510-916",
  "tainan city": "0911-510-916",
  "高雄市": "0911-510-917",
  "kaohsiung city": "0911-510-917",
  "屏東縣": "0911-510-926",
  "pingtung county": "0911-510-926",
  "宜蘭縣": "0911-510-927",
  "yilan county": "0911-510-927",
  "花蓮縣": "0911-510-928",
  "hualien county": "0911-510-928",
  "臺東縣": "0911-510-929",
  "台東縣": "0911-510-929",
  "taitung county": "0911-510-929",
  "澎湖縣": "0911-510-930",
  "penghu county": "0911-510-930",
  "金門縣": "0911-510-931",
  "kinmen county": "0911-510-931",
  "連江縣": "0911-510-932",
  "lienchiang county": "0911-510-932"
};

export type ReportCategory = {
  id: string;
  title: string;
  iconName: string;
  items: ReportItem[];
};

export type ReportItem = {
  id: string;
  label: string;
  description?: string;
  requiresPlate?: boolean;
};

export const ReportCategories: ReportCategory[] = [
  {
    id: "parking",
    title: "違規停車",
    iconName: "car",
    items: [
      { id: "p1", label: "紅線違停", requiresPlate: true },
      { id: "p2", label: "人行道違停", requiresPlate: true },
      { id: "p3", label: "併排停車", requiresPlate: true },
      { id: "p4", label: "佔用身心障礙車位", requiresPlate: true },
      { id: "p5", label: "網狀線違停", requiresPlate: true },
      { id: "p6", label: "阻礙交通出入", requiresPlate: true },
      { id: "p7", label: "佔用消防通道", requiresPlate: true },
      { id: "p8", label: "公車停靠區違停", requiresPlate: true }
    ]
  },
  {
    id: "traffic",
    title: "交通違規",
    iconName: "alertTriangle",
    items: [
      { id: "t1", label: "闖紅燈", requiresPlate: true },
      { id: "t2", label: "逆向行駛", requiresPlate: true },
      { id: "t3", label: "跨越雙黃線", requiresPlate: true },
      { id: "t4", label: "蛇行/危險駕駛", requiresPlate: true },
      { id: "t5", label: "未戴安全帽", requiresPlate: true }
    ]
  },
  {
    id: "noise",
    title: "妨害安寧",
    iconName: "volume2",
    items: [
      { id: "n1", label: "深夜喧嘩/鄰居家暴噪音", requiresPlate: false },
      { id: "n2", label: "施工噪音", requiresPlate: false },
      { id: "n3", label: "營業場所噪音", requiresPlate: false },
      { id: "n4", label: "改裝車輛噪音", requiresPlate: true }
    ]
  },
  {
    id: "safety",
    title: "治安維護",
    iconName: "shieldAlert",
    items: [
      { id: "s1", label: "發現可疑人士", requiresPlate: false },
      { id: "s2", label: "聚眾鬥毆", requiresPlate: false },
      { id: "s3", label: "疑似竊盜行為", requiresPlate: false },
      { id: "s4", label: "疑似詐騙行為", requiresPlate: false },
      { id: "s5", label: "發現可疑物品", requiresPlate: false }
    ]
  },
  {
    id: "other",
    title: "其他協助",
    iconName: "helpCircle",
    items: [
      { id: "o1", label: "號誌故障", requiresPlate: false },
      { id: "o2", label: "道路散落物", requiresPlate: false },
      { id: "o3", label: "路樹倒塌/積水", requiresPlate: false },
      { id: "o4", label: "迷失老人/兒童協助", requiresPlate: false }
    ]
  }
];
