export type HistoryEvent = {
  id: string;
  year: string;
  title: string;
  description: string;
  category: string;
  role: string;
};

const historyEventTimelineOrder: Record<string, number> = {
  overview: 0,
  treaty: 1,
  "republic-formosa": 2,
  "rokusan-law": 3,
  "goto-shinpei": 4,
  "land-survey": 5,
  "police-system": 6,
  infrastructure: 7,
  "public-health": 8,
  sugar: 9,
  "trunk-railway": 10,
  education: 11,
  "xilai-temple": 12,
  "cultural-association": 13,
  "parliament-petition": 14,
  "taisho-democracy": 15,
  "taiwan-minpao": 16,
  "penglai-rice": 17,
  "taiwan-peoples-party": 18,
  "jianan-canal": 19,
  wushe: 20,
  "local-autonomy-league": 21,
  "musha-aftermath": 22,
  "sun-moon-lake-power": 23,
  "southward-policy": 24,
  kominka: 25,
  "air-raids": 26,
};

export const historyEvents: HistoryEvent[] = ([
  {
    id: "overview",
    year: "1895-1945",
    title: "總覽：日治時期的台灣",
    description: "See the big picture of Taiwan under Japanese rule from 1895 to 1945.",
    category: "Overview",
    role: "A Taiwanese student living during the Japanese colonial period",
  },
  {
    id: "education",
    year: "1895-1945",
    title: "教育與語言政策",
    description: "Understand how schools, Japanese language, and identity were connected.",
    category: "Education",
    role: "A Taiwanese student learning Japanese at school",
  },
  {
    id: "treaty",
    year: "1895",
    title: "馬關條約",
    description: "Explore how people in Taiwan faced the sudden transfer to Japanese rule.",
    category: "Political change",
    role: "A Taiwanese person hearing that Taiwan was ceded to Japan in 1895",
  },
  {
    id: "republic-formosa",
    year: "1895",
    title: "台灣民主國",
    description: "Learn why some Taiwanese people tried to resist Japanese takeover in 1895.",
    category: "Resistance",
    role: "A local Taiwanese person during the Republic of Formosa period",
  },
  {
    id: "infrastructure",
    year: "1899-1908",
    title: "鐵路建設與現代化",
    description: "Compare the benefits of railways with their role in colonial control.",
    category: "Modernization",
    role: "A railway worker in colonial Taiwan",
  },
  {
    id: "police-system",
    year: "1900s",
    title: "警察制度與地方控制",
    description: "Examine how police power reached into local daily life.",
    category: "Control",
    role: "A Taiwanese village resident under the colonial police system",
  },
  {
    id: "sugar",
    year: "1900s-1930s",
    title: "糖業與殖民經濟",
    description: "Study sugar production, factories, workers, and colonial economic planning.",
    category: "Economy",
    role: "A sugar factory worker in colonial Taiwan",
  },
  {
    id: "public-health",
    year: "1900s",
    title: "公共衛生政策",
    description: "Think about health improvements and government control in daily life.",
    category: "Public health",
    role: "A public health officer in colonial Taiwan",
  },
  {
    id: "xilai-temple",
    year: "1915",
    title: "西來庵事件",
    description: "Understand local resistance and the shift away from armed uprisings.",
    category: "Resistance",
    role: "A Taiwanese resident during the Tapani Incident",
  },
  {
    id: "cultural-association",
    year: "1921",
    title: "台灣文化協會",
    description: "Learn how lectures, newspapers, and culture became forms of activism.",
    category: "Social movement",
    role: "A member of the Taiwan Cultural Association",
  },
  {
    id: "parliament-petition",
    year: "1921-1934",
    title: "台灣議會設置請願運動",
    description: "Explore legal petitions and the demand for political representation.",
    category: "Political movement",
    role: "A Taiwanese intellectual supporting the petition movement",
  },
  {
    id: "taisho-democracy",
    year: "1920s",
    title: "大正民主與台灣社會運動",
    description: "See how democratic ideas shaped Taiwanese activism in the 1920s.",
    category: "Political ideas",
    role: "A Taiwanese social activist in the 1920s",
  },
  {
    id: "wushe",
    year: "1930",
    title: "霧社事件",
    description: "Understand Indigenous resistance and colonial rule in 1930.",
    category: "Resistance",
    role: "Mona Rudao",
  },
  {
    id: "musha-aftermath",
    year: "1930s",
    title: "霧社事件後的影響",
    description: "Study how one event could change policy, memory, and communities.",
    category: "Aftermath",
    role: "An Indigenous survivor after the Wushe Incident",
  },
  {
    id: "rokusan-law",
    year: "1896",
    title: "六三法與殖民法律權力",
    description: "Learn how law could concentrate power in the colonial government.",
    category: "Law",
    role: "A Taiwanese resident living under colonial legal control",
  },
  {
    id: "land-survey",
    year: "1898-1905",
    title: "土地調查事業",
    description: "Connect land records, taxes, farming, and colonial administration.",
    category: "Administration",
    role: "A Taiwanese farmer during the land survey project",
  },
  {
    id: "goto-shinpei",
    year: "1898-1906",
    title: "兒玉源太郎與後藤新平改革",
    description: "Examine early reforms that modernized Taiwan and strengthened rule.",
    category: "Reform",
    role: "A Taiwanese resident experiencing early colonial reforms",
  },
  {
    id: "trunk-railway",
    year: "1908",
    title: "縱貫鐵路通車",
    description: "Think about travel, trade, communication, and colonial infrastructure.",
    category: "Transportation",
    role: "A passenger using the North-South Railway in colonial Taiwan",
  },
  {
    id: "jianan-canal",
    year: "1930",
    title: "嘉南大圳與八田與一",
    description: "Explore irrigation, farming, technology, and colonial economic goals.",
    category: "Agriculture",
    role: "A farmer in the Chianan Plain",
  },
  {
    id: "penglai-rice",
    year: "1926",
    title: "蓬萊米與農業變化",
    description: "Learn how science and farming connected Taiwan to Japan's needs.",
    category: "Agriculture",
    role: "A Taiwanese farmer growing Penglai rice",
  },
  {
    id: "taiwan-peoples-party",
    year: "1927",
    title: "台灣民眾黨",
    description: "Study organized political activism and pressure from colonial authority.",
    category: "Political movement",
    role: "A member of the Taiwanese People's Party",
  },
  {
    id: "local-autonomy-league",
    year: "1930",
    title: "台灣地方自治聯盟",
    description: "Understand the call for local self-government under colonial rule.",
    category: "Self-government",
    role: "A Taiwanese person supporting local self-government",
  },
  {
    id: "taiwan-minpao",
    year: "1923",
    title: "台灣民報與公共輿論",
    description: "Learn how writing and newspapers shaped public opinion.",
    category: "Media",
    role: "A writer for Taiwan Minpao",
  },
  {
    id: "sun-moon-lake-power",
    year: "1934",
    title: "日月潭水力發電工程",
    description: "Connect electricity, industry, local change, and colonial planning.",
    category: "Industry",
    role: "A worker involved in the Sun Moon Lake hydroelectric project",
  },
  {
    id: "air-raids",
    year: "1944-1945",
    title: "二戰末期台灣空襲",
    description: "Understand how war affected ordinary people in late colonial Taiwan.",
    category: "War",
    role: "A Taiwanese civilian during the late-war air raids",
  },
  {
    id: "southward-policy",
    year: "1936-1945",
    title: "台灣與日本南進",
    description: "See how Taiwan became part of Japan's wider wartime expansion.",
    category: "Empire",
    role: "A Taiwanese person affected by Japan's southward expansion policy",
  },
  {
    id: "kominka",
    year: "1937-1945",
    title: "皇民化與戰爭動員",
    description: "Examine language, identity, pressure, and wartime mobilization.",
    category: "Wartime policy",
    role: "A Taiwanese student during the Kominka Movement",
  },
] as HistoryEvent[]).sort(
  (firstEvent, secondEvent) =>
    historyEventTimelineOrder[firstEvent.id] - historyEventTimelineOrder[secondEvent.id],
);

export const defaultHistoryEvent = historyEvents[0];

export function findHistoryEvent(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const decodedValue = decodeURIComponent(value).trim();
  const normalizedValue = decodedValue.toLowerCase();

  return (
    historyEvents.find(
      (event) =>
        event.id.toLowerCase() === normalizedValue ||
        event.title.toLowerCase() === normalizedValue,
    ) ?? null
  );
}
