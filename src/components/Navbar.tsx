import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  currentPage?: PageId;
  onNavigate?: (page: PageId) => void;
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
  const location = useLocation();
  const navigate = useNavigate();

  // Determine active page from current path if currentPage not explicitly passed
  const getActivePage = (): PageId => {
    if (currentPage) return currentPage;
    const p = location.pathname;
    if (p === '/' || p === '/home') return 'home';
    if (p.startsWith('/about')) return 'about';
    if (p.startsWith('/dhib')) return 'dhib';
    if (p.startsWith('/sbc')) return 'sbc';
    if (p.startsWith('/tamweel')) return 'tamweel';
    if (p.startsWith('/activities')) return 'activities';
    if (p.startsWith('/contact')) return 'contact';
    return 'home';
  };

  const activePage = getActivePage();

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
    const isActive = activePage === page;
    return `relative py-2 text-sm font-medium tracking-wide transition-colors duration-200 ${
      isActive 
        ? 'text-forest font-semibold' 
        : 'text-charcoal hover:text-forest'
    }`;
  };

  const pagePathMap: Record<PageId, string> = {
    home: '/',
    about: '/about',
    dhib: '/dhib',
    sbc: '/sbc',
    tamweel: '/tamweel',
    activities: '/activities',
    contact: '/contact'
  };

  const handleNavClick = (page: PageId) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      navigate(pagePathMap[page] || '/');
    }
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-forest/10 py-2.5' 
        : 'bg-ivory/95 backdrop-blur-sm border-b border-gold/20 py-3.5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 lg:gap-8">
          
          {/* Brand & Department Title */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 sm:space-x-4 cursor-pointer group select-none shrink-0 pr-2 lg:pr-4 py-1"
          >
            <img 
              src="/dief-logo.png" 
              alt="Department of Islamic Economics and Finance Official Logo" 
              className="h-14 sm:h-16 lg:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col justify-center">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-forest/80 font-bold font-sans">
                Department of
              </span>
              <span className="text-base sm:text-xl lg:text-2xl font-editorial font-bold text-forest tracking-tight group-hover:text-emerald-deep transition-colors leading-tight">
                Islamic Economics &amp; Finance
              </span>
              <span className="text-[10px] sm:text-[11px] text-charcoal-muted flex items-center space-x-1.5 mt-0.5">
                <span>Under Kulliyya of Sharia, DHIU</span>
                <span className="text-gold">•</span>
                <span>Kerala, India</span>
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
              {activePage === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest rounded-full" />
              )}
            </button>

            {/* About */}
            <button 
              onClick={() => handleNavClick('about')}
              className={navItemClass('about')}
            >
              About
              {activePage === 'about' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest rounded-full" />
              )}
            </button>

            {/* Direct Initiatives Links */}
            <button 
              onClick={() => handleNavClick('dhib')}
              className={navItemClass('dhib')}
            >
              DHIB
              {activePage === 'dhib' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest rounded-full" />
              )}
            </button>

            <button 
              onClick={() => handleNavClick('sbc')}
              className={navItemClass('sbc')}
            >
              SBC
              {activePage === 'sbc' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest rounded-full" />
              )}
            </button>

            <button 
              onClick={() => handleNavClick('tamweel')}
              className={navItemClass('tamweel')}
            >
              Tamweel
              {activePage === 'tamweel' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest rounded-full" />
              )}
            </button>

            <button 
              onClick={() => handleNavClick('activities')}
              className={navItemClass('activities')}
            >
              Activities
              {activePage === 'activities' && (
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
                activePage === 'contact'
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
              className={`p-2.5 rounded-lg text-left text-xs font-semibold ${activePage === 'home' ? 'bg-forest text-white' : 'bg-ivory text-charcoal'}`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('about')}
              className={`p-2.5 rounded-lg text-left text-xs font-semibold ${activePage === 'about' ? 'bg-forest text-white' : 'bg-ivory text-charcoal'}`}
            >
              About Department
            </button>
          </div>

          <div className="pt-2">
            <div className="text-xs font-bold text-forest uppercase tracking-wider mb-2">Four Pillars</div>
            <div className="space-y-1.5">
              <button 
                onClick={() => handleNavClick('dhib')}
                className={`w-full flex items-center space-x-2 p-2.5 rounded-lg text-xs font-medium text-left ${activePage === 'dhib' ? 'bg-forest text-white' : 'hover:bg-surface-lightGreen text-charcoal'}`}
              >
                <Building2 className="w-4 h-4 text-gold shrink-0" />
                <span>DHIB – Darul Huda Islamic Bank</span>
              </button>
              <button 
                onClick={() => handleNavClick('sbc')}
                className={`w-full flex items-center space-x-2 p-2.5 rounded-lg text-xs font-medium text-left ${activePage === 'sbc' ? 'bg-forest text-white' : 'hover:bg-surface-lightGreen text-charcoal'}`}
              >
                <Briefcase className="w-4 h-4 text-gold shrink-0" />
                <span>SBC – Shariah Business Consultancy</span>
              </button>
              <button 
                onClick={() => handleNavClick('tamweel')}
                className={`w-full flex items-center space-x-2 p-2.5 rounded-lg text-xs font-medium text-left ${activePage === 'tamweel' ? 'bg-forest text-white' : 'hover:bg-surface-lightGreen text-charcoal'}`}
              >
                <BookOpen className="w-4 h-4 text-gold shrink-0" />
                <span>Tamweel – Academic Journal</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
            <button 
              onClick={() => handleNavClick('activities')}
              className={`p-2 text-center rounded-lg text-xs font-medium ${activePage === 'activities' ? 'bg-forest text-white' : 'bg-ivory text-charcoal'}`}
            >
              Activities
            </button>
            <button 
              onClick={() => handleNavClick('contact')}
              className={`p-2 text-center rounded-lg text-xs font-medium ${activePage === 'contact' ? 'bg-forest text-white' : 'bg-ivory text-charcoal'}`}
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
