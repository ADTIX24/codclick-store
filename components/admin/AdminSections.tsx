import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../state/AppContext.tsx';
import { useLanguage } from '../../i18n/LanguageContext.tsx';
import type { HomepageSection } from '../../types.ts';

const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const UpIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" /></svg>;
const DownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>;

const AdminSections: React.FC = () => {
    const { state, upsertHomepageSections } = useAppContext();
    const { t } = useLanguage();
    
    const [sections, setSections] = useState<HomepageSection[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);

    useEffect(() => {
        setSections(state.homepage_sections);
    }, [state.homepage_sections]);

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newSections = [...sections];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newSections.length) return;
        [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
        setSections(newSections);
    };

    const handleToggleVisibility = (id: string) => {
        setSections(sections.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
    };

    const handleAdd = () => {
        setEditingSection({
            id: crypto.randomUUID(),
            index: sections.length,
            title: '',
            subtitle: '',
            type: 'product_section',
            visible: true,
            category_id: null,
        });
        setIsModalOpen(true);
    };

    const handleEdit = (section: HomepageSection) => {
        setEditingSection(section);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setSections(sections.filter(s => s.id !== id));
    };

    const handleSaveModal = (section: HomepageSection) => {
        if (sections.some(s => s.id === section.id)) {
            setSections(sections.map(s => s.id === section.id ? section : s));
        } else {
            setSections([...sections, section]);
        }
        setIsModalOpen(false);
        setEditingSection(null);
    };
    
    const handleSaveChanges = async () => {
        const { error } = await upsertHomepageSections(sections);
        if (error) {
            alert(`Error saving sections: ${error.message}`);
        } else {
            alert('Sections saved successfully!');
        }
    };

    return (
        <div className="bg-slate-800 p-6 rounded-lg text-right">
            <h1 className="text-3xl font-bold mb-2">{t('admin.sections.main_title')}</h1>
            <p className="text-gray-400 mb-8">{t('admin.sections.description')}</p>

            <div className="space-y-4 mb-8">
                {sections.map((section, index) => (
                    <div key={section.id} className="bg-slate-700 p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="p-2 hover:bg-slate-600 rounded-full disabled:opacity-50"><UpIcon /></button>
                            <button onClick={() => handleMove(index, 'down')} disabled={index === sections.length - 1} className="p-2 hover:bg-slate-600 rounded-full disabled:opacity-50"><DownIcon /></button>
                            <button onClick={() => handleEdit(section)} className="p-2 hover:bg-slate-600 rounded-full"><EditIcon /></button>
                            <button onClick={() => handleDelete(section.id)} className="p-2 hover:bg-slate-600 rounded-full text-red-400"><DeleteIcon /></button>
                        </div>
                        <div className="flex-1 text-right mx-4">
                            <p className="font-bold">{section.title}</p>
                            <p className="text-sm text-gray-400">{section.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-mono bg-slate-600 px-2 py-1 rounded">{t(`admin.sections.type_${section.type}`)}</span>
                            <button onClick={() => handleToggleVisibility(section.id)} className={`px-3 py-1 text-xs font-bold rounded-full ${section.visible ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'}`}>
                                {section.visible ? t('admin.sections.visible') : t('admin.sections.hidden')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-start gap-4">
                <button onClick={handleAdd} className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-full text-sm">{t('admin.sections.add_section')}</button>
                <button onClick={handleSaveChanges} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-6 rounded-full text-sm">{t('admin.sections.save')}</button>
            </div>

            {isModalOpen && (
                <SectionModal
                    section={editingSection}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveModal}
                />
            )}
        </div>
    );
};

const SectionModal: React.FC<{
    section: HomepageSection | null;
    onClose: () => void;
    onSave: (section: HomepageSection) => void;
}> = ({ section, onClose, onSave }) => {
    const { state } = useAppContext();
    const { t } = useLanguage();
    const [formData, setFormData] = useState<HomepageSection | null>(section);

    if (!formData) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl p-6 border border-slate-700 text-right" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6">{t('admin.sections.edit_section')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-semibold">{t('admin.sections.section_title')}</label>
                        <input name="title" value={formData.title} onChange={handleChange} className="w-full bg-slate-700 p-2 rounded border border-slate-600" required />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold">{t('admin.sections.section_subtitle')}</label>
                        <input name="subtitle" value={formData.subtitle} onChange={handleChange} className="w-full bg-slate-700 p-2 rounded border border-slate-600" />
                    </div>
                    <div>
                        <label className="block mb-1 font-semibold">{t('admin.sections.section_type')}</label>
                        <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-slate-700 p-2 rounded border border-slate-600">
                            <option value="product_section">{t('admin.sections.type_product_section')}</option>
                            <option value="category_grid">{t('admin.sections.type_category_grid')}</option>
                            <option value="new_products">{t('admin.sections.type_new_products')}</option>
                        </select>
                    </div>
                    {formData.type === 'product_section' && (
                        <div>
                            <label className="block mb-1 font-semibold">{t('admin.sections.select_category')}</label>
                            <select name="category_id" value={formData.category_id || ''} onChange={handleChange} className="w-full bg-slate-700 p-2 rounded border border-slate-600">
                                <option value="">-- {t('admin.sections.select_category')} --</option>
                                {state.categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{t(cat.name)}</option>
                                ))}
                            </select>
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
};

export default AdminSections;