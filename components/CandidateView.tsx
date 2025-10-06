import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TestType } from '../types';
import BehavioralTest from './BehavioralTest';
import { PuzzlePieceIcon, SparklesIcon, ClipboardDocumentListIcon } from './icons';


const CandidateView: React.FC = () => {
    const { t } = useTranslation();
    const [activeTest, setActiveTest] = useState<TestType | null>(null);

    return (
        <div>
            {activeTest && <BehavioralTest testType={activeTest} onClose={() => setActiveTest(null)} />}
            <section className="max-w-5xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-800">{t('app.behavioralAssessmentsTitle')}</h2>
                    <p className="mt-2 text-lg text-slate-600">{t('app.candidateDescription')}</p>
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
        </div>
    );
};

export default CandidateView;