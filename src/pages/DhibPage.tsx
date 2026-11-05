import React from 'react';
import { PageId } from '../types';
import { 
  Building2, 
  ShieldAlert, 
  BookOpen, 
  TrendingUp, 
  Scale, 
  CheckCircle2, 
  GraduationCap, 
  Layers, 
  ArrowRight,
  FileText,
  Mail,
  HelpCircle,
  Coins
} from 'lucide-react';
import { IslamicStarIcon } from '../components/IslamicPattern';

interface DhibPageProps {
  onNavigate: (page: PageId) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const DhibPage: React.FC<DhibPageProps> = ({ onNavigate, onShowToast }) => {

  return (
    <div className="space-y-16 lg:space-y-24 py-8">
      
      {/* 1. HERO & DHIB INTRODUCTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden border-2 border-gold/40 shadow-elevated">
          <div className="absolute inset-0 pattern-dark-islamic opacity-30 pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold border border-gold/30">
                <Building2 className="w-3.5 h-3.5" />
                <span>Department Flagship Initiative 01</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-white tracking-tight">
                DHIB <br />
                <span className="italic text-gold">Darul Huda Islamic Bank</span>
              </h1>

              <div className="font-arabic text-lg sm:text-xl text-sage-light" dir="rtl">
                مبادرة بنك دار الهدى الإسلامي — نحو تجربة مصرفية أخلاقية
              </div>

              <p className="text-sm sm:text-base text-sage-subtle leading-relaxed max-w-2xl">
                An innovative academic financial laboratory, exploratory sandbox, and community financial literacy platform dedicated to investigating, modeling, and demonstrating Shariah-compliant, interest-free banking paradigms.
              </p>

              {/* MANDATORY LEGAL & OPERATIONAL STATUS DECLARATION */}
              <div className="mt-4 p-4 rounded-xl bg-forest-dark/90 border border-gold/40 text-xs text-sage-light flex items-start space-x-3">
                <ShieldAlert className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-0.5">Academic &amp; Operational Disclosure:</strong>
                  DHIB is an institutional educational initiative and simulation sandbox established by the Department of Islamic Economics and Finance. It does <em>not</em> function as a commercial, state-licensed deposit-taking bank or provide regulated retail banking services.
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href="#principles"
                  className="px-5 py-3 bg-gold hover:bg-gold-light text-forest font-bold text-xs rounded-xl shadow transition"
                >
                  Islamic Banking Principles
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-gold/40 space-y-4 text-center">
                <IslamicStarIcon size={44} className="mx-auto text-gold" />
                <div className="font-editorial text-xl font-bold text-white">Ethical Finance Laboratory</div>
                <p className="text-xs text-sage-light leading-relaxed">
                  Experiential learning platform connecting student researchers with real-world participatory risk-sharing architectures.
                </p>
                <div className="text-[11px] font-bold text-gold uppercase tracking-wider">
                  Darul Huda Islamic University
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VISION AND MISSION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-white p-8 rounded-2xl border border-forest/10 shadow-soft space-y-3">
            <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">DHIB Vision</span>
            <h3 className="text-2xl font-editorial font-bold text-forest">Pioneering Fair Financial Horizons</h3>
            <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
              To cultivate an authoritative, educational bridge between classical Islamic commercial ethics and modern monetary institutions, empowering students and community stakeholders with practical mastery of interest-free participatory banking.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-forest/10 shadow-soft space-y-3">
            <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">DHIB Mission</span>
            <h3 className="text-2xl font-editorial font-bold text-forest">Hands-on Literacy &amp; Research</h3>
            <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
              Demystify Islamic banking mechanics through simulated branch workflows, publish educational consumer guides, evaluate AAOIFI governance standards, and promote public awareness on debt-free financial independence.
            </p>
          </div>

        </div>
      </section>

      {/* 3. ISLAMIC BANKING PRINCIPLES */}
      <section id="principles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold tracking-widest text-gold-dark uppercase font-sans">
            Doctrinal Core
          </span>
          <h2 className="text-3xl font-editorial font-bold text-forest">
            Core Principles of Islamic Banking
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            The fundamental ethical pillars separating Islamic finance from conventional interest-based financial intermediation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-forest/10 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-forest text-gold flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h4 className="font-editorial text-lg font-bold text-forest">Prohibition of Riba (Interest/Usury)</h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Money is a medium of exchange and measure of value, not an autonomous commodity. Guaranteed fixed increments charged on credit loans are strictly forbidden.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-forest/10 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-forest text-gold flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h4 className="font-editorial text-lg font-bold text-forest">Elimination of Gharar &amp; Maysir</h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Zero tolerance for excessive uncertainty (Gharar) and pure gambling speculation (Maysir). Contracts require absolute transparency regarding terms, assets, and delivery.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-forest/10 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-forest text-gold flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h4 className="font-editorial text-lg font-bold text-forest">Risk Sharing &amp; Partnership</h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Profits and losses must be shared in accordance with predetermined ratios (Al-Ghunm bi al-Ghurm). Capital cannot demand reward without bearing legitimate commercial risk.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-forest/10 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-forest text-gold flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h4 className="font-editorial text-lg font-bold text-forest">Real Asset Backing</h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Financial transactions must be intrinsically linked to identifiable, tangible economic goods, services, or usufruct, preventing synthetic leverage bubbles.
            </p>
          </div>

        </div>
      </section>

      {/* 6. EDUCATIONAL RESOURCES & LITERACY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-forest/10 pb-4">
          <div>
            <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">
              Educational Downloads
            </span>
            <h3 className="text-2xl font-editorial font-bold text-forest mt-1">
              DHIB Financial Literacy Primers
            </h3>
          </div>
          <button
            onClick={() => onNavigate('resources')}
            className="text-xs font-bold text-forest hover:text-emerald-deep flex items-center space-x-1.5"
          >
            <span>View All Department Resources</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-forest/10 shadow-soft space-y-3">
            <BookOpen className="w-5 h-5 text-gold" />
            <h4 className="font-editorial text-base font-bold text-forest">
              Consumer Guide: Understanding Interest-Free Banking
            </h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Beginner-friendly manual detailing accounts, debit instruments, and ethical saving avenues.
            </p>
            <button
              onClick={() => onShowToast('Download Initiated', 'DHIB Consumer Guide PDF downloaded successfully.', 'success')}
              className="text-xs font-bold text-forest hover:text-gold-dark flex items-center space-x-1 pt-2"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download Primer (PDF)</span>
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-forest/10 shadow-soft space-y-3">
            <Scale className="w-5 h-5 text-gold" />
            <h4 className="font-editorial text-base font-bold text-forest">
              AAOIFI Standards Summary Sheet
            </h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Quick reference comparison table for Shariah standard compliance in commercial banking.
            </p>
            <button
              onClick={() => onShowToast('Download Initiated', 'AAOIFI Reference PDF downloaded successfully.', 'success')}
              className="text-xs font-bold text-forest hover:text-gold-dark flex items-center space-x-1 pt-2"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download Sheet (PDF)</span>
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-forest/10 shadow-soft space-y-3">
            <Coins className="w-5 h-5 text-gold" />
            <h4 className="font-editorial text-base font-bold text-forest">
              Glossary of Islamic Financial Contracts
            </h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Comprehensive bilingual Arabic-English dictionary of technical Fiqh al-Muamalat terms.
            </p>
            <button
              onClick={() => onShowToast('Download Initiated', 'Islamic Financial Terms Glossary downloaded.', 'success')}
              className="text-xs font-bold text-forest hover:text-gold-dark flex items-center space-x-1 pt-2"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Download Glossary (PDF)</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7 & 8. CONTACT DHIB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface-lightGreen rounded-3xl p-8 sm:p-12 border border-forest/15 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">
              Enquiries &amp; Academic Visits
            </span>
            <h3 className="text-2xl font-editorial font-bold text-forest">
              Connect with the DHIB Working Group
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-light max-w-xl">
              For student laboratory visits, guest workshops, and curricular exchange regarding Islamic banking literacy.
            </p>
            <div className="text-[11px] font-mono text-charcoal-muted pt-1">
              Official Desk: dhib.desk@dhiu.in [Placeholder]
            </div>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3.5 bg-forest hover:bg-emerald-deep text-white font-semibold text-xs rounded-xl shadow transition shrink-0"
          >
            Contact DHIB Coordinators
          </button>
        </div>
      </section>

    </div>
  );
};
