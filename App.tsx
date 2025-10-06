import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RecruiterView from './components/RecruiterView';
import CandidateView from './components/CandidateView';
import { CpuChipIcon, BriefcaseIcon, UsersIcon } from './components/icons';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const baseClasses = "px-3 py-1 text-sm font-semibold rounded-md transition-colors";
  const activeClasses = "bg-indigo-600 text-white shadow-sm";
  const inactiveClasses = "bg-slate-200 text-slate-700 hover:bg-slate-300";

  return (
    <div className="flex space-x-2 p-1 bg-slate-100 rounded-lg">
      <button
        onClick={() => changeLanguage('en')}
        className={`${baseClasses} ${currentLang.startsWith('en') ? activeClasses : inactiveClasses}`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('pt')}
        className={`${baseClasses} ${currentLang.startsWith('pt') ? activeClasses : inactiveClasses}`}
      >
        PT
      </button>
    </div>
  );
};

const App: React.FC = () => {
    const { t } = useTranslation();
    const [view, setView] = useState<'recruiter' | 'candidate'>('recruiter');

    const ViewSwitcher: React.FC = () => {
        const baseButtonClass = "flex-1 px-4 py-3 text-sm font-bold text-center rounded-lg transition-all duration-300 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
        const activeButtonClass = "bg-white text-indigo-700 shadow-lg scale-105";
        const inactiveButtonClass = "bg-transparent text-indigo-100 hover:bg-white/20";
        
        return (
            <div className="flex p-1 space-x-1 bg-indigo-700/50 rounded-xl max-w-sm mx-auto">
                <button 
                    onClick={() => setView('recruiter')} 
                    className={`${baseButtonClass} ${view === 'recruiter' ? activeButtonClass : inactiveButtonClass}`}
                >
                    <div className="flex items-center justify-center">
                        <BriefcaseIcon className="w-5 h-5 mr-2" />
                        <span>{t('app.recruiterArea')}</span>
                    </div>
                </button>
                <button 
                    onClick={() => setView('candidate')}
                    className={`${baseButtonClass} ${view === 'candidate' ? activeButtonClass : inactiveButtonClass}`}
                >
                    <div className="flex items-center justify-center">
                        <UsersIcon className="w-5 h-5 mr-2" />
                        <span>{t('app.candidateArea')}</span>
                    </div>
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800">
            <header className="relative py-6 bg-indigo-600 text-white shadow-md">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <h1 className="flex items-center justify-center text-3xl md:text-4xl font-extrabold">
                        <CpuChipIcon className="w-10 h-10 mr-3" />
                        {t('app.title')}
                    </h1>
                    <div className="hidden md:block">
                        <ViewSwitcher />
                    </div>
                    <LanguageSwitcher />
                </div>
                <div className="md:hidden container mx-auto px-4 mt-4">
                    <ViewSwitcher />
                </div>
            </header>
            
            <main className="container px-4 py-8 mx-auto">
                {view === 'recruiter' ? <RecruiterView /> : <CandidateView />}
            </main>
        </div>
    );
};

export default App;