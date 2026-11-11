import React, { useState } from 'react';
import { PageId, ConsultationRequest } from '../types';
import {
  Briefcase,
  ShieldAlert,
  CheckCircle2,
  Send,
  Building,
  Users,
  FileText,
  Scale,
  Award,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { IslamicStarIcon } from '../components/IslamicPattern';

interface SbcPageProps {
  onNavigate: (page: PageId) => void;
  onSubmitConsultation: (request: Omit<ConsultationRequest, 'id' | 'submittedAt' | 'status'>) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const SbcPage: React.FC<SbcPageProps> = ({ onNavigate, onSubmitConsultation, onShowToast }) => {
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [areaOfEnquiry, setAreaOfEnquiry] = useState('Commercial Contracts (Murabaha/Ijarah/Salam)');
  const [projectScope, setProjectScope] = useState('New Product Structuring');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [k: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [k: string]: string } = {};

    if (!name.trim()) errors.name = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Valid corporate or personal email required';
    if (!organization.trim()) errors.organization = 'Enterprise/Entity name is required';
    if (!message.trim() || message.trim().length < 15) errors.message = 'Please provide details on your commercial inquiry (minimum 15 characters)';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    onSubmitConsultation({
      name,
      email,
      organization,
      areaOfEnquiry,
      projectScope,
      message,
    });

    setSubmitted(true);
    onShowToast(
      'Consultation Request Submitted',
      'Your request has been registered in the SBC portal queue and sent to the department advisory desk.',
      'success'
    );
  };

  return (
    <div className="space-y-16 lg:space-y-24 py-8">

      {/* 1. HERO & INTRODUCTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#1D4ED8] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden border-2 border-gold/40 shadow-elevated">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">

              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold border border-gold/30">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Department Flagship Initiative 02</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-white tracking-tight">
                SBC <br />
                <span className="text-xl sm:text-2xl font-editorial text-white font-semibold">Shariah Business Consultancy</span>
              </h1>



              <p className="text-sm sm:text-base text-sage-subtle leading-relaxed max-w-2xl">
                Providing Shariah-oriented business guidance, contract evaluation, and practical ethical solutions for contemporary enterprises striving for commercial excellence under authentic Islamic principles.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href="#consultation-form"
                  className="px-6 py-3.5 bg-gold hover:bg-gold-light text-charcoal font-bold text-xs sm:text-sm rounded-xl shadow transition"
                >
                  Request a Consultation
                </a>
                <a
                  href="#services"
                  className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-gold/40 font-bold text-xs sm:text-sm rounded-xl transition"
                >
                  Advisory Services
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
            <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">SBC Vision</span>
            <h3 className="text-2xl font-editorial font-bold text-charcoal">Cultivating Ethical Commerce</h3>
            <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
              To be the most respected academic-backed advisory center in the region, empowering contemporary businesses to thrive commercially while adhering uncompromisingly to the ethical spirit and legal jurisprudence of Islam.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-forest/10 shadow-soft space-y-3">
            <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">SBC Mission</span>
            <h3 className="text-2xl font-editorial font-bold text-charcoal">Practical Contractual Clarity</h3>
            <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed">
              Deliver actionable, rigorous guidance for commercial contracts, review revenue-share mechanisms, organize corporate Shariah training workshops, and assist entrepreneurs in structuring halal business operations.
            </p>
          </div>

        </div>
      </section>

      {/* 3 & 4. ISLAMIC COMMERCIAL PRINCIPLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-bold tracking-widest text-gold-dark uppercase font-sans">
            Guiding Values
          </span>
          <h2 className="text-3xl font-editorial font-bold text-charcoal">
            Islamic Commercial Foundations
          </h2>
          <p className="text-xs sm:text-sm text-charcoal-muted">
            The fundamental ethical tenets embedded into every SBC advisory review and contractual consultation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white p-6 rounded-2xl border border-forest/10 shadow-soft space-y-3">
            <div className="font-arabic text-xl text-gold-dark font-bold">الأمانة</div>
            <h4 className="font-editorial text-lg font-bold text-charcoal">Amanah (Fiduciary Trust)</h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Upholding uncompromised honesty and safeguarding shareholder, customer, and employee entrustments without deceit or hidden terms.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-forest/10 shadow-soft space-y-3">
            <div className="font-arabic text-xl text-gold-dark font-bold">العدل</div>
            <h4 className="font-editorial text-lg font-bold text-charcoal">Adl (Equitable Justice)</h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Ensuring symmetrical contractual balance where neither party is unfairly burdened with unilateral risks or predatory forfeiture clauses.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-forest/10 shadow-soft space-y-3">
            <div className="font-arabic text-xl text-gold-dark font-bold">الصدق</div>
            <h4 className="font-editorial text-lg font-bold text-charcoal">Sidq (Truthfulness)</h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Transparent disclosure of product defects, pricing origins, margins, and warranties, strictly eschewing misrepresentation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-forest/10 shadow-soft space-y-3">
            <div className="font-arabic text-xl text-gold-dark font-bold">التراضي</div>
            <h4 className="font-editorial text-lg font-bold text-charcoal">Mutual Consent (Taradi)</h4>
            <p className="text-xs text-charcoal-muted leading-relaxed">
              Agreements must stem from genuine, uncoerced mutual agreement, fully understanding all reciprocal obligations and considerations.
            </p>
          </div>

        </div>
      </section>

      {/* 5 & 6. ADVISORY SERVICES, WORKSHOPS & TRAINING */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-forest/10 pb-4">
          <div>
            <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">
              Service Catalogue
            </span>
            <h3 className="text-3xl font-editorial font-bold text-charcoal mt-1">
              Business Guidance &amp; Consultancy Services
            </h3>
          </div>
          <a
            href="#consultation-form"
            className="text-xs font-bold text-[#1D4ED8] hover:text-[#2563EA] flex items-center space-x-1.5"
          >
            <span>Request Service Proposal</span>
            <ArrowRight className="w-3.5 h-3.5 text-gold" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-2xl border border-forest/10 shadow-soft space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-charcoal/10 text-[#1D4ED8] flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#1D4ED8]" />
              </div>
              <h4 className="font-editorial text-lg font-bold text-charcoal">Commercial Contract Structuring</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Review and drafting of sales, leasing, agency (Wakalah), partnership (Musharakah/Mudarabah), and deferred payment procurement agreements to ensure absence of Riba and Gharar.
              </p>
            </div>
            <div className="text-[11px] font-bold text-gold-dark pt-3 border-t border-gray-100">
              For Startups &amp; Corporate Entities
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-forest/10 shadow-soft space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-charcoal/10 text-[#1D4ED8] flex items-center justify-center">
                <Scale className="w-5 h-5 text-[#1D4ED8]" />
              </div>
              <h4 className="font-editorial text-lg font-bold text-charcoal">Enterprise &amp; Equity Shariah Screening</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Quantitative ratio screening of company balance sheets, interest-bearing debt ceilings, cash equivalents, and revenue purification protocols compliant with AAOIFI standards.
              </p>
            </div>
            <div className="text-[11px] font-bold text-gold-dark pt-3 border-t border-gray-100">
              For Investors &amp; Asset Managers
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-forest/10 shadow-soft space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-charcoal/10 text-[#1D4ED8] flex items-center justify-center">
                <Users className="w-5 h-5 text-[#1D4ED8]" />
              </div>
              <h4 className="font-editorial text-lg font-bold text-charcoal">Corporate Workshops &amp; Training</h4>
              <p className="text-xs text-charcoal-muted leading-relaxed">
                Bespoke on-campus or virtual executive education programs for accounting departments, sales teams, and directors on practical application of Islamic financial jurisprudence.
              </p>
            </div>
            <div className="text-[11px] font-bold text-gold-dark pt-3 border-t border-gray-100">
              Executive Development Cohorts
            </div>
          </div>

        </div>
      </section>

      {/* 8. REQUEST A CONSULTATION FORM */}
      <section id="consultation-form" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-forest/15 shadow-elevated p-8 sm:p-12 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Left Description */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-gold-dark uppercase tracking-wider">

                <span>Confidential Advisory Desk</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-editorial font-bold text-charcoal leading-tight">
                "Let's Build Your Business on Ethical Foundations."
              </h2>
              <p className="text-sm text-charcoal-light leading-relaxed">
                Connect with our academic advisory team to review your commercial challenges, contract structures, or training requirements. Every request is reviewed with strict academic confidentiality.
              </p>

              <div className="pt-4 space-y-3 text-xs text-charcoal-light">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-charcoal" />
                  <span>Preliminary intake review within 3 business days</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-charcoal" />
                  <span>Scholarly assessment grounded in AAOIFI standards</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-charcoal" />
                  <span>Customized consultation roadmap and documentation</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-ivory border border-forest/10 text-xs text-charcoal-muted">
                <strong className="text-charcoal block mb-1">Direct Coordination Desk:</strong>
                Email: <a href="mailto:dief@dhiu.in" className="hover:underline text-charcoal font-semibold">dief@dhiu.in</a><br />
              </div>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-7 bg-charcoal/5 p-8 rounded-2xl border border-charcoal/10">
              {submitted ? (
                <div className="py-12 text-center space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-editorial text-2xl font-bold text-forest">
                    Consultation Request Successfully Received!
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-light max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{name}</strong>. Your enquiry on behalf of <strong>{organization}</strong> has been logged into the SBC Department portal queue. Our advisory fellows will review your materials.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setName('');
                        setEmail('');
                        setOrganization('');
                        setMessage('');
                      }}
                      className="px-5 py-2.5 bg-forest text-white text-xs font-bold rounded-xl hover:bg-emerald-deep transition"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="font-editorial text-xl font-bold text-charcoal mb-2">
                    Request a Consultation Form
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-charcoal mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Dr. Salman Faris"
                        className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl focus:border-forest focus:outline-none ${formErrors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {formErrors.name && (
                        <p className="text-[10px] text-red-600 mt-1">{formErrors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-charcoal mb-1">
                        Work / Corporate Email *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. salman@company.com"
                        className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl focus:border-forest focus:outline-none ${formErrors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {formErrors.email && (
                        <p className="text-[10px] text-red-600 mt-1">{formErrors.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-charcoal mb-1">
                        Organisation / Enterprise Name *
                      </label>
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="e.g. Crescent Global Ventures"
                        className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl focus:border-forest focus:outline-none ${formErrors.organization ? 'border-red-500' : 'border-gray-300'
                          }`}
                      />
                      {formErrors.organization && (
                        <p className="text-[10px] text-red-600 mt-1">{formErrors.organization}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-charcoal mb-1">
                        Project Scope
                      </label>
                      <select
                        value={projectScope}
                        onChange={(e) => setProjectScope(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 rounded-xl focus:border-forest focus:outline-none"
                      >
                        <option value="New Product Structuring">New Product Structuring</option>
                        <option value="Contract Review">Existing Contract Review</option>
                        <option value="Executive Training">Corporate Executive Training</option>
                        <option value="Equity Screening">Equity Portfolio Screening</option>
                        <option value="General Advisory">General Advisory Dialogue</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">
                      Area of Enquiry *
                    </label>
                    <select
                      value={areaOfEnquiry}
                      onChange={(e) => setAreaOfEnquiry(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-gray-300 rounded-xl focus:border-forest focus:outline-none"
                    >
                      <option value="Commercial Contracts (Murabaha/Ijarah/Salam)">Commercial Contracts (Murabaha / Ijarah / Salam)</option>
                      <option value="Partnership Agreements (Musharakah/Mudarabah)">Partnership Agreements (Musharakah / Mudarabah)</option>
                      <option value="Shariah Screening for Listed Equities">Shariah Screening for Listed Equities</option>
                      <option value="Fintech & Smart Contracts Feasibility">Fintech &amp; Smart Contracts Feasibility</option>
                      <option value="Waqf & Micro-Takaful Architecture">Waqf &amp; Micro-Takaful Architecture</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">
                      Detailed Commercial Message &amp; Context *
                    </label>
                    <textarea
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please summarize your commercial model, current draft clauses or specific questions you need our advisory team to examine..."
                      className={`w-full px-3.5 py-2.5 text-xs bg-white border rounded-xl focus:border-forest focus:outline-none ${formErrors.message ? 'border-red-500' : 'border-gray-300'
                        }`}
                    ></textarea>
                    {formErrors.message && (
                      <p className="text-[10px] text-red-600 mt-1">{formErrors.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#1D4ED8] hover:bg-#2563EA text-white font-semibold text-xs sm:text-sm rounded-xl shadow transition flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4 text-gold" />
                    <span>Submit Consultation Request to SBC</span>
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
