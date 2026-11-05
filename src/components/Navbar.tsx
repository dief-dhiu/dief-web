import React, { useState, useEffect } from 'react';
import { PageId } from '../types';
import { CrestLogo, IslamicStarIcon } from './IslamicPattern';
import { 
  Search, 
  Menu, 
  X, 
  Building2, 
  Briefcase, 
  BookOpen, 
  ShieldCheck, 
  Settings,
  Calendar,
  FileText,
  Mail
} from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  pendingCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  onOpenSearch,
  onOpenAdmin,
  pendingCount = 0
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItemClass = (page: PageId) => {
    const isActive = currentPage === page;
    return `relative py-2 text-sm font-medium tracking-wide transition-colors duration-200 ${
      isActive 
        ? 'text-forest font-semibold' 
        : 'text-charcoal hover:text-forest'
    }`;
  };

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-forest/10 py-2.5' 
        : 'bg-ivory/95 backdrop-blur-sm border-b border-gold/20 py-3.5'
    }`}>
      {/* Top micro affiliation banner */}
      <div className="hidden lg:block border-b border-forest/5 pb-1.5 mb-2 text-xs text-charcoal-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gold"></span>
            <span className="font-medium tracking-wider text-forest uppercase text-[11px]">
              Institutional Affiliation:
            </span>
            <span className="font-semibold text-charcoal">Under Kulliyya of Sharia, Darul Huda Islamic University, Kerala, India</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-charcoal-muted">
            <span className="font-arabic text-sm text-forest" dir="rtl">
              قسم الاقتصاد والتمويل الإسلامي — كلية الشريعة
            </span>
            <span className="text-gray-300">|</span>
            <button 
              onClick={onOpenAdmin}
              className="inline-flex items-center space-x-1.5 text-forest hover:text-gold transition font-medium"
              title="Open Department Admin / CMS Hub"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin Hub</span>
              {pendingCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-gold text-forest font-bold rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 lg:gap-8">
          
          {/* Brand & Department Title */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3.5 cursor-pointer group select-none shrink-0 pr-2 lg:pr-4"
          >
            <CrestLogo size={42} className="group-hover:border-gold transition-colors duration-300" />
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-widest text-forest font-semibold font-sans">
                Department of
              </span>
              <span className="text-lg sm:text-xl font-editorial font-bold text-forest tracking-tight group-hover:text-emerald-deep transition-colors leading-tight">
                Islamic Economics & Finance
              </span>
              <span className="text-[11px] text-charcoal-muted flex items-center space-x-1">
                <span>Under Kulliyya of Sharia, DHIU</span>
                <span className="text-gold">•</span>
                <span className="font-arabic text-[12px] text-forest">كيرلا</span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-6">
            <button 
              onClick={() => handleNavClick('home')}
              className={navItemClass('home')}
            >
              Home
              {currentPage === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest rounded-full" />
              )}
            </button>

            {/* About */}
            <button 
              onClick={() => handleNavClick('about')}
              className={navItemClass('about')}
            >
              About
              {currentPage === 'about' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest rounded-full" />
              )}
            </button>

            {/* Direct Initiatives Links */}
            <button 
              onClick={() => handleNavClick('dhib')}
              className={navItemClass('dhib')}
            >
              DHIB
              {currentPage === 'dhib' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest rounded-full" />
              )}
            </button>

            <button 
              onClick={() => handleNavClick('sbc')}
              className={navItemClass('sbc')}
            >
              SBC
              {currentPage === 'sbc' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest rounded-full" />
              )}
            </button>

            <button 
              onClick={() => handleNavClick('tamweel')}
              className={navItemClass('tamweel')}
            >
              Tamweel
              {currentPage === 'tamweel' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest rounded-full" />
              )}
            </button>

            <button 
              onClick={() => handleNavClick('activities')}
              className={navItemClass('activities')}
            >
              Activities
              {currentPage === 'activities' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest rounded-full" />
              )}
            </button>

            <button 
              onClick={() => handleNavClick('resources')}
              className={navItemClass('resources')}
            >
              Resources
              {currentPage === 'resources' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest rounded-full" />
              )}
            </button>
          </nav>

          {/* Action buttons (Search, Contact CTA & Mobile Toggle) */}
          <div className="flex items-center space-x-3 shrink-0">
            <button 
              onClick={onOpenSearch}
              className="p-2 text-charcoal hover:text-forest rounded-full hover:bg-forest/5 transition flex items-center space-x-1.5"
              title="Search Portal (Ctrl + K)"
            >
              <Search className="w-4 h-4" />
              <span className="hidden xl:inline text-xs text-charcoal-muted border border-gray-200 px-1.5 py-0.5 rounded">⌘K</span>
            </button>

            <button 
              onClick={() => handleNavClick('contact')}
              className={`hidden sm:inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition shadow-sm hover:shadow ${
                currentPage === 'contact'
                  ? 'bg-emerald-deep text-white ring-2 ring-gold'
                  : 'bg-forest hover:bg-emerald-deep text-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-gold" />
              <span>Contact Department</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-forest rounded-lg hover:bg-forest/5 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-forest/15 px-4 pt-4 pb-6 mt-3 space-y-3 shadow-elevated animate-fadeIn">
          <div className="text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider pb-2 border-b border-gray-100 flex items-center justify-between">
            <span>Navigation Menu</span>
            <span className="font-arabic text-forest">دار الهدى الإسلامية</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => handleNavClick('home')}
              className={`p-2.5 rounded-lg text-left text-xs font-semibold ${currentPage === 'home' ? 'bg-forest text-white' : 'bg-ivory text-charcoal'}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('about')}
              className={`p-2.5 rounded-lg text-left text-xs font-semibold ${currentPage === 'about' ? 'bg-forest text-white' : 'bg-ivory text-charcoal'}`}
            >
              About Department
            </button>
          </div>

          <div className="pt-2">
            <div className="text-xs font-bold text-forest uppercase tracking-wider mb-2">Four Pillars</div>
            <div className="space-y-1.5">
              <button 
                onClick={() => handleNavClick('dhib')}
                className={`w-full flex items-center space-x-2 p-2.5 rounded-lg text-xs font-medium text-left ${currentPage === 'dhib' ? 'bg-forest text-white' : 'hover:bg-surface-lightGreen text-charcoal'}`}
              >
                <Building2 className="w-4 h-4 text-gold shrink-0" />
                <span>DHIB – Darul Huda Islamic Bank</span>
              </button>
              <button 
                onClick={() => handleNavClick('sbc')}
                className={`w-full flex items-center space-x-2 p-2.5 rounded-lg text-xs font-medium text-left ${currentPage === 'sbc' ? 'bg-forest text-white' : 'hover:bg-surface-lightGreen text-charcoal'}`}
              >
                <Briefcase className="w-4 h-4 text-gold shrink-0" />
                <span>SBC – Shariah Business Consultancy</span>
              </button>
              <button 
                onClick={() => handleNavClick('tamweel')}
                className={`w-full flex items-center space-x-2 p-2.5 rounded-lg text-xs font-medium text-left ${currentPage === 'tamweel' ? 'bg-forest text-white' : 'hover:bg-surface-lightGreen text-charcoal'}`}
              >
                <BookOpen className="w-4 h-4 text-gold shrink-0" />
                <span>Tamweel – Academic Journal</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
            <button 
              onClick={() => handleNavClick('activities')}
              className={`p-2 text-center rounded-lg text-xs font-medium ${currentPage === 'activities' ? 'bg-forest text-white' : 'bg-ivory text-charcoal'}`}
            >
              Activities
            </button>
            <button 
              onClick={() => handleNavClick('resources')}
              className={`p-2 text-center rounded-lg text-xs font-medium ${currentPage === 'resources' ? 'bg-forest text-white' : 'bg-ivory text-charcoal'}`}
            >
              Resources
            </button>
            <button 
              onClick={() => handleNavClick('contact')}
              className={`p-2 text-center rounded-lg text-xs font-medium ${currentPage === 'contact' ? 'bg-forest text-white' : 'bg-ivory text-charcoal'}`}
            >
              Contact
            </button>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs border-t border-gray-100">
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenSearch(); }}
              className="flex items-center space-x-1.5 text-forest font-semibold"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search Database</span>
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
              className="flex items-center space-x-1 text-gold-dark font-medium"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin Hub</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
