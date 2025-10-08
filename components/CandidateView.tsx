import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TestType } from '../types';
import BehavioralTest from './BehavioralTest';
import { 
    PuzzlePieceIcon, 
    SparklesIcon, 
    ClipboardDocumentListIcon,
    UserCircleIcon,
    EnvelopeIcon,
    PhoneIcon,
    IdentificationIcon,
    PencilIcon
} from './icons';

interface CandidateProfile {
    name: string;
    email: string;
    phone?: string;
    desiredRole: string;
}

const CandidateView: React.FC = () => {
    const { t } = useTranslation();
    const [activeTest, setActiveTest] = useState<TestType | null>(null);
    const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);
    const [formData, setFormData] = useState<CandidateProfile>({
        name: '',
        email: '',
        phone: '',
        desiredRole: '',
    });

    useEffect(() => {
        try {
            const savedProfile = localStorage.getItem('candidateProfile');
            if (savedProfile) {
                setCandidateProfile(JSON.parse(savedProfile));
            }
        } catch (error) {
            console.error("Failed to parse candidate profile from localStorage", error);
            localStorage.removeItem('candidateProfile');
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.name && formData.email && formData.desiredRole) {
            const newProfile = { ...formData };
            localStorage.setItem('candidateProfile', JSON.stringify(newProfile));
            setCandidateProfile(newProfile);
        }
    };
    
    const handleEdit = () => {
        if (candidateProfile) {
            setFormData(candidateProfile);
        }
        setCandidateProfile(null);
    };

    const renderProfileForm = () => (
        <section className="max-w-2xl mx-auto">
             <div className="p-8 bg-white border border-slate-200 rounded-xl shadow-lg">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">{t('candidateView.welcomeTitle')}</h2>
                    <p className="mt-2 text-slate-600">{t('candidateView.welcomeSubtitle')}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700">{t('candidateView.form.name')}</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <UserCircleIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-slate-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white text-slate-800"
                                placeholder={t('candidateView.form.namePlaceholder')}
                                required
                            />
                        </div>
                    </div>
                     {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">{t('candidateView.form.email')}</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-slate-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white text-slate-800"
                                placeholder={t('candidateView.form.emailPlaceholder')}
                                required
                            />
                        </div>
                    </div>
                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700">{t('candidateView.form.phone')}</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <PhoneIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-slate-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white text-slate-800"
                                placeholder={t('candidateView.form.phonePlaceholder')}
                            />
                        </div>
                    </div>
                    {/* Desired Role */}
                    <div>
                        <label htmlFor="desiredRole" className="block text-sm font-medium text-slate-700">{t('candidateView.form.role')}</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <IdentificationIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="text"
                                name="desiredRole"
                                id="desiredRole"
                                value={formData.desiredRole}
                                onChange={handleInputChange}
                                className="block w-full rounded-md border-slate-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white text-slate-800"
                                placeholder={t('candidateView.form.rolePlaceholder')}
                                required
                            />
                        </div>
                    </div>
                    
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {t('candidateView.form.submitButton')}
                    </button>
                </form>
            </div>
        </section>
    );

    const renderAssessments = () => (
        <section className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
                 <div className="flex justify-center items-center gap-4">
                    <h2 className="text-3xl font-bold text-slate-800">
                        {t('candidateView.form.welcomeBack', { name: candidateProfile?.name })}
                    </h2>
                    <button 
                        onClick={handleEdit}
                        className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                        aria-label={t('candidateView.form.editInfo')}
                    >
                        <PencilIcon className="w-4 h-4 mr-1"/>
                        {t('candidateView.form.editInfo')}
                    </button>
                 </div>
                 <p className="mt-2 text-lg text-slate-600">{t('candidateView.form.assessmentsReady')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Big Five Test Card */}
                <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <div className="flex items-center mb-3">
                        <PuzzlePieceIcon className="w-8 h-8 mr-3 text-emerald-500" />
                        <h3 className="text-xl font-semibold text-slate-800">{t('tests.big_five.title')}</h3>
                    </div>
                    <p className="mb-4 text-sm text-slate-600 flex-grow">{t('tests.big_five.description')}</p>
                    <button
                        onClick={() => setActiveTest('big-five')}
                        className="w-full px-6 py-2 mt-auto font-semibold text-white transition-colors bg-emerald-500 rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                        {t('tests.startButton')}
                    </button>
                </div>
                {/* DISC Test Card */}
                <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <div className="flex items-center mb-3">
                        <SparklesIcon className="w-8 h-8 mr-3 text-blue-500" />
                        <h3 className="text-xl font-semibold text-slate-800">{t('tests.disc.title')}</h3>
                    </div>
                    <p className="mb-4 text-sm text-slate-600 flex-grow">{t('tests.disc.description')}</p>
                    <button
                        onClick={() => setActiveTest('disc')}
                        className="w-full px-6 py-2 mt-auto font-semibold text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        {t('tests.startButton')}
                    </button>
                </div>
                {/* SJT Test Card */}
                <div className="p-6 bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <div className="flex items-center mb-3">
                        <ClipboardDocumentListIcon className="w-8 h-8 mr-3 text-amber-500" />
                        <h3 className="text-xl font-semibold text-slate-800">{t('tests.sjt.title')}</h3>
                    </div>
                    <p className="mb-4 text-sm text-slate-600 flex-grow">{t('tests.sjt.description')}</p>
                    <button
                        onClick={() => setActiveTest('sjt')}
                        className="w-full px-6 py-2 mt-auto font-semibold text-white transition-colors bg-amber-500 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                    >
                        {t('tests.startButton')}
                    </button>
                </div>
            </div>
        </section>
    );

    return (
        <div>
            {activeTest && <BehavioralTest testType={activeTest} onClose={() => setActiveTest(null)} />}
            {!candidateProfile ? renderProfileForm() : renderAssessments()}
        </div>
    );
};

export default CandidateView;