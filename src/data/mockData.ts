import { EventItem, JournalArticle, ResourceItem, FacultyMember, ConsultationRequest, PaperSubmission, ContactMessage } from '../types';

export const INITIAL_FACULTY: FacultyMember[] = [
  {
    id: 'fac-1',
    name: 'Anas Hudawi Nellikkuth',
    title: 'Head of Department (HOD)',
    qualification: 'P.G. in Economics, Calicut University',
    specialization: 'Islamic Economics & Finance, Applied Banking Operations & Public Training Leadership',
    status: 'Head of Department',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    emailPlaceholder: 'islamiceco@darulhudaiu.ac.in',
    phone: '+91 81295 95547'
  },
  {
    id: 'fac-2',
    name: 'Dr. K.P. Jafar Hudawi Kolathur',
    title: 'Dean of Kulliyya of Sharia',
    qualification: 'Ph.D. in Arabic',
    specialization: 'Classical Jurisprudence, Sharia Frameworks & Curricular Systematization',
    status: 'Dean, Kulliyya of Sharia (Former HOD)',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    emailPlaceholder: 'islamiceco@darulhudaiu.ac.in',
    phone: '+91 99462 92164'
  },
  {
    id: 'fac-3',
    name: 'Dr. Rasheed',
    title: 'Faculty Member',
    qualification: 'Ph.D. in Economics, Calicut University',
    specialization: 'Comparative Economic Systems, Quantitative Analysis & Monetary Economics',
    status: 'Faculty Member',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    emailPlaceholder: 'islamiceco@darulhudaiu.ac.in',
    phone: 'Contact Secretariat'
  },
  {
    id: 'fac-4',
    name: 'K.C. Muhammed Baqawi',
    title: 'Founding Department Leader',
    qualification: 'Scholar of Islamic Sciences & Classical Jurisprudence',
    specialization: 'Fiqh al-Mu’amalat Foundations & Economic Behavior in Islam',
    status: 'Founding Legacy Leader',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    emailPlaceholder: 'islamiceco@darulhudaiu.ac.in'
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'ev-1',
    title: 'National Seminar on Contemporary Fiqh al-Mu’amalat and Digital Assets',
    category: 'Seminars',
    date: 'December 12, 2026',
    year: 2026,
    time: '09:30 AM – 04:30 PM IST',
    venue: 'Department Seminar Hall, Academic Block, DHIU Campus',
    description: 'A scholarly examination of tokenized assets, decentralized finance (DeFi), and Central Bank Digital Currencies (CBDC) under classical Islamic contract jurisprudence.',
    fullDetails: 'The symposium will convene researchers, scholars of Islamic jurisprudence, and financial technologists to debate the Shariah parameters of digital tokens, fungibility, and asset-backing under Maqasid al-Shariah.',
    speakerPlaceholder: '[Keynote: Visiting Scholar in Islamic Jurisprudence & Financial Law]',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
    isUpcoming: true
  },
  {
    id: 'ev-2',
    title: 'Workshop on Shariah Screening Methodologies for Contemporary Equities',
    category: 'Workshops',
    date: 'November 24, 2026',
    year: 2026,
    time: '10:00 AM – 01:30 PM IST',
    venue: 'DHIB Financial Literacy Lab, Room 204',
    description: 'Hands-on quantitative workshop for postgraduate researchers evaluating AAOIFI and global Shariah screening financial ratios on listed equities.',
    fullDetails: 'Participants will practice analyzing balance sheets, debt-to-market-capitalization thresholds, non-permissible income purification, and dividend cleansing calculations.',
    speakerPlaceholder: '[Workshop Facilitator: Certified Shariah Financial Analyst]',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    isUpcoming: true
  },
  {
    id: 'ev-3',
    title: 'Annual Conference on Islamic Social Finance, Awqaf & Ethical Micro-Enterprise',
    category: 'Conferences',
    date: 'October 15, 2026',
    year: 2026,
    time: '09:00 AM – 05:00 PM IST',
    venue: 'Central Auditorium, Darul Huda Islamic University',
    description: 'Scholarly gathering addressing Waqf revitalisation, Zakat-backed educational endowments, and community micro-finance initiatives in South Asia.',
    fullDetails: 'Peer-reviewed papers will be presented across four plenary sessions focusing on legal governance of institutional endowments, digital cash waqf platforms, and empirical poverty alleviation models.',
    speakerPlaceholder: '[Plenary Panel: Academic Researchers & Community Waqf Trustees]',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    isUpcoming: false
  },
  {
    id: 'ev-4',
    title: 'Guest Lecture: Risk Sharing Architecture vs. Debt-Based Intermediation',
    category: 'Guest Lectures',
    date: 'August 28, 2026',
    year: 2026,
    time: '02:00 PM – 04:00 PM IST',
    venue: 'Virtual & Hybrid Seminar Room B',
    description: 'Distinguished lecture analyzing the macroeconomic stability properties of Mudarabah and Musharakah partnerships versus conventional credit cycles.',
    fullDetails: 'Exploring contemporary empirical literature on macroprudential regulation and systemic risk in dual banking economies.',
    speakerPlaceholder: '[Guest Speaker: Senior Economist, Islamic Financial Services Research]',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    isUpcoming: false
  },
  {
    id: 'ev-5',
    title: 'Student Field Practice: Rural Cooperative & Micro-Takaful Case Study',
    category: 'Student Activities',
    date: 'July 14, 2026',
    year: 2026,
    time: 'Full Day Immersion',
    venue: 'Field Study / Cooperative Society Visits, Malappuram District',
    description: 'Department students engaging with grassroots interest-free credit societies to study mutual aid models and grassroots fund administration.',
    fullDetails: 'Students documented bookkeeping protocols, mutual guarantee funds, and ethical oversight mechanisms employed in local mutual aid institutions.',
    speakerPlaceholder: '[Faculty Field Supervisors & Community Liaison]',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    isUpcoming: false
  },
  {
    id: 'ev-6',
    title: 'SBC Round-Table: Ethical Shariah Guidance for Emerging Tech Startups',
    category: 'Research Events',
    date: 'June 05, 2026',
    year: 2026,
    time: '11:00 AM – 03:00 PM IST',
    venue: 'Conference Room 3, Academic Block',
    description: 'Shariah Business Consultancy convening young entrepreneurs to clarify Shariah commercial rules in SaaS contracts, revenue sharing, and equity vesting.',
    fullDetails: 'Discussions covered Ju’alah (performance reward) structures, Murabaha procurement financing, and avoiding Jahalah (contract ambiguity) in software deliverables.',
    speakerPlaceholder: '[SBC Advisory Panelists]',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    isUpcoming: false
  }
];

export const INITIAL_ARTICLES: JournalArticle[] = [];

export const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: 'res-cfsei',
    title: 'CFSEI Working Model: Sustainable Financial Framework for Free Educational Institutions via Waqf, Zakat & Sadaqah',
    category: 'Research Papers',
    author: 'Center for Financial Sustainability of Educational Institutions (CFSEI)',
    year: 2026,
    fileType: 'PDF',
    fileSize: '2.8 MB',
    language: 'English',
    description: 'Flagship research initiative developing sustainable endowment and social finance models for free educational institutions under Kulliyya of Sharia, DHIU.'
  },
  {
    id: 'res-cpet',
    title: 'CPET Course Guide: Diploma in Islamic Finance, Zakat Management & Ethical Investment',
    category: 'Lecture Materials',
    author: 'Centre for Public Education and Training (CPET) & DIEF',
    year: 2026,
    fileType: 'PDF',
    fileSize: '1.9 MB',
    language: 'English & Arabic',
    description: 'Public-facing professional training syllabus covering Sharia-compliant transactions, business ethics, and practical Zakat computation.'
  },
  {
    id: 'res-1',
    title: 'Curricular Reference Guide: Foundations of Islamic Jurisprudence of Financial Contracts (Fiqh al-Mu’amalat)',
    category: 'Islamic Economics Resources',
    author: 'Department Academic Curriculum Committee',
    year: 2026,
    fileType: 'PDF',
    fileSize: '2.4 MB',
    language: 'English & Arabic terminology',
    description: 'Core reference module outlining legal maxims (Al-Qawa’id al-Fiqhiyyah), conditions of offer and acceptance (Ijab wa Qabul), and non-permissible contractual stipulations.'
  },
  {
    id: 'res-2',
    title: 'DHIB Primer: Fundamental Principles of Non-Interest Banking & Risk-Sharing Models',
    category: 'Islamic Finance Resources',
    author: 'DHIB Financial Literacy Working Group',
    year: 2026,
    fileType: 'PDF',
    fileSize: '1.8 MB',
    language: 'English',
    description: 'An educational primer comparing debt-intermediation banking against participatory models (Musharakah, Mudarabah, Murabaha, and Ijarah).'
  },
  {
    id: 'res-3',
    title: 'SBC Introductory Advisory Framework for Commercial Enterprises and Ethical Ventures',
    category: 'Books and Reading Materials',
    author: 'Shariah Business Consultancy Unit',
    year: 2026,
    fileType: 'PDF',
    fileSize: '3.1 MB',
    language: 'English',
    description: 'A structured orientation for business leaders, outlining ethical compliance checklists, transparent customer contracts, and permissible merchant financing.'
  },
  {
    id: 'res-4',
    title: 'Tamweel Editorial Guidelines, Peer-Review Protocols and Manuscript Preparation Kit',
    category: 'Journal Publications',
    author: 'Tamweel Editorial Board Secretariat',
    year: 2026,
    fileType: 'PDF',
    fileSize: '950 KB',
    language: 'English',
    description: 'Official manuscript formatting instructions, Chicago citation manual with Arabic transliteration tables, and ethical declaration disclosures.'
  },
  {
    id: 'res-5',
    title: 'Working Paper Series No. 04: Sukuk Defaults and Restructuring Case Studies',
    category: 'Research Papers',
    author: 'Department Research Cell',
    year: 2025,
    fileType: 'PDF',
    fileSize: '1.5 MB',
    language: 'English',
    description: 'Comparative case review evaluating legal enforceability of purchase undertakings in international Sukuk defaults.'
  },
  {
    id: 'res-6',
    title: 'Lecture Note Series: Introduction to Micro-Takaful and Mutual Guarantee Structures',
    category: 'Lecture Materials',
    author: 'Faculty of Islamic Economics',
    year: 2025,
    fileType: 'PDF',
    fileSize: '1.2 MB',
    language: 'English',
    description: 'Lecture slides and notes breaking down Ta’awun (cooperative mutual protection), Tabarru (donation fund), and surplus distribution principles.'
  }
];

export const INITIAL_CONSULTATIONS: ConsultationRequest[] = [
  {
    id: 'sbc-req-101',
    name: 'Ahmed K. V.',
    email: 'ahmed.kv@alnoorenterprise.com',
    organization: 'Al Noor Organic Agro Pvt Ltd',
    areaOfEnquiry: 'Supply Chain Financing (Murabaha/Salam Contracts)',
    projectScope: 'Structuring Shariah-compliant seasonal working capital procurement with local producers.',
    message: 'We are seeking guidance on whether our proposed deferred-payment forward procurement mechanism aligns with Bay’ al-Salam principles.',
    submittedAt: '2026-11-01 11:20 AM',
    status: 'Pending Review'
  },
  {
    id: 'sbc-req-102',
    name: 'Fathima Zehra',
    email: 'fathima@edutechcrescent.in',
    organization: 'Crescent EduSolutions',
    areaOfEnquiry: 'Employee Stock Options & Revenue Share Agreement',
    projectScope: 'Review of Ju’alah and Mudarabah arrangements for our software engineering team.',
    message: 'We want to structure performance-based compensation without crossing into prohibited speculative stipulations.',
    submittedAt: '2026-10-28 03:45 PM',
    status: 'In Discussion'
  }
];

export const INITIAL_SUBMISSIONS: PaperSubmission[] = [
  {
    id: 'sub-2026-08',
    title: 'Evaluating Zakat Distribution Efficiency via Distributed Ledger Platforms: A Subcontinental Study',
    authors: 'Dr. M. Haris & T. N. Suhail',
    correspondingEmail: 'haris.research@academic.edu.in',
    affiliation: 'School of Social & Economic Sciences',
    track: 'Islamic Social Finance & Awqaf',
    abstractText: 'This empirical study surveys 42 community welfare bodies utilizing distributed ledger tracking for zakat disbursement to investigate leakages and administrative overhead.',
    keywords: 'Zakat, Blockchain, Transparency, Social Welfare, Poverty Metrics',
    fileName: 'tamweel_manuscript_haris_zakat_2026.pdf',
    submittedAt: '2026-10-30 02:15 PM',
    status: 'Under Review'
  }
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-01',
    name: 'Muhammed Anas',
    email: 'anas.m@student.dhiu.in',
    category: 'Academic Enquiry',
    subject: 'Enquiry regarding Postgraduate Research Admission & Syllabi',
    message: 'Assalamu Alaikum, I would like to inquire regarding the upcoming semester research focus areas and entrance reading lists in Islamic Banking.',
    submittedAt: '2026-11-03 09:14 AM'
  }
];
