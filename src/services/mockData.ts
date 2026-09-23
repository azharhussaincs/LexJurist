import {
  User,
  LegalPost,
  Community,
  LegalJob,
  LegalEvent,
  NotificationItem,
  ModerationReport,
  LawyerVerificationRequest,
  Conversation,
  DirectMessage
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-eleanor-vance',
    email: 'eleanor.vance@sterlingvance.law',
    role: 'lawyer',
    fullName: 'Eleanor Vance, Esq.',
    isEmailVerified: true,
    status: 'active',
    createdAt: '2025-01-10T08:00:00Z',
    privacySettings: {
      profileVisibility: 'public',
      whoCanMessage: 'everyone',
      whoCanConnect: 'everyone',
      showNetwork: true,
    },
    lawyerProfile: {
      id: 'prof-eleanor',
      userId: 'user-eleanor-vance',
      fullName: 'Eleanor Vance, Esq.',
      title: 'Senior Partner, Appellate & Antitrust Litigation',
      headline: 'Partner at Sterling & Vance LLP · Former Supreme Court Clerk · Harvard Law J.D.',
      firmOrOrganization: 'Sterling & Vance LLP',
      location: { city: 'New York', country: 'United States' },
      primaryPracticeArea: 'Appellate & Complex Litigation',
      practiceAreas: ['Appellate Law', 'Antitrust & Competition', 'Constitutional Law', 'Supreme Court Practice'],
      yearsOfExperience: 18,
      barAdmissions: [
        {
          id: 'bar-1',
          barCouncil: 'New York State Unified Court System',
          jurisdiction: 'New York (First Dept.)',
          licenseNumber: 'NY-4892103',
          admissionYear: 2008,
          status: 'active',
          isVerified: true,
        },
        {
          id: 'bar-2',
          barCouncil: 'Supreme Court of the United States',
          jurisdiction: 'Federal / SCOTUS Bar',
          licenseNumber: 'SC-91024',
          admissionYear: 2012,
          status: 'active',
          isVerified: true,
        }
      ],
      experience: [
        {
          id: 'exp-1',
          organization: 'Sterling & Vance LLP',
          role: 'Senior Partner & Practice Group Co-Chair',
          location: 'New York, NY',
          startDate: '2016-01-01',
          endDate: 'Present',
          description: 'Lead counsel in 14 federal appeals and three merits arguments before the U.S. Supreme Court on antitrust and federal jurisdiction issues.'
        },
        {
          id: 'exp-2',
          organization: 'U.S. Department of Justice (Antitrust Division)',
          role: 'Special Trial Attorney',
          location: 'Washington, DC',
          startDate: '2010-09-01',
          endDate: '2015-12-31',
          description: 'Investigated and prosecuted multi-jurisdictional price-fixing conspiracies in international markets.'
        }
      ],
      education: [
        {
          id: 'edu-1',
          institution: 'Harvard Law School',
          degree: 'Juris Doctor (J.D.)',
          field: 'Law',
          graduationYear: 2007,
          honors: 'magna cum laude · Harvard Law Review Supreme Court Chair'
        },
        {
          id: 'edu-2',
          institution: 'Columbia University',
          degree: 'Bachelor of Arts',
          field: 'Philosophy & Economics',
          graduationYear: 2004,
          honors: 'summa cum laude · Phi Beta Kappa'
        }
      ],
      languages: ['English', 'French (Proficient)'],
      bio: 'Eleanor Vance has spent over eighteen years at the forefront of appellate advocacy and federal competition law. She represents clients in high-stakes appeals, antitrust enforcement actions, and complex constitutional litigation.',
      website: 'https://sterlingvance.law/partners/eleanor-vance',
      linkedIn: 'https://linkedin.com/in/eleanor-vance-law',
      contactPreferences: {
        allowDirectMessages: 'everyone',
        showEmailToConnections: true,
        showPhoneToConnections: false,
        availableForReferrals: true,
      },
      connectionsCount: 384,
      followingCount: 192,
      followersCount: 840,
      verificationStatus: 'verified',
      verificationBadgeGrantedAt: '2025-01-12T10:00:00Z',
      isDemoAccount: true,
    }
  },
  {
    id: 'user-marcus-chen',
    email: 'marcus.chen@techcounsel.org',
    role: 'lawyer',
    fullName: 'Marcus Chen, Esq.',
    isEmailVerified: true,
    status: 'active',
    createdAt: '2025-02-01T09:00:00Z',
    privacySettings: {
      profileVisibility: 'public',
      whoCanMessage: 'everyone',
      whoCanConnect: 'everyone',
      showNetwork: true,
    },
    lawyerProfile: {
      id: 'prof-marcus',
      userId: 'user-marcus-chen',
      fullName: 'Marcus Chen, Esq.',
      title: 'Chief Legal Officer & General Counsel',
      headline: 'CLO at NexaSpatial Labs · IP & AI Regulatory Strategy · Stanford Law J.D.',
      firmOrOrganization: 'NexaSpatial Labs',
      location: { city: 'San Francisco', country: 'United States' },
      primaryPracticeArea: 'Technology Law & Intellectual Property',
      practiceAreas: ['Technology Law', 'Intellectual Property', 'Data Privacy & AI Governance', 'Venture Financing'],
      yearsOfExperience: 14,
      barAdmissions: [
        {
          id: 'bar-m1',
          barCouncil: 'State Bar of California',
          jurisdiction: 'California',
          licenseNumber: 'CA-318492',
          admissionYear: 2012,
          status: 'active',
          isVerified: true,
        },
        {
          id: 'bar-m2',
          barCouncil: 'United States Patent and Trademark Office (USPTO)',
          jurisdiction: 'Patent Bar',
          licenseNumber: 'USPTO-71042',
          admissionYear: 2013,
          status: 'active',
          isVerified: true,
        }
      ],
      experience: [
        {
          id: 'exp-m1',
          organization: 'NexaSpatial Labs',
          role: 'Chief Legal Officer & Secretary',
          location: 'San Francisco, CA',
          startDate: '2021-03-01',
          endDate: 'Present',
          description: 'Oversees all global legal operations, commercial contracts, IP patent prosecution, enterprise compliance, and Series C financing rounds.'
        },
        {
          id: 'exp-m2',
          organization: 'Cooley LLP',
          role: 'Senior Technology Transactions Associate',
          location: 'Palo Alto, CA',
          startDate: '2014-08-01',
          endDate: '2021-02-28',
          description: 'Negotiated complex cross-border SaaS agreements, IP licensing, and AI data acquisition transactions.'
        }
      ],
      education: [
        {
          id: 'edu-m1',
          institution: 'Stanford Law School',
          degree: 'Juris Doctor (J.D.)',
          field: 'Law, Science & Technology',
          graduationYear: 2012
        },
        {
          id: 'edu-m2',
          institution: 'UC Berkeley',
          degree: 'B.S. in Electrical Engineering & Computer Science',
          graduationYear: 2009
        }
      ],
      languages: ['English', 'Mandarin (Bilingual)'],
      bio: 'Marcus Chen advises fast-scaling deep tech companies on cross-border patent portfolios, open-source compliance, and navigating emerging EU and US AI regulatory frameworks.',
      website: 'https://nexaspatial.internal/legal',
      linkedIn: 'https://linkedin.com/in/marcus-chen-legal',
      contactPreferences: {
        allowDirectMessages: 'everyone',
        showEmailToConnections: true,
        showPhoneToConnections: false,
        availableForReferrals: true,
      },
      connectionsCount: 512,
      followingCount: 310,
      followersCount: 1220,
      verificationStatus: 'verified',
      verificationBadgeGrantedAt: '2025-02-03T14:30:00Z',
      isDemoAccount: true,
    }
  },
  {
    id: 'user-sarah-mansoor',
    email: 'sarah.mansoor@chambers-arbitration.com',
    role: 'lawyer',
    fullName: 'Sarah Al-Mansoor, FCIArb',
    isEmailVerified: true,
    status: 'active',
    createdAt: '2025-02-15T11:00:00Z',
    privacySettings: {
      profileVisibility: 'public',
      whoCanMessage: 'everyone',
      whoCanConnect: 'everyone',
      showNetwork: true,
    },
    lawyerProfile: {
      id: 'prof-sarah',
      userId: 'user-sarah-mansoor',
      fullName: 'Sarah Al-Mansoor, FCIArb',
      title: 'Partner, International Arbitration & Energy Disputes',
      headline: 'Partner at Crescent Arbitration Chambers · Fellow, Chartered Institute of Arbitrators · Oxford BCL',
      firmOrOrganization: 'Crescent Arbitration Chambers',
      location: { city: 'London', country: 'United Kingdom' },
      primaryPracticeArea: 'International Commercial Arbitration',
      practiceAreas: ['International Arbitration', 'Cross-Border Litigation', 'Energy & Infrastructure Law', 'Bilateral Investment Treaties'],
      yearsOfExperience: 16,
      barAdmissions: [
        {
          id: 'bar-s1',
          barCouncil: 'Bar Standards Board (England & Wales)',
          jurisdiction: 'England & Wales (Middle Temple)',
          licenseNumber: 'EW-74291',
          admissionYear: 2010,
          status: 'active',
          isVerified: true,
        }
      ],
      experience: [
        {
          id: 'exp-s1',
          organization: 'Crescent Arbitration Chambers',
          role: 'Barrister & Arbitrator',
          location: 'London & Dubai',
          startDate: '2018-04-01',
          endDate: 'Present',
          description: 'Sitting arbitrator and lead counsel in ICC, LCIA, and ICSID commercial energy arbitrations totaling in excess of $4B in dispute value.'
        }
      ],
      education: [
        {
          id: 'edu-s1',
          institution: 'University of Oxford',
          degree: 'Bachelor of Civil Law (BCL)',
          field: 'International Dispute Resolution',
          graduationYear: 2009,
          honors: 'Distinction'
        }
      ],
      languages: ['English', 'Arabic (Native)', 'French'],
      bio: 'Sarah Al-Mansoor specializes in international commercial arbitration and public international law with an emphasis on mega-infrastructure contracts across EMEA.',
      website: 'https://crescentarbitration.com/sarah-al-mansoor',
      contactPreferences: {
        allowDirectMessages: 'connections_only',
        showEmailToConnections: true,
        showPhoneToConnections: false,
        availableForReferrals: true,
      },
      connectionsCount: 420,
      followingCount: 180,
      followersCount: 950,
      verificationStatus: 'verified',
      verificationBadgeGrantedAt: '2025-02-18T16:00:00Z',
      isDemoAccount: true,
    }
  },
  {
    id: 'user-david-oconnor',
    email: 'david.oconnor@sullivangreen.law',
    role: 'lawyer',
    fullName: 'David O\'Connor',
    isEmailVerified: true,
    status: 'active',
    createdAt: '2025-03-01T10:00:00Z',
    privacySettings: {
      profileVisibility: 'public',
      whoCanMessage: 'everyone',
      whoCanConnect: 'everyone',
      showNetwork: false,
    },
    lawyerProfile: {
      id: 'prof-david',
      userId: 'user-david-oconnor',
      fullName: 'David O\'Connor',
      title: 'Senior Associate, Corporate Securities & Capital Markets',
      headline: 'Corporate Associate at Sullivan & Green LLP · Northwestern Law J.D.',
      firmOrOrganization: 'Sullivan & Green LLP',
      location: { city: 'Chicago', country: 'United States' },
      primaryPracticeArea: 'Corporate & Securities Law',
      practiceAreas: ['Corporate & Securities', 'Private Equity', 'Capital Markets'],
      yearsOfExperience: 6,
      barAdmissions: [
        {
          id: 'bar-d1',
          barCouncil: 'Illinois Attorney Registration & Disciplinary Commission',
          jurisdiction: 'Illinois',
          licenseNumber: 'IL-6348910',
          admissionYear: 2020,
          status: 'active',
          isVerified: false,
        }
      ],
      experience: [
        {
          id: 'exp-d1',
          organization: 'Sullivan & Green LLP',
          role: 'Senior Associate',
          location: 'Chicago, IL',
          startDate: '2020-09-01',
          endDate: 'Present',
          description: 'Advises private equity sponsors and issuer clients on Rule 144A debt offerings and syndicated credit facilities.'
        }
      ],
      education: [
        {
          id: 'edu-d1',
          institution: 'Northwestern Pritzker School of Law',
          degree: 'Juris Doctor (J.D.)',
          field: 'Corporate Law',
          graduationYear: 2020
        }
      ],
      languages: ['English'],
      bio: 'David O\'Connor focuses on initial public offerings, bond issuances, and corporate governance for mid-cap issuers.',
      contactPreferences: {
        allowDirectMessages: 'everyone',
        showEmailToConnections: true,
        showPhoneToConnections: false,
        availableForReferrals: false,
      },
      connectionsCount: 88,
      followingCount: 65,
      followersCount: 140,
      verificationStatus: 'pending',
      isDemoAccount: true,
    }
  },
  {
    id: 'user-apex-counsel',
    email: 'recruiting@apexcounsel.com',
    role: 'organization',
    fullName: 'Apex Counsel Global LLP',
    isEmailVerified: true,
    status: 'active',
    createdAt: '2025-01-05T09:00:00Z',
    privacySettings: {
      profileVisibility: 'public',
      whoCanMessage: 'everyone',
      whoCanConnect: 'everyone',
      showNetwork: true,
    },
    organizationProfile: {
      id: 'org-apex',
      userId: 'user-apex-counsel',
      name: 'Apex Counsel Global LLP',
      tagline: 'Leading Global AmLaw 100 Firm in Cross-Border M&A, Technology, and Antitrust.',
      firmType: 'Law Firm',
      headquarters: 'New York, NY',
      size: '1,200+ Attorneys worldwide',
      practiceAreas: ['Corporate & M&A', 'Antitrust', 'Intellectual Property', 'White-Collar Defense', 'International Arbitration'],
      website: 'https://apexcounsel.com',
      about: 'Apex Counsel Global LLP is a premier international law firm representing Fortune 100 enterprises, innovative venture-backed disruptors, and sovereign entities across Europe, North America, and Asia.',
      isVerified: true,
      activeJobsCount: 4,
      isDemoAccount: true,
    }
  },
  {
    id: 'user-admin-officer',
    email: 'admin.ethics@lexjurist.org',
    role: 'admin',
    fullName: 'Hon. Arthur Sterling (Platform Admin)',
    isEmailVerified: true,
    status: 'active',
    createdAt: '2024-12-01T00:00:00Z',
    privacySettings: {
      profileVisibility: 'public',
      whoCanMessage: 'everyone',
      whoCanConnect: 'everyone',
      showNetwork: true,
    },
    lawyerProfile: {
      id: 'prof-admin',
      userId: 'user-admin-officer',
      fullName: 'Hon. Arthur Sterling',
      title: 'Chief Compliance Officer & Bar Ethics Administrator',
      headline: 'LexJurist Platform Administrator · Retired Appellate Judge · Georgetown Law',
      firmOrOrganization: 'LexJurist Bar Admissions Committee',
      location: { city: 'Washington', country: 'United States' },
      primaryPracticeArea: 'Judicial Administration & Ethics',
      practiceAreas: ['Judicial Ethics', 'Professional Responsibility', 'Appellate Procedure'],
      yearsOfExperience: 32,
      barAdmissions: [
        {
          id: 'bar-a1',
          barCouncil: 'District of Columbia Court of Appeals',
          jurisdiction: 'District of Columbia',
          licenseNumber: 'DC-198402',
          admissionYear: 1994,
          status: 'emeritus',
          isVerified: true,
        }
      ],
      experience: [],
      education: [],
      languages: ['English'],
      bio: 'Oversees professional credentials validation, ethics enforcement, and member compliance for LexJurist.',
      contactPreferences: {
        allowDirectMessages: 'everyone',
        showEmailToConnections: true,
        showPhoneToConnections: true,
        availableForReferrals: false,
      },
      connectionsCount: 999,
      followingCount: 450,
      followersCount: 3400,
      verificationStatus: 'verified',
      isDemoAccount: true,
    }
  }
];

export const INITIAL_POSTS: LegalPost[] = [
  {
    id: 'post-1',
    authorId: 'user-eleanor-vance',
    authorName: 'Eleanor Vance, Esq.',
    authorTitle: 'Senior Partner, Appellate Litigation',
    authorFirm: 'Sterling & Vance LLP',
    authorRole: 'lawyer',
    authorVerification: 'verified',
    category: 'Legal Analysis',
    caseCitation: 'In re Algorithmic Pricing Antitrust Litig., No. 24-1849 (2d Cir. 2026)',
    content: `The Second Circuit's ruling yesterday in the algorithmic pricing litigation marks a critical turning point for Section 1 jurisprudence.\n\nThe panel held that an intermediary algorithm calculating dynamic market clearing prices across horizontal competitors cannot bypass Sherman Act scrutiny simply by pleading unilateral adoption of third-party software. The court rejected the defense that absence of explicit bilateral communications between competitors precludes finding a "conscious commitment to a common scheme."\n\nPractitioners advising SaaS vendors and enterprise clients should immediately audit whether client-side pricing constraints share algorithmic inputs that pool confidential non-public pricing data. The standard for circumstantial tacit collusion has meaningfully tightened in the Second Circuit.`,
    tags: ['Antitrust', 'ShermanAct', 'AlgorithmicPricing', 'SecondCircuit', 'AppellatePractice'],
    reactions: {
      'user-marcus-chen': 'insightful',
      'user-david-oconnor': 'helpful',
      'user-sarah-mansoor': 'agree',
    },
    comments: [
      {
        id: 'comm-1',
        postId: 'post-1',
        authorId: 'user-marcus-chen',
        authorName: 'Marcus Chen, Esq.',
        authorTitle: 'Chief Legal Officer',
        authorFirm: 'NexaSpatial Labs',
        authorVerification: 'verified',
        content: 'Spot on, Eleanor. In-house tech teams often treat multi-tenant ML models as purely optimization pipelines without realizing that the data-pooling architecture can create horizontal information sharing liabilities under antitrust law. We have put strict differential privacy safeguards in our enterprise licensing.',
        createdAt: '2026-09-22T14:20:00Z',
        likes: ['user-eleanor-vance']
      }
    ],
    sharesCount: 38,
    createdAt: '2026-09-22T13:10:00Z',
    isPinned: true,
  },
  {
    id: 'post-2',
    authorId: 'user-sarah-mansoor',
    authorName: 'Sarah Al-Mansoor, FCIArb',
    authorTitle: 'Partner, International Arbitration',
    authorFirm: 'Crescent Arbitration Chambers',
    authorRole: 'lawyer',
    authorVerification: 'verified',
    category: 'Case Precedent',
    caseCitation: 'ZF Automotive US, Inc. v. Luxshare, Ltd., 596 U.S. 619 (clarification context)',
    content: `Following recent post-ZF Automotive developments, arbitral tribunals seated outside the United States are seeing a significant shift in evidentiary protocols.\n\nBecause 28 U.S.C. § 1782 discovery is unavailable for purely private foreign arbitral bodies, parties are now incorporating bespoke IBA Rules on the Taking of Evidence directly into their arbitral terms of reference at the Case Management Conference (CMC) stage.\n\nKey recommendation for transactional counsel drafting multi-jurisdictional dispute clauses: expressly delineate third-party document production mechanisms and document preservation sanctions within the arbitration clause itself.`,
    tags: ['Arbitration', 'Section1782', 'IBARules', 'CrossBorderLitigation', 'ICCArbitration'],
    reactions: {
      'user-eleanor-vance': 'precedent',
      'user-david-oconnor': 'insightful'
    },
    comments: [],
    sharesCount: 22,
    createdAt: '2026-09-21T09:45:00Z'
  },
  {
    id: 'post-3',
    authorId: 'user-marcus-chen',
    authorName: 'Marcus Chen, Esq.',
    authorTitle: 'Chief Legal Officer & General Counsel',
    authorFirm: 'NexaSpatial Labs',
    authorRole: 'lawyer',
    authorVerification: 'verified',
    category: 'Practice Query',
    content: `Colleagues in Corporate and Delaware Chancery practice: We are observing an uptick in Section 220 books and records inspection demands premised on corporate ESG and AI compliance disclosures made in voluntary 10-K risk factor statements.\n\nUnder recent AmerisourceBergen standards, what thresholds are Chancery courts currently requiring for a stockholder to show a "credible basis" from which mismanagement can be inferred, when the board has instituted formal AI ethics steering committee minutes? Happy to exchange insights with practitioners handling current Chancery motions to dismiss.`,
    tags: ['DelawareChancery', 'CorporateGovernance', 'Section220', 'BoardOversight', 'CaremarkDuty'],
    reactions: {
      'user-david-oconnor': 'helpful',
      'user-eleanor-vance': 'agree'
    },
    comments: [
      {
        id: 'comm-2',
        postId: 'post-3',
        authorId: 'user-david-oconnor',
        authorName: 'David O\'Connor',
        authorTitle: 'Senior Associate',
        authorFirm: 'Sullivan & Green LLP',
        authorVerification: 'pending',
        content: 'Vice Chancellor Laster touched on this recently. If the board minutes document formal recurring review of the committee reports, Chancery has generally rejected fishing expeditions seeking internal emails/Slack communications under Section 220, confining production solely to formal board-level materials.',
        createdAt: '2026-09-20T16:30:00Z',
        likes: ['user-marcus-chen']
      }
    ],
    sharesCount: 15,
    createdAt: '2026-09-20T15:00:00Z'
  },
  {
    id: 'post-4',
    authorId: 'user-apex-counsel',
    authorName: 'Apex Counsel Global LLP',
    authorTitle: 'Legal Organization',
    authorFirm: 'Apex Counsel Global LLP',
    authorRole: 'organization',
    authorVerification: 'verified',
    category: 'Professional Article',
    content: `Apex Counsel Global has published our Q3 2026 Global M&A Regulatory & Foreign Direct Investment (FDI) Horizon Report.\n\nWith increased scrutiny from CFIUS in the United States and the EU Foreign Subsidies Regulation (FSR), transaction timelines now require pre-notification clearances averaging 6.8 months. We outline deal structuring provisions including ticking fees, reverse break-up fee allocation, and hell-or-high-water covenants tailored for technology and critical infrastructure acquisitions.`,
    tags: ['MergersAndAcquisitions', 'FDI', 'CFIUS', 'ForeignSubsidiesRegulation', 'CrossBorderDealmaking'],
    reactions: {
      'user-eleanor-vance': 'insightful',
      'user-marcus-chen': 'helpful'
    },
    comments: [],
    sharesCount: 45,
    createdAt: '2026-09-19T11:20:00Z'
  }
];

export const INITIAL_COMMUNITIES: Community[] = [
  {
    id: 'comm-corp-ma',
    name: 'Corporate M&A & Private Equity',
    slug: 'corporate-ma-pe',
    category: 'Corporate & Finance',
    description: 'A serious peer community for transactional attorneys, M&A partners, and in-house deal counsel examining purchase agreements, representations & warranties insurance, and regulatory clearances.',
    guidelines: 'Discussions must be analytical and adhere strictly to attorney-client privilege. No sharing of non-public transaction data or unannounced deal disclosures.',
    moderatorId: 'user-eleanor-vance',
    membersCount: 1420,
    postsCount: 384,
    isPrivate: false,
    memberIds: ['user-eleanor-vance', 'user-david-oconnor', 'user-marcus-chen'],
    bannerAccent: 'from-slate-900 to-amber-950/40',
  },
  {
    id: 'comm-tech-ip',
    name: 'Technology, AI & Intellectual Property',
    slug: 'tech-ai-ip',
    category: 'Intellectual Property',
    description: 'Focusing on patent litigation, trade secrets, software licensing, cross-border data sovereignty, and emerging legal doctrine governing machine learning systems.',
    guidelines: 'Focus on statutory interpretation, case analysis, and practical transactional standards.',
    moderatorId: 'user-marcus-chen',
    membersCount: 2150,
    postsCount: 612,
    isPrivate: false,
    memberIds: ['user-marcus-chen', 'user-eleanor-vance'],
    bannerAccent: 'from-slate-900 to-cyan-950/40',
  },
  {
    id: 'comm-appellate-scotus',
    name: 'Constitutional, Appellate & Supreme Court',
    slug: 'appellate-constitutional',
    category: 'Appellate & Litigation',
    description: 'Forum for federal circuit and Supreme Court advocates analyzing certiorari petitions, circuit splits, oral argument preparations, and amicus briefing strategy.',
    guidelines: 'Maintain respectful, scholarly, and rigorous debate grounded in statutory text and constitutional jurisprudence.',
    moderatorId: 'user-eleanor-vance',
    membersCount: 980,
    postsCount: 290,
    isPrivate: false,
    memberIds: ['user-eleanor-vance'],
    bannerAccent: 'from-slate-900 to-indigo-950/40',
  },
  {
    id: 'comm-intl-arbitration',
    name: 'International Commercial Arbitration',
    slug: 'intl-commercial-arbitration',
    category: 'Dispute Resolution',
    description: 'Cross-border dispute practitioners covering UNCITRAL, ICC, LCIA, SIAC, ICSID arbitrations and the enforcement of foreign arbitral awards under the New York Convention.',
    guidelines: 'Dedicated to comparative international law and practical tribunal management.',
    moderatorId: 'user-sarah-mansoor',
    membersCount: 1120,
    postsCount: 340,
    isPrivate: false,
    memberIds: ['user-sarah-mansoor', 'user-eleanor-vance'],
    bannerAccent: 'from-slate-900 to-emerald-950/40',
  },
  {
    id: 'comm-white-collar',
    name: 'White-Collar Defense & Regulatory Enforcement',
    slug: 'white-collar-defense',
    category: 'Litigation & Regulatory',
    description: 'DOJ investigations, SEC enforcement, FCPA compliance, internal corporate investigations, and sanctions defense.',
    guidelines: 'Strict adherence to professional confidentiality and ethics codes.',
    moderatorId: 'user-eleanor-vance',
    membersCount: 840,
    postsCount: 215,
    isPrivate: true,
    memberIds: ['user-eleanor-vance', 'user-sarah-mansoor'],
    bannerAccent: 'from-slate-900 to-rose-950/40',
  }
];

export const INITIAL_JOBS: LegalJob[] = [
  {
    id: 'job-1',
    organizationId: 'user-apex-counsel',
    organizationName: 'Apex Counsel Global LLP',
    title: 'Senior M&A & Private Equity Associate',
    practiceArea: 'Corporate & M&A',
    employmentType: 'Full-time Associate',
    experienceRequired: '4-7 years',
    location: 'New York, NY (Hybrid)',
    isRemoteFriendly: true,
    salaryRange: '$345,000 - $390,000 + Cravath-Scale Bonus',
    description: 'Apex Counsel Global LLP is seeking an exceptional senior associate to join our premier Manhattan transactional group. The candidate will manage buy-side and sell-side acquisitions, negotiate primary transaction documents, and supervise junior associates on diligence pipelines.',
    keyResponsibilities: [
      'Draft and negotiate stock purchase agreements, asset purchase agreements, and merger agreements',
      'Manage regulatory antitrust filings and closing checklists for middle-market to large-cap transactions',
      'Coordinate with specialist groups including tax, executive compensation, and IP'
    ],
    requirements: [
      'J.D. from an accredited top-tier law school with superior academic credentials',
      '4 to 7 years of sophisticated transactional experience in an AmLaw 100 law firm',
      'Strong client-facing skills and demonstrated deal management ability'
    ],
    barRequirements: 'Active admission to the New York State Bar in good standing is mandatory.',
    applicationDeadline: '2026-10-31',
    applicantsCount: 14,
    status: 'active',
    createdAt: '2026-09-15T10:00:00Z',
  },
  {
    id: 'job-2',
    organizationId: 'user-apex-counsel',
    organizationName: 'NexaSpatial Technologies',
    title: 'Director of Legal & Regulatory Compliance (AI / Data)',
    practiceArea: 'Technology Law',
    employmentType: 'General Counsel',
    experienceRequired: '7-10 years',
    location: 'San Francisco, CA or Remote (US)',
    isRemoteFriendly: true,
    salaryRange: '$280,000 - $320,000 + 0.25% Equity',
    description: 'Reporting directly to the Chief Legal Officer, you will architect our worldwide compliance framework for enterprise AI foundation models, data licensing agreements, and federal regulatory inquiries.',
    keyResponsibilities: [
      'Lead global enterprise data licensing and model training intellectual property clearances',
      'Advise engineering and product leads on EU AI Act conformity assessments and FTC guidance',
      'Draft and review major OEM and enterprise distribution agreements'
    ],
    requirements: [
      'J.D. and active member of at least one U.S. state bar',
      'Extensive experience with software licensing, open source licenses, and copyright / patent defense',
      'Prior in-house tech or Tier 1 tech transactions law firm experience'
    ],
    barRequirements: 'Active Bar admission in California, Washington, or New York.',
    applicationDeadline: '2026-11-15',
    applicantsCount: 21,
    status: 'active',
    createdAt: '2026-09-18T14:30:00Z',
  },
  {
    id: 'job-3',
    organizationId: 'user-apex-counsel',
    organizationName: 'Beacon Chambers & Partners',
    title: 'Partner Track Counsel - Appellate & Complex Commercial',
    practiceArea: 'Appellate & Complex Litigation',
    employmentType: 'Partner Track',
    experienceRequired: '8+ years',
    location: 'Washington, DC',
    isRemoteFriendly: false,
    salaryRange: '$400,000 - $475,000 + Equity Participation',
    description: 'Beacon Chambers invites inquiries from accomplished litigators with substantial federal appellate briefing and oral argument experience. This position is structured with a formal 24-month path to equity partnership.',
    keyResponsibilities: [
      'First-chair appellate arguments before federal circuit courts of appeal',
      'Author merits briefs and amicus curiae briefs before the Supreme Court of the United States',
      'Cultivate institutional client relationships in government investigations and administrative law disputes'
    ],
    requirements: [
      'Distinguished federal judicial clerkship (Circuit Court or Supreme Court preferred)',
      'Substantial track record of brief writing and oral argument',
      'Portable book of business or demonstrated high origination potential'
    ],
    barRequirements: 'Admitted to the District of Columbia Bar and federal appellate bars.',
    applicationDeadline: '2026-12-01',
    applicantsCount: 6,
    status: 'active',
    createdAt: '2026-09-20T08:00:00Z',
  }
];

export const INITIAL_EVENTS: LegalEvent[] = [
  {
    id: 'event-1',
    title: '2026 Annual Symposium on Cross-Border Commercial Arbitration',
    organizer: 'Chartered Institute of Arbitrators & LexJurist Forum',
    format: 'Hybrid CLE',
    cleCredits: 4.5,
    practiceArea: 'International Arbitration',
    startDate: '2026-10-15',
    startTime: '09:00 AM EST',
    endDate: '2026-10-15',
    endTime: '04:30 PM EST',
    locationOrUrl: 'The Harold Pratt House, New York / Live Broadcast',
    description: 'An advanced full-day symposium addressing modern challenges in bilateral investment treaties, witness examination standards in digital evidentiary hearings, and post-award enforcement under the New York Convention across emerging markets.',
    speakers: ['Sarah Al-Mansoor, FCIArb', 'Prof. Julian Lew, KC', 'Hon. Arthur Sterling'],
    attendeesCount: 312,
    attendeeIds: ['user-eleanor-vance', 'user-sarah-mansoor'],
    maxAttendees: 500,
    registrationFee: 'Complimentary for Verified Members',
    registrationOpen: true,
  },
  {
    id: 'event-2',
    title: 'U.S. Supreme Court October 2026 Term: Precedent & Docket Preview',
    organizer: 'LexJurist Appellate Advocacy Committee',
    format: 'Webinar',
    cleCredits: 2.0,
    practiceArea: 'Appellate & Constitutional Law',
    startDate: '2026-10-06',
    startTime: '01:00 PM EST',
    endDate: '2026-10-06',
    endTime: '03:00 PM EST',
    locationOrUrl: 'LexJurist Virtual Moot Chambers (Video Conference)',
    description: 'A comprehensive preview of granted certiorari petitions covering major questions doctrine, federal administrative agency adjudication, and constitutional challenges to interstate data regulation.',
    speakers: ['Eleanor Vance, Esq.', 'Dean Pamela Karlan', 'Paul Clement'],
    attendeesCount: 640,
    attendeeIds: ['user-eleanor-vance', 'user-david-oconnor', 'user-marcus-chen'],
    maxAttendees: 1000,
    registrationFee: 'Free for LexJurist Members',
    registrationOpen: true,
  },
  {
    id: 'event-3',
    title: 'AI Governance, Data Provenance, and the Work-Product Doctrine (CLE Ethics)',
    organizer: 'NexaSpatial Legal & Tech Bar Institute',
    format: 'Webinar',
    cleCredits: 1.5,
    practiceArea: 'Legal Ethics & Technology',
    startDate: '2026-10-22',
    startTime: '12:00 PM PST',
    endDate: '2026-10-22',
    endTime: '01:30 PM PST',
    locationOrUrl: 'LexJurist Video Interactive Stream',
    description: 'Explores ABA Formal Opinion 512 and state bar ethics requirements regarding generative model utilization, safeguarding confidential client documents, and avoiding inadvertent waiver of attorney-client privilege.',
    speakers: ['Marcus Chen, Esq.', 'Ethics Counsel Maria Santos'],
    attendeesCount: 485,
    attendeeIds: ['user-marcus-chen'],
    maxAttendees: 800,
    registrationFee: 'Free for Verified Attorneys',
    registrationOpen: true,
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-eleanor-marcus',
    participantIds: ['user-eleanor-vance', 'user-marcus-chen'],
    lastMessage: {
      id: 'msg-3',
      senderId: 'user-marcus-chen',
      recipientId: 'user-eleanor-vance',
      content: 'I reviewed the draft amicus brief. The analysis on Section 1 algorithmic intent is very persuasive. I have added two citations regarding computational pooling to Section II.',
      createdAt: '2026-09-22T16:45:00Z',
      read: true,
    },
    unreadCount: {
      'user-eleanor-vance': 0,
      'user-marcus-chen': 0,
    },
    updatedAt: '2026-09-22T16:45:00Z',
  }
];

export const INITIAL_MESSAGES: DirectMessage[] = [
  {
    id: 'msg-1',
    senderId: 'user-eleanor-vance',
    recipientId: 'user-marcus-chen',
    content: 'Marcus, hope you are well. Are you attending the Second Circuit symposium next month? We are presenting on the new data pooling rulings.',
    createdAt: '2026-09-22T15:00:00Z',
    read: true,
  },
  {
    id: 'msg-2',
    senderId: 'user-marcus-chen',
    recipientId: 'user-eleanor-vance',
    content: 'Hi Eleanor! Yes, I will be in New York for that. Let us set aside 30 minutes to review the amicus outline before the filing deadline.',
    createdAt: '2026-09-22T15:30:00Z',
    read: true,
  },
  {
    id: 'msg-3',
    senderId: 'user-marcus-chen',
    recipientId: 'user-eleanor-vance',
    content: 'I reviewed the draft amicus brief. The analysis on Section 1 algorithmic intent is very persuasive. I have added two citations regarding computational pooling to Section II.',
    createdAt: '2026-09-22T16:45:00Z',
    read: true,
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    userId: 'user-eleanor-vance',
    type: 'reaction',
    title: 'Insightful reaction on your analysis',
    description: 'Marcus Chen, Esq. marked your Second Circuit antitrust post as insightful.',
    link: '/home',
    read: false,
    createdAt: '2026-09-22T14:00:00Z',
  },
  {
    id: 'notif-2',
    userId: 'user-eleanor-vance',
    type: 'connection_request',
    title: 'New Connection Request',
    description: 'David O\'Connor (Sullivan & Green LLP) requested to connect with you.',
    link: '/connections',
    read: false,
    createdAt: '2026-09-21T11:15:00Z',
  },
  {
    id: 'notif-3',
    userId: 'user-eleanor-vance',
    type: 'verification',
    title: 'Bar License Verification Approved',
    description: 'Your New York State Bar admission credentials have been verified with active status.',
    link: '/profile',
    read: true,
    createdAt: '2025-01-12T10:00:00Z',
  }
];

export const INITIAL_VERIFICATION_REQUESTS: LawyerVerificationRequest[] = [
  {
    id: 'verif-req-1',
    userId: 'user-david-oconnor',
    fullName: 'David O\'Connor',
    email: 'david.oconnor@sullivangreen.law',
    barCouncil: 'Illinois Attorney Registration & Disciplinary Commission (ARDC)',
    jurisdiction: 'Illinois',
    licenseNumber: 'IL-6348910',
    admissionYear: 2020,
    firmName: 'Sullivan & Green LLP',
    documentSummary: 'State Bar Certificate of Good Standing (Issued August 2026) & Firm Email Authentication',
    status: 'pending',
    submittedAt: '2026-09-18T12:00:00Z',
  },
  {
    id: 'verif-req-2',
    userId: 'user-eleanor-vance',
    fullName: 'Eleanor Vance, Esq.',
    email: 'eleanor.vance@sterlingvance.law',
    barCouncil: 'New York State Unified Court System',
    jurisdiction: 'New York (First Dept.)',
    licenseNumber: 'NY-4892103',
    admissionYear: 2008,
    firmName: 'Sterling & Vance LLP',
    documentSummary: 'Official Appellate Division Certificate of Admission & Good Standing',
    status: 'verified',
    submittedAt: '2025-01-10T09:00:00Z',
    reviewedBy: 'Hon. Arthur Sterling (Admin)',
    reviewedAt: '2025-01-12T10:00:00Z',
    adminNotes: 'Confirmed in official NY Court system registry. Active in good standing.'
  }
];

export const INITIAL_REPORTS: ModerationReport[] = [
  {
    id: 'rep-1',
    reporterId: 'user-eleanor-vance',
    reporterName: 'Eleanor Vance, Esq.',
    targetType: 'post',
    targetId: 'post-unverified-test',
    targetTitle: 'Questionable solicitation post claiming guaranteed court outcomes',
    reason: 'Ethics Violation',
    explanation: 'Contains improper guarantees of trial results, which violates Model Rule of Professional Conduct 7.1 regarding misleading advertising.',
    status: 'pending',
    createdAt: '2026-09-22T10:00:00Z'
  }
];
