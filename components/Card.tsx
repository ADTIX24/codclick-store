import React from 'react';

interface Item {
  name: string;
  image_url?: string; // Add for categories
  image_urls?: string[]; // Add for products
  price?: string;
}

interface CardProps {
  item: Item;
  onClick?: () => void;
  isCategory?: boolean;
}

const Card: React.FC<CardProps> = ({ item, onClick, isCategory = false }) => {
  const displayImageUrl = isCategory ? item.image_url : (item.image_urls && item.image_urls[0]) || '';
  
  return (
    <div 
      className="bg-slate-800 rounded-2xl overflow-hidden group transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/20 cursor-pointer border border-slate-700"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && onClick?.()}
    >
      <div className="relative aspect-[3/4] w-full">
        {/* Image is the base layer */}
        <img 
          src={displayImageUrl} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        
        {/* A subtle inner border effect */}
        <div className="absolute inset-2 rounded-xl border border-white/10 pointer-events-none"></div>

        {/* --- Product Card Specifics --- */}
        {!isCategory && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end p-4 text-center">
                <h3 className="text-base font-semibold text-white mb-1 w-full truncate">{item.name}</h3>
                {item.price && (
                    <p className="text-lg font-bold text-amber-400">
                        {item.price}
                    </p>
                )}
            </div>
        )}

        {/* --- Category Card Specifics --- */}
        {isCategory && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center p-4">
            <h3 className="text-base font-semibold text-white text-center truncate w-full">{item.name}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;