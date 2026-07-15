export type ArticleCategory =
  | "Technology"
  | "Science"
  | "Research"
  | "Finance"
  | "Economics"
  | "IAS Prep";

export type SourceHook = {
  provider: "arXiv API" | "NewsAPI Free Tier" | "Alpha Vantage Free Tier";
  endpoint: string;
  rawTextField: "summary" | "description" | "content" | "abstract";
  notes: string;
};

export type PremiumArticle = {
  id: string;
  title: string;
  description: string;
  fullContent: string;
  summaryText: string;
  bulletPoints: string[];
  source: string;
  sourceHook: SourceHook;
  publishedAt: string;
  imageUrl?: string;
  category: ArticleCategory;
  url: string;
  authors?: string[];
  readingTimeMinutes: number;
  tags: string[];
  relevance: "Investor" | "Research" | "Policy" | "Technology" | "Exam Prep";
};

export const mockArticles: PremiumArticle[] = [
  {
    id: "arxiv-ai-agents-markets",
    title: "Agentic AI Systems Are Moving From Demos to Workflow Infrastructure",
    description:
      "A research-style briefing on how autonomous AI agents are being evaluated for tool use, planning reliability, and enterprise workflow deployment.",
    fullContent:
      "Recent AI research is shifting from isolated benchmark performance toward agentic systems that can plan, call tools, inspect intermediate results, and recover from failed steps. The most important change is not simply larger models, but the surrounding infrastructure: memory, retrieval, verifiable tool calls, permissions, and monitoring. In enterprise settings, agents are most useful when their action space is narrow, auditable, and connected to existing systems such as ticket queues, spreadsheets, research databases, and internal knowledge bases. The main scientific challenge is reliability under long-horizon tasks. A model can appear impressive on a short demo while still failing when it must maintain state over dozens of steps. Researchers are therefore studying evaluation methods that measure task completion, factual grounding, cost, latency, and safe failure behavior. For business and policy readers, the signal is clear: agentic AI adoption will be gradual where mistakes are expensive, but rapid in workflows where humans can approve actions and where the system produces structured evidence for every claim.",
    summaryText:
      "Agentic AI is becoming useful because of better workflow infrastructure around models: retrieval, memory, tool permissions, monitoring, and human approval. The key issue is reliability across long tasks, not just model intelligence. Enterprises are likely to adopt agents first in narrow, auditable workflows where outputs can be checked and actions can be approved.",
    bulletPoints: [
      "The shift in AI is from chat-only systems to agents that plan, use tools, and verify intermediate results.",
      "Reliability over long tasks remains the central technical bottleneck.",
      "Enterprise adoption is strongest where agents operate inside narrow, auditable workflows.",
      "Human approval and evidence-backed outputs reduce operational and compliance risk.",
      "Evaluation needs to measure completion quality, grounding, latency, cost, and safe failure modes.",
    ],
    source: "arXiv API Prepared Hook",
    sourceHook: {
      provider: "arXiv API",
      endpoint:
        "https://export.arxiv.org/api/query?search_query=cat:cs.AI+OR+cat:cs.LG&sortBy=submittedDate&max_results=10",
      rawTextField: "summary",
      notes: "Use the arXiv entry summary as the raw abstract for summary and bullet generation.",
    },
    publishedAt: "2026-06-12T09:00:00.000Z",
    category: "Technology",
    url: "https://arxiv.org/list/cs.AI/recent",
    authors: ["Research feed sample"],
    readingTimeMinutes: 4,
    tags: ["AI Agents", "Enterprise AI", "Automation"],
    relevance: "Technology",
  },
  {
    id: "arxiv-ai-science-discovery",
    title: "AI for Scientific Discovery: Faster Hypotheses, Harder Verification",
    description:
      "A science and research update on AI systems that propose experiments, screen materials, and assist literature synthesis.",
    fullContent:
      "AI-assisted scientific discovery is accelerating early-stage research by helping scientists search literature, generate candidate hypotheses, design experiments, and prioritize which simulations or lab tests to run. In materials science and biology, models can narrow a large possibility space into a smaller set of candidates that humans can inspect. The value is strongest when AI systems are connected to high-quality datasets and when predictions are tested through physical experiments or rigorous simulation. However, scientific usefulness depends on verification. A generated hypothesis is not a discovery until it survives measurement, peer review, and replication. For students and policy observers, the important point is that AI changes the speed and cost of exploration, but it does not remove the scientific method. Nations and institutions that combine computing capacity, domain expertise, open datasets, and laboratory infrastructure may gain an advantage in strategic research areas such as energy storage, drug discovery, agriculture, and climate adaptation.",
    summaryText:
      "AI can speed up scientific discovery by searching literature, suggesting hypotheses, and narrowing experimental options. Its real value appears when predictions are tested through experiments, simulation, and peer review. The countries and institutions best positioned to benefit are those that combine compute, domain experts, open datasets, and strong lab infrastructure.",
    bulletPoints: [
      "AI reduces the cost of exploring large scientific possibility spaces.",
      "Generated hypotheses still require experiments, replication, and peer review.",
      "Materials science, biology, energy, agriculture, and climate research are major opportunity areas.",
      "High-quality datasets and domain expertise matter as much as model size.",
      "This is useful for IAS-style science and technology preparation because it links innovation with public policy capacity.",
    ],
    source: "arXiv API Prepared Hook",
    sourceHook: {
      provider: "arXiv API",
      endpoint:
        "https://export.arxiv.org/api/query?search_query=all:%22AI%20scientific%20discovery%22&sortBy=submittedDate&max_results=10",
      rawTextField: "abstract",
      notes: "Map arXiv summary text to fullContent, then generate concise exam and policy notes.",
    },
    publishedAt: "2026-06-10T13:30:00.000Z",
    category: "Research",
    url: "https://arxiv.org/search/cs?query=AI+scientific+discovery&searchtype=all",
    authors: ["Research feed sample"],
    readingTimeMinutes: 4,
    tags: ["Scientific Discovery", "Research Policy", "Innovation"],
    relevance: "Research",
  },
  {
    id: "newsapi-central-banks-inflation",
    title: "Central Banks Face a Narrow Path as Inflation Cools Unevenly",
    description:
      "A macroeconomic briefing on why inflation, wages, growth, and policy rates may not normalize at the same speed.",
    fullContent:
      "Inflation has cooled from its peak in many major economies, but the path back to price stability remains uneven. Goods inflation has eased as supply chains normalized, while services inflation can remain sticky because it is closely tied to wages, housing costs, and domestic demand. Central banks therefore face a narrow policy path: cutting rates too early can revive inflation expectations, while keeping rates high for too long can weaken investment, credit growth, and employment. Investors watch central bank language for changes in confidence, not only the headline policy rate. A more cautious central bank may signal that it needs several months of data before easing. For business readers, the practical impact appears in loan costs, currency movements, equity valuations, and consumer demand. For exam preparation, the key linkage is between monetary policy, inflation expectations, real interest rates, and growth.",
    summaryText:
      "Inflation is falling, but not uniformly. Central banks must balance the risk of cutting rates too early against the risk of slowing growth by keeping rates high. The most important signals are services inflation, wage pressure, inflation expectations, and central bank guidance.",
    bulletPoints: [
      "Goods inflation can fall faster than services inflation because services depend more on wages and domestic demand.",
      "Rate cuts affect loans, currencies, equity valuations, and consumer spending.",
      "Central banks focus on inflation expectations as well as current inflation.",
      "Investors track policy guidance, not only the final rate decision.",
      "IAS angle: connect monetary policy with inflation control, growth, employment, and financial stability.",
    ],
    source: "NewsAPI Free Tier Prepared Hook",
    sourceHook: {
      provider: "NewsAPI Free Tier",
      endpoint:
        "https://newsapi.org/v2/everything?q=central%20banks%20inflation%20economy&language=en&sortBy=publishedAt",
      rawTextField: "description",
      notes: "Free tier returns article descriptions and limited content snippets suitable for short summaries.",
    },
    publishedAt: "2026-06-14T07:45:00.000Z",
    category: "Economics",
    url: "https://newsapi.org/",
    readingTimeMinutes: 3,
    tags: ["Inflation", "Monetary Policy", "Rates"],
    relevance: "Policy",
  },
  {
    id: "alphavantage-semiconductors-capex",
    title: "Semiconductor Capex Becomes a Proxy for the AI Infrastructure Cycle",
    description:
      "An investor-focused note on chips, data centers, energy demand, and capital expenditure signals in the AI supply chain.",
    fullContent:
      "The AI infrastructure cycle is visible through semiconductor orders, advanced packaging demand, memory pricing, data center construction, and power procurement. Investors increasingly treat capital expenditure announcements from cloud providers and chip manufacturers as signals for future AI capacity. This creates a chain reaction across equipment makers, foundries, networking suppliers, utilities, and real estate operators that host large-scale data centers. The opportunity is significant, but the risk is that markets can price in perfect demand before revenue arrives. If enterprise AI monetization is slower than expected, infrastructure spending may be questioned. The best investor analysis separates durable demand from temporary inventory build. It also watches constraints such as grid availability, cooling, export controls, and manufacturing bottlenecks. A premium aggregator should summarize these relationships clearly because the headline stock move often hides the deeper economic story.",
    summaryText:
      "AI infrastructure spending is now tracked through semiconductors, packaging, memory, data centers, and power demand. Strong capex can signal future growth, but investors must distinguish real end demand from inventory cycles and over-optimistic pricing.",
    bulletPoints: [
      "Cloud and chip capex announcements are key signals for the AI infrastructure cycle.",
      "The supply chain includes foundries, equipment makers, networking firms, utilities, and data center operators.",
      "Major constraints include power availability, cooling, export controls, and manufacturing capacity.",
      "Investor risk rises when valuations assume flawless AI monetization.",
      "A good summary should explain the economic chain, not just the stock reaction.",
    ],
    source: "Alpha Vantage Free Tier Prepared Hook",
    sourceHook: {
      provider: "Alpha Vantage Free Tier",
      endpoint:
        "https://www.alphavantage.co/query?function=NEWS_SENTIMENT&topics=technology,financial_markets&apikey=demo",
      rawTextField: "summary",
      notes: "Use Alpha Vantage news sentiment summaries as raw text for investor takeaways.",
    },
    publishedAt: "2026-06-13T11:20:00.000Z",
    category: "Finance",
    url: "https://www.alphavantage.co/documentation/#news-sentiment",
    readingTimeMinutes: 4,
    tags: ["Semiconductors", "AI Capex", "Markets"],
    relevance: "Investor",
  },
  {
    id: "ias-digital-public-infrastructure",
    title: "Digital Public Infrastructure Is Becoming a Core Development Strategy",
    description:
      "A policy explainer connecting digital identity, payments, data exchange, inclusion, governance, and economic productivity.",
    fullContent:
      "Digital public infrastructure, or DPI, refers to shared digital systems that allow people, firms, and governments to verify identity, make payments, exchange data securely, and deliver services at scale. The development impact comes from lowering transaction costs and making access easier for citizens and small businesses. A strong DPI stack can improve welfare delivery, financial inclusion, tax compliance, health records, education services, and disaster response. But DPI also requires safeguards: privacy law, cybersecurity, grievance redressal, open standards, and protection against exclusion when people lack connectivity or digital literacy. For IAS preparation, DPI is a useful topic because it connects governance, economy, technology, rights, and inclusion. The balanced view is that digital infrastructure can expand state capacity, but only when institutions and accountability keep pace with technical deployment.",
    summaryText:
      "Digital public infrastructure can improve service delivery, financial inclusion, and economic productivity by lowering transaction costs. Its benefits depend on safeguards such as privacy, cybersecurity, open standards, grievance systems, and inclusion for people with low connectivity or digital literacy.",
    bulletPoints: [
      "DPI includes digital identity, payments, data exchange, and service delivery rails.",
      "Benefits include welfare efficiency, inclusion, productivity, and better governance capacity.",
      "Risks include privacy breaches, cyberattacks, exclusion, and weak grievance redressal.",
      "IAS angle: link DPI with rights, economy, governance, federalism, and social justice.",
      "The best policy answer should present both opportunity and safeguards.",
    ],
    source: "NewsAPI Free Tier Prepared Hook",
    sourceHook: {
      provider: "NewsAPI Free Tier",
      endpoint:
        "https://newsapi.org/v2/everything?q=digital%20public%20infrastructure%20governance%20economy&language=en",
      rawTextField: "content",
      notes: "Use available free article snippets and descriptions for daily policy explainers.",
    },
    publishedAt: "2026-06-11T06:10:00.000Z",
    category: "IAS Prep",
    url: "https://newsapi.org/",
    readingTimeMinutes: 4,
    tags: ["DPI", "Governance", "Inclusion"],
    relevance: "Exam Prep",
  },
];
