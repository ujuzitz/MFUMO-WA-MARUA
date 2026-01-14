
import React, { useState, useEffect } from 'react';
import { Language, InstitutionType, Tone, FormData } from './types';
import { TRANSLATIONS } from './constants';
import { SparklesIcon, DownloadIcon, CopyIcon, CheckIcon, FriendlyIcon, ProfessionalIcon, BoldIcon } from './components/Icons';
// Import the generation service
import { generateCoverLetter } from './services/geminiService';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>(Language.EN);
  const [loading, setLoading] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [copied, setCopied] = useState(false);
  
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    applicantAddress: '',
    email: '',
    phone: '',
    companyName: '',
    employerAddress: '',
    department: '',
    jobTitle: '',
    institutionType: InstitutionType.PRIVATE,
    generationLanguage: Language.EN,
    tone: Tone.PROFESSIONAL,
    jobDescription: '',
  });

  // Sync generation language with UI language when UI language changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, generationLanguage: lang }));
  }, [lang]);

  const t = TRANSLATIONS[lang];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToneSelect = (tone: Tone) => {
    setFormData(prev => ({ ...prev, tone }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await generateCoverLetter(formData, formData.generationLanguage);
      setGeneratedLetter(result);
      
      // Delay scrolling slightly to allow state to update DOM
      setTimeout(() => {
        document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (error) {
      console.error(error);
      alert(lang === Language.EN 
        ? "Failed to generate cover letter. Please check your connection and try again." 
        : "Imeshindwa kutengeneza barua. Tafadhali kagua muunganisho wako na ujaribu tena.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToGenerator = () => {
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div id="home" className="min-h-screen flex flex-col selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 no-print transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
              <SparklesIcon />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter leading-none">{t.title}</h1>
              <span className="text-[10px] font-bold text-indigo-600 tracking-widest uppercase">Beta</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-8">
            <nav className="hidden md:flex items-center gap-6">
              <a href="#home" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Home</a>
              <a href="#generator" className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">Generator</a>
            </nav>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
              <button 
                onClick={() => setLang(Language.EN)}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all ${lang === Language.EN ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLang(Language.SW)}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all ${lang === Language.SW ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                SW
              </button>
            </div>
            <button 
              onClick={scrollToGenerator}
              className="bg-slate-900 hover:bg-indigo-600 text-white px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg shadow-slate-200 hover:shadow-indigo-100"
            >
              {t.createBtn}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative pt-32 sm:pt-48 pb-20 px-4 no-print overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-indigo-100/50 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-100/50 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-10">
          <div className="inline-flex flex-wrap justify-center gap-3">
            <span className="px-4 py-1.5 bg-white border border-slate-200 rounded-full text-[11px] font-bold text-slate-600 uppercase tracking-widest shadow-sm">
              ✨ {lang === Language.EN ? 'SaaS Platform for Career Excellence' : 'Jukwaa la SaaS kwa Mafanikio ya Kazi'}
            </span>
          </div>
          <h2 className="text-4xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] serif px-2">
            {t.heroTitle}
          </h2>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto px-4">
            {t.heroSub}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button 
              onClick={scrollToGenerator}
              className="group w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              <SparklesIcon />
              <span>{t.generateBtn}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section id="generator" className="py-24 px-4 bg-slate-50/50 border-t border-slate-100 scroll-mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Form */}
          <div className="lg:col-span-5 space-y-8 no-print">
            <div className="space-y-2 text-center lg:text-left">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                 <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-black uppercase tracking-tighter">New</span>
                 <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{t.subtitle}</h3>
              </div>
              <p className="text-slate-500">Please fill in the details below to generate your professional cover letter.</p>
            </div>
            
            <form onSubmit={handleGenerate} className="space-y-8">
              {/* Personal Information */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
                <h4 className="text-sm font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                  {t.personalInfo}
                </h4>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t.fullName} <span className="text-red-500">*</span></label>
                    <input required name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all hover:border-slate-300" placeholder={t.placeholderName} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t.applicantAddress} <span className="text-red-500">*</span></label>
                    <textarea required name="applicantAddress" value={formData.applicantAddress} onChange={handleInputChange} rows={3} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none hover:border-slate-300" placeholder={t.placeholderAddress}></textarea>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t.email} <span className="text-slate-400 text-[10px] italic">({t.optional})</span></label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all hover:border-slate-300" placeholder={t.placeholderEmail} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t.phone} <span className="text-slate-400 text-[10px] italic">({t.optional})</span></label>
                      <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all hover:border-slate-300" placeholder={t.placeholderPhone} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Employer Information */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
                <h4 className="text-sm font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                  {t.employerInfo}
                </h4>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t.companyName} <span className="text-red-500">*</span></label>
                    <input required name="companyName" value={formData.companyName} onChange={handleInputChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all hover:border-slate-300" placeholder={t.placeholderCompany} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t.employerAddress} <span className="text-red-500">*</span></label>
                    <textarea required name="employerAddress" value={formData.employerAddress} onChange={handleInputChange} rows={3} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none hover:border-slate-300" placeholder={t.placeholderAddress}></textarea>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t.department} <span className="text-slate-400 text-[10px] italic">({t.optional})</span></label>
                      <input name="department" value={formData.department} onChange={handleInputChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all hover:border-slate-300" placeholder={t.placeholderDept} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t.institutionType}</label>
                      <select name="institutionType" value={formData.institutionType} onChange={handleInputChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer hover:border-slate-300">
                        <option value={InstitutionType.GOVERNMENT}>{t.govt}</option>
                        <option value={InstitutionType.NGO}>{t.ngo}</option>
                        <option value={InstitutionType.PRIVATE}>{t.private}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Language and Tone Settings */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
                <h4 className="text-sm font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                  {t.styleSettings}
                </h4>
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t.generationLanguage}</label>
                    <select name="generationLanguage" value={formData.generationLanguage} onChange={handleInputChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all cursor-pointer hover:border-slate-300">
                      <option value={Language.EN}>{t.langEn}</option>
                      <option value={Language.SW}>{t.langSw}</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t.toneLabel}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Friendly Tone */}
                      <button
                        type="button"
                        onClick={() => handleToneSelect(Tone.FRIENDLY)}
                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all text-center group ${formData.tone === Tone.FRIENDLY ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 bg-white hover:border-indigo-200'}`}
                      >
                        <div className={`p-2 rounded-xl ${formData.tone === Tone.FRIENDLY ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                          <FriendlyIcon />
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${formData.tone === Tone.FRIENDLY ? 'text-indigo-900' : 'text-slate-700'}`}>{t.toneFriendly}</p>
                        </div>
                      </button>

                      {/* Professional Tone */}
                      <button
                        type="button"
                        onClick={() => handleToneSelect(Tone.PROFESSIONAL)}
                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all text-center group ${formData.tone === Tone.PROFESSIONAL ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 bg-white hover:border-indigo-200'}`}
                      >
                        <div className={`p-2 rounded-xl ${formData.tone === Tone.PROFESSIONAL ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                          <ProfessionalIcon />
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${formData.tone === Tone.PROFESSIONAL ? 'text-indigo-900' : 'text-slate-700'}`}>{t.toneProfessional}</p>
                        </div>
                      </button>

                      {/* Bold Tone */}
                      <button
                        type="button"
                        onClick={() => handleToneSelect(Tone.BOLD)}
                        className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all text-center group ${formData.tone === Tone.BOLD ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200 bg-white hover:border-indigo-200'}`}
                      >
                        <div className={`p-2 rounded-xl ${formData.tone === Tone.BOLD ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}`}>
                          <BoldIcon />
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${formData.tone === Tone.BOLD ? 'text-indigo-900' : 'text-slate-700'}`}>{t.toneBold}</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
                <h4 className="text-sm font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                  {t.jobDetails}
                </h4>
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t.jobTitle} <span className="text-red-500">*</span></label>
                    <input required name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all hover:border-slate-300" placeholder={t.placeholderJob} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t.jobDescriptionLabel} <span className="text-slate-400 text-[10px] italic">({t.optional})</span></label>
                    <textarea name="jobDescription" value={formData.jobDescription} onChange={handleInputChange} rows={6} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none hover:border-slate-300" placeholder={t.placeholderJobDesc}></textarea>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
                <h4 className="text-sm font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                  {t.documents}
                </h4>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">{t.uploadCv} <span className="text-red-500">*</span></label>
                  <div className="relative group">
                    <input required type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, setCvFile)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="w-full px-5 py-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-between group-hover:border-indigo-300 transition-all">
                      <span className="text-sm text-slate-500 truncate max-w-[80%]">{cvFile ? cvFile.name : (lang === Language.EN ? 'Choose file...' : 'Chagua faili...')}</span>
                      <div className="text-indigo-600"><DownloadIcon /></div>
                    </div>
                  </div>
                  <p className="text-[11px] font-medium text-slate-400 italic">💡 {t.cvHelper}</p>
                </div>
              </div>

              {/* Centered Large CTA Button */}
              <div className="flex justify-center pt-8">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full max-w-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-black py-6 px-10 rounded-2xl shadow-2xl shadow-indigo-200 transition-all transform hover:translate-y-[-4px] active:translate-y-0 flex items-center justify-center gap-4 text-xl group"
                >
                  {loading ? (
                    <div className="flex items-center gap-4">
                      <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="tracking-tight">{t.generating}</span>
                    </div>
                  ) : (
                    <>
                      <SparklesIcon />
                      <span className="tracking-tight">{t.generateBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Real PDF Preview Section */}
          <div id="preview" className="lg:col-span-7 scroll-mt-24 preview-container">
            <div className="sticky top-24 space-y-6 print-area-wrapper">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2 no-print preview-controls">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                  <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{t.previewTitle}</h3>
                </div>
                {generatedLetter && (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button onClick={handleCopy} className="flex-1 sm:flex-none p-3 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 text-sm font-bold shadow-sm" title={t.copyText}>
                      {copied ? <CheckIcon /> : <CopyIcon />}
                    </button>
                    <button onClick={handlePrint} className="flex-1 sm:flex-none px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-slate-200">
                      <DownloadIcon />
                      <span>{t.downloadPdf}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Document Paper Mockup Area */}
              <div className="w-full bg-slate-200 p-4 md:p-8 rounded-[2.5rem] min-h-[900px] border border-slate-300/50 flex flex-col items-center preview-bg">
                {generatedLetter ? (
                  <div className="print-area a4-page animate-in fade-in zoom-in-95 duration-700">
                    <div className="document-font whitespace-pre-wrap text-slate-900 text-justify text-[12pt] leading-[1.5] select-text">
                      {generatedLetter}
                    </div>
                  </div>
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center text-center space-y-6 opacity-30 py-60 no-print">
                    <div className="w-32 h-32 bg-slate-100 rounded-[2.5rem] border-2 border-slate-300 flex items-center justify-center transform rotate-6">
                      <svg className="w-16 h-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-bold text-slate-900 uppercase tracking-widest">{lang === Language.EN ? 'Ready for Generation' : 'Tayari Kutengenezwa'}</p>
                      <p className="max-w-[280px] text-sm font-medium italic mx-auto text-slate-500">
                        {lang === Language.EN ? 'Fill in the form to witness your professional letter take shape.' : 'Jaza fomu ili kuona barua yako ya kitaalamu ikichukua sura.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white pt-20 pb-12 no-print relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
                  <SparklesIcon />
                </div>
                <h2 className="text-xl font-black tracking-tighter">{t.title}</h2>
                <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[8px] font-black uppercase tracking-widest">Pro Edition</span>
              </div>
              <p className="text-slate-500 max-w-sm leading-relaxed mx-auto md:mx-0 font-medium">
                Crafting professional paths with the power of AI. Built for East African excellence in the modern job market.
              </p>
            </div>
            <div className="md:col-span-2 space-y-4 text-center md:text-left">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Product</h4>
              <ul className="space-y-2 text-sm text-slate-500 font-bold">
                <li><a href="#home" className="hover:text-indigo-600 transition-colors">Home</a></li>
                <li><a href="#generator" className="hover:text-indigo-600 transition-colors">Generator</a></li>
                <li><a href="#" className="opacity-40 cursor-not-allowed">Pricing (Coming Soon)</a></li>
              </ul>
            </div>
            <div className="md:col-span-2 space-y-4 text-center md:text-left">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500 font-bold">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div className="md:col-span-3 space-y-4 text-center md:text-left">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Support</h4>
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Questions? Reach out at <strong>support@baruaai.pro</strong>
                </p>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
              &copy; {new Date().getFullYear()} {t.title} Global. {t.footerTagline}
            </p>
            <div className="flex gap-6">
               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center opacity-50"><FriendlyIcon /></div>
               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center opacity-50"><ProfessionalIcon /></div>
               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center opacity-50"><BoldIcon /></div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-indigo-50/50 rounded-full blur-3xl -z-10"></div>
      </footer>
    </div>
  );
};

export default App;
