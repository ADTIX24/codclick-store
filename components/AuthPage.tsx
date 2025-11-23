
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext.tsx';
import { useAppContext } from '../state/AppContext.tsx';

const EyeIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 1.274-4.057 5.064-7 9.542-7 .847 0 1.673.12 2.468.352M7.11 7.11a5.98 5.98 0 018.38 8.38M12 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
  </svg>
);


const AuthPage: React.FC = () => {
    const { t } = useLanguage();
    const { navigateTo, login, signup, state } = useAppContext();
    const { auth_mode, current_user } = state;

    const [isLogin, setIsLogin] = useState(auth_mode === 'login');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    useEffect(() => {
        setIsLogin(auth_mode === 'login');
    }, [auth_mode]);

    useEffect(() => {
        if (current_user) {
            // If user is logged in, navigate away from auth page
            const userRole = current_user.role;
            navigateTo(userRole === 'owner' || userRole === 'moderator' ? 'admin' : 'home');
        }
    }, [current_user, navigateTo]);


    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            if (isLogin) {
                if (!email || !password) {
                    setError(t('auth.fields_required'));
                    return;
                }
                const { error: loginError } = await login(email, password);
                if (loginError) {
                    setError(loginError.message || t('auth.invalid_credentials'));
                }
                // Navigation is now handled by the useEffect hook watching current_user
            } else {
                // Signup implementation
                if (!fullName || !email || !password || !confirmPassword) {
                    setError(t('auth.fields_required'));
                    return;
                }
                if (password !== confirmPassword) {
                    setError(t('auth.passwords_do_not_match'));
                    return;
                }
                
                const { error: signupError } = await signup({ full_name: fullName, email, password, whatsapp });

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
        } finally {
            setLoading(false);
        }
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
                    <div className="rounded-md shadow-sm space-y-4">
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
                         <div className="mb-4 relative">
                            <label htmlFor="password" className="sr-only">{t('auth.passwordLabel')}</label>
                            <input 
                                id="password" 
                                name="password" 
                                type={passwordVisible ? 'text' : 'password'}
                                autoComplete="current-password"
                                required 
                                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-slate-600 bg-slate-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm text-left pr-10" 
                                placeholder={t('auth.passwordPlaceholder')}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                dir="ltr"
                             />
                             <button
                                type="button"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center z-20 text-gray-400 hover:text-gray-300"
                             >
                                {passwordVisible ? <EyeOffIcon /> : <EyeIcon />}
                             </button>
                        </div>
                        {!isLogin && (
                            <div className="mb-4 relative">
                                <label htmlFor="confirm-password" className="sr-only">{t('auth.confirmPasswordLabel')}</label>
                                <input 
                                    id="confirm-password" 
                                    name="confirm-password" 
                                    type={confirmPasswordVisible ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    required 
                                    className="appearance-none rounded-md relative block w-full px-3 py-3 border border-slate-600 bg-slate-700/50 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-amber-500 focus:border-amber-500 focus:z-10 sm:text-sm text-left pr-10" 
                                    placeholder={t('auth.confirmPasswordLabel')}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    dir="ltr"
                                />
                                 <button
                                    type="button"
                                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center z-20 text-gray-400 hover:text-gray-300"
                                >
                                    {confirmPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                        )}
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-slate-900 bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            {isLogin ? t('auth.loginButton') : t('auth.signupButton')}
                        </button>
                    </div>
                </form>
                
                <div className="text-center mt-4">
                    <p className="text-sm text-gray-400">
                        {isLogin ? t('auth.switchToSignupPrompt') : t('auth.switchToLoginPrompt')}{' '}
                        <button onClick={(e) => { e.preventDefault(); setIsLogin(!isLogin); setError(''); setSuccessMessage(''); }} className="font-medium text-amber-500 hover:text-amber-400">
                            {isLogin ? t('auth.switchToSignupLink') : t('auth.switchToLoginLink')}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
