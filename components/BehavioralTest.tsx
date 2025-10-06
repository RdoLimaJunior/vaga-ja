import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TestType, DiscQuestion, SjtScenario } from '../types';
import Loader from './Loader';
import PersonalityTest from './PersonalityTest';
import { XMarkIcon, SparklesIcon, PuzzlePieceIcon, ClipboardDocumentListIcon } from './icons';

// --- DISC Results Component ---
const DiscResults: React.FC<{ results: { [key: string]: number }, onReset: () => void }> = ({ results, onReset }) => {
    const { t } = useTranslation();
    const profiles = ['D', 'I', 'S', 'C'];
    const scores = profiles.map(p => results[p] || 0);
    const maxScore = Math.max(...scores.map(s => Math.abs(s)), 1);


    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold text-center text-slate-800">{t('disc_test.resultsTitle')}</h2>
            <div className="space-y-4">
                {profiles.map(profile => (
                    <div key={profile}>
                        <div className="flex justify-between mb-1">
                            <span className="text-lg font-bold text-slate-700">{t(`disc_test.${profile}` as any)}</span>
                            <span className="text-lg font-semibold text-slate-600">{results[profile] || 0}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-4">
                            <div
                                className="h-4 bg-blue-500 rounded-full"
                                style={{ width: `${(Math.abs(results[profile] || 0) / maxScore) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 text-center">
                <button onClick={onReset} className="w-full max-w-xs px-6 py-3 font-semibold text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700">
                    {t('test_shared.resetButton')}
                </button>
            </div>
        </div>
    );
};


// --- DISC Test Component ---
const DiscTest: React.FC<{ testData: { teste: DiscQuestion[] } }> = ({ testData }) => {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: string]: { most?: string, least?: string } }>({});
    const [results, setResults] = useState<{ [key: string]: number } | null>(null);

    const questions = testData.teste;
    const currentQuestion = questions[currentIndex];

    const handleSelect = (type: 'most' | 'least', profile: string) => {
        setAnswers(prev => {
            const currentAnswers = { ...prev[currentQuestion.id] };
            
            if (currentAnswers[type] === profile) {
                delete currentAnswers[type];
            } else {
                currentAnswers[type] = profile;
                if (type === 'most' && currentAnswers.least === profile) delete currentAnswers.least;
                if (type === 'least' && currentAnswers.most === profile) delete currentAnswers.most;
            }
            return { ...prev, [currentQuestion.id]: currentAnswers };
        });
    };
    
    const handleNext = () => currentIndex < questions.length - 1 && setCurrentIndex(i => i + 1);
    const handlePrevious = () => currentIndex > 0 && setCurrentIndex(i => i - 1);

    const handleFinish = () => {
        const scores: { [key: string]: number } = { D: 0, I: 0, S: 0, C: 0 };
        Object.values(answers).forEach(answer => {
            if (answer.most) scores[answer.most as keyof typeof scores]++;
            if (answer.least) scores[answer.least as keyof typeof scores]--;
        });
        setResults(scores);
    };

    const handleReset = () => {
        setAnswers({});
        setCurrentIndex(0);
        setResults(null);
    };
    
    if (results) return <DiscResults results={results} onReset={handleReset} />;

    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div>
            {/* Visual Progress Indicator */}
            <div className="mb-6">
                <div className="flex justify-between mb-2 font-semibold">
                    <span className="text-slate-700">{t('test_shared.question')} {currentIndex + 1} {t('test_shared.of')} {questions.length}</span>
                    <span className="text-slate-500">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-4">
                    <div 
                        className="bg-indigo-600 h-4 rounded-full transition-all duration-500 ease-out" 
                        style={{ width: `${progress}%` }}>
                    </div>
                </div>
            </div>
            
            <p className="mb-4 text-center text-slate-600">{t('disc_test.instruction')}</p>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="font-bold text-slate-700">{/* Empty header */}</div>
                    <div className="font-bold text-emerald-600">{t('disc_test.most')}</div>
                    <div className="font-bold text-red-600">{t('disc_test.least')}</div>

                    {Object.entries(currentQuestion.opcoes).map(([profile, word]) => (
                        <React.Fragment key={profile}>
                            <div className="flex items-center justify-start p-2 font-medium text-slate-800">{word}</div>
                            <div className="flex items-center justify-center">
                                <input
                                    type="radio"
                                    name={`most-${currentQuestion.id}`}
                                    checked={answers[currentQuestion.id]?.most === profile}
                                    onChange={() => handleSelect('most', profile)}
                                    className="w-5 h-5 text-emerald-600 border-slate-300 focus:ring-emerald-500"
                                />
                            </div>
                            <div className="flex items-center justify-center">
                                <input
                                    type="radio"
                                    name={`least-${currentQuestion.id}`}
                                    checked={answers[currentQuestion.id]?.least === profile}
                                    onChange={() => handleSelect('least', profile)}
                                    className="w-5 h-5 text-red-600 border-slate-300 focus:ring-red-500"
                                />
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
            <div className="flex justify-between mt-8">
                <button onClick={handlePrevious} disabled={currentIndex === 0} className="px-6 py-2 font-semibold text-slate-700 transition-colors bg-slate-200 rounded-lg hover:bg-slate-300 disabled:opacity-50">
                    {t('test_shared.previous')}
                </button>
                {currentIndex < questions.length - 1 ? (
                    <button onClick={handleNext} className="px-6 py-2 font-semibold text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700">
                        {t('test_shared.next')}
                    </button>
                ) : (
                    <button onClick={handleFinish} className="px-6 py-2 font-semibold text-white transition-colors bg-emerald-600 rounded-lg hover:bg-emerald-700">
                        {t('test_shared.finish')}
                    </button>
                )}
            </div>
        </div>
    );
};

// --- SJT Results Component ---
const SjtResults: React.FC<{ results: { [key: string]: number }, onReset: () => void }> = ({ results, onReset }) => {
    const { t } = useTranslation();
    const competencies = Object.keys(results);
    const maxScore = Math.max(...Object.values(results), 10);

    return (
         <div>
            <h2 className="mb-6 text-2xl font-bold text-center text-slate-800">{t('sjt_test.resultsTitle')}</h2>
            <div className="space-y-4">
                {competencies.map(competency => (
                    <div key={competency}>
                        <div className="flex justify-between mb-1">
                            <span className="text-lg font-bold text-slate-700">{t(`dimensions.${competency}` as any)}</span>
                             <span className="text-lg font-semibold text-slate-600">{results[competency]}</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-4">
                            <div
                                className="h-4 bg-amber-500 rounded-full"
                                style={{ width: `${(results[competency] / maxScore) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 text-center">
                <button onClick={onReset} className="w-full max-w-xs px-6 py-3 font-semibold text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700">
                    {t('test_shared.resetButton')}
                </button>
            </div>
        </div>
    );
};


// --- SJT Test Component ---
const SjtTest: React.FC<{ testData: { teste: SjtScenario[] } }> = ({ testData }) => {
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: string]: string }>({});
    const [results, setResults] = useState<{ [key: string]: number } | null>(null);
    
    const scenarios = testData.teste;
    const currentScenario = scenarios[currentIndex];

    const handleSelectOption = (optionId: string) => {
        setAnswers(prev => ({...prev, [currentScenario.id]: optionId }));
    };

    const handleNext = () => currentIndex < scenarios.length - 1 && setCurrentIndex(i => i + 1);
    const handlePrevious = () => currentIndex > 0 && setCurrentIndex(i => i - 1);

    const handleFinish = () => {
        const scores: { [key: string]: number } = {};
        scenarios.forEach(scenario => {
            const selectedOptionId = answers[scenario.id];
            if (selectedOptionId) {
                const selectedOption = scenario.opcoes.find(o => o.id === selectedOptionId);
                if (selectedOption) {
                    Object.entries(selectedOption.pontos).forEach(([competency, points]) => {
                        scores[competency] = (scores[competency] || 0) + points;
                    });
                }
            }
        });
        setResults(scores);
    };

    const handleReset = () => {
        setAnswers({});
        setCurrentIndex(0);
        setResults(null);
    };

    if (results) return <SjtResults results={results} onReset={handleReset} />;

    return (
        <div>
            <div className="mb-4 text-center">
                <p className="text-sm font-semibold text-slate-500">
                    {t('test_shared.question')} {currentIndex + 1} {t('test_shared.of')} {scenarios.length}
                </p>
                <p className="p-4 mt-2 text-lg text-slate-700 bg-slate-100 rounded-lg">{currentScenario.texto}</p>
            </div>
            <div className="mt-6 space-y-3">
                {currentScenario.opcoes.map(option => (
                    <button
                        key={option.id}
                        onClick={() => handleSelectOption(option.id)}
                        className={`block w-full p-4 text-left border rounded-lg transition-all
                            ${answers[currentScenario.id] === option.id
                                ? 'bg-indigo-100 border-indigo-500 ring-2 ring-indigo-500'
                                : 'bg-white border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                            }`}
                    >
                        {option.texto}
                    </button>
                ))}
            </div>
            <div className="flex justify-between mt-8">
                <button onClick={handlePrevious} disabled={currentIndex === 0} className="px-6 py-2 font-semibold text-slate-700 transition-colors bg-slate-200 rounded-lg hover:bg-slate-300 disabled:opacity-50">
                    {t('test_shared.previous')}
                </button>
                {currentIndex < scenarios.length - 1 ? (
                    <button onClick={handleNext} className="px-6 py-2 font-semibold text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700">
                        {t('test_shared.next')}
                    </button>
                ) : (
                    <button onClick={handleFinish} className="px-6 py-2 font-semibold text-white transition-colors bg-emerald-600 rounded-lg hover:bg-emerald-700">
                        {t('test_shared.finish')}
                    </button>
                )}
            </div>
        </div>
    );
};


// --- Main Wrapper Component ---

const TEST_CONFIG = {
  'big-five': {
    file: '/big_five_questions.json',
    component: PersonalityTest,
    icon: PuzzlePieceIcon,
  },
  'disc': {
    file: '/disc_questions.json',
    component: DiscTest,
    icon: SparklesIcon,
  },
  'sjt': {
    file: '/sjt_scenarios.json',
    component: SjtTest,
    icon: ClipboardDocumentListIcon,
  },
};

interface BehavioralTestProps {
  testType: TestType;
  onClose: () => void;
}

const BehavioralTest: React.FC<BehavioralTestProps> = ({ testType, onClose }) => {
  const { t } = useTranslation();
  const [testData, setTestData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTestData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const config = TEST_CONFIG[testType];
        const response = await fetch(config.file);
        if (!response.ok) {
          throw new Error(t('error.couldNotLoad'));
        }
        const data = await response.json();
        setTestData(data);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError(t('error.loadTestError'));
        }
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestData();
  }, [testType, t]);

  const TestComponent = TEST_CONFIG[testType].component;
  const Icon = TEST_CONFIG[testType].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div className="flex items-center">
                <Icon className="w-8 h-8 mr-3 text-indigo-600" />
                <h2 id="modal-title" className="text-2xl font-bold text-slate-800">
                    {t(`tests.${testType}.title`)}
                </h2>
            </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 rounded-full hover:bg-slate-100 hover:text-slate-600"
            aria-label={t('test_shared.closeButton')}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-grow p-6 overflow-y-auto">
          {isLoading && <Loader />}
          {error && (
            <div className="text-center text-red-600" role="alert">
                <h3 className="font-bold">{t('test_shared.errorTitle')}</h3>
                <p>{error}</p>
            </div>
          )}
          {!isLoading && !error && testData && (
            <TestComponent testData={testData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default BehavioralTest;