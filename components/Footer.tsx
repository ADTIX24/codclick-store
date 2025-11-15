import React from 'react';
// FIX: Added .tsx extension to module import.
import { useLanguage } from '../i18n/LanguageContext.tsx';
// FIX: Added .tsx extension to module import.
import { useAppContext } from '../state/AppContext.tsx';
// FIX: Added .ts extension to module import.
import type { PageKey } from '../types.ts';

// Social Media Icons
const FacebookIcon: React.FC = () => ( <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg> );
const TwitterIcon: React.FC = () => ( <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 7.184L18.901 1.153zm-1.8 19.498h2.84L7.058 2.544H4.03l13.07 18.107z"/></svg> );
const InstagramIcon: React.FC = () => ( <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.585-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.585.069-4.85c.149-3.225 1.664-4.771 4.919 4.919C8.415 2.175 8.796 2.163 12 2.163zm0 1.441c-3.171 0-3.543.012-4.785.069-2.695.123-3.875 1.318-3.998 3.998-.056 1.24-.067 1.61-.067 4.785s.011 3.546.067 4.785c.123 2.68 1.303 3.875 3.998 3.998 1.242.056 1.613.067 4.785.067s3.543-.011 4.785-.067c2.695-.123 3.875-1.318 3.998-3.998.056-1.24.067-1.61.067-4.785s-.011-3.546-.067-4.785c-.123-2.68-1.303-3.875-3.998-3.998C15.543 3.614 15.171 3.604 12 3.604zm0 2.446c-3.033 0-5.5 2.467-5.5 5.5s2.467 5.5 5.5 5.5 5.5-2.467 5.5-5.5-2.467-5.5-5.5-5.5zm0 9.083c-1.98 0-3.583-1.603-3.583-3.583s1.603-3.583 3.583-3.583 3.583 1.603 3.583 3.583-1.603 3.583-3.583 3.583zm4.965-9.333c-.78 0-1.416.636-1.416 1.416s.636 1.416 1.416 1.416 1.416-.636 1.416-1.416-.636-1.416-1.416-1.416z" clipRule="evenodd" /></svg> );
const YouTubeIcon: React.FC = () => ( <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.219,4,12,4,12,4S5.781,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.781,2,12,2,12s0,4.219,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.781,20,12,20,12,20s6.219,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.219,22,12,22,12S22,7.781,21.582,6.186z M9.545,15.568V8.432L15.818,12L9.545,15.568z"/></svg> );
const TelegramIcon: React.FC = () => ( <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M11.944,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,11.944,0ZM18.258,8.018l-2.074,9.756c-.245,1.144-1.056,1.43-2.023.884l-3.21-2.366-1.55,1.492c-.171.171-.314.313-.611.313a.973.973,0,0,1-.626-.273l.221-3.282,5.823-5.263c.26-.233-.063-.363-.423-.122L9.9,13.889l-3.132-.978c-1.139-.354-1.159-1.165.214-1.721L17.1,7.019c.932-.46,1.745.242,1.458,1Z"/></svg> );
const WhatsAppIcon: React.FC = () => ( <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.79.46 3.49 1.32 4.95L2 22l5.25-1.38c1.41.79 3.05 1.22 4.79 1.22h.01c5.46 0 9.9-4.44 9.91-9.9C21.95 6.45 17.5 2 12.04 2zM16.53 13.96c-.2-.09-1.17-.58-1.35-.64s-.32-.09-.45.09c-.13.18-.51.64-.62.77s-.23.15-.42.06c-.19-.09-1.25-.46-2.38-1.47s-1.74-2.22-1.93-2.58c-.19-.37-.02-.57.08-.69.09-.1.2-.26.3-.39.09-.13.13-.21.2-.35.06-.13 0-.26-.04-.35-.04-.09-.45-1.08-.62-1.47-.16-.38-.32-.33-.45-.33h-.27c-.13 0-.32.04-.48.18s-.62.6-.62 1.44c0 .84.65 1.68.75 1.81s1.24 2.18 3.01 2.96c1.77.78 2.23.83 2.64.79.41-.04 1.17-.48 1.34-.94s.16-.88.11-1.04c-.05-.13-.19-.21-.39-.3z"></path></svg> );
const SnapchatIcon: React.FC = () => ( <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M11.9.4a11.5 11.5 0 0 0-7.8 19.3L4 23.6l3.9-2.2a11.5 11.5 0 1 0 4-21zm-2.6 13.8c0 .2.1.4.2.6.1.2.3.3.5.5.2.1.4.2.6.2s.4-.1.6-.2c.2-.1.4-.3.5-.5.1-.2.2-.4.2-.6s0-.4-.2-.6c-.1-.2-.3-.3-.5-.5-.2-.1-.4-.2-.6-.2s-.4.1-.6.2c-.2.1-.4.3-.5.5-.1.2-.2.4-.2.6zm6.3 0c0 .2.1.4.2.6.1.2.3.3.5.5.2.1.4.2.6.2s.4-.1.6-.2c.2-.1.4-.3.5-.5.1-.2.2-.4.2-.6s0-.4-.2-.6c-.1-.2-.3-.3-.5-.5-.2-.1-.4-.2-.6-.2s-.4.1-.6.2c-.2.1-.4.3-.5.5-.1.2-.2.4-.2.6z"/></svg> );
const TikTokIcon: React.FC = () => ( <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.38 1.92-3.54 2.96-5.94 3.02h-1.16v-4.28c.96-.06 1.9-.34 2.76-.86.86-.52 1.46-1.32 1.82-2.26.08-1.52.09-3.07.06-4.6-.2-1.79-1.17-3.35-2.6-4.56-1.29-1.08-2.82-1.7-4.4-1.9V2.35c.66.01 1.32.02 1.98.03.01 1.22.48 2.42 1.32 3.31.81.86 1.9 1.31 3.01 1.4v-4.48c-.1-.01-.19-.02-.28-.02z"/></svg> );

const socialIcons: { [key: string]: React.FC } = {
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
  telegram: TelegramIcon,
  whatsapp: WhatsAppIcon,
  snapchat: SnapchatIcon,
  tiktok: TikTokIcon,
};


const Footer: React.FC = () => {
  const { t, toggleLanguage } = useLanguage();
  const { state, navigateTo } = useAppContext();
  const { site_settings } = state;
  const { social_links, logo_url } = site_settings;
  
  const handleNav = (e: React.MouseEvent, page: PageKey) => {
    e.preventDefault();
    navigateTo(page);
  };

  const productLinks = [
    { key: 'footer.itunes_cards', page: 'category', categoryId: 'itunes' },
    { key: 'footer.playstation_cards', page: 'category', categoryId: 'playstation' },
    { key: 'footer.pubg_cards', page: 'category', categoryId: 'game-cards' },
  ];
  
  const companyLinks = [
    { key: 'footer.about_us', page: 'about' },
    { key: 'footer.blog', page: 'blog' },
    { key: 'footer.contact_us', page: 'contact' },
  ];

  const legalLinks = [
    { key: 'footer.terms_of_service', page: 'terms' },
    { key: 'footer.privacy_policy', page: 'privacy' },
    { key: 'footer.refund_policy', page: 'refund' },
  ];
  
  const supportLinks = [
    { key: 'footer.faq', page: 'faq' },
    { key: 'footer.my_account', page: 'my_account' },
    { key: 'footer.track_order', page: 'track_order' },
  ];

  return (
    <footer className="bg-transparent border-t border-slate-700/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <a href="#" onClick={(e) => handleNav(e, 'home')} className="inline-block">
                {logo_url ? <img src={logo_url} alt="CODCLICK Logo" className="h-10 w-auto" /> : <span className="text-2xl font-bold text-amber-400">CODCLICK</span>}
            </a>
            <p className="mt-4 text-gray-400">{t('footer.tagline')}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-4">
              {Object.entries(social_links).map(([key, linkData]) => {
                  const Icon = socialIcons[key];
                  if (!linkData || !linkData.url || linkData.url.trim() === '' || linkData.url === '#') return null;
                  
                  return (
                      <a key={key} href={linkData.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-amber-400">
                          <span className="sr-only">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                          {linkData.icon ? (
                            <img src={linkData.icon} className="w-6 h-6 object-contain" alt={key} />
                          ) : (
                            Icon && <Icon />
                          )}
                      </a>
                  );
              })}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">{t('footer.products')}</h3>
            <ul className="mt-4 space-y-2">
              {productLinks.map(link => (
                <li key={link.key}>
                  <a href="#" onClick={(e) => { e.preventDefault(); navigateTo(link.page as PageKey, link.categoryId); }} className="text-base text-gray-400 hover:text-amber-400">{t(link.key)}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">{t('footer.company')}</h3>
            <ul className="mt-4 space-y-2">
              {companyLinks.map(link => (
                <li key={link.key}>
                  <a href="#" onClick={(e) => handleNav(e, link.page as PageKey)} className="text-base text-gray-400 hover:text-amber-400">{t(link.key)}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">{t('footer.legal')}</h3>
            <ul className="mt-4 space-y-2">
              {legalLinks.map(link => (
                <li key={link.key}>
                  <a href="#" onClick={(e) => handleNav(e, link.page as PageKey)} className="text-base text-gray-400 hover:text-amber-400">{t(link.key)}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">{t('footer.support')}</h3>
            <ul className="mt-4 space-y-2">
              {supportLinks.map(link => (
                <li key={link.key}>
                  <a href="#" onClick={(e) => handleNav(e, link.page as PageKey)} className="text-base text-gray-400 hover:text-amber-400">{t(link.key)}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-700/50 pt-8 text-center text-gray-500">
          <p>{site_settings.copyright_text || t('footer.copyright')}</p>
          <div className="mt-4">
            <button onClick={toggleLanguage} className="text-sm text-gray-400 hover:text-amber-400 transition-colors">
                {t('toggle_language')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;