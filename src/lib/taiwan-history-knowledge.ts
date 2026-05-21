import type { PassageLanguage, RolePlayRole } from "@/lib/types";

export type TaiwanHistoryTopic = {
  id: string;
  titleEn: string;
  titleZh: string;
  timeFrame: string;
  summaryEn: string;
  summaryZh: string;
  keyPointsEn: string[];
  keyPointsZh: string[];
};

export type TaiwanHistoryEvent = {
  id: string;
  nameEn: string;
  nameZh: string;
  year: string;
  summaryEn: string;
  summaryZh: string;
  significanceEn: string[];
  significanceZh: string[];
};

export type TaiwanReadingPassageOption = {
  id: string;
  titleEn: string;
  titleZh: string;
  passageEn: string;
  passageZh: string;
};

export const taiwanJapaneseColonialKnowledge: TaiwanHistoryTopic[] = [
  {
    id: "treaty-of-shimonoseki",
    titleEn: "Treaty of Shimonoseki and the beginning of Japanese rule",
    titleZh: "馬關條約與日本統治的開始",
    timeFrame: "1895",
    summaryEn:
      "After the Qing dynasty lost the First Sino-Japanese War, Taiwan was ceded to Japan through the Treaty of Shimonoseki in 1895. This began fifty years of Japanese colonial rule in Taiwan.",
    summaryZh:
      "1895年清朝在甲午戰爭後戰敗，依《馬關條約》將台灣割讓給日本，台灣進入長達五十年的日本殖民統治時期。",
    keyPointsEn: [
      "1895 marks the beginning of Japanese rule in Taiwan.",
      "Taiwanese people did not all accept the change peacefully.",
      "The new colonial government needed military and administrative power to control Taiwan.",
    ],
    keyPointsZh: [
      "1895年是台灣日治時期的開始。",
      "台灣社會並不是完全和平接受政權轉換。",
      "日本殖民政府需要軍事與行政力量來建立統治。",
    ],
  },
  {
    id: "governor-general",
    titleEn: "Governor-General system",
    titleZh: "台灣總督府制度",
    timeFrame: "1895-1945",
    summaryEn:
      "Japan ruled Taiwan through the Office of the Governor-General. The governor-general had strong military, political, and administrative power, especially in the early colonial period.",
    summaryZh:
      "日本透過台灣總督府統治台灣。總督擁有很大的軍事、政治與行政權力，特別是在統治初期，殖民政府的權力非常集中。",
    keyPointsEn: [
      "The governor-general represented Japanese colonial authority.",
      "Power was centralized, so local Taiwanese had limited political rights.",
      "Policies could affect education, police control, public health, and the economy.",
    ],
    keyPointsZh: [
      "台灣總督代表日本殖民政府的最高權力。",
      "權力集中，台灣人民的政治參與很有限。",
      "政策影響教育、警察制度、公共衛生與經濟發展。",
    ],
  },
  {
    id: "police-control",
    titleEn: "Police system and local control",
    titleZh: "警察制度與地方控制",
    timeFrame: "1895-1945",
    summaryEn:
      "The colonial government used police stations and local administration to manage daily life. Police helped enforce laws, collect information, and carry out government policies in villages and towns.",
    summaryZh:
      "殖民政府透過警察派出所與地方行政管理日常生活。警察除了維持治安，也負責執行政策、蒐集地方資訊，並深入村莊與市街。",
    keyPointsEn: [
      "Police power reached deeply into everyday life.",
      "This system helped the government control local society.",
      "People experienced both order and pressure under police rule.",
    ],
    keyPointsZh: [
      "警察權力深入人民日常生活。",
      "這套制度幫助殖民政府控制地方社會。",
      "人民一方面感受到秩序，另一方面也承受壓力。",
    ],
  },
  {
    id: "education",
    titleEn: "Education under Japanese rule",
    titleZh: "日治時期的教育",
    timeFrame: "1895-1945",
    summaryEn:
      "The Japanese colonial government expanded schools in Taiwan, but education also promoted Japanese language and loyalty to the empire. Access and treatment were not always equal for Taiwanese students.",
    summaryZh:
      "日本殖民政府在台灣推動學校教育，但教育也用來推廣日語與帝國忠誠。台灣學生受教育的機會增加，但待遇與升學機會並不完全平等。",
    keyPointsEn: [
      "Schools helped spread Japanese language and values.",
      "Some families hoped education could lead to better jobs.",
      "Education brought opportunities, but also colonial control.",
    ],
    keyPointsZh: [
      "學校教育推廣日語與日本價值觀。",
      "有些家庭希望透過教育取得較好的工作機會。",
      "教育帶來機會，也帶有殖民控制的目的。",
    ],
  },
  {
    id: "infrastructure",
    titleEn: "Railways, ports, and infrastructure",
    titleZh: "鐵路、港口與基礎建設",
    timeFrame: "1895-1945",
    summaryEn:
      "Japan built and improved railways, ports, roads, and communication systems in Taiwan. These projects made transportation and trade easier, but they also helped the colonial government move goods, soldiers, and information.",
    summaryZh:
      "日本在台灣興建與改善鐵路、港口、道路和通訊系統。這些建設讓交通與貿易更方便，也幫助殖民政府運送物資、軍隊與資訊。",
    keyPointsEn: [
      "Infrastructure supported modernization and economic development.",
      "Railways connected cities and production areas.",
      "Modernization also strengthened colonial control.",
    ],
    keyPointsZh: [
      "基礎建設促進現代化與經濟發展。",
      "鐵路連結城市與生產地區。",
      "現代化建設同時也強化殖民統治。",
    ],
  },
  {
    id: "sugar-industry",
    titleEn: "Sugar industry and colonial economy",
    titleZh: "糖業與殖民經濟",
    timeFrame: "1900s-1940s",
    summaryEn:
      "Sugar became one of Taiwan's most important industries under Japanese rule. Modern factories and railways increased production, but many economic benefits served Japan's imperial needs.",
    summaryZh:
      "糖業是日治時期台灣重要產業之一。現代化糖廠與鐵路提高了生產效率，但許多經濟利益也服務於日本帝國的需求。",
    keyPointsEn: [
      "Sugar production was closely tied to colonial economic planning.",
      "Factories and transport systems changed rural areas.",
      "Economic growth did not mean equal benefit for everyone.",
    ],
    keyPointsZh: [
      "糖業生產和殖民經濟規劃密切相關。",
      "糖廠與交通系統改變農村地區。",
      "經濟成長不代表所有人都公平受益。",
    ],
  },
  {
    id: "public-health",
    titleEn: "Public health and disease prevention",
    titleZh: "公共衛生與疾病防治",
    timeFrame: "1895-1945",
    summaryEn:
      "The colonial government promoted sanitation, hospitals, disease control, and public health campaigns. These policies improved some health conditions, but they were also connected to state control and colonial administration.",
    summaryZh:
      "殖民政府推動衛生、醫院、疾病防治與公共衛生政策。這些措施改善部分健康條件，但也和國家管理與殖民行政有關。",
    keyPointsEn: [
      "Public health campaigns changed daily habits.",
      "Disease prevention helped cities and workplaces function.",
      "Health policies could also increase government control over society.",
    ],
    keyPointsZh: [
      "公共衛生政策改變人民日常習慣。",
      "疾病防治有助於城市與工作場所運作。",
      "衛生政策也可能增加政府對社會的管理。",
    ],
  },
  {
    id: "resistance",
    titleEn: "Resistance and social movements",
    titleZh: "反抗與社會運動",
    timeFrame: "1895-1930s",
    summaryEn:
      "Taiwanese responses to Japanese rule included armed resistance, petitions, cultural movements, and political activism. Different people chose different ways to respond to colonial rule.",
    summaryZh:
      "台灣人面對日本統治有不同回應，包括武裝抗爭、請願、文化運動與政治活動。不同時期、不同群體採取的方式並不相同。",
    keyPointsEn: [
      "Resistance was not only armed fighting.",
      "Some people used newspapers, associations, and petitions.",
      "Social movements showed that Taiwanese people debated their future.",
    ],
    keyPointsZh: [
      "反抗不只有武裝衝突。",
      "有些人透過報紙、團體與請願表達意見。",
      "社會運動顯示台灣人會思考並爭取自己的未來。",
    ],
  },
  {
    id: "kominka",
    titleEn: "Kominka movement",
    titleZh: "皇民化運動",
    timeFrame: "1937-1945",
    summaryEn:
      "During the wartime years, Japan promoted the Kominka movement to make Taiwanese people more loyal to the Japanese empire. It encouraged Japanese language use, Japanese-style names, and support for the war.",
    summaryZh:
      "戰爭時期，日本推動皇民化運動，希望台灣人更加效忠日本帝國。政策鼓勵使用日語、改日本式姓名，並支持戰爭動員。",
    keyPointsEn: [
      "The movement became stronger during wartime.",
      "It tried to change language, identity, and daily behavior.",
      "Taiwanese people responded in different ways, from cooperation to pressure and resistance.",
    ],
    keyPointsZh: [
      "皇民化運動在戰爭時期更加強烈。",
      "它試圖改變語言、身分認同與日常行為。",
      "台灣人的反應不同，有人配合，也有人感到壓力或抗拒。",
    ],
  },
];

export const taiwanJapaneseColonialEvents: TaiwanHistoryEvent[] = [
  {
    id: "republic-of-formosa",
    nameEn: "Republic of Formosa and Japanese takeover",
    nameZh: "\u53f0\u7063\u6c11\u4e3b\u570b\u8207\u65e5\u672c\u63a5\u6536\u53f0\u7063",
    year: "1895",
    summaryEn:
      "After the Treaty of Shimonoseki, some Taiwanese elites declared the Republic of Formosa and tried to resist Japanese takeover. The new state lasted only a short time before Japanese forces took control.",
    summaryZh:
      "\u300a\u99ac\u95dc\u689d\u7d04\u300b\u5f8c\uff0c\u90e8\u5206\u53f0\u7063\u58eb\u7d33\u5ba3\u5e03\u6210\u7acb\u53f0\u7063\u6c11\u4e3b\u570b\uff0c\u8a66\u5716\u62b5\u6297\u65e5\u672c\u63a5\u6536\u53f0\u7063\u3002\u4f46\u9019\u500b\u653f\u6b0a\u7dad\u6301\u6642\u9593\u5f88\u77ed\uff0c\u65e5\u8ecd\u5f88\u5feb\u63a7\u5236\u53f0\u7063\u3002",
    significanceEn: [
      "Shows that some Taiwanese people resisted the transfer of Taiwan to Japan.",
      "Marks the unstable beginning of Japanese colonial rule.",
      "Helps students understand that colonial rule was not simply accepted by everyone.",
    ],
    significanceZh: [
      "\u986f\u793a\u90e8\u5206\u53f0\u7063\u4eba\u4e0d\u9858\u610f\u63a5\u53d7\u53f0\u7063\u88ab\u5272\u8b93\u7d66\u65e5\u672c\u3002",
      "\u4ee3\u8868\u65e5\u672c\u6b96\u6c11\u7d71\u6cbb\u521d\u671f\u7684\u4e0d\u7a69\u5b9a\u3002",
      "\u5e6b\u52a9\u5b78\u751f\u7406\u89e3\u6b96\u6c11\u7d71\u6cbb\u4e26\u4e0d\u662f\u6240\u6709\u4eba\u90fd\u5e73\u975c\u63a5\u53d7\u3002",
    ],
  },
  {
    id: "armed-resistance-1895",
    nameEn: "Armed resistance after 1895",
    nameZh: "1895\u5e74\u5f8c\u7684\u6b66\u88dd\u6297\u65e5",
    year: "1895-1902",
    summaryEn:
      "In the first years of Japanese rule, armed resistance appeared in several parts of Taiwan. Local groups fought Japanese forces, but the colonial government used military power and police control to suppress them.",
    summaryZh:
      "\u65e5\u672c\u7d71\u6cbb\u521d\u671f\uff0c\u53f0\u7063\u591a\u5730\u51fa\u73fe\u6b66\u88dd\u6297\u65e5\u884c\u52d5\u3002\u5730\u65b9\u5718\u9ad4\u8207\u65e5\u8ecd\u5c0d\u6297\uff0c\u4f46\u6b96\u6c11\u653f\u5e9c\u4ee5\u8ecd\u4e8b\u529b\u91cf\u548c\u8b66\u5bdf\u5236\u5ea6\u9010\u6b65\u93ae\u58d3\u3002",
    significanceEn: [
      "Explains why the early colonial period involved violence and conflict.",
      "Shows the connection between military rule and later police control.",
      "Gives students a concrete example of resistance.",
    ],
    significanceZh: [
      "\u8aaa\u660e\u7d71\u6cbb\u521d\u671f\u5145\u6eff\u885d\u7a81\u8207\u66b4\u529b\u3002",
      "\u986f\u793a\u8ecd\u4e8b\u7d71\u6cbb\u8207\u5f8c\u4f86\u8b66\u5bdf\u63a7\u5236\u4e4b\u9593\u7684\u95dc\u4fc2\u3002",
      "\u63d0\u4f9b\u5b78\u751f\u7406\u89e3\u6297\u722d\u7684\u5177\u9ad4\u4f8b\u5b50\u3002",
    ],
  },
  {
    id: "xilai-temple-incident",
    nameEn: "Xilai Temple Incident",
    nameZh: "\u897f\u4f86\u5eb5\u4e8b\u4ef6",
    year: "1915",
    summaryEn:
      "The Xilai Temple Incident was one of the major armed uprisings against Japanese rule. It took place in southern Taiwan and was harshly suppressed by the colonial government.",
    summaryZh:
      "\u897f\u4f86\u5eb5\u4e8b\u4ef6\u662f\u65e5\u6cbb\u6642\u671f\u91cd\u8981\u7684\u6b66\u88dd\u6297\u722d\u4e4b\u4e00\uff0c\u767c\u751f\u5728\u53f0\u7063\u5357\u90e8\uff0c\u5f8c\u4f86\u906d\u5230\u6b96\u6c11\u653f\u5e9c\u56b4\u5389\u93ae\u58d3\u3002",
    significanceEn: [
      "Often seen as one of the last large armed uprisings during Japanese rule.",
      "Shows how religion, local society, and resistance could connect.",
      "Helps explain the shift from armed resistance to political and cultural movements.",
    ],
    significanceZh: [
      "\u5e38\u88ab\u8996\u70ba\u65e5\u6cbb\u6642\u671f\u5f8c\u671f\u5927\u578b\u6b66\u88dd\u6297\u722d\u7684\u91cd\u8981\u4ee3\u8868\u3002",
      "\u986f\u793a\u5b97\u6559\u3001\u5730\u65b9\u793e\u6703\u8207\u6297\u722d\u53ef\u80fd\u4e92\u76f8\u9023\u7d50\u3002",
      "\u5e6b\u52a9\u8aaa\u660e\u53f0\u7063\u4eba\u7684\u6297\u722d\u9010\u6f38\u8f49\u5411\u653f\u6cbb\u8207\u6587\u5316\u904b\u52d5\u3002",
    ],
  },
  {
    id: "taiwan-cultural-association",
    nameEn: "Taiwan Cultural Association",
    nameZh: "\u53f0\u7063\u6587\u5316\u5354\u6703",
    year: "1921",
    summaryEn:
      "The Taiwan Cultural Association promoted lectures, newspapers, and cultural activities. It encouraged Taiwanese people to learn, discuss society, and think about political rights under colonial rule.",
    summaryZh:
      "\u53f0\u7063\u6587\u5316\u5354\u6703\u900f\u904e\u6f14\u8b1b\u3001\u5831\u7d19\u8207\u6587\u5316\u6d3b\u52d5\uff0c\u9f13\u52f5\u53f0\u7063\u4eba\u5b78\u7fd2\u65b0\u77e5\u3001\u8a0e\u8ad6\u793e\u6703\u554f\u984c\uff0c\u4e26\u601d\u8003\u6b96\u6c11\u7d71\u6cbb\u4e0b\u7684\u653f\u6cbb\u6b0a\u5229\u3002",
    significanceEn: [
      "Shows that resistance could be cultural and educational, not only military.",
      "Connected intellectuals, students, and local society.",
      "Useful for explaining modern civic awareness in colonial Taiwan.",
    ],
    significanceZh: [
      "\u986f\u793a\u6297\u722d\u4e0d\u53ea\u6709\u8ecd\u4e8b\u884c\u52d5\uff0c\u4e5f\u53ef\u4ee5\u662f\u6587\u5316\u8207\u6559\u80b2\u904b\u52d5\u3002",
      "\u9023\u7d50\u77e5\u8b58\u5206\u5b50\u3001\u5b78\u751f\u8207\u5730\u65b9\u793e\u6703\u3002",
      "\u9069\u5408\u7528\u4f86\u8aaa\u660e\u6b96\u6c11\u53f0\u7063\u7684\u73fe\u4ee3\u516c\u6c11\u610f\u8b58\u3002",
    ],
  },
  {
    id: "taiwan-parliament-petition",
    nameEn: "Petition Movement for a Taiwan Parliament",
    nameZh: "\u53f0\u7063\u8b70\u6703\u8a2d\u7f6e\u8acb\u9858\u904b\u52d5",
    year: "1921-1934",
    summaryEn:
      "Taiwanese activists repeatedly petitioned Japan to create a parliament for Taiwan. Although the movement did not succeed, it showed a desire for political participation and legal reform.",
    summaryZh:
      "\u53f0\u7063\u793e\u6703\u904b\u52d5\u8005\u591a\u6b21\u5411\u65e5\u672c\u8acb\u9858\uff0c\u5e0c\u671b\u8a2d\u7acb\u53f0\u7063\u8b70\u6703\u3002\u96d6\u7136\u904b\u52d5\u6c92\u6709\u6210\u529f\uff0c\u4f46\u5c55\u73fe\u53f0\u7063\u4eba\u5c0d\u653f\u6cbb\u53c3\u8207\u8207\u5236\u5ea6\u6539\u9769\u7684\u8ffd\u6c42\u3002",
    significanceEn: [
      "A clear example of legal and political activism.",
      "Shows Taiwanese demands for representation.",
      "Helps students compare armed resistance and petition movements.",
    ],
    significanceZh: [
      "\u662f\u6cd5\u5f8b\u8207\u653f\u6cbb\u904b\u52d5\u7684\u660e\u78ba\u4f8b\u5b50\u3002",
      "\u986f\u793a\u53f0\u7063\u4eba\u5c0d\u4ee3\u8868\u6b0a\u8207\u53c3\u653f\u6b0a\u7684\u8a34\u6c42\u3002",
      "\u5e6b\u52a9\u5b78\u751f\u6bd4\u8f03\u6b66\u88dd\u6297\u722d\u8207\u8acb\u9858\u904b\u52d5\u7684\u4e0d\u540c\u3002",
    ],
  },
  {
    id: "wushe-incident",
    nameEn: "Wushe Incident",
    nameZh: "\u9727\u793e\u4e8b\u4ef6",
    year: "1930",
    summaryEn:
      "The Wushe Incident was an uprising by Seediq people in central Taiwan against Japanese colonial rule. It was connected to long-term pressure, forced labor, and conflicts between Indigenous communities and colonial authorities.",
    summaryZh:
      "\u9727\u793e\u4e8b\u4ef6\u662f\u53f0\u7063\u4e2d\u90e8\u8cfd\u5fb7\u514b\u65cf\u4eba\u5c0d\u65e5\u672c\u6b96\u6c11\u7d71\u6cbb\u7684\u8d77\u4e8b\u3002\u4e8b\u4ef6\u8207\u9577\u671f\u58d3\u529b\u3001\u52de\u5f79\u554f\u984c\uff0c\u4ee5\u53ca\u539f\u4f4f\u6c11\u793e\u7fa4\u8207\u6b96\u6c11\u7576\u5c40\u7684\u885d\u7a81\u6709\u95dc\u3002",
    significanceEn: [
      "A major Indigenous resistance event during Japanese rule.",
      "Shows that colonial rule affected different groups in different ways.",
      "Helps students discuss power, identity, and resistance.",
    ],
    significanceZh: [
      "\u662f\u65e5\u6cbb\u6642\u671f\u91cd\u8981\u7684\u539f\u4f4f\u6c11\u6297\u722d\u4e8b\u4ef6\u3002",
      "\u986f\u793a\u6b96\u6c11\u7d71\u6cbb\u5c0d\u4e0d\u540c\u65cf\u7fa4\u7684\u5f71\u97ff\u4e0d\u76e1\u76f8\u540c\u3002",
      "\u5e6b\u52a9\u5b78\u751f\u8a0e\u8ad6\u6b0a\u529b\u3001\u8eab\u5206\u8a8d\u540c\u8207\u6297\u722d\u3002",
    ],
  },
  {
    id: "kominka-wartime-mobilization",
    nameEn: "Kominka and wartime mobilization",
    nameZh: "\u7687\u6c11\u5316\u8207\u6230\u722d\u52d5\u54e1",
    year: "1937-1945",
    summaryEn:
      "During the war against China and later World War II, Japan pushed Taiwanese society to support the empire. Policies promoted Japanese language, Japanese-style names, labor mobilization, and military service.",
    summaryZh:
      "\u4e2d\u65e5\u6230\u722d\u8207\u7b2c\u4e8c\u6b21\u4e16\u754c\u5927\u6230\u671f\u9593\uff0c\u65e5\u672c\u52a0\u5f37\u52d5\u54e1\u53f0\u7063\u793e\u6703\u652f\u6301\u5e1d\u570b\u6230\u722d\u3002\u653f\u7b56\u5305\u62ec\u63a8\u5ee3\u65e5\u8a9e\u3001\u6539\u65e5\u672c\u5f0f\u59d3\u540d\u3001\u52de\u52d5\u52d5\u54e1\u8207\u8ecd\u4e8b\u670d\u52d9\u3002",
    significanceEn: [
      "Shows how colonial policy became more intense during wartime.",
      "Connects identity policy with military and labor needs.",
      "Useful for explaining why the late colonial period felt different from earlier decades.",
    ],
    significanceZh: [
      "\u986f\u793a\u6230\u722d\u6642\u671f\u6b96\u6c11\u653f\u7b56\u8b8a\u5f97\u66f4\u5f37\u70c8\u3002",
      "\u9023\u7d50\u8eab\u5206\u8a8d\u540c\u653f\u7b56\u8207\u8ecd\u4e8b\u3001\u52de\u52d5\u9700\u6c42\u3002",
      "\u9069\u5408\u8aaa\u660e\u65e5\u6cbb\u5f8c\u671f\u8207\u524d\u671f\u7684\u4e0d\u540c\u3002",
    ],
  },
];

export const taiwanReadingPassageOptions: TaiwanReadingPassageOption[] = [
  {
    id: "overview",
    titleEn: "Overview: Taiwan under Japanese rule",
    titleZh: "\u7e3d\u89bd\uff1a\u65e5\u6cbb\u6642\u671f\u7684\u53f0\u7063",
    passageEn:
      "From 1895 to 1945, Taiwan was ruled by Japan. During this period, the colonial government built railways, improved ports, and expanded public health programs. These changes made travel and trade easier, but they also helped Japan control Taiwan more closely. Schools taught many students Japanese language and values, while some Taiwanese families hoped education could bring better jobs. At the same time, many people faced unfair treatment and had limited political power. Taiwanese society changed in many ways, and people responded differently to colonial rule.",
    passageZh:
      "\u5f9e1895\u5e74\u52301945\u5e74\uff0c\u53f0\u7063\u53d7\u5230\u65e5\u672c\u7d71\u6cbb\u3002\u5728\u9019\u6bb5\u6642\u671f\uff0c\u6b96\u6c11\u653f\u5e9c\u8208\u5efa\u9435\u8def\u3001\u6539\u5584\u6e2f\u53e3\uff0c\u4e5f\u63a8\u52d5\u516c\u5171\u885b\u751f\u653f\u7b56\u3002\u9019\u4e9b\u6539\u8b8a\u8b93\u4ea4\u901a\u548c\u8cbf\u6613\u66f4\u65b9\u4fbf\uff0c\u4f46\u4e5f\u5e6b\u52a9\u65e5\u672c\u66f4\u6709\u6548\u5730\u63a7\u5236\u53f0\u7063\u3002\u5b78\u6821\u6559\u5c0e\u8a31\u591a\u5b78\u751f\u65e5\u8a9e\u548c\u65e5\u672c\u50f9\u503c\u89c0\uff0c\u6709\u4e9b\u53f0\u7063\u5bb6\u5ead\u5e0c\u671b\u6559\u80b2\u80fd\u5e36\u4f86\u8f03\u597d\u7684\u5de5\u4f5c\u6a5f\u6703\u3002\u53e6\u4e00\u65b9\u9762\uff0c\u8a31\u591a\u4eba\u4ecd\u7136\u9762\u5c0d\u4e0d\u516c\u5e73\u5f85\u9047\uff0c\u4e5f\u7f3a\u5c11\u653f\u6cbb\u6b0a\u529b\u3002\u53f0\u7063\u793e\u6703\u56e0\u6b64\u51fa\u73fe\u8a31\u591a\u8b8a\u5316\uff0c\u800c\u4e0d\u540c\u7684\u4eba\u4e5f\u7528\u4e0d\u540c\u65b9\u5f0f\u56de\u61c9\u6b96\u6c11\u7d71\u6cbb\u3002",
  },
  {
    id: "education",
    titleEn: "Education and language policy",
    titleZh: "\u6559\u80b2\u8207\u8a9e\u8a00\u653f\u7b56",
    passageEn:
      "Schools became an important part of Japanese rule in Taiwan. The colonial government expanded education, and some Taiwanese families hoped schooling could help children get better jobs. However, education was also used to teach Japanese language, discipline, and loyalty to the empire. Taiwanese students did not always have the same opportunities as Japanese students. Education therefore brought new chances, but it also showed how colonial power shaped daily life and identity.",
    passageZh:
      "\u5b78\u6821\u662f\u65e5\u672c\u7d71\u6cbb\u53f0\u7063\u7684\u91cd\u8981\u5de5\u5177\u4e4b\u4e00\u3002\u6b96\u6c11\u653f\u5e9c\u64f4\u5927\u6559\u80b2\uff0c\u6709\u4e9b\u53f0\u7063\u5bb6\u5ead\u4e5f\u5e0c\u671b\u5b69\u5b50\u900f\u904e\u8b80\u66f8\u7372\u5f97\u66f4\u597d\u7684\u5de5\u4f5c\u6a5f\u6703\u3002\u4f46\u662f\uff0c\u6559\u80b2\u4e5f\u88ab\u7528\u4f86\u63a8\u5ee3\u65e5\u8a9e\u3001\u7d00\u5f8b\u8207\u5c0d\u5e1d\u570b\u7684\u5fe0\u8aa0\u3002\u53f0\u7063\u5b78\u751f\u548c\u65e5\u672c\u5b78\u751f\u7684\u6a5f\u6703\u4e26\u4e0d\u5b8c\u5168\u76f8\u540c\u3002\u56e0\u6b64\uff0c\u6559\u80b2\u5e36\u4f86\u65b0\u6a5f\u6703\uff0c\u4e5f\u986f\u793a\u6b96\u6c11\u6b0a\u529b\u5982\u4f55\u5f71\u97ff\u65e5\u5e38\u751f\u6d3b\u8207\u8eab\u5206\u8a8d\u540c\u3002",
  },
  {
    id: "treaty",
    titleEn: "Treaty of Shimonoseki",
    titleZh: "\u99ac\u95dc\u689d\u7d04",
    passageEn:
      "In 1895, the Qing dynasty ceded Taiwan to Japan after losing the First Sino-Japanese War. This agreement was called the Treaty of Shimonoseki. For people in Taiwan, the treaty meant a sudden change of ruler. Japan began to send troops and officials to take control of the island. Some Taiwanese people resisted because they did not want Taiwan to become a Japanese colony. The treaty is important because it marks the beginning of fifty years of Japanese rule in Taiwan.",
    passageZh:
      "1895\u5e74\uff0c\u6e05\u671d\u5728\u7532\u5348\u6230\u722d\u5f8c\u6230\u6557\uff0c\u4f9d\u300a\u99ac\u95dc\u689d\u7d04\u300b\u5c07\u53f0\u7063\u5272\u8b93\u7d66\u65e5\u672c\u3002\u5c0d\u53f0\u7063\u4eba\u4f86\u8aaa\uff0c\u9019\u4efd\u689d\u7d04\u4ee3\u8868\u7d71\u6cbb\u8005\u7a81\u7136\u6539\u8b8a\u3002\u65e5\u672c\u958b\u59cb\u6d3e\u9063\u8ecd\u968a\u8207\u5b98\u54e1\u63a5\u6536\u53f0\u7063\u3002\u4e00\u4e9b\u53f0\u7063\u4eba\u4e0d\u9858\u610f\u53f0\u7063\u6210\u70ba\u65e5\u672c\u6b96\u6c11\u5730\uff0c\u56e0\u6b64\u51fa\u73fe\u53cd\u6297\u3002\u300a\u99ac\u95dc\u689d\u7d04\u300b\u91cd\u8981\u7684\u5730\u65b9\u5728\u65bc\uff0c\u5b83\u6a19\u8a8c\u53f0\u7063\u4e94\u5341\u5e74\u65e5\u672c\u7d71\u6cbb\u7684\u958b\u59cb\u3002",
  },
  {
    id: "republic-formosa",
    titleEn: "Republic of Formosa",
    titleZh: "\u53f0\u7063\u6c11\u4e3b\u570b",
    passageEn:
      "After Taiwan was ceded to Japan in 1895, some Taiwanese elites declared the Republic of Formosa. They hoped to resist Japanese takeover and protect Taiwan from becoming a colony. However, the new state did not have enough military power or international support. Japanese forces soon entered Taiwan and took control. The Republic of Formosa lasted only a short time, but it shows that some people in Taiwan tried to respond actively to the sudden political change.",
    passageZh:
      "1895\u5e74\u53f0\u7063\u88ab\u5272\u8b93\u7d66\u65e5\u672c\u5f8c\uff0c\u90e8\u5206\u53f0\u7063\u58eb\u7d33\u5ba3\u5e03\u6210\u7acb\u53f0\u7063\u6c11\u4e3b\u570b\u3002\u4ed6\u5011\u5e0c\u671b\u62b5\u6297\u65e5\u672c\u63a5\u6536\uff0c\u907f\u514d\u53f0\u7063\u6210\u70ba\u6b96\u6c11\u5730\u3002\u4f46\u662f\uff0c\u9019\u500b\u65b0\u653f\u6b0a\u7f3a\u4e4f\u8db3\u5920\u7684\u8ecd\u4e8b\u529b\u91cf\u8207\u570b\u969b\u652f\u6301\u3002\u65e5\u8ecd\u5f88\u5feb\u9032\u5165\u53f0\u7063\u4e26\u53d6\u5f97\u63a7\u5236\u3002\u53f0\u7063\u6c11\u4e3b\u570b\u7dad\u6301\u6642\u9593\u5f88\u77ed\uff0c\u4f46\u5b83\u986f\u793a\u53f0\u7063\u6709\u4e9b\u4eba\u66fe\u7d93\u7a4d\u6975\u56de\u61c9\u7a81\u7136\u7684\u653f\u6cbb\u8b8a\u5316\u3002",
  },
  {
    id: "infrastructure",
    titleEn: "Railways and modernization",
    titleZh: "\u9435\u8def\u5efa\u8a2d\u8207\u73fe\u4ee3\u5316",
    passageEn:
      "The Japanese colonial government built railways, roads, ports, and communication systems in Taiwan. These projects made transportation faster and helped connect cities, farms, and factories. They also supported industries such as sugar production. However, modernization did not only help ordinary people. It also allowed the colonial government to move goods, soldiers, and information more efficiently. Railways show both the benefits and the limits of colonial modernization.",
    passageZh:
      "\u65e5\u672c\u6b96\u6c11\u653f\u5e9c\u5728\u53f0\u7063\u5efa\u8a2d\u9435\u8def\u3001\u9053\u8def\u3001\u6e2f\u53e3\u8207\u901a\u8a0a\u7cfb\u7d71\u3002\u9019\u4e9b\u5efa\u8a2d\u8b93\u4ea4\u901a\u66f4\u5feb\uff0c\u4e5f\u9023\u7d50\u57ce\u5e02\u3001\u8fb2\u6751\u548c\u5de5\u5ee0\u3002\u5b83\u5011\u540c\u6642\u652f\u6301\u7cd6\u696d\u7b49\u7522\u696d\u767c\u5c55\u3002\u7136\u800c\uff0c\u73fe\u4ee3\u5316\u4e26\u4e0d\u53ea\u662f\u5e6b\u52a9\u4e00\u822c\u4eba\u6c11\u3002\u5b83\u4e5f\u8b93\u6b96\u6c11\u653f\u5e9c\u66f4\u6709\u6548\u7387\u5730\u904b\u9001\u7269\u8cc7\u3001\u8ecd\u968a\u548c\u8cc7\u8a0a\u3002\u9435\u8def\u5efa\u8a2d\u986f\u793a\u4e86\u6b96\u6c11\u73fe\u4ee3\u5316\u7684\u597d\u8655\u8207\u9650\u5236\u3002",
  },
  {
    id: "police-system",
    titleEn: "Police system and local control",
    titleZh: "\u8b66\u5bdf\u5236\u5ea6\u8207\u5730\u65b9\u63a7\u5236",
    passageEn:
      "The police system was one of the most important tools of Japanese colonial rule in Taiwan. Police officers worked not only in cities but also in villages and mountain areas. They enforced laws, collected information, and helped carry out government policies. This system made the colonial government powerful in everyday life. Some people felt that police rule created order, but many also felt pressure because the government could watch and control local communities closely.",
    passageZh:
      "\u8b66\u5bdf\u5236\u5ea6\u662f\u65e5\u672c\u6b96\u6c11\u653f\u5e9c\u7d71\u6cbb\u53f0\u7063\u7684\u91cd\u8981\u5de5\u5177\u4e4b\u4e00\u3002\u8b66\u5bdf\u4e0d\u53ea\u5728\u57ce\u5e02\u5de5\u4f5c\uff0c\u4e5f\u9032\u5165\u6751\u838a\u548c\u5c71\u5730\u5730\u5340\u3002\u4ed6\u5011\u57f7\u884c\u6cd5\u5f8b\u3001\u8490\u96c6\u8cc7\u8a0a\uff0c\u4e26\u5354\u52a9\u63a8\u52d5\u653f\u5e9c\u653f\u7b56\u3002\u9019\u5957\u5236\u5ea6\u8b93\u6b96\u6c11\u653f\u5e9c\u80fd\u5920\u6df1\u5165\u65e5\u5e38\u751f\u6d3b\u3002\u6709\u4e9b\u4eba\u89ba\u5f97\u8b66\u5bdf\u7d71\u6cbb\u5e36\u4f86\u79e9\u5e8f\uff0c\u4f46\u8a31\u591a\u4eba\u4e5f\u611f\u5230\u58d3\u529b\uff0c\u56e0\u70ba\u653f\u5e9c\u80fd\u5920\u66f4\u7dca\u5bc6\u5730\u76e3\u8996\u8207\u63a7\u5236\u5730\u65b9\u793e\u6703\u3002",
  },
  {
    id: "sugar",
    titleEn: "Sugar industry and colonial economy",
    titleZh: "\u7cd6\u696d\u8207\u6b96\u6c11\u7d93\u6fdf",
    passageEn:
      "Sugar became one of Taiwan's most important industries under Japanese rule. The colonial government supported modern sugar factories, railways, and farming systems to increase production. Sugar helped Taiwan's economy grow, but much of the planning served Japan's imperial needs. Farmers and workers did not always share the benefits equally. The sugar industry shows how economic development and colonial control could happen at the same time.",
    passageZh:
      "\u7cd6\u696d\u662f\u65e5\u6cbb\u6642\u671f\u53f0\u7063\u91cd\u8981\u7684\u7522\u696d\u4e4b\u4e00\u3002\u6b96\u6c11\u653f\u5e9c\u652f\u6301\u73fe\u4ee3\u5316\u7cd6\u5ee0\u3001\u9435\u8def\u548c\u8fb2\u696d\u5236\u5ea6\uff0c\u4ee5\u63d0\u9ad8\u751f\u7522\u3002\u7cd6\u696d\u5e6b\u52a9\u53f0\u7063\u7d93\u6fdf\u6210\u9577\uff0c\u4f46\u8a31\u591a\u7d93\u6fdf\u898f\u5283\u4e5f\u670d\u52d9\u65e5\u672c\u5e1d\u570b\u7684\u9700\u8981\u3002\u8fb2\u6c11\u8207\u5de5\u4eba\u4e0d\u4e00\u5b9a\u80fd\u516c\u5e73\u5206\u4eab\u5229\u76ca\u3002\u7cd6\u696d\u986f\u793a\u7d93\u6fdf\u767c\u5c55\u548c\u6b96\u6c11\u63a7\u5236\u53ef\u80fd\u540c\u6642\u767c\u751f\u3002",
  },
  {
    id: "public-health",
    titleEn: "Public health campaigns",
    titleZh: "\u516c\u5171\u885b\u751f\u653f\u7b56",
    passageEn:
      "The Japanese colonial government promoted public health in Taiwan through sanitation campaigns, hospitals, disease prevention, and city planning. These policies helped reduce some diseases and changed daily habits. However, public health was also connected to government control. Officials needed clean streets, healthy workers, and stable cities to support colonial rule. Public health therefore brought real improvements, but it also increased the government's power over people's bodies and daily lives.",
    passageZh:
      "\u65e5\u672c\u6b96\u6c11\u653f\u5e9c\u900f\u904e\u885b\u751f\u904b\u52d5\u3001\u91ab\u9662\u3001\u75be\u75c5\u9632\u6cbb\u8207\u90fd\u5e02\u898f\u5283\uff0c\u5728\u53f0\u7063\u63a8\u52d5\u516c\u5171\u885b\u751f\u3002\u9019\u4e9b\u653f\u7b56\u5e6b\u52a9\u6e1b\u5c11\u4e00\u4e9b\u75be\u75c5\uff0c\u4e5f\u6539\u8b8a\u4eba\u5011\u7684\u65e5\u5e38\u7fd2\u6163\u3002\u7136\u800c\uff0c\u516c\u5171\u885b\u751f\u4e5f\u548c\u653f\u5e9c\u63a7\u5236\u6709\u95dc\u3002\u5b98\u54e1\u9700\u8981\u4e7e\u6de8\u7684\u8857\u9053\u3001\u5065\u5eb7\u7684\u52de\u52d5\u529b\u548c\u7a69\u5b9a\u7684\u57ce\u5e02\uff0c\u4ee5\u652f\u6301\u6b96\u6c11\u7d71\u6cbb\u3002\u56e0\u6b64\uff0c\u516c\u5171\u885b\u751f\u5e36\u4f86\u771f\u5be6\u6539\u5584\uff0c\u4e5f\u589e\u52a0\u653f\u5e9c\u5c0d\u4eba\u5011\u8eab\u9ad4\u8207\u751f\u6d3b\u7684\u7ba1\u7406\u3002",
  },
  {
    id: "xilai-temple",
    titleEn: "Xilai Temple Incident",
    titleZh: "\u897f\u4f86\u5eb5\u4e8b\u4ef6",
    passageEn:
      "The Xilai Temple Incident happened in 1915 in southern Taiwan. It was one of the important armed uprisings against Japanese rule. Some local people used religious networks and local connections to organize resistance. The colonial government suppressed the uprising harshly. This event is important because it shows that resistance did not disappear after the early years of Japanese rule, but it also shows why many later movements turned toward petitions, education, and cultural activities instead of armed fighting.",
    passageZh:
      "\u897f\u4f86\u5eb5\u4e8b\u4ef6\u767c\u751f\u57281915\u5e74\u7684\u53f0\u7063\u5357\u90e8\uff0c\u662f\u65e5\u6cbb\u6642\u671f\u91cd\u8981\u7684\u6b66\u88dd\u6297\u722d\u4e4b\u4e00\u3002\u4e00\u4e9b\u5730\u65b9\u4eba\u58eb\u900f\u904e\u5b97\u6559\u7db2\u7d61\u8207\u5730\u65b9\u95dc\u4fc2\u7d44\u7e54\u53cd\u6297\u884c\u52d5\u3002\u6b96\u6c11\u653f\u5e9c\u5f8c\u4f86\u56b4\u5389\u93ae\u58d3\u9019\u5834\u8d77\u4e8b\u3002\u9019\u500b\u4e8b\u4ef6\u91cd\u8981\u7684\u5730\u65b9\u5728\u65bc\uff0c\u5b83\u986f\u793a\u65e5\u672c\u7d71\u6cbb\u521d\u671f\u4e4b\u5f8c\u4ecd\u7136\u6709\u6b66\u88dd\u53cd\u6297\uff0c\u4e5f\u8aaa\u660e\u5f8c\u4f86\u8a31\u591a\u904b\u52d5\u9010\u6f38\u8f49\u5411\u8acb\u9858\u3001\u6559\u80b2\u8207\u6587\u5316\u6d3b\u52d5\u3002",
  },
  {
    id: "cultural-association",
    titleEn: "Taiwan Cultural Association",
    titleZh: "\u53f0\u7063\u6587\u5316\u5354\u6703",
    passageEn:
      "The Taiwan Cultural Association was founded in 1921. It promoted lectures, newspapers, and cultural activities. Instead of fighting with weapons, its members tried to awaken public knowledge and discuss social problems. Students, intellectuals, and local people learned about rights, society, and reform through these activities. The association shows that resistance under colonial rule could also happen through education, culture, and public discussion.",
    passageZh:
      "\u53f0\u7063\u6587\u5316\u5354\u6703\u6210\u7acb\u65bc1921\u5e74\u3002\u5b83\u900f\u904e\u6f14\u8b1b\u3001\u5831\u7d19\u8207\u6587\u5316\u6d3b\u52d5\u63a8\u52d5\u793e\u6703\u555f\u8499\u3002\u6210\u54e1\u4e0d\u662f\u4ee5\u6b66\u5668\u5c0d\u6297\u6b96\u6c11\u653f\u5e9c\uff0c\u800c\u662f\u5e0c\u671b\u63d0\u9ad8\u5927\u773e\u7684\u77e5\u8b58\u8207\u8a0e\u8ad6\u793e\u6703\u554f\u984c\u7684\u80fd\u529b\u3002\u5b78\u751f\u3001\u77e5\u8b58\u5206\u5b50\u8207\u5730\u65b9\u6c11\u773e\u900f\u904e\u9019\u4e9b\u6d3b\u52d5\u8a8d\u8b58\u6b0a\u5229\u3001\u793e\u6703\u8207\u6539\u9769\u3002\u53f0\u7063\u6587\u5316\u5354\u6703\u986f\u793a\uff0c\u6b96\u6c11\u7d71\u6cbb\u4e0b\u7684\u53cd\u6297\u4e5f\u53ef\u4ee5\u900f\u904e\u6559\u80b2\u3001\u6587\u5316\u8207\u516c\u5171\u8a0e\u8ad6\u4f86\u9032\u884c\u3002",
  },
  {
    id: "parliament-petition",
    titleEn: "Petition Movement for a Taiwan Parliament",
    titleZh: "\u53f0\u7063\u8b70\u6703\u8a2d\u7f6e\u8acb\u9858\u904b\u52d5",
    passageEn:
      "From 1921 to 1934, Taiwanese activists repeatedly asked Japan to create a parliament for Taiwan. They hoped Taiwanese people could have more political representation and a legal way to express opinions. The movement did not succeed, but it was important because it showed a shift from armed resistance to political action. It also showed that many Taiwanese people wanted rights, participation, and reform under colonial rule.",
    passageZh:
      "1921\u5e74\u52301934\u5e74\uff0c\u53f0\u7063\u793e\u6703\u904b\u52d5\u8005\u591a\u6b21\u5411\u65e5\u672c\u8acb\u9858\uff0c\u5e0c\u671b\u8a2d\u7acb\u53f0\u7063\u8b70\u6703\u3002\u4ed6\u5011\u5e0c\u671b\u53f0\u7063\u4eba\u80fd\u6709\u66f4\u591a\u653f\u6cbb\u4ee3\u8868\uff0c\u4e5f\u80fd\u4ee5\u5408\u6cd5\u65b9\u5f0f\u8868\u9054\u610f\u898b\u3002\u96d6\u7136\u904b\u52d5\u6c92\u6709\u6210\u529f\uff0c\u4f46\u5b83\u5f88\u91cd\u8981\uff0c\u56e0\u70ba\u5b83\u986f\u793a\u53cd\u6297\u65b9\u5f0f\u5f9e\u6b66\u88dd\u884c\u52d5\u8f49\u5411\u653f\u6cbb\u904b\u52d5\u3002\u5b83\u4e5f\u8aaa\u660e\u8a31\u591a\u53f0\u7063\u4eba\u5728\u6b96\u6c11\u7d71\u6cbb\u4e0b\u8ffd\u6c42\u6b0a\u5229\u3001\u53c3\u8207\u8207\u6539\u9769\u3002",
  },
  {
    id: "taisho-democracy",
    titleEn: "Taisho democracy and Taiwanese activism",
    titleZh: "\u5927\u6b63\u6c11\u4e3b\u8207\u53f0\u7063\u793e\u6703\u904b\u52d5",
    passageEn:
      "In the 1920s, ideas about democracy and political participation became more visible in Japan and Taiwan. Taiwanese activists used newspapers, speeches, and organizations to discuss rights and reform. They did not all agree on the same method, but many believed that people should have more voice in society. This period helps us understand why cultural and political movements grew in colonial Taiwan after earlier armed resistance became harder.",
    passageZh:
      "1920\u5e74\u4ee3\uff0c\u65e5\u672c\u548c\u53f0\u7063\u90fd\u51fa\u73fe\u66f4\u591a\u95dc\u65bc\u6c11\u4e3b\u8207\u653f\u6cbb\u53c3\u8207\u7684\u8a0e\u8ad6\u3002\u53f0\u7063\u793e\u6703\u904b\u52d5\u8005\u900f\u904e\u5831\u7d19\u3001\u6f14\u8b1b\u548c\u7d44\u7e54\uff0c\u8a0e\u8ad6\u6b0a\u5229\u8207\u6539\u9769\u3002\u4ed6\u5011\u4e0d\u4e00\u5b9a\u90fd\u540c\u610f\u76f8\u540c\u65b9\u6cd5\uff0c\u4f46\u8a31\u591a\u4eba\u76f8\u4fe1\u6c11\u773e\u61c9\u8a72\u5728\u793e\u6703\u4e2d\u6709\u66f4\u591a\u8072\u97f3\u3002\u9019\u500b\u6642\u671f\u5e6b\u52a9\u6211\u5011\u7406\u89e3\uff0c\u70ba\u4ec0\u9ebc\u65e9\u671f\u6b66\u88dd\u6297\u722d\u8b8a\u5f97\u56f0\u96e3\u5f8c\uff0c\u53f0\u7063\u7684\u6587\u5316\u8207\u653f\u6cbb\u904b\u52d5\u9010\u6f38\u767c\u5c55\u3002",
  },
  {
    id: "wushe",
    titleEn: "Wushe Incident",
    titleZh: "\u9727\u793e\u4e8b\u4ef6",
    passageEn:
      "The Wushe Incident happened in 1930 in central Taiwan. Seediq people rose up against Japanese colonial rule after long-term pressure, forced labor, and conflicts with colonial authorities. The event was violently suppressed. It is important because it shows that Indigenous communities experienced colonial rule in their own ways. It also helps us think about power, identity, and resistance in Taiwan's history.",
    passageZh:
      "\u9727\u793e\u4e8b\u4ef6\u767c\u751f\u65bc1930\u5e74\u7684\u53f0\u7063\u4e2d\u90e8\u3002\u8cfd\u5fb7\u514b\u65cf\u4eba\u56e0\u9577\u671f\u58d3\u529b\u3001\u52de\u5f79\u554f\u984c\u8207\u6b96\u6c11\u7576\u5c40\u7684\u885d\u7a81\uff0c\u8d77\u8eab\u53cd\u6297\u65e5\u672c\u7d71\u6cbb\u3002\u4e8b\u4ef6\u5f8c\u4f86\u906d\u5230\u66b4\u529b\u93ae\u58d3\u3002\u5b83\u7684\u91cd\u8981\u6027\u5728\u65bc\uff0c\u5b83\u986f\u793a\u539f\u4f4f\u6c11\u793e\u7fa4\u4ee5\u81ea\u5df1\u7684\u65b9\u5f0f\u7d93\u9a57\u6b96\u6c11\u7d71\u6cbb\u3002\u9019\u500b\u4e8b\u4ef6\u4e5f\u5e6b\u52a9\u6211\u5011\u601d\u8003\u53f0\u7063\u6b77\u53f2\u4e2d\u7684\u6b0a\u529b\u3001\u8eab\u5206\u8207\u53cd\u6297\u3002",
  },
  {
    id: "musha-aftermath",
    titleEn: "Aftermath of the Wushe Incident",
    titleZh: "\u9727\u793e\u4e8b\u4ef6\u5f8c\u7684\u5f71\u97ff",
    passageEn:
      "After the Wushe Incident, the colonial government increased control over Indigenous communities in central Taiwan. The event made officials worry about resistance in mountain areas, so they strengthened police and administrative systems. For Indigenous people, the incident became a painful memory of violence and pressure under colonial rule. Studying the aftermath helps students see that historical events do not end on one day; they can change policy, memory, and relationships for many years.",
    passageZh:
      "\u9727\u793e\u4e8b\u4ef6\u5f8c\uff0c\u6b96\u6c11\u653f\u5e9c\u52a0\u5f37\u5c0d\u53f0\u7063\u4e2d\u90e8\u539f\u4f4f\u6c11\u793e\u7fa4\u7684\u63a7\u5236\u3002\u9019\u500b\u4e8b\u4ef6\u8b93\u5b98\u54e1\u64d4\u5fc3\u5c71\u5730\u5730\u5340\u518d\u51fa\u73fe\u53cd\u6297\uff0c\u56e0\u6b64\u5f37\u5316\u8b66\u5bdf\u8207\u884c\u653f\u5236\u5ea6\u3002\u5c0d\u539f\u4f4f\u6c11\u800c\u8a00\uff0c\u9727\u793e\u4e8b\u4ef6\u6210\u70ba\u6b96\u6c11\u7d71\u6cbb\u4e0b\u66b4\u529b\u8207\u58d3\u529b\u7684\u75db\u82e6\u8a18\u61b6\u3002\u7814\u7a76\u4e8b\u4ef6\u5f8c\u7684\u5f71\u97ff\uff0c\u53ef\u4ee5\u8b93\u5b78\u751f\u7406\u89e3\u6b77\u53f2\u4e8b\u4ef6\u4e0d\u6703\u5728\u67d0\u4e00\u5929\u5c31\u7d50\u675f\uff0c\u5b83\u53ef\u80fd\u9577\u671f\u6539\u8b8a\u653f\u7b56\u3001\u8a18\u61b6\u8207\u4eba\u7fa4\u95dc\u4fc2\u3002",
  },
  {
    id: "rokusan-law",
    titleEn: "Law No. 63 and colonial legal power",
    titleZh: "六三法與殖民法律權力",
    passageEn:
      "Law No. 63 gave the Taiwan Governor-General special power to issue laws for Taiwan. This meant Taiwan was not governed in the same way as Japan's home islands. The law allowed the colonial government to respond quickly, but it also gave officials very strong authority. For Taiwanese people, this limited political participation and made colonial rule more centralized. Law No. 63 helps students understand why legal systems can shape power in a colony.",
    passageZh:
      "六三法讓台灣總督擁有在台灣發布命令的特殊權力。這代表台灣並不是完全用日本本土相同的方式治理。這項法律讓殖民政府能快速處理台灣事務，但也讓官員擁有很大的權力。對台灣人來說，這限制了政治參與，也讓殖民統治更加集中。六三法可以幫助學生理解，法律制度如何影響殖民地中的權力分配。",
  },
  {
    id: "land-survey",
    titleEn: "Land survey project",
    titleZh: "土地調查事業",
    passageEn:
      "The colonial government carried out a land survey in Taiwan to record land ownership, boundaries, and taxes more clearly. This project helped the government collect taxes and manage resources. It also made land easier to use for economic planning. However, the survey changed older local customs and sometimes created pressure for farmers. The land survey shows how modern administration could bring order while also strengthening colonial control.",
    passageZh:
      "殖民政府在台灣推動土地調查事業，目的，是更清楚地記錄土地所有權、邊界和稅收。這項工作幫助政府徵稅與管理資源，也讓土地更容易被納入經濟規劃。可是，土地調查也改變了原本的地方習慣，有時對農民造成壓力。土地調查事業顯示，現代行政制度可以帶來秩序，也可能同時強化殖民控制。",
  },
  {
    id: "goto-shinpei",
    titleEn: "Kodama Gentaro and Goto Shinpei's reforms",
    titleZh: "兒玉源太郎與後藤新平改革",
    passageEn:
      "In the early Japanese colonial period, Governor-General Kodama Gentaro and civil administrator Goto Shinpei promoted important reforms. They strengthened police control, improved public health, surveyed land, and supported infrastructure. Their policies helped the colonial government rule Taiwan more effectively. Some reforms improved daily life, but they also made the colonial state stronger. This period shows the mixed character of modernization under colonial rule.",
    passageZh:
      "日治初期，總督兒玉源太郎與民政長官後藤新平推動許多重要改革。他們強化警察制度、改善公共衛生、調查土地，並支持基礎建設。這些政策讓殖民政府更有效率地統治台灣。有些改革改善了日常生活，但也讓殖民國家更強大。這個時期顯示殖民統治下的現代化具有複雜性。",
  },
  {
    id: "trunk-railway",
    titleEn: "Completion of the western trunk railway",
    titleZh: "縱貫鐵路通車",
    passageEn:
      "The western trunk railway connected important cities along Taiwan's west coast. It made travel, trade, and communication faster than before. Farmers, merchants, and officials could move goods and information more easily. At the same time, the railway helped the colonial government control Taiwan and support industries such as sugar. The railway is a good example of how infrastructure could be useful to people and also useful to colonial rule.",
    passageZh:
      "縱貫鐵路連接台灣西部的重要城市，讓旅行、貿易和資訊傳遞比以前更快速。農民、商人和官員都能更方便地運送貨物與消息。同時，鐵路也幫助殖民政府控制台灣，並支持糖業等產業發展。縱貫鐵路是一個很好的例子，說明基礎建設可能對人民有幫助，也可能服務殖民統治。",
  },
  {
    id: "jianan-canal",
    titleEn: "Chianan Irrigation and Yoichi Hatta",
    titleZh: "嘉南大圳與八田與一",
    passageEn:
      "The Chianan Irrigation system was one of the major water projects during Japanese rule. Engineer Yoichi Hatta helped design a system that brought water to farmland in southern Taiwan. The project improved agricultural production and changed the lives of many farmers. However, it also served colonial economic planning by increasing rice and sugar production. The Chianan Irrigation system shows how technology, agriculture, and colonial economy were connected.",
    passageZh:
      "嘉南大圳是日治時期重要的水利工程之一。工程師八田與一參與設計灌溉系統，將水源帶到台灣南部農地。這項工程改善農業生產，也改變許多農民的生活。不過，它同時服務殖民經濟規劃，因為它提高了稻米與糖業生產。嘉南大圳顯示技術、農業與殖民經濟之間的關係。",
  },
  {
    id: "penglai-rice",
    titleEn: "Penglai rice and agricultural change",
    titleZh: "蓬萊米與農業變化",
    passageEn:
      "During Japanese rule, agricultural experts developed and promoted Penglai rice in Taiwan. This rice was suited to Japanese tastes and became important for export to Japan. Farmers learned new techniques, and irrigation systems helped increase production. But agricultural change also tied Taiwan's economy more closely to Japan's needs. Penglai rice shows how science and farming could improve production while also serving colonial economic goals.",
    passageZh:
      "日治時期，農業專家在台灣改良並推廣蓬萊米。這種米符合日本人的口味，也成為輸往日本的重要農產品。農民學習新的種植技術，灌溉系統也幫助提高產量。但是，農業變化也讓台灣經濟更加配合日本需求。蓬萊米顯示科學與農業能提升生產，也可能服務殖民經濟目標。",
  },
  {
    id: "taiwan-peoples-party",
    titleEn: "Taiwan People's Party",
    titleZh: "台灣民眾黨",
    passageEn:
      "The Taiwan People's Party was founded in 1927 and became an important political organization under Japanese rule. It grew from earlier social and cultural movements and tried to speak for Taiwanese people's rights. Its members discussed labor, local self-government, and political participation. The party faced pressure from the colonial government and later was forced to dissolve. It shows that Taiwanese activism became more organized in the 1920s.",
    passageZh:
      "台灣民眾黨成立於1927年，是日治時期重要的政治團體。它延續早期社會與文化運動，試圖為台灣人的權利發聲。成員關心勞工、地方自治與政治參與等議題。這個政黨受到殖民政府壓力，後來被迫解散。台灣民眾黨顯示1920年代台灣人的社會運動逐漸變得更有組織。",
  },
  {
    id: "local-autonomy-league",
    titleEn: "Taiwan Local Autonomy League",
    titleZh: "台灣地方自治聯盟",
    passageEn:
      "The Taiwan Local Autonomy League argued that Taiwanese people should have more say in local government. Instead of armed resistance, it used legal and political methods to push for reform. The group reflected the growth of civic awareness in colonial Taiwan. Its goals were limited by Japanese colonial rule, but it still showed that many Taiwanese people wanted participation, representation, and local self-government.",
    passageZh:
      "台灣地方自治聯盟主張台灣人應該在地方政府中有更多發言權。它不是用武裝抗爭，而是用合法與政治方式推動改革。這個團體反映殖民台灣公民意識的成長。雖然它的目標受到日本殖民統治限制，但仍然顯示許多台灣人希望擁有參與、代表權與地方自治。",
  },
  {
    id: "taiwan-minpao",
    titleEn: "Taiwan Minpao and public opinion",
    titleZh: "台灣民報與公共輿論",
    passageEn:
      "Taiwan Minpao was an important newspaper connected to Taiwanese social movements. It shared ideas about rights, culture, education, and reform. Through newspapers, activists could reach readers beyond one city or school. The colonial government watched these activities carefully because public opinion could challenge authority. Taiwan Minpao shows how writing and media became tools for political and cultural action.",
    passageZh:
      "《台灣民報》是和台灣社會運動密切相關的重要報紙。它傳播關於權利、文化、教育與改革的想法。透過報紙，社會運動者能接觸到不只一個城市或學校的讀者。殖民政府也密切注意這些活動，因為公共輿論可能挑戰權威。《台灣民報》顯示文字與媒體如何成為政治和文化行動的工具。",
  },
  {
    id: "sun-moon-lake-power",
    titleEn: "Sun Moon Lake hydroelectric project",
    titleZh: "日月潭水力發電工程",
    passageEn:
      "The Sun Moon Lake hydroelectric project was a major industrial project during Japanese rule. It used water power to produce electricity for factories, railways, and cities. The project showed Taiwan's role in Japan's industrial and imperial planning. It also changed local landscapes and communities. This project helps students understand how large construction projects could bring modern technology while also serving colonial economic goals.",
    passageZh:
      "日月潭水力發電工程是日治時期重要的工業建設。它利用水力發電，供應工廠、鐵路與城市用電。這項工程顯示台灣在日本工業與帝國規劃中的角色，也改變了地方景觀與社群生活。日月潭水力發電工程可以幫助學生理解，大型建設能帶來現代技術，也可能服務殖民經濟目標。",
  },
  {
    id: "air-raids",
    titleEn: "Air raids on Taiwan during World War II",
    titleZh: "二戰末期台灣空襲",
    passageEn:
      "During the final years of World War II, Taiwan was attacked by Allied air raids because it was part of Japan's wartime system. Cities, ports, railways, and military facilities could become targets. Ordinary people had to deal with fear, shortages, and damage to daily life. The air raids show that the war was not far away from Taiwan. They also help explain why the late colonial period was shaped by military needs and suffering.",
    passageZh:
      "第二次世界大戰末期，台灣因為是日本戰爭體系的一部分，遭到盟軍空襲。城市、港口、鐵路與軍事設施都可能成為目標。一般人民必須面對恐懼、物資不足與日常生活受損。台灣空襲顯示戰爭並不遙遠，而是直接影響台灣社會。它也幫助說明日治後期受到軍事需求與戰爭痛苦深刻影響。",
  },
  {
    id: "southward-policy",
    titleEn: "Taiwan as a base for Japan's southward expansion",
    titleZh: "\u53f0\u7063\u8207\u65e5\u672c\u5357\u9032",
    passageEn:
      "In the 1930s and 1940s, Japan saw Taiwan as an important base for expansion toward Southeast Asia. Taiwan's location, ports, agriculture, and industries made it useful for military and economic planning. During wartime, resources and people in Taiwan were mobilized more strongly. This shows that Taiwan was not only a colony being ruled, but also a place used by Japan's empire for wider regional goals.",
    passageZh:
      "1930\u5e74\u4ee3\u52301940\u5e74\u4ee3\uff0c\u65e5\u672c\u5c07\u53f0\u7063\u8996\u70ba\u5411\u6771\u5357\u4e9e\u64f4\u5f35\u7684\u91cd\u8981\u57fa\u5730\u3002\u53f0\u7063\u7684\u4f4d\u7f6e\u3001\u6e2f\u53e3\u3001\u8fb2\u696d\u8207\u5de5\u696d\uff0c\u90fd\u5c0d\u8ecd\u4e8b\u8207\u7d93\u6fdf\u898f\u5283\u6709\u7528\u3002\u6230\u722d\u6642\u671f\uff0c\u53f0\u7063\u7684\u8cc7\u6e90\u8207\u4eba\u529b\u88ab\u66f4\u5f37\u529b\u5730\u52d5\u54e1\u3002\u9019\u986f\u793a\u53f0\u7063\u4e0d\u53ea\u662f\u88ab\u7d71\u6cbb\u7684\u6b96\u6c11\u5730\uff0c\u4e5f\u662f\u65e5\u672c\u5e1d\u570b\u5be6\u73fe\u5340\u57df\u76ee\u6a19\u7684\u91cd\u8981\u5730\u9ede\u3002",
  },
  {
    id: "kominka",
    titleEn: "Kominka and wartime mobilization",
    titleZh: "\u7687\u6c11\u5316\u8207\u6230\u722d\u52d5\u54e1",
    passageEn:
      "During the wartime years from 1937 to 1945, the Japanese colonial government promoted the Kominka movement in Taiwan. It encouraged people to use Japanese, adopt Japanese-style names, and support the empire's war effort. Some people cooperated because of pressure or hope for opportunity, while others felt their language and identity were being limited. The Kominka movement shows how colonial rule became stronger during war and how daily life could be connected to empire and military needs.",
    passageZh:
      "\u57281937\u5e74\u52301945\u5e74\u7684\u6230\u722d\u6642\u671f\uff0c\u65e5\u672c\u6b96\u6c11\u653f\u5e9c\u5728\u53f0\u7063\u63a8\u52d5\u7687\u6c11\u5316\u904b\u52d5\u3002\u5b83\u9f13\u52f5\u4eba\u5011\u4f7f\u7528\u65e5\u8a9e\u3001\u6539\u7528\u65e5\u672c\u5f0f\u59d3\u540d\uff0c\u4e26\u652f\u6301\u5e1d\u570b\u7684\u6230\u722d\u52d5\u54e1\u3002\u6709\u4e9b\u4eba\u56e0\u58d3\u529b\u6216\u5e0c\u671b\u7372\u5f97\u6a5f\u6703\u800c\u914d\u5408\uff0c\u4e5f\u6709\u4eba\u611f\u5230\u81ea\u5df1\u7684\u8a9e\u8a00\u8207\u8eab\u5206\u53d7\u5230\u9650\u5236\u3002\u7687\u6c11\u5316\u904b\u52d5\u986f\u793a\u6230\u722d\u6642\u671f\u6b96\u6c11\u7d71\u6cbb\u8b8a\u5f97\u66f4\u5f37\uff0c\u65e5\u5e38\u751f\u6d3b\u4e5f\u53ef\u80fd\u88ab\u9023\u7d50\u5230\u5e1d\u570b\u8207\u8ecd\u4e8b\u9700\u6c42\u3002",
  },
];

export const taiwanJapaneseColonialEventRoles: RolePlayRole[] = [
  {
    eventId: "overview",
    roleName: "Taiwanese student living under Japanese rule",
    perspective:
      "I see new schools, railways, and public health policies, but I also feel that Taiwanese people have little political voice.",
    background:
      "This role represents a Taiwanese young person looking across the whole Japanese colonial period from 1895 to 1945.",
    guidingFocus: "modernization, unequal power, daily life, and different responses to colonial rule",
  },
  {
    eventId: "education",
    roleName: "Taiwanese student in a colonial school",
    perspective:
      "I hope school can give me opportunity, but I also know the classroom teaches Japanese language and loyalty to the empire.",
    background:
      "This role represents Taiwanese students who experienced both new educational chances and colonial pressure.",
    guidingFocus: "education, language policy, identity, opportunity, and unequal treatment",
  },
  {
    eventId: "treaty",
    roleName: "Taiwanese resident hearing about the Treaty of Shimonoseki",
    perspective:
      "I feel shocked that Taiwan's ruler changed because of a treaty made far away from ordinary people like me.",
    background:
      "This role represents people in Taiwan who faced the sudden transfer of Taiwan to Japan in 1895.",
    guidingFocus: "political change, uncertainty, colonial beginning, and why some people resisted",
  },
  {
    eventId: "republic-formosa",
    roleName: "Tang Jingsong, president of the Republic of Formosa",
    perspective:
      "I worry that Taiwan is being handed to a new ruler without ordinary people having a real voice.",
    background:
      "This role represents the short-lived Republic of Formosa and the attempt to resist Japanese takeover after the Treaty of Shimonoseki.",
    guidingFocus: "political uncertainty, resistance, and why some people did not accept the transfer quietly",
  },
  {
    eventId: "infrastructure",
    roleName: "Railway engineer working for the colonial government",
    perspective:
      "I believe railways can make Taiwan more connected and productive, but I also know they help the government move goods, soldiers, and information.",
    background:
      "This role represents technical officials and engineers involved in colonial infrastructure projects.",
    guidingFocus: "modernization, transportation, economic planning, and colonial control",
  },
  {
    eventId: "police-system",
    roleName: "Japanese police officer in a local station",
    perspective:
      "I see my job as keeping order, but my station also watches local communities and carries out colonial policies.",
    background:
      "This role represents police officers who became a major part of everyday colonial rule in Taiwan.",
    guidingFocus: "order, surveillance, local control, policy enforcement, and daily pressure",
  },
  {
    eventId: "sugar",
    roleName: "Taiwanese sugarcane farmer",
    perspective:
      "Sugar brings new factories and markets, but farmers like me do not always share the benefits fairly.",
    background:
      "This role represents farmers whose work was connected to colonial economic planning and sugar production.",
    guidingFocus: "colonial economy, farming, factories, unequal benefits, and Japan's imperial needs",
  },
  {
    eventId: "public-health",
    roleName: "Public health doctor working in colonial Taiwan",
    perspective:
      "I want to prevent disease and improve health, but public health also gives the government more power over daily life.",
    background:
      "This role represents medical and public health workers involved in sanitation, hospitals, and disease control.",
    guidingFocus: "health improvement, state control, sanitation, workers, and urban stability",
  },
  {
    eventId: "xilai-temple",
    roleName: "Yu Qingfang, organizer connected to the Xilai Temple Incident",
    perspective:
      "I feel that armed resistance is one way to challenge colonial rule, even when the government is much stronger.",
    background:
      "This role represents the resistance networks connected to the 1915 Xilai Temple Incident in southern Taiwan.",
    guidingFocus: "religion, local society, resistance, repression, and why later movements changed methods",
  },
  {
    eventId: "cultural-association",
    roleName: "Chiang Wei-shui, Taiwan Cultural Association activist",
    perspective:
      "I believe lectures, newspapers, and public discussion can awaken people and help them think about rights.",
    background:
      "This role represents activists in the Taiwan Cultural Association who used culture and education instead of weapons.",
    guidingFocus: "civic awareness, education, public discussion, rights, and nonviolent resistance",
  },
  {
    eventId: "parliament-petition",
    roleName: "Lin Hsien-tang, Taiwan Parliament petition activist",
    perspective:
      "I want Taiwanese people to have political representation, so I use legal petitions instead of armed conflict.",
    background:
      "This role represents leaders and activists who repeatedly petitioned Japan for a Taiwan parliament.",
    guidingFocus: "representation, legal reform, political participation, and the limits of colonial rule",
  },
  {
    eventId: "taisho-democracy",
    roleName: "Taiwanese activist influenced by Taisho democracy",
    perspective:
      "I believe people should have more voice in society, even if activists disagree about the best method.",
    background:
      "This role represents 1920s Taiwanese activists using newspapers, speeches, and organizations to discuss reform.",
    guidingFocus: "democracy, civic voice, reform methods, newspapers, and political participation",
  },
  {
    eventId: "wushe",
    roleName: "Mona Rudao, Seediq leader connected to the Wushe Incident",
    perspective:
      "I experience colonial rule through pressure on my community, forced labor, and conflict with authorities.",
    background:
      "This role represents the Seediq perspective connected to the Wushe Incident of 1930.",
    guidingFocus: "Indigenous experience, identity, pressure, resistance, and unequal effects of colonial rule",
  },
  {
    eventId: "musha-aftermath",
    roleName: "Seediq survivor after the Wushe Incident",
    perspective:
      "After the incident, I see stronger control and painful memories that continue to affect my community.",
    background:
      "This role represents Indigenous community members living with the aftermath of the Wushe Incident.",
    guidingFocus: "aftermath, memory, stronger control, community relationships, and long-term effects",
  },
  {
    eventId: "rokusan-law",
    roleName: "Taiwan Governor-General official using Law No. 63",
    perspective:
      "I believe special legal power lets the government rule Taiwan quickly, but it also concentrates authority in our hands.",
    background:
      "This role represents colonial officials who used Law No. 63 to issue laws for Taiwan.",
    guidingFocus: "legal power, centralized rule, limited participation, and colonial authority",
  },
  {
    eventId: "land-survey",
    roleName: "Taiwanese farmer during the land survey project",
    perspective:
      "The survey makes land records clearer, but it also changes older customs and can create pressure for farmers.",
    background:
      "This role represents farmers affected by colonial land surveys, taxation, and resource management.",
    guidingFocus: "land ownership, taxes, local customs, resource control, and modern administration",
  },
  {
    eventId: "goto-shinpei",
    roleName: "Goto Shinpei, civil administrator in colonial Taiwan",
    perspective:
      "I believe reforms can make rule more effective, but my policies also strengthen the colonial state.",
    background:
      "This role represents Goto Shinpei's role in police control, public health, land surveys, and infrastructure reforms.",
    guidingFocus: "reform, modernization, police power, public health, and colonial administration",
  },
  {
    eventId: "trunk-railway",
    roleName: "Taiwanese merchant using the western trunk railway",
    perspective:
      "The railway helps me move goods faster, but I can also see how it strengthens colonial control and industry.",
    background:
      "This role represents local merchants and travelers whose daily lives changed after railway expansion.",
    guidingFocus: "trade, mobility, communication, sugar industry, and the mixed effects of infrastructure",
  },
  {
    eventId: "jianan-canal",
    roleName: "Yoichi Hatta, engineer of the Chianan Irrigation system",
    perspective:
      "I want irrigation to improve farming in southern Taiwan, but the project also serves colonial economic planning.",
    background:
      "This role represents engineer Yoichi Hatta and the large water project connected to agriculture and production.",
    guidingFocus: "technology, irrigation, farming, rice, sugar, and colonial economic goals",
  },
  {
    eventId: "penglai-rice",
    roleName: "Agricultural expert promoting Penglai rice",
    perspective:
      "I use science to improve rice production, but the new crop also ties Taiwan's agriculture more closely to Japan's needs.",
    background:
      "This role represents agricultural experts who developed and promoted Penglai rice during Japanese rule.",
    guidingFocus: "science, farming, export, production, and colonial economic connection",
  },
  {
    eventId: "taiwan-peoples-party",
    roleName: "Chiang Wei-shui, Taiwan People's Party organizer",
    perspective:
      "I want a political organization that speaks for Taiwanese people's rights, labor, and participation.",
    background:
      "This role represents activists who built the Taiwan People's Party from earlier social and cultural movements.",
    guidingFocus: "organized activism, labor, local self-government, rights, and colonial pressure",
  },
  {
    eventId: "local-autonomy-league",
    roleName: "Local autonomy activist",
    perspective:
      "I believe Taiwanese people should have more say in local government through legal political action.",
    background:
      "This role represents members of the Taiwan Local Autonomy League and their push for local self-government.",
    guidingFocus: "local government, representation, legal reform, civic awareness, and limited colonial rights",
  },
  {
    eventId: "taiwan-minpao",
    roleName: "Taiwan Minpao editor",
    perspective:
      "I use newspapers to spread ideas about rights, culture, education, and reform beyond one city or school.",
    background:
      "This role represents editors and writers connected to Taiwan Minpao and colonial public opinion.",
    guidingFocus: "media, public opinion, censorship, social movements, and political communication",
  },
  {
    eventId: "sun-moon-lake-power",
    roleName: "Engineer on the Sun Moon Lake hydroelectric project",
    perspective:
      "I see hydroelectric power as modern technology, but the project also supports factories, railways, and imperial planning.",
    background:
      "This role represents engineers and planners involved in the Sun Moon Lake hydroelectric project.",
    guidingFocus: "industrialization, electricity, landscape change, local communities, and colonial economic goals",
  },
  {
    eventId: "air-raids",
    roleName: "Taiwanese civilian during World War II air raids",
    perspective:
      "I feel that war is no longer far away because shortages, fear, and air raids affect my daily life.",
    background:
      "This role represents ordinary people in Taiwan during the final years of World War II.",
    guidingFocus: "wartime suffering, military targets, daily life, shortages, and Taiwan's role in Japan's war system",
  },
  {
    eventId: "southward-policy",
    roleName: "Japanese military planner using Taiwan as a southward base",
    perspective:
      "I see Taiwan's location, ports, farms, and industries as useful for expansion toward Southeast Asia.",
    background:
      "This role represents military and economic planners who treated Taiwan as part of Japan's wider regional strategy.",
    guidingFocus: "southward expansion, military planning, resources, ports, and wartime mobilization",
  },
  {
    eventId: "kominka",
    roleName: "Taiwanese student during wartime mobilization",
    perspective:
      "I feel daily life changing as the government asks us to use Japanese, support the empire, and join wartime efforts.",
    background:
      "This role represents young Taiwanese people living under stronger wartime policies from 1937 to 1945.",
    guidingFocus: "language, identity, pressure, cooperation, resistance, and wartime mobilization",
  },
];

const rolePlayEventAliases: Record<string, string> = {
  "republic-of-formosa": "republic-formosa",
  "armed-resistance-1895": "treaty",
  "xilai-temple-incident": "xilai-temple",
  "taiwan-cultural-association": "cultural-association",
  "taiwan-parliament-petition": "parliament-petition",
  "wushe-incident": "wushe",
  "kominka-wartime-mobilization": "kominka",
};

export function resolveRolePlayEventId(id: string | null | undefined) {
  if (!id) {
    return taiwanReadingPassageOptions[0].id;
  }

  if (taiwanReadingPassageOptions.some((event) => event.id === id)) {
    return id;
  }

  return rolePlayEventAliases[id] ?? taiwanReadingPassageOptions[0].id;
}

export function getRoleForEvent(eventId: string) {
  const resolvedEventId = resolveRolePlayEventId(eventId);

  return (
    taiwanJapaneseColonialEventRoles.find((role) => role.eventId === resolvedEventId) ??
    taiwanJapaneseColonialEventRoles[0]
  );
}

export function getTaiwanHistoryEventById(eventId: string) {
  const resolvedEventId = resolveRolePlayEventId(eventId);

  return (
    taiwanJapaneseColonialEvents.find((event) => event.id === resolvedEventId) ??
    taiwanJapaneseColonialEvents[0]
  );
}

export function getRolePlayEventOptionById(eventId: string) {
  const resolvedEventId = resolveRolePlayEventId(eventId);

  return (
    taiwanReadingPassageOptions.find((event) => event.id === resolvedEventId) ??
    taiwanReadingPassageOptions[0]
  );
}

export function getRandomTaiwanHistoryTopic() {
  return taiwanJapaneseColonialKnowledge[
    Math.floor(Math.random() * taiwanJapaneseColonialKnowledge.length)
  ];
}

export function getRandomTaiwanHistoryEvent() {
  return taiwanJapaneseColonialEvents[
    Math.floor(Math.random() * taiwanJapaneseColonialEvents.length)
  ];
}

export function formatTopicForPrompt(topic: TaiwanHistoryTopic, language: PassageLanguage) {
  const title = language === "zh" ? topic.titleZh : topic.titleEn;
  const summary = language === "zh" ? topic.summaryZh : topic.summaryEn;
  const keyPoints = language === "zh" ? topic.keyPointsZh : topic.keyPointsEn;

  return [
    `Knowledge base topic: ${title}`,
    `Time frame: ${topic.timeFrame}`,
    `Summary: ${summary}`,
    "Key points:",
    ...keyPoints.map((point) => `- ${point}`),
  ].join("\n");
}

export function formatEventForPrompt(event: TaiwanHistoryEvent, language: PassageLanguage) {
  const name = language === "zh" ? event.nameZh : event.nameEn;
  const summary = language === "zh" ? event.summaryZh : event.summaryEn;
  const significance = language === "zh" ? event.significanceZh : event.significanceEn;

  return [
    `Knowledge base event: ${name}`,
    `Year or period: ${event.year}`,
    `Summary: ${summary}`,
    "Why it matters:",
    ...significance.map((point) => `- ${point}`),
  ].join("\n");
}

export function getReadingPassageOptionById(id: string) {
  return taiwanReadingPassageOptions.find((option) => option.id === id) ?? null;
}

export function formatReadingPassageOptionForPrompt(
  option: TaiwanReadingPassageOption,
  language: PassageLanguage,
) {
  const title = language === "zh" ? option.titleZh : option.titleEn;
  const passage = language === "zh" ? option.passageZh : option.passageEn;

  return [
    `Selected reading event or topic: ${title}`,
    "Base classroom passage:",
    passage,
  ].join("\n");
}

export function getRandomTaiwanHistoryEntryForPrompt(language: PassageLanguage) {
  if (Math.random() < 0.5) {
    return formatTopicForPrompt(getRandomTaiwanHistoryTopic(), language);
  }

  return formatEventForPrompt(getRandomTaiwanHistoryEvent(), language);
}

export function formatKnowledgeBaseForPrompt(language: PassageLanguage) {
  const topics = taiwanJapaneseColonialKnowledge.map((topic) =>
    formatTopicForPrompt(topic, language),
  );
  const events = taiwanJapaneseColonialEvents.map((event) =>
    formatEventForPrompt(event, language),
  );

  return [...topics, ...events].join("\n\n");
}
