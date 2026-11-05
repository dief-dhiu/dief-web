import React, { useState } from 'react';
import { PageId, JournalArticle, PaperSubmission } from '../types';
import { 
  BookOpen, 
  FileText, 
  Download, 
  Share2, 
  Copy, 
  Search, 
  CheckCircle2, 
  Upload, 
  Users, 
  ShieldCheck, 
  Award,
  ChevronRight,
  ExternalLink,
  Info,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { IslamicStarIcon } from '../components/IslamicPattern';

interface TamweelPageProps {
  onNavigate: (page: PageId) => void;
  articles: JournalArticle[];
  selectedArticleId?: string;
  onSubmitPaper: (paper: Omit<PaperSubmission, 'id' | 'submittedAt' | 'status'>) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const TamweelPage: React.FC<TamweelPageProps> = ({
  onNavigate,
  articles,
  selectedArticleId,
  onSubmitPaper,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'info' | 'submit'>('articles');
  const [infoSubTab, setInfoSubTab] = useState<'aims' | 'board' | 'policy' | 'review' | 'ethics' | 'guidelines'>('aims');
  
  // Article filter & search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticleModal, setActiveArticleModal] = useState<JournalArticle | null>(
    selectedArticleId ? articles.find(a => a.id === selectedArticleId) || null : null
  );

  // Submission Form State
  const [authorName, setAuthorName] = useState('');
  const [correspondingEmail, setCorrespondingEmail] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [paperTitle, setPaperTitle] = useState('');
  const [track, setTrack] = useState('Fiqh al-Mu’amalat & Legal Foundations');
  const [abstractText, setAbstractText] = useState('');
  const [keywords, setKeywords] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [k: string]: string }>({});

  const categories = ['All', ...Array.from(new Set(articles.map(a => a.category)))];

  const filteredArticles = articles.filter(a => {
    const matchesCategory = selectedCategory === 'All' || a.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleCopyCitation = (article: JournalArticle) => {
    const citation = `${article.authors.join(', ')} (${article.year}). "${article.title}." Tamweel: Journal of Islamic Economics and Finance, ${article.volume}(${article.issue}), pp. ${article.pages}.`;
    navigator.clipboard?.writeText?.(citation);
    onShowToast('Citation Copied', 'APA / Chicago format citation copied to clipboard.', 'success');
  };

  const handleDownloadPdf = (article: JournalArticle) => {
    onShowToast('PDF Download Triggered', `Downloading preprint for "${article.title}"`, 'success');
  };

  const handleSubmitManuscript = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [k: string]: string } = {};

    if (!authorName.trim()) errors.authorName = 'Author name(s) required';
    if (!correspondingEmail.trim() || !/\S+@\S+\.\S+/.test(correspondingEmail)) errors.correspondingEmail = 'Valid institutional email required';
    if (!paperTitle.trim()) errors.paperTitle = 'Manuscript title required';
    if (!abstractText.trim() || abstractText.length < 50) errors.abstractText = 'Abstract must be at least 50 words';
    if (!keywords.trim()) errors.keywords = 'Keywords are required (comma separated)';
    if (!fileName.trim()) errors.fileName = 'Please attach or select your manuscript document file';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      onSubmitPaper({
        title: paperTitle,
        authors: authorName,
        correspondingEmail,
        affiliation: affiliation || '[Author Academic Affiliation]',
        track,
        abstractText,
        keywords,
        fileName
      });
      setIsSubmitting(false);
      setSubmissionSuccess(true);
      onShowToast(
        'Manuscript Submitted to Tamweel',
        'Your paper has been queued for editorial desk triage and double-blind peer review.',
        'success'
      );
    }, 600);
  };

  return (
    <div className="space-y-16 lg:space-y-20 py-8">
      
      {/* 1. JOURNAL HEADER & INTRODUCTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-forest/15 p-8 sm:p-12 shadow-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-surface-lightGreen/50 rounded-bl-full pointer-events-none -z-0"></div>

          <div className="relative z-10 max-w-4xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest text-gold text-xs font-semibold">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Flagship Journal Platform</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-gold-dark uppercase tracking-widest block font-sans">
                Scholarly Academic Periodical
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-forest tracking-tight">
                Tamweel
              </h1>
              <h2 className="text-xl sm:text-2xl font-editorial text-charcoal font-semibold">
                Journal of Islamic Economics and Finance
              </h2>
              <div className="font-arabic text-lg sm:text-xl text-forest pt-1 font-semibold" dir="rtl">
                مجلة تمويل للاقتصاد والتمويل الإسلامي
              </div>
            </div>

            <p className="text-sm sm:text-base text-charcoal-light leading-relaxed max-w-3xl">
              An open-access, scholarly publication platform produced by the Department of Islamic Economics and Finance at Darul Huda Islamic University. Tamweel promotes rigorous, peer-reviewed theoretical and empirical contributions exploring the interface of classical Shariah jurisprudence and modern economics.
            </p>

            {/* MANDATORY AUTHENTICITY / INDEXING DISCLAIMER */}
            <div className="p-4 rounded-xl bg-ivory border border-forest/15 text-xs text-charcoal-muted flex items-start space-x-3">
              <Info className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
              <div>
                <strong className="text-forest">Publication &amp; Indexing Notice:</strong>
                Tamweel adheres to international Committee on Publication Ethics (COPE) principles.
                <span className="ml-1 text-gold-dark font-medium">[ISSN: Pending official assignment | Directory of Open Access Journals (DOAJ) indexing application in progress].</span>
              </div>
            </div>

            {/* Main Tab Controls */}
            <div className="pt-4 flex flex-wrap gap-3 border-t border-gray-100">
              <button
                onClick={() => setActiveTab('articles')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                  activeTab === 'articles' ? 'bg-forest text-white shadow' : 'bg-surface-lightGreen text-charcoal hover:bg-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-gold" />
                <span>Browse Research Articles ({articles.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('info')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                  activeTab === 'info' ? 'bg-forest text-white shadow' : 'bg-surface-lightGreen text-charcoal hover:bg-white'
                }`}
              >
                <Info className="w-3.5 h-3.5 text-gold" />
                <span>Journal Information &amp; Policies</span>
              </button>

              <button
                onClick={() => setActiveTab('submit')}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                  activeTab === 'submit' ? 'bg-forest text-white shadow' : 'bg-gold/20 text-forest hover:bg-gold hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-gold" />
                <span>Submit Your Paper</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. LATEST ISSUE DISPLAY */}
      {activeTab === 'articles' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-forest rounded-3xl p-8 sm:p-10 text-white border-2 border-gold/40 shadow-elevated">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Cover preview */}
              <div className="lg:col-span-3 flex justify-center">
                <div className="w-48 sm:w-56 bg-forest-dark border-2 border-gold/50 rounded-2xl p-5 shadow-2xl relative aspect-[3/4] flex flex-col justify-between group overflow-hidden">
                  <div className="absolute inset-0 pattern-dark-islamic opacity-40 pointer-events-none"></div>
                  
                  <div className="relative z-10 space-y-1">
                    <span className="text-[9px] font-mono tracking-widest text-gold uppercase block">ISSN [Pending]</span>
                    <h3 className="font-editorial text-2xl font-bold text-white tracking-wide">TAMWEEL</h3>
                    <div className="font-arabic text-xs text-sage-light" dir="rtl">مجلة تمويل</div>
                  </div>

                  <div className="relative z-10 text-center py-4 border-y border-gold/30">
                    <IslamicStarIcon size={32} className="mx-auto text-gold mb-1" />
                    <span className="text-[10px] text-sage-subtle block">Volume 3 • Issue 2</span>
                    <span className="text-[10px] text-gold font-bold">October 2026</span>
                  </div>

                  <div className="relative z-10 text-[9px] text-sage-light flex justify-between">
                    <span>DIEF</span>
                    <span>DHIU Kerala</span>
                  </div>
                </div>
              </div>

              {/* Latest Issue Metadata & Editorial Introduction */}
              <div className="lg:col-span-9 space-y-4">
                <div className="flex items-center space-x-2 text-xs font-bold text-gold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Current Issue • Volume 3, Issue 2 (October 2026)</span>
                </div>

                <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white leading-snug">
                  Special Issue: Theoretical Jurisprudence &amp; Sukuk Structuring in Volatile Markets
                </h3>

                <p className="text-xs sm:text-sm text-sage-subtle leading-relaxed">
                  This issue convenes critical scholarly treatises investigating the application of classical Ribawi rules to fiat money, empirical yields of asset-backed versus asset-based sovereign Sukuk, and decentralized smart contracts under Mudarabah partnership jurisprudence.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onShowToast('Full Issue Download', 'Downloading full-text compiled issue PDF (4.2 MB)...', 'success')}
                    className="px-5 py-2.5 bg-gold hover:bg-gold-light text-forest text-xs font-bold rounded-xl shadow transition flex items-center space-x-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Full Issue (PDF)</span>
                  </button>
                  <span className="text-xs text-sage-light font-mono">
                    Published: October 2026 • 4 Research Articles Included
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* 3. RESEARCH ARTICLES ARCHIVE */}
      {activeTab === 'articles' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Filter and Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-forest/10 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title, author, keyword..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-ivory/50 border border-gray-200 rounded-xl focus:border-forest focus:outline-none"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-forest text-white'
                      : 'bg-surface-lightGreen text-charcoal hover:bg-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* Articles Listing */}
          <div className="space-y-4">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                className="bg-white rounded-2xl border border-forest/10 hover:border-gold/60 p-6 sm:p-7 shadow-soft transition-all space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-gold-dark uppercase tracking-wider bg-gold/15 px-2.5 py-0.5 rounded">
                      {art.category}
                    </span>
                    <span className="text-xs text-charcoal-muted">
                      Vol. {art.volume}, No. {art.issue} ({art.publicationDate})
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-gray-400">
                    {art.doi}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-editorial text-xl font-bold text-forest leading-snug hover:text-emerald-deep transition-colors cursor-pointer"
                    onClick={() => setActiveArticleModal(art)}
                  >
                    {art.title}
                  </h3>

                  <div className="text-xs text-charcoal font-medium">
                    {art.authors.join('; ')}
                  </div>

                  <p className="text-xs text-charcoal-light leading-relaxed line-clamp-3">
                    <strong>Abstract:</strong> {art.abstract}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-charcoal-muted font-bold mr-1">Keywords:</span>
                    {art.keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] bg-surface-lightGreen text-forest px-2 py-0.5 rounded font-medium">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100 text-xs">
                  <div className="text-[11px] text-charcoal-muted">
                    Pages: <strong className="text-charcoal">{art.pages}</strong> • Open Access Article
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleCopyCitation(art)}
                      className="inline-flex items-center space-x-1.5 text-forest hover:text-gold-dark font-medium transition"
                      title="Copy Citation"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Cite</span>
                    </button>

                    <button
                      onClick={() => setActiveArticleModal(art)}
                      className="inline-flex items-center space-x-1.5 text-forest hover:text-emerald-deep font-bold transition"
                    >
                      <span>Read Full Abstract</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => handleDownloadPdf(art)}
                      className="px-3.5 py-1.5 bg-forest hover:bg-emerald-deep text-white font-semibold rounded-lg transition flex items-center space-x-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5 text-gold" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </section>
      )}

      {/* 4. JOURNAL INFORMATION & POLICIES */}
      {activeTab === 'info' && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-forest/15 shadow-soft overflow-hidden">
            
            {/* Info Sub-tabs Header */}
            <div className="bg-ivory border-b border-forest/10 p-4 flex items-center space-x-2 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setInfoSubTab('aims')}
                className={`px-3 py-2 rounded-lg transition ${infoSubTab === 'aims' ? 'bg-forest text-white' : 'text-charcoal hover:bg-white'}`}
              >
                Aims &amp; Scope
              </button>
              <button
                onClick={() => setInfoSubTab('board')}
                className={`px-3 py-2 rounded-lg transition ${infoSubTab === 'board' ? 'bg-forest text-white' : 'text-charcoal hover:bg-white'}`}
              >
                Editorial Board
              </button>
              <button
                onClick={() => setInfoSubTab('policy')}
                className={`px-3 py-2 rounded-lg transition ${infoSubTab === 'policy' ? 'bg-forest text-white' : 'text-charcoal hover:bg-white'}`}
              >
                Editorial Policy
              </button>
              <button
                onClick={() => setInfoSubTab('review')}
                className={`px-3 py-2 rounded-lg transition ${infoSubTab === 'review' ? 'bg-forest text-white' : 'text-charcoal hover:bg-white'}`}
              >
                Double-Blind Peer Review
              </button>
              <button
                onClick={() => setInfoSubTab('ethics')}
                className={`px-3 py-2 rounded-lg transition ${infoSubTab === 'ethics' ? 'bg-forest text-white' : 'text-charcoal hover:bg-white'}`}
              >
                Publication Ethics (COPE)
              </button>
              <button
                onClick={() => setInfoSubTab('guidelines')}
                className={`px-3 py-2 rounded-lg transition ${infoSubTab === 'guidelines' ? 'bg-forest text-white' : 'text-charcoal hover:bg-white'}`}
              >
                Author &amp; Submission Guidelines
              </button>
            </div>

            {/* Sub-tab Content Panels */}
            <div className="p-8 sm:p-12 space-y-6 text-sm text-charcoal-light leading-relaxed">
              
              {infoSubTab === 'aims' && (
                <div className="space-y-4">
                  <h3 className="font-editorial text-2xl font-bold text-forest">Aims &amp; Scope</h3>
                  <p>
                    <strong>Tamweel: Journal of Islamic Economics and Finance</strong> is the official peer-reviewed research journal published by the Department of Islamic Economics and Finance under the Kulliyya of Sharia at Darul Huda Islamic University.
                  </p>
                  <p>
                    As outlined in the Departmental Prospectus, the journal is primarily dedicated to rigorous research, scholarly discussions, and academic contributions in key areas including:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-xs text-charcoal-muted pl-2">
                    <li><strong>Islamic banking systems</strong> and non-interest financial intermediation</li>
                    <li><strong>Halal investment frameworks</strong> and ethical screening models</li>
                    <li><strong>Economic justice through Islamic social finance</strong> (Waqf, Zakat, and Sadaqah)</li>
                    <li><strong>Comparative policy analysis</strong> between conventional and Islamic finance</li>
                  </ul>
                  <div className="p-4 bg-surface-lightGreen/50 rounded-xl border border-forest/10 text-xs">
                    <strong className="text-forest">Frequency:</strong> Bi-annual (May and October Issues) • Open Access Model (No author APC fees) • Supervised by the Department Research Committee.
                  </div>
                </div>
              )}

              {infoSubTab === 'board' && (
                <div className="space-y-4">
                  <h3 className="font-editorial text-2xl font-bold text-forest">Editorial Board</h3>
                  <p className="text-xs text-charcoal-muted">
                    Official academic placeholders adhering to departmental transparency guidelines.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 bg-ivory rounded-xl border border-gray-200">
                      <div className="font-bold text-forest">Editor-in-Chief</div>
                      <div className="text-xs text-charcoal-light">Anas Hudawi Nellikkuth (Head of Department)</div>
                      <div className="text-[11px] text-gold-dark mt-1">P.G. in Economics, Calicut University • DHIU</div>
                    </div>
                    <div className="p-4 bg-ivory rounded-xl border border-gray-200">
                      <div className="font-bold text-forest">Managing Editor</div>
                      <div className="text-xs text-charcoal-light">[Department Research Fellow &amp; Editorial Coordinator]</div>
                      <div className="text-[11px] text-gold-dark mt-1">Darul Huda Islamic University</div>
                    </div>
                    <div className="p-4 bg-ivory rounded-xl border border-gray-200">
                      <div className="font-bold text-forest">Associate Editors (Jurisprudence Track)</div>
                      <div className="text-xs text-charcoal-light">[Distinguished Visiting Scholars in Fiqh al-Mu’amalat — Roster to be updated]</div>
                    </div>
                    <div className="p-4 bg-ivory rounded-xl border border-gray-200">
                      <div className="font-bold text-forest">Associate Editors (Quantitative Finance Track)</div>
                      <div className="text-xs text-charcoal-light">[Empirical Financial Econometricians &amp; Reviewers — Roster to be updated]</div>
                    </div>
                  </div>
                </div>
              )}

              {infoSubTab === 'policy' && (
                <div className="space-y-4">
                  <h3 className="font-editorial text-2xl font-bold text-forest">Editorial Policy</h3>
                  <p>
                    All submissions undergo initial editorial desk triage within 10 days to assess thematic fit, methodological rigor, and adherence to author guidelines. Articles meeting the preliminary threshold are forwarded for double-blind peer review.
                  </p>
                  <p>
                    Tamweel operates on the principle of Open Access, providing unrestricted electronic full-text access immediately upon publication without embargo periods.
                  </p>
                </div>
              )}

              {infoSubTab === 'review' && (
                <div className="space-y-4">
                  <h3 className="font-editorial text-2xl font-bold text-forest">Double-Blind Peer Review Process</h3>
                  <p>
                    To maintain strict objectivity, Tamweel implements a rigorous double-blind peer review protocol:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm pl-2">
                    <li>The identity of the author(s) is concealed from the appointed reviewers.</li>
                    <li>The identity of the reviewers remains completely confidential.</li>
                    <li>Each manuscript is examined by at least two independent expert reviewers.</li>
                    <li>Reviewers provide structured feedback across originality, theoretical soundness, and empirical validity.</li>
                  </ol>
                </div>
              )}

              {infoSubTab === 'ethics' && (
                <div className="space-y-4">
                  <h3 className="font-editorial text-2xl font-bold text-forest">Publication Ethics</h3>
                  <p>
                    Tamweel strictly observes the ethical guidelines established by the Committee on Publication Ethics (COPE). Plagiarism, data fabrication, gift authorship, duplicate submissions, and undisclosed financial conflicts of interest result in immediate desk rejection and formal institutional notification.
                  </p>
                </div>
              )}

              {infoSubTab === 'guidelines' && (
                <div className="space-y-4">
                  <h3 className="font-editorial text-2xl font-bold text-forest">Author &amp; Submission Guidelines</h3>
                  <ul className="space-y-2 text-xs sm:text-sm">
                    <li>• <strong>Word Count:</strong> 6,000 to 9,000 words (including abstract, references, and appendices).</li>
                    <li>• <strong>Abstract:</strong> 200–250 words summarizing research questions, methodology, and core findings.</li>
                    <li>• <strong>Citation Style:</strong> Chicago Manual of Style (17th Edition, Author-Date).</li>
                    <li>• <strong>Arabic Transliteration:</strong> IJMES (International Journal of Middle East Studies) standard transliteration system.</li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={() => setActiveTab('submit')}
                      className="px-4 py-2 bg-forest text-white rounded-lg text-xs font-bold hover:bg-emerald-deep transition"
                    >
                      Proceed to Manuscript Submission Portal →
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </section>
      )}

      {/* 5. SUBMIT YOUR PAPER PORTAL */}
      {activeTab === 'submit' && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-forest/15 shadow-elevated p-8 sm:p-12 space-y-6">
            
            <div className="border-b border-gray-100 pb-4">
              <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">
                Call for Papers
              </span>
              <h2 className="text-2xl sm:text-3xl font-editorial font-bold text-forest mt-1">
                Tamweel Manuscript Submission Portal
              </h2>
              <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
                Submit your original research paper for peer review. Submissions are queued directly into our editorial desk.
              </p>
            </div>

            {submissionSuccess ? (
              <div className="py-12 text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-editorial text-2xl font-bold text-forest">
                  Manuscript Registered for Peer Review!
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-light max-w-lg mx-auto leading-relaxed">
                  Thank you, <strong>{authorName}</strong>. Your paper <em>"{paperTitle}"</em> has been assigned a tracking reference and queued into the department editorial triage system.
                </p>
                <div className="pt-4 flex justify-center space-x-3">
                  <button
                    onClick={() => {
                      setSubmissionSuccess(false);
                      setAuthorName('');
                      setCorrespondingEmail('');
                      setPaperTitle('');
                      setAbstractText('');
                      setKeywords('');
                      setFileName('');
                    }}
                    className="px-5 py-2.5 bg-forest text-white text-xs font-bold rounded-xl hover:bg-emerald-deep transition"
                  >
                    Submit Another Manuscript
                  </button>
                  <button
                    onClick={() => setActiveTab('articles')}
                    className="px-5 py-2.5 bg-ivory text-forest text-xs font-bold rounded-xl border border-forest/20 hover:bg-white transition"
                  >
                    Back to Articles
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitManuscript} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">
                      Author(s) Full Name(s) *
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="e.g. Dr. Haris Bilal, Fatima Zahra"
                      className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl focus:border-forest focus:outline-none ${
                        formErrors.authorName ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.authorName && (
                      <p className="text-[10px] text-red-600 mt-1">{formErrors.authorName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">
                      Corresponding Email *
                    </label>
                    <input
                      type="email"
                      value={correspondingEmail}
                      onChange={(e) => setCorrespondingEmail(e.target.value)}
                      placeholder="e.g. author@university.ac.in"
                      className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl focus:border-forest focus:outline-none ${
                        formErrors.correspondingEmail ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.correspondingEmail && (
                      <p className="text-[10px] text-red-600 mt-1">{formErrors.correspondingEmail}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">
                      Institutional Affiliation
                    </label>
                    <input
                      type="text"
                      value={affiliation}
                      onChange={(e) => setAffiliation(e.target.value)}
                      placeholder="e.g. Faculty of Economics, University of Malaya"
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 rounded-xl focus:border-forest focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">
                      Research Track
                    </label>
                    <select
                      value={track}
                      onChange={(e) => setTrack(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 rounded-xl focus:border-forest focus:outline-none"
                    >
                      <option value="Fiqh al-Mu’amalat & Legal Foundations">Fiqh al-Mu’amalat &amp; Legal Foundations</option>
                      <option value="Islamic Banking Operations & Risk">Islamic Banking Operations &amp; Risk</option>
                      <option value="Sukuk & Islamic Capital Markets">Sukuk &amp; Islamic Capital Markets</option>
                      <option value="Social Finance, Waqf & Zakat">Social Finance, Waqf &amp; Zakat</option>
                      <option value="Islamic Fintech & Digital Economics">Islamic Fintech &amp; Digital Economics</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Manuscript Title *
                  </label>
                  <input
                    type="text"
                    value={paperTitle}
                    onChange={(e) => setPaperTitle(e.target.value)}
                    placeholder="e.g. Shariah Governance Mechanisms in Distributed Asset Registries: An Empirical Appraisal"
                    className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl focus:border-forest focus:outline-none ${
                      formErrors.paperTitle ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.paperTitle && (
                    <p className="text-[10px] text-red-600 mt-1">{formErrors.paperTitle}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Structured Abstract (minimum 50 words) *
                  </label>
                  <textarea
                    rows={4}
                    value={abstractText}
                    onChange={(e) => setAbstractText(e.target.value)}
                    placeholder="Summarize research background, research problem, Shariah/empirical methodology, results, and policy implications..."
                    className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl focus:border-forest focus:outline-none ${
                      formErrors.abstractText ? 'border-red-500' : 'border-gray-300'
                    }`}
                  ></textarea>
                  {formErrors.abstractText && (
                    <p className="text-[10px] text-red-600 mt-1">{formErrors.abstractText}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Keywords (comma separated) *
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g. Sukuk, AAOIFI, Liquidity Management, Fiqh al-Mu'amalat"
                    className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl focus:border-forest focus:outline-none ${
                      formErrors.keywords ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.keywords && (
                    <p className="text-[10px] text-red-600 mt-1">{formErrors.keywords}</p>
                  )}
                </div>

                {/* Simulated File Upload input */}
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Manuscript File (.PDF or .DOCX, Anonymous for Review) *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-forest transition bg-ivory/50">
                    <Upload className="w-6 h-6 text-gold mx-auto mb-1" />
                    <p className="text-xs text-charcoal font-medium">Select file or enter manuscript filename</p>
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder="e.g. Tamweel_Manuscript_Anonymous_Submission_2026.pdf"
                      className="mt-2 w-full max-w-md mx-auto px-3 py-1.5 text-xs bg-white border border-gray-300 rounded-lg text-center"
                    />
                    <div className="flex justify-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => setFileName('Tamweel_Manuscript_Draft_2026.pdf')}
                        className="text-[10px] text-forest underline hover:text-gold"
                      >
                        Use sample file
                      </button>
                    </div>
                  </div>
                  {formErrors.fileName && (
                    <p className="text-[10px] text-red-600 mt-1">{formErrors.fileName}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-forest hover:bg-emerald-deep text-white font-semibold text-xs sm:text-sm rounded-xl shadow transition flex items-center justify-center space-x-2"
                  >
                    <Upload className="w-4 h-4 text-gold" />
                    <span>{isSubmitting ? 'Submitting to Editorial Board...' : 'Submit Manuscript for Double-Blind Review'}</span>
                  </button>
                </div>

              </form>
            )}

          </div>
        </section>
      )}

      {/* ARTICLE ABSTRACT DETAIL MODAL */}
      {activeArticleModal && (
        <div className="fixed inset-0 z-50 bg-forest-dark/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-4 max-h-[85vh] overflow-y-auto border border-gold/40 shadow-2xl relative">
            <div className="flex items-start justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-gold-dark uppercase tracking-wider bg-gold/15 px-2 py-0.5 rounded">
                  {activeArticleModal.category}
                </span>
                <span className="text-xs text-charcoal-muted ml-2">
                  Vol. {activeArticleModal.volume}, Issue {activeArticleModal.issue} ({activeArticleModal.year})
                </span>
              </div>
              <button
                onClick={() => setActiveArticleModal(null)}
                className="text-gray-400 hover:text-charcoal p-1"
              >
                ✕
              </button>
            </div>

            <h3 className="font-editorial text-xl font-bold text-forest leading-snug">
              {activeArticleModal.title}
            </h3>

            <div className="text-xs font-semibold text-charcoal">
              Authors: {activeArticleModal.authors.join(', ')}
            </div>

            <div className="text-xs text-charcoal-muted font-mono">
              DOI: {activeArticleModal.doi} • Pages: {activeArticleModal.pages}
            </div>

            <div className="bg-surface-lightGreen/30 p-4 rounded-xl border border-forest/10 space-y-2">
              <strong className="text-xs font-bold text-forest block">Full Abstract:</strong>
              <p className="text-xs text-charcoal-light leading-relaxed">
                {activeArticleModal.abstract}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {activeArticleModal.keywords.map((kw, i) => (
                <span key={i} className="text-[10px] bg-ivory text-forest px-2 py-0.5 rounded border border-gray-200">
                  #{kw}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => handleCopyCitation(activeArticleModal)}
                className="text-xs font-bold text-forest hover:text-gold-dark flex items-center space-x-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Citation</span>
              </button>

              <button
                onClick={() => {
                  handleDownloadPdf(activeArticleModal);
                  setActiveArticleModal(null);
                }}
                className="px-4 py-2 bg-forest text-white rounded-lg text-xs font-bold hover:bg-emerald-deep flex items-center space-x-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5 text-gold" />
                <span>Download PDF Article</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
