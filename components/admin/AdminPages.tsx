import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../state/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import type { PageKey } from '../../types';

const editablePages: PageKey[] = ['terms', 'privacy', 'refund', 'faq', 'about', 'contact', 'blog', 'business'];

const AdminPages: React.FC = () => {
    const { state, updatePage } = useAppContext();
    const { t } = useLanguage();
    const [selectedPage, setSelectedPage] = useState<PageKey>(editablePages[0]);
    const [content, setContent] = useState<any>('');

    useEffect(() => {
        const pageData = state.pages[selectedPage as keyof typeof state.pages];
        if(pageData) {
            setContent(pageData.content);
        }
    }, [selectedPage, state.pages]);

    const handleSave = () => {
        updatePage(selectedPage, content);
        alert(`${t(state.pages[selectedPage as keyof typeof state.pages].titleKey)} ${t('admin.pages.update_success')}!`);
    };

    const handleFaqChange = (index: number, field: 'q' | 'a', value: string) => {
        const newContent = [...content];
        newContent[index][field] = value;
        setContent(newContent);
    };

    const addFaqItem = () => {
        setContent([...content, { q: 'New Question', a: 'New Answer' }]);
    };
    
    const removeFaqItem = (index: number) => {
        const newContent = content.filter((_:any, i:number) => i !== index);
        setContent(newContent);
    };

    const renderEditor = () => {
        if (selectedPage === 'faq' && Array.isArray(content)) {
            return (
                <div className="space-y-4 text-right">
                    {content.map((item, index) => (
                        <div key={index} className="bg-slate-700 p-4 rounded-lg space-y-2 relative">
                            <button onClick={() => removeFaqItem(index)} className="absolute top-2 left-2 text-red-400 hover:text-red-300 font-bold text-2xl leading-none">&times;</button>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.pages.question')}</label>
                                <input type="text" value={item.q} onChange={e => handleFaqChange(index, 'q', e.target.value)} className="w-full bg-slate-700 p-2 rounded text-right"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">{t('admin.pages.answer')}</label>
                                <textarea value={item.a} onChange={e => handleFaqChange(index, 'a', e.target.value)} className="w-full bg-slate-700 p-2 rounded h-24 text-right" />
                            </div>
                        </div>
                    ))}
                    <button onClick={addFaqItem} className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-full text-sm">{t('admin.pages.add_faq')}</button>
                </div>
            );
        }
        
        return (
            <textarea
                value={typeof content === 'string' ? content : ''}
                onChange={e => setContent(e.target.value)}
                className="w-full h-96 bg-slate-700 p-4 rounded-lg border border-slate-600 focus:ring-amber-500 focus:border-amber-500 text-right"
            />
        );
    };

    return (
        <div className="bg-slate-800 p-6 rounded-lg text-right">
            <h1 className="text-3xl font-bold mb-8">{t('admin.pages.title')}</h1>
            
            <div className="mb-6">
                <label htmlFor="page-select" className="block text-sm font-medium text-gray-300 mb-2">{t('admin.pages.select_prompt')}</label>
                <select 
                    id="page-select" 
                    value={selectedPage} 
                    onChange={e => setSelectedPage(e.target.value as PageKey)}
                    className="w-full max-w-sm bg-slate-700 p-2 rounded border border-slate-600 focus:ring-amber-500 focus:border-amber-500"
                >
                    {editablePages.map(pageKey => (
                         <option key={pageKey} value={pageKey}>{t(state.pages[pageKey as keyof typeof state.pages].titleKey)}</option>
                    ))}
                </select>
            </div>

            <div className="mb-6">
                {renderEditor()}
            </div>
            
            <div className="flex justify-end">
                <button onClick={handleSave} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-6 rounded-full text-sm">{t('admin.pages.save_changes')}</button>
            </div>
        </div>
    );
};

export default AdminPages;