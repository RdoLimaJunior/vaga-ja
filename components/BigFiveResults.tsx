import React from 'react';
import { useTranslation } from 'react-i18next';

interface BigFiveResultsProps {
  results: { [key: string]: number };
  testData: any;
  onReset: () => void;
}

const BigFiveResults: React.FC<BigFiveResultsProps> = ({ results, testData, onReset }) => {
  const { t } = useTranslation();

  const getInterpretation = (dimension: string, score: number) => {
    // Assuming score is out of 120 (24 questions * 5 max points)
    if (score > 80) return t(`big_five_test.interpretations.${dimension}.high`);
    if (score < 40) return t(`big_five_test.interpretations.${dimension}.low`);
    return t(`big_five_test.interpretations.${dimension}.moderate`);
  };

  const maxScorePerDimension = testData.teste.perguntas.filter((p: any) => p.dimensao === 'O').length * 5;

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-center text-slate-800 md:text-3xl">
        {t('big_five_test.results.title')}
      </h2>
      <div className="space-y-6">
        {testData.teste.dimensoes.map((dim: { id: string; nome: string; descricao: string }) => {
          const score = results[dim.id] || 0;
          const percentage = (score / maxScorePerDimension) * 100;
          const interpretation = getInterpretation(dim.id, score);

          return (
            <div key={dim.id} className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-xl font-bold text-indigo-700">{t(`dimensions.${dim.id}`)}</h3>
                <span className="mt-1 text-lg font-semibold text-slate-600 sm:mt-0">
                  {t('big_five_test.results.score_of', { score, max: maxScorePerDimension })}
                </span>
              </div>
              <div className="w-full my-2 bg-slate-200 rounded-full h-4 shadow-inner">
                <div
                  className="h-4 bg-indigo-600 rounded-full transition-width duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="mt-2 text-sm text-slate-500">{dim.descricao}</p>
              <div className="p-3 mt-3 text-slate-800 bg-indigo-50 rounded-md">
                <p className="font-semibold">{t('big_five_test.results.interpretation')}</p>
                <p className="text-sm">{interpretation}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 text-center">
        <button onClick={onReset} className="w-full max-w-xs px-6 py-3 font-semibold text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700">
          {t('test_shared.resetButton')}
        </button>
      </div>
    </div>
  );
};

export default BigFiveResults;