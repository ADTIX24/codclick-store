import React, { useState, useEffect, useCallback } from 'react';
// FIX: Added .tsx extension to module import.
import { useLanguage } from '../i18n/LanguageContext.tsx';
// FIX: Added .tsx extension to module import.
import { useAppContext } from '../state/AppContext.tsx';

interface HeroProps {
  onShopNow: () => void;
}

const getYouTubeEmbedUrl = (url?: string): string => {
    if (!url) return '';
    let videoId = '';
    try {
        const urlObj = new URL(url);
        // https://www.youtube.com/watch?v=VIDEO_ID
        const urlParams = new URLSearchParams(urlObj.search);
        videoId = urlParams.get('v') || '';
        if (!videoId) {
            // https://youtu.be/VIDEO_ID
            const match = url.match(/youtu\.be\/([^&?/]+)/);
            videoId = match ? match[1] : '';
        }
    } catch(e) {
        console.error("Invalid YouTube URL", e);
        return '';
    }

    if (videoId) {
        // Autoplay, mute, loop, and hide controls for a background video effect
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&autohide=1&modestbranding=1&rel=0`;
    }
    return '';
};


const Hero: React.FC<HeroProps> = ({ onShopNow }) => {
  const { t } = useLanguage();
  const { state } = useAppContext();
  const { heroSlides, siteSettings } = state;
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    if(heroSlides.length > 0) {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }
  }, [heroSlides.length]);

  useEffect(() => {
    if (heroSlides.length > 1) {
      const currentSlideData = heroSlides[currentSlide];
      const duration = (currentSlideData?.duration || siteSettings.slide_interval) * 1000;
      
      const timer = setTimeout(nextSlide, duration);

      return () => clearTimeout(timer);
    }
  }, [currentSlide, heroSlides, siteSettings.slide_interval, nextSlide]);


  if (heroSlides.length === 0) {
    return (
        <section className="relative h-[60vh] sm:h-[80vh] w-full text-white overflow-hidden bg-slate-800 flex items-center justify-center">
             <div className="text-center">
                <h1 className="text-4xl font-bold">Welcome to CODCLICK</h1>
                <p className="text-lg text-gray-400">Admin: Please add slides in the settings panel.</p>
            </div>
        </section>
    );
  }
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  
  const activeSlide = heroSlides[currentSlide];

  return (
    <section className="relative h-[60vh] sm:h-[80vh] w-full text-white overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          {slide.type === 'image' && (
            <img 
              src={slide.image_url} 
              alt={slide.title} 
              className="w-full h-full object-cover" 
            />
          )}
          {slide.type === 'video' && slide.video_url && (
             <video 
                key={slide.id}
                src={slide.video_url}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
            />
          )}
          {slide.type === 'youtube' && slide.youtube_url && (
             <iframe
                className="w-full h-full"
                src={getYouTubeEmbedUrl(slide.youtube_url)}
                title={slide.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
          )}
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col items-center justify-center text-center relative z-10">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-4" style={{textShadow: '0 4px 10px rgba(0,0,0,0.6)'}}>
          {activeSlide.title}
        </h1>
        <p className="max-w-3xl text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8" style={{textShadow: '0 2px 6px rgba(0,0,0,0.6)'}}>
          {activeSlide.subtitle}
        </p>
        <button
          onClick={onShopNow}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105"
        >
          {t('hero.shop_now')}
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex space-x-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${currentSlide === index ? 'bg-amber-500' : 'bg-gray-500'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;