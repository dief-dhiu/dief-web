import React from 'react';
import { PageId } from '../types';
import {
  Building2,
  ShieldAlert,
  TrendingUp,
  CheckCircle2,
  GraduationCap,
  Layers,
  ArrowRight,
  Mail,
  HelpCircle
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
        <div className="bg-[#1D4ED8] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden border-2 border-gold/40 shadow-elevated">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">

              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold border border-gold/30">
                <Building2 className="w-3.5 h-3.5" />
                <span>Department Flagship Initiative 01</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-white tracking-tight">
                DHIB <br />
                <span className="text-xl sm:text-2xl font-editorial text-white font-semibold">Darul Huda Islamic Bank</span>
              </h1>



              <p className="text-sm sm:text-base text-sage-subtle leading-relaxed max-w-2xl">
                An innovative academic financial laboratory, exploratory sandbox, and community financial literacy platform dedicated to investigating, modeling, and demonstrating Shariah-compliant, interest-free banking paradigms.
              </p>


              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href="#principles"
                  className="px-5 py-3 bg-gold hover:bg-gold-light text-charcoal font-bold text-xs rounded-xl shadow transition"
                >
                  Islamic Banking Principles
                </a>
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
            <h3 className="text-2xl font-editorial font-bold text-charcoal">Pioneering Fair Financial Horizons</h3>
            <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
              To cultivate an authoritative, educational bridge between classical Islamic commercial ethics and modern monetary institutions, empowering students and community stakeholders with practical mastery of interest-free participatory banking.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-forest/10 shadow-soft space-y-3">
            <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">DHIB Mission</span>
            <h3 className="text-2xl font-editorial font-bold text-charcoal">Hands-on Literacy &amp; Research</h3>
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
          <h2 className="text-3xl font-editorial font-bold text-charcoal">
            Core Principles of Islamic Banking
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            The fundamental ethical pillars separating Islamic finance from conventional interest-based financial intermediation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white p-6 rounded-2xl border border-forest/10 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1D4ED8] text-white flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h4 className="font-editorial text-lg font-bold text-charcoal">Prohibition of Riba (Interest/Usury)</h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Money is a medium of exchange and measure of value, not an autonomous commodity. Guaranteed fixed increments charged on credit loans are strictly forbidden.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-forest/10 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1D4ED8] text-white flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h4 className="font-editorial text-lg font-bold text-charcoal">Elimination of Gharar &amp; Maysir</h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Zero tolerance for excessive uncertainty (Gharar) and pure gambling speculation (Maysir). Contracts require absolute transparency regarding terms, assets, and delivery.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-forest/10 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1D4ED8] text-white flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h4 className="font-editorial text-lg font-bold text-charcoal">Risk Sharing &amp; Partnership</h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Profits and losses must be shared in accordance with predetermined ratios (Al-Ghunm bi al-Ghurm). Capital cannot demand reward without bearing legitimate commercial risk.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-forest/10 shadow-soft space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#1D4ED8] text-white flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h4 className="font-editorial text-lg font-bold text-charcoal">Real Asset Backing</h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Financial transactions must be intrinsically linked to identifiable, tangible economic goods, services, or usufruct, preventing synthetic leverage bubbles.
            </p>
          </div>

        </div>
      </section>

      {/* 7 & 8. CONTACT DHIB */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-charcoal/5 rounded-3xl p-8 sm:p-12 border border-charcoal/15 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">
              Enquiries &amp; Academic Visits
            </span>
            <h3 className="text-2xl font-editorial font-bold text-charcoal">
              Connect with the DHIB Working Group
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-light max-w-xl">
              For student laboratory visits, guest workshops, and curricular exchange regarding Islamic banking literacy.
            </p>
            <div className="text-[11px] font-mono text-charcoal-muted pt-1">
              Official Desk: <a href="mailto:dief@dhiu.in" className="hover:underline text-charcoal font-semibold">dief@dhiu.in</a>
            </div>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3.5 bg-[#1D4ED8] hover:bg-[#2563EA] text-white font-semibold text-xs rounded-xl shadow transition shrink-0"
          >
            Contact DHIB Coordinators
          </button>
        </div>
      </section>

    </div>
  );
};
