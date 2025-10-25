import React, { useState, useEffect } from 'react';
// FIX: Added .tsx extension to module import.
import { useLanguage } from '../i18n/LanguageContext.tsx';
// FIX: Added .tsx extension to module import.
import { useAppContext } from '../state/AppContext.tsx';
import { supabaseClient } from '../supabase/client.ts';

const AuthPage: React.FC = () => {
    const { t } = useLanguage();
    const { navigateTo, login, signup, state } = useAppContext();
    const { authMode } = state;

    const [isLogin, setIsLogin] = useState(authMode === 'login');

    useEffect(() => {
        setIsLogin(authMode === 'login');
    }, [authMode]);


    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const toggleAuthMode = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsLogin(!isLogin);
        setError('');
        setSuccessMessage('');
        setFullName('');
        setEmail('');
        setWhatsapp('');
        setPassword('');
        setConfirmPassword('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        if (isLogin) {
            if (!email || !password) {
                setError(t('auth.fields_required'));
                setLoading(false);
                return;
            }
            const { error: loginError } = await login(email, password);
            if (loginError) {
                setError(loginError.message || t('auth.invalid_credentials'));
            } else {
                // onAuthStateChange will set the user state. We just need to navigate.
                // We need to fetch the user to get metadata for role-based navigation.
                const { data: { user } } = await supabaseClient.auth.getUser();
                const userRole = user?.user_metadata?.role || 'customer';
                navigateTo(userRole === 'owner' ? 'admin' : 'home');
            }
        } else {
            // Signup implementation
            if (!fullName || !email || !password || !confirmPassword) {
                setError(t('auth.fields_required'));
                setLoading(false);
                return;
            }
            if (password !== confirmPassword) {
                setError(t('auth.passwords_do_not_match'));
                setLoading(false);
                return;
            }
            
            const { error: signupError } = await signup({ fullName, email, password, whatsapp });

            if (signupError) {
                 setError(signupError.message || t('auth.email_exists'));
            } else {
                setSuccessMessage(t('auth.signup_success'));
                setFullName('');
                setEmail('');
                setWhatsapp('');
                setPassword('');
                setConfirmPassword('');
                setIsLogin(true);
            }
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-transparent flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-slate-800 p-10 rounded-2xl shadow-2xl border border-slate-700">
                <div>
                    {successMessage && <p className="text-sm text-center text-green-400 mb-4">{successMessage}</p>}
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                        {isLogin ? t('auth.loginTitle') : t('auth.signupTitle')}
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                    <div className="rounded-md shadow-sm">
                        {!isLogin && (
                             <div className="mb-4">
                                <label htmlFor="full-name" className="sr-only">{t('auth.fullNameLabel')}</label>
                                <input 
                                    id="full-name" 
                                    name="name" 
                                    type="text" 
                                    required 
                                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-slate-600 bg-slate-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm" 
                                    placeholder={t('auth.fullNamePlaceholder')}
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                 />
                            </div>
                        )}
                        <div className="mb-4">
                            <label htmlFor="email-address" className="sr-only">{t('auth.emailLabel')}</label>
                            <input 
                                id="email-address" 
                                name="email" 
                                type="email" 
                                autoComplete="email" 
                                required 
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-slate-600 bg-slate-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm text-left" 
                                placeholder={t('auth.emailPlaceholder')}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                dir="ltr"
                             />
                        </div>
                         {!isLogin && (
                             <div className="mb-4">
                                <label htmlFor="whatsapp" className="sr-only">{t('auth.whatsappLabel')}</label>
                                <input 
                                    id="whatsapp" 
                                    name="whatsapp" 
                                    type="tel" 
                                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-slate-600 bg-slate-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm text-left" 
                                    placeholder={t('auth.whatsappPlaceholder')}
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                    dir="ltr"
                                 />
                            </div>
                        )}
                         <div className="mb-4">
                            <label htmlFor="password" className="sr-only">{t('auth.passwordLabel')}</label>
                            <input 
                                id="password" 
                                name="password" 
                                type="password" 
                                autoComplete={isLogin ? "current-password" : "new-password"}
                                required 
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-slate-600 bg-slate-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm text-left" 
                                placeholder={t('auth.passwordPlaceholder')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                dir="ltr"
                            />
                        </div>
                         {!isLogin && (
                             <div className="mb-4">
                                <label htmlFor="confirm-password" className="sr-only">{t('auth.confirmPasswordLabel')}</label>
                                <input 
                                    id="confirm-password" 
                                    name="confirm-password" 
                                    type="password" 
                                    autoComplete="new-password"
                                    required 
                                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-slate-600 bg-slate-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm text-left" 
                                    placeholder={t('auth.passwordPlaceholder')} 
                                    dir="ltr"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                    
                    {error && <p className="text-sm text-center text-red-400">{error}</p>}

                    <div>
                        <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-slate-900 bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-amber-500 disabled:bg-slate-600 disabled:cursor-not-allowed">
                           {loading ? '...' : (isLogin ? t('auth.loginButton') : t('auth.signupButton'))}
                        </button>
                    </div>
                </form>
                <div className="text-sm text-center">
                    <span className="text-gray-400">
                         {isLogin ? t('auth.switchToSignupPrompt') : t('auth.switchToLoginPrompt')}{' '}
                    </span>
                    <a href="#" onClick={toggleAuthMode} className="font-medium text-amber-400 hover:text-amber-500">
                        {isLogin ? t('auth.switchToSignupLink') : t('auth.switchToLoginLink')}
                    </a>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;