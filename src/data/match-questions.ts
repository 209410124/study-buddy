export type MatchPair = {
  id: string;
  term: string;
  meaning: string;
  hint?: string;
};

export type MatchQuestionSet = {
  topicId: string;
  title: string;
  pairs: MatchPair[];
};

export const defaultMatchQuestionSet: MatchQuestionSet = {
  topicId: "overview",
  title: "Taiwan Under Japanese Rule Overview",
  pairs: [
    {
      id: "overview-1895",
      term: "1895",
      meaning: "The year Taiwan was ceded to Japan after the Treaty of Shimonoseki.",
    },
    {
      id: "overview-colonial-rule",
      term: "Colonial rule",
      meaning: "A foreign government controls a place and makes major decisions there.",
    },
    {
      id: "overview-modernization",
      term: "Modernization",
      meaning: "New systems such as railways, schools, public health, and industry.",
    },
    {
      id: "overview-resistance",
      term: "Resistance",
      meaning: "Actions people took when they opposed Japanese colonial control.",
    },
    {
      id: "overview-1945",
      term: "1945",
      meaning: "The year Japanese rule in Taiwan ended after World War II.",
    },
  ],
};

export const matchQuestionSets: MatchQuestionSet[] = [
  {
    topicId: "treaty",
    title: "Treaty of Shimonoseki",
    pairs: [
      {
        id: "treaty-shimonoseki",
        term: "Treaty of Shimonoseki",
        meaning: "The treaty that made Qing China cede Taiwan to Japan in 1895.",
      },
      {
        id: "treaty-cession",
        term: "Cession",
        meaning: "Giving control of territory from one government to another.",
      },
      {
        id: "treaty-qing",
        term: "Qing China",
        meaning: "The government that gave up Taiwan after losing the war with Japan.",
      },
      {
        id: "treaty-japanese-rule",
        term: "Japanese rule",
        meaning: "The period from 1895 to 1945 when Japan governed Taiwan.",
      },
      {
        id: "treaty-impact",
        term: "Sudden political change",
        meaning: "People in Taiwan had to face a new ruler and uncertain future.",
      },
    ],
  },
  {
    topicId: "republic-formosa",
    title: "Republic of Formosa",
    pairs: [
      {
        id: "formosa-republic",
        term: "Republic of Formosa",
        meaning: "A short-lived government formed in Taiwan to resist Japanese takeover.",
      },
      {
        id: "formosa-resistance",
        term: "Armed resistance",
        meaning: "Using force to oppose Japanese control.",
      },
      {
        id: "formosa-local-leaders",
        term: "Local leaders",
        meaning: "Taiwanese elites who tried to organize a response to the takeover.",
      },
      {
        id: "formosa-short-lived",
        term: "Short-lived",
        meaning: "Lasting only a brief time before Japan gained control.",
      },
      {
        id: "formosa-meaning",
        term: "Historical meaning",
        meaning: "Shows that some people in Taiwan did not accept the transfer quietly.",
      },
    ],
  },
  {
    topicId: "education",
    title: "Education and Language Policy",
    pairs: [
      {
        id: "education-japanese-language",
        term: "Japanese language",
        meaning: "A language students were encouraged or required to learn in school.",
      },
      {
        id: "education-school",
        term: "Schools",
        meaning: "Places that taught knowledge but also promoted colonial values.",
      },
      {
        id: "education-assimilation",
        term: "Assimilation",
        meaning: "Policies that pushed people to become more like Japanese subjects.",
      },
      {
        id: "education-identity",
        term: "Identity",
        meaning: "How people understood who they were under changing cultural pressure.",
      },
      {
        id: "education-opportunity",
        term: "Education opportunity",
        meaning: "Schooling could create new chances while also serving colonial goals.",
      },
    ],
  },
  {
    topicId: "trunk-railway",
    title: "North-South Railway",
    pairs: [
      {
        id: "railway-trunk-line",
        term: "North-South Railway",
        meaning: "A major railway connecting northern and southern Taiwan.",
      },
      {
        id: "railway-transport",
        term: "Transportation",
        meaning: "Moving people, goods, soldiers, and resources more quickly.",
      },
      {
        id: "railway-control",
        term: "Colonial control",
        meaning: "Infrastructure also helped the government manage and control Taiwan.",
      },
      {
        id: "railway-trade",
        term: "Trade",
        meaning: "Railways made it easier to send products to ports and markets.",
      },
      {
        id: "railway-modern-life",
        term: "Modern daily life",
        meaning: "Travel and communication became faster for many people.",
      },
    ],
  },
  {
    topicId: "infrastructure",
    title: "Infrastructure and Modernization",
    pairs: [
      {
        id: "infra-railway",
        term: "Railways",
        meaning: "Transportation networks that linked towns, farms, and ports.",
      },
      {
        id: "infra-ports",
        term: "Ports",
        meaning: "Places where goods could be shipped in and out of Taiwan.",
      },
      {
        id: "infra-benefit",
        term: "Public benefit",
        meaning: "Some projects made travel, trade, or daily life more convenient.",
      },
      {
        id: "infra-control",
        term: "Government control",
        meaning: "Modern systems also helped Japan collect resources and manage society.",
      },
      {
        id: "infra-double-meaning",
        term: "Double meaning",
        meaning: "Modernization could help people while also serving colonial rule.",
      },
    ],
  },
  {
    topicId: "public-health",
    title: "Public Health Policy",
    pairs: [
      {
        id: "health-sanitation",
        term: "Sanitation",
        meaning: "Keeping streets, water, and homes cleaner to reduce disease.",
      },
      {
        id: "health-disease",
        term: "Disease prevention",
        meaning: "Actions meant to stop illness from spreading.",
      },
      {
        id: "health-survey",
        term: "Health surveys",
        meaning: "Government checks that gathered information about people and places.",
      },
      {
        id: "health-modernization",
        term: "Modern health system",
        meaning: "New rules and facilities that changed daily habits.",
      },
      {
        id: "health-control",
        term: "Control of daily life",
        meaning: "Public health could improve life but also increase government power.",
      },
    ],
  },
  {
    topicId: "sugar",
    title: "Sugar Industry",
    pairs: [
      {
        id: "sugar-industry",
        term: "Sugar industry",
        meaning: "A major colonial business focused on growing and processing sugar.",
      },
      {
        id: "sugar-factory",
        term: "Sugar factories",
        meaning: "Places where sugarcane was processed into sugar for sale.",
      },
      {
        id: "sugar-export",
        term: "Export",
        meaning: "Sending products from Taiwan to Japan or other markets.",
      },
      {
        id: "sugar-farmers",
        term: "Farmers",
        meaning: "People whose crop choices and income could be affected by policy.",
      },
      {
        id: "sugar-colonial-economy",
        term: "Colonial economy",
        meaning: "An economy organized to serve the needs of the ruling empire.",
      },
    ],
  },
  {
    topicId: "cultural-association",
    title: "Taiwan Cultural Association",
    pairs: [
      {
        id: "culture-association",
        term: "Taiwan Cultural Association",
        meaning: "A group that promoted culture, knowledge, and social awareness.",
      },
      {
        id: "culture-lectures",
        term: "Public lectures",
        meaning: "Talks used to spread new ideas to ordinary people.",
      },
      {
        id: "culture-newspapers",
        term: "Newspapers",
        meaning: "Media used to share opinions and build public discussion.",
      },
      {
        id: "culture-enlightenment",
        term: "Enlightenment",
        meaning: "Helping people learn, think, and become more aware of society.",
      },
      {
        id: "culture-nonviolent",
        term: "Nonviolent activism",
        meaning: "Using education and public discussion instead of armed resistance.",
      },
    ],
  },
  {
    topicId: "wushe",
    title: "Wushe Incident",
    pairs: [
      {
        id: "wushe-incident",
        term: "Wushe Incident",
        meaning: "A 1930 Indigenous uprising against Japanese colonial rule.",
      },
      {
        id: "wushe-mona-rudao",
        term: "Mona Rudao",
        meaning: "A Seediq leader connected with the Wushe Incident.",
      },
      {
        id: "wushe-seediq",
        term: "Seediq people",
        meaning: "An Indigenous group whose community was deeply affected by colonial rule.",
      },
      {
        id: "wushe-pressure",
        term: "Long-term pressure",
        meaning: "Forced labor, police control, and limits on traditional life built anger.",
      },
      {
        id: "wushe-hunting-grounds",
        term: "Traditional hunting grounds",
        meaning: "Land and living space important to Indigenous culture and survival.",
      },
    ],
  },
  {
    topicId: "jianan-canal",
    title: "Chianan Canal and Hatta Yoichi",
    pairs: [
      {
        id: "jianan-canal",
        term: "Chianan Canal",
        meaning: "A large irrigation project that changed farming in southern Taiwan.",
      },
      {
        id: "jianan-hatta",
        term: "Hatta Yoichi",
        meaning: "The engineer often connected with the Chianan Canal project.",
      },
      {
        id: "jianan-irrigation",
        term: "Irrigation",
        meaning: "Bringing water to farmland so crops can grow more reliably.",
      },
      {
        id: "jianan-farming",
        term: "Agricultural change",
        meaning: "Better water systems could increase production and change farmers' work.",
      },
      {
        id: "jianan-economy",
        term: "Economic goal",
        meaning: "The project also supported colonial plans for production and resources.",
      },
    ],
  },
  {
    topicId: "kominka",
    title: "Kominka Movement and Wartime Mobilization",
    pairs: [
      {
        id: "kominka-movement",
        term: "Kominka Movement",
        meaning: "Policies pushing Taiwanese people to become loyal Japanese imperial subjects.",
      },
      {
        id: "kominka-language",
        term: "Japanese language use",
        meaning: "A way the government tried to change culture and identity.",
      },
      {
        id: "kominka-names",
        term: "Japanese-style names",
        meaning: "Part of pressure to adopt Japanese identity during wartime.",
      },
      {
        id: "kominka-mobilization",
        term: "Wartime mobilization",
        meaning: "Organizing people and resources to support Japan's war effort.",
      },
      {
        id: "kominka-identity",
        term: "Identity pressure",
        meaning: "People were pushed to change how they expressed who they were.",
      },
    ],
  },
];

export function normalizeMatchTopicId(topicId: string | null | undefined) {
  if (!topicId) {
    return defaultMatchQuestionSet.topicId;
  }

  return decodeURIComponent(topicId).trim();
}

export function findMatchQuestionSet(topicId: string | null | undefined) {
  const normalizedTopicId = normalizeMatchTopicId(topicId);

  return (
    matchQuestionSets.find((questionSet) => questionSet.topicId === normalizedTopicId) ??
    defaultMatchQuestionSet
  );
}
