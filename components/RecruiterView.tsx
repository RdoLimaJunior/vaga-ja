import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { analyzeCandidate, suggestCriteria, assessJobDescription, suggestJobImprovements, generateJobDescriptionFromBrief } from '../services/geminiService';
import { Criterion, Candidate, JobAssessment, JobImprovementSuggestions } from '../types';
import Loader from './Loader';
import CandidateCard from './CandidateCard';
import PipelineBuilder from './PipelineBuilder';
import StepIndicator from './StepIndicator';
import CultureMappingForm from './CultureMappingForm';
import { PlusCircleIcon, TrashIcon, SparklesIcon, LightBulbIcon, XMarkIcon, IdentificationIcon, PencilIcon, CpuChipIcon } from './icons';

interface CultureData {
    pace: number;
    structure: number;
    collaboration: number;
    communication: number;
    focus: number;
}

const RecruiterView: React.FC = () => {
  const { t, i18n } = useTranslation();
  
  // State for the new 6-step workflow
  const [currentStep, setCurrentStep] = useState(1);
  const [creationMode, setCreationMode] = useState<'ai' | 'manual' | null>(null);

  // Core data states
  const [jobBrief, setJobBrief] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [contractType, setContractType] = useState('');
  const [cultureData, setCultureData] = useState<CultureData>({
    pace: 50,
    structure: 50,
    collaboration: 50,
    communication: 50,
    focus: 50,
  });
  const [candidatesCv, setCandidatesCv] = useState('');
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: 'c1', name: 'Technical Skills', weight: 4 },
    { id: 'c2', name: 'Relevant Experience', weight: 4 },
    { id: 'c3', name: 'Communication Skills', weight: 3 },
  ]);
  const [rankedCandidates, setRankedCandidates] = useState<Candidate[]>([]);
  
  // UI/Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isSuggestingCriteria, setIsSuggestingCriteria] = useState(false);
  const [isAssessing, setIsAssessing] = useState(false);
  const [isSuggestingImprovements, setIsSuggestingImprovements] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [assessmentResult, setAssessmentResult] = useState<JobAssessment | null>(null);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [improvementSuggestions, setImprovementSuggestions] = useState<JobImprovementSuggestions | null>(null);


  const addCriterion = () => {
    const newCriterion: Criterion = { id: `c${Date.now()}`, name: '', weight: 3 };
    setCriteria([...criteria, newCriterion]);
  };

  const updateCriterion = (id: string, field: 'name' | 'weight', value: string | number) => {
    setCriteria(criteria.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const handleCultureDataChange = (field: keyof CultureData, value: number) => {
    setCultureData(prev => ({ ...prev, [field]: value }));
  };
  
  const resetState = () => {
    setCurrentStep(1);
    setCreationMode(null);
    setJobBrief('');
    setJobDescription('');
    setContractType('');
    setCultureData({ pace: 50, structure: 50, collaboration: 50, communication: 50, focus: 50 });
    setCandidatesCv('');
    setCriteria([
        { id: 'c1', name: 'Technical Skills', weight: 4 },
        { id: 'c2', name: 'Relevant Experience', weight: 4 },
        { id: 'c3', name: 'Communication Skills', weight: 3 },
    ]);
    setRankedCandidates([]);
    setIsLoading(false);
    setError(null);
    setAssessmentResult(null);
    setImprovementSuggestions(null);
  };

  const handleGenerateDescription = async () => {
      if (!jobBrief.trim()) return;
      setIsGeneratingDescription(true);
      setError(null);
      try {
          const result = await generateJobDescriptionFromBrief(jobBrief, i18n.language);
          setJobDescription(result.fullDescriptionText);
          setCurrentStep(2);
      } catch (err) {
          setError(t('error.tryAgain'));
      } finally {
          setIsGeneratingDescription(false);
      }
  };

  const handleSuggestCriteria = async () => {
    if (!jobDescription.trim()) return;
    setIsSuggestingCriteria(true);
    setError(null);
    try {
        const suggested = await suggestCriteria(jobDescription, i18n.language);
        const newCriteria = suggested.map(c => ({ ...c, id: `c${Date.now()}-${Math.random()}` }));
        setCriteria(newCriteria);
    } catch (err) {
        setError(t('error.tryAgain'));
    } finally {
        setIsSuggestingCriteria(false);
    }
  };

  const handleAssessJob = async () => {
    if (!jobDescription.trim()) return;
    setIsAssessing(true);
    setImprovementSuggestions(null);
    setError(null);
    try {
        const result = await assessJobDescription(jobDescription, i18n.language);
        setAssessmentResult(result);
        setIsAssessmentModalOpen(true);
    } catch (err) {
        setError(t('error.tryAgain'));
    } finally {
        setIsAssessing(false);
    }
  };
  
  const handleSuggestImprovements = async () => {
    if (!jobDescription.trim()) return;
    setIsSuggestingImprovements(true);
    setError(null);
    try {
        const result = await suggestJobImprovements(jobDescription, i18n.language);
        setImprovementSuggestions(result);
    } catch (err) {
        setError(t('error.tryAgain'));
        setImprovementSuggestions(null);
    } finally {
        setIsSuggestingImprovements(false);
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !candidatesCv.trim() || criteria.some(c => !c.name.trim())) return;

    setCurrentStep(6);
    setIsLoading(true);
    setError(null);
    setRankedCandidates([]);

    try {
      const cvs = candidatesCv.split('---').filter(cv => cv.trim() !== '');
      const analysisPromises = cvs.map(cv => analyzeCandidate(jobDescription, cv, criteria, i18n.language));
      const results = await Promise.all(analysisPromises);
      
      const candidates = results.map((result, index): Candidate => {
        let totalScore = 0;
        let totalWeight = 0;

        result.scores.forEach(scoredCriterion => {
          const criterion = criteria.find(c => c.name === scoredCriterion.criterionName);
          if (criterion) {
            totalScore += scoredCriterion.score * criterion.weight;
            totalWeight += criterion.weight;
          }
        });

        const overallScore = totalWeight > 0 ? totalScore / totalWeight : 0;

        return {
          id: `cand-${index}-${Date.now()}`,
          name: result.candidateName,
          scores: result.scores,
          overallScore,
          workExperience: result.workExperience || [],
          education: result.education || [],
          skills: result.skills || [],
        };
      });

      candidates.sort((a, b) => b.overallScore - a.overallScore);
      setRankedCandidates(candidates);
    } catch (err) {
      setError(t('error.tryAgain'));
    } finally {
      setIsLoading(false);
    }
  };

  const renderAssessmentModal = () => {
    if (!isAssessmentModalOpen || !assessmentResult) return null;

    const renderSuggestionList = (titleKey: string, suggestions: string[]) => (
        <section>
            <h4 className="text-md font-semibold text-slate-700 mb-2">{t(titleKey)}</h4>
            <ul className="space-y-2 list-disc list-inside text-slate-600 text-sm">
                {suggestions.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
        </section>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm" aria-labelledby="assessment-modal-title" role="dialog" aria-modal="true">
            <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white rounded-2xl shadow-xl">
                <div className="flex items-center justify-between p-5 border-b border-slate-200">
                    <h2 id="assessment-modal-title" className="text-xl font-bold text-slate-800">
                        {t('jobAssessment.title')}
                    </h2>
                    <button onClick={() => { setIsAssessmentModalOpen(false); setImprovementSuggestions(null); }} className="p-1 text-slate-400 rounded-full hover:bg-slate-100 hover:text-slate-600" aria-label={t('test_shared.closeButton')} >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-grow p-6 overflow-y-auto space-y-6">
                    {assessmentResult.cboCode && assessmentResult.cboTitle ? (
                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                            <h3 className="flex items-center text-md font-semibold text-emerald-800 mb-2"> <IdentificationIcon className="w-5 h-5 mr-2" /> {t('jobAssessment.cboTitle')} </h3>
                            <p className="text-emerald-700"> <span className="font-bold">{assessmentResult.cboCode}</span> - {assessmentResult.cboTitle} </p>
                        </div>
                    ) : (
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                            <h3 className="text-md font-semibold text-amber-800 mb-2">{t('jobAssessment.cboWarningTitle')}</h3>
                            <p className="text-sm text-amber-700">{t('jobAssessment.cboWarningText')}</p>
                        </div>
                    )}
                    <section>
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">{t('jobAssessment.summary')}</h3>
                        <p className="text-base text-slate-600 bg-slate-50 p-3 rounded-md">{assessmentResult.roleSummary}</p>
                    </section>
                    <section>
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">{t('jobAssessment.responsibilities')}</h3>
                        <ul className="space-y-2 list-disc list-inside text-slate-600"> {assessmentResult.keyResponsibilities.map((item, i) => <li key={i}>{item}</li>)} </ul>
                    </section>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <section>
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">{t('jobAssessment.hardSkills')}</h3>
                            <div className="flex flex-wrap gap-2"> {assessmentResult.hardSkills.map((skill, i) => ( <span key={i} className="px-3 py-1 text-sm font-medium text-indigo-800 bg-indigo-100 rounded-full"> {skill} </span> ))} </div>
                        </section>
                        <section>
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">{t('jobAssessment.softSkills')}</h3>
                            <div className="flex flex-wrap gap-2"> {assessmentResult.softSkills.map((skill, i) => ( <span key={i} className="px-3 py-1 text-sm font-medium text-emerald-800 bg-emerald-100 rounded-full"> {skill} </span> ))} </div>
                        </section>
                    </div>
                    {isSuggestingImprovements && ( <div className="flex flex-col items-center justify-center p-4"> <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-indigo-500"></div> <p className="mt-2 text-sm text-slate-500">{t('loader.analyzingText')}</p> </div> )}
                    {improvementSuggestions && (
                        <div className="pt-6 mt-6 border-t border-slate-200 animate-fade-in space-y-6">
                            <h3 className="text-xl font-bold text-center text-slate-800">{t('jobImprovements.title')}</h3>
                            <section>
                                <h4 className="text-md font-semibold text-slate-700 mb-2">{t('jobImprovements.suggestedTitle')}</h4>
                                <p className="text-base text-slate-800 font-bold bg-indigo-50 p-3 rounded-md">{improvementSuggestions.suggestedTitle}</p>
                            </section>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {renderSuggestionList('jobImprovements.clarity', improvementSuggestions.claritySuggestions)}
                                {renderSuggestionList('jobImprovements.engagement', improvementSuggestions.engagementSuggestions)}
                                {renderSuggestionList('jobImprovements.inclusivity', improvementSuggestions.inclusivitySuggestions)}
                            </div>
                            <section>
                                <h4 className="text-md font-semibold text-slate-700 mb-2">{t('jobImprovements.revisedDescription')}</h4>
                                <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-md whitespace-pre-wrap border border-slate-200">{improvementSuggestions.revisedDescription}</p>
                            </section>
                        </div>
                    )}
                </div>
                 <div className="flex items-center justify-end p-4 bg-slate-50 border-t border-slate-200">
                    <button onClick={handleSuggestImprovements} disabled={isSuggestingImprovements} className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white transition-colors bg-indigo-500 rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed">
                        <SparklesIcon className={`w-5 h-5 mr-2 ${isSuggestingImprovements ? 'animate-spin' : ''}`} />
                        {isSuggestingImprovements ? t('loader.analyzingText') : t('app.buttons.suggestImprovements')}
                    </button>
                </div>
            </div>
        </div>
    );
  };

  const renderStep1 = () => (
    <div className="space-y-8">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">{t('step1.title')}</h2>
        {!creationMode && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <button onClick={() => setCreationMode('ai')} className="p-8 text-left bg-white border-2 border-slate-200 rounded-xl shadow-lg hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500 transition-all transform hover:-translate-y-1">
                    <CpuChipIcon className="w-10 h-10 mb-3 text-indigo-600" />
                    <h3 className="text-xl font-bold text-slate-800">{t('step1.ai_title')}</h3>
                    <p className="mt-1 text-slate-600">{t('step1.ai_description')}</p>
                </button>
                <button onClick={() => setCreationMode('manual')} className="p-8 text-left bg-white border-2 border-slate-200 rounded-xl shadow-lg hover:border-indigo-500 hover:ring-2 hover:ring-indigo-500 transition-all transform hover:-translate-y-1">
                    <PencilIcon className="w-10 h-10 mb-3 text-indigo-600" />
                    <h3 className="text-xl font-bold text-slate-800">{t('step1.manual_title')}</h3>
                    <p className="mt-1 text-slate-600">{t('step1.manual_description')}</p>
                </button>
            </div>
        )}

        {creationMode === 'ai' && (
            <div className="max-w-3xl mx-auto animate-fade-in">
                <label htmlFor="job-brief" className="block mb-2 text-lg font-semibold text-slate-800">{t('step1.ai_brief_label')}</label>
                <textarea id="job-brief" rows={4} className="w-full p-3 bg-white text-slate-800 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500" placeholder={t('step1.ai_brief_placeholder')} value={jobBrief} onChange={(e) => setJobBrief(e.target.value)} />
                <div className="flex justify-end mt-4">
                    <button onClick={handleGenerateDescription} disabled={isGeneratingDescription || !jobBrief.trim()} className="flex items-center px-6 py-3 font-semibold text-white transition-colors bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400">
                        <SparklesIcon className={`w-5 h-5 mr-2 ${isGeneratingDescription ? 'animate-spin' : ''}`} />
                        {isGeneratingDescription ? t('loader.generating') : t('app.buttons.createDescription')}
                    </button>
                </div>
            </div>
        )}

        {creationMode === 'manual' && (
             <div className="max-w-3xl mx-auto animate-fade-in">
                <label htmlFor="job-description-manual" className="block mb-2 text-lg font-semibold text-slate-800">{t('step1.jobDescription')}</label>
                <textarea id="job-description-manual" rows={10} className="w-full p-3 bg-white text-slate-800 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500" placeholder={t('step1.jobDescriptionPlaceholder')} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
                <div className="flex justify-end mt-4">
                    <button onClick={() => setCurrentStep(2)} disabled={!jobDescription.trim()} className="px-6 py-3 font-semibold text-white transition-colors bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400">
                        {t('app.buttons.next')}
                    </button>
                </div>
            </div>
        )}
    </div>
  );

  const contractOptions = {
    clt: ['undetermined', 'determined', 'intermittent', 'partTime', 'temporary'],
    other: ['pj', 'internship', 'freelance'],
  };

  const renderStep2 = () => (
    <div className="space-y-8 animate-fade-in">
       <h2 className="text-2xl font-bold text-center text-slate-800">{t('step2.title')}</h2>
      
      <div className="space-y-6">
        <div>
            <label htmlFor="job-description-refine" className="block mb-2 text-lg font-semibold text-slate-800">{t('step2.jobDescription')}</label>
            <textarea id="job-description-refine" rows={10} className="w-full p-3 bg-white text-slate-800 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} />
            <div className="flex items-center gap-4 mt-4">
                <button onClick={handleAssessJob} disabled={isAssessing || !jobDescription.trim()} className="flex items-center px-4 py-2 text-sm font-semibold text-white transition-colors bg-teal-500 rounded-md shadow-sm hover:bg-teal-600 disabled:bg-slate-400">
                    <LightBulbIcon className={`w-5 h-5 mr-2 ${isAssessing ? 'animate-pulse' : ''}`} />
                    {isAssessing ? t('loader.analyzingText') : t('app.buttons.assessJob')}
                </button>
            </div>
        </div>

        <div>
            <label htmlFor="contract-type" className="block mb-2 text-lg font-semibold text-slate-800">{t('step2.contractTypeLabel')}</label>
            <select
                id="contract-type"
                value={contractType}
                onChange={(e) => setContractType(e.target.value)}
                className="w-full p-3 bg-white text-slate-800 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500"
            >
                <option value="" disabled>{t('i18n.language') === 'pt' ? 'Selecione um tipo...' : 'Select a type...'}</option>
                <optgroup label={t('contractTypes.cltGroup')}>
                    {contractOptions.clt.map(key => (
                        <option key={key} value={key}>
                            {t(`contractTypes.${key}.name`)}
                        </option>
                    ))}
                </optgroup>
                <optgroup label={t('contractTypes.otherGroup')}>
                    {contractOptions.other.map(key => (
                        <option key={key} value={key}>
                            {t(`contractTypes.${key}.name`)}
                        </option>
                    ))}
                </optgroup>
            </select>
            {contractType && (
                <div className="p-4 mt-3 text-sm text-slate-700 bg-slate-100 border border-slate-200 rounded-lg animate-fade-in">
                    <p>{t(`contractTypes.${contractType}.description`)}</p>
                </div>
            )}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={() => setCurrentStep(1)} className="px-6 py-3 font-semibold text-slate-700 transition-colors bg-slate-200 rounded-lg hover:bg-slate-300"> {t('app.buttons.back')} </button>
        <button onClick={() => setCurrentStep(3)} className="px-6 py-3 font-semibold text-white transition-colors bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700" disabled={!jobDescription.trim()}> {t('app.buttons.next')} </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
        <CultureMappingForm cultureData={cultureData} onCultureDataChange={handleCultureDataChange} />
        <div className="flex justify-between pt-8">
            <button onClick={() => setCurrentStep(2)} className="px-6 py-3 font-semibold text-slate-700 transition-colors bg-slate-200 rounded-lg hover:bg-slate-300"> {t('app.buttons.back')} </button>
            <button onClick={() => setCurrentStep(4)} className="px-6 py-3 font-semibold text-white transition-colors bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700"> {t('app.buttons.next')} </button>
        </div>
    </div>
    );
    
  const renderStep4 = () => (
    <div className="animate-fade-in">
        <PipelineBuilder />
        <div className="flex justify-between pt-8">
            <button onClick={() => setCurrentStep(3)} className="px-6 py-3 font-semibold text-slate-700 transition-colors bg-slate-200 rounded-lg hover:bg-slate-300"> {t('app.buttons.back')} </button>
            <button onClick={() => setCurrentStep(5)} className="px-6 py-3 font-semibold text-white transition-colors bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700"> {t('app.buttons.next')} </button>
        </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-8 animate-fade-in">
        <h2 className="text-2xl font-bold text-center text-slate-800">{t('step5_candidates.title')}</h2>
        <div>
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-800">{t('step5_candidates.criteria')}</h3>
                <button onClick={handleSuggestCriteria} disabled={isSuggestingCriteria || !jobDescription.trim()} className="flex items-center px-3 py-1.5 text-sm font-semibold text-white transition-colors bg-indigo-500 rounded-md shadow-sm hover:bg-indigo-600 disabled:bg-slate-400">
                    <SparklesIcon className={`w-4 h-4 mr-2 ${isSuggestingCriteria ? 'animate-spin' : ''}`} />
                    {isSuggestingCriteria ? t('loader.analyzingText') : t('criteria.suggestWithAI')}
                </button>
            </div>
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="space-y-3">
                    {criteria.map((c) => (
                    <div key={c.id} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-6"><input type="text" placeholder={t('criteria.namePlaceholder')} value={c.name} onChange={(e) => updateCriterion(c.id, 'name', e.target.value)} className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500" /></div>
                        <div className="col-span-5">
                            <select value={c.weight} onChange={(e) => updateCriterion(c.id, 'weight', parseInt(e.target.value, 10))} className="w-full p-2 bg-white text-slate-800 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500">
                                <option value="1">1 ({t('criteria.weights.low')})</option>
                                <option value="2">2</option>
                                <option value="3">3 ({t('criteria.weights.medium')})</option>
                                <option value="4">4</option>
                                <option value="5">5 ({t('criteria.weights.high')})</option>
                            </select>
                        </div>
                        <div className="col-span-1 text-center"> <button onClick={() => removeCriterion(c.id)} className="text-slate-400 hover:text-red-600" aria-label={t('criteria.remove')}> <TrashIcon className="w-6 h-6" /> </button> </div>
                    </div>
                    ))}
                </div>
                <button onClick={addCriterion} className="flex items-center mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800"> <PlusCircleIcon className="w-5 h-5 mr-1" /> {t('criteria.add')} </button>
            </div>
        </div>
        <div>
            <label htmlFor="candidates-cv" className="block mb-2 text-lg font-semibold text-slate-800">{t('step5_candidates.candidates')}</label>
            <textarea id="candidates-cv" rows={10} className="w-full p-3 bg-white text-slate-800 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500" placeholder={t('step5_candidates.candidatesPlaceholder')} value={candidatesCv} onChange={(e) => setCandidatesCv(e.target.value)} />
        </div>
        <div className="flex justify-between pt-4">
            <button onClick={() => setCurrentStep(4)} className="px-6 py-3 font-semibold text-slate-700 transition-colors bg-slate-200 rounded-lg hover:bg-slate-300">{t('app.buttons.back')}</button>
            <button onClick={handleAnalyze} className="px-6 py-3 font-semibold text-white transition-colors bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-400" disabled={isLoading || !candidatesCv.trim()}> {t('app.analyzeButton')} </button>
        </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="animate-fade-in">
      {isLoading && <Loader />}
      {error && ( <div className="max-w-3xl p-4 mx-auto mt-8 text-center text-red-800 bg-red-100 border border-red-300 rounded-lg" role="alert"> <h3 className="font-bold">{t('error.analysisFailed')}</h3> <p>{error}</p> </div> )}
      {rankedCandidates.length > 0 && (
        <div>
          <h2 className="my-8 text-3xl font-bold text-center text-slate-900">{t('app.analysisResultTitle')}</h2>
          {rankedCandidates.map((candidate, index) => ( <CandidateCard key={candidate.id} candidate={candidate} rank={index + 1} /> ))}
        </div>
      )}
       <div className="text-center mt-12"> <button onClick={resetState} className="px-8 py-3 font-semibold text-white transition-colors bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700"> {t('app.buttons.startOver')} </button> </div>
    </div>
  );
  
  const renderCurrentStep = () => {
    switch (currentStep) {
        case 1: return renderStep1();
        case 2: return renderStep2();
        case 3: return renderStep3();
        case 4: return renderStep4();
        case 5: return renderStep5();
        case 6: return renderStep6();
        default: return renderStep1();
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
        {renderAssessmentModal()}
        <div className="mb-16">
          <StepIndicator currentStep={currentStep} />
        </div>
        <div className="p-8 bg-white border border-slate-200 rounded-xl shadow-xl min-h-[500px]">
            {renderCurrentStep()}
        </div>
    </div>
  );
};

export default RecruiterView;