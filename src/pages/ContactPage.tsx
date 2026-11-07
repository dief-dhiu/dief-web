import React, { useState } from 'react';
import { PageId, ContactMessage } from '../types';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building2,
  HelpCircle,
  ExternalLink,
  Edit3
} from 'lucide-react';
import { IslamicStarIcon } from '../components/IslamicPattern';

interface ContactPageProps {
  onNavigate: (page: PageId) => void;
  onSubmitContact: (message: Omit<ContactMessage, 'id' | 'submittedAt'>) => void;
  onShowToast: (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigate,
  onSubmitContact,
  onShowToast
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('Academic Admissions & Curriculum');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [k: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: { [k: string]: string } = {};

    if (!name.trim()) errors.name = 'Full name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errors.email = 'Valid contact email required';
    if (!subject.trim()) errors.subject = 'Subject is required';
    if (!message.trim() || message.length < 15) errors.message = 'Please provide your enquiry message (minimum 15 characters)';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    onSubmitContact({
      name,
      email,
      category,
      subject,
      message
    });

    setSubmitted(true);
    onShowToast('Message Dispatched', 'Your departmental message has been transmitted to the administrative desk.', 'success');
  };

  return (
    <div className="space-y-16 py-8">

      {/* HEADER BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden border-2 border-gold/40 shadow-elevated">
          <div className="absolute inset-0 pattern-dark-islamic opacity-30 pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-xs font-semibold border border-gold/30">
              <Mail className="w-3.5 h-3.5" />
              <span>Official Department Communications</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-editorial font-bold text-white tracking-tight">
              Contact the Department
            </h1>



            <p className="text-sm sm:text-base text-sage-subtle leading-relaxed">
              We welcome academic correspondence, research partnership queries, visiting scholar appointments, student enquiries, and media requests.
            </p>
          </div>
        </div>
      </section>

      {/* DIRECTORY & WORKING FORM */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left Column: Official Contact Information & Placeholders */}
          <div className="lg:col-span-5 space-y-6">

            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-forest/10 shadow-soft space-y-6">
              <div className="border-b border-gray-100 pb-4">
                <span className="text-xs font-bold text-gold-dark uppercase tracking-wider block">
                  Institutional Secretariat
                </span>
                <h3 className="font-editorial text-2xl font-bold text-forest mt-1">
                  Department Information
                </h3>

              </div>

              <div className="space-y-4 text-xs text-charcoal-light">

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-forest block mb-0.5">Physical Campus Location:</strong>
                    Department of Islamic Economics and Finance<br />
                    Under Kulliyya of Sharia, Darul Huda Islamic University<br />
                    Chemmad, Malappuram, Kerala – 676306, India
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-forest block mb-0.5">Official Email:</strong>
                    <div>
                      <a href="mailto:dief@dhiu.in" className="font-mono text-forest font-semibold hover:underline">
                        dief@dhiu.in
                      </a>
                    </div>
                    <div className="text-[11px] text-charcoal-muted mt-0.5">Web: www.darulhuda.in</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-forest block mb-0.5">Contact Directory:</strong>
                    <div>HOD (Anas Hudawi Nellikkuth): <span className="font-mono font-semibold text-forest">+91 81295 95547</span></div>
                    <div>Dean, Kulliyya of Sharia (Dr. K.P. Jafar Hudawi Kolathur): <span className="font-mono font-semibold text-forest">+91 99462 92164</span></div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-forest block mb-0.5">Office Visiting Hours:</strong>
                    Saturday – Thursday: 09:00 AM – 04:30 PM IST<br />
                    Friday: Academic Holiday / Research Recess
                  </div>
                </div>

              </div>
            </div>

            {/* Simulated Campus Google Maps Interactive Card */}
            <div className="bg-white rounded-2xl p-6 border border-forest/10 shadow-soft space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-forest uppercase tracking-wider">
                  Campus Geography &amp; Location Map
                </span>
                <span className="text-[11px] text-gold-dark font-medium">Google Maps Integration</span>
              </div>

              {/* Map Preview Graphic */}
              <div className="relative rounded-xl overflow-hidden aspect-[16/9] border border-gray-200 bg-surface-lightGreen flex items-center justify-center group">
                <div className="absolute inset-0 pattern-islamic-subtle opacity-70"></div>
                <div className="relative z-10 text-center p-4">
                  <MapPin className="w-8 h-8 text-forest mx-auto mb-1 animate-bounce" />
                  <div className="text-xs font-bold text-forest">Darul Huda Islamic University</div>
                  <div className="text-[10px] text-charcoal-muted">Chemmad, Malappuram District, Kerala</div>
                  <a
                    href="https://maps.google.com/?q=Darul+Huda+Islamic+University+Chemmad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center space-x-1.5 px-3 py-1.5 bg-forest text-white rounded-lg text-[11px] font-semibold hover:bg-emerald-deep transition shadow"
                  >
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3 h-3 text-gold" />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Working Contact Form with Validation */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-8 sm:p-10 border border-forest/10 shadow-elevated">
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-fadeIn">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-editorial text-2xl font-bold text-forest">
                  Enquiry Dispatched Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-light max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{name}</strong>. Your correspondence has been registered into the department inbox and routed to the corresponding desk.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setSubject('');
                      setMessage('');
                    }}
                    className="px-5 py-2.5 bg-forest text-white text-xs font-bold rounded-xl hover:bg-emerald-deep transition"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-gold-dark uppercase tracking-wider">
                    Online Message Desk
                  </span>
                  <h3 className="font-editorial text-2xl font-bold text-forest mt-1">
                    Send a Direct Message
                  </h3>
                  <p className="text-xs text-charcoal-muted mt-1">
                    Please complete the form below. Authorized department members will attend to your request promptly.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. Rashid Ahmad"
                      className={`w-full px-3.5 py-2.5 text-xs bg-ivory/40 border rounded-xl focus:border-forest focus:outline-none ${formErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {formErrors.name && (
                      <p className="text-[10px] text-red-600 mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. rashid@example.com"
                      className={`w-full px-3.5 py-2.5 text-xs bg-ivory/40 border rounded-xl focus:border-forest focus:outline-none ${formErrors.email ? 'border-red-500' : 'border-gray-300'
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
                      Enquiry Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-ivory/40 border border-gray-300 rounded-xl focus:border-forest focus:outline-none"
                    >
                      <option value="Academic Admissions & Curriculum">Academic Admissions &amp; Curriculum</option>
                      <option value="Research & Tamweel Journal Inquiry">Research &amp; Tamweel Journal Inquiry</option>
                      <option value="SBC Commercial Consultancy">SBC Commercial Consultancy</option>
                      <option value="DHIB Banking Lab Activities">DHIB Banking Lab Activities</option>
                      <option value="Conference & Seminar Registration">Conference &amp; Seminar Registration</option>
                      <option value="General Department Inquiry">General Department Inquiry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-charcoal mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Request for Postgraduate Syllabus"
                      className={`w-full px-3.5 py-2.5 text-xs bg-ivory/40 border rounded-xl focus:border-forest focus:outline-none ${formErrors.subject ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {formErrors.subject && (
                      <p className="text-[10px] text-red-600 mt-1">{formErrors.subject}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please specify details regarding your inquiry, institutional background, or required materials..."
                    className={`w-full px-3.5 py-2.5 text-xs bg-ivory/40 border rounded-xl focus:border-forest focus:outline-none ${formErrors.message ? 'border-red-500' : 'border-gray-300'
                      }`}
                  ></textarea>
                  {formErrors.message && (
                    <p className="text-[10px] text-red-600 mt-1">{formErrors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-forest hover:bg-emerald-deep text-white font-semibold text-xs sm:text-sm rounded-xl shadow transition flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4 text-gold" />
                  <span>Send Message </span>
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

    </div>
  );
};
