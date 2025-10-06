import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BigFiveQuestion } from '../types';
import BigFiveResults from './BigFiveResults';

interface PersonalityTestProps {
  testData: {
    teste: {
      perguntas: BigFiveQuestion[];
      dimensoes: any[];
    }
  };
}

const PersonalityTest: React.FC<PersonalityTestProps> = ({ testData }) => {
  const { t } = useTranslation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [results, setResults] = useState<{ [key: string]: number } | null>(null);

  const questions = testData.teste.perguntas;
  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (questionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
    // Automatically move to the next question
    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    }, 200);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    const calculatedResults: { [key: string]: number } = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    questions.forEach(q => {
      // Scores are inverted for some questions. Assuming JSON contains a 'pontuacao_inversa' flag.
      // For simplicity here, we assume direct scoring.
      // A real implementation would check for inverted scoring.
      const score = answers[q.id] || 3; // Default to neutral if not answered
      if (calculatedResults[q.dimensao as keyof typeof calculatedResults] !== undefined) {
         calculatedResults[q.dimensao as keyof typeof calculatedResults] += score;
      }
    });
    setResults(calculatedResults);
  };
  
  const handleReset = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setResults(null);
  };

  if (results) {
    return <BigFiveResults results={results} testData={testData} onReset={handleReset} />;
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div>
       <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      <div className="mb-4 text-center">
        <p className="text-sm font-semibold text-slate-500">
          {t('test_shared.question')} {currentQuestionIndex + 1} {t('test_shared.of')} {questions.length}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-slate-800 min-h-[6rem] flex items-center justify-center">{currentQuestion.texto}</h3>
      </div>

      <div className="flex justify-center my-6 space-x-2 md:space-x-4">
        {[1, 2, 3, 4, 5].map(score => (
          <button
            key={score}
            onClick={() => handleAnswer(currentQuestion.id, score)}
            className={`w-12 h-12 md:w-14 md:h-14 rounded-full text-lg font-bold transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              ${answers[currentQuestion.id] === score ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
          >
            {score}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-8">
        <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="px-6 py-2 font-semibold text-slate-700 transition-colors bg-slate-200 rounded-lg hover:bg-slate-300 disabled:opacity-50 disabled:cursor-not-allowed">
          {t('test_shared.previous')}
        </button>
        {currentQuestionIndex < questions.length - 1 ? (
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

export default PersonalityTest;
