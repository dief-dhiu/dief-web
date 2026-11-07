import React, { useState, useEffect } from 'react';
import { PageId, EventItem, JournalArticle } from '../types';
import { fetchPublicActivities } from '../lib/activitiesService';
import { fetchPublicPublishedArticles } from '../lib/journalService';
import { ActivityRecord } from '../types/activity';
import { JournalArticleRecord } from '../types/journal';
import {
  Building2,
  Briefcase,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Users,
  Globe2,
  Library,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  FileText,
  ShieldCheck,
  Award,
  Sparkles,
  Loader2
} from 'lucide-react';
import { IslamicStarIcon, IslamicPatternBand } from '../components/IslamicPattern';

interface HomePageProps {
  onNavigate: (page: PageId, targetId?: string) => void;
  events?: EventItem[];
  articles?: JournalArticle[];
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, events = [], articles = [] }) => {
  const [liveActivities, setLiveActivities] = useState<ActivityRecord[]>([]);
  const [liveArticles, setLiveArticles] = useState<JournalArticleRecord[]>([]);
  const [loadingLive, setLoadingLive] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadLiveData = async () => {
      setLoadingLive(true);
      try {
        const [acts, arts] = await Promise.all([
          fetchPublicActivities(),
          fetchPublicPublishedArticles()
        ]);
        if (isMounted) {
          setLiveActivities(acts || []);
          setLiveArticles(arts || []);
        }
      } catch (err) {
        console.warn('Failed to load homepage live data:', err);
      } finally {
        if (isMounted) setLoadingLive(false);
      }
    };
    loadLiveData();
    return () => { isMounted = false; };
  }, []);

  const scrollToInitiatives = () => {
    const el = document.getElementById('initiatives-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const displayActivities: ActivityRecord[] = liveActivities.slice(0, 3);
  const displayArticles: JournalArticleRecord[] = liveArticles.slice(0, 3);

  return (
    <div className="space-y-20 lg:space-y-28">

      {/* SECTION A: SPLIT-SCREEN HERO SECTION */}
      <section className="relative overflow-hidden bg-ivory pt-8 pb-16 lg:py-20 border-b border-forest/10">
        {/* Subtle background ambient geometric grid */}
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#123D2B_1px,transparent_1px)] [background-size:32px_32px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6">

              {/* Institutional Affiliation Badge */}
              <div className="pt-1">
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-forest/5 border border-forest/15 text-forest text-xs font-semibold tracking-wide">
                  <IslamicStarIcon size={12} className="text-gold-dark" />
                  <span>Kulliyya of Sharia • Darul Huda Islamic University</span>
                </div>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl xl:text-6xl font-editorial font-bold text-forest tracking-tight leading-[1.12]">
                  Islamic Economics <br />
                  <span className="italic font-normal text-emerald-deep">&amp; Finance</span>
                </h1>

              </div>

              {/* Supporting Statement */}
              <p className="text-base sm:text-lg text-charcoal-light leading-relaxed max-w-2xl font-normal">
                Advancing ethical finance through knowledge, research, innovation, and Shariah principles. Grounded at Darul Huda Islamic University, bridging foundational Islamic economic jurisprudence with contemporary global financial systems.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('about')}
                  className="px-6 py-3.5 bg-forest hover:bg-emerald-deep text-white font-semibold text-sm rounded-xl shadow-elevated hover:shadow-lg transition-all duration-200 flex items-center space-x-2.5 group"
                >
                  <span>Explore Our Department</span>
                  <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={scrollToInitiatives}
                  className="px-6 py-3.5 bg-white hover:bg-surface-lightGreen text-forest font-semibold text-sm rounded-xl border border-forest/20 shadow-soft hover:border-gold transition-all duration-200 flex items-center space-x-2"
                >
                  <span>Discover Our Initiatives</span>
                  <IslamicStarIcon size={14} className="text-gold" />
                </button>
              </div>

              {/* Micro Department Indicators */}
              <div className="pt-6 border-t border-forest/10 grid grid-cols-3 gap-4">
                <div>
                  <div className="font-editorial text-xl sm:text-2xl font-bold text-forest">03</div>
                  <div className="text-[11px] text-charcoal-muted uppercase tracking-wider font-semibold">Flagship Initiatives</div>
                </div>
                <div>
                  <div className="font-editorial text-xl sm:text-2xl font-bold text-forest">Fiqh &amp; Finance</div>
                  <div className="text-[11px] text-charcoal-muted uppercase tracking-wider font-semibold">Integrated Dual Rigor</div>
                </div>
                <div>
                  <div className="font-editorial text-xl sm:text-2xl font-bold text-forest">Open Access</div>
                  <div className="text-[11px] text-charcoal-muted uppercase tracking-wider font-semibold">Tamweel Journal</div>
                </div>
              </div>

            </div>

            {/* Right Hero Column: Elegant Architectural & Academic Imagery */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">

                {/* Decorative border frame */}
                <div className="absolute -inset-3 rounded-3xl border border-gold/40 rotate-1 opacity-70 pointer-events-none"></div>
                <div className="absolute -inset-1 rounded-2xl border border-forest/20 -rotate-1 pointer-events-none"></div>

                {/* Main Featured Visual */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-forest aspect-[4/5] group">
                  <img
                    src="/dhiu-campus.jpg"
                    alt="Darul Huda Islamic University campus building"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/30 to-transparent"></div>

                  {/* Floating Academic Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md border border-gold/40 rounded-xl px-3 py-2 shadow-soft flex items-center space-x-2">
                    <IslamicStarIcon size={16} className="text-gold" />
                    <span className="text-[11px] font-bold text-forest uppercase tracking-wider">
                      Academic Rigor
                    </span>
                  </div>

                  {/* Bottom Image Overlay Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-4 border border-forest/15 shadow-elevated">
                    <div className="flex items-center space-x-2 text-[11px] font-semibold text-gold-dark uppercase tracking-wider">
                      <span>Darul Huda Islamic University</span>
                      <span>•</span>
                      <span>Kerala, India</span>
                    </div>
                    <div className="text-xs font-bold text-forest mt-0.5 font-editorial">
                      "Bridging classical Islamic commercial jurisprudence with modern financial analytical tools."
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION B: INTRODUCTION TO THE DEPARTMENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-forest/10 p-8 sm:p-12 lg:p-16 shadow-soft relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-surface-lightGreen/60 rounded-bl-full pointer-events-none -z-0"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold tracking-widest text-gold-dark uppercase font-sans flex items-center space-x-2">
                <IslamicStarIcon size={14} className="text-gold" />
                <span>Our Foundations</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-forest leading-tight">
                Where Knowledge Meets <br />
                <span className="italic text-emerald-deep">Ethical Finance</span>
              </h2>

            </div>

            <div className="lg:col-span-7 space-y-5 text-sm sm:text-base text-charcoal-light leading-relaxed">
              <p>
                The <strong>Department of Islamic Economics and Finance</strong> under the <strong>Kulliyya of Sharia at Darul Huda Islamic University</strong> offers a rigorous and holistic academic environment focused on Islamic economic ideologies rooted in Shari’ah principles and modern financial understanding. Founded with the aim of Islamizing modern financial practices, the department provides Postgraduate (M.A.), Undergraduate (B.A.), and Diploma/Certificate programs that prepare graduates for real-world financial challenges through the lens of Islamic jurisprudence.
              </p>
              <p>
                Serving as a beacon of educational excellence, the department blends the classical scholarship of Islam with the dynamics of the global financial system, offering a pathway to academic mastery and spiritual growth through formal research, the <strong>CFSEI</strong> initiative, and global academic partnerships.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center space-x-2 text-forest font-bold text-sm hover:text-emerald-deep transition border-b-2 border-gold pb-0.5 group"
                >
                  <span>Read Full About the Department</span>
                  <ArrowRight className="w-4 h-4 text-gold group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: OUR INITIATIVES (THE THREE FLAGSHIP CARDS) */}
      <section id="initiatives-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-forest text-xs font-semibold">
            <IslamicStarIcon size={12} className="text-gold" />
            <span>One Department • Three Flagship Pillars</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-forest">
            Our Central Initiatives
          </h2>
          <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed">
            The department unites its academic mission with three independent yet synergized digital platforms catering to banking practice, business advisory, and scholarly publication.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">

          {/* CARD 1: DHIB */}
          <div className="group bg-white rounded-2xl border border-forest/15 shadow-soft hover:shadow-elevated hover:border-gold/60 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="p-7 space-y-4">
              {/* Header with Icon and Flagship Tag */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-forest text-gold flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-forest uppercase bg-surface-lightGreen px-2.5 py-1 rounded-full border border-forest/10">
                  Banking Sandbox
                </span>
              </div>

              {/* Identity & Title */}
              <div>
                <span className="text-xs font-semibold text-gold-dark uppercase tracking-wider block">
                  Pillar 01
                </span>
                <h3 className="text-2xl font-editorial font-bold text-forest mt-0.5 group-hover:text-emerald-deep transition-colors">
                  DHIB
                </h3>
                <h4 className="text-xs font-bold text-charcoal mt-0.5">
                  Darul Huda Islamic Bank
                </h4>
              </div>

              {/* Required Suggested Description */}
              <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
                Exploring and promoting ethical, Shariah-compliant approaches to banking and financial practices through experiential laboratory modules and community financial literacy.
              </p>

              {/* Feature Highlights */}
              <ul className="space-y-1.5 text-xs text-charcoal-muted pt-2 border-t border-gray-100">
                <li className="flex items-center space-x-2">
                  <IslamicStarIcon size={12} className="text-gold" />
                  <span>Non-interest risk-sharing principles</span>
                </li>
                <li className="flex items-center space-x-2">
                  <IslamicStarIcon size={12} className="text-gold" />
                  <span>Student participatory simulation lab</span>
                </li>
                <li className="flex items-center space-x-2">
                  <IslamicStarIcon size={12} className="text-gold" />
                  <span>Educational banking tools & calculators</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="p-7 pt-0">
              <button
                onClick={() => onNavigate('dhib')}
                className="w-full py-3 px-4 bg-forest hover:bg-emerald-deep text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-2 group/btn"
              >
                <span>Explore DHIB</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* CARD 2: SBC */}
          <div className="group bg-white rounded-2xl border border-forest/15 shadow-soft hover:shadow-elevated hover:border-gold/60 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="p-7 space-y-4">
              {/* Header with Icon and Flagship Tag */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-forest text-gold flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-forest uppercase bg-surface-lightGreen px-2.5 py-1 rounded-full border border-forest/10">
                  Business Advisory
                </span>
              </div>

              {/* Identity & Title */}
              <div>
                <span className="text-xs font-semibold text-gold-dark uppercase tracking-wider block">
                  Pillar 02
                </span>
                <h3 className="text-2xl font-editorial font-bold text-forest mt-0.5 group-hover:text-emerald-deep transition-colors">
                  SBC
                </h3>
                <h4 className="text-xs font-bold text-charcoal mt-0.5">
                  Shariah Business Consultancy
                </h4>
              </div>

              {/* Required Suggested Description */}
              <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
                Providing Shariah-oriented business guidance, consultancy and practical solutions for contemporary enterprises navigating contracts, financing, and commercial ethics.
              </p>

              {/* Feature Highlights */}
              <ul className="space-y-1.5 text-xs text-charcoal-muted pt-2 border-t border-gray-100">
                <li className="flex items-center space-x-2">
                  <IslamicStarIcon size={12} className="text-gold" />
                  <span>Commercial contract structuring</span>
                </li>
                <li className="flex items-center space-x-2">
                  <IslamicStarIcon size={12} className="text-gold" />
                  <span>Equities & enterprise Shariah screening</span>
                </li>
                <li className="flex items-center space-x-2">
                  <IslamicStarIcon size={12} className="text-gold" />
                  <span>Direct consultation request portal</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="p-7 pt-0">
              <button
                onClick={() => onNavigate('sbc')}
                className="w-full py-3 px-4 bg-forest hover:bg-emerald-deep text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-2 group/btn"
              >
                <span>Explore SBC</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* CARD 3: TAMWEEL */}
          <div className="group bg-white rounded-2xl border border-forest/15 shadow-soft hover:shadow-elevated hover:border-gold/60 transition-all duration-300 flex flex-col justify-between overflow-hidden">
            <div className="p-7 space-y-4">
              {/* Header with Icon and Flagship Tag */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-forest text-gold flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-forest uppercase bg-surface-lightGreen px-2.5 py-1 rounded-full border border-forest/10">
                  Academic Journal
                </span>
              </div>

              {/* Identity & Title */}
              <div>
                <span className="text-xs font-semibold text-gold-dark uppercase tracking-wider block">
                  Pillar 03
                </span>
                <h3 className="text-2xl font-editorial font-bold text-forest mt-0.5 group-hover:text-emerald-deep transition-colors">
                  Tamweel
                </h3>
                <h4 className="text-xs font-bold text-charcoal mt-0.5">
                  Journal of Islamic Economics and Finance
                </h4>
              </div>

              {/* Required Suggested Description */}
              <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
                An academic platform for research, scholarly discussions and publications in Islamic economics and finance, featuring peer-reviewed theoretical and empirical contributions.
              </p>

              {/* Feature Highlights */}
              <ul className="space-y-1.5 text-xs text-charcoal-muted pt-2 border-t border-gray-100">
                <li className="flex items-center space-x-2">
                  <IslamicStarIcon size={12} className="text-gold" />
                  <span>Double-blind peer-reviewed articles</span>
                </li>
                <li className="flex items-center space-x-2">
                  <IslamicStarIcon size={12} className="text-gold" />
                  <span>Open access full-text PDF repository</span>
                </li>
                <li className="flex items-center space-x-2">
                  <IslamicStarIcon size={12} className="text-gold" />
                  <span>Online paper submission portal</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="p-7 pt-0">
              <button
                onClick={() => onNavigate('tamweel')}
                className="w-full py-3 px-4 bg-forest hover:bg-emerald-deep text-white text-xs font-bold rounded-xl transition flex items-center justify-center space-x-2 group/btn"
              >
                <span>Explore Tamweel</span>
                <ArrowRight className="w-3.5 h-3.5 text-gold group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION D: ACADEMIC AND RESEARCH FOCUS */}
      <section className="bg-surface-lightGreen/50 py-16 border-y border-forest/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest text-gold-dark uppercase font-sans">
                Academic Ecosystem
              </span>
              <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-forest mt-1">
                Academic &amp; Research Focus
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-charcoal-muted max-w-md">
              A holistic ecosystem connecting rigorous classroom scholarship with real-world institutional engagement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Category 1 */}
            <div
              onClick={() => onNavigate('about')}
              className="bg-white rounded-2xl p-6 border border-forest/10 hover:border-gold/50 shadow-soft hover:shadow-elevated transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center mb-4 group-hover:bg-forest group-hover:text-gold transition-colors">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-lg font-bold text-forest group-hover:text-emerald-deep">
                Academic Programmes
              </h3>
              <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
                Foundational and advanced degree modules integrating Islamic commercial jurisprudence with modern economic sciences.
              </p>
              <div className="mt-4 flex items-center space-x-1.5 text-xs font-bold text-forest group-hover:text-gold-dark">
                <span>View Programmes</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Category 2 */}
            <div
              onClick={() => onNavigate('tamweel')}
              className="bg-white rounded-2xl p-6 border border-forest/10 hover:border-gold/50 shadow-soft hover:shadow-elevated transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center mb-4 group-hover:bg-forest group-hover:text-gold transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-lg font-bold text-forest group-hover:text-emerald-deep">
                Research and Publications
              </h3>
              <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
                Departmental working papers, Tamweel scholarly issues, and ongoing studies on Sukuk, Waqf, and Islamic Fintech.
              </p>
              <div className="mt-4 flex items-center space-x-1.5 text-xs font-bold text-forest group-hover:text-gold-dark">
                <span>Read Publications</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Category 3 */}
            <div
              onClick={() => onNavigate('activities')}
              className="bg-white rounded-2xl p-6 border border-forest/10 hover:border-gold/50 shadow-soft hover:shadow-elevated transition-all cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center mb-4 group-hover:bg-forest group-hover:text-gold transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-editorial text-lg font-bold text-forest group-hover:text-emerald-deep">
                Seminars and Conferences
              </h3>
              <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
                National and regional academic conferences discussing contemporary Fiqh questions, digital assets, and ethical finance.
              </p>
              <div className="mt-4 flex items-center space-x-1.5 text-xs font-bold text-forest group-hover:text-gold-dark">
                <span>View Event Calendar</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION E: LATEST UPDATES (DATE-BASED EVENT CARDS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-forest/10 pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-gold-dark uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              <span>Department Bulletin</span>
            </div>
            <h2 className="text-3xl font-editorial font-bold text-forest mt-1">
              Latest Updates &amp; Events
            </h2>
          </div>
          <button
            onClick={() => onNavigate('activities')}
            className="inline-flex items-center space-x-2 text-forest hover:text-emerald-deep font-semibold text-xs border border-forest/20 hover:border-forest px-4 py-2 rounded-xl transition"
          >
            <span>View All Activities</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold" />
          </button>
        </div>

        {loadingLive ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-forest/10 flex items-center justify-center space-x-2 text-forest text-xs font-medium">
            <Loader2 className="w-5 h-5 animate-spin text-gold" />
            <span>Loading departmental updates...</span>
          </div>
        ) : displayActivities.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-forest/10 space-y-2">
            <Calendar className="w-8 h-8 text-forest/40 mx-auto" />
            <h3 className="font-editorial text-lg font-bold text-forest">No Current Public Bulletin Events</h3>
            <p className="text-xs text-charcoal-muted max-w-md mx-auto">
              Upcoming departmental conferences, symposiums, and lectures will be announced here once published.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayActivities.map((act) => {
              const todayStr = new Date().toISOString().split('T')[0];
              const isUpcoming = act.start_date ? act.start_date >= todayStr : false;
              const formattedDate = act.start_date
                ? new Date(act.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                : 'Scheduled';
              const displayImage = act.featured_image_url || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80';

              return (
                <div
                  key={act.id}
                  onClick={() => onNavigate('activities', act.id)}
                  className="bg-white rounded-2xl border border-forest/10 hover:border-gold/60 shadow-soft hover:shadow-elevated transition-all overflow-hidden flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="relative aspect-[16/9] overflow-hidden bg-forest/5">
                      <img
                        src={displayImage}
                        alt={act.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-forest text-gold text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
                        {act.category_name || 'Department Event'}
                      </div>
                      {isUpcoming && (
                        <div className="absolute top-3 right-3 bg-white/95 text-forest text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          Upcoming
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-2.5">
                      <div className="text-[11px] font-semibold text-gold-dark flex items-center space-x-2">
                        <Calendar className="w-3 h-3" />
                        <span>{formattedDate}{act.start_time ? ` • ${act.start_time}` : ''}</span>
                      </div>

                      <h3 className="font-editorial text-base font-bold text-forest group-hover:text-emerald-deep leading-snug line-clamp-2">
                        {act.title}
                      </h3>

                      <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed">
                        {act.short_description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 text-[11px] text-charcoal-muted flex items-center justify-between border-t border-gray-100 pt-3">
                    <span className="truncate max-w-[200px] flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-gold shrink-0" />
                      <span>{act.venue || 'Darul Huda Islamic University'}</span>
                    </span>
                    <span className="font-bold text-forest group-hover:text-gold-dark flex items-center space-x-1">
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SECTION F: LATEST PUBLICATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-forest/10 pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-gold-dark uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Scholarly Output</span>
            </div>
            <h2 className="text-3xl font-editorial font-bold text-forest mt-1">
              Latest Publications &amp; Papers
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('tamweel')}
              className="inline-flex items-center space-x-2 text-forest hover:text-emerald-deep font-semibold text-xs border border-forest/20 hover:border-forest px-4 py-2 rounded-xl transition"
            >
              <span>Explore Tamweel Journal</span>
              <ArrowRight className="w-3.5 h-3.5 text-gold" />
            </button>
          </div>
        </div>

        {loadingLive ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-forest/10 flex items-center justify-center space-x-2 text-forest text-xs font-medium">
            <Loader2 className="w-5 h-5 animate-spin text-gold" />
            <span>Loading publications...</span>
          </div>
        ) : displayArticles.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-forest/10 space-y-2">
            <BookOpen className="w-8 h-8 text-forest/40 mx-auto" />
            <h3 className="font-editorial text-lg font-bold text-forest">No Published Journal Papers Available</h3>
            <p className="text-xs text-charcoal-muted max-w-md mx-auto">
              Scholarly articles published in Tamweel: Journal of Islamic Economics and Finance will be indexed here once released.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => onNavigate('tamweel', art.id)}
                className="bg-white rounded-2xl border border-forest/10 hover:border-gold/60 p-6 shadow-soft hover:shadow-elevated transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-gold-dark uppercase tracking-wider bg-gold/15 px-2 py-0.5 rounded">
                      {art.category || 'Islamic Economics'}
                    </span>
                    <span className="text-xs text-charcoal-muted">
                      {art.issue ? `Tamweel • Volume ${art.issue.volume_number}, Issue ${art.issue.issue_number} (${art.issue.year})` : 'Tamweel Journal'}
                    </span>
                  </div>

                  <h3 className="font-editorial text-lg sm:text-xl font-bold text-forest group-hover:text-emerald-deep leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-charcoal-muted line-clamp-2 leading-relaxed">
                    {art.abstract}
                  </p>

                  {art.keywords && art.keywords.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {art.keywords.map((kw, i) => (
                        <span key={i} className="text-[10px] text-forest bg-surface-lightGreen px-2 py-0.5 rounded font-medium">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex items-center md:flex-col justify-end space-y-2">
                  <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-forest group-hover:text-gold-dark transition">
                    <span>View Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  {art.page_range && (
                    <span className="text-[11px] text-charcoal-muted hidden md:block">
                      pp. {art.page_range}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SECTION G: CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-forest rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl border-2 border-gold/40">

          {/* Subtle background geometric star lattice */}
          <div className="absolute inset-0 pattern-dark-islamic opacity-40 pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <IslamicStarIcon size={36} className="text-gold mx-auto" />

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-white tracking-tight leading-tight">
              Building a More Ethical and <br />
              <span className="italic text-gold">Sustainable Financial Future.</span>
            </h2>

            <p className="text-sm sm:text-base text-sage-subtle leading-relaxed font-normal">
              Whether you are an aspiring scholar of Islamic economics, an academic researcher aiming to publish in Tamweel, a financial professional exploring DHIB, or a commercial enterprise seeking SBC advisory guidance—we invite you to partner with us.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onNavigate('about')}
                className="px-6 py-3.5 bg-gold hover:bg-gold-light text-forest font-bold text-xs sm:text-sm rounded-xl shadow-lg transition"
              >
                Explore Our Academic Work
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-gold/50 font-bold text-xs sm:text-sm rounded-xl transition"
              >
                Contact the Department
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
