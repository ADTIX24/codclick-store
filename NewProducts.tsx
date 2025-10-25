import React from 'react';
// FIX: Corrected import path for Card component.
import Card from './components/Card.tsx';
import { useLanguage } from './i18n/LanguageContext.tsx';
import { useAppContext } from './state/AppContext.tsx';
import type { Product } from './types.ts';

interface NewProductsProps {
  title: string;
  subtitle: string;
  onViewAll: () => void;
  onCardClick: (productId: string) => void;
}

const NewProducts: React.FC<NewProductsProps> = ({ title, subtitle, onViewAll, onCardClick }) => {
  const { t } = useLanguage();
  const { state } = useAppContext();
  const { categories } = state;

  const allProducts: Product[] = categories.flatMap(cat => cat.products);
  const newProducts = allProducts.slice(-8).reverse(); // Example: get last 8 products

  return (
    <section className="py-16 sm:py-20 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
          <div className="text-center sm:text-right">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white" dangerouslySetInnerHTML={{ __html: title }} />
            <p className="mt-4 text-lg text-gray-400">{subtitle}</p>
          </div>
          <button 
            onClick={onViewAll} 
            className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-full transition-colors whitespace-nowrap"
          >
            {t('header.all_cards')}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 lg:gap-8">
          {newProducts.map((product) => {
            return (
              <Card 
                key={product.id} 
                item={{
                  ...product,
                  name: t(product.name),
                }}
                onClick={() => onCardClick(product.id)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default NewProducts;
