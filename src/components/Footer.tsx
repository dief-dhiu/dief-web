import React from 'react';
import { PageId } from '../types';
import { CrestLogo, IslamicStarIcon } from './IslamicPattern';
import { 
  Building2, 
  Briefcase, 
  BookOpen, 
  Mail, 
  Phone, 
  MapPin, 
  ExternalLink,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  const handleNav = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-forest text-white border-t-2 border-gold/40 relative overflow-hidden">
      {/* Decorative top pattern bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-forest-dark via-gold to-forest-dark"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-forest-light/60">
          
          {/* Col 1 & 2: Department Branding & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-start space-x-3.5">
              <CrestLogo size={48} className="bg-white/5 border-gold/50" />
              <div>
                <span className="text-[11px] tracking-widest text-gold uppercase font-semibold block">
                  Academic Department
                </span>
                <h3 className="font-editorial text-xl font-bold text-white tracking-tight leading-snug">
                  Department of Islamic Economics and Finance
                </h3>
                <p className="text-xs text-sage-light flex items-center space-x-1.5 mt-0.5">
                  <span>Institutional Affiliation: Darul Huda Islamic University</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-sage-subtle leading-relaxed pr-4">
              Dedicated to pioneering ethical, Shariah-grounded economic thought and contemporary financial jurisprudence. We integrate classical epistemological rigor with modern analytical methodologies to cultivate transformative research and institutional leadership.
            </p>

            {/* Arabic inscription banner */}
            <div className="bg-forest-dark/80 border border-gold/30 rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="font-arabic text-gold text-sm tracking-wide" dir="rtl">
                  قسم الاقتصاد والتمويل الإسلامي
                </div>
                <div className="text-[10px] text-sage-light">جامعة دار الهدى الإسلامية — كيرلا، الهند</div>
              </div>
              <IslamicStarIcon size={24} className="text-gold/60" />
            </div>

            <div className="pt-2 text-xs text-sage-light">
              <span className="font-medium text-white">One Department. Three Flagship Initiatives. One Unified Identity.</span>
            </div>
          </div>

          {/* Col 3: The Three Initiatives */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider text-gold uppercase font-sans flex items-center space-x-2">
              <IslamicStarIcon size={12} className="text-gold" />
              <span>Flagship Pillars</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button 
                  onClick={() => handleNav('dhib')}
                  className="group text-left text-sage-subtle hover:text-white transition flex items-center space-x-2"
                >
                  <Building2 className="w-3.5 h-3.5 text-gold group-hover:translate-x-0.5 transition-transform" />
                  <div>
                    <div className="font-semibold text-white">DHIB</div>
                    <div className="text-[11px] text-sage-light">Darul Huda Islamic Bank</div>
                  </div>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('sbc')}
                  className="group text-left text-sage-subtle hover:text-white transition flex items-center space-x-2"
                >
                  <Briefcase className="w-3.5 h-3.5 text-gold group-hover:translate-x-0.5 transition-transform" />
                  <div>
                    <div className="font-semibold text-white">SBC</div>
                    <div className="text-[11px] text-sage-light">Shariah Business Consultancy</div>
                  </div>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNav('tamweel')}
                  className="group text-left text-sage-subtle hover:text-white transition flex items-center space-x-2"
                >
                  <BookOpen className="w-3.5 h-3.5 text-gold group-hover:translate-x-0.5 transition-transform" />
                  <div>
                    <div className="font-semibold text-white">Tamweel</div>
                    <div className="text-[11px] text-sage-light">Journal of Islamic Economics & Finance</div>
                  </div>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Academic Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider text-gold uppercase font-sans flex items-center space-x-2">
              <IslamicStarIcon size={12} className="text-gold" />
              <span>Academic Platform</span>
            </h4>
            <ul className="space-y-2 text-xs text-sage-subtle">
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-white transition flex items-center space-x-1.5">
                  <ArrowRight className="w-3 h-3 text-gold/70" />
                  <span>About the Department</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('activities')} className="hover:text-white transition flex items-center space-x-1.5">
                  <ArrowRight className="w-3 h-3 text-gold/70" />
                  <span>Seminars & Conferences</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('resources')} className="hover:text-white transition flex items-center space-x-1.5">
                  <ArrowRight className="w-3 h-3 text-gold/70" />
                  <span>Curricular & Research Library</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('tamweel')} className="hover:text-white transition flex items-center space-x-1.5">
                  <ArrowRight className="w-3 h-3 text-gold/70" />
                  <span>Call for Papers (Tamweel)</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('sbc')} className="hover:text-white transition flex items-center space-x-1.5">
                  <ArrowRight className="w-3 h-3 text-gold/70" />
                  <span>Commercial Advisory Portal</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="text-gold hover:underline transition flex items-center space-x-1.5 pt-1">
                  <span>Department Admin CMS</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Placeholders */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold tracking-wider text-gold uppercase font-sans flex items-center space-x-2">
              <IslamicStarIcon size={12} className="text-gold" />
              <span>Contact Directory</span>
            </h4>
            <div className="space-y-2.5 text-xs text-sage-subtle">
              <div className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Department of Islamic Economics and Finance<br />
                  Under Kulliyya of Sharia, Darul Huda Islamic University<br />
                  Chemmad, Malappuram, Kerala – 676306, India
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
                <span className="text-[11px] font-mono text-sage-light">
                  islamiceco@darulhudaiu.ac.in
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                <span className="text-[11px] font-mono text-sage-light">
                  +91 81295 95547 / +91 99462 92164
                </span>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleNav('contact')}
                  className="w-full text-center px-3 py-2 bg-gold/15 hover:bg-gold text-gold hover:text-forest border border-gold/40 rounded-lg text-xs font-semibold transition"
                >
                  Send Department Enquiry
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Institutional & Legal Scope Disclaimers */}
        <div className="mt-8 pt-6 border-t border-forest-light/40 bg-forest-dark/40 rounded-xl p-4 text-[11px] text-sage-light space-y-2">
          <div className="flex items-center space-x-2 text-gold font-semibold uppercase tracking-wider text-[10px]">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Academic & Institutional Declarations</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 leading-relaxed">
            <div>
              <strong className="text-white">Independent Digital Platform:</strong> This website represents the Department of Islamic Economics and Finance. Darul Huda Islamic University serves strictly as the institutional parent university.
            </div>
            <div>
              <strong className="text-white">DHIB Operational Status:</strong> Darul Huda Islamic Bank operates strictly as an academic, educational sandbox and financial literacy platform, not a licensed commercial deposit-taking institution.
            </div>
            <div>
              <strong className="text-white">SBC Advisory Scope:</strong> Shariah Business Consultancy provides academic and commercial ethical advisory services; it does not issue state statutory audits or formal state legal decrees.
            </div>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-sage-light gap-4">
          <p>© {new Date().getFullYear()} Department of Islamic Economics and Finance, Darul Huda Islamic University. All rights reserved.</p>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>Privacy Guidelines</span>
            <span>•</span>
            <span>Academic Integrity Policy</span>
            <span>•</span>
            <span>Sitemap</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
