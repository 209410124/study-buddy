export type HistoryEvent = {
  id: string;
  title: string;
  description: string;
  category: string;
  role: string;
};

export const historyEvents: HistoryEvent[] = [
  {
    id: "overview",
    title: "總覽：日治時期的台灣",
    description: "See the big picture of Taiwan under Japanese rule from 1895 to 1945.",
    category: "Overview",
    role: "A Taiwanese student living during the Japanese colonial period",
  },
  {
    id: "education",
    title: "教育與語言政策",
    description: "Understand how schools, Japanese language, and identity were connected.",
    category: "Education",
    role: "A Taiwanese student learning Japanese at school",
  },
  {
    id: "treaty",
    title: "馬關條約",
    description: "Explore how people in Taiwan faced the sudden transfer to Japanese rule.",
    category: "Political change",
    role: "A Taiwanese person hearing that Taiwan was ceded to Japan in 1895",
  },
  {
    id: "republic-formosa",
    title: "台灣民主國",
    description: "Learn why some Taiwanese people tried to resist Japanese takeover in 1895.",
    category: "Resistance",
    role: "A local Taiwanese person during the Republic of Formosa period",
  },
  {
    id: "infrastructure",
    title: "鐵路建設與現代化",
    description: "Compare the benefits of railways with their role in colonial control.",
    category: "Modernization",
    role: "A railway worker in colonial Taiwan",
  },
  {
    id: "police-system",
    title: "警察制度與地方控制",
    description: "Examine how police power reached into local daily life.",
    category: "Control",
    role: "A Taiwanese village resident under the colonial police system",
  },
  {
    id: "sugar",
    title: "糖業與殖民經濟",
    description: "Study sugar production, factories, workers, and colonial economic planning.",
    category: "Economy",
    role: "A sugar factory worker in colonial Taiwan",
  },
  {
    id: "public-health",
    title: "公共衛生政策",
    description: "Think about health improvements and government control in daily life.",
    category: "Public health",
    role: "A public health officer in colonial Taiwan",
  },
  {
    id: "xilai-temple",
    title: "西來庵事件",
    description: "Understand local resistance and the shift away from armed uprisings.",
    category: "Resistance",
    role: "A Taiwanese resident during the Tapani Incident",
  },
  {
    id: "cultural-association",
    title: "台灣文化協會",
    description: "Learn how lectures, newspapers, and culture became forms of activism.",
    category: "Social movement",
    role: "A member of the Taiwan Cultural Association",
  },
  {
    id: "parliament-petition",
    title: "台灣議會設置請願運動",
    description: "Explore legal petitions and the demand for political representation.",
    category: "Political movement",
    role: "A Taiwanese intellectual supporting the petition movement",
  },
  {
    id: "taisho-democracy",
    title: "大正民主與台灣社會運動",
    description: "See how democratic ideas shaped Taiwanese activism in the 1920s.",
    category: "Political ideas",
    role: "A Taiwanese social activist in the 1920s",
  },
  {
    id: "wushe",
    title: "霧社事件",
    description: "Understand Indigenous resistance and colonial rule in 1930.",
    category: "Resistance",
    role: "Mona Rudao",
  },
  {
    id: "musha-aftermath",
    title: "霧社事件後的影響",
    description: "Study how one event could change policy, memory, and communities.",
    category: "Aftermath",
    role: "An Indigenous survivor after the Wushe Incident",
  },
  {
    id: "rokusan-law",
    title: "六三法與殖民法律權力",
    description: "Learn how law could concentrate power in the colonial government.",
    category: "Law",
    role: "A Taiwanese resident living under colonial legal control",
  },
  {
    id: "land-survey",
    title: "土地調查事業",
    description: "Connect land records, taxes, farming, and colonial administration.",
    category: "Administration",
    role: "A Taiwanese farmer during the land survey project",
  },
  {
    id: "goto-shinpei",
    title: "兒玉源太郎與後藤新平改革",
    description: "Examine early reforms that modernized Taiwan and strengthened rule.",
    category: "Reform",
    role: "A Taiwanese resident experiencing early colonial reforms",
  },
  {
    id: "trunk-railway",
    title: "縱貫鐵路通車",
    description: "Think about travel, trade, communication, and colonial infrastructure.",
    category: "Transportation",
    role: "A passenger using the North-South Railway in colonial Taiwan",
  },
  {
    id: "jianan-canal",
    title: "嘉南大圳與八田與一",
    description: "Explore irrigation, farming, technology, and colonial economic goals.",
    category: "Agriculture",
    role: "A farmer in the Chianan Plain",
  },
  {
    id: "penglai-rice",
    title: "蓬萊米與農業變化",
    description: "Learn how science and farming connected Taiwan to Japan's needs.",
    category: "Agriculture",
    role: "A Taiwanese farmer growing Penglai rice",
  },
  {
    id: "taiwan-peoples-party",
    title: "台灣民眾黨",
    description: "Study organized political activism and pressure from colonial authority.",
    category: "Political movement",
    role: "A member of the Taiwanese People's Party",
  },
  {
    id: "local-autonomy-league",
    title: "台灣地方自治聯盟",
    description: "Understand the call for local self-government under colonial rule.",
    category: "Self-government",
    role: "A Taiwanese person supporting local self-government",
  },
  {
    id: "taiwan-minpao",
    title: "台灣民報與公共輿論",
    description: "Learn how writing and newspapers shaped public opinion.",
    category: "Media",
    role: "A writer for Taiwan Minpao",
  },
  {
    id: "sun-moon-lake-power",
    title: "日月潭水力發電工程",
    description: "Connect electricity, industry, local change, and colonial planning.",
    category: "Industry",
    role: "A worker involved in the Sun Moon Lake hydroelectric project",
  },
  {
    id: "air-raids",
    title: "二戰末期台灣空襲",
    description: "Understand how war affected ordinary people in late colonial Taiwan.",
    category: "War",
    role: "A Taiwanese civilian during the late-war air raids",
  },
  {
    id: "southward-policy",
    title: "台灣與日本南進",
    description: "See how Taiwan became part of Japan's wider wartime expansion.",
    category: "Empire",
    role: "A Taiwanese person affected by Japan's southward expansion policy",
  },
  {
    id: "kominka",
    title: "皇民化與戰爭動員",
    description: "Examine language, identity, pressure, and wartime mobilization.",
    category: "Wartime policy",
    role: "A Taiwanese student during the Kominka Movement",
  },
];

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
