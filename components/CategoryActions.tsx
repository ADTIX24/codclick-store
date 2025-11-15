import React from 'react';
import { useLanguage } from '../i18n/LanguageContext.tsx';

const CategoryActions: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row justify-start items-center gap-4 bg-slate-800 p-4 rounded-lg border border-slate-700">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="text-gray-400">ترتيب حسب:</span>
        <button className="text-white font-semibold hover:text-amber-400 transition-colors">الأكثر شيوعاً</button>
        <button className="text-white font-semibold hover:text-amber-400 transition-colors">الأحدث</button>
        <button className="text-white font-semibold hover:text-amber-400 transition-colors">السعر</button>
      </div>
    </div>
  );
};

export default CategoryActions;