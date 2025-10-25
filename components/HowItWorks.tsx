import React from 'react';

// Icons with a more refined look
const CardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

const PaymentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1h4a2 2 0 012 2v11a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h4z" />
    </svg>
);

const ReceiveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z" />
    </svg>
);


const STEPS = [
    {id: 1, icon: <CardIcon />, title: "اختر بطاقتك", description: "تصفح قائمتنا الواسعة واختر البطاقة الرقمية التي تريدها.", number: "01"},
    {id: 2, icon: <PaymentIcon />, title: "أكمل الدفع", description: "ادفع بأمان من خلال طرق الدفع المتنوعة لدينا، بما في ذلك البطاقات والعملات الرقمية.", number: "02"},
    {id: 3, icon: <ReceiveIcon />, title: "استلمها فوراً", description: "يتم تسليم الكود الرقمي الخاص بك على الفور إلى حسابك وبريدك الإلكتروني.", number: "03"},
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-transparent overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 lg:mb-24">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">كيف يعمل</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">احصل على أكوادك في 3 خطوات بسيطة. العملية مصممة لتكون سريعة وآمنة وموثوقة.</p>
        </div>
        
        <div className="relative">
          {/* Connector line for large screens */}
          <div className="hidden lg:block absolute top-10 left-0 w-full h-24 -z-10" aria-hidden="true">
            <svg viewBox="0 0 1100 100" preserveAspectRatio="none" className="w-full h-full">
              <path 
                d="M 50 50 C 250 -20, 350 120, 550 50 C 750 -20, 850 120, 1050 50"
                stroke="rgba(251, 191, 36, 0.2)" 
                strokeWidth="2" 
                fill="none" 
                strokeDasharray="8 8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-20 lg:gap-x-12">
            {STEPS.map((step, index) => (
              <div key={step.id} className={`relative text-center px-4 ${index === 1 ? 'lg:translate-y-12' : ''}`}>
                <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 h-full">
                  {/* Big number in background */}
                  <span className="absolute -top-4 -right-2 text-8xl font-black text-slate-700/50 -z-10 select-none" aria-hidden="true">{step.number}</span>

                  {/* Icon */}
                  <div className="relative inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 text-amber-400 mx-auto mb-6 shadow-lg border border-slate-600">
                    <div className="absolute inset-0 rounded-full bg-amber-400/10 blur-xl animate-pulse"></div>
                    <div className="relative">{step.icon}</div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;