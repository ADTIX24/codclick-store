import React from 'react';
import type { Feature } from '../types.ts';

// Icons for Feature Cards
const DeliveryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const SecurityIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const SupportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const VarietyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

// Icon for the centerpiece
const CenterpieceSecurityIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
)

const FEATURES_LEFT: Feature[] = [
    { id: 1, icon: <DeliveryIcon />, title: "تسليم فوري", description: "احصل على أكوادك الرقمية فورًا بعد الشراء، على مدار الساعة." },
    { id: 4, icon: <VarietyIcon />, title: "تشكيلة واسعة", description: "اختر من بين مئات البطاقات للألعاب والترفيه والمزيد." },
];
const FEATURES_RIGHT: Feature[] = [
    { id: 3, icon: <SupportIcon />, title: "دعم فني 24/7", description: "فريقنا مستعد دائمًا لمساعدتك في أي مشكلة تواجهك." },
    { id: 2, icon: <SecurityIcon />, title: "دفع آمن", description: "معاملاتك محمية بأعلى معايير الأمان." },
];

const FeatureCard: React.FC<{ feature: Feature; alignment: 'right' | 'left' }> = ({ feature, alignment }) => (
    <div className={`group relative bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10 ${alignment === 'right' ? 'text-right' : 'text-left'}`}>
        <div className={`flex items-center gap-4 ${alignment === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
             <div className="flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 text-amber-400 shadow-lg border border-slate-600 transition-colors duration-300 group-hover:border-amber-500/50">
                {feature.icon}
            </div>
            <div>
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                <p className="mt-1 text-sm text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
        </div>
    </div>
);


const WhyChooseUs: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-transparent overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 lg:mb-24">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">لماذا تختار CODCLICK؟</h2>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">الخيار الأفضل لاحتياجاتك من البطاقات الرقمية.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-y-12 lg:gap-x-8">
          {/* Left Features */}
          <div className="space-y-8">
            {FEATURES_LEFT.map((feature) => (
                <FeatureCard key={feature.id} feature={feature} alignment="right" />
            ))}
          </div>

          {/* Centerpiece */}
          <div className="relative h-64 lg:h-80 flex items-center justify-center">
            <div className="absolute inset-0 bg-amber-500/10 rounded-full blur-3xl animate-pulse-ring"></div>
            <div className="absolute w-48 h-48 border-2 border-slate-600 rounded-full animate-pulse-ring" style={{ animationDelay: '1s' }}></div>
            <div className="absolute w-64 h-64 border-2 border-slate-700 rounded-full animate-pulse-ring" style={{ animationDelay: '2s' }}></div>
            
            <div className="relative text-green-400 animate-spin-slow">
                <CenterpieceSecurityIcon />
            </div>
          </div>

          {/* Right Features */}
           <div className="space-y-8">
            {FEATURES_RIGHT.map((feature) => (
                <FeatureCard key={feature.id} feature={feature} alignment="left" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;