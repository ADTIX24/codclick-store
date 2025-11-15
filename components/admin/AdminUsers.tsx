import React, { useState, useEffect } from 'react';
// FIX: Added .tsx extension to module import.
import { useLanguage } from '../../i18n/LanguageContext.tsx';
// FIX: Added .tsx extension to module import.
import { useAppContext } from '../../state/AppContext.tsx';
// FIX: Added .ts extension to module import.
import type { User, UserRole } from '../../types.ts';
import { supabaseClient } from '../../supabase/client.ts';

const AdminUsers: React.FC = () => {
    const { t } = useLanguage();
    const { updateUserRole } = useAppContext();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({ fullName: '', email: '', role: 'customer' as UserRole });
    
    const fetchUsers = async () => {
        setIsLoading(true);
        const { data, error } = await supabaseClient.from('user_profiles').select('*');
        if (error) {
            console.error("Error fetching users:", error);
            alert(`Could not fetch users. RLS policies might be missing.\n\nError: ${error.message}`);
        } else {
            setUsers(data as User[] || []);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setFormData({ fullName: user.full_name, email: user.email, role: user.role });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedUser) {
            const { error } = await updateUserRole(selectedUser.id, formData.role, formData.fullName);
            if (error) {
                alert(`Failed to update user: ${error.message}`);
            } else {
                fetchUsers(); // Refresh users list
                closeModal();
            }
        }
    };

    const roleStyles: Record<UserRole, string> = {
        owner: 'bg-green-500/20 text-green-300',
        moderator: 'bg-yellow-500/20 text-yellow-300',
        customer: 'bg-sky-500/20 text-sky-300',
        vip: 'bg-purple-500/20 text-purple-300',
    };
    
    const renderModal = () => {
        if (!isModalOpen || !selectedUser) return null;

        return (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center" onClick={closeModal}>
                <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg p-6 border border-slate-700 text-right" onClick={e => e.stopPropagation()}>
                    <h2 className="text-2xl font-bold mb-6">{t('admin.users.edit_user')}</h2>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div>
                            <label className="block mb-1 font-semibold">{t('admin.users.name')}</label>
                            <input
                                type="text"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                className="w-full bg-slate-700 p-2 rounded border border-slate-600"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">{t('admin.users.email')}</label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="w-full bg-slate-900/50 p-2 rounded border border-slate-600 text-gray-400 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">{t('admin.users.role')}</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                                className="w-full bg-slate-700 p-2 rounded border border-slate-600"
                            >
                                <option value="customer">{t('admin.users.customer')}</option>
                                <option value="vip">{t('admin.users.vip')}</option>
                                <option value="moderator">{t('admin.users.moderator')}</option>
                                <option value="owner">{t('admin.users.owner')}</option>
                            </select>
                        </div>
                        <div className="flex justify-start gap-4 pt-4">
                            <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2 px-6 rounded-full text-sm">{t('admin.products.save')}</button>
                            <button type="button" onClick={closeModal} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-6 rounded-full text-sm">{t('admin.products.cancel')}</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return <div className="text-center p-10">Loading users...</div>;
    }

    return (
        <div className="bg-slate-800 p-6 rounded-lg">
            {renderModal()}
            <h1 className="text-3xl font-bold mb-8 text-right">{t('admin.users.title')}</h1>
            
            <div className="overflow-x-auto">
                <table className="min-w-full bg-slate-700 rounded-lg text-right">
                    <thead>
                        <tr className="border-b border-slate-600">
                            <th className="p-4">{t('admin.users.actions')}</th>
                            <th className="p-4">{t('admin.users.role')}</th>
                            <th className="p-4">{t('admin.users.email')}</th>
                            <th className="p-4">{t('admin.users.name')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} className="border-b border-slate-700/50 hover:bg-slate-600/50">
                                <td className="p-4">
                                    <button onClick={() => openEditModal(user)} className="text-amber-400 hover:text-amber-300 text-sm font-semibold">{t('admin.products.edit')}</button>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${roleStyles[user.role] || 'bg-gray-500/20 text-gray-300'}`}>
                                        {t(`admin.users.${user.role}`)}
                                    </span>
                                </td>
                                 <td className="p-4 text-gray-300">{user.email}</td>
                                <td className="p-4 text-white font-medium">{user.full_name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;