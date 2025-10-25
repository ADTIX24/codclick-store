import React, { useState, useMemo, useEffect } from 'react';
import Card from './Card.tsx';
import CategoryActions from './CategoryActions.tsx';
// FIX: Added .tsx extension to module import.
import { useLanguage } from '../i18n/LanguageContext.tsx';
// FIX: Added .tsx extension to module import.
import { useAppContext } from '../state/AppContext.tsx';

interface ProductsPageProps {
  categoryId?: string | null;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ categoryId }) => {
  const { t } = useLanguage();
  const { state, navigateTo } = useAppContext();
  const { categories } = state;
  
  const [activeCategory, setActiveCategory] = useState<string>(categoryId || 'all');

  useEffect(() => {
    setActiveCategory(categoryId || 'all');
  }, [categoryId]);

  const { currentCategory, productsToShow } = useMemo(() => {
    if (activeCategory === 'all') {
      const allProducts = categories.flatMap(cat => cat.products);
      return { currentCategory: null, productsToShow: allProducts };
    }
    const category = categories.find(cat => cat.id === activeCategory);
    return { currentCategory: category || null, productsToShow: category?.products || [] };
  }, [activeCategory, categories]);
  
  const handleCategoryClick = (id: string) => {
    setActiveCategory(id);
    navigateTo(id === 'all' ? 'products' : 'category', id);
  }
  
  return (
    <div className="bg-transparent min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            {currentCategory ? t(currentCategory.name) : t('header.all_cards')}
          </h1>
          <p className="mt-4 text-lg text-gray-400">
            {currentCategory ? `تصفح جميع المنتجات في فئة ${t(currentCategory.name)}` : 'تصفح مجموعتنا الكاملة من البطاقات الرقمية.'}
          </p>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
            <button
                onClick={() => handleCategoryClick('all')}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeCategory === 'all' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
            >
                {t('header.all_cards')}
            </button>
            {categories.map(cat => (
                 <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeCategory === cat.id ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
                >
                    {t(cat.name)}
                </button>
            ))}
        </div>
        
        <CategoryActions />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 lg:gap-8 mt-8">
          {productsToShow.map((product) => (
             <Card 
                key={product.id} 
                item={{
                    name: t(product.name),
                    price: product.price,
                    image_urls: product.image_urls
                }} 
                onClick={() => navigateTo('product_detail', product.id)}
             />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;