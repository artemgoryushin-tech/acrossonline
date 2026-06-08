import { copyFile, mkdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"

const site = {
  name: "Arcos Online",
  domain: "https://arcosonline.com.br",
  email: "contato@arcosonline.com.br",
  description:
    "Clone scripts e software white-label para lançar corretoras de trading com traderoom, CRM, pagamentos, KYC/AML, apps, antifraude, afiliados e reporting.",
  descriptionEn:
    "Clone scripts and white-label brokerage software for launching trading platforms with traderoom, CRM, payments, KYC/AML, apps, antifraud, affiliates and reporting.",
}

const assetVersion = "20260608-favicon-v1"

const scripts = [
  clone("deriv", "Deriv", "opções, multipliers, CFDs e índices sintéticos", [
    "Arquitetura multi-produto para operadores que precisam de traderoom, automação e API.",
    "Fluxos de carteira, conta demo, conta real, limites por região e painel de risco.",
  ]),
  clone("iq-option", "IQ Option", "trading multi-asset com experiência visual", [
    "Interface visual, onboarding guiado, conta demo e jornada mobile-first.",
    "Base indicada para fintechs que precisam de gráficos fortes, CRM e funis de conversão.",
  ]),
  clone("olymp-trade", "Olymp Trade", "fixed-time trading com educação integrada", [
    "Fluxo com conta demo, materiais educacionais, campanhas e suporte a usuários iniciantes.",
    "Backoffice para conteúdo, CRM comercial, segmentação e relatórios de funil.",
  ]),
  clone("quotex", "Quotex", "digital options e traderoom rápido", [
    "Traderoom direto, expiração configurável, demo account, PSPs e painel de afiliados.",
    "Pensado para operadores que querem validar uma oferta de trading de forma enxuta.",
  ]),
  clone("pocket-option", "Pocket Option", "quick trading com social e copy features", [
    "Recursos opcionais de copy, ranking, bônus, afiliados e notificações.",
    "Camadas de controle para campanhas, abuso promocional, KYC e auditoria de trades.",
  ]),
  clone("binomo", "Binomo", "fixed-time trading com onboarding demo-first", [
    "Jornada simples para iniciantes, conta demo destacada e fluxo de depósito guiado.",
    "Backoffice com funis de conversão, campanhas, suporte e relatórios por cohort.",
  ]),
  clone("expertoption", "ExpertOption", "binary options mobile-first", [
    "Experiência rápida para web e apps, perfil de usuário, carteira e notificações.",
    "Admin para usuários, limites, suporte, pagamentos, KYC e monitoramento de risco.",
  ]),
  clone("binarium", "Binarium", "binary options com estrutura de contas", [
    "Modelo de contas por nível, benefícios configuráveis, CRM e segmentação comercial.",
    "Controle de bônus, KYC por nível, regras de saque, relatórios e auditoria financeira.",
  ]),
  clone("iqcent", "IQCent", "cent accounts, promoções e copy trading", [
    "Contas de baixo ticket, torneios opcionais, copy features e campanhas promocionais.",
    "Regras antifraude para bônus, limites regionais, afiliados e logs de auditoria.",
  ]),
  clone("raceoption", "RaceOption", "binary options com recursos avançados de trade", [
    "Recursos opcionais como rollover, sell trade, double up, copy e conta demo.",
    "Painel granular para payout, instrumentos, recursos ativos, afiliados e risco.",
  ]),
]

const scriptTranslations = {
  deriv: {
    market: "options, multipliers, CFDs and synthetic indices",
    angles: [
      "Multi-product architecture for operators that need traderoom, automation and API layers.",
      "Wallet flows, demo account, real account, regional limits and a risk control panel.",
    ],
  },
  "iq-option": {
    market: "multi-asset trading with a visual experience",
    angles: [
      "Visual interface, guided onboarding, demo account and a mobile-first user journey.",
      "A base for fintech teams that need strong charts, CRM and conversion funnels.",
    ],
  },
  "olymp-trade": {
    market: "fixed-time trading with integrated education",
    angles: [
      "Demo account flow, educational materials, campaigns and support for beginner users.",
      "Backoffice for content, sales CRM, segmentation and funnel reporting.",
    ],
  },
  quotex: {
    market: "digital options and a fast traderoom",
    angles: [
      "Direct traderoom, configurable expiry, demo account, PSPs and an affiliate panel.",
      "Designed for operators that want to validate a trading offer with a lean launch.",
    ],
  },
  "pocket-option": {
    market: "quick trading with social and copy features",
    angles: [
      "Optional copy features, rankings, bonuses, affiliates and notifications.",
      "Control layers for campaigns, promotional abuse, KYC and trade audit trails.",
    ],
  },
  binomo: {
    market: "fixed-time trading with demo-first onboarding",
    angles: [
      "Simple journey for beginners, highlighted demo account and guided deposit flow.",
      "Backoffice with conversion funnels, campaigns, support and cohort reporting.",
    ],
  },
  expertoption: {
    market: "mobile-first binary options",
    angles: [
      "Fast experience for web and apps, user profile, wallet and notifications.",
      "Admin tools for users, limits, support, payments, KYC and risk monitoring.",
    ],
  },
  binarium: {
    market: "binary options with account tiers",
    angles: [
      "Tiered account model, configurable benefits, CRM and sales segmentation.",
      "Bonus control, tier-based KYC, withdrawal rules, reporting and financial audit.",
    ],
  },
  iqcent: {
    market: "cent accounts, promotions and copy trading",
    angles: [
      "Low-ticket accounts, optional tournaments, copy features and promotional campaigns.",
      "Antifraud rules for bonuses, regional limits, affiliates and audit logs.",
    ],
  },
  raceoption: {
    market: "binary options with advanced trade features",
    angles: [
      "Optional features such as rollover, sell trade, double up, copy and demo account.",
      "Granular panel for payout, instruments, active features, affiliates and risk.",
    ],
  },
}

const scriptsEn = scripts.map((script) => ({
  ...script,
  market: scriptTranslations[script.slug].market,
  angles: scriptTranslations[script.slug].angles,
}))

const systemLayers = [
  {
    eyebrow: "Traderoom",
    title: "Experiência do usuário",
    text: "Conta demo, conta real, gráficos, carteira, histórico e jornadas mobile para operadores que precisam de produto com cara de marca própria.",
  },
  {
    eyebrow: "Operação",
    title: "Backoffice e CRM",
    text: "Usuários, vendas, suporte, permissões, campanhas, bônus, afiliados e relatórios em uma camada administrável.",
  },
  {
    eyebrow: "Fluxo financeiro",
    title: "Pagamentos e PSPs",
    text: "Fluxos para depósito, saque, reconciliação, métodos locais e regras por país, com espaço para integrações do operador.",
  },
  {
    eyebrow: "Controle",
    title: "KYC, antifraude e risco",
    text: "Verificação, limites, auditoria, regras de jurisdição, logs e monitoramento para reduzir improviso operacional.",
  },
]

const operatorPhases = [
  {
    label: "01",
    title: "Marca, domínio e traderoom",
    text: "Escolha a referência de broker. A Arcos transforma o fluxo em traderoom, identidade, domínio, idiomas e jornada mobile com sua própria marca.",
    image: {
      src: "assets/arcos-phase-brand-foundation.webp",
      alt: "Interface de trading white-label com domínio, identidade visual, app mobile e componentes de marca",
    },
  },
  {
    label: "02",
    title: "CRM, pagamentos e compliance",
    text: "Conecte cadastro, CRM, PSPs, KYC/AML, antifraude, suporte e regras de risco como parte do MVP, não como remendos depois do launch.",
    image: {
      src: "assets/arcos-phase-operations.webp",
      alt: "Painéis operacionais white-label com CRM, KYC, antifraude, pagamentos, afiliados, suporte e hub de operações",
    },
  },
  {
    label: "03",
    title: "Afiliados, relatórios e mercados",
    text: "Depois do MVP, expanda campanhas, afiliados, métodos de pagamento, regiões e módulos sem reconstruir a plataforma do zero.",
    image: {
      src: "assets/arcos-phase-market-scale.webp",
      alt: "Painéis white-label para expansão de mercados com regiões, moedas, pagamentos, campanhas, relatórios e módulos",
    },
  },
]

const processSteps = [
  ["01", "Escolha a referência", "Você indica o broker, fluxo de trading, mercados, idiomas, apps e módulos que quer usar como base do escopo."],
  ["02", "Fechamos o MVP", "Definimos traderoom, carteira, CRM, pagamentos, KYC/AML, antifraude, afiliados, reporting e prioridades de lançamento."],
  ["03", "Construímos white-label", "Aplicamos sua marca, domínio, textos, permissões e integrações para que o produto final seja independente."],
  ["04", "Testamos e lançamos", "Validamos cadastro, KYC, depósito, trading, saque, responsividade, logs, performance e operação antes do go-live."],
]

const objections = [
  ["É uma cópia de broker?", "Não. Usamos brokers conhecidos como referência de funcionalidade. O produto final usa sua marca, domínio, UI, textos, termos e entidade."],
  ["O que entra no MVP?", "Traderoom, carteira, CRM, backoffice, pagamentos, KYC/AML, antifraude, afiliados, apps, reporting e páginas comerciais, conforme escopo."],
  ["PSPs e CRM podem ser conectados?", "Sim. Pagamentos e operação comercial são tratados como parte central da plataforma, não como integrações esquecidas no final."],
  ["E a parte legal?", "A tecnologia suporta KYC/AML, logs, limites e regras por país. Licenciamento, oferta e aprovação legal ficam com o operador."],
]

const ecosystem = [
  "Traderoom web",
  "Apps iOS/Android",
  "CRM de vendas",
  "Integrações PSP",
  "Wallet",
  "KYC/AML",
  "Antifraude",
  "Audit logs",
  "Afiliados",
  "Relatórios",
  "Notificações",
  "Regras por país",
]

const faqs = [
  [
    "A Arcos Online é afiliada aos brokers citados?",
    "Não. Os nomes são referências de produto e pesquisa de mercado. O projeto final deve usar marca, entidade, domínio, termos, assets e controles próprios.",
  ],
  [
    "O clone script fica pronto para operar em qualquer país?",
    "Não automaticamente. Cada operação precisa validar licenciamento, oferta, KYC/AML, pagamento, comunicação comercial e regras por jurisdição.",
  ],
  [
    "Quanto tempo leva para lançar?",
    "Um MVP com escopo fechado pode entrar em homologação em poucas semanas. O prazo depende de PSPs, apps, integrações, compliance e customizações.",
  ],
  [
    "A interface pode ser personalizada?",
    "Sim. A proposta é white-label: layout, cores, idiomas, ativos, funis, módulos, permissões e integrações podem ser adaptados ao operador.",
  ],
  [
    "Vocês entregam só front-end?",
    "Não. A proposta da Arcos é tratar produto, operação, pagamentos, CRM e risco como um sistema. A profundidade de cada módulo depende do escopo contratado.",
  ],
  [
    "Posso começar por um clone script específico?",
    "Sim. As páginas de Deriv, IQ Option, Quotex, Pocket Option e outras referências ajudam a escolher o tipo de fluxo, módulos e prioridade de lançamento.",
  ],
]

const operatorPhasesEn = [
  {
    label: "01",
    title: "Brand, domain and traderoom",
    text: "Choose the broker reference. Arcos turns the flow into your own traderoom, identity, domain, languages and mobile journey.",
    image: {
      src: "assets/arcos-phase-brand-foundation.webp",
      alt: "White-label trading interface with domain, visual identity, mobile app and brand components",
    },
  },
  {
    label: "02",
    title: "CRM, payments and compliance",
    text: "Connect signup, CRM, PSPs, KYC/AML, antifraud, support and risk rules as part of the MVP, not as patches after launch.",
    image: {
      src: "assets/arcos-phase-operations.webp",
      alt: "White-label operations panels with CRM, KYC, antifraud, payments, affiliates, support and an operations hub",
    },
  },
  {
    label: "03",
    title: "Affiliates, reporting and markets",
    text: "After the MVP, expand campaigns, affiliates, payment methods, regions and modules without rebuilding the platform from zero.",
    image: {
      src: "assets/arcos-phase-market-scale.webp",
      alt: "White-label market expansion panels with regions, currencies, payments, campaigns, reports and modules",
    },
  },
]

const processStepsEn = [
  ["01", "Choose the reference", "You pick the broker, trading flow, markets, languages, apps and modules that should guide the scope."],
  ["02", "Lock the MVP", "We define traderoom, wallet, CRM, payments, KYC/AML, antifraud, affiliates, reporting and launch priorities."],
  ["03", "Build white-label", "We apply your brand, domain, copy, permissions and integrations so the final product is independent."],
  ["04", "Test and launch", "We validate signup, KYC, deposit, trading, withdrawal, responsiveness, logs, performance and operations before go-live."],
]

const cloneLaunchSteps = {
  pt: [
    ["01", "Referência e escopo", "Mapeamos quais flows estilo broker fazem sentido para o seu mercado: traderoom, instrumentos, apps, wallet, KYC, pagamentos, CRM e afiliados."],
    ["02", "Produto white-label", "Transformamos a referência em experiência própria: marca, domínio, copy, UI, permissões, idiomas, onboarding, demo e real accounts."],
    ["03", "Integrações e risco", "Conectamos PSPs, provedores de KYC, regras de dealing, antifraude, limites, comissões, spreads, auditoria e reporting."],
    ["04", "QA e go-live", "Validamos cadastro, KYC, depósito, trading, saque, mobile, performance, logs e fluxos operacionais antes do lançamento."],
  ],
  en: [
    ["01", "Reference and scope", "We map which broker-style flows make sense for your market: traderoom, instruments, apps, wallet, KYC, payments, CRM and affiliates."],
    ["02", "White-label product design", "We turn the reference into your own experience: brand, domain, copy, UI, permissions, languages, onboarding, demo and real accounts."],
    ["03", "Integrations and risk rules", "We connect PSPs, KYC providers, dealing rules, antifraud, limits, commissions, spreads, audit trails and reporting."],
    ["04", "QA and go-live", "We validate signup, KYC, deposit, trading, withdrawal, mobile, performance, logs and operational flows before launch."],
  ],
}

const objectionsEn = [
  ["Is this a broker copy?", "No. We use known brokers as functionality references. The final product uses your own brand, domain, UI, copy, terms and entity."],
  ["What is included in the MVP?", "Traderoom, wallet, CRM, backoffice, payments, KYC/AML, antifraud, affiliates, apps, reporting and commercial pages, depending on scope."],
  ["Can PSPs and CRM be connected?", "Yes. Payments and commercial operations are treated as core platform parts, not forgotten integrations at the end."],
  ["What about legal review?", "The technology supports KYC/AML, logs, limits and country rules. Licensing, offering structure and legal approval remain with the operator."],
]

const ecosystemEn = [
  "Web traderoom",
  "iOS/Android apps",
  "Sales CRM",
  "PSP integrations",
  "Wallet",
  "KYC/AML",
  "Antifraud",
  "Audit logs",
  "Affiliates",
  "Reporting",
  "Notifications",
  "Country rules",
]

const faqsEn = [
  [
    "Is Arcos Online affiliated with the brokers mentioned?",
    "No. The names are product references and market research signals. The final project must use its own brand, entity, domain, terms, assets and controls.",
  ],
  [
    "Is the clone script ready to operate in any country?",
    "Not automatically. Each operation must validate licensing, offering structure, KYC/AML, payments, commercial communication and jurisdiction rules.",
  ],
  [
    "How long does launch take?",
    "A closed-scope MVP can enter acceptance testing in a few weeks. Timing depends on PSPs, apps, integrations, compliance and customizations.",
  ],
  [
    "Can the interface be customized?",
    "Yes. The proposal is white-label: layout, colors, languages, assets, funnels, modules, permissions and integrations can be adapted to the operator.",
  ],
  [
    "Do you deliver only front-end?",
    "No. Arcos treats product, operations, payments, CRM and risk as one system. The depth of each module depends on the contracted scope.",
  ],
  [
    "Can I start from a specific clone script?",
    "Yes. The Deriv, IQ Option, Quotex, Pocket Option and other reference pages help choose the flow type, modules and launch priorities.",
  ],
]

const clonePills = {
  pt: ["Traderoom", "CRM", "Pagamentos", "KYC/AML", "Dealing", "Afiliados", "Apps"],
  en: ["Traderoom", "CRM", "Payments", "KYC/AML", "Dealing", "Affiliates", "Apps"],
}

const cloneHeroScreens = [
  {
    key: "deriv",
    src: "assets/hero-screen-deriv.webp",
    alt: "Deriv-style clean traderoom reference with chart and trade panel",
  },
  {
    key: "pocket-option",
    src: "assets/hero-screen-pocket-option.webp",
    alt: "Pocket Option-style dark traderoom reference with chart and order panel",
  },
  {
    key: "quotex",
    src: "assets/hero-screen-quotex.webp",
    alt: "Quotex-style trading platform reference with expiry controls",
  },
  {
    key: "binomo",
    src: "assets/hero-screen-binomo.webp",
    alt: "Binomo-style uptrend chart reference with fast trade controls",
  },
  {
    key: "olymp-trade",
    src: "assets/hero-screen-olymp.webp",
    alt: "Olymp Trade-style market and trading interface reference",
  },
  {
    key: "iq-option",
    src: "assets/hero-screen-iq-option.webp",
    alt: "IQ Option-style trading education and platform interface reference",
  },
]

const cloneModuleGroups = {
  pt: [
    {
      title: "Dealing e liquidez",
      items: [
        "Mesa de dealing e controles operacionais",
        "Detecção e gestão de fraude/abuso",
        "Políticas flexíveis de spreads e comissões",
        "Condições de trading e processamento rápido",
        "Provedores de liquidez pré-integrados",
        "Provedores de cotações pré-integrados",
      ],
    },
    {
      title: "Plataforma e aplicações",
      items: [
        "Traderoom com UI/UX premium",
        "Interface totalmente customizável",
        "Ampla gama de recursos de trading",
        "Web, desktop, iOS/Android",
        "PWA (Progressive Web App)",
      ],
    },
    {
      title: "Billing e pagamentos",
      items: [
        "Visa, Mastercard e Google Pay",
        "Bitcoin e Pix",
        "170+ PSPs out of the box",
        "Integração de métodos de pagamento",
        "Restrição de métodos por mercado, regra ou usuário",
      ],
    },
    {
      title: "Compliance e segurança",
      items: [
        "Integrações com Veriff, Shufti Pro e Sumsub",
        "KYC/AML e KYC multi-level",
        "Construtor de documentos",
        "Monitoring & Intrusion Detection",
        "Third-Party Risk Management",
        "Backups e Disaster Recovery",
      ],
    },
    {
      title: "Sales e comunicação",
      items: [
        "Módulo de vendas e CRM comercial",
        "Telefonia moderna",
        "Configuração de triggers customizados",
        "Tracking web e mobile",
        "Chats, chamadas recebidas e ticket system",
      ],
    },
    {
      title: "Analytics e afiliados",
      items: [
        "Trading history, user cards e In/Out summary",
        "Relatórios operacionais e financeiros",
        "Sistema de afiliados",
        "CPA, revenue share e spread share",
        "Lot offer",
      ],
    },
  ],
  en: [
    {
      title: "Dealing & Liquidity",
      items: [
        "Dealing desk and operator controls",
        "Fraud/abuse detection and management",
        "Flexible spreads and commissions policies",
        "Optimal trading conditions and fast processing",
        "Pre-integrated liquidity providers",
        "Pre-integrated quotes providers",
      ],
    },
    {
      title: "Platform & Applications",
      items: [
        "Best-in-class trading platform UI/UX",
        "Fully customizable interface",
        "Wide range of trading features",
        "Web, desktop and iOS/Android apps",
        "PWA (Progressive Web App)",
      ],
    },
    {
      title: "Billing & Payments",
      items: [
        "Visa, Mastercard and Google Pay",
        "Bitcoin and Pix",
        "170+ PSPs out of the box",
        "Integrate payment methods",
        "Restrict payment methods by market, rule or user",
      ],
    },
    {
      title: "Compliance & Security",
      items: [
        "Veriff, Shufti Pro and Sumsub integrations",
        "KYC/AML and multi-level KYC",
        "Documents constructor",
        "Monitoring & Intrusion Detection",
        "Third-Party Risk Management",
        "Data Backups & Disaster Recovery",
      ],
    },
    {
      title: "Sales & Communication",
      items: [
        "Sales module and commercial CRM",
        "Modern telephony",
        "Custom triggers configuration",
        "Web and mobile tracking system",
        "Chats, incoming calls and ticket system",
      ],
    },
    {
      title: "Analytics & Affiliate",
      items: [
        "Trading history, user cards and In/Out summary",
        "Operational and financial reports",
        "Affiliate system",
        "CPA, revenue share and spread share",
        "Lot offer",
      ],
    },
  ],
}

const outDir = path.join(process.cwd(), "dist")

await rm(outDir, { recursive: true, force: true })
await mkdir(path.join(outDir, "clone-scripts"), { recursive: true })
await mkdir(path.join(outDir, "en", "clone-scripts"), { recursive: true })
await mkdir(path.join(outDir, "assets"), { recursive: true })

await writeFile(path.join(outDir, "index.html"), renderPage({
  locale: "pt",
  title: "Arcos Online | Clone scripts para corretoras white-label",
  description: site.description,
  pathName: "/",
  body: renderHome("pt", "/"),
  schema: homeSchema("pt"),
}))

await writeFile(path.join(outDir, "en", "index.html"), renderPage({
  locale: "en",
  title: "Arcos Online | Clone scripts for white-label brokerages",
  description: site.descriptionEn,
  pathName: "/en/",
  body: renderHome("en", "/en/"),
  schema: homeSchema("en"),
}))

for (const script of scripts) {
  const dir = path.join(outDir, "clone-scripts", script.slug)
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, "index.html"), renderPage({
    locale: "pt",
    title: `${script.name} Clone Script para Plataforma de Trading | Arcos Online`,
    description: clonePageDescription(script, "pt"),
    pathName: `/clone-scripts/${script.slug}/`,
    body: renderClonePage(script, "pt"),
    schema: softwareSchema(script, "pt"),
  }))
}

for (const script of scriptsEn) {
  const dir = path.join(outDir, "en", "clone-scripts", script.slug)
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, "index.html"), renderPage({
    locale: "en",
    title: `${script.name} Platform Clone Script | Arcos Online`,
    description: clonePageDescription(script, "en"),
    pathName: `/en/clone-scripts/${script.slug}/`,
    body: renderClonePage(script, "en"),
    schema: softwareSchema(script, "en"),
  }))
}

await writeFile(path.join(outDir, "sitemap.xml"), renderSitemap())
await writeFile(path.join(outDir, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${site.domain}/sitemap.xml\n`)
await copyFile(path.join(process.cwd(), "assets", "styles.css"), path.join(outDir, "assets", "styles.css"))
await copyFile(path.join(process.cwd(), "assets", "site.js"), path.join(outDir, "assets", "site.js"))
await copyFile(path.join(process.cwd(), "assets", "arcos-logo.svg"), path.join(outDir, "assets", "arcos-logo.svg"))
await copyFile(path.join(process.cwd(), "assets", "favicon.ico"), path.join(outDir, "assets", "favicon.ico"))
await copyFile(path.join(process.cwd(), "assets", "hero-ecosystem.webp"), path.join(outDir, "assets", "hero-ecosystem.webp"))
await copyFile(path.join(process.cwd(), "assets", "arcos-paper-plane.svg"), path.join(outDir, "assets", "arcos-paper-plane.svg"))
await copyFile(path.join(process.cwd(), "assets", "arcos-hero-hand-left.svg"), path.join(outDir, "assets", "arcos-hero-hand-left.svg"))
await copyFile(path.join(process.cwd(), "assets", "arcos-hero-hand-right.svg"), path.join(outDir, "assets", "arcos-hero-hand-right.svg"))
await copyFile(path.join(process.cwd(), "assets", "arcos-platform-visual.webp"), path.join(outDir, "assets", "arcos-platform-visual.webp"))
await copyFile(path.join(process.cwd(), "assets", "clone-script-hero-visual.png"), path.join(outDir, "assets", "clone-script-hero-visual.png"))
await copyFile(path.join(process.cwd(), "assets", "traderoom-slide-desktop.webp"), path.join(outDir, "assets", "traderoom-slide-desktop.webp"))
await copyFile(path.join(process.cwd(), "assets", "traderoom-slide-platform.png"), path.join(outDir, "assets", "traderoom-slide-platform.png"))
await copyFile(path.join(process.cwd(), "assets", "traderoom-slide-mobile.png"), path.join(outDir, "assets", "traderoom-slide-mobile.png"))
await copyFile(path.join(process.cwd(), "assets", "platform-slide-pocket-option.png"), path.join(outDir, "assets", "platform-slide-pocket-option.png"))
await copyFile(path.join(process.cwd(), "assets", "platform-slide-quotex.png"), path.join(outDir, "assets", "platform-slide-quotex.png"))
await copyFile(path.join(process.cwd(), "assets", "platform-slide-binomo-uptrend.png"), path.join(outDir, "assets", "platform-slide-binomo-uptrend.png"))
await copyFile(path.join(process.cwd(), "assets", "hero-screen-deriv.webp"), path.join(outDir, "assets", "hero-screen-deriv.webp"))
await copyFile(path.join(process.cwd(), "assets", "hero-screen-pocket-option.webp"), path.join(outDir, "assets", "hero-screen-pocket-option.webp"))
await copyFile(path.join(process.cwd(), "assets", "hero-screen-quotex.webp"), path.join(outDir, "assets", "hero-screen-quotex.webp"))
await copyFile(path.join(process.cwd(), "assets", "hero-screen-binomo.webp"), path.join(outDir, "assets", "hero-screen-binomo.webp"))
await copyFile(path.join(process.cwd(), "assets", "hero-screen-olymp.webp"), path.join(outDir, "assets", "hero-screen-olymp.webp"))
await copyFile(path.join(process.cwd(), "assets", "hero-screen-iq-option.webp"), path.join(outDir, "assets", "hero-screen-iq-option.webp"))
await copyFile(path.join(process.cwd(), "assets", "arcos-phase-brand-foundation.webp"), path.join(outDir, "assets", "arcos-phase-brand-foundation.webp"))
await copyFile(path.join(process.cwd(), "assets", "arcos-phase-operations.webp"), path.join(outDir, "assets", "arcos-phase-operations.webp"))
await copyFile(path.join(process.cwd(), "assets", "arcos-phase-market-scale.webp"), path.join(outDir, "assets", "arcos-phase-market-scale.webp"))

function clone(slug, name, market, angles) {
  return {
    slug,
    name,
    market,
    angles,
    highlights: ["White-label", "CRM", "PSPs", "KYC/AML", "Apps"],
    trader: ["Cadastro e login", "Conta demo e real", "Traderoom responsiva", "Carteira", "Histórico de ordens"],
    admin: ["Gestão de usuários", "Configuração de ativos", "Painel financeiro", "Afiliados", "Relatórios"],
    security: ["KYC/AML", "2FA", "Antifraude", "Limites por região", "Logs de auditoria"],
  }
}

function renderPage({ locale = "pt", title, description, pathName, body, schema, preloadHero = false }) {
  const canonical = `${site.domain}${pathName}`
  const isClonePage = pathName.includes("/clone-scripts/")
  const heroImage = isClonePage ? "assets/clone-script-hero-visual.png" : "assets/hero-ecosystem.webp"
  const imageUrl = `${site.domain}/${heroImage}`
  const lang = locale === "en" ? "en" : "pt-BR"

  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="icon" href="${assetPath(pathName, "assets/favicon.ico")}?v=${assetVersion}" sizes="any" type="image/x-icon">
  <link rel="canonical" href="${canonical}">
  ${renderAlternates(pathName)}
  ${preloadHero || isClonePage ? `<link rel="preload" as="image" href="${assetPath(pathName, heroImage)}" fetchpriority="high">` : ""}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${site.name}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${imageUrl}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${imageUrl}">
  <link rel="stylesheet" href="${assetPath(pathName, "assets/styles.css")}?v=${assetVersion}">
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
  <div class="app-background" aria-hidden="true"></div>
  <div class="scroll-progress" data-scroll-progress aria-hidden="true"></div>
  ${renderHeader(pathName, locale)}
  <main>${body}</main>
  ${renderFooter(pathName, locale)}
  <script src="${assetPath(pathName, "assets/site.js")}?v=${assetVersion}"></script>
</body>
</html>`
}

function renderHeader(pathName, locale = "pt") {
  const isEn = locale === "en"
  const homePath = isEn ? "/en/" : "/"
  const labels = isEn
    ? { sections: "Section navigation", what: "What it is", phases: "Phases", home: "Arcos Online home", menu: "Menu", main: "Main navigation", modules: "Modules", scripts: "Clone scripts", faq: "FAQ", briefing: "Briefing", language: "Language" }
    : { sections: "Navegação de seções", what: "O que é", phases: "Fases", home: "Arcos Online home", menu: "Menu", main: "Navegação principal", modules: "Módulos", scripts: "Clone scripts", faq: "FAQ", briefing: "Briefing", language: "Idioma" }

  return `<header class="site-header">
  <div class="nav-shell">
    <nav class="nav-side nav-side-left" aria-label="${labels.sections}">
      <a href="${hrefForPath(pathName, homePath)}#o-que-e">${labels.what}</a>
      <a href="${hrefForPath(pathName, homePath)}#fases">${labels.phases}</a>
    </nav>
    <a class="brand brand-center" href="${hrefForPath(pathName, homePath)}" aria-label="${labels.home}">
      ${renderBrandLogo(pathName)}
    </a>
    <button class="menu-button" type="button" data-menu-button aria-expanded="false" aria-controls="main-nav">${labels.menu}</button>
    <nav id="main-nav" class="main-nav nav-side nav-side-right" data-main-nav aria-label="${labels.main}">
      <a href="${hrefForPath(pathName, homePath)}#ecossistema">${labels.modules}</a>
      <a href="${hrefForPath(pathName, homePath)}#solucoes">${labels.scripts}</a>
      <a href="${hrefForPath(pathName, homePath)}#faq">${labels.faq}</a>
      <div class="language-switch" aria-label="${labels.language}">
        <a class="${locale === "pt" ? "is-active" : ""}" href="${hrefForPath(pathName, toPtPath(pathName))}" hreflang="pt-BR">PT</a>
        <a class="${locale === "en" ? "is-active" : ""}" href="${hrefForPath(pathName, toEnPath(pathName))}" hreflang="en">EN</a>
      </div>
      <a class="nav-cta" href="${hrefForPath(pathName, homePath)}#contato">${labels.briefing}</a>
    </nav>
  </div>
</header>`
}

function renderFooter(pathName, locale = "pt") {
  const isEn = locale === "en"
  const list = isEn ? scriptsEn : scripts
  const homePath = isEn ? "/en/" : "/"
  const copy = isEn
    ? {
        small: "Clone scripts for brokerages",
        text: "White-label brokerage software with traderoom, CRM, PSPs, apps, affiliates, KYC/AML, antifraud and risk controls.",
        warningTitle: "Notice",
        warning: "Arcos Online is independent and not affiliated with the brokers mentioned. Names are used only as product references.",
        bottom: "Software and technical consulting for white-label platforms.",
      }
    : {
        small: "Clone scripts para corretoras",
        text: "Software white-label para corretoras com traderoom, CRM, PSPs, apps, afiliados, KYC/AML, antifraude e controles de risco.",
        warningTitle: "Aviso",
        warning: "A Arcos Online é independente e não é afiliada aos brokers citados. Os nomes servem apenas como referências de produto.",
        bottom: "Software e consultoria técnica para plataformas white-label.",
      }

  return `<footer class="site-footer">
  <div class="footer-grid">
    <div>
      <a class="brand footer-brand" href="${hrefForPath(pathName, homePath)}" aria-label="Arcos Online home">
        ${renderBrandLogo(pathName)}
        <span class="footer-brand-note">${copy.small}</span>
      </a>
      <p>${copy.text}</p>
    </div>
    <div>
      <h2>Clone scripts</h2>
      <div class="footer-links">${list.map((script) => `<a href="${hrefForPath(pathName, `${homePath}clone-scripts/${script.slug}/`)}">${script.name}</a>`).join("")}</div>
    </div>
    <div>
      <h2>${copy.warningTitle}</h2>
      <p>${copy.warning}</p>
    </div>
  </div>
  <div class="footer-bottom">© <span data-year></span> Arcos Online. ${copy.bottom}</div>
</footer>`
}

function renderBrandLogo(pathName) {
  return `<span class="brand-logo-wrap">
    <img class="brand-logo" src="${assetPath(pathName, "assets/arcos-logo.svg")}" width="1211" height="257" alt="" aria-hidden="true" decoding="async">
  </span>`
}

function renderFlightAircraft(pathName) {
  return `<div class="flight-aircraft" data-flight-aircraft>
      <div class="flight-speed-lines" aria-hidden="true">
        <span></span><span></span><span></span><span></span>
      </div>
      <img class="flight-plane" src="${assetPath(pathName, "assets/arcos-paper-plane.svg")}" width="1149" height="622" alt="" loading="lazy" decoding="async">
    </div>`
}

function renderHeroKinetic(pathName) {
  return `<div class="hero-kinetic-stage" data-kinetic-hero aria-hidden="true">
    <img class="hero-hand-art hero-hand-art-left" src="${assetPath(pathName, "assets/arcos-hero-hand-left.svg")}" width="1254" height="1254" alt="" decoding="async" fetchpriority="high">
    <img class="hero-hand-art hero-hand-art-right" src="${assetPath(pathName, "assets/arcos-hero-hand-right.svg")}" width="1254" height="1254" alt="" decoding="async" fetchpriority="high">
  </div>`
}

function renderHeroTitleBurst() {
  return `<svg class="hero-title-burst" viewBox="0 0 1120 560" preserveAspectRatio="none" aria-hidden="true" role="presentation">
    <path class="burst-star burst-star-one" d="M130 342 L148 376 L182 394 L148 412 L130 446 L112 412 L78 394 L112 376Z"/>
    <path class="burst-star burst-star-two" d="M990 342 L1008 376 L1042 394 L1008 412 L990 446 L972 412 L938 394 L972 376Z"/>
  </svg>`
}

function renderHome(locale = "pt", pathName = "/") {
  if (locale === "en") return renderHomeEn(pathName)

  return `<section class="wero-hero" aria-labelledby="home-title">
  ${renderHeroKinetic(pathName)}
  <div class="hero-title-wrap" data-reveal>
    <p class="hero-kicker">Clone scripts para corretoras</p>
    ${renderHeroTitleBurst()}
    <h1 id="home-title">
      <span>LANCE SUA</span>
      <span>CORRETORA COM</span>
      <span>CLONE SCRIPTS</span>
    </h1>
    <p class="hero-subcopy">Lance uma plataforma white-label inspirada em brokers líderes. A Arcos entrega traderoom, CRM, pagamentos, KYC/AML, apps, antifraude, afiliados e reporting sob sua própria marca.</p>
    <div class="hero-actions hero-actions-home">
      <a class="button primary" href="#solucoes">Ver clone scripts</a>
      <a class="button secondary" href="#contato">Solicitar briefing</a>
    </div>
  </div>
  <a class="hero-scroll-pill" href="#o-que-e"><span>↓</span>Ver como funciona</a>
</section>

<section class="meet-section" data-reveal>
  <p class="top-title">O que você recebe</p>
  <h2>Uma plataforma para corretora pronta para operar, não só um front-end.</h2>
  <p>A Arcos monta os módulos que uma corretora precisa para lançar: traderoom, wallet, CRM, pagamentos, KYC/AML, risco, afiliados, apps e reporting.</p>
</section>

<section class="flight-section" data-flight-section>
  <div class="flight-copy" data-reveal>
    <p class="top-title">Um build conectado</p>
    <h2>Produto, pagamentos e operação precisam sair juntos.</h2>
    <p>Cada clone script conecta a experiência de trading com os sistemas por trás dela: CRM, PSPs, KYC/AML, antifraude, apps, afiliados e reporting.</p>
  </div>
  <div class="flight-viewport" aria-hidden="true">
    ${renderFlightAircraft(pathName)}
  </div>
</section>

<section id="o-que-e" class="section what-section" data-reveal>
  <div class="what-visual">
    <img class="what-visual-image" src="${assetPath(pathName, "assets/arcos-platform-visual.webp")}" width="1448" height="1086" alt="Interface white-label de trading com traderoom, wallet, gestão de risco, pagamentos e app mobile" loading="lazy" decoding="async">
  </div>
  <div class="what-content">
    <p class="top-title">Clone scripts, explicado</p>
    <h2>Comece por fluxos conhecidos. Lance com sua própria marca.</h2>
    <p>Um clone script usa referências como Deriv, IQ Option, Quotex ou Pocket Option para definir produto, telas, módulos e jornada comercial.</p>
    <p>O lançamento final é independente: sua marca, seu domínio, sua entidade, seus termos, seus assets e sua revisão legal.</p>
  </div>
</section>

<section class="section shift-section" data-reveal>
  <p class="top-title">Por que operadores usam esse caminho?</p>
  <h2>Mais rápido que construir do zero. Mais seguro que copiar uma marca.</h2>
  <div class="shift-copy">
    <p>Você não perde meses desenhando cada fluxo básico. Começa por uma referência de mercado e foca no que realmente muda: marca, oferta, país, pagamentos e operação.</p>
    <p>Ao mesmo tempo, não reutiliza logos, textos ou assets de terceiros. A plataforma nasce white-label e preparada para revisão legal.</p>
  </div>
</section>

<section id="fases" class="cards-block" data-reveal>
  <h2>Da referência de broker ao plano de lançamento</h2>
  <div class="cards-block__holder">
    ${operatorPhases.map(renderPhase).join("")}
  </div>
</section>

<section id="como-funciona" class="section process-section" data-reveal>
  <p class="top-title">Como funciona</p>
  <h2>Como transformamos uma referência na sua plataforma.</h2>
  ${renderProcess()}
</section>

<section class="question-strip" data-reveal>
  <p class="top-title">Dúvidas importantes</p>
  <h2>O que precisa ficar claro antes do escopo.</h2>
  <div class="question-grid">${objections.map(renderObjection).join("")}</div>
</section>

<section id="ecossistema" class="banks-section" data-reveal>
  <p class="top-title">Módulos</p>
  <h2>Escolha o que sua corretora precisa para operar.</h2>
  <p>O escopo pode começar enxuto e crescer por fases, conforme mercado, PSPs, CRM, apps e revisão legal.</p>
  <div class="ecosystem-wall">
    ${ecosystem.map((item, index) => `<span style="--i:${index}">${item}</span>`).join("")}
  </div>
</section>

<section id="solucoes" class="section catalog-section" data-reveal>
  <p class="top-title">Referências de clone script</p>
  <h2>Escolha um fluxo de broker para começar o escopo.</h2>
  <p>Deriv, IQ Option, Olymp Trade, Quotex, Pocket Option e outras referências ajudam a definir traderoom, mobile, CRM, pagamentos, afiliados e risco.</p>
  <div class="script-grid">${scripts.map((script) => renderScriptCard(script, "pt")).join("")}</div>
</section>

<section id="faq" class="section faq-section" data-reveal>
  <p class="top-title">FAQ</p>
  <h2>Perguntas frequentes antes da proposta</h2>
  <div class="faq-list">${faqs.map(renderFaq).join("")}</div>
</section>

<section id="contato" class="section final-cta" data-reveal>
  <div class="final-copy">
    <p class="top-title">Próxima etapa</p>
    <h2>Pronto para escopar seu clone script?</h2>
    <p>Envie referência de broker, mercado-alvo, idiomas, PSPs, apps e prazo. A Arcos responde com MVP, módulos, integrações críticas e riscos de lançamento.</p>
  </div>
  ${renderLeadForm("Arcos Online", "home")}
</section>`
}

function renderHomeEn(pathName) {
  return `<section class="wero-hero" aria-labelledby="home-title">
  ${renderHeroKinetic(pathName)}
  <div class="hero-title-wrap" data-reveal>
    <p class="hero-kicker">White-label brokerage software</p>
    ${renderHeroTitleBurst()}
    <h1 id="home-title">
      <span>START YOUR</span>
      <span>BROKERAGE WITH</span>
      <span>CLONE SCRIPTS</span>
    </h1>
    <p class="hero-subcopy">Launch a white-label brokerage platform inspired by leading brokers. Arcos delivers traderoom, CRM, payments, KYC/AML, apps, antifraud, affiliates and reporting under your own brand.</p>
    <div class="hero-actions hero-actions-home">
      <a class="button primary" href="#solucoes">View clone scripts</a>
      <a class="button secondary" href="#contato">Request briefing</a>
    </div>
  </div>
  <a class="hero-scroll-pill" href="#o-que-e"><span>↓</span>See how it works</a>
</section>

<section class="meet-section" data-reveal>
  <p class="top-title">What you get</p>
  <h2>A brokerage platform ready to operate, not just a front-end.</h2>
  <p>Arcos builds the core modules your brokerage needs to launch: traderoom, wallet, CRM, payments, KYC/AML, risk controls, affiliates, apps and reporting.</p>
</section>

<section class="flight-section" data-flight-section>
  <div class="flight-copy" data-reveal>
    <p class="top-title">One connected build</p>
    <h2>Product, payments and operations move together.</h2>
    <p>Each clone script connects the trading experience with the systems behind it: CRM, PSPs, KYC/AML, antifraud, apps, affiliates and reporting.</p>
  </div>
  <div class="flight-viewport" aria-hidden="true">
    ${renderFlightAircraft(pathName)}
  </div>
</section>

<section id="o-que-e" class="section what-section" data-reveal>
  <div class="what-visual">
    <img class="what-visual-image" src="${assetPath(pathName, "assets/arcos-platform-visual.webp")}" width="1448" height="1086" alt="White-label trading interface with traderoom, wallet, risk management, payments and mobile app" loading="lazy" decoding="async">
  </div>
  <div class="what-content">
    <p class="top-title">Clone scripts, explained</p>
    <h2>Start from proven broker flows. Launch as your own brand.</h2>
    <p>A clone script uses references like Deriv, IQ Option, Quotex or Pocket Option to define product structure, screens, modules and commercial journeys.</p>
    <p>The final launch is independent: your brand, your domain, your entity, your terms, your assets and your legal review.</p>
  </div>
</section>

<section class="section shift-section" data-reveal>
  <p class="top-title">Why operators use this route</p>
  <h2>Faster than building from zero. Safer than copying a brand.</h2>
  <div class="shift-copy">
    <p>You do not spend months designing every basic flow from scratch. You start from a market reference and focus on what changes: brand, offer, country, payments and operations.</p>
    <p>At the same time, you do not reuse third-party logos, text or assets. The platform is built white-label and prepared for legal review.</p>
  </div>
</section>

<section id="fases" class="cards-block" data-reveal>
  <h2>From broker reference to launch roadmap</h2>
  <div class="cards-block__holder">
    ${operatorPhasesEn.map((phase) => renderPhase(phase, "en")).join("")}
  </div>
</section>

<section id="como-funciona" class="section process-section" data-reveal>
  <p class="top-title">How it works</p>
  <h2>How we turn a reference into your platform.</h2>
  ${renderProcess(processStepsEn)}
</section>

<section class="question-strip" data-reveal>
  <p class="top-title">Important doubts</p>
  <h2>What should be clear before scoping.</h2>
  <div class="question-grid">${objectionsEn.map((item) => renderObjection(item, "en")).join("")}</div>
</section>

<section id="ecossistema" class="banks-section" data-reveal>
  <p class="top-title">Modules</p>
  <h2>Choose what your brokerage needs to operate.</h2>
  <p>The scope can start lean and grow by phase, depending on market, PSPs, CRM, apps and legal review.</p>
  <div class="ecosystem-wall">
    ${ecosystemEn.map((item, index) => `<span style="--i:${index}">${item}</span>`).join("")}
  </div>
</section>

<section id="solucoes" class="section catalog-section" data-reveal>
  <p class="top-title">Clone script references</p>
  <h2>Pick a broker flow to start the scope.</h2>
  <p>Deriv, IQ Option, Olymp Trade, Quotex, Pocket Option and other references help define traderoom, mobile, CRM, payments, affiliates and risk.</p>
  <div class="script-grid">${scriptsEn.map((script) => renderScriptCard(script, "en")).join("")}</div>
</section>

<section id="faq" class="section faq-section" data-reveal>
  <p class="top-title">FAQ</p>
  <h2>Common questions before the proposal</h2>
  <div class="faq-list">${faqsEn.map(renderFaq).join("")}</div>
</section>

<section id="contato" class="section final-cta" data-reveal>
  <div class="final-copy">
    <p class="top-title">Next step</p>
    <h2>Ready to scope your clone script?</h2>
    <p>Send broker reference, target market, languages, PSPs, apps and timeline. Arcos replies with MVP, modules, critical integrations and launch risks.</p>
  </div>
  ${renderLeadForm("Arcos Online", "home", "en")}
</section>`
}

function renderClonePage(script, locale = "pt") {
  if (locale === "en") return renderClonePageEn(script)

  return `${renderCloneStudioHero(script, "pt")}

${renderCloneFeatureShowcase(script, "pt")}

<section id="modulos" class="section band clone-modules-section">
  <div class="section-heading">
    <span class="eyebrow">Módulos inclusos</span>
    <h2>O stack completo para operar uma plataforma estilo ${script.name}.</h2>
    <p>O escopo final depende do mercado, licença, PSPs e revisão legal, mas a base cobre os módulos que uma operação white-label normalmente precisa para lançar e crescer.</p>
  </div>
  ${renderCloneModuleGroups("pt")}
</section>

<section class="section clone-model-section">
  <div class="section-heading">
    <span class="eyebrow">Como lançar</span>
    <h2>Como lançar um ${script.name} clone script.</h2>
    <p>Usamos a referência ${script.name} para definir fluxos, módulos e prioridades, depois transformamos isso em uma plataforma white-label independente com sua marca, domínio, PSPs, regras de risco e operação.</p>
  </div>
  ${renderCloneModelGrid(script, "pt")}
</section>

<section class="section clone-roadmap-section">
  <div class="section-heading">
    <span class="eyebrow">Roteiro de lançamento</span>
    <h2>Como transformamos a referência ${script.name} em produto próprio.</h2>
  </div>
  ${renderProcess(cloneLaunchSteps.pt)}
</section>

<section class="section faq-section">
  <div class="section-heading">
    <span class="eyebrow">FAQ</span>
    <h2>Perguntas sobre ${script.name} clone script</h2>
  </div>
  <div class="faq-list">
    ${cloneFaqs(script, "pt").map(renderFaq).join("")}
  </div>
</section>

<section id="contato" class="section contact-section">
  <div>
    <span class="eyebrow">Proposta técnica</span>
    <h2>Solicite escopo para ${script.name} clone script</h2>
    <p>Envie regiões-alvo, modelo comercial, PSPs, idiomas, apps e módulos desejados. Vamos separar MVP, integrações críticas e melhorias futuras.</p>
  </div>
  ${renderLeadForm(script.name, script.slug, "pt")}
</section>`
}

function renderClonePageEn(script) {
  return `${renderCloneStudioHero(script, "en")}

${renderCloneFeatureShowcase(script, "en")}

<section id="modulos" class="section band clone-modules-section">
  <div class="section-heading">
    <span class="eyebrow">Included modules</span>
    <h2>The complete stack for operating a ${script.name}-style platform.</h2>
    <p>The final scope depends on market, licensing, PSPs and legal review, but the base covers the modules a white-label operation usually needs to launch and scale.</p>
  </div>
  ${renderCloneModuleGroups("en")}
</section>

<section class="section clone-model-section">
  <div class="section-heading">
    <span class="eyebrow">How to launch</span>
    <h2>How to launch a ${script.name} clone script.</h2>
    <p>We use ${script.name} as a functional reference to define flows, modules and release priorities, then turn it into an independent white-label platform with your brand, domain, PSPs, risk rules and operating setup.</p>
  </div>
  ${renderCloneModelGrid(script, "en")}
</section>

<section class="section clone-roadmap-section">
  <div class="section-heading">
    <span class="eyebrow">Launch roadmap</span>
    <h2>How we turn the ${script.name} reference into your own product.</h2>
  </div>
  ${renderProcess(cloneLaunchSteps.en)}
</section>

<section class="section faq-section">
  <div class="section-heading">
    <span class="eyebrow">FAQ</span>
    <h2>Questions about ${script.name} clone script</h2>
  </div>
  <div class="faq-list">
    ${cloneFaqs(script, "en").map(renderFaq).join("")}
  </div>
</section>

<section id="contato" class="section contact-section">
  <div>
    <span class="eyebrow">Technical proposal</span>
    <h2>Request scope for ${script.name} clone script</h2>
    <p>Send target regions, commercial model, PSPs, languages, apps and desired modules. We will separate MVP, critical integrations and future improvements.</p>
  </div>
  ${renderLeadForm(script.name, script.slug, "en")}
</section>`
}

function renderSystemLayer(layer) {
  return `<article class="layer-card">
    <span>${layer.eyebrow}</span>
    <h3>${layer.title}</h3>
    <p>${layer.text}</p>
  </article>`
}

function renderPhase(phase, locale = "pt") {
  const visual = phase.image
    ? `<div class="card-visual card-visual-image-wrap">
      <img class="phase-visual-image" src="${assetPath(locale === "en" ? "/en/" : "/", phase.image.src)}" width="1448" height="1086" alt="${phase.image.alt}" loading="lazy" decoding="async">
    </div>`
    : `<div class="card-visual" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>`

  return `<article class="cards-block__card" data-reveal>
    <div class="card-number" aria-hidden="true">${phase.label}</div>
    ${visual}
    <div class="card-copy">
      <p>${locale === "en" ? "Phase" : "Fase"} ${phase.label.replace(/^0/, "")}</p>
      <h3>${phase.title}</h3>
      <p>${phase.text}</p>
    </div>
  </article>`
}

function renderObjection([question, answer], locale = "pt") {
  return `<article class="question-card">
    <p>${locale === "en" ? "Answered upfront" : "Temos a resposta"}</p>
    <h3>${question}</h3>
    <p>${answer}</p>
  </article>`
}

function renderScriptCard(script, locale = "pt") {
  return `<a class="script-card" href="clone-scripts/${script.slug}/">
  <span>${script.market}</span>
  <h3>${script.name} Clone Script</h3>
  <p>${script.angles[0]}</p>
  <strong>${locale === "en" ? "View solution" : "Ver solução"}</strong>
</a>`
}

function renderProcess(steps = processSteps) {
  return `<div class="process-grid">${steps.map(([step, title, text]) => `<article>
    <span>${step}</span>
    <h3>${title}</h3>
    <p>${text}</p>
  </article>`).join("")}</div>`
}

function renderFaq([question, answer]) {
  return `<details>
    <summary>${question}</summary>
    <p>${answer}</p>
  </details>`
}

function renderFeatureColumn(title, items) {
  return `<article class="feature-card">
    <h3>${title}</h3>
    ${items.map((item) => `<p>${item}</p>`).join("")}
  </article>`
}

function renderCloneModuleGroups(locale = "pt") {
  const groups = cloneModuleGroups[locale]
  return `<div class="clone-module-grid">
    ${groups.map((group) => `<article class="clone-module-card">
      <h3>${group.title}</h3>
      <ul>
        ${group.items.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </article>`).join("")}
  </div>`
}

function cloneHeroScreensFor(script) {
  const preferred = cloneHeroScreens.find((screen) => screen.key === script.slug)
  const lead = preferred || cloneHeroScreens[0]
  const rest = cloneHeroScreens.filter((screen) => screen.key !== lead.key)
  return [lead, ...rest].slice(0, 6)
}

function renderCloneHeroScreenWall(script, locale = "pt") {
  const isEn = locale === "en"
  const pagePath = isEn ? `/en/clone-scripts/${script.slug}/` : `/clone-scripts/${script.slug}/`

  return `<div class="clone-hero-screenwall" aria-label="${isEn ? "Trading platform interface references" : "Referências de interfaces de plataforma de trading"}">
    ${cloneHeroScreensFor(script).map((screen, index) => `<figure class="clone-hero-screen clone-hero-screen-${index + 1}" style="--screen-index:${index}">
      <img src="${assetPath(pagePath, screen.src)}" alt="${screen.alt}" ${index === 0 ? `fetchpriority="high"` : `loading="lazy"`} decoding="async">
    </figure>`).join("")}
  </div>`
}

function renderCloneStudioHero(script, locale = "pt") {
  const isEn = locale === "en"
  const title = isEn ? `${script.name} Platform Clone Script` : `${script.name} Clone Script para Plataforma de Trading`
  const description = isEn
    ? `Launch a white-label brokerage platform inspired by ${script.name}: traderoom, CRM, payments, KYC/AML, dealing controls, affiliate tools, apps and reporting under your own brand, domain and legal setup.`
    : `Lance uma plataforma brokerage white-label inspirada na ${script.name}: traderoom, CRM, pagamentos, KYC/AML, dealing, afiliados, apps e reporting sob sua própria marca, domínio e estrutura legal.`
  const primaryCta = isEn ? `Request ${script.name} scope` : `Solicitar escopo ${script.name}`
  const secondaryCta = isEn ? "View included modules" : "Ver módulos inclusos"

  return `<section class="clone-studio-hero">
  <div class="clone-studio-content">
    <h1>${title}</h1>
    <p>${description}</p>
    <div class="pill-row clone-studio-pills">${clonePills[locale].map((item) => `<span>${item}</span>`).join("")}</div>
    <div class="hero-actions clone-studio-actions">
      <a class="button primary" href="#contato">${primaryCta}</a>
      <a class="button secondary" href="#modulos">${secondaryCta}</a>
    </div>
  </div>
  ${renderCloneHeroScreenWall(script, locale)}
</section>`
}

function renderCloneHeroVisual(script, locale = "pt") {
  const isEn = locale === "en"
  const pagePath = isEn ? `/en/clone-scripts/${script.slug}/` : `/clone-scripts/${script.slug}/`
  const alt = isEn
    ? `White-label trading platform ecosystem for a ${script.name} clone script`
    : `Ecossistema de plataforma de trading white-label para ${script.name} clone script`

  return `<figure class="clone-hero-visual">
  <img src="${assetPath(pagePath, "assets/clone-script-hero-visual.png")}" width="1568" height="1003" alt="${alt}" decoding="async" fetchpriority="high">
</figure>`
}

function renderCloneFeatureShowcase(script, locale = "pt") {
  const isEn = locale === "en"
  const pagePath = isEn ? `/en/clone-scripts/${script.slug}/` : `/clone-scripts/${script.slug}/`
  const cards = isEn
    ? [
        {
          icon: "platform",
          title: "Traderoom and client apps",
          text: `A ${script.name}-style user journey with signup, demo and real accounts, wallet, order history, web traderoom, iOS/Android apps and PWA.`,
          visual: "stack",
        },
        {
          icon: "ops",
          title: "Backoffice for daily operations",
          text: "CRM, user cards, finance view, permissions, support workflows, tickets and sales triggers in one operating layer.",
        },
        {
          icon: "risk",
          title: "Payments, KYC and risk rules",
          text: "PSPs, local payment methods, KYC/AML, antifraud, dealing controls, limits, spreads, commissions and audit logs.",
        },
        {
          icon: "growth",
          title: "Affiliates and reporting",
          text: "CPA, revenue share, spread share, lot offers, trading history, in/out summary and reports for management decisions.",
          visual: "marquee",
        },
      ]
    : [
        {
          icon: "platform",
          title: "Traderoom e apps de cliente",
          text: `Jornada estilo ${script.name} com cadastro, conta demo e real, wallet, histórico, traderoom web, apps iOS/Android e PWA.`,
          visual: "stack",
        },
        {
          icon: "ops",
          title: "Backoffice para operação diária",
          text: "CRM, user cards, visão financeira, permissões, suporte, tickets e triggers de vendas em uma camada operacional.",
        },
        {
          icon: "risk",
          title: "Pagamentos, KYC e regras de risco",
          text: "PSPs, métodos locais, KYC/AML, antifraude, dealing, limites, spreads, comissões e logs de auditoria.",
        },
        {
          icon: "growth",
          title: "Afiliados e reporting",
          text: "CPA, revenue share, spread share, lot offers, trading history, in/out summary e relatórios para gestão.",
          visual: "marquee",
        },
      ]

  return `<section class="section clone-features-showcase">
  <div class="clone-showcase-head">
    <div class="clone-showcase-title">
      <span class="eyebrow">${isEn ? "What you can launch" : "O que você pode lançar"}</span>
      <h2>${isEn ? "Clone script services for a launch-ready brokerage." : "Serviços de clone script para lançar sua corretora."}</h2>
    </div>
    <p>${isEn ? `Use ${script.name} as a functional reference for an independent white-label platform: client apps, backoffice, payments, KYC/AML, dealing, affiliates and reporting under your own brand.` : `Use ${script.name} como referência funcional para uma plataforma white-label independente: apps, backoffice, pagamentos, KYC/AML, dealing, afiliados e reporting sob sua própria marca.`}</p>
  </div>
  <div class="clone-showcase-rule" aria-hidden="true"></div>
  <div class="clone-feature-grid">
    <div class="clone-feature-column">
      ${cards.slice(0, 2).map((card) => renderCloneFeatureCard(card, pagePath)).join("")}
    </div>
    <div class="clone-feature-column">
      ${cards.slice(2).map((card) => renderCloneFeatureCard(card, pagePath)).join("")}
    </div>
  </div>
  ${renderCloneFeatureBadgeRails()}
</section>`
}

function renderCloneFeatureCard(card, pagePath) {
  const visual = card.visual === "stack"
    ? renderCloneFeatureStack(pagePath)
    : card.visual === "marquee"
      ? renderCloneFeatureMarquee(pagePath)
      : ""

  return `<article class="clone-feature-card ${card.visual ? `has-${card.visual}` : ""}">
    <div class="clone-feature-card-head">
      <span class="clone-feature-icon" aria-hidden="true">${renderCloneFeatureIcon(card.icon)}</span>
      <h3>${card.title}</h3>
    </div>
    <p>${card.text}</p>
    ${visual}
  </article>`
}

function renderCloneFeatureStack(pagePath) {
  const images = [
    ["assets/platform-slide-pocket-option.png", "Pocket Option-style traderoom", "Charts, wallet and client trade panel"],
    ["assets/platform-slide-quotex.png", "Quotex-style traderoom", "Fast expiry controls and payout panel"],
    ["assets/platform-slide-binomo-uptrend.png", "Binomo-style quick trade", "Uptrend chart with fast trade controls"],
  ]
  const slides = images.map(([src, title, text], index) => `<figure class="platform-deck-card" style="--card-index: ${index}">
      <img src="${assetPath(pagePath, src)}" alt="" loading="lazy" decoding="async">
      <figcaption>
        <span>${title}</span>
        <small>${text}</small>
      </figcaption>
    </figure>`).join("")
  const dots = images.map((_, index) => `<span style="--dot-index: ${index}"></span>`).join("")

  return `<div class="clone-feature-stack clone-platform-deck" aria-hidden="true">
    <div class="platform-deck-stage">
      ${slides}
    </div>
    <div class="platform-deck-dots">
      ${dots}
    </div>
  </div>`
}

function renderCloneFeatureMarquee(pagePath) {
  const images = [
    ["assets/arcos-phase-operations.webp", "Operations module preview"],
    ["assets/arcos-phase-market-scale.webp", "Market scale module preview"],
    ["assets/arcos-phase-brand-foundation.webp", "Brand foundation module preview"],
  ]
  const row = images.map(([src, alt]) => `<img src="${assetPath(pagePath, src)}" alt="${alt}" loading="lazy" decoding="async">`).join("")
  return `<div class="clone-feature-marquee" aria-hidden="true">
    <div>${row}</div>
    <div>${row}</div>
  </div>`
}

function renderCloneFeatureBadgeRails() {
  const items = ["Traderoom", "CRM", "Payments", "KYC/AML", "Dealing", "Antifraud", "Affiliates", "Reports", "Apps", "PWA"]
  const row = items.map((item) => `<span>${item}</span>`).join("")
  return `<div class="clone-feature-badge-rails" aria-hidden="true">
    <div class="clone-feature-badge-lane">
      <div class="clone-feature-badge-row">${row}</div>
      <div class="clone-feature-badge-row">${row}</div>
    </div>
    <div class="clone-feature-badge-lane reverse">
      <div class="clone-feature-badge-row">${row}</div>
      <div class="clone-feature-badge-row">${row}</div>
    </div>
  </div>`
}

function renderCloneFeatureIcon(type) {
  const paths = {
    platform: `<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7A2.5 2.5 0 0 1 17.5 16h-11A2.5 2.5 0 0 1 4 13.5z"/><path d="M9 20h6"/><path d="M12 16v4"/>`,
    ops: `<path d="M12 3v3"/><path d="M12 18v3"/><path d="M3 12h3"/><path d="M18 12h3"/><path d="m5.6 5.6 2.1 2.1"/><path d="m16.3 16.3 2.1 2.1"/><path d="m18.4 5.6-2.1 2.1"/><path d="m7.7 16.3-2.1 2.1"/><circle cx="12" cy="12" r="3.5"/>`,
    risk: `<path d="M12 3 20 6.5v5.8c0 4.5-3.1 7.4-8 8.7-4.9-1.3-8-4.2-8-8.7V6.5z"/><path d="m8.8 12 2.1 2.1 4.6-4.8"/>`,
    growth: `<path d="M4 19V5"/><path d="M4 19h16"/><path d="m7 15 3.2-3.2 2.5 2.5L18 8"/><path d="M15 8h3v3"/>`,
  }

  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths[type] ?? paths.platform}</svg>`
}

function renderCloneModelGrid(script, locale = "pt") {
  const items = locale === "en"
    ? [
        ["01", "Map the reference", `Choose the ${script.name}-style user flows: signup, demo account, real account, wallet, traderoom, deposits, withdrawals and support.`],
        ["02", "Define the MVP", "Separate what must launch first from later improvements: web traderoom, CRM, PSPs, KYC/AML, dealing controls, affiliates and reports."],
        ["03", "Connect operations", "Configure payment methods, KYC providers, quotes, liquidity, risk limits, fraud rules, commissions, spreads and admin roles."],
        ["04", "Test and go live", "Run QA on trading flows, billing, documents, notifications, mobile behavior, audit logs and reporting before opening traffic."],
      ]
    : [
        ["01", "Mapear a referência", `Escolha os fluxos estilo ${script.name}: cadastro, conta demo, conta real, wallet, traderoom, depósitos, saques e suporte.`],
        ["02", "Definir o MVP", "Separe o que precisa entrar no primeiro lançamento: traderoom web, CRM, PSPs, KYC/AML, dealing, afiliados e relatórios."],
        ["03", "Conectar a operação", "Configure pagamentos, provedores KYC, quotes, liquidez, limites de risco, antifraude, comissões, spreads e papéis de admin."],
        ["04", "Testar e publicar", "Valide trading, billing, documentos, notificações, mobile, logs de auditoria e reporting antes de abrir tráfego."],
      ]

  return `<div class="clone-model-grid">
    ${items.map(([number, title, text]) => `<article>
      <span>${number}</span>
      <h3>${title}</h3>
      <p>${text}</p>
    </article>`).join("")}
  </div>`
}

function cloneFaqs(script, locale = "pt") {
  if (locale === "en") {
    return [
      [`Is this affiliated with ${script.name}?`, `No. Arcos Online is independent and is not affiliated with, endorsed by or authorized by ${script.name}. The name is used only to describe a product reference.`],
      [`Can it include ${script.name}-style products and features?`, `Yes, the scope can include similar functional flows such as traderoom, wallet, demo and real accounts, mobile apps, CRM, payments, dealing controls, KYC/AML, affiliates and reporting. The final UI, brand and legal setup must be yours.`],
      ["Which apps are included?", "The platform can include web traderoom, desktop, iOS/Android apps and PWA depending on scope, budget and release priority."],
      ["Can I connect my PSP or KYC provider?", "Yes. Billing can support card methods, local methods such as Pix, crypto flows such as Bitcoin and integrations with PSPs. KYC/AML can be connected to providers such as Veriff, Shufti Pro or Sumsub, subject to availability and review."],
      ["What compliance remains my responsibility?", "Licensing, legal entity, jurisdiction rules, commercial communication, client eligibility, risk disclosure, payment approval and ongoing compliance remain the operator's responsibility."],
      ["Can the same template be adapted for IQ Option, Quotex, Pocket Option and other brokers?", "Yes. The same white-label architecture can be adapted to different reference flows. The reference helps define product behavior; it does not mean copying brand assets or protected UI."],
    ]
  }

  return [
    [`A Arcos é afiliada à ${script.name}?`, `Não. A Arcos Online é independente e não é afiliada, endossada ou autorizada pela ${script.name}. O nome é usado apenas para descrever uma referência de produto.`],
    [`Pode incluir produtos e recursos estilo ${script.name}?`, `Sim, o escopo pode incluir flows funcionais semelhantes como traderoom, wallet, conta demo e real, apps, CRM, pagamentos, dealing, KYC/AML, afiliados e reporting. A UI final, marca e estrutura legal precisam ser suas.`],
    ["Quais apps entram no escopo?", "A plataforma pode incluir traderoom web, desktop, apps iOS/Android e PWA conforme escopo, orçamento e prioridade de lançamento."],
    ["Posso conectar meu PSP ou provedor KYC?", "Sim. Billing pode suportar cartões, métodos locais como Pix, fluxos cripto como Bitcoin e integrações com PSPs. KYC/AML pode conectar provedores como Veriff, Shufti Pro ou Sumsub, conforme disponibilidade e revisão."],
    ["O que continua sendo responsabilidade do operador?", "Licença, entidade legal, regras por jurisdição, comunicação comercial, elegibilidade de clientes, disclosure de risco, aprovação de pagamentos e compliance contínuo ficam com o operador."],
    ["O mesmo template pode virar IQ Option, Quotex, Pocket Option e outros brokers?", "Sim. A mesma arquitetura white-label pode ser adaptada para diferentes flows de referência. A referência define comportamento de produto; não significa copiar assets de marca ou UI protegida."],
  ]
}

function renderLeadForm(reference, slug, locale = "pt") {
  const isEn = locale === "en"
  return `<form class="lead-form" data-lead-form data-reference="${escapeHtml(reference)}" data-slug="${escapeHtml(slug)}" novalidate>
  <h2>${isEn ? "Request proposal" : "Solicitar proposta"}</h2>
  <label>${isEn ? "Name" : "Nome"}<input name="name" autocomplete="name" required placeholder="${isEn ? "Your name" : "Seu nome"}"></label>
  <label>Email<input name="email" type="email" autocomplete="email" required placeholder="${isEn ? "name@company.com" : "nome@empresa.com"}"></label>
  <label>${isEn ? "Phone" : "Telefone"}<input name="phone" type="tel" autocomplete="tel" required placeholder="${isEn ? "+1 555 000 0000" : "+55 11 99999-9999"}"></label>
  <label>${isEn ? "Project" : "Projeto"}<textarea name="message" rows="5" placeholder="${isEn ? "Regions, PSPs, modules, timeline and compliance" : "Regiões, PSPs, módulos, prazo e compliance"}"></textarea></label>
  <label class="consent"><input name="consent" type="checkbox" required> ${isEn ? "I agree to be contacted about white-label trading software." : "Aceito ser contatado sobre software white-label de trading."}</label>
  <button class="button primary" type="submit">${isEn ? "Send brief" : "Enviar briefing"}</button>
  <p class="form-status" data-form-status aria-live="polite"></p>
</form>`
}

function renderPageSnapshot(script, locale = "pt") {
  const isEn = locale === "en"
  return `<aside class="snapshot-card">
  <h2>${isEn ? "Package" : "Pacote"} ${script.name}</h2>
  <p>${script.market}</p>
  <dl>
    <div><dt>${isEn ? "Platforms" : "Plataformas"}</dt><dd>Web, iOS, Android</dd></div>
    <div><dt>${isEn ? "Operation" : "Operação"}</dt><dd>CRM, PSPs, ${isEn ? "affiliates" : "afiliados"}</dd></div>
    <div><dt>${isEn ? "Risk" : "Risco"}</dt><dd>KYC/AML, ${isEn ? "antifraud" : "antifraude"}, logs</dd></div>
    <div><dt>${isEn ? "Delivery" : "Entrega"}</dt><dd>MVP + ${isEn ? "customizations" : "customizações"}</dd></div>
  </dl>
</aside>`
}

function homeSchema(locale = "pt") {
  const isEn = locale === "en"
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: site.name,
        url: site.domain,
        description: isEn ? site.descriptionEn : site.description,
        email: site.email,
      },
      {
        "@type": "FAQPage",
        mainEntity: (isEn ? faqsEn : faqs).map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: {
            "@type": "Answer",
            text: answer,
          },
        })),
      },
    ],
  }
}

function clonePageDescription(script, locale = "pt") {
  return locale === "en"
    ? `Launch a custom white-label brokerage platform with ${script.name}-style trading flows, traderoom, CRM, payments, KYC/AML, dealing, affiliates, apps and reporting.`
    : `Lance uma plataforma de brokerage white-label com fluxos estilo ${script.name}, traderoom, CRM, pagamentos, KYC/AML, dealing, afiliados, apps e reporting.`
}

function softwareSchema(script, locale = "pt") {
  const isEn = locale === "en"
  const faqs = cloneFaqs(script, locale)
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: isEn ? `${script.name} Platform Clone Script` : `${script.name} Clone Script para Plataforma de Trading`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, Desktop, iOS, Android, PWA",
        provider: { "@type": "Organization", name: site.name, url: site.domain },
        description: clonePageDescription(script, locale),
        featureList: cloneModuleGroups[locale].flatMap((group) => group.items),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: {
            "@type": "Answer",
            text: answer,
          },
        })),
      },
    ],
  }
}

function renderSitemap() {
  const urls = [
    "/",
    "/en/",
    ...scripts.map((script) => `/clone-scripts/${script.slug}/`),
    ...scripts.map((script) => `/en/clone-scripts/${script.slug}/`),
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${site.domain}${url}</loc><changefreq>weekly</changefreq><priority>${url === "/" || url === "/en/" ? "1.0" : "0.85"}</priority></url>`).join("\n")}
</urlset>`
}

function assetPath(pathName, asset) {
  return `${rootPrefix(pathName)}${asset}`
}

function rootPrefix(pathName) {
  const depth = pathName.split("/").filter(Boolean).length
  return depth === 0 ? "" : "../".repeat(depth)
}

function hrefForPath(currentPathName, targetPathName) {
  const normalized = targetPathName === "/" ? "index.html" : `${targetPathName.replace(/^\//, "")}index.html`
  return `${rootPrefix(currentPathName)}${normalized}`
}

function toEnPath(pathName) {
  return pathName.startsWith("/en/") ? pathName : `/en${pathName}`
}

function toPtPath(pathName) {
  return pathName.startsWith("/en/") ? pathName.replace(/^\/en/, "") || "/" : pathName
}

function renderAlternates(pathName) {
  const ptPath = toPtPath(pathName)
  const enPath = toEnPath(pathName)
  return `<link rel="alternate" hreflang="pt-BR" href="${site.domain}${ptPath}">
  <link rel="alternate" hreflang="en" href="${site.domain}${enPath}">
  <link rel="alternate" hreflang="x-default" href="${site.domain}${ptPath}">`
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]))
}
