import React from 'react';
import Card from './Card.tsx';
// FIX: Added .tsx extension to module import.
import { useLanguage } from '../i18n/LanguageContext.tsx';
// FIX: Added .tsx extension to module import.
import { useAppContext } from '../state/AppContext.tsx';

interface SpecialOffersProps {
  onViewAll: () => void;
  onCardClick: (productId: string) => void;
}

const SpecialOffers: React.FC<SpecialOffersProps> = ({ onViewAll, onCardClick }) => {
  const { t } = useLanguage();
  const { state } = useAppContext();
  const { categories } = state;

  const featuredProducts = categories.slice(0, 4).map(cat => cat.products?.[0]).filter(Boolean);

  return (
    <section className="py-16 sm:py-20 bg-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
          <div className="text-center sm:text-right">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              <span className="text-amber-400">أبرز</span> البطاقات
            </h2>
            <p className="mt-4 text-lg text-gray-400">اكتشف بطاقاتنا الأكثر مبيعاً.</p>
          </div>
          <button 
            onClick={onViewAll} 
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-full transition-colors whitespace-nowrap"
          >
            عرض كل البطاقات
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featuredProducts.map((offer) => (
            offer && <Card key={offer.id} item={{...offer, name: t(offer.name)}} onClick={() => onCardClick(offer.id)} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;