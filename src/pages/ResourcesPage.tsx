import React, { useState } from 'react';
import { PageId, ResourceItem } from '../types';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  BookOpen, 
  ExternalLink, 
  Calendar, 
  CheckCircle2,
  FolderOpen,
  ArrowRight
} from 'lucide-react';
import { IslamicStarIcon } from '../components/IslamicPattern';

interface ResourcesPageProps {
  onNavigate: (page: PageId) => void;
  resources: ResourceItem[];
  selectedResourceId?: string;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({
  onNavigate,
  resources,
  selectedResourceId,
  onShowToast
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'All',
    'Research Papers',
    'Books and Reading Materials',
    'Islamic Economics Resources',
    'Islamic Finance Resources',
    'Academic Reports',
    'Lecture Materials',
    'Journal Publications'
  ];

  const filteredResources = resources.filter((res) => {
    const matchCat = selectedCategory === 'All' || res.category === selectedCategory;
    const matchSearch = !searchQuery || 
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDownload = (res: ResourceItem) => {
    onShowToast('Resource Download Initiated', `Downloading ${res.title} (${res.fileSize})`, 'success');
  };

  return (
    <div className="space-y-16 py-8">
      
      {/* HEADER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden border-2 border-gold/40 shadow-elevated">
          <div className="absolute inset-0 pattern-dark-islamic opacity-30 pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold border border-gold/30">
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Curricular &amp; Scholarly Repository</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-white tracking-tight">
              Central Resource Library
            </h1>

            <div className="font-arabic text-lg sm:text-xl text-sage-light" dir="rtl">
              المكتبة والمستودع الأكاديمي لمراجع الاقتصاد والتمويل الإسلامي
            </div>

            <p className="text-sm sm:text-base text-sage-subtle leading-relaxed">
              Access peer-reviewed working papers, course reading lists, Fiqh al-Mu’amalat legal maxims primers, and practical Islamic banking reference materials curated by departmental faculty and research fellows.
            </p>
          </div>
        </div>
      </section>

      {/* FILTER & SEARCH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 border border-forest/10 shadow-soft space-y-4">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources by title, keywords, or author..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-ivory/60 border border-gray-200 rounded-xl focus:border-forest focus:outline-none font-medium"
              />
            </div>

            <div className="text-xs text-charcoal-muted font-medium">
              Showing <strong className="text-forest">{filteredResources.length}</strong> available documents
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-semibold">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-forest text-white shadow-sm'
                    : 'bg-ivory text-charcoal hover:bg-surface-lightGreen'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* RESOURCES LISTING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredResources.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8">
            <IslamicStarIcon size={36} className="mx-auto text-gold mb-3" />
            <h3 className="font-editorial text-xl font-bold text-forest">No resources match your search</h3>
            <p className="text-xs text-charcoal-muted mt-1">Try resetting the category filter or searching different terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="bg-white rounded-2xl border border-forest/10 hover:border-gold/60 p-6 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gold-dark uppercase tracking-wider bg-gold/15 px-2.5 py-0.5 rounded">
                      {res.category}
                    </span>
                    <span className="text-[11px] font-mono text-charcoal-muted bg-ivory px-2 py-0.5 rounded border border-gray-100">
                      {res.fileType} • {res.fileSize}
                    </span>
                  </div>

                  <h3 className="font-editorial text-base sm:text-lg font-bold text-forest group-hover:text-emerald-deep leading-snug">
                    {res.title}
                  </h3>

                  <div className="text-[11px] text-charcoal-muted space-y-0.5">
                    <div>Author / Source: <strong className="text-charcoal font-medium">{res.author}</strong></div>
                    <div>Year: {res.year} • Language: {res.language}</div>
                  </div>

                  <p className="text-xs text-charcoal-light line-clamp-3 leading-relaxed pt-1">
                    {res.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => handleDownload(res)}
                    className="w-full py-2 bg-surface-lightGreen hover:bg-forest text-forest hover:text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download {res.fileType} Document</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};
