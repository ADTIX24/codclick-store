import React from 'react';
// FIX: Corrected import path for Card component.
import Card from './components/Card.tsx';
import { useLanguage } from './i18n/LanguageContext.tsx';
import { useAppContext } from './state/AppContext.tsx';

interface CategoryGridProps {
  title: string;
  subtitle: string;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ title, subtitle }) => {
  const { t } = useLanguage();
  const { state, navigateTo } = useAppContext();
  const { categories } = state;

  return (
    <section className="py-16 sm:py-20 bg-transparent">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">{title}</h2>
          <p className="mt-4 text-lg text-gray-400">{subtitle}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 lg:gap-8">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              item={{...category, name: t(category.name), image_url: category.image_url}} 
              isCategory={true}
              onClick={() => navigateTo('category', category.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
