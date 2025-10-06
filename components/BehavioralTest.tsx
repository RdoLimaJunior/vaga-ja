import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { XMarkIcon } from './icons';
import { TestType, BigFiveQuestion, DiscQuestion, SjtScenario } from '../types';
import BigFiveResults from './BigFiveResults';

interface BehavioralTestProps {
  testType: TestType;
  onClose: () => void;
}

type BigFiveAnswers = { [key: string]: number };
type DiscAnswers = { [key: string]: { most: string | null; least: string | null } };
type SjtAnswers = { [key: string]: string };

type Results = { [key: string]: number } | null;

const BehavioralTest: React.FC<BehavioralTestProps> = ({ testType, onClose }) => {
  const { t } = useTranslation();
  const [testData, setTestData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<BigFiveAnswers | DiscAnswers | SjtAnswers>({});
  const [results, setResults] = useState<Results>(null);

  useEffect(() => {
    const loadTestData = async () => {
      try {
        const response = await fetch(`/data/${testType === 'big-five' ? 'big_five_120' : testType === 'disc' ? 'disc_questions' : 'sjt_scenarios'}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTestData(data);
      } catch (e) {
        console.error("Failed to load test data:", e);
        setError(t('error.loadTestError'));
      } finally {
        setIsLoading(false);
      }
    };
    loadTestData();
  }, [testType, t]);

  const resetTest = () => {
    setResults(null);
    setAnswers({});
    setCurrentQuestionIndex(0);
  };
  
  const handlePrevious = () => setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
  const handleNext = () => setCurrentQuestionIndex(prev => Math.min(testData.teste.perguntas?.length - 1 || testData.teste.cenarios?.length - 1, prev + 1));
  
  const calculateResults = () => {
    const finalScores: { [key: string]: number } = {};
    if (testType === 'big-five') {
        testData.teste.dimensoes.forEach((dim: any) => finalScores[dim.id] = 0);
        testData.teste.perguntas.forEach((q: BigFiveQuestion) => {
            if ((answers as BigFiveAnswers)[q.id]) {
                finalScores[q.dimensao] += (answers as BigFiveAnswers)[q.id];
            }
        });
    } else if (testType === 'disc') {
        testData.teste.dimensoes.forEach((dim: any) => finalScores[dim.id] = 0);
        testData.teste.perguntas.forEach((q: DiscQuestion) => {
            const answer = (answers as DiscAnswers)[q.id];
            if (answer) {
                if (answer.most) finalScores[answer.most]++;
                if (answer.least) finalScores[answer.least]--;
            }
        });
    } else if (testType === 'sjt') {
        testData.teste.competencias.forEach((c: any) => finalScores[c.id] = 0);
        testData.teste.cenarios.forEach((s: SjtScenario) => {
            const selectedOptionId = (answers as SjtAnswers)[s.id];
            const selectedOption = s.opcoes.find(opt => opt.id === selectedOptionId);
            if (selectedOption) {
                Object.entries(selectedOption.pontos).forEach(([competency, points]) => {
                    finalScores[competency] += points;
                });
            }
        });
    }
    setResults(finalScores);
  };

  const renderBigFiveQuestion = () => {
    const question: BigFiveQuestion = testData.teste.perguntas[currentQuestionIndex];
    const scale = testData.teste.escala_resposta.valores;
    return (
        <>
            <h2 className="mb-6 text-xl font-semibold text-center text-slate-800 md:text-2xl">{question.texto}</h2>
            <div className="flex flex-col items-center my-4 space-y-3">
                {Object.entries(scale).map(([value, label]) => {
                    const isSelected = (answers as BigFiveAnswers)[question.id] === parseInt(value);
                    return (
                        <label key={value} className={`w-full max-w-sm p-3 text-center border rounded-lg cursor-pointer transition-all duration-200 ease-in-out transform hover:scale-105 ${isSelected ? 'bg-indigo-600 text-white border-indigo-700 shadow-md' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'}`}>
                            <input
                            type="radio"
                            name={question.id}
                            value={value}
                            checked={isSelected}
                            onChange={() => {
                                // Fix: Cast `prev` to `BigFiveAnswers` to resolve union type incompatibility.
                                setAnswers(prev => ({ ...(prev as BigFiveAnswers), [question.id]: parseInt(value) }));
                                setTimeout(() => {
                                    if (currentQuestionIndex < testData.teste.perguntas.length - 1) {
                                        setCurrentQuestionIndex(currentQuestionIndex + 1);
                                    }
                                }, 250);
                            }}
                            className="sr-only"
                            />
                            {label as string}
                        </label>
                    )
                })}
            </div>
      </>
    );
  };

  const renderDiscQuestion = () => {
    const question: DiscQuestion = testData.teste.perguntas[currentQuestionIndex];
    const currentAnswers = (answers as DiscAnswers)[question.id] || { most: null, least: null };
    
    const handleDiscChange = (type: 'most' | 'least', value: string) => {
        setAnswers(prev => {
            const qAnswers = (prev as DiscAnswers)[question.id] || { most: null, least: null };
            const newAnswers = { ...qAnswers, [type]: value };
            // Ensure most and least are not the same
            if (type === 'most' && value === newAnswers.least) newAnswers.least = null;
            if (type === 'least' && value === newAnswers.most) newAnswers.most = null;
            // Fix: Cast `prev` to `DiscAnswers` to resolve union type incompatibility.
            return { ...(prev as DiscAnswers), [question.id]: newAnswers };
        });
    };

    return (
      <>
        <h2 className="mb-2 text-xl font-semibold text-center text-slate-800">{t('disc_test.instruction')}</h2>
        <div className="grid grid-cols-12 gap-4 p-4 mt-4 border border-slate-200 rounded-lg">
            <div className="col-span-2 font-bold text-center text-slate-500">{t('disc_test.most')}</div>
            <div className="col-span-8"></div>
            <div className="col-span-2 font-bold text-center text-slate-500">{t('disc_test.least')}</div>
            
            {Object.entries(question.opcoes).map(([dim, text]) => (
                <React.Fragment key={dim}>
                    <div className="flex items-center justify-center col-span-2">
                        <input type="radio" name={`${question.id}-most`} value={dim} checked={currentAnswers.most === dim} onChange={(e) => handleDiscChange('most', e.target.value)} className="w-5 h-5 accent-indigo-600"/>
                    </div>
                    <div className="flex items-center justify-center col-span-8 p-3 text-center bg-slate-100 rounded-md">
                       {text}
                    </div>
                    <div className="flex items-center justify-center col-span-2">
                        <input type="radio" name={`${question.id}-least`} value={dim} checked={currentAnswers.least === dim} onChange={(e) => handleDiscChange('least', e.target.value)} className="w-5 h-5 accent-blue-600"/>
                    </div>
                </React.Fragment>
            ))}
        </div>
      </>
    );
  };

  const renderSjtQuestion = () => {
    const scenario: SjtScenario = testData.teste.cenarios[currentQuestionIndex];
    return (
      <>
        <h2 className="mb-4 text-xl font-semibold text-left text-slate-800">{scenario.texto}</h2>
        <div className="space-y-3">
          {scenario.opcoes.map(option => {
            const isSelected = (answers as SjtAnswers)[scenario.id] === option.id;
            return (
              <label key={option.id} className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-indigo-100 border-indigo-500' : 'bg-white border-slate-300 hover:bg-slate-50'}`}>
                <input
                  type="radio"
                  name={scenario.id}
                  value={option.id}
                  checked={isSelected}
                  // Fix: Cast `prev` to `SjtAnswers` to resolve union type incompatibility.
                  onChange={(e) => setAnswers(prev => ({...(prev as SjtAnswers), [scenario.id]: e.target.value}))}
                  className="mr-3 mt-1 accent-indigo-600"
                />
                <span className="text-slate-700">{option.texto}</span>
              </label>
            );
          })}
        </div>
      </>
    );
  };

  const renderResults = () => {
    if (!results) return null;

    if (testType === 'big-five') {
      return <BigFiveResults results={results} testData={testData} onReset={resetTest} />;
    }

    let title = t('test_shared.resultsTitle');
    let dimensions: {id: string, name: string}[] = [];
    let maxScore = 0;

    if (testType === 'disc') {
        title = t('disc_test.resultsTitle');
        dimensions = testData.teste.dimensoes.map((d: any) => ({id: d.id, name: t(`disc_test.${d.id}`)}))
    } else if (testType === 'sjt') {
        title = t('sjt_test.resultsTitle');
        dimensions = testData.teste.competencias.map((c: any) => ({id: c.id, name: t(`dimensions.${c.id}`)}))
        maxScore = testData.teste.cenarios.length * 5;
    }

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold text-center text-slate-800 md:text-3xl">{title}</h2>
            <div className="space-y-5">
              {dimensions.map(dim => {
                const score = results[dim.id] || 0;
                let percentage = 0;
                if (testType === 'sjt') {
                    percentage = (score / maxScore) * 100;
                } else if (testType === 'disc') {
                    const totalQuestions = testData.teste.perguntas.length;
                    percentage = ((score + totalQuestions) / (totalQuestions * 2)) * 100;
                }
                
                return (
                  <div key={dim.id}>
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="text-lg font-semibold text-slate-700">{dim.name}</span>
                        {testType === 'sjt' && (
                            <span className="text-lg font-bold text-indigo-600">
                                {score} / {maxScore}
                            </span>
                        )}
                        {testType === 'disc' && (
                            <span className="text-sm font-medium text-slate-600">
                                Score: {score}
                            </span>
                        )}
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-4 shadow-inner">
                      <div
                        className="h-4 bg-indigo-600 rounded-full transition-width duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 text-center">
                <button onClick={resetTest} className="w-full max-w-xs px-6 py-3 font-semibold text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700">
                    {t('test_shared.resetButton')}
                </button>
            </div>
        </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        <div className="flex flex-col items-center p-8 bg-white rounded-lg shadow-2xl">
          <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-indigo-600"></div>
          <p className="mt-4 text-slate-700">{t('loader.loadingTest')}</p>
        </div>
      </div>
    );
  }

  if (error || !testData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
        <div className="p-8 text-center bg-white rounded-lg shadow-2xl">
          <h2 className="text-xl font-bold text-red-600">{t('test_shared.errorTitle')}</h2>
          <p className="mt-2 text-slate-700">{error || t('error.couldNotLoad')}</p>
          <button onClick={onClose} className="px-4 py-2 mt-4 bg-slate-200 rounded hover:bg-slate-300">{t('test_shared.closeButton')}</button>
        </div>
      </div>
    );
  }
  
  const questions = testData.teste.perguntas || testData.teste.cenarios;
  const totalQuestions = questions.length;
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70" aria-modal="true" role="dialog">
      <div className="relative w-full max-w-3xl max-h-[90vh] p-6 pt-12 mx-4 overflow-y-auto bg-white rounded-xl shadow-2xl md:p-8 md:pt-16">
        <button onClick={onClose} className="absolute text-slate-500 top-4 right-4 hover:text-slate-800" aria-label={t('test_shared.closeButton')}>
          <XMarkIcon className="w-8 h-8" />
        </button>

        {results ? renderResults() : (
          <div>
            <div className="mb-6">
              <div className="flex justify-between mb-1 text-sm font-medium text-slate-600">
                <span>{t('test_shared.question')} {currentQuestionIndex + 1} {t('test_shared.of')} {totalQuestions}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
              </div>
            </div>

            {testType === 'big-five' && renderBigFiveQuestion()}
            {testType === 'disc' && renderDiscQuestion()}
            {testType === 'sjt' && renderSjtQuestion()}
            
            <div className="flex justify-between mt-8">
              <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="px-6 py-2 font-semibold text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed">
                {t('test_shared.previous')}
              </button>
              {currentQuestionIndex < totalQuestions - 1 ? (
                <button onClick={handleNext} className="px-6 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                  {t('test_shared.next')}
                </button>
              ) : (
                <button onClick={calculateResults} className="px-6 py-2 font-semibold text-white rounded-lg bg-emerald-500 hover:bg-emerald-600">
                  {t('test_shared.finish')}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BehavioralTest;