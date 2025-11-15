import React, { useState, useEffect } from 'react';
// FIX: Added .tsx extension to module import.
import { useAppContext } from '../../state/AppContext.tsx';
// FIX: Added .tsx extension to module import.
import { useLanguage } from '../../i18n/LanguageContext.tsx';
// FIX: Added .ts extension to module import.
import type { HeroSlide, SiteSettings } from '../../types.ts';

// Icons
const GeneralUploadIcon: React.FC<{className?: string}> = ({className}) => ( <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6 text-gray-400"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg> );
const EditIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg> );
const DeleteIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> );

const DEFAULT_SLIDE: Omit<HeroSlide, 'id'> = {
    title: 'عنوان جديد',
    subtitle: 'عنوان فرعي جديد',
    type: 'image',
    image_url: 'https://images.unsplash.com/photo-1488330890490-c291ec1364d0?q=80&w=2070&auto-format&fit=crop',
    video_url: '',
    youtube_url: '',
    duration: 7,
};

const SlideModal: React.FC<{
    slide: HeroSlide | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (slideData: any) => void;
    t: (key: string) => string;
}> = ({ slide, isOpen, onClose, onSave, t }) => {
    const [formData, setFormData] = useState<any>(slide || DEFAULT_SLIDE);

    useEffect(() => {
        setFormData(slide || DEFAULT_SLIDE);
    }, [slide]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? parseInt(value, 10) : value;
        setFormData((prev:any) => ({ ...prev, [name]: val }));
    };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'video_url') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setFormData((prev: any) => ({ ...prev, [field]: event.target!.result as string }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl p-6 border border-slate-700 text-right" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6">{slide ? 'تعديل الشريحة' : t('admin.settings.add_slide')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                    {/* Title & Subtitle */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-semibold">{t('admin.settings.slide_title')}</label>
                            <input name="title" type="text" value={formData.title} onChange={handleChange} className="w-full bg-slate-700 p-2 rounded border border-slate-600" required />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">{t('admin.settings.slide_subtitle')}</label>
                            <input name="subtitle" type="text" value={formData.subtitle} onChange={handleChange} className="w-full bg-slate-700 p-2 rounded border border-slate-600" />
                        </div>
                    </div>
                    {/* Type & Duration */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-semibold">{t('admin.settings.slide_type')}</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-700 p-2 rounded border border-slate-600">
                                <option value="image">{t('admin.settings.image')}</option>
                                <option value="video">{t('admin.settings.video')}</option>
                                <option value="youtube">{t('admin.settings.youtube')}</option>
                            </select>
                        </div>
                         <div>
                            <label className="block mb-1 font-semibold">{t('admin.settings.duration_per_slide')}</label>
                            <input name="duration" type="number" placeholder={t('admin.settings.duration_per_slide_hint')} value={formData.duration || ''} onChange={handleChange} className="w-full bg-slate-700 p-2 rounded border border-slate-600" />
                        </div>
                    </div>
                    {/* Conditional Fields */}
                    {formData.type === 'image' && (
                        <div>
                            <label className="block mb-1 font-semibold">{t('admin.settings.upload_image')}</label>
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'image_url')} className="w-full bg-slate-700 p-2 rounded border border-slate-600" />
                            {formData.image_url && <img src={formData.image_url} alt="preview" className="mt-2 h-24 rounded" />}
                        </div>
                    )}
                     {formData.type === 'video' && (
                        <div>
                            <label className="block mb-1 font-semibold">{t('admin.settings.upload_video')}</label>
                            <input type="file" accept="video/*" onChange={(e) => handleImageUpload(e, 'video_url')} className="w-full bg-slate-700 p-2 rounded border border-slate-600" />
                            {formData.video_url && <video src={formData.video_url} controls className="mt-2 h-24 rounded" />}
                        </div>
                    )}
                    {formData.type === 'youtube' && (
                        <div>
                            <label className="block mb-1 font-semibold">{t('admin.settings.youtube_url')}</label>
                            <input name="youtube_url" type="url" value={formData.youtube_url || ''} onChange={handleChange} className="w-full bg-slate-700 p-2 rounded border border-slate-600" placeholder="https://www.youtube.com/watch?v=..." />
                        </div>
                    )}

                    <div className="flex justify-start gap-4 pt-4">
                         <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-6 rounded-full text-sm">{t('admin.products.save')}</button>
                        <button type="button" onClick={onClose} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-full text-sm">{t('admin.products.cancel')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}


const AdminSettings: React.FC = () => {
    const { state, updateSiteSettings, addHeroSlide, updateHeroSlide, deleteHeroSlide } = useAppContext();
    const { t } = useLanguage();

    const [settings, setSettings] = useState<SiteSettings>(state.site_settings);
    const [slides, setSlides] = useState<HeroSlide[]>(state.hero_slides);
    const [slideModal, setSlideModal] = useState<{isOpen: boolean; slide: HeroSlide | null}>({isOpen: false, slide: null});
    const [showSuccess, setShowSuccess] = useState(false);


    useEffect(() => {
        setSettings(state.site_settings);
        setSlides(state.hero_slides);
    }, [state.site_settings, state.hero_slides]);

    const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (key: string, field: 'url' | 'icon', value: string) => {
        setSettings(prev => ({
            ...prev,
            social_links: {
                ...prev.social_links,
                [key]: {
                    ...(prev.social_links[key] || { url: '', icon: '' }),
                    [field]: value,
                },
            },
        }));
    };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    callback(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveSettings = async () => {
        await updateSiteSettings({ ...settings, social_links: settings.social_links || {} });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };
    
    const handleSaveSlide = async (slideData: HeroSlide) => {
        if (slideData.id) {
            // It's an existing slide, update it
            await updateHeroSlide(slideData);
        } else {
            // It's a new slide, add it
            const { id, ...newSlideData } = slideData; // Exclude ID for insertion
            await addHeroSlide(newSlideData);
        }
        setSlideModal({isOpen: false, slide: null});
    };

    const SuccessCheck: React.FC = () => (
      <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );

    return (
        <div className="bg-slate-800 p-6 rounded-lg text-right">
            <SlideModal 
                isOpen={slideModal.isOpen}
                slide={slideModal.slide}
                onClose={() => setSlideModal({isOpen: false, slide: null})}
                onSave={handleSaveSlide}
                t={t}
            />

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{t('admin.settings.title')}</h1>
            </div>

            <div className="space-y-8">
                {/* General Settings */}
                <div className="bg-slate-700 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">{t('admin.settings.general_settings')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">{t('admin.settings.upload_logo')}</label>
                            <div className="flex items-center gap-4">
                                {settings.logo_url && <img src={settings.logo_url} alt="Logo Preview" className="h-12 w-auto bg-slate-800 p-1 rounded" />}
                                <label className="cursor-pointer bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-full text-sm flex items-center gap-2">
                                    <GeneralUploadIcon className="h-5 w-5"/>
                                    <span>{settings.logo_url ? 'تغيير الشعار' : 'تحميل'}</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, (url) => setSettings(prev => ({...prev, logo_url: url})))} />
                                </label>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">{t('admin.settings.logo_size_recommendation')}</p>
                        </div>
                        <div>
                            <label htmlFor="slide_interval" className="block text-sm font-medium text-gray-300 mb-2">{t('admin.settings.slide_interval')}</label>
                            <input
                                id="slide_interval"
                                name="slide_interval"
                                type="number"
                                value={settings.slide_interval}
                                onChange={handleSettingsChange}
                                className="w-full bg-slate-800 p-2 rounded border border-slate-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Hero Slides */}
                <div className="bg-slate-700 p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{t('admin.settings.hero_slides')}</h2>
                        <button onClick={() => setSlideModal({isOpen: true, slide: null})} className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-full text-sm">{t('admin.settings.add_slide')}</button>
                    </div>
                    <div className="space-y-2">
                        {slides.map((slide) => (
                          <div key={slide.id} className="bg-slate-800 p-3 rounded-lg border border-slate-600 flex justify-between items-center">
                                <div className='flex items-center gap-2'>
                                     <button onClick={() => deleteHeroSlide(slide.id)} className="text-gray-400 hover:text-red-500 p-1"><DeleteIcon/></button>
                                     <button onClick={() => setSlideModal({isOpen: true, slide: slide})} className="text-gray-400 hover:text-amber-400 p-1"><EditIcon /></button>
                                </div>
                                <div>
                                    <p className="font-semibold">{slide.title}</p>
                                    <p className="text-sm text-gray-400">{slide.subtitle}</p>
                                </div>
                                <img src={slide.image_url} alt={slide.title} className="w-16 h-10 object-cover rounded" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Social Media Links */}
                <div className="bg-slate-700 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">{t('admin.settings.social_media')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        {Object.keys(state.site_settings.social_links).map((key) => (
                            <div key={key}>
                                <label className="capitalize block text-sm font-medium text-gray-300 mb-1">{key}</label>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="url"
                                        placeholder="https://..."
                                        value={settings.social_links[key]?.url || ''}
                                        onChange={(e) => handleSocialChange(key, 'url', e.target.value)}
                                        className="w-full bg-slate-800 p-2 rounded border border-slate-600"
                                    />
                                    <label className="flex-shrink-0 cursor-pointer w-10 h-10 bg-slate-800 rounded border border-slate-600 flex items-center justify-center hover:bg-slate-600">
                                        {settings.social_links[key]?.icon ? (
                                            <img src={settings.social_links[key].icon} alt={`${key} icon`} className="w-full h-full object-contain p-1" />
                                        ) : (
                                            <GeneralUploadIcon className="h-5 w-5 text-gray-400" />
                                        )}
                                        <input type="file" className="hidden" accept="image/*,.svg" onChange={(e) => handleImageUpload(e, (url) => handleSocialChange(key, 'icon', url))} />
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* App Promotion Settings */}
                <div className="bg-slate-700 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">{t('admin.settings.app_promotion_settings')}</h2>
                    <div>
                        <label htmlFor="app_download_link" className="block text-sm font-medium text-gray-300 mb-2">{t('admin.settings.app_download_link')}</label>
                        <input
                            id="app_download_link"
                            name="app_download_link"
                            type="url"
                            placeholder="https://..."
                            value={settings.app_download_link || ''}
                            onChange={handleSettingsChange}
                            className="w-full bg-slate-800 p-2 rounded border border-slate-600"
                        />
                    </div>
                </div>

                {/* Footer Settings */}
                <div className="bg-slate-700 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4">إعدادات التذييل</h2>
                    <div>
                        <label htmlFor="copyright_text" className="block text-sm font-medium text-gray-300 mb-2">{t('admin.settings.copyright_text_label')}</label>
                        <input
                            id="copyright_text"
                            name="copyright_text"
                            type="text"
                            value={settings.copyright_text}
                            onChange={(e) => setSettings(prev => ({ ...prev, copyright_text: e.target.value }))}
                            className="w-full bg-slate-800 p-2 rounded border border-slate-600"
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-start items-center gap-4 mt-8">
                <button onClick={handleSaveSettings} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-6 rounded-full text-sm">{t('admin.settings.save_settings')}</button>
                {showSuccess && (
                    <div className="flex items-center gap-2 text-green-400">
                        <SuccessCheck />
                        <span>{t('admin.settings.update_success')}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSettings;