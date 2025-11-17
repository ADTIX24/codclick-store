import React, { useState, useEffect } from 'react';
// FIX: Added .tsx extension to module import.
import { useAppContext } from '../../state/AppContext.tsx';
// FIX: Added .tsx extension to module import.
import { useLanguage } from '../../i18n/LanguageContext.tsx';
// FIX: Added .ts extension to module import.
import type { Category, Product } from '../../types.ts';
import { supabaseClient } from '../../supabase/client.ts';

// Icons
const EditIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg> );
const DeleteIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg> );
const ChevronDownIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg> );
const UploadIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg> );
const CloseIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg> );
const WarningIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> );
const FileTextIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> );
const VideoIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> );
const MusicIcon: React.FC = () => ( <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-13c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" /></svg> );

type ModalMode = 'addCategory' | 'editCategory' | 'addProduct' | 'editProduct';

interface ModalState {
    isOpen: boolean;
    mode: ModalMode | null;
    data?: Category | Product;
}

interface ConfirmState {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
}

const AdminProducts: React.FC = () => {
    const { state, addCategory, updateCategory, deleteCategory, addProduct, updateProduct, deleteProduct, fetchAllData } = useAppContext();
    const { t } = useLanguage();

    const [modalState, setModalState] = useState<ModalState>({ isOpen: false, mode: null, data: undefined });
    const [confirmState, setConfirmState] = useState<ConfirmState>({ isOpen: false, message: '', onConfirm: () => {} });
    const [openCategories, setOpenCategories] = useState<string[]>([]);
    
    // Form state
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [deliveryType, setDeliveryType] = useState<Product['delivery_type']>('code');
    const [deliveryFile, setDeliveryFile] = useState<string>('');
    const [deliveryCodes, setDeliveryCodes] = useState<string>('');
    
    // Upload and error state
    const [isUploading, setIsUploading] = useState(false);
    const [modalError, setModalError] = useState('');

    const openModal = async (mode: ModalMode, data?: any) => {
        let fullData = { ...data }; // Create a mutable copy
    
        // If editing a product, fetch its full data to get delivery_content
        if (mode === 'editProduct' && data?.id) {
            try {
                const { data: productDetails, error } = await supabaseClient
                    .from('products')
                    .select('delivery_content')
                    .eq('id', data.id)
                    .single();

                if (error) throw error;
                
                fullData.delivery_content = productDetails.delivery_content;
            } catch (error) {
                console.error("Failed to fetch full product details for editing:", error);
                setModalError("تحذير: لم نتمكن من تحميل محتوى التسليم. قد يؤدي حفظ التغييرات إلى مسح الأكواد الموجودة.");
            }
        }

        // Reset and set display images
        if ((mode === 'editProduct' || mode === 'addProduct') && fullData?.image_urls) {
            setImageUrls(fullData.image_urls);
        } else if (mode === 'editCategory' && fullData?.image_url) {
            setImageUrls([fullData.image_url]);
        } else {
            setImageUrls([]);
        }

        // Reset and set delivery content from the potentially updated fullData
        if (mode === 'editProduct' || mode === 'addProduct') {
            const product = fullData as Product;
            const type = product?.delivery_type || 'code';
            setDeliveryType(type);

            if (type !== 'code') {
                setDeliveryFile(product?.delivery_content as string || '');
                setDeliveryCodes('');
            } else { // code
                setDeliveryCodes(Array.isArray(product?.delivery_content) ? product.delivery_content.join('\n') : (product?.delivery_content as string || ''));
                setDeliveryFile('');
            }
        } else {
             setDeliveryType('code');
             setDeliveryFile('');
             setDeliveryCodes('');
        }
        
        // Don't clear a warning error that might have been set during data fetching
        if (modalError === '') setModalError('');
        
        setModalState({ isOpen: true, mode, data: fullData });
    };

    const closeModal = () => {
        setModalState({ isOpen: false, mode: null, data: undefined });
        // Reset all form states
        setImageUrls([]);
        setDeliveryType('code');
        setDeliveryFile('');
        setDeliveryCodes('');
        setModalError('');
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setModalError('');
        const form = e.currentTarget;
        const values = Object.fromEntries(new FormData(form).entries());

        let result: { error: any | null } | undefined;

        switch (modalState.mode) {
            case 'addCategory':
                result = await addCategory({ name: values.name as string, image_url: imageUrls[0] || '' });
                break;
            case 'editCategory':
                result = await updateCategory({ id: (modalState.data as Category).id, name: values.name as string, image_url: imageUrls[0] || (modalState.data as Category).image_url });
                break;
            case 'addProduct':
            case 'editProduct': {
                let finalDeliveryContent: string | string[] = '';
                if(deliveryType !== 'code') {
                    finalDeliveryContent = deliveryFile;
                } else {
                    finalDeliveryContent = deliveryCodes.split('\n').filter(code => code.trim() !== '');
                }

                const rawPrice = (values.price as string).trim();
                const numberPart = parseFloat(rawPrice.replace(/[^0-9.]/g, ''));
                const formattedPrice = !isNaN(numberPart) ? `${numberPart.toFixed(2)}$` : rawPrice;


                const productData: Omit<Product, 'id'> = {
                    name: values.name as string,
                    price: formattedPrice,
                    image_urls: imageUrls,
                    description: values.description as string,
                    rating: parseFloat(values.rating as string),
                    delivery_type: deliveryType,
                    delivery_content: finalDeliveryContent,
                    created_at: (modalState.data as Product)?.created_at || new Date().toISOString(),
                };

                if (modalState.mode === 'addProduct') {
                     result = await addProduct(values.categoryId as string, productData);
                } else {
                    const originalProduct = modalState.data as Product;
                    const newCategoryId = values.categoryId as string;
                    result = await updateProduct(originalProduct.id, productData, newCategoryId);
                }
                break;
            }
        }

        if (result && result.error) {
            const err = result.error;
            console.error('Form submission error:', err);
            
            let finalMessage = "An unexpected error occurred.";

            if (typeof err === 'object' && err !== null) {
                // @ts-ignore
                if (typeof err.message === 'string') {
                     // @ts-ignore
                    const lowerCaseMessage = err.message.toLowerCase();
                    if (lowerCaseMessage.includes('violates row-level security policy')) {
                         finalMessage = `خطأ في الصلاحيات: العملية فشلت.\n\nالسبب هو أن صلاحيات الأمان (Row Level Security) في قاعدة بيانات Supabase تمنع هذا الإجراء.\n\n**الحل:**\nاذهب إلى لوحة التحكم الرئيسية (Dashboard) واتبع التعليمات في "دليل إعداد Supabase" لتطبيق الصلاحيات الصحيحة للجداول والتخزين.`;
                    } else if (lowerCaseMessage.includes("could not find the column")) {
                        finalMessage = `خطأ: حقل مطلوب غير موجود في قاعدة البيانات.\n\nالرسالة: "${err.message}"\n\n**الحل:**\nاذهب إلى لوحة التحكم الرئيسية (Dashboard) واتبع التعليمات في "دليل إعداد Supabase" لتصحيح هيكل الجداول. غالباً ما يكون حقل 'delivery_content' هو المفقود.`;
                    } else {
                         // @ts-ignore
                        let messageParts = [`Operation failed: ${err.message}`];
                         // @ts-ignore
                        if (typeof err.details === 'string' && err.details) {
                             // @ts-ignore
                            messageParts.push(`\n\nDetails: ${err.details}`);
                        }
                         // @ts-ignore
                        if (typeof err.hint === 'string' && err.hint) {
                             // @ts-ignore
                            messageParts.push(`\nHint: ${err.hint}`);
                        }
                        finalMessage = messageParts.join('');
                    }
                }
            } else if (typeof err === 'string') {
                finalMessage = `Operation failed: ${err}`;
            }

            setModalError(finalMessage);
        } else {
            closeModal();
        }
    };
    
    const uploadFileToStorage = async (file: File, bucket: 'product_images' | 'product_files'): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
        const filePath = fileName;

        const { error: uploadError } = await supabaseClient.storage.from(bucket).upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabaseClient.storage.from(bucket).getPublicUrl(filePath);
        
        if (!data || !data.publicUrl) {
            throw new Error("Could not get public URL for the uploaded file.");
        }
        return data.publicUrl;
    };
    
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, isMultiple: boolean) => {
        const files = e.target.files;
        if (!files) return;
        const filesArray = Array.from(files);
        const maxImages = isMultiple ? 10 : 1;
        if (imageUrls.length + filesArray.length > maxImages) {
            alert(`You can upload a maximum of ${maxImages} images.`);
            return;
        }
        setIsUploading(true);
        setModalError('');
        try {
            const uploadPromises = filesArray.map(file => uploadFileToStorage(file as File, 'product_images'));
            const newUrls = await Promise.all(uploadPromises);
            if (isMultiple) {
                setImageUrls(prev => [...prev, ...newUrls]);
            } else {
                setImageUrls(newUrls);
            }
        } catch (error: any) {
            console.error('Error uploading images:', error);
            let message = 'Image upload failed: An unexpected error occurred.';
            if (typeof error === 'object' && error !== null && typeof error.message === 'string') {
                const lowerCaseMessage = error.message.toLowerCase();
                if (lowerCaseMessage.includes('bucket not found')) {
                    message = `خطأ: المجلد 'product_images' غير موجود.\n\nالرجاء الذهاب إلى قسم التخزين (Storage) في مشروع Supabase والتأكد من وجود مجلد عام (public bucket) بهذا الاسم تماماً.`;
                } else if (lowerCaseMessage.includes('violates row-level security policy')) {
                    message = `خطأ في صلاحيات رفع الملفات.\n\nالسبب هو أن صلاحيات الأمان (Row Level Security) في Supabase Storage تمنع عملية الرفع.\n\n**الحل:**\nاذهب إلى لوحة التحكم الرئيسية (Dashboard) واتبع التعليمات في قسم "دليل إعداد Supabase" لتطبيق صلاحيات التخزين (Storage Policies).`;
                } else {
                    message = `Image upload failed: ${error.message}`;
                }
            } else if (typeof error === 'string') {
                message = `Image upload failed: ${error}`;
            }
            setModalError(message);
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleDeliveryFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);
        setModalError('');
        setDeliveryFile('');
        try {
            const publicUrl = await uploadFileToStorage(file, 'product_files');
            setDeliveryFile(publicUrl);
        } catch (error: any) {
            console.error('Error uploading file:', error);
            let message = 'Upload failed: An unexpected error occurred.';
            if (typeof error === 'object' && error !== null && typeof error.message === 'string') {
                const lowerCaseMessage = error.message.toLowerCase();
                if (lowerCaseMessage.includes('bucket not found')) {
                    message = `خطأ: المجلد 'product_files' غير موجود.\n\nالرجاء الذهاب إلى قسم التخزين (Storage) في مشروع Supabase والتأكد من وجود مجلد عام (public bucket) بهذا الاسم تماماً.`;
                } else if (lowerCaseMessage.includes('violates row-level security policy')) {
                    message = `خطأ في صلاحيات رفع الملفات.\n\nالسبب هو أن صلاحيات الأمان (Row Level Security) في Supabase Storage تمنع عملية الرفع.\n\n**الحل:**\nاذهب إلى لوحة التحكم الرئيسية (Dashboard) واتبع التعليمات في قسم "دليل إعداد Supabase" لتطبيق صلاحيات التخزين (Storage Policies).`;
                } else {
                     message = `Upload failed: ${error.message}`;
                }
            } else if (typeof error === 'string') {
                 message = `Upload failed: ${error}`;
            }
            setModalError(message);
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setImageUrls(prev => prev.filter((_, i) => i !== index));
    };

    const toggleCategory = (categoryId: string) => {
        setOpenCategories(prev => 
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleDeleteCategory = (category: Category) => {
        setConfirmState({
            isOpen: true,
            message: `${t('admin.products.confirm_delete')} "${t(category.name)}"?\n${t('admin.products.category_delete_warning')}`,
            onConfirm: async () => {
                const { error } = await deleteCategory(category.id);
                 if (error) {
                    alert(`Failed to delete category: ${error.message}`);
                }
                setConfirmState({ isOpen: false, message: '', onConfirm: () => {} });
            }
        });
    };

    const handleDeleteProduct = (product: Product) => {
        setConfirmState({
            isOpen: true,
            message: `${t('admin.products.confirm_delete')} "${t(product.name)}"?`,
            onConfirm: async () => {
                const { error } = await deleteProduct(product.id);
                if (error) {
                    alert(`Failed to delete product: ${error.message}`);
                }
                setConfirmState({ isOpen: false, message: '', onConfirm: () => {} });
            }
        });
    };
    
    const renderModal = () => {
        if (!modalState.isOpen) return null;
        
        const isProductMode = modalState.mode === 'addProduct' || modalState.mode === 'editProduct';
        const isEditMode = modalState.mode === 'editCategory' || modalState.mode === 'editProduct';

        let title = '';
        switch(modalState.mode) {
            case 'addCategory': title = t('admin.products.adding_category'); break;
            case 'editCategory': title = t('admin.products.editing_category'); break;
            case 'addProduct': title = "إضافة منتج جديد"; break;
            case 'editProduct': title = t('admin.products.editing_product'); break;
        }

        const defaultData = isEditMode ? modalState.data : {};

        const fileUploadConfig = {
            image: { accept: 'image/*', text: 'PNG, JPG, GIF', icon: <UploadIcon /> },
            pdf: { accept: 'application/pdf', text: 'PDF only', icon: <FileTextIcon /> },
            excel: { accept: '.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', text: 'Excel files (.xls, .xlsx)', icon: <FileTextIcon /> },
            word: { accept: '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document', text: 'Word files (.doc, .docx)', icon: <FileTextIcon /> },
            video: { accept: 'video/*', text: 'Video files (MP4, WEBM)', icon: <VideoIcon /> },
            audio: { accept: 'audio/*', text: 'Audio files (MP3, WAV)', icon: <MusicIcon /> },
        };
        
        const isFileDelivery = deliveryType && deliveryType !== 'code';
        const currentFileConfig = isFileDelivery ? fileUploadConfig[deliveryType as keyof typeof fileUploadConfig] : null;


        return (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={closeModal}>
                <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl p-6 border border-slate-700 text-right" onClick={e => e.stopPropagation()}>
                    <h2 className="text-2xl font-bold mb-6">{title}</h2>
                    {modalError && <div className="text-red-400 text-sm text-center whitespace-pre-line bg-red-500/10 p-3 rounded-md mb-4" dangerouslySetInnerHTML={{ __html: modalError.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong class="text-red-300">$1</strong>') }} />}
                    <form onSubmit={handleFormSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
                        <div>
                            <label className="block mb-1 font-semibold">{isProductMode ? t('admin.products.product_name') : t('admin.products.category_name')}</label>
                            <input name="name" type="text" defaultValue={(defaultData as any)?.name ? t((defaultData as any).name) : ''} className="w-full bg-slate-700 p-2 rounded border border-slate-600" required />
                        </div>

                        {isProductMode && (
                             <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1 font-semibold">{t('admin.products.price')}</label>
                                        <input name="price" type="text" defaultValue={(defaultData as Product)?.price || ''} className="w-full bg-slate-700 p-2 rounded border border-slate-600" required />
                                    </div>
                                    <div>
                                        <label className="block mb-1 font-semibold">{t('admin.products.rating')}</label>
                                        <input name="rating" type="number" step="0.1" min="0" max="5" defaultValue={(defaultData as Product)?.rating || 5} className="w-full bg-slate-700 p-2 rounded border border-slate-600" required />
                                    </div>
                                </div>
                                 <div>
                                    <label className="block mb-1 font-semibold">{t('product_detail.description')}</label>
                                    <textarea name="description" defaultValue={(defaultData as Product)?.description ? t((defaultData as Product).description) : ''} className="w-full bg-slate-700 p-2 rounded border border-slate-600 h-24" required />
                                </div>
                                <div>
                                    <label className="block mb-1 font-semibold">الفئة</label>
                                    <select name="categoryId"
                                        defaultValue={
                                            isEditMode
                                            ? (state.categories.find(c => c.products.some(p => p.id === (defaultData as Product)?.id)) )?.id
                                            : (modalState.data as Category)?.id || (state.categories[0]?.id || '')
                                        }
                                        className="w-full bg-slate-700 p-2 rounded border border-slate-600"
                                        required
                                    >
                                        {state.categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{t(cat.name)}</option>
                                        ))}
                                    </select>
                                </div>
                             </>
                        )}
                        
                        {isProductMode && (
                           <div className="border-t border-slate-700 pt-4 mt-4">
                                <h3 className="text-lg font-bold mb-4">{t('admin.products.delivery_details')}</h3>
                                <div>
                                    <label className="block mb-1 font-semibold">{t('admin.products.delivery_type_label')}</label>
                                    <select value={deliveryType} onChange={(e) => setDeliveryType(e.target.value as Product['delivery_type'])} className="w-full bg-slate-700 p-2 rounded border border-slate-600">
                                        <option value="code">{t('admin.products.delivery_type_code')}</option>
                                        <option value="image">{t('admin.products.delivery_type_image')}</option>
                                        <option value="pdf">{t('admin.products.delivery_type_pdf')}</option>
                                        <option value="excel">{t('admin.products.delivery_type_excel')}</option>
                                        <option value="word">{t('admin.products.delivery_type_word')}</option>
                                        <option value="video">{t('admin.products.delivery_type_video')}</option>
                                        <option value="audio">{t('admin.products.delivery_type_audio')}</option>
                                    </select>
                                </div>
                                <div className="mt-4">
                                    <label className="block mb-1 font-semibold">{t('admin.products.delivery_content_label')}</label>
                                    {deliveryType === 'code' ? (
                                        <textarea 
                                            value={deliveryCodes}
                                            onChange={(e) => setDeliveryCodes(e.target.value)}
                                            placeholder={t('admin.products.codes_placeholder')}
                                            className="w-full bg-slate-700 p-2 rounded border border-slate-600 h-32"
                                        />
                                    ) : currentFileConfig && (
                                        <div className="mt-2 rounded-lg border border-dashed border-slate-600 p-6">
                                            {!deliveryFile && !isUploading && (
                                                <div className="text-center">
                                                    {currentFileConfig.icon}
                                                    <div className="mt-4 flex text-sm justify-center leading-6 text-gray-400">
                                                        <label htmlFor="deliveryFileUpload" className="relative cursor-pointer rounded-md font-semibold text-amber-400 focus-within:outline-none hover:text-amber-500">
                                                            <span>{t('admin.products.upload_file')}</span>
                                                            <input id="deliveryFileUpload" name="deliveryFileUpload" type="file" className="sr-only" accept={currentFileConfig.accept} onChange={handleDeliveryFileChange} />
                                                        </label>
                                                    </div>
                                                    <p className="text-xs leading-5 text-gray-400">{currentFileConfig.text}</p>
                                                </div>
                                            )}
                                            {isUploading && <div className="text-center py-4">جاري الرفع...</div>}
                                            {deliveryFile && !isUploading && (
                                                <div className="text-center">
                                                    <p className="text-green-400 text-sm mb-2">تم رفع الملف بنجاح!</p>
                                                    {deliveryType === 'image' && <img src={deliveryFile} alt="Preview" className="h-24 mx-auto rounded" />}
                                                    {deliveryType === 'video' && <video src={deliveryFile} controls className="h-24 mx-auto rounded" />}
                                                    {deliveryType === 'audio' && <audio src={deliveryFile} controls className="w-full max-w-xs mx-auto" />}
                                                    {['pdf', 'excel', 'word'].includes(deliveryType!) && (
                                                        <a href={deliveryFile} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline inline-flex items-center gap-2">
                                                            <FileTextIcon /> <span>عرض الملف الذي تم رفعه</span>
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                           </div>
                        )}

                        <div>
                            <label className="block mb-1 font-semibold">{isProductMode ? t('admin.products.images') : t('admin.products.image_url')}</label>
                             <div className="mt-2 flex justify-center rounded-lg border border-dashed border-slate-600 px-6 py-10">
                               <div className="text-center">
                                    <UploadIcon />
                                    <div className="mt-4 flex text-sm justify-center leading-6 text-gray-400">
                                        <label htmlFor="imageUpload" className="relative cursor-pointer rounded-md font-semibold text-amber-400 focus-within:outline-none hover:text-amber-500">
                                            <span>تحميل صورة</span>
                                            <input id="imageUpload" name="imageUpload" type="file" className="sr-only" accept="image/*" multiple={isProductMode} onChange={(e) => handleImageChange(e, isProductMode)} />
                                        </label>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-400">{isProductMode ? t('admin.products.max_images') : 'PNG, JPG, GIF'}</p>
                                    {isUploading && <p className="text-xs mt-2">جاري الرفع...</p>}
                               </div>
                            </div>
                            {imageUrls.length > 0 && (
                                <div className="grid grid-cols-5 gap-2 mt-4">
                                    {imageUrls.map((url, index) => (
                                        <div key={index} className="relative">
                                            <img src={url} alt={`Preview ${index}`} className="w-full h-20 object-cover rounded"/>
                                            <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 leading-none w-5 h-5 flex items-center justify-center"><CloseIcon /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-start gap-4 pt-4">
                             <button type="submit" disabled={isUploading} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-6 rounded-full text-sm disabled:bg-slate-600 disabled:cursor-not-allowed">{t('admin.products.save')}</button>
                            <button type="button" onClick={closeModal} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-full text-sm">{t('admin.products.cancel')}</button>
                        </div>
                    </form>
                </div>
            </div>
        )
    };

    const renderConfirmModal = () => {
        if (!confirmState.isOpen) return null;
        return (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setConfirmState({ ...confirmState, isOpen: false })}>
                <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-sm p-6 border border-slate-700 text-center" onClick={e => e.stopPropagation()}>
                    <WarningIcon />
                    <h2 className="text-lg font-bold text-white mb-2 whitespace-pre-line">{confirmState.message}</h2>
                    <div className="flex justify-center gap-4 mt-6">
                        <button onClick={confirmState.onConfirm} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-8 rounded-full text-sm">
                            {t('admin.products.confirm')}
                        </button>
                        <button onClick={() => setConfirmState({ ...confirmState, isOpen: false })} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-8 rounded-full text-sm">
                            {t('admin.products.cancel')}
                        </button>
                    </div>
                </div>
            </div>
        );
    };
    
    return (
        <div className="text-right">
            {renderModal()}
            {renderConfirmModal()}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{t('admin.products.title')}</h1>
                <div className="flex gap-4">
                    <button onClick={() => openModal('addProduct', { categoryId: state.categories[0]?.id })} className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-full text-sm">إضافة منتج</button>
                    <button onClick={() => openModal('addCategory')} className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-4 rounded-full text-sm">{t('admin.products.add_category')}</button>
                </div>
            </div>

            <div className="space-y-4">
                {state.categories.map(category => (
                    <div key={category.id} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                        <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-700" onClick={() => toggleCategory(category.id)}>
                             <div className="flex items-center gap-4">
                                <span className={`transform ${openCategories.includes(category.id) ? 'rotate-180' : ''}`}>
                                    <ChevronDownIcon />
                                </span>
                                <div className="flex items-center gap-2">
                                    <button onClick={(e) => { e.stopPropagation(); openModal('editCategory', category)}} className="text-gray-400 hover:text-amber-400 p-1"><EditIcon /></button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(category) }} className="text-gray-400 hover:text-red-500 p-1"><DeleteIcon/></button>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-lg">{t(category.name)}</span>
                                <img src={category.image_url} alt={t(category.name)} className="w-12 h-12 object-cover rounded-md"/>
                            </div>
                        </div>

                        {openCategories.includes(category.id) && (
                            <div className="bg-slate-800 p-4 border-t border-slate-700">
                                {category.products.length > 0 ? (
                                    <table className="min-w-full text-right">
                                        <tbody>
                                            {category.products.map(product => (
                                                <tr key={product.id} className="border-b border-slate-700/50 last:border-b-0">
                                                    <td className="py-3 px-2">
                                                        <div className="flex gap-2">
                                                            <button onClick={() => openModal('editProduct', product)} className="text-gray-400 hover:text-amber-400 p-1"><EditIcon /></button>
                                                            <button onClick={() => handleDeleteProduct(product)} className="text-gray-400 hover:text-red-500 p-1"><DeleteIcon/></button>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-2 text-gray-300">{product.price}</td>
                                                    <td className="py-3 px-2 font-semibold">{t(product.name)}</td>
                                                    <td className="py-3 px-2">
                                                        <img src={product.image_urls[0]} alt={t(product.name)} className="w-10 h-10 object-cover rounded"/>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-center text-gray-500 py-4">{t('admin.products.no_products')}</p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminProducts;