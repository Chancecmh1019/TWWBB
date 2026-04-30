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
      { id: "v1", label: "於紅線違規停車", requiresPlate: true },
      { id: "v2", label: "長時間佔用黃線停車", requiresPlate: true },
      { id: "v3", label: "違規併排停車", requiresPlate: true },
      { id: "v4", label: "於交岔路口處違規停車", requiresPlate: true },
      { id: "v5", label: "於黃網狀線違規停車", requiresPlate: true },
      { id: "v6", label: "於槽化線違規停車", requiresPlate: true },
      { id: "v7", label: "於卸貨格違規停車", requiresPlate: true },
      { id: "v8", label: "於人行道違規停車", requiresPlate: true },
      { id: "v9", label: "於騎樓違規停車", requiresPlate: true },
      { id: "v10", label: "於騎樓綠色標線違規停車", requiresPlate: true },
      { id: "v11", label: "於行人穿越道違規停車", requiresPlate: true },
      { id: "v12", label: "未緊靠右側停車", requiresPlate: true },
      { id: "v13", label: "未順向停車", requiresPlate: true },
      { id: "v14", label: "於公車站牌十公尺內停車", requiresPlate: true },
      { id: "v15", label: "於消防栓五公尺內停車", requiresPlate: true }
    ]
  },
  {
    id: "occupy",
    title: "車位佔用",
    iconName: "alertTriangle",
    items: [
      { id: "o1", label: "佔用機車停車格", requiresPlate: true },
      { id: "o2", label: "佔用汽車停車格", requiresPlate: true },
      { id: "o3", label: "佔用公車停靠區", requiresPlate: true },
      { id: "o4", label: "佔用身障停車格", requiresPlate: true }
    ]
  },
  {
    id: "roadhog",
    title: "路霸佔用",
    iconName: "shieldAlert",
    items: [
      { id: "h1", label: "佔用人行道 (營業/雜物/活動)", requiresPlate: false },
      { id: "h2", label: "佔用騎樓 (營業/雜物/活動)", requiresPlate: false },
      { id: "h3", label: "佔用騎樓綠色標線", requiresPlate: false },
      { id: "h4", label: "佔用路肩 (營業/雜物/活動)", requiresPlate: false },
      { id: "h5", label: "佔用道路 (營業/雜物/活動)", requiresPlate: false },
      { id: "h6", label: "佔用汽車停車格 (非車輛)", requiresPlate: false },
      { id: "h7", label: "佔用機車停車格 (非車輛)", requiresPlate: false }
    ]
  }
];
