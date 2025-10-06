import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ClockIcon } from './icons';

// Type definitions for the pipeline data structure
interface EtapaDisponivel {
  id: string;
  nome: string;
  tipo: string;
  formato: string;
  descricao: string;
  obrigatorio: boolean;
  peso_score: number;
  exemplo: string;
  duration: number;
}

interface PipelineData {
  processo_seletivo: {
    etapas_disponiveis: EtapaDisponivel[];
    regras_score: {
      formula: string;
    }
  };
}

interface StageConfig extends EtapaDisponivel {
  enabled: boolean;
}

const PipelineBuilder: React.FC = () => {
  const { t } = useTranslation();
  const [pipelineData, setPipelineData] = useState<PipelineData | null>(null);
  const [stages, setStages] = useState<StageConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPipelineData = async () => {
      try {
        const response = await fetch('/modelo_selecao_vaga_ja.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: PipelineData = await response.json();
        setPipelineData(data);
        const configuredStages = data.processo_seletivo.etapas_disponiveis.map(stage => ({
          ...stage,
          enabled: stage.obrigatorio || stage.peso_score > 0, // Enable mandatory or weighted stages by default
        }));
        setStages(configuredStages);
      } catch (e) {
        console.error("Failed to load pipeline data:", e);
        setError(t('error.couldNotLoad'));
      } finally {
        setIsLoading(false);
      }
    };
    fetchPipelineData();
  }, [t]);

  const handleToggleStage = (stageId: string) => {
    setStages(prevStages =>
      prevStages.map(stage =>
        stage.id === stageId ? { ...stage, enabled: !stage.enabled } : stage
      )
    );
  };

  const handleWeightChange = (stageId: string, newWeight: number) => {
    setStages(prevStages =>
      prevStages.map(stage =>
        stage.id === stageId ? { ...stage, peso_score: newWeight } : stage
      )
    );
  };

  const totalWeight = stages.reduce((acc, stage) => {
    return stage.enabled && stage.peso_score > 0 ? acc + stage.peso_score : acc;
  }, 0);

  if (isLoading) {
    return <div className="text-center p-8">{t('loader.loadingTest')}</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

  return (
    <section>
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">{t('pipeline.title')}</h2>
        <p className="text-center text-slate-600 mb-8 max-w-2xl mx-auto">{t('pipeline.description')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stages.map(stage => (
                <div key={stage.id} className={`p-5 bg-white border border-slate-200 rounded-xl shadow-md transition-all duration-300 ${!stage.enabled && !stage.obrigatorio ? 'opacity-60 bg-slate-50' : ''}`}>
                    <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-slate-800 pr-2">{t(`pipeline.stages.${stage.id}.name`)}</h3>
                        <div className="flex items-center flex-shrink-0">
                            {stage.obrigatorio && <span className="text-xs font-semibold text-slate-500 mr-3">{t('pipeline.mandatory')}</span>}
                            <label htmlFor={`toggle-${stage.id}`} className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    id={`toggle-${stage.id}`}
                                    className="sr-only peer"
                                    checked={stage.enabled}
                                    onChange={() => handleToggleStage(stage.id)}
                                    disabled={stage.obrigatorio}
                                />
                                <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-indigo-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{t(`pipeline.stages.${stage.id}.description`)}</p>
                    <p className={`text-xs text-slate-500 italic bg-slate-100 p-2 rounded-md ${stage.duration > 0 ? 'mb-2' : 'mb-4'}`}>{t(`pipeline.stages.${stage.id}.example`)}</p>
                    {stage.duration > 0 && (
                        <div className="flex items-center text-xs text-slate-500 mb-4">
                            <ClockIcon className="w-4 h-4 mr-1.5 text-slate-400" />
                            <span>{t('pipeline.estimatedTime', { duration: stage.duration })}</span>
                        </div>
                    )}
                    {stage.peso_score > 0 && (
                        <div>
                            <label htmlFor={`weight-${stage.id}`} className="flex justify-between text-sm font-medium text-slate-700 mb-1">
                                <span>{t('criteria.weight')}</span>
                                <span className="font-bold text-indigo-600">{(stage.peso_score * 100).toFixed(0)}%</span>
                            </label>
                            <input
                                id={`weight-${stage.id}`}
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={stage.peso_score * 100}
                                onChange={e => handleWeightChange(stage.id, parseInt(e.target.value, 10) / 100)}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                disabled={!stage.enabled}
                            />
                        </div>
                    )}
                </div>
            ))}
             <div className="md:col-span-2 lg:col-span-1 p-5 bg-white border-2 border-indigo-200 rounded-xl shadow-md">
                <h3 className="text-lg font-bold text-slate-800 mb-3">{t('pipeline.summaryTitle')}</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-base font-semibold text-slate-700">{t('pipeline.totalWeight')}</span>
                            <span className={`text-xl font-bold ${Math.round(totalWeight * 100) !== 100 ? 'text-red-500' : 'text-emerald-600'}`}>
                                {(totalWeight * 100).toFixed(0)}%
                            </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                            <div
                                className={`h-3 rounded-full ${Math.round(totalWeight * 100) > 100 ? 'bg-red-500' : 'bg-indigo-600'}`}
                                style={{ width: `${Math.min(totalWeight * 100, 100)}%` }}
                            ></div>
                        </div>
                        {Math.round(totalWeight * 100) !== 100 && (
                            <p className="text-xs text-red-600 mt-1">{t('pipeline.weightWarning')}</p>
                        )}
                    </div>
                    <div>
                        <h4 className="text-base font-semibold text-slate-700">{t('pipeline.scoreFormula')}</h4>
                        <p className="text-sm text-slate-600 bg-slate-100 p-2 rounded-md mt-1 font-mono text-center">
                           {pipelineData?.processo_seletivo.regras_score.formula}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default PipelineBuilder;