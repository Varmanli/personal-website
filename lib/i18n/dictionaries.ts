import type { Locale } from "@/lib/i18n/config";

/**
 * Translation dictionaries.
 *
 * `en` is the source of truth and defines the full shape (`Dictionary`).
 * `fa` is a partial set of overrides — any missing key automatically falls
 * back to English via `deepMerge` in `getDictionary`.
 *
 * Keys are semantic, e.g. dict.home.hero.title.
 */
const en = {
  nav: {
    home: "Home",
    about: "About",
    projects: "Projects",
    services: "Services",
    contact: "Contact",
  },
  common: {
    downloadCv: "Download CV",
    startProject: "Project estimate",
    language: "Language",
    menu: "Toggle navigation menu",
  },
  meta: {
    titleSuffix: "Projects & Services",
    description:
      "Full-stack developer building modern, scalable web products, dashboards, and digital experiences.",
    // Per-page <title> values (resolved through generateMetadata so they
    // respect the active locale instead of being hardcoded English).
    pages: {
      about: "About",
      projects: "Projects",
      project: "Project",
      services: "Services & Pricing",
      contact: "Contact",
      notFound: "Page not found",
    },
  },
  notFound: {
    title: "This page wandered off.",
    description:
      "The page you're looking for doesn't exist or may have been moved. Let's get you back on track.",
    backHome: "Back to home",
    viewProjects: "View projects",
  },
  hero: {
    greeting: "Hey, I'm {name}",
    headlineLead: "Designing and building",
    headlineHighlight: "fast, scalable web applications ready to grow",
    subtitle:
      "From interface design to backend implementation, dashboards, authentication, payments, SEO, and deployment, I cover the full path to a professional web product.",
    primaryCta: "Request project estimate",
    secondaryCta: "View selected work",
    available: "Available for work",
    supportingText:
      "Full-stack delivery for products that need clean UX, stable architecture, and room to scale.",
  },
  footer: {
    available: "Available for new projects",
    ctaTitle: "Have a project in mind?",
    ctaText:
      "Describe the idea and I’ll map out the technical path, timeline, and a realistic cost range.",
    brandText:
      "Websites, web applications, admin panels, and digital products built with quality, speed, and long-term maintainability in mind.",
    startProject: "Request project estimate",
    viewWork: "View work",
    navigate: "Navigate",
    services: "Services",
    connect: "Connect",
    connectEmpty:
      "Social links will appear here once they are added to your profile settings.",
    rights: "All rights reserved.",
    built: "Built with Next.js, Tailwind CSS & PostgreSQL.",
  },
  home: {
    featured: {
      eyebrow: "Selected work",
      title: "Selected | projects",
      subtitle:
        "A few product builds shaped around performance, user experience, and maintainable architecture.",
      all: "View all projects",
      details: "View details",
    },
    skills: {
      eyebrow: "Capabilities",
      title: "Technology with | business value",
      subtitle:
        "The stack matters, but what clients actually buy is clarity, speed, and reliable delivery.",
      tools: "tools",
    },
    process: {
      eyebrow: "Process",
      title: "A clear path | from idea to delivery",
      subtitle:
        "Compact, transparent, and structured so every phase of the project stays understandable.",
      steps: [
        {
          title: "Discovery and project goals",
          description:
            "We clarify the business goals, users, core flows, and constraints before any implementation starts.",
        },
        {
          title: "Technical direction and architecture",
          description:
            "Pages, data models, APIs, and the delivery path are defined so the project has a stable technical backbone.",
        },
        {
          title: "Development, testing, optimization",
          description:
            "Implementation happens in clear iterations with attention to quality, speed, and production stability.",
        },
        {
          title: "Handover, training, support",
          description:
            "The final delivery is ready to use, and the next steps for future growth are clear from day one.",
        },
      ],
    },
    testimonials: {
      eyebrow: "Testimonials",
      title: "What clients | noticed",
      subtitle:
        "Feedback focused on delivery quality, clarity, and technical trust rather than generic praise.",
    },
    cta: {
      title: "Have a project in mind?",
      description:
        "Explain the idea and I’ll outline the technical direction, timing, and a realistic rough estimate.",
      cta: "Request project estimate",
      secondary: "View selected work",
    },
  },
  about: {
    hero: {
      eyebrow: "About me",
      title: "Amirhossein Varmezyani",
      subtitle:
        "Full-stack designer and developer focused on building fast, scalable, maintainable websites, admin panels, and web applications.",
      supporting:
        "I help ideas move from design and architecture through implementation, deployment, and optimization into a real product, with technical quality, user experience, and business outcomes in mind.",
      available: "Available for projects",
      primary: "Request project estimate",
      secondary: "View projects",
      chips: ["Full-stack", "Next.js", "NestJS"],
    },
    stats: {
      items: [
        {
          value: "8+ months",
          label: "Real project delivery and launches",
        },
        {
          value: "60k+",
          label: "Users in the Negareh project",
        },
        {
          value: "30k+",
          label: "Managed products",
        },
        {
          value: "120+",
          label: "Implemented pages and flows",
        },
      ],
    },
    experience: {
      eyebrow: "Experience",
      title: "Experiences that shaped | how I build",
      subtitle:
        "From personal work to real client collaboration, my focus has stayed on building products that are usable, scalable, and ready to grow.",
    },
    tools: {
      eyebrow: "Stack",
      title: "Tools & technologies | I work with",
      subtitle:
        "Technology is never just a list of tools for me; each choice should improve speed, stability, and long-term maintainability.",
    },
    values: {
      eyebrow: "Approach",
      title: "How I approach | every project",
      subtitle:
        "A project is never just a few pages of code. It should be understandable, useful, and ready to evolve.",
      items: [
        {
          title: "Maintainable code",
          description:
            "Project structure should make future development, change, and maintenance straightforward.",
        },
        {
          title: "Clear communication",
          description:
            "At every stage, project status, technical decisions, and the path forward should stay easy to follow.",
        },
        {
          title: "Product thinking",
          description:
            "Before writing code, I think through user experience, business goals, and the product's growth path.",
        },
        {
          title: "Reliable delivery",
          description:
            "The final delivery should be tested, deployable, usable, and ready for the next phase of growth.",
        },
      ],
    },
    help: {
      eyebrow: "Services",
      title: "How can I help | your project?",
      subtitle:
        "If you have an idea, website, or product, these are the areas where I can support you.",
      items: [
        {
          title: "Website design and development",
          description:
            "Fast, responsive, SEO-aware websites that are easy to manage and ready to represent your business well.",
        },
        {
          title: "Admin panel development",
          description:
            "Custom dashboards for managing content, users, orders, data, and reporting in a clean workflow.",
        },
        {
          title: "Web application development",
          description:
            "Interactive products built with backend services, database design, authentication, and production-ready APIs.",
        },
        {
          title: "Improving existing products",
          description:
            "Performance, structure, UI/UX, SEO, database, and code-quality improvements for products that already exist.",
        },
      ],
    },
  },
  projects: {
    eyebrow: "Projects",
    title: "Projects & case studies",
    subtitle:
      "A collection of products I have designed and developed, focused on performance, user experience, maintainability, and business value.",
    supporting:
      "From personal and brand websites to admin panels, marketplaces, and custom web applications.",
    filterAll: "All",
    details: "View details",
    caseStudy: "Case study",
    detailLabel: "More project details",
    totalLabel: "published projects",
    featuredLabel: "case studies",
    categoriesLabel: "categories",
    technologiesLabel: "technologies",
    more: "More projects",
    emptyTitle: "No projects published yet",
    emptyDesc:
      "Projects published from the admin dashboard will appear here as case studies.",
    emptySupport:
      "If you want to see more relevant work or talk through similar experience, you can start a project estimate request.",
    emptyCta: "Contact me",
    emptyPrimary: "Start a project estimate",
    emptySecondary: "Contact me",
    cta: {
      title: "Your next project could be here",
      description:
        "Explain the idea and I’ll clarify the technical path, timing, and a realistic rough estimate.",
      primary: "Start a project estimate",
      secondary: "Contact me",
    },
  },
  projectDetail: {
    back: "← Back to projects",
    eyebrow: "Case study",
    screenshots: "Product screenshots",
    screenshotsText:
      "A closer look at the interface, flows, and visual execution across the product.",
    meta: "Project details",
    metrics: "Project metrics",
    metricsText:
      "A quick snapshot of scale, complexity, and the product capabilities delivered.",
    highlights: "Technical highlights",
    highlightsText:
      "Core engineering decisions and implementation details that shaped the build.",
    tags: "Tags",
    tagsTitle: "Project tags",
    category: "Category",
    badges: "Badges",
    techStack: "Tech stack",
    overview: "Overview",
    challenge: "The challenge",
    solution: "The solution",
    outcome: "The outcome",
    role: "Role",
    client: "Client",
    year: "Year",
    links: "Links",
    viewLive: "View live ↗",
    sourceCode: "Source code",
    cover: "Project media",
    ctaTitle: "Want something similar?",
    ctaText: "Let's talk about your project and how I can help.",
    cta: "Start a conversation",
  },
  services: {
    eyebrow: "Services & collaboration",
    title: "Services & plans",
    subtitle:
      "Web project pricing depends on needs, scale, features, and customization level. This page helps make the collaboration path and estimate clearer.",
    supporting:
      "From fast, SEO-aware websites to admin dashboards, marketplaces, and custom web applications.",
    totalLabel: "published plans",
    plansEyebrow: "Plans",
    plansTitle: "Suggested collaboration plans",
    plansSubtitle:
      "These plans are starting points. Final pricing is defined after reviewing your requirements, features, and customization level.",
    priceNote:
      "All prices are placeholders shown in USD. Final quotes are tailored to your project scope.",
    emptyTitle: "No plans published yet",
    emptyDesc:
      "Plans published from the admin panel will appear here. Until then, you can send a short brief and get a tailored estimate.",
    emptySupport:
      "If your scope is still evolving, the project estimator is the fastest way to turn it into a realistic technical direction.",
    emptyCta: "Contact me",
    emptyPrimary: "Request project estimate",
    emptySecondary: "Contact me",
    faqEyebrow: "FAQ",
    faqTitle: "Common questions",
    faqs: [
      {
        q: "How does pricing work?",
        a: "Each project is estimated based on type, features, design level, timeline, and technical complexity.",
      },
      {
        q: "What's the usual timeline?",
        a: "Smaller websites usually take around 2–4 weeks, while dashboards and more complex web applications need more time.",
      },
      {
        q: "Do you handle support too?",
        a: "Yes. After delivery we can agree on support, bug fixing, performance improvements, or next-phase development.",
      },
      {
        q: "What if my project doesn't fit any plan?",
        a: "That is normal. Many projects are custom, and after reviewing the requirements I can suggest a structure that actually fits.",
      },
    ],
    ctaTitle: "Not sure which plan fits?",
    ctaText:
      "Tell me about the project so you can get a clearer path and a better recommendation.",
    cta: "Get a recommendation",
    ctaSecondary: "Request project estimate",
  },
  contact: {
    eyebrow: "Contact",
    title: "Let’s talk about your project",
    subtitle:
      "If you have an idea for a website, admin panel, or web application, send a message and we’ll review the technical path, timeline, and initial estimate together.",
    supporting:
      "You do not need every detail figured out yet. A short outline is enough to start the conversation.",
    email: "Email",
    location: "Location",
    elsewhere: "Elsewhere",
    methodsTitle: "Contact methods",
    methodsSubtitle:
      "Right now, the best way to reach out is the form on this page. Any active links from your site settings appear here too.",
    infoCardIntro:
      "Anything you share here is only used to review the project and get back to you.",
    infoCard: {
      title: "Contact path",
      items: [
        {
          title: "Response time",
          description:
            "I usually reply at the first opportunity or within one business day.",
          icon: "clock",
        },
        {
          title: "Best for",
          description:
            "Websites, admin panels, web applications, optimization, or growing an existing product.",
          icon: "briefcase",
        },
        {
          title: "Starting the project",
          description:
            "If you are not fully sure what you need yet, a short description is enough for me to suggest the right path.",
          icon: "message",
        },
        {
          title: "Project estimate",
          description:
            "For more serious scopes, the project estimate form is the best way to get a more precise recommendation.",
          icon: "send",
        },
      ],
      primaryCta: {
        label: "Request project estimate",
        href: "/start-project",
      },
      secondaryCta: {
        label: "View projects",
        href: "/projects",
      },
    },
    process: {
      badge: "After you send the message",
      title: "What happens after you send a message?",
      subtitle:
        "The next step stays simple and clear. First I review your message, then I suggest the best next move.",
      steps: [
        {
          title: "Message review",
          description:
            "I review the need, goal, and the details you shared.",
          icon: "search",
        },
        {
          title: "A few follow-up questions",
          description:
            "If needed, I ask a few short questions to make the project path clearer.",
          icon: "help",
        },
        {
          title: "Suggested direction",
          description:
            "I suggest the timeline, technical direction, and an initial estimate range as clearly as possible.",
          icon: "zap",
        },
      ],
    },
    cta: {
      title: "Not sure where to start?",
      subtitle: "A short explanation is enough for us to find the right path for your project.",
      primary: "Start project estimate",
      secondary: "View services",
    },
    form: {
      name: "Name",
      email: "Email",
      subject: "Subject",
      message: "Message",
      projectType: "Project type",
      budgetRange: "Estimated budget",
      timeline: "Timeline",
      placeholders: {
        name: "Your name",
        email: "you@example.com",
        subject: "For example: website design, admin panel, or technical consulting",
        message:
          "Share a bit about the idea, goal, needed features, or your question...",
      },
      options: {
        empty: "Choose one",
        projectType: {
          website: "Website",
          dashboard: "Admin dashboard",
          webapp: "Web application",
          optimization: "Improve an existing project",
          other: "Other",
        },
        budgetRange: {
          estimate: "I need an estimate",
          under30: "Under 30M toman",
          between30And70: "30M to 70M toman",
          between70And150: "70M to 150M toman",
          above150: "Above 150M toman",
        },
        timeline: {
          urgent: "Urgent",
          oneToTwoMonths: "1 to 2 months",
          threePlusMonths: "3+ months",
          flexible: "Flexible",
        },
      },
      send: "Send message",
      sending: "Sending…",
      success: "Your message was sent successfully. I’ll reply as soon as I can.",
      errorRequired: "Name, email, and message are required.",
      errorEmail: "Please enter a valid email address.",
      errorGeneric: "Your message could not be sent. Please try again.",
    },
  },
  planner: {
    hero: {
      badge: "Project Estimate",
      title: "Start your project smarter",
      subtitle:
        "Answer a few short questions so I can better understand the technical direction, complexity, timeline, and rough budget range.",
      supporting:
        "This is an initial estimate and can become more accurate once we review the project details.",
    },
    cmsNote:
      "For simpler projects or faster launch, CMS-based solutions can be a practical and economical choice. For scalable custom systems, custom development is recommended.",
    ui: {
      next: "Continue",
      back: "Back",
      submit: "Send estimate request",
      submitting: "Sending request…",
      selectOne: "Choose one",
      selectMany: "Choose any that apply",
      typeHelper: "Pick one option to shape your initial estimate.",
      optional: "Optional",
      summary: "Your answers",
      recommendation: "Recommended approach",
      step: "Step",
      of: "of",
      restart: "Start over",
      none: "—",
    },
    steps: {
      projectType: "What do you want to build?",
      cmsSolutionType: "Which WordPress approach fits best?",
      goals: "What are your main goals?",
      features: "Which features do you need?",
      designLevel: "What level of design?",
      currentStage: "Where are you right now?",
      timeline: "What's your timeline?",
      budgetLevel: "What's your budget level?",
      contact: "How can I reach you?",
    },
    contact: {
      name: "Your name",
      email: "Email",
      phone: "Phone",
      company: "Company (optional)",
      method: "Preferred contact method",
      description: "Anything else? (optional)",
      descriptionPlaceholder: "Tell me a bit more about your project…",
    },
    result: {
      title: "Estimate summary",
      previewBadge: "Preview",
      basis: "Initial estimate based on your current choices",
      empty:
        "Once you choose a few options, a summary of the suggested approach, complexity, timeline, and rough budget will appear here.",
      projectType: "Project type",
      notSelected: "Not selected",
      plan: "Suggested approach",
      complexity: "Estimated complexity",
      timeline: "Estimated timeline",
      score: "Project score",
      duration: "Estimated timeline",
      weeksUnit: "weeks",
      daysUnit: "days",
      price: "Estimated budget",
      priceFrom: "from",
      to: "to",
      needsReview: "Needs detailed review",
      featuresLabel: "Selected features",
      designLabel: "Design level",
      supportLabel: "Support",
      supportDetailPrefix: "Post-launch support",
      supportOngoingNote:
        "Ongoing support is agreed separately on a monthly basis.",
      pagesLabel: "Pages",
      pagesUnit: "pages",
      noFeatures: "No extra features",
      calcTitle: "Estimate details",
      urgencyWarning:
        "Your chosen timeline is tighter than the current estimate and may require trimming features or a phased rollout.",
      breakdown: "Estimate details",
      priceNote:
        "This figure isn't final and becomes more accurate after we review the project details.",
      disclaimer:
        "This is an initial estimate and may change after reviewing the project details.",
    },
    pages: {
      helper:
        "Pages like home, about, services, contact, product listing, product detail, or a dashboard each add part of the design and build time.",
      maxNote:
        "For projects larger than 20 pages, a more precise estimate is best done after reviewing the structure.",
      presets: ["1–3", "4–7", "8–12", "13–20", "20+"],
    },
    success: {
      title: "Your project request was submitted",
      subtitle:
        "Your initial estimate summary is ready. After reviewing the details, I'll contact you to finalize the approach, timeline, and cost.",
      note: "This estimate isn't final and may change after a detailed review of your needs.",
      downloadPdf: "Download PDF estimate",
      downloading: "Preparing…",
      downloadError: "Preparing the estimate failed. Please try again.",
      viewProjects: "View projects",
      backHome: "Back to home",
    },
    pdf: {
      title: "Preliminary project estimate",
      subtitle: "Initial estimate based on the details submitted in the project form",
      date: "Date",
      client: "Client information",
      name: "Name",
      email: "Email",
      phone: "Phone / Telegram",
      company: "Brand or company",
      contactMethod: "Preferred contact method",
      projectSummary: "Project summary",
      projectType: "Project type",
      designLevel: "Design level",
      pages: "Pages",
      features: "Selected features",
      timelinePref: "Preferred timeline",
      description: "Project notes",
      estimateSummary: "Initial estimate",
      complexity: "Estimated complexity",
      timeline: "Estimated timeline",
      price: "Estimated budget",
      support: "Post-launch support",
      supportType: "Support type",
      supportDesc: "Summary",
      supportEffect: "Effect on estimate",
      supportEffects: {
        none: "No change to cost or time",
        basic_1_month: "Small cost increase",
        pro_3_months: "Moderate cost increase and 1–3 extra days",
        ongoing: "Requires a separate monthly agreement",
      },
      notesTitle: "Notes & terms",
      disclaimer:
        "This is a preliminary estimate based on the information provided and is not a final price or a contractual commitment. The final amount and timeline will be determined after a full review of the project scope, features, design, content, infrastructure, and terms of collaboration.",
      contactNote: "To finalize the proposal, I'll contact you after reviewing the details.",
      none: "—",
    },
    plans: {
      landing: "Landing page",
      cms: "CMS / WordPress build",
      website: "Full-stack website",
      ecommerce: "E-commerce build",
      dashboard: "Dashboard / admin panel",
      custom: "Custom development",
    },
    complexity: {
      low: "Low",
      medium: "Medium",
      high: "High",
      very_high: "Very high",
      needs_review: "Needs review",
    },
    timelines: {
      "1-2-weeks": "1–2 weeks",
      "3-6-weeks": "3–6 weeks",
      "6-10-weeks": "6–10 weeks",
      "10-plus-weeks": "10+ weeks",
    },
    form: {
      success:
        "Your request has been submitted. I'll contact you soon to review the details.",
      errorRequired: "Please enter your name.",
      errorContact: "Please provide a phone number or email.",
      errorProjectType: "Please choose a project type.",
      errorGeneric:
        "Submitting your request failed. Please try again in a moment.",
      errorSchema:
        "The project requests table isn't set up in the database yet. Please run `npm run db:push` first.",
    },
    cta: {
      homeTitle: "Not sure where to start?",
      homeText:
        "Answer a few quick questions to find the right path for your project.",
      start: "Start a project",
      servicesTitle: "Not sure what your project needs?",
      servicesText:
        "A few short questions about project type, features, page count, design level, and technologies help me prepare a practical first recommendation.",
      servicesButton: "Start project estimate",
    },
  },
  card: {
    featured: "★ Featured",
    preview: "Preview",
    image: "Image",
    live: "Live ↗",
    viewWork: "View work ↗",
    mostPopular: "Most popular",
    caseStudy: "Case study →",
    from: "from",
    getStarted: "Get started",
    customNote:
      "Custom scope, timeline, and pricing can be discussed before starting.",
    contactQuote: "Contact for quote",
    types: {
      commercial: "commercial",
      personal: "personal",
      freelance: "freelance",
    },
  },
  admin: {
    panel: "Admin Panel",
    upload: {
      cta: "Click to upload or drag a file here",
      uploading: "Uploading…",
      uploaded: "File uploaded",
      remove: "Remove",
      replace: "Replace",
      manual: "Manual URL",
      manualHide: "Hide manual URL",
      urlPlaceholder: "https://…",
      openFile: "Open file",
      tooBig: "The file is too large.",
      failed: "Upload failed. Please try again.",
      addImages: "Add images",
      galleryHint: "Drag thumbnails to reorder. The first image leads the gallery.",
    },
    tech: {
      placeholder: "Select technologies",
      search: "Search…",
      empty: "No technology found",
      clear: "Clear all",
      selected: "selected",
    },
    nav: {
      dashboard: "Dashboard",
      about: "About page",
      contactPage: "Contact page",
      projects: "Projects",
      services: "Services",
      messages: "Messages",
      projectRequests: "Project requests",
      plannerOptions: "Planner options",
      plannerEstimates: "Estimator rules",
      settings: "Settings",
      backToSite: "← Back to site",
      logout: "Log out",
    },
    estimates: {
      title: "Estimator rules",
      description:
        "Duration rules and pricing used by the project estimator.",
      settingsTitle: "Pricing settings",
      weeklyRate: "Weekly rate",
      currency: "Currency",
      minPrice: "Minimum project price",
      rounding: "Price rounding",
      roundingNearest500k: "Nearest 500K",
      roundingNearest1m: "Nearest 1M",
      estimateEnabled: "Estimate enabled",
      showPrice: "Show price estimate to user",
      save: "Save settings",
      rulesTitle: "Duration rules",
      emptyRules:
        "Default rules from code are being used. Seed them into the database to edit them.",
      seed: "Create default rules in database",
      durationDays: "Duration (days)",
      active: "Active",
      edit: "Edit",
      days: "days",
      pageEdit: "Edit estimate rule",
      ruleKey: "Key",
      sortOrder: "Sort order",
      labelFa: "Label (Persian)",
      labelEn: "Label (English)",
      descFa: "Description (Persian)",
      descEn: "Description (English)",
    },
    requests: {
      title: "Project requests",
      description: "Submissions from the project planner.",
      empty: "No project requests yet.",
      searchPlaceholder: "Search name, email, phone, company…",
      allStatuses: "All statuses",
      cols: {
        name: "Name / company",
        type: "Project type",
        plan: "Suggested",
        complexity: "Complexity",
        status: "Status",
        created: "Received",
        contact: "Contact",
      },
      detail: {
        contact: "Contact info",
        project: "Project",
        cms: "WordPress solution",
        goals: "Goals",
        features: "Features",
        design: "Design level",
        stage: "Current stage",
        timeline: "Timeline",
        budget: "Budget",
        description: "Description",
        recommendation: "Recommendation",
        note: "Admin note",
        noteHint: "Internal only — never shown to the client.",
        saveNote: "Save note",
        status: "Status",
        back: "← Back to requests",
        none: "—",
        email: "Email",
        phone: "Phone",
        company: "Company",
        method: "Preferred contact",
        score: "Score",
        archive: "Archive",
        dynamicAnswers: "Project-specific answers",
        estimate: "Time & cost estimate",
        estDays: "Estimated days",
        estWeeks: "Estimated weeks",
        estPrice: "Estimated price",
        weeklyRate: "Weekly rate (at submission)",
        breakdown: "Breakdown",
        noEstimate: "No estimate was recorded for this request.",
        snapshotNote:
          "This estimate is a snapshot from submission time and won't change if rates are updated later.",
      },
    },
    plannerOpts: {
      title: "Planner options",
      description: "Manage the options shown in the project planner.",
      newItem: "New option",
      empty: "No custom options — the planner uses built-in defaults.",
      fallbackNote:
        "Groups without active options fall back to built-in defaults.",
      group: "Group",
      value: "Value (stable)",
      valueHint: "Stored in submitted requests — cannot be changed later.",
      labelFa: "Label (Persian)",
      labelEn: "Label (English)",
      descFa: "Description (Persian)",
      descEn: "Description (English)",
      icon: "Icon",
      weight: "Scoring weight",
      active: "Active",
      sortOrder: "Sort order",
      create: "Create option",
      save: "Save changes",
      edit: "Edit",
      activate: "Activate",
      deactivate: "Deactivate",
      pageNew: "New planner option",
      pageEdit: "Edit planner option",
      confirmDelete: "Delete this option? This can't be undone.",
    },
    dashboard: {
      title: "Dashboard",
      description: "Overview of your site content.",
      statProjects: "Projects",
      statServices: "Services",
      statNewMessages: "New messages",
      statUniqueVisitors: "Unique visitors",
      statPageViews: "Page views",
      statToday: "today",
      recentMessages: "Recent messages",
      viewAll: "View all",
      quickActions: "Quick actions",
      noMessages: "No messages yet.",
      newBadge: "New",
    },
    projects: {
      title: "Projects",
      description: "Create, edit, and feature projects.",
      newItem: "New project",
      empty: "No projects yet. Create your first one.",
    },
    services: {
      title: "Services & Plans",
      description: "Manage your commercial plans and pricing.",
      newItem: "New plan",
      empty: "No plans yet. Create your first one.",
    },
    messages: {
      title: "Messages",
      description: "Contact requests submitted through your site.",
      empty:
        "No messages yet. Submissions from the contact form will appear here.",
    },
    settings: {
      title: "Site settings",
      description: "Manage your profile and site-wide content.",
      newTitle: "Create site settings",
      save: "Save settings",
      saved: "Settings saved successfully.",
      noticeFirst:
        "No settings row exists yet — saving will create one.",
    },
    about: {
      title: "About page management",
      description: "Manage the content shown on the public About page.",
      save: "Save About page",
      noticeFirst:
        "No settings row exists yet — saving will create one with this About content.",
    },
    contact: {
      title: "Contact page management",
      description:
        "Manage the public Contact page content and shared contact methods.",
      save: "Save Contact page",
      noticeFirst:
        "No settings row exists yet — saving will create one with this Contact content.",
      sharedTitle: "Shared contact settings",
      sharedDescription:
        "These values power the public contact methods and fallback footer social links.",
      contentTitle: "Page content",
      contentDescription:
        "Each language can have its own Contact page content and falls back automatically when one side is empty.",
    },
    table: {
      title: "Title",
      name: "Name",
      slug: "Slug",
      status: "Status",
      featured: "Featured",
      homepage: "Homepage",
      updated: "Updated",
      price: "Price",
      period: "Period",
      type: "Type",
      from: "From",
      message: "Message",
      received: "Received",
      yes: "Yes",
      actions: "",
    },
    actions: {
      edit: "Edit",
      delete: "Delete",
      deleting: "Deleting…",
      markRead: "Mark read",
      archive: "Archive",
      reopen: "Reopen",
      view: "Open live site",
    },
    status: {
      draft: "Draft",
      published: "Published",
      archived: "Archived",
      new: "New",
      read: "Read",
      reviewed: "Reviewed",
      contacted: "Contacted",
      in_progress: "In progress",
      converted: "Converted",
      rejected: "Rejected",
    },
    quick: {
      newProject: "New project",
      newService: "New service / plan",
      viewMessages: "View messages",
    },
    confirm: {
      project: "Delete this project? This can't be undone.",
      plan: "Delete this plan? This can't be undone.",
      message: "Delete this message? This can't be undone.",
    },
    forms: {
      shared: "Shared",
      persian: "Persian content",
      english: "English content",
      // Section group titles + helper text
      content: "Content",
      contentHint: "Add Persian and English versions — either can be left blank.",
      essentials: "Essentials",
      essentialsHint: "Slug, status, and where this appears.",
      advanced: "Advanced",
      advancedHint: "Technologies, media, and external links.",
      pricing: "Pricing",
      pricingHint: "Price, billing period, and currency.",
      media: "Media & links",
      mediaHint: "Image and external project link.",
      homeDisplay: "Homepage display",
      homeDisplayHint:
        "Manage how this project appears on the homepage. At most 3 projects are shown there.",
      homeFeatured: "Show on homepage",
      homeFeaturedHint:
        "Homepage shows only the first 3 published projects sorted by this order.",
      homeOrder: "Homepage order",
      homeOrderHint: "Lower numbers appear first.",
      previewImage: "Homepage preview image",
      homeTechStack: "Homepage tech stack",
      profile: "Profile",
      profileHint: "Your name, headline, bio, and skills per language.",
      sharedFields: "Shared details",
      sharedFieldsHint: "Email, avatar, and résumé — the same across languages.",
      cancel: "Cancel",
      saving: "Saving…",
      createProject: "Create project",
      saveProject: "Save changes",
      createService: "Create plan",
      saveService: "Save changes",
      pageProjectNew: "New project",
      pageProjectEdit: "Edit project",
      pageServiceNew: "New service / plan",
      pageServiceEdit: "Edit service / plan",
      // Field labels
      title: "Title",
      name: "Name",
      slug: "Slug",
      slugHint: "Lowercase, dashes. Shared across languages.",
      excerpt: "Excerpt",
      description: "Description",
      cover: "Cover image URL",
      coverImage: "Cover image",
      gallery: "Gallery",
      slugReadonly: "Generated link (slug)",
      slugReadonlyHint: "Created automatically from the title.",
      image: "Image URL",
      client: "Client",
      role: "Role",
      year: "Year",
      tags: "Tags",
      tech: "Tech stack",
      listHint: "One per line or comma-separated.",
      challenge: "Challenge",
      solution: "Solution",
      outcome: "Outcome",
      liveUrl: "Live URL",
      repoUrl: "Repository URL",
      externalUrl: "Project URL",
      type: "Type / category",
      status: "Status",
      featured: "Featured",
      featuredHint: "Show this item in featured sections.",
      tagline: "Best-for label",
      price: "Price (USD)",
      priceHint: "Leave blank for “Contact for quote”.",
      billingPeriod: "Billing period",
      currency: "Currency",
      ctaLabel: "CTA label",
      features: "Features",
      // Settings fields
      ownerName: "Owner name",
      headline: "Headline",
      bio: "Bio",
      aboutIntro: "About intro (second paragraph)",
      location: "Location",
      skills: "Skills",
      email: "Email",
      avatarUrl: "Avatar URL",
      resumeUrl: "Résumé URL",
      // Uploadable branding/media assets
      assets: "Branding & media",
      assetsHint: "Logo, favicon, and hero image used across the site.",
      logo: "Logo",
      favicon: "Favicon",
      heroImage: "Hero image",
      avatar: "Profile image",
      resume: "Résumé (PDF)",
    },
    errors: {
      titleRequired: "A Persian or English title is required.",
      nameRequired: "A Persian or English name is required.",
      slugRequired: "A slug is required (or provide an English title).",
      coverRequired: "A cover image is required.",
      notSignedIn: "You must be signed in to do that.",
      db: "Couldn't reach the database, so nothing was saved. Check your connection and try again.",
      schema: "Database schema is not initialized. Run migrations or db push before using site settings.",
      slugTaken: "That slug is already in use. Choose a different one.",
      invalidId: "Invalid id.",
      invalidHomeOrder: "Homepage order must be a valid non-negative number.",
      invalidMetric:
        "Each metric row must include both a label and a value.",
      invalidAboutContent:
        "About page content is incomplete or invalid. Review the required fields and try again.",
      invalidContactContent:
        "Contact page content is incomplete or invalid. Review the required fields and try again.",
      invalidUrl:
        "CTA links must be valid internal paths or full URLs.",
    },
    auth: {
      title: "Admin sign in",
      subtitle: "Sign in to manage your site content.",
      email: "Email",
      password: "Password",
      remember: "Remember me",
      rememberHint: "Stay signed in on this device for 30 days.",
      signIn: "Sign in",
      backTo: "← Back to {site}",
      errRequired: "Email and password are required.",
      errEmail: "Please enter a valid email address.",
      errDb: "Couldn't reach the database. Please try again later.",
      errInvalid: "Invalid email or password.",
    },
  },
};

export type Dictionary = typeof en;

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/** Persian overrides. Anything omitted falls back to English. */
const fa: DeepPartial<Dictionary> = {
  nav: {
    home: "خانه",
    about: "درباره",
    projects: "پروژه‌ها",
    services: "خدمات",
    contact: "تماس",
  },
  common: {
    downloadCv: "دانلود رزومه",
    startProject: "برآورد پروژه",
    language: "زبان",
    menu: "باز/بستن منوی پیمایش",
  },
  meta: {
    titleSuffix: "پروژه‌ها و خدمات",
    description:
      "توسعه‌دهنده‌ی فول‌استک؛ ساخت محصولات وب مدرن و مقیاس‌پذیر، داشبوردها و تجربه‌های دیجیتال.",
    pages: {
      about: "درباره",
      projects: "پروژه‌ها",
      project: "پروژه",
      services: "خدمات و قیمت‌گذاری",
      contact: "تماس",
      notFound: "صفحه پیدا نشد",
    },
  },
  notFound: {
    title: "این صفحه پیدا نشد.",
    description:
      "صفحه‌ای که دنبالش هستید وجود ندارد یا ممکن است جابه‌جا شده باشد. بیایید شما را به مسیر درست برگردانیم.",
    backHome: "بازگشت به خانه",
    viewProjects: "مشاهده پروژه‌ها",
  },
  hero: {
    greeting: "سلام، من {name} هستم",
    headlineLead: "طراحی و توسعه",
    headlineHighlight: "وب‌اپلیکیشن‌های سریع، مقیاس‌پذیر و آماده رشد",
    subtitle:
      "از طراحی رابط کاربری تا پیاده‌سازی بک‌اند، داشبورد، احراز هویت، پرداخت، سئو و دیپلوی، یک مسیر کامل برای ساخت محصول وب حرفه‌ای.",
    primaryCta: "درخواست برآورد پروژه",
    secondaryCta: "مشاهده پروژه‌ها",
    available: "آماده‌ی همکاری",
    supportingText:
      "برای محصولاتی که هم ظاهر حرفه‌ای می‌خواهند و هم ساختار فنی قابل اتکا و آماده توسعه.",
  },
  footer: {
    available: "آماده‌ی پروژه‌های جدید",
    ctaTitle: "پروژه‌ای در ذهن داری؟",
    ctaText:
      "ایده‌ات را توضیح بده؛ مسیر فنی، زمان‌بندی و هزینه تقریبی را شفاف بهت می‌گم.",
    brandText:
      "طراحی و توسعه وب‌سایت‌ها، وب‌اپلیکیشن‌ها، پنل‌های مدیریتی و محصولات دیجیتال با تمرکز روی کیفیت، سرعت و توسعه‌پذیری.",
    startProject: "درخواست برآورد پروژه",
    viewWork: "مشاهده کارها",
    navigate: "پیمایش",
    services: "خدمات",
    connect: "ارتباط",
    connectEmpty:
      "پس از افزودن لینک‌های اجتماعی در تنظیمات پروفایل، اینجا نمایش داده می‌شوند.",
    rights: "تمامی حقوق محفوظ است.",
    built: "ساخته‌شده با Next.js، Tailwind CSS و PostgreSQL.",
  },
  home: {
    featured: {
      eyebrow: "کارهای منتخب",
      title: "پروژه‌های | منتخب",
      subtitle:
        "چند نمونه از محصولاتی که با تمرکز روی عملکرد، تجربه کاربری و توسعه‌پذیری ساخته شده‌اند.",
      all: "مشاهده همه پروژه‌ها",
      details: "مشاهده جزئیات",
    },
    skills: {
      eyebrow: "توانمندی‌ها",
      title: "تکنولوژی در خدمت | نتیجه تجاری",
      subtitle:
        "فقط فهرست ابزارها مهم نیست؛ مهم این است که این استک چطور به محصول سریع‌تر، پایدارتر و قابل توسعه‌تر تبدیل می‌شود.",
      tools: "ابزار",
    },
    process: {
      eyebrow: "فرآیند همکاری",
      title: "مسیر شفاف | از ایده تا تحویل",
      subtitle:
        "مراحل پروژه فشرده، واضح و قابل پیگیری است تا تصمیم‌گیری و اجرا بدون ابهام پیش برود.",
      steps: [
        {
          title: "کشف نیاز و هدف پروژه",
          description:
            "ابتدا نیازها، کاربران، مسیرهای اصلی و هدف تجاری پروژه را شفاف می‌کنیم.",
        },
        {
          title: "طراحی مسیر و معماری",
          description:
            "ساختار صفحات، مدل داده، APIها و مسیر توسعه پروژه مشخص می‌شود.",
        },
        {
          title: "توسعه، تست و بهینه‌سازی",
          description:
            "پیاده‌سازی مرحله‌به‌مرحله انجام می‌شود و روی کیفیت، سرعت و پایداری تمرکز می‌کنیم.",
        },
        {
          title: "تحویل، آموزش و پشتیبانی",
          description:
            "در پایان، پروژه آماده استفاده تحویل داده می‌شود و برای توسعه‌های بعدی مسیر مشخص است.",
        },
      ],
    },
    testimonials: {
      eyebrow: "نظرات",
      title: "بازخورد | همکاری",
      subtitle:
        "نقل‌قول‌هایی که روی شفافیت همکاری، کیفیت فنی و اعتمادپذیری خروجی تمرکز دارند.",
    },
    cta: {
      title: "پروژه‌ای در ذهن داری؟",
      description:
        "ایده‌ات را توضیح بده؛ مسیر فنی، زمان‌بندی و هزینه تقریبی را شفاف بهت می‌گم.",
      cta: "درخواست برآورد پروژه",
      secondary: "مشاهده پروژه‌ها",
    },
  },
  about: {
    hero: {
      eyebrow: "درباره من",
      title: "امیرحسین ورمزیانی",
      subtitle:
        "طراح و توسعه‌دهنده فول‌استک با تمرکز روی ساخت وب‌سایت‌ها، پنل‌های مدیریتی و وب‌اپلیکیشن‌های سریع، مقیاس‌پذیر و قابل توسعه.",
      supporting:
        "من کمک می‌کنم ایده‌ها از مرحله طراحی و معماری تا پیاده‌سازی، دیپلوی و بهینه‌سازی به محصولی واقعی و قابل استفاده تبدیل شوند؛ با تمرکز روی کیفیت فنی، تجربه کاربری و نتیجه تجاری.",
      available: "آماده همکاری",
      primary: "درخواست برآورد پروژه",
      secondary: "مشاهده پروژه‌ها",
      chips: ["Full-stack", "Next.js", "NestJS"],
    },
    stats: {
      items: [
        {
          value: "۸+ ماه",
          label: "توسعه و لانچ پروژه واقعی",
        },
        {
          value: "۶۰k+",
          label: "کاربر در پروژه نگاره",
        },
        {
          value: "۳۰k+",
          label: "محصول مدیریت‌شده",
        },
        {
          value: "۱۲۰+",
          label: "صفحه و مسیر پیاده‌سازی‌شده",
        },
      ],
    },
    experience: {
      eyebrow: "تجربه",
      title: "تجربه‌هایی که مسیر | کاری من را ساختند",
      subtitle:
        "از پروژه‌های شخصی تا همکاری‌های واقعی، تمرکزم همیشه روی ساخت محصول قابل استفاده و قابل توسعه بوده است.",
    },
    tools: {
      eyebrow: "تکنولوژی",
      title: "ابزارها و تکنولوژی‌هایی | که با آن‌ها کار می‌کنم",
      subtitle:
        "انتخاب تکنولوژی برای من فقط لیست ابزار نیست؛ هر ابزار باید به سرعت، پایداری و توسعه‌پذیری محصول کمک کند.",
    },
    values: {
      eyebrow: "رویکرد",
      title: "نگاه من | به هر پروژه",
      subtitle:
        "برای من پروژه فقط چند صفحه کد نیست؛ محصولی است که باید قابل فهم، قابل استفاده و قابل توسعه باشد.",
      items: [
        {
          title: "کد تمیز و نگهدارپذیر",
          description:
            "ساختار پروژه باید طوری باشد که توسعه، تغییر و نگهداری آن در آینده ساده بماند.",
        },
        {
          title: "ارتباط شفاف",
          description:
            "در هر مرحله، وضعیت پروژه، تصمیم‌های فنی و مسیر پیشرفت باید قابل پیگیری باشد.",
        },
        {
          title: "تفکر محصولی",
          description:
            "قبل از کدنویسی، به تجربه کاربر، هدف تجاری و مسیر رشد محصول فکر می‌کنم.",
        },
        {
          title: "تحویل مطمئن",
          description:
            "پروژه باید تست‌شده، قابل دیپلوی، قابل استفاده و آماده توسعه‌های بعدی تحویل داده شود.",
        },
      ],
    },
    help: {
      eyebrow: "همکاری",
      title: "چطور می‌توانم به | پروژه‌ات کمک کنم؟",
      subtitle:
        "اگر ایده، سایت یا محصولی داری، می‌توانم در این بخش‌ها کنارت باشم.",
      items: [
        {
          title: "طراحی و توسعه وب‌سایت",
          description:
            "وب‌سایت‌های سریع، ریسپانسیو، سئو محور و قابل مدیریت.",
        },
        {
          title: "ساخت پنل مدیریت",
          description:
            "داشبوردهای اختصاصی برای مدیریت محتوا، کاربران، سفارش‌ها، داده‌ها و گزارش‌ها.",
        },
        {
          title: "توسعه وب‌اپلیکیشن",
          description:
            "پیاده‌سازی محصول‌های تعاملی با بک‌اند، دیتابیس، احراز هویت و API.",
        },
        {
          title: "بهینه‌سازی و توسعه پروژه موجود",
          description:
            "بهبود سرعت، ساختار، UI/UX، سئو، دیتابیس و کیفیت کد پروژه‌های فعلی.",
        },
      ],
    },
  },
  projects: {
    eyebrow: "پروژه‌ها",
    title: "پروژه‌ها و مطالعات موردی",
    subtitle:
      "مجموعه‌ای از محصولاتی که طراحی و توسعه داده‌ام؛ با تمرکز روی عملکرد، تجربه کاربری، توسعه‌پذیری و نتیجه تجاری.",
    supporting:
      "از وب‌سایت‌های شخصی و برندینگ تا پنل‌های مدیریتی، مارکت‌پلیس‌ها و وب‌اپلیکیشن‌های اختصاصی.",
    filterAll: "همه",
    details: "مشاهده جزئیات",
    caseStudy: "مطالعه موردی",
    detailLabel: "جزئیات بیشتر پروژه",
    totalLabel: "پروژه منتشرشده",
    featuredLabel: "مطالعه موردی",
    categoriesLabel: "دسته‌بندی",
    technologiesLabel: "تکنولوژی",
    more: "پروژه‌های بیشتر",
    emptyTitle: "هنوز پروژه‌ای منتشر نشده",
    emptyDesc:
      "پروژه‌هایی که از پنل مدیریت منتشر شوند، اینجا به‌صورت مطالعه موردی نمایش داده می‌شوند.",
    emptySupport:
      "اگر می‌خواهی نمونه‌های کاری بیشتری ببینی یا درباره تجربه‌های مشابه صحبت کنیم، می‌توانی درخواست برآورد پروژه ثبت کنی.",
    emptyCta: "تماس بگیرید",
    emptyPrimary: "درخواست برآورد پروژه",
    emptySecondary: "تماس بگیرید",
    cta: {
      title: "پروژه بعدی می‌تواند برای تو باشد",
      description:
        "ایده‌ات را توضیح بده؛ مسیر فنی، زمان‌بندی و هزینه تقریبی را شفاف بهت می‌گم.",
      primary: "درخواست برآورد پروژه",
      secondary: "تماس بگیرید",
    },
  },
  projectDetail: {
    back: "← بازگشت به پروژه‌ها",
    eyebrow: "کیس استادی",
    screenshots: "اسکرین‌شات‌های پروژه",
    screenshotsText:
      "نگاهی نزدیک‌تر به رابط، فلوها و اجرای بصری محصول در بخش‌های مختلف.",
    meta: "جزئیات پروژه",
    metrics: "متریک‌های پروژه",
    metricsText:
      "نمایی سریع از مقیاس، پیچیدگی و قابلیت‌هایی که در این محصول پیاده‌سازی شده‌اند.",
    highlights: "نکات فنی",
    highlightsText:
      "تصمیم‌های فنی کلیدی و جزئیات پیاده‌سازی که ساخت این پروژه را شکل داده‌اند.",
    tags: "برچسب‌ها",
    tagsTitle: "برچسب‌های پروژه",
    category: "دسته‌بندی",
    badges: "نشان‌ها",
    techStack: "تکنولوژی‌ها",
    overview: "نمای کلی",
    challenge: "چالش",
    solution: "راه‌حل",
    outcome: "نتیجه",
    role: "نقش",
    client: "کارفرما",
    year: "سال",
    links: "لینک‌ها",
    viewLive: "مشاهده زنده ↗",
    sourceCode: "کد منبع",
    cover: "رسانه‌ی پروژه",
    ctaTitle: "چیز مشابهی می‌خواهید؟",
    ctaText: "درباره‌ی پروژه‌تان و اینکه چطور می‌توانم کمک کنم صحبت کنیم.",
    cta: "شروع گفتگو",
  },
  services: {
    eyebrow: "خدمات و همکاری",
    title: "خدمات و پلن‌ها",
    subtitle:
      "قیمت‌گذاری پروژه‌های وب به نیاز، مقیاس، امکانات و سطح سفارشی‌سازی بستگی دارد؛ این صفحه کمک می‌کند مسیر همکاری و برآورد هزینه شفاف‌تر شود.",
    supporting:
      "از وب‌سایت‌های سریع و سئو محور تا پنل‌های مدیریتی، مارکت‌پلیس‌ها و وب‌اپلیکیشن‌های اختصاصی.",
    totalLabel: "پلن منتشرشده",
    plansEyebrow: "پلن‌ها",
    plansTitle: "پلن‌های پیشنهادی همکاری",
    plansSubtitle:
      "این پلن‌ها نقطه شروع هستند؛ هزینه نهایی بعد از بررسی نیازها، امکانات و سطح سفارشی‌سازی مشخص می‌شود.",
    priceNote:
      "همه‌ی قیمت‌ها نمونه و به دلار آمریکا هستند. قیمت نهایی متناسب با محدوده‌ی پروژه‌ی شما تعیین می‌شود.",
    emptyTitle: "هنوز پلنی منتشر نشده",
    emptyDesc:
      "پلن‌هایی که از پنل مدیریت منتشر شوند، اینجا نمایش داده می‌شوند. تا آن زمان می‌توانی با ارسال توضیح کوتاه، برآورد اختصاصی دریافت کنی.",
    emptySupport:
      "اگر محدوده پروژه‌ات هنوز دقیق نیست، مشاور پروژه سریع‌ترین راه برای رسیدن به یک مسیر فنی منطقی است.",
    emptyCta: "تماس با من",
    emptyPrimary: "درخواست برآورد پروژه",
    emptySecondary: "تماس با من",
    faqEyebrow: "پرسش‌های متداول",
    faqTitle: "سؤالات رایج",
    faqs: [
      {
        q: "قیمت‌گذاری چطور کار می‌کند؟",
        a: "هر پروژه بر اساس نوع، امکانات، سطح طراحی، زمان‌بندی و پیچیدگی فنی برآورد می‌شود.",
      },
      {
        q: "زمان‌بندی معمولاً چقدر است؟",
        a: "برای وب‌سایت‌های کوچک معمولاً ۲ تا ۴ هفته، و برای پنل‌ها یا وب‌اپلیکیشن‌های پیچیده زمان بیشتری لازم است.",
      },
      {
        q: "آیا پشتیبانی هم انجام می‌دهی؟",
        a: "بله، بعد از تحویل می‌توانیم برای پشتیبانی، رفع باگ، بهبود عملکرد یا توسعه‌های بعدی توافق کنیم.",
      },
      {
        q: "اگر پروژه‌ام با هیچ پلنی جور نباشد چه؟",
        a: "مشکلی نیست. بسیاری از پروژه‌ها اختصاصی هستند و بعد از بررسی نیازها، پیشنهاد متناسب ارائه می‌شود.",
      },
    ],
    ctaTitle: "مطمئن نیستید کدام پلن مناسب است؟",
    ctaText:
      "درباره پروژه‌ات بگو تا مسیر درست و پیشنهاد مناسب‌تری دریافت کنی.",
    cta: "دریافت پیشنهاد",
    ctaSecondary: "درخواست برآورد پروژه",
  },
  contact: {
    eyebrow: "تماس",
    title: "درباره پروژه‌ات صحبت کنیم",
    subtitle:
      "اگر ایده‌ای برای یک وب‌سایت، پنل مدیریتی یا وب‌اپلیکیشن داری، پیام بفرست تا با هم مسیر فنی، زمان‌بندی و برآورد اولیه را بررسی کنیم.",
    supporting:
      "لازم نیست همه جزئیات از قبل آماده باشد؛ یک توضیح کوتاه کافی است تا گفت‌وگو را شروع کنیم.",
    email: "ایمیل",
    location: "موقعیت",
    elsewhere: "شبکه‌ها و راه‌های دیگر",
    methodsTitle: "راه‌های ارتباط",
    methodsSubtitle:
      "بهترین مسیر ارتباط، فرم همین صفحه است. اطلاعات تماس و لینک‌های فعال از تنظیمات سایت نمایش داده می‌شوند.",
    infoCardIntro:
      "اطلاعاتی که اینجا وارد می‌کنی فقط برای بررسی پروژه و پاسخ‌گویی استفاده می‌شود.",
    infoCard: {
      title: "مسیر ارتباط",
      items: [
        {
          title: "زمان پاسخ‌گویی",
          description:
            "معمولاً در اولین فرصت یا حداکثر طی یک روز کاری پاسخ می‌دهم.",
          icon: "clock",
        },
        {
          title: "مناسب برای",
          description:
            "وب‌سایت، پنل مدیریتی، وب‌اپلیکیشن و توسعه پروژه موجود.",
          icon: "briefcase",
        },
        {
          title: "شروع همکاری",
          description:
            "اگر هنوز دقیق نمی‌دانی چه چیزی لازم داری، یک توضیح کوتاه کافی است.",
          icon: "message",
        },
        {
          title: "برآورد پروژه",
          description:
            "برای بررسی دقیق‌تر، می‌توانی فرم برآورد پروژه را تکمیل کنی.",
          icon: "send",
        },
      ],
      primaryCta: {
        label: "درخواست برآورد پروژه",
        href: "/start-project",
      },
      secondaryCta: {
        label: "مشاهده پروژه‌ها",
        href: "/projects",
      },
    },
    process: {
      badge: "بعد از ارسال پیام",
      title: "بعد از ارسال پیام چه اتفاقی می‌افتد؟",
      subtitle:
        "اول پیام را بررسی می‌کنم، اگر لازم باشد چند سؤال کوتاه می‌پرسم، و بعد بهترین مسیر بعدی را پیشنهاد می‌دهم.",
      steps: [
        {
          title: "بررسی پیام",
          description: "نیاز و توضیحات اولیه پروژه را بررسی می‌کنم.",
          icon: "search",
        },
        {
          title: "چند سؤال تکمیلی",
          description:
            "اگر لازم باشد، برای روشن‌تر شدن مسیر پروژه چند سؤال کوتاه می‌پرسم.",
          icon: "help",
        },
        {
          title: "پیشنهاد مسیر",
          description:
            "زمان‌بندی، مسیر فنی و حدود برآورد اولیه را شفاف پیشنهاد می‌دهم.",
          icon: "zap",
        },
      ],
    },
    cta: {
      title: "نمی‌دونی از کجا شروع کنی؟",
      subtitle: "با یک توضیح کوتاه، مسیر مناسب پروژه‌ات را پیدا می‌کنیم.",
      primary: "شروع برآورد پروژه",
      secondary: "مشاهده خدمات",
    },
    form: {
      name: "نام",
      email: "ایمیل",
      subject: "موضوع",
      message: "پیام",
      projectType: "نوع پروژه",
      budgetRange: "بودجه حدودی",
      timeline: "زمان‌بندی",
      placeholders: {
        name: "نام شما",
        email: "you@example.com",
        subject: "مثلاً طراحی سایت، پنل مدیریت یا مشاوره فنی",
        message:
          "کمی درباره ایده، هدف یا نیاز پروژه‌ات توضیح بده...",
      },
      options: {
        empty: "انتخاب کنید",
        projectType: {
          website: "وب‌سایت",
          dashboard: "پنل مدیریت",
          webapp: "وب‌اپلیکیشن",
          optimization: "بهینه‌سازی پروژه موجود",
          other: "سایر",
        },
        budgetRange: {
          estimate: "نیاز به برآورد دارم",
          under30: "کمتر از ۳۰ میلیون",
          between30And70: "۳۰ تا ۷۰ میلیون",
          between70And150: "۷۰ تا ۱۵۰ میلیون",
          above150: "بیشتر از ۱۵۰ میلیون",
        },
        timeline: {
          urgent: "فوری",
          oneToTwoMonths: "۱ تا ۲ ماه",
          threePlusMonths: "۳ ماه به بالا",
          flexible: "انعطاف‌پذیر",
        },
      },
      send: "ارسال پیام",
      sending: "در حال ارسال…",
      success: "پیامت با موفقیت ارسال شد. در اولین فرصت پاسخ می‌دهم.",
      errorRequired: "نام، ایمیل و پیام الزامی هستند.",
      errorEmail: "لطفاً یک ایمیل معتبر وارد کنید.",
      errorGeneric: "ارسال پیام با مشکل روبه‌رو شد. لطفاً دوباره تلاش کن.",
    },
  },
  planner: {
    hero: {
      badge: "برآورد پروژه",
      title: "پروژه‌ات را هوشمندانه شروع کن",
      subtitle:
        "به چند سؤال کوتاه پاسخ بده تا مسیر پیشنهادی، پیچیدگی تقریبی، زمان‌بندی و حدود هزینه پروژه بهتر مشخص شود.",
      supporting:
        "این برآورد اولیه است و بعد از بررسی جزئیات پروژه می‌تواند دقیق‌تر شود.",
    },
    cmsNote:
      "برای پروژه‌های ساده‌تر یا شروع سریع، راهکارهای مبتنی بر CMS می‌توانند انتخاب اقتصادی و مناسبی باشند. برای سیستم‌های اختصاصی و مقیاس‌پذیر، توسعه اختصاصی پیشنهاد می‌شود.",
    ui: {
      next: "ادامه",
      back: "بازگشت",
      submit: "ارسال درخواست برآورد",
      submitting: "در حال ارسال درخواست...",
      selectOne: "یک گزینه انتخاب کن",
      selectMany: "هر تعداد که لازم است انتخاب کن",
      typeHelper: "یک گزینه را انتخاب کن تا مسیر برآورد اولیه مشخص شود.",
      optional: "اختیاری",
      summary: "پاسخ‌های شما",
      recommendation: "رویکرد پیشنهادی",
      step: "مرحله",
      of: "از",
      restart: "شروع دوباره",
      none: "—",
    },
    steps: {
      projectType: "چه چیزی می‌خواهی بسازی؟",
      cmsSolutionType: "کدام رویکرد وردپرس مناسب‌تر است؟",
      goals: "هدف‌های اصلی شما چیست؟",
      features: "به چه قابلیت‌هایی نیاز دارید؟",
      designLevel: "چه سطحی از طراحی؟",
      currentStage: "اکنون در چه مرحله‌ای هستید؟",
      timeline: "زمان‌بندی شما چگونه است؟",
      budgetLevel: "سطح بودجه‌ی شما؟",
      contact: "چطور با شما تماس بگیرم؟",
    },
    contact: {
      name: "نام شما",
      email: "ایمیل",
      phone: "تلفن",
      company: "شرکت (اختیاری)",
      method: "روش تماس ترجیحی",
      description: "توضیح بیشتر؟ (اختیاری)",
      descriptionPlaceholder: "کمی بیشتر درباره‌ی پروژه‌تان بگویید…",
    },
    result: {
      title: "خلاصه برآورد",
      previewBadge: "پیش‌نمایش",
      basis: "برآورد اولیه بر اساس انتخاب‌های فعلی",
      empty:
        "بعد از انتخاب گزینه‌ها، خلاصه‌ای از مسیر پیشنهادی، پیچیدگی، زمان‌بندی و حدود هزینه اینجا نمایش داده می‌شود.",
      projectType: "نوع پروژه",
      notSelected: "انتخاب نشده",
      plan: "رویکرد پیشنهادی",
      complexity: "پیچیدگی تقریبی",
      timeline: "زمان تقریبی",
      score: "امتیاز پروژه",
      duration: "زمان تقریبی",
      weeksUnit: "هفته",
      daysUnit: "روز",
      price: "حدود هزینه",
      priceFrom: "از",
      to: "تا",
      needsReview: "نیاز به بررسی دقیق",
      featuresLabel: "امکانات انتخاب‌شده",
      designLabel: "سطح طراحی",
      supportLabel: "پشتیبانی",
      supportDetailPrefix: "پشتیبانی پس از تحویل",
      supportOngoingNote:
        "پشتیبانی بلندمدت به‌صورت جداگانه و ماهانه توافق می‌شود.",
      pagesLabel: "تعداد صفحات",
      pagesUnit: "صفحه",
      noFeatures: "بدون امکانات اضافه",
      calcTitle: "جزئیات برآورد",
      urgencyWarning:
        "زمان انتخاب‌شده فشرده‌تر از برآورد فعلی است و ممکن است نیاز به کاهش امکانات یا اجرای مرحله‌ای داشته باشد.",
      breakdown: "جزئیات برآورد",
      priceNote:
        "این عدد قطعی نیست و بعد از بررسی جزئیات پروژه دقیق‌تر می‌شود.",
      disclaimer:
        "این برآورد اولیه است و بعد از بررسی جزئیات پروژه نهایی می‌شود.",
    },
    pages: {
      helper:
        "صفحه‌هایی مثل خانه، درباره، خدمات، تماس، لیست محصولات، جزئیات محصول یا داشبورد هرکدام بخشی از زمان طراحی و پیاده‌سازی را تشکیل می‌دهند.",
      maxNote:
        "برای پروژه‌های بزرگ‌تر از ۲۰ صفحه، بهتر است برآورد دقیق‌تر بعد از بررسی ساختار انجام شود.",
      presets: ["۱ تا ۳", "۴ تا ۷", "۸ تا ۱۲", "۱۳ تا ۲۰", "بیشتر از ۲۰"],
    },
    success: {
      title: "درخواستت با موفقیت ثبت شد",
      subtitle:
        "خلاصه برآورد اولیه آماده شد. بعد از بررسی جزئیات، برای نهایی‌سازی مسیر، زمان‌بندی و هزینه با تو تماس می‌گیرم.",
      note: "این برآورد قطعی نیست و بعد از بررسی دقیق نیازها می‌تواند تغییر کند.",
      downloadPdf: "دانلود پیش‌فاکتور PDF",
      downloading: "در حال آماده‌سازی...",
      downloadError:
        "دانلود پیش‌فاکتور با مشکل روبه‌رو شد. لطفاً دوباره تلاش کن.",
      viewProjects: "مشاهده پروژه‌ها",
      backHome: "بازگشت به خانه",
    },
    pdf: {
      title: "پیش‌فاکتور اولیه پروژه",
      subtitle:
        "برآورد اولیه بر اساس اطلاعات ثبت‌شده در فرم برآورد پروژه",
      date: "تاریخ",
      client: "اطلاعات کارفرما",
      name: "نام",
      email: "ایمیل",
      phone: "شماره تماس / تلگرام",
      company: "برند یا شرکت",
      contactMethod: "روش تماس ترجیحی",
      projectSummary: "خلاصه پروژه",
      projectType: "نوع پروژه",
      designLevel: "سطح طراحی",
      pages: "تعداد صفحات",
      features: "امکانات انتخاب‌شده",
      timelinePref: "زمان‌بندی موردنظر",
      description: "توضیحات پروژه",
      estimateSummary: "برآورد اولیه",
      complexity: "پیچیدگی تقریبی",
      timeline: "زمان تقریبی",
      price: "حدود هزینه",
      support: "پشتیبانی پس از تحویل",
      supportType: "نوع پشتیبانی",
      supportDesc: "توضیح کوتاه",
      supportEffect: "اثر روی برآورد",
      supportEffects: {
        none: "بدون تغییر در هزینه و زمان",
        basic_1_month: "افزایش جزئی هزینه",
        pro_3_months: "افزایش متوسط هزینه و ۱ تا ۳ روز زمان",
        ongoing: "نیازمند توافق جداگانه و ماهانه",
      },
      notesTitle: "توضیحات و شرایط",
      disclaimer:
        "این پیش‌فاکتور صرفاً یک برآورد اولیه بر اساس اطلاعات واردشده است و به‌عنوان قیمت نهایی یا تعهد قراردادی محسوب نمی‌شود. مبلغ و زمان نهایی پس از بررسی کامل جزئیات پروژه، محدوده امکانات، طراحی، محتوا، زیرساخت و شرایط همکاری مشخص خواهد شد.",
      contactNote:
        "برای نهایی‌سازی پیشنهاد، پس از بررسی جزئیات با شما تماس گرفته می‌شود.",
      none: "—",
    },
    plans: {
      landing: "صفحه فرود (Landing Page)",
      cms: "ساخت سایت وردپرسی (WordPress / CMS)",
      website: "وب‌سایت فول‌استک (Full-stack)",
      ecommerce: "ساخت فروشگاه اینترنتی",
      dashboard: "داشبورد و پنل مدیریت (Admin Panel)",
      custom: "توسعه اختصاصی (Custom)",
    },
    complexity: {
      low: "کم",
      medium: "متوسط",
      high: "زیاد",
      very_high: "خیلی زیاد",
      needs_review: "نیازمند بررسی",
    },
    timelines: {
      "1-2-weeks": "۱ تا ۲ هفته",
      "3-6-weeks": "۳ تا ۶ هفته",
      "6-10-weeks": "۶ تا ۱۰ هفته",
      "10-plus-weeks": "۱۰ هفته به بالا",
    },
    form: {
      success:
        "درخواست شما ثبت شد. خیلی زود برای بررسی جزئیات با شما تماس می‌گیرم.",
      errorRequired: "لطفاً نام خود را وارد کنید.",
      errorContact: "لطفاً شماره تماس یا ایمیل وارد کنید.",
      errorProjectType: "لطفاً نوع پروژه را انتخاب کنید.",
      errorGeneric:
        "ثبت درخواست با خطا مواجه شد. لطفاً چند لحظه بعد دوباره تلاش کنید.",
      errorSchema:
        "جدول درخواست‌های پروژه هنوز در دیتابیس ساخته نشده است. لطفاً ابتدا npm run db:push را اجرا کنید.",
    },
    cta: {
      homeTitle: "نمی‌دونی از کجا شروع کنی؟",
      homeText: "با چند سوال کوتاه، مسیر مناسب پروژه‌ات را پیدا کن.",
      start: "شروع پروژه",
      servicesTitle: "نمی‌دونی دقیقاً چه چیزی برای پروژه‌ات لازمه؟",
      servicesText:
        "چند سؤال کوتاه درباره نوع پروژه، امکانات، تعداد صفحات، سطح طراحی و تکنولوژی‌ها کمک می‌کند یک پیشنهاد اولیه، منطقی و قابل اجرا برایت آماده کنم.",
      servicesButton: "شروع برآورد پروژه",
    },
  },
  card: {
    featured: "★ شاخص",
    preview: "پیش‌نمایش",
    image: "تصویر",
    live: "زنده ↗",
    viewWork: "مشاهده کار ↗",
    mostPopular: "محبوب‌ترین",
    caseStudy: "مطالعه موردی →",
    from: "از",
    getStarted: "شروع کنید",
    customNote:
      "محدوده، زمان‌بندی و قیمت سفارشی پیش از شروع قابل گفتگو است.",
    contactQuote: "برای قیمت تماس بگیرید",
    types: {
      commercial: "تجاری",
      personal: "شخصی",
      freelance: "فریلنسری",
    },
  },
  admin: {
    panel: "پنل مدیریت",
    upload: {
      cta: "برای آپلود کلیک کنید یا فایل را بکشید",
      uploading: "در حال آپلود...",
      uploaded: "فایل آپلود شد",
      remove: "حذف",
      replace: "جایگزینی",
      manual: "لینک دستی",
      manualHide: "بستن لینک دستی",
      urlPlaceholder: "https://…",
      openFile: "باز کردن فایل",
      tooBig: "حجم فایل بیش از حد مجاز است.",
      failed: "آپلود با خطا مواجه شد. دوباره تلاش کنید.",
      addImages: "افزودن تصویر",
      galleryHint: "برای تغییر ترتیب، تصاویر را بکشید. تصویر اول، نخستین تصویر گالری است.",
    },
    tech: {
      placeholder: "انتخاب تکنولوژی‌ها",
      search: "جستجو…",
      empty: "تکنولوژی‌ای یافت نشد",
      clear: "حذف همه",
      selected: "انتخاب‌شده",
    },
    nav: {
      dashboard: "داشبورد",
      about: "صفحه درباره",
      contactPage: "صفحه تماس",
      projects: "پروژه‌ها",
      services: "خدمات",
      messages: "پیام‌ها",
      projectRequests: "درخواست‌های پروژه",
      plannerOptions: "تنظیمات مشاور پروژه",
      plannerEstimates: "قوانین برآورد پروژه",
      settings: "تنظیمات",
      backToSite: "← بازگشت به سایت",
      logout: "خروج",
    },
    estimates: {
      title: "قوانین برآورد پروژه",
      description: "قوانین مدت‌زمان و قیمت‌گذاری مورد استفاده در برآورد پروژه.",
      settingsTitle: "تنظیمات قیمت‌گذاری",
      weeklyRate: "نرخ هفتگی",
      currency: "واحد قیمت",
      minPrice: "حداقل قیمت پروژه",
      rounding: "گرد کردن قیمت",
      roundingNearest500k: "نزدیک‌ترین ۵۰۰ هزار",
      roundingNearest1m: "نزدیک‌ترین ۱ میلیون",
      estimateEnabled: "فعال بودن برآورد",
      showPrice: "نمایش قیمت به کاربر",
      save: "ذخیره تنظیمات",
      rulesTitle: "قوانین مدت‌زمان",
      emptyRules:
        "قوانین پیش‌فرض از کد استفاده می‌شوند. برای ویرایش، قوانین را در دیتابیس مقداردهی اولیه کنید.",
      seed: "ایجاد قوانین پیش‌فرض در دیتابیس",
      durationDays: "مدت (روز)",
      active: "فعال",
      edit: "ویرایش",
      days: "روز",
      pageEdit: "ویرایش قانون برآورد",
      ruleKey: "کلید",
      sortOrder: "ترتیب",
      labelFa: "برچسب (فارسی)",
      labelEn: "برچسب (انگلیسی)",
      descFa: "توضیح (فارسی)",
      descEn: "توضیح (انگلیسی)",
    },
    requests: {
      title: "درخواست‌های پروژه",
      description: "درخواست‌های ثبت‌شده از مشاور پروژه.",
      empty: "هنوز درخواستی ثبت نشده است.",
      searchPlaceholder: "جستجوی نام، ایمیل، تلفن، شرکت…",
      allStatuses: "همه وضعیت‌ها",
      cols: {
        name: "نام / شرکت",
        type: "نوع پروژه",
        plan: "پیشنهاد",
        complexity: "پیچیدگی",
        status: "وضعیت",
        created: "دریافت",
        contact: "تماس",
      },
      detail: {
        contact: "اطلاعات تماس",
        project: "پروژه",
        cms: "راهکار وردپرس",
        goals: "اهداف",
        features: "قابلیت‌ها",
        design: "سطح طراحی",
        stage: "مرحله فعلی",
        timeline: "زمان‌بندی",
        budget: "بودجه",
        description: "توضیحات",
        recommendation: "پیشنهاد",
        note: "یادداشت مدیر",
        noteHint: "فقط داخلی — هرگز به مشتری نمایش داده نمی‌شود.",
        saveNote: "ذخیره یادداشت",
        status: "وضعیت",
        back: "← بازگشت به درخواست‌ها",
        none: "—",
        email: "ایمیل",
        phone: "تلفن",
        company: "شرکت",
        method: "روش تماس ترجیحی",
        score: "امتیاز",
        archive: "بایگانی",
        dynamicAnswers: "پاسخ‌های اختصاصی پروژه",
        estimate: "برآورد زمان و هزینه",
        estDays: "روز تخمینی",
        estWeeks: "هفته تخمینی",
        estPrice: "هزینه تخمینی",
        weeklyRate: "نرخ هفتگی (هنگام ثبت)",
        breakdown: "جزئیات برآورد",
        noEstimate: "برآوردی برای این درخواست ثبت نشده است.",
        snapshotNote:
          "این برآورد در زمان ثبت محاسبه شده و با تغییر نرخ‌ها در آینده تغییر نمی‌کند.",
      },
    },
    plannerOpts: {
      title: "تنظیمات مشاور پروژه",
      description: "مدیریت گزینه‌های نمایش‌داده‌شده در مشاور پروژه.",
      newItem: "گزینه جدید",
      empty: "گزینه‌ی سفارشی وجود ندارد — از مقادیر پیش‌فرض استفاده می‌شود.",
      fallbackNote:
        "گروه‌هایی که گزینه‌ی فعال ندارند، از مقادیر پیش‌فرض استفاده می‌کنند.",
      group: "گروه",
      value: "مقدار (ثابت)",
      valueHint: "در درخواست‌های ثبت‌شده ذخیره می‌شود — بعداً قابل تغییر نیست.",
      labelFa: "برچسب (فارسی)",
      labelEn: "برچسب (انگلیسی)",
      descFa: "توضیح (فارسی)",
      descEn: "توضیح (انگلیسی)",
      icon: "آیکون",
      weight: "وزن امتیازدهی",
      active: "فعال",
      sortOrder: "ترتیب",
      create: "ساخت گزینه",
      save: "ذخیره تغییرات",
      edit: "ویرایش",
      activate: "فعال‌سازی",
      deactivate: "غیرفعال‌سازی",
      pageNew: "گزینه جدید مشاور",
      pageEdit: "ویرایش گزینه مشاور",
      confirmDelete: "این گزینه حذف شود؟ این کار قابل بازگشت نیست.",
    },
    dashboard: {
      title: "داشبورد",
      description: "نمای کلی محتوای سایت شما.",
      statProjects: "پروژه‌ها",
      statServices: "خدمات",
      statNewMessages: "پیام‌های جدید",
      statUniqueVisitors: "بازدیدکنندگان یکتا",
      statPageViews: "بازدید صفحه‌ها",
      statToday: "امروز",
      recentMessages: "پیام‌های اخیر",
      viewAll: "مشاهده همه",
      quickActions: "اقدامات سریع",
      noMessages: "هنوز پیامی نیست.",
      newBadge: "جدید",
    },
    projects: {
      title: "پروژه‌ها",
      description: "ساخت، ویرایش و شاخص‌کردن پروژه‌ها.",
      newItem: "پروژه جدید",
      empty: "هنوز پروژه‌ای نیست. اولین پروژه را بسازید.",
    },
    services: {
      title: "خدمات و پلن‌ها",
      description: "مدیریت پلن‌های تجاری و قیمت‌گذاری.",
      newItem: "پلن جدید",
      empty: "هنوز پلنی نیست. اولین پلن را بسازید.",
    },
    messages: {
      title: "پیام‌ها",
      description: "درخواست‌های تماس ارسال‌شده از طریق سایت شما.",
      empty: "هنوز پیامی نیست. ارسال‌های فرم تماس اینجا نمایش داده می‌شوند.",
    },
    settings: {
      title: "تنظیمات سایت",
      description: "مدیریت پروفایل و محتوای سراسری سایت.",
      newTitle: "ساخت تنظیمات سایت",
      save: "ذخیره تنظیمات",
      saved: "تنظیمات با موفقیت ذخیره شد.",
      noticeFirst: "هنوز ردیف تنظیماتی وجود ندارد — با ذخیره ساخته می‌شود.",
    },
    about: {
      title: "مدیریت صفحه درباره",
      description: "محتوای نمایش‌داده‌شده در صفحه عمومی درباره را مدیریت کنید.",
      save: "ذخیره صفحه درباره",
      noticeFirst:
        "هنوز ردیف تنظیماتی وجود ندارد — با ذخیره این محتوای About ساخته می‌شود.",
    },
    contact: {
      title: "مدیریت صفحه تماس",
      description:
        "محتوای صفحه عمومی تماس و راه‌های ارتباطی مشترک را مدیریت کنید.",
      save: "ذخیره صفحه تماس",
      noticeFirst:
        "هنوز ردیف تنظیماتی وجود ندارد — با ذخیره این محتوای Contact ساخته می‌شود.",
      sharedTitle: "تنظیمات مشترک تماس",
      sharedDescription:
        "این مقادیر در راه‌های ارتباطی صفحه تماس و لینک‌های اجتماعی فوتر استفاده می‌شوند.",
      contentTitle: "محتوای صفحه",
      contentDescription:
        "هر زبان می‌تواند نسخه مستقل صفحه تماس خودش را داشته باشد و در صورت خالی بودن، fallback انجام می‌شود.",
    },
    table: {
      title: "عنوان",
      name: "نام",
      slug: "اسلاگ",
      status: "وضعیت",
      featured: "شاخص",
      homepage: "صفحه اصلی",
      updated: "به‌روزرسانی",
      price: "قیمت",
      period: "دوره",
      type: "نوع",
      from: "از",
      message: "پیام",
      received: "دریافت",
      yes: "بله",
      actions: "",
    },
    actions: {
      edit: "ویرایش",
      delete: "حذف",
      deleting: "در حال حذف…",
      markRead: "خوانده شد",
      archive: "بایگانی",
      reopen: "بازگشایی",
      view: "مشاهده سایت",
    },
    status: {
      draft: "پیش‌نویس",
      published: "منتشرشده",
      archived: "بایگانی‌شده",
      new: "جدید",
      read: "خوانده‌شده",
      reviewed: "بررسی‌شده",
      contacted: "تماس گرفته‌شده",
      in_progress: "در حال انجام",
      converted: "تبدیل‌شده",
      rejected: "ردشده",
    },
    quick: {
      newProject: "پروژه جدید",
      newService: "خدمت / پلن جدید",
      viewMessages: "مشاهده پیام‌ها",
    },
    confirm: {
      project: "این پروژه حذف شود؟ این کار قابل بازگشت نیست.",
      plan: "این پلن حذف شود؟ این کار قابل بازگشت نیست.",
      message: "این پیام حذف شود؟ این کار قابل بازگشت نیست.",
    },
    forms: {
      shared: "مشترک",
      persian: "محتوای فارسی",
      english: "محتوای انگلیسی",
      content: "محتوا",
      contentHint: "نسخه‌ی فارسی و انگلیسی را وارد کنید — هرکدام می‌تواند خالی بماند.",
      essentials: "اطلاعات اصلی",
      essentialsHint: "اسلاگ، وضعیت و محل نمایش.",
      advanced: "پیشرفته",
      advancedHint: "تکنولوژی‌ها، رسانه و لینک‌های خارجی.",
      pricing: "قیمت‌گذاری",
      pricingHint: "قیمت، دوره‌ی صورت‌حساب و واحد پول.",
      media: "رسانه و لینک‌ها",
      mediaHint: "تصویر و لینک خارجی پروژه.",
      homeDisplay: "نمایش در صفحه اصلی",
      homeDisplayHint:
        "نحوه نمایش پروژه در صفحه اصلی را مدیریت کنید. حداکثر ۳ پروژه در صفحه اصلی نمایش داده می‌شود.",
      homeFeatured: "نمایش در صفحه اصلی",
      homeFeaturedHint:
        "صفحه اصلی فقط ۳ پروژه منتشرشده اول را بر اساس این ترتیب نمایش می‌دهد.",
      homeOrder: "ترتیب نمایش در صفحه اصلی",
      homeOrderHint: "عدد کمتر، نمایش زودتر.",
      previewImage: "تصویر پیش‌نمایش صفحه اصلی",
      homeTechStack: "تکنولوژی‌های کارت صفحه اصلی",
      profile: "پروفایل",
      profileHint: "نام، تیتر، بیوگرافی و مهارت‌ها به‌تفکیک زبان.",
      sharedFields: "اطلاعات مشترک",
      sharedFieldsHint: "ایمیل، آواتار و رزومه — یکسان در همه‌ی زبان‌ها.",
      cancel: "انصراف",
      saving: "در حال ذخیره…",
      createProject: "ساخت پروژه",
      saveProject: "ذخیره تغییرات",
      createService: "ساخت پلن",
      saveService: "ذخیره تغییرات",
      pageProjectNew: "پروژه جدید",
      pageProjectEdit: "ویرایش پروژه",
      pageServiceNew: "خدمت / پلن جدید",
      pageServiceEdit: "ویرایش خدمت / پلن",
      title: "عنوان",
      name: "نام",
      slug: "اسلاگ",
      slugHint: "حروف کوچک و خط تیره. بین زبان‌ها مشترک است.",
      excerpt: "خلاصه",
      description: "توضیحات",
      cover: "آدرس تصویر کاور",
      coverImage: "تصویر کاور",
      gallery: "گالری تصاویر",
      slugReadonly: "لینک تولیدشده (اسلاگ)",
      slugReadonlyHint: "به‌صورت خودکار از روی عنوان ساخته می‌شود.",
      image: "آدرس تصویر",
      client: "کارفرما",
      role: "نقش",
      year: "سال",
      tags: "برچسب‌ها",
      tech: "تکنولوژی‌ها",
      listHint: "هر مورد در یک خط یا جداشده با کاما.",
      challenge: "چالش",
      solution: "راه‌حل",
      outcome: "نتیجه",
      liveUrl: "آدرس زنده",
      repoUrl: "آدرس مخزن",
      externalUrl: "آدرس پروژه",
      type: "نوع / دسته",
      status: "وضعیت",
      featured: "شاخص",
      featuredHint: "نمایش این مورد در بخش‌های شاخص.",
      tagline: "برچسب «مناسب برای»",
      price: "قیمت (دلار)",
      priceHint: "برای «تماس برای قیمت» خالی بگذارید.",
      billingPeriod: "دوره صورت‌حساب",
      currency: "واحد پول",
      ctaLabel: "متن دکمه فراخوان",
      features: "ویژگی‌ها",
      ownerName: "نام مالک",
      headline: "تیتر",
      bio: "بیوگرافی",
      aboutIntro: "معرفی صفحه درباره (پاراگراف دوم)",
      location: "موقعیت",
      skills: "مهارت‌ها",
      email: "ایمیل",
      avatarUrl: "آدرس آواتار",
      resumeUrl: "آدرس رزومه",
      assets: "برندینگ و رسانه",
      assetsHint: "لوگو، فاوآیکون و تصویر هیرو که در سراسر سایت استفاده می‌شوند.",
      logo: "لوگو",
      favicon: "فاوآیکون",
      heroImage: "تصویر هیرو",
      avatar: "تصویر پروفایل",
      resume: "رزومه (PDF)",
    },
    errors: {
      titleRequired: "عنوان فارسی یا انگلیسی الزامی است.",
      nameRequired: "نام فارسی یا انگلیسی الزامی است.",
      slugRequired: "اسلاگ الزامی است (یا عنوان انگلیسی وارد کنید).",
      coverRequired: "تصویر کاور الزامی است.",
      notSignedIn: "برای انجام این کار باید وارد شوید.",
      db: "ارتباط با پایگاه‌داده برقرار نشد، چیزی ذخیره نشد. اتصال را بررسی و دوباره تلاش کنید.",
      schema: "اسکیما یا جدول‌های پایگاه‌داده آماده نیستند. قبل از استفاده از تنظیمات سایت، migration یا db push را اجرا کنید.",
      slugTaken: "این اسلاگ قبلاً استفاده شده است. مورد دیگری انتخاب کنید.",
      invalidId: "شناسه نامعتبر است.",
      invalidHomeOrder:
        "ترتیب نمایش در صفحه اصلی باید یک عدد معتبر و صفر یا بیشتر باشد.",
      invalidMetric:
        "هر متریک باید هم برچسب و هم مقدار داشته باشد.",
      invalidAboutContent:
        "محتوای صفحه درباره ناقص یا نامعتبر است. فیلدهای ضروری را بررسی و دوباره تلاش کنید.",
      invalidContactContent:
        "محتوای صفحه تماس ناقص یا نامعتبر است. فیلدهای ضروری را بررسی و دوباره تلاش کنید.",
      invalidUrl:
        "لینک‌های CTA باید مسیر داخلی یا URL کامل معتبر باشند.",
    },
    auth: {
      title: "ورود مدیر",
      subtitle: "برای مدیریت محتوای سایت وارد شوید.",
      email: "ایمیل",
      password: "رمز عبور",
      remember: "مرا به خاطر بسپار",
      rememberHint: "تا ۳۰ روز روی این دستگاه وارد بمانید.",
      signIn: "ورود",
      backTo: "← بازگشت به {site}",
      errRequired: "ایمیل و رمز عبور الزامی هستند.",
      errEmail: "لطفاً یک ایمیل معتبر وارد کنید.",
      errDb: "ارتباط با پایگاه‌داده برقرار نشد. بعداً دوباره تلاش کنید.",
      errInvalid: "ایمیل یا رمز عبور نادرست است.",
    },
  },
};

function isObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === "object" && value !== null && !Array.isArray(value)
  );
}

/** Deep-merge Persian overrides onto the English base (English fallback). */
function deepMerge<T>(base: T, override: DeepPartial<T> | undefined): T {
  if (!override) return base;
  const result = Array.isArray(base) ? [...(base as unknown[])] : { ...base };
  for (const key of Object.keys(override) as (keyof T)[]) {
    const o = override[key];
    if (o === undefined) continue;
    const b = (base as Record<string, unknown>)[key as string];
    if (isObject(b) && isObject(o)) {
      (result as Record<string, unknown>)[key as string] = deepMerge(
        b,
        o as DeepPartial<typeof b>,
      );
    } else {
      (result as Record<string, unknown>)[key as string] = o as unknown;
    }
  }
  return result as T;
}

const merged: Record<Locale, Dictionary> = {
  en,
  fa: deepMerge(en, fa),
};

/** Get the full dictionary for a locale (English-merged for fallback). */
export function getDictionary(locale: Locale): Dictionary {
  return merged[locale] ?? en;
}

/** Interpolate {placeholders} in a translation string. */
export function format(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, k) =>
    k in vars ? String(vars[k]) : `{${k}}`,
  );
}
