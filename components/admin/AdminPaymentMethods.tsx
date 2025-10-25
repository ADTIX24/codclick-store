import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../state/AppContext.tsx';
import { useLanguage } from '../../i18n/LanguageContext.tsx';
import type { PaymentMethod, PaymentField } from '../../types.ts';

// Icons
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const SuccessCheckIcon: React.FC = () => ( <svg className="w-5 h-5 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);
const ErrorIcon: React.FC = () => ( <svg className="w-5 h-5 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>);

const PaymentMethodModal: React.FC<{
    method: PaymentMethod | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (method: PaymentMethod) => void;
}> = ({ method, isOpen, onClose, onSave }) => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<PaymentMethod | null>(null);

    useEffect(() => {
        setFormData(method ? JSON.parse(JSON.stringify(method)) : null);
    }, [method]);

    if (!isOpen || !formData) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData({ ...formData, [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    
    const handleFieldChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const newFields = [...formData.fields];
        // @ts-ignore
        newFields[index][name] = type === 'checkbox' ? checked : value;
        setFormData({ ...formData, fields: newFields });
    };

    const addField = () => {
        const newFields = [...formData.fields, { id: crypto.randomUUID(), label: '', value: '', is_copyable: true }];
        setFormData({ ...formData, fields: newFields });
    };

    const removeField = (index: number) => {
        const newFields = formData.fields.filter((_, i) => i !== index);
        setFormData({ ...formData, fields: newFields });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
         <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl p-6 border border-slate-700 text-right" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-6">{method?.id ? t('admin.payment.edit_method') : t('admin.payment.add_method')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                    {/* Name & Enabled */}
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <label className="block mb-1 font-semibold">{t('admin.payment.method_name')}</label>
                            <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-700 p-2 rounded border border-slate-600" required />
                        </div>
                        <div className="flex items-center pt-6">
                           <input id="enabled" name="enabled" type="checkbox" checked={formData.enabled} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                           <label htmlFor="enabled" className="mr-2 block text-sm font-medium">{t('admin.payment.enabled')}</label>
                        </div>
                    </div>
                    {/* Icon */}
                    <div>
                        <label className="block mb-1 font-semibold">{t('admin.payment.icon')}</label>
                        <select name="icon" value={formData.icon} onChange={handleChange} className="w-full bg-slate-700 p-2 rounded border border-slate-600">
                            <option value="whatsapp">{t('admin.payment.icon_whatsapp')}</option>
                            <option value="usdt">{t('admin.payment.icon_usdt')}</option>
                            <option value="wallet">{t('admin.payment.icon_wallet')}</option>
                            <option value="credit-card">{t('admin.payment.icon_credit-card')}</option>
                            <option value="custom">{t('admin.payment.icon_custom')}</option>
                        </select>
                    </div>
                    {formData.icon === 'custom' && (
                        <div>
                            <label className="block mb-1 font-semibold">{t('admin.payment.custom_icon_url')}</label>
                            <input name="custom_icon_url" value={formData.custom_icon_url || ''} onChange={handleChange} className="w-full bg-slate-700 p-2 rounded border border-slate-600" />
                        </div>
                    )}
                    {/* Instructions */}
                     <div>
                        <label className="block mb-1 font-semibold">{t('admin.payment.instructions')}</label>
                        <textarea name="instructions" value={formData.instructions || ''} onChange={handleChange} placeholder={t('admin.payment.instructions_placeholder')} className="w-full bg-slate-700 p-2 rounded border border-slate-600 h-20" />
                    </div>
                    {/* Fields */}
                    <div className="border-t border-slate-700 pt-4">
                        <h3 className="text-lg font-bold mb-2">{t('admin.payment.fields')}</h3>
                        <div className="space-y-3">
                            {formData.fields.map((field, index) => (
                                <div key={field.id} className="bg-slate-900/50 p-3 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                                    <div className="md:col-span-1">
                                        <label className="text-xs">{t('admin.payment.field_label')}</label>
                                        <input name="label" value={field.label} onChange={e => handleFieldChange(index, e)} placeholder={t('admin.payment.field_label_placeholder')} className="w-full bg-slate-700 p-2 rounded border border-slate-600" />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="text-xs">{t('admin.payment.field_value')}</label>
                                         <div className="flex items-center gap-2">
                                            <input name="value" value={field.value} onChange={e => handleFieldChange(index, e)} placeholder={t('admin.payment.field_value_placeholder')} className="w-full bg-slate-700 p-2 rounded border border-slate-600" />
                                            <button type="button" onClick={() => removeField(index)} className="text-red-400 p-2 hover:bg-slate-700 rounded-full"><DeleteIcon/></button>
                                         </div>
                                    </div>
                                    <div className="md:col-span-3 flex items-center">
                                         <input id={`copyable-${index}`} name="is_copyable" type="checkbox" checked={field.is_copyable} onChange={e => handleFieldChange(index, e)} className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500" />
                                        <label htmlFor={`copyable-${index}`} className="mr-2 text-sm">{t('admin.payment.copyable')}</label>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addField} className="mt-4 bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold py-2 px-4 rounded-full">{t('admin.payment.add_field')}</button>
                    </div>
                    {/* Actions */}
                    <div className="flex justify-start gap-4 pt-4 border-t border-slate-700">
                         <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-6 rounded-full text-sm">{t('admin.products.save')}</button>
                        <button type="button" onClick={onClose} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-full text-sm">{t('admin.products.cancel')}</button>
                    </div>
                </form>
            </div>
        </div>
    )
};


const AdminPaymentMethods: React.FC = () => {
    const { state, updateSiteSettings } = useAppContext();
    const { t } = useLanguage();
    
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);

    useEffect(() => {
        setMethods(state.siteSettings.payment_methods || []);
    }, [state.siteSettings.payment_methods]);

    const handleSaveAll = async () => {
        setMessage(null);
        const newSettings = { ...state.siteSettings, payment_methods: methods };
        const { error } = await updateSiteSettings(newSettings);
        if (error) {
            setMessage({ text: t('admin.payment.save_fail') + `: ${error.message}`, type: 'error' });
        } else {
            setMessage({ text: t('admin.payment.save_success'), type: 'success' });
        }
        setTimeout(() => setMessage(null), 5000);
    };
    
    const openAddModal = () => {
        setEditingMethod({
            id: crypto.randomUUID(),
            name: '',
            icon: 'wallet',
            enabled: true,
            instructions: '',
            fields: [],
        });
        setIsModalOpen(true);
    };

    const openEditModal = (method: PaymentMethod) => {
        setEditingMethod(method);
        setIsModalOpen(true);
    };

    const handleSaveModal = (method: PaymentMethod) => {
        const exists = methods.some(m => m.id === method.id);
        if (exists) {
            setMethods(methods.map(m => m.id === method.id ? method : m));
        } else {
            setMethods([...methods, method]);
        }
        setIsModalOpen(false);
        setEditingMethod(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm(t('admin.payment.confirm_delete'))) {
            setMethods(methods.filter(m => m.id !== id));
        }
    };
    
    const handleToggle = (id: string) => {
        setMethods(methods.map(m => m.id === id ? {...m, enabled: !m.enabled} : m));
    }

    return (
        <div className="bg-slate-800 p-6 rounded-lg text-right">
            {isModalOpen && <PaymentMethodModal isOpen={isModalOpen} method={editingMethod} onClose={() => setIsModalOpen(false)} onSave={handleSaveModal} />}
            <div className="flex justify-between items-center mb-4">
                 <h1 className="text-3xl font-bold">{t('admin.payment.title')}</h1>
            </div>
             <p className="text-gray-400 mb-8">{t('admin.payment.manage_methods')}</p>

            <div className="space-y-4 mb-8">
                {methods.map(method => (
                    <div key={method.id} className="bg-slate-700 p-4 rounded-lg flex items-center justify-between">
                         <div className="flex items-center gap-2">
                            <button onClick={() => openEditModal(method)} className="p-2 hover:bg-slate-600 rounded-full"><EditIcon /></button>
                            <button onClick={() => handleDelete(method.id)} className="p-2 hover:bg-slate-600 rounded-full text-red-400"><DeleteIcon /></button>
                        </div>
                         <div className="flex-1 text-right mx-4">
                            <p className="font-bold">{method.name}</p>
                        </div>
                        <div className="flex items-center gap-4">
                             <button onClick={() => handleToggle(method.id)} className={`px-3 py-1 text-xs font-bold rounded-full ${method.enabled ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-400'}`}>
                                {method.enabled ? 'مفعل' : 'معطل'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-start items-center gap-4">
                <button onClick={openAddModal} className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-full text-sm">{t('admin.payment.add_method')}</button>
                <button onClick={handleSaveAll} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-6 rounded-full text-sm">{t('admin.payment.save_changes')}</button>
                {message && (
                    <div className={`text-sm flex items-center gap-2 ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {message.type === 'success' ? <SuccessCheckIcon /> : <ErrorIcon />}
                        <span>{message.text}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPaymentMethods;
