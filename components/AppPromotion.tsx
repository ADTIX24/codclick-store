import React from 'react';
// FIX: Added .tsx extension to module import.
import { useLanguage } from '../i18n/LanguageContext.tsx';
// FIX: Added .tsx extension to module import.
import { useAppContext } from '../state/AppContext.tsx';

// Icons
const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);


const AppPromotion: React.FC = () => {
    const { t } = useLanguage();
    const { state } = useAppContext();
    const { site_settings } = state;

    return (
      <section className="bg-transparent py-20 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl shadow-amber-500/10 overflow-hidden">
            
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-amber-500/5 rounded-full blur-3xl opacity-40" aria-hidden="true"></div>
            <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-[30rem] h-[30rem] bg-sky-500/5 rounded-full blur-3xl opacity-30" aria-hidden="true"></div>

            <div className="relative lg:grid lg:grid-cols-2 lg:gap-8 items-center">
              
              {/* === Text Side === */}
              <div className="relative py-12 px-6 sm:px-16 lg:py-20 text-center lg:text-right z-10">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
                  <span className="block">احصل على تجربة كاملة</span>
                  <span className="block text-amber-400 mt-2">حمل تطبيقنا الآن</span>
                </h2>
                <p className="mt-4 text-lg leading-7 text-gray-300 max-w-lg mx-auto lg:mx-0">
                  تسوق أسرع، احصل على عروض حصرية، وادفع بأمان من جوالك. كل ما تحتاجه في مكان واحد.
                </p>
                <div className="mt-10">
                  <a
                    href={site_settings.app_download_link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 border border-transparent text-lg font-bold rounded-full text-slate-900 bg-amber-500 hover:bg-amber-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-amber-500/40"
                  >
                    <DownloadIcon />
                    <span>{t('app_promotion.download_app')}</span>
                  </a>
                </div>
              </div>
              
              {/* === Visual Side === */}
              <div className="relative h-96 lg:h-full flex items-center justify-center p-8 lg:p-12">
                {/* Phone Mockup - Simplified */}
                <div className="relative z-10 w-[14rem] h-[28rem] rounded-[2.5rem] bg-slate-900 p-2 shadow-2xl shadow-black/50">
                    <div className="absolute inset-0 border-[10px] border-slate-900 rounded-[2.5rem] pointer-events-none"></div>
                    <div className="w-full h-full bg-slate-800 rounded-[2rem] overflow-hidden">
                        {/* Mock App UI */}
                        <div className="w-full h-full p-4 space-y-4 bg-dots">
                             {/* Header */}
                            <div className="flex items-center justify-between">
                                <div className="w-10 h-3 bg-amber-400/50 rounded-full"></div>
                                <div className="w-5 h-5 bg-slate-600 rounded-full"></div>
                            </div>
                            {/* Content grid */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="aspect-square bg-slate-700 rounded-lg animate-pulse"></div>
                                <div className="aspect-square bg-slate-700 rounded-lg animate-pulse [animation-delay:100ms]"></div>
                                <div className="aspect-square bg-slate-700 rounded-lg animate-pulse [animation-delay:200ms]"></div>
                                <div className="aspect-square bg-slate-700 rounded-lg animate-pulse [animation-delay:300ms]"></div>
                                <div className="aspect-square bg-slate-700 rounded-lg animate-pulse [animation-delay:400ms]"></div>
                            </div>
                             {/* Bottom Nav */}
                            <div className="absolute bottom-4 left-4 right-4 h-10 bg-slate-700/50 backdrop-blur-sm rounded-full flex items-center justify-around">
                                <div className="w-5 h-5 bg-amber-400 rounded-full"></div>
                                <div className="w-5 h-5 bg-slate-600 rounded-full"></div>
                                <div className="w-5 h-5 bg-slate-600 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default AppPromotion;