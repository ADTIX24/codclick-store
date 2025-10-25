import React from 'react';

const CategoryActions: React.FC = () => {
  return (
    <div className="flex justify-between items-center bg-slate-800 p-4 rounded-lg border border-slate-700">
      <div className="flex gap-4">
        <span className="text-gray-400 my-auto">ترتيب حسب:</span>
        <button className="text-white font-semibold hover:text-amber-400 transition-colors">الأكثر شيوعاً</button>
        <button className="text-white font-semibold hover:text-amber-400 transition-colors">الأحدث</button>
        <button className="text-white font-semibold hover:text-amber-400 transition-colors">السعر</button>
      </div>
      <div>
        {/* Placeholder for view toggle if needed */}
      </div>
    </div>
  );
};

export default CategoryActions;