import React, { useState, useEffect } from 'react';
import { PageId, FacultyMember } from '../types';
import { FacultyProfile } from '../types/faculty';
import { fetchPublicFacultyProfiles } from '../lib/facultyService';
import {
  Building2,
  Target,
  Eye,
  BookOpen,
  Compass,
  CheckCircle2,
  GraduationCap,
  Mail,
  Phone,
  ArrowRight,
  Globe2,
  Calendar,
  History,
  Sparkles,
  Award,
  Loader2,
  UserCheck
} from 'lucide-react';
import { IslamicStarIcon } from '../components/IslamicPattern';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
  faculty?: FacultyMember[];
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, faculty }) => {
  const [liveProfiles, setLiveProfiles] = useState<FacultyProfile[]>([]);
  const [facultyLoading, setFacultyLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadFaculty() {
      try {
        const data = await fetchPublicFacultyProfiles();
        if (isMounted) {
          setLiveProfiles(data);
        }
      } catch (err) {
        console.error('Failed to load public faculty profiles:', err);
      } finally {
        if (isMounted) {
          setFacultyLoading(false);
        }
      }
    }
    loadFaculty();
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <div className="space-y-16 lg:space-y-24 py-8">

      {/* HEADER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl border-2 border-gold/40">
          <div className="absolute inset-0 pattern-dark-islamic opacity-30 pointer-events-none"></div>

          <div className="relative z-10 max-w-4xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold border border-gold/30">

              <span>Academic Prospectus &amp; Overview</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-white tracking-tight">
              About the Department
            </h1>

            <p className="text-sm sm:text-base text-sage-light leading-relaxed pt-2 max-w-3xl">
              Offering a rigorous and holistic academic environment focused on Islamic economic ideologies rooted in Shari’ah principles and modern financial understanding. Founded with the aim of Islamizing modern financial practices.
            </p>
          </div>
        </div>
      </section>

      {/* 1. ABOUT THE DEPARTMENT / INTRODUCTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-gold-dark uppercase tracking-wider">

              <span>Academic Environment</span>
            </div>
            <h2 className="text-3xl font-editorial font-bold text-forest leading-tight">
              A Beacon of Educational Excellence
            </h2>
            <div className="text-sm sm:text-base text-charcoal-light space-y-4 leading-relaxed">
              <p>
                The <strong>Department of Islamic Economics and Finance</strong> under the <strong>Kulliyya of Sharia at Darul Huda Islamic University</strong> offers a rigorous and holistic academic environment focused on Islamic economic ideologies rooted in Shari’ah principles and modern financial understanding.
              </p>
              <p>
                Founded with the aim of Islamizing modern financial practices, the department provides Postgraduate (M.A.), Undergraduate (B.A.), and Diploma/Certificate programs that prepare graduates for real-world financial challenges through the lens of Islamic jurisprudence.
              </p>
              <p>
                This department serves as a beacon of educational excellence, blending the classical scholarship of Islam with the dynamics of the global financial system, offering a pathway to academic mastery and spiritual growth.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-elevated border border-forest/15 aspect-[4/3]">
              <img
                src="/IF Logo Web.jpg"
                alt="Scholars and students in academic discussion"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs p-3.5 bg-forest/90 backdrop-blur-md rounded-xl border border-gold/30">
                <span className="font-bold text-gold">Kulliyya of Sharia Mandate:</span> Blending the classical scholarship of Islam with the dynamics of the global financial system.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HISTORY AND LEGACY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-surface-lightGreen/50 rounded-3xl p-8 sm:p-12 border border-forest/15 space-y-8">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-gold-dark uppercase tracking-wider">

              <span>Origins &amp; Growth</span>
            </div>
            <h2 className="text-3xl font-editorial font-bold text-forest">
              History and Legacy of the Department
            </h2>
            <p className="text-sm text-charcoal-light leading-relaxed">
              The Department of Islamic Economics and Finance was formally established in <strong>2020</strong> as a vibrant academic division under the Kulliyya of Sharia at Darul Huda Islamic University. Its formation was the culmination of extensive scholarly discourse and visionary planning by prominent Islamic thinkers and university lecturers, deeply invested in the project of <strong>Islamization of Knowledge (IOK)</strong>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-forest/10 shadow-soft space-y-3">
              <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">Phase 01</span>
              <h4 className="font-editorial text-lg font-bold text-forest">Origins &amp; Early Development</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Initially focused on the <em>Fiqh of Mu’amalat</em> — the jurisprudence of financial transactions in Islam — laying a solid jurisprudential foundation for students.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-forest border-t border-gray-100">
                Led by K.C. Muhammed Baqawi (Classical Fiqh-based economic insights).
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-forest/10 shadow-soft space-y-3">
              <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">Phase 02</span>
              <h4 className="font-editorial text-lg font-bold text-forest">Systematization &amp; Curricular Expansion</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                The structure and curriculum were later systematized and expanded under the leadership of Dr. K.P. Jafar Hudawi Kolathur, who envisioned a specialized academic model for Islamic economics and finance that integrates theory with applied practices.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-forest border-t border-gray-100">
                Under Dr. K.P. Jafar Hudawi Kolathur (Dean, Kulliyya of Sharia).
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-forest/10 shadow-soft space-y-3">
              <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">Phase 03</span>
              <h4 className="font-editorial text-lg font-bold text-forest">Expansion &amp; Specialization</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                With continuous academic refinement, the department diversified into multiple areas of Islamic finance, offering elective specialization papers and fostering interdisciplinary research.
              </p>
              <div className="pt-2 text-[11px] font-semibold text-forest border-t border-gray-100">
                Currently headed by Anas Hudawi Nellikkuth.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VISION & MISSION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Vision Card */}
          <div className="bg-white rounded-2xl p-8 border border-forest/10 shadow-soft space-y-4">
            <div className="w-12 h-12 rounded-xl bg-forest/5 text-forest flex items-center justify-center">
              <Eye className="w-6 h-6 text-forest" />
            </div>
            <span className="text-[11px] font-bold text-gold-dark uppercase tracking-wider block">
              Official Vision Statement
            </span>
            <h3 className="text-2xl font-editorial font-bold text-forest">
              Vision of the Department
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
              "The Department of Islamic Economics and Finance aspires to become a global bastion of excellence in Islamic economics and finance, reviving the dynamic intellectual legacy of past Muslim societies and Islamic economist’s thought.
            </p>
            <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
              We seek to rekindle the spirit of scholarly leadership in Islamic economic theory and practice in an ever-evolving world shaped by modern sciences and financial paradigms. Our vision is also centered on the Islamization of conventional economic systems, providing ethical and Shari’ah-compliant alternatives, and establishing international relations with departments of Islamic economics and finance existing in various Islamic universities, dedicated to high-standard academic inquiry and policy development in various sectors of Islamic economics and finance."
            </p>
          </div>

          {/* Mission Card */}
          <div className="bg-white rounded-2xl p-8 border border-forest/10 shadow-soft space-y-4">
            <div className="w-12 h-12 rounded-xl bg-forest/5 text-forest flex items-center justify-center">
              <Target className="w-6 h-6 text-forest" />
            </div>
            <span className="text-[11px] font-bold text-gold-dark uppercase tracking-wider block">
              Official Mission Statement
            </span>
            <h3 className="text-2xl font-editorial font-bold text-forest">
              Mission of the Department
            </h3>
            <div className="space-y-4 text-xs sm:text-sm text-charcoal-light">
              <div>
                <strong className="text-forest block mb-1">Our mission is to:</strong>
                <p className="mb-2">Develop a comprehensive Islamic educational framework for training future Islamic economists and finance experts who:</p>
                <ul className="space-y-1.5 pl-4 list-disc text-xs text-charcoal-muted">
                  <li>Practice and propagate Islamic economic ideologies</li>
                  <li>Uphold spiritual and moral responsibility towards Allah, society, and global resources</li>
                  <li>Are equipped to compete with and challenge modern economic trends</li>
                </ul>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <p className="mb-2">Offer a holistic understanding of conventional economics through an Islamic lens, ensuring harmony between:</p>
                <ul className="space-y-1.5 pl-4 list-disc text-xs text-charcoal-muted">
                  <li>Material and spiritual development</li>
                  <li>Economic justice and social responsibility</li>
                  <li>Academic rigor and ethical guidance</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. PHILOSOPHY OF THE DEPARTMENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden border-2 border-gold/40 shadow-elevated">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-gold uppercase tracking-wider">

              <span>Epistemic Foundation</span>
            </div>
            <h2 className="text-3xl font-editorial font-bold text-white">
              Philosophy of the Department
            </h2>
            <p className="text-xs sm:text-sm text-sage-light leading-relaxed">
              Our educational philosophy is rooted in the Islamic worldview, characterized by the unity and hierarchy of knowledge, and guided by the following foundational beliefs:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            <div className="bg-forest-dark/90 rounded-2xl p-6 border border-gold/30 space-y-2">
              <span className="font-mono text-gold text-xs font-bold">01</span>
              <h4 className="font-editorial text-base font-bold text-white">Ultimate Source</h4>
              <p className="text-xs text-sage-light leading-relaxed">
                Allah (Al-‘Allām) is the ultimate source of all knowledge, and the end goal of every scholarly pursuit.
              </p>
            </div>

            <div className="bg-forest-dark/90 rounded-2xl p-6 border border-gold/30 space-y-2">
              <span className="font-mono text-gold text-xs font-bold">02</span>
              <h4 className="font-editorial text-base font-bold text-white">Revelation &amp; Prophetic Guidance</h4>
              <p className="text-xs text-sage-light leading-relaxed">
                Revelation and Prophetic knowledge are trustworthy sources of guidance, enriched by classical interpretations of authentic Muslim scholars.
              </p>
            </div>

            <div className="bg-forest-dark/90 rounded-2xl p-6 border border-gold/30 space-y-2">
              <span className="font-mono text-gold text-xs font-bold">03</span>
              <h4 className="font-editorial text-base font-bold text-white">Three Interrelated Goals</h4>
              <div className="text-xs text-sage-light space-y-1">
                <div>• <strong>Ta’leem</strong> (Instruction)</div>
                <div>• <strong>Tarbiyah</strong> (Moral and intellectual nurturing)</div>
                <div>• <strong>Da’wah</strong> (Propagation of Islamic values)</div>
              </div>
            </div>

            <div className="bg-forest-dark/90 rounded-2xl p-6 border border-gold/30 space-y-2">
              <span className="font-mono text-gold text-xs font-bold">04</span>
              <h4 className="font-editorial text-base font-bold text-white">Progress of the Ummah</h4>
              <p className="text-xs text-sage-light leading-relaxed">
                Knowledge is to be internalized and disseminated for the benefit of humanity and the progress of the Ummah.
              </p>
            </div>

            <div className="bg-forest-dark/90 rounded-2xl p-6 border border-gold/30 space-y-2 sm:col-span-2">
              <span className="font-mono text-gold text-xs font-bold">05</span>
              <h4 className="font-editorial text-base font-bold text-white">Integration with Modern Expertise</h4>
              <p className="text-xs text-sage-light leading-relaxed">
                The curriculum is committed to blending traditional Islamic sciences with modern economic expertise, allowing students to engage critically with contemporary global challenges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ACADEMIC PROGRAMS OVERVIEW (B.A., M.A., DIPLOMA/CERTIFICATE) */}
      <section id="programmes-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold tracking-widest text-gold-dark uppercase font-sans">
            Formal Curricula
          </span>
          <h2 className="text-3xl font-editorial font-bold text-forest">
            Academic Programs Overview
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            The department offers multi-level academic programs designed to provide both foundational and advanced expertise in Islamic economics and finance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* B.A. Program */}
          <div className="bg-white rounded-2xl border border-forest/15 p-7 shadow-soft space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 text-[10px] font-bold text-gold-dark uppercase tracking-wider bg-gold/15 px-2.5 py-1 rounded">
                Undergraduate
              </div>
              <h3 className="font-editorial text-xl font-bold text-forest">
                Undergraduate Program (B.A.)
              </h3>
              <div className="space-y-2 text-xs text-charcoal-light">
                <div>• <strong>Core Subject:</strong> Principles of Islamic Economics and Finance</div>
                <div>• <strong>Languages of Instruction:</strong> Arabic and English</div>
                <div>• <strong>Research Component:</strong> Students complete a supervised dissertation with access to leading Islamic economists and Shariah scholars.</div>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100 text-[11px] text-charcoal-muted">
              Prepares graduates for foundational understanding through the lens of Islamic jurisprudence.
            </div>
          </div>

          {/* M.A. Program */}
          <div className="bg-white rounded-2xl border-2 border-forest p-7 shadow-elevated space-y-4 flex flex-col justify-between relative">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 text-[10px] font-bold text-white uppercase tracking-wider bg-forest px-2.5 py-1 rounded">
                Flagship Postgraduate
              </div>
              <h3 className="font-editorial text-xl font-bold text-forest">
                M.A. in Islamic Economics &amp; Finance
              </h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                A two-year Master’s program that offers deep knowledge in Islamic finance, banking, monetary systems, and ethical investment, empowering students with theoretical foundations and practical expertise.
              </p>

              <div className="space-y-2 text-xs text-charcoal-light pt-2 border-t border-gray-100">
                <div className="font-bold text-forest">Mandatory Core Papers:</div>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-charcoal-muted pl-1">
                  <li>Principles of Islamic Economics and Finance</li>
                  <li>Islamic Economist’s Thought</li>
                  <li>Islamic Social Finance</li>
                  <li>Islamic Public Finance</li>
                  <li>Islamic Banking</li>
                  <li>Islamic Financial Transactions</li>
                </ol>
                <div className="pt-1">
                  <strong>Elective Paper:</strong> Maqasid al-Shariah in Economic Context
                </div>
                <div className="text-[11px]">
                  <strong>Instruction:</strong> Arabic &amp; English • Includes Supervised Thesis
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100 text-[11px] text-forest font-semibold">
              Focus: Islamic Economic World View, Banking Operations, Social Finance &amp; Maqasid.
            </div>
          </div>

          {/* Diploma & Certificate */}
          <div className="bg-white rounded-2xl border border-forest/15 p-7 shadow-soft space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 text-[10px] font-bold text-gold-dark uppercase tracking-wider bg-gold/15 px-2.5 py-1 rounded">
                Executive &amp; Public
              </div>
              <h3 className="font-editorial text-xl font-bold text-forest">
                Diploma &amp; Certificate Courses
              </h3>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Short-term, public-facing programs offered in collaboration with <strong>CPET (Centre for Public Education and Training)</strong> at Darul Huda.
              </p>
              <div className="space-y-1.5 text-xs text-charcoal-light pt-2">
                <div className="font-bold text-forest">Key Course Topics:</div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-charcoal-muted pl-1">
                  <li>Islamic Finance Fundamentals</li>
                  <li>Zakat Management &amp; Computation</li>
                  <li>Ethical Investment Frameworks</li>
                  <li>Sharia-Compliant Transaction Training</li>
                </ul>
              </div>
            </div>
            <div className="pt-3 border-t border-gray-100 text-[11px] text-charcoal-muted">
              Conducted in partnership with CPET at Darul Huda Islamic University.
            </div>
          </div>

        </div>
      </section>

      {/* 6. RESEARCH & PUBLICATIONS & ONGOING PROJECTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-surface-lightGreen/50 rounded-3xl p-8 sm:p-12 border border-forest/15 space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">
              Intellectual Output
            </span>
            <h2 className="text-3xl font-editorial font-bold text-forest">
              Research, Projects &amp; Publications
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-light">
              The Department places strong emphasis on original research, academic contribution, and the practical application of Islamic finance theories in modern contexts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest/5 text-forest flex items-center justify-center">
                <Building2 className="w-5 h-5 text-forest" />
              </div>
              <span className="text-[10px] font-bold text-gold-dark uppercase tracking-wider">Flagship Initiative</span>
              <h4 className="font-editorial text-lg font-bold text-forest">CFSEI</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                <strong>Center for Financial Sustainability of Educational Institutions:</strong> Focused on developing sustainable financial models for institutions that offer free education, rooted in Islamic social finance principles such as waqf, zakat, and sadaqah.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest/5 text-forest flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-forest" />
              </div>
              <span className="text-[10px] font-bold text-gold-dark uppercase tracking-wider">Academic Periodical</span>
              <h4 className="font-editorial text-lg font-bold text-forest">Peer-Reviewed Research Journal</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Dedicated to Islamic banking systems, halal investment frameworks, economic justice through Islamic social finance, and comparative policy analysis between conventional and Islamic finance.
              </p>
              <button
                onClick={() => onNavigate('tamweel')}
                className="text-xs font-bold text-forest hover:text-gold-dark flex items-center space-x-1 pt-1"
              >
                <span>View Tamweel Journal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-soft space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest/5 text-forest flex items-center justify-center">
                <Calendar className="w-5 h-5 text-forest" />
              </div>
              <span className="text-[10px] font-bold text-gold-dark uppercase tracking-wider">Dialogue &amp; Awareness</span>
              <h4 className="font-editorial text-lg font-bold text-forest">Academic Events</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Workshops, seminars, and public lectures are held throughout the year to strengthen academic dialogue and public awareness regarding ethical finance.
              </p>
              <button
                onClick={() => onNavigate('activities')}
                className="text-xs font-bold text-forest hover:text-gold-dark flex items-center space-x-1 pt-1"
              >
                <span>View Activities Archive</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. GLOBAL COLLABORATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-forest/10 pb-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-gold-dark uppercase tracking-wider">

              <span>International Network</span>
            </div>
            <h2 className="text-3xl font-editorial font-bold text-forest mt-1">
              Global Collaborations
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-charcoal-muted max-w-md">
            The Department actively collaborates with international academic and policy institutions to enrich its curriculum and expand research impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-forest/10 shadow-soft space-y-2">
            <span className="text-xs font-bold text-gold-dark uppercase">Partner 01</span>
            <h4 className="font-editorial text-lg font-bold text-forest">Department of Economics, IIUM</h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              International Islamic University Malaysia (Kuala Lumpur). Collaboration covering joint conferences, curriculum exchanges, and visiting scholar seminars.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-forest/10 shadow-soft space-y-2">
            <span className="text-xs font-bold text-gold-dark uppercase">Partner 02</span>
            <h4 className="font-editorial text-lg font-bold text-forest">INCEIF University, Kuala Lumpur</h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              International Centre for Education in Islamic Finance (INCEIF). Global curriculum benchmarks and collaborative research in Islamic banking and capital markets.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-forest/10 shadow-soft space-y-2">
            <span className="text-xs font-bold text-gold-dark uppercase">Partner 03</span>
            <h4 className="font-editorial text-lg font-bold text-forest">Department of Economics, Calicut University</h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Academic collaboration enabling regional econometrics research, thesis supervision, and comparative study of conventional and Islamic economics.
            </p>
          </div>
        </div>
      </section>

      {/* 8. FACULTY DIRECTORY & LEADERSHIP */}
      <section id="faculty-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-forest/10 pb-4">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-gold-dark uppercase tracking-wider">

            <span>Academic Leadership</span>
          </div>
          <h2 className="text-3xl font-editorial font-bold text-forest mt-1">
            Faculty Directory &amp; Department Leadership
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted mt-1">
            Official academic faculty directory under the Kulliyya of Sharia, Darul Huda Islamic University.
          </p>
        </div>

        {facultyLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-charcoal-muted">
            <Loader2 className="w-8 h-8 animate-spin text-forest mb-2" />
            <span className="text-sm">Loading faculty directory...</span>
          </div>
        ) : liveProfiles.length === 0 ? (
          <div className="text-center py-12 text-charcoal-muted">
            <p className="text-sm">No faculty profiles currently published.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {liveProfiles.map((f) => (
              <div
                key={f.id}
                className="bg-white rounded-2xl border border-forest/10 p-6 shadow-soft hover:shadow-elevated transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-forest/5 shrink-0 border border-gold/40 flex items-center justify-center">
                    {f.photo_url ? (
                      <img src={f.photo_url} alt={f.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <UserCheck className="w-8 h-8 text-forest/40" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gold-dark uppercase tracking-wider bg-gold/15 px-2 py-0.5 rounded">
                      {f.category_name || f.designation}
                    </span>
                    <h4 className="font-editorial text-base font-bold text-forest mt-1 leading-snug">
                      {f.full_name}
                    </h4>
                    {f.designation && (
                      <p className="text-xs text-charcoal-muted mt-0.5">{f.designation}</p>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-charcoal-light border-t border-gray-100 pt-3">
                    {f.qualifications && (
                      <div>
                        <strong className="text-forest">Qualification:</strong> {f.qualifications}
                      </div>
                    )}
                    {f.specializations && (
                      <div>
                        <strong className="text-forest">Specialization:</strong> {f.specializations}
                      </div>
                    )}
                    {f.office_info && (
                      <div className="flex items-center space-x-1.5 text-forest font-semibold pt-1">
                        <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span>{f.office_info}</span>
                      </div>
                    )}
                    {f.email && (
                      <div>
                        <strong className="text-forest">Email:</strong>{' '}
                        <a href={`mailto:${f.email}`} className="font-mono text-forest hover:underline text-[11px]">{f.email}</a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-charcoal-muted bg-forest/5 p-2.5 rounded-lg border border-forest/10 flex items-center justify-between">
                  <span className="font-medium text-forest">{f.category_name || 'Faculty Member'}</span>
                  <IslamicStarIcon size={12} className="text-gold" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 9. JOIN US CALLOUT & CONTACT BLOCK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-2xl border-2 border-gold/40">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold text-gold uppercase tracking-wider">
              Join Our Academic Community
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white leading-tight">
              Join Us in Advancing Ethical Finance
            </h3>
            <p className="text-xs sm:text-sm text-sage-light leading-relaxed">
              "We welcome passionate students, researchers, and public learners interested in becoming part of a transformative movement in Islamic economics and finance. Whether your aim is academic scholarship or ethical financial practice, our programs are designed to equip you for both this world and the Hereafter."
            </p>
            <div className="text-xs text-gold-light pt-2 flex flex-wrap gap-4">
              <a href="mailto:dief@dhiu.in" className="hover:underline">📧 dief@dhiu.in</a>
              <span>📞 +91 81295 95547</span>
              <span>🌐 www.darulhuda.in</span>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('contact')}
              className="px-6 py-3.5 bg-gold hover:bg-gold-light text-forest font-bold text-xs sm:text-sm rounded-xl shadow-lg transition"
            >
              Contact Department
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
