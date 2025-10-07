import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { analyzeCandidate, suggestCriteria, assessJobDescription, suggestJobImprovements } from '../services/geminiService';
import { Criterion, Candidate, JobAssessment, JobImprovementSuggestions } from '../types';
import Loader from './Loader';
import CandidateCard from './CandidateCard';
import PipelineBuilder from './PipelineBuilder';
import StepIndicator from './StepIndicator';
import { PlusCircleIcon, TrashIcon, SparklesIcon, LightBulbIcon, XMarkIcon } from './icons';

const RecruiterView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [jobDescription, setJobDescription] = useState('');
  const [candidatesCv, setCandidatesCv] = useState('');
  const [criteria, setCriteria] = useState<Criterion[]>([
    { id: 'c1', name: 'Technical Skills', weight: 4 },
    { id: 'c2', name: 'Relevant Experience', weight: 4 },
    { id: 'c3', name: 'Communication Skills', weight: 3 },
  ]);
  const [rankedCandidates, setRankedCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<JobAssessment | null>(null);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [improvementSuggestions, setImprovementSuggestions] = useState<JobImprovementSuggestions | null>(null);
  const [isSuggestingImprovements, setIsSuggestingImprovements] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  const addCriterion = () => {
    const newCriterion: Criterion = {
      id: `c${Date.now()}`,
      name: '',
      weight: 3,
    };
    setCriteria([...criteria, newCriterion]);
  };

  const updateCriterion = (id: string, field: 'name' | 'weight', value: string | number) => {
    setCriteria(criteria.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeCriterion = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };
  
  const resetState = () => {
    setJobDescription('');
    setCandidatesCv('');
    setCriteria([
        { id: 'c1', name: 'Technical Skills', weight: 4 },
        { id: 'c2', name: 'Relevant Experience', weight: 4 },
        { id: 'c3', name: 'Communication Skills', weight: 3 },
      ]);
    setRankedCandidates([]);
    setIsLoading(false);
    setError(null);
    setCurrentStep(1);
  };

  const handleSuggestCriteria = async () => {
    if (!jobDescription.trim()) return;
    
    setIsSuggesting(true);
    setError(null);
    try {
        const suggested = await suggestCriteria(jobDescription, i18n.language);
        const newCriteria = suggested.map(c => ({
            ...c,
            id: `c${Date.now()}-${Math.random()}`
        }));
        setCriteria(newCriteria);
    } catch (err) {
        setError(t('error.tryAgain'));
    } finally {
        setIsSuggesting(false);
    }
  };

  const handleAssessJob = async () => {
    if (!jobDescription.trim()) return;
    
    setIsAssessing(true);
    setImprovementSuggestions(null); // Reset improvements when re-assessing
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

    setCurrentStep(3);
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
                    <button
                        onClick={() => {
                            setIsAssessmentModalOpen(false);
                            setImprovementSuggestions(null);
                        }}
                        className="p-1 text-slate-400 rounded-full hover:bg-slate-100 hover:text-slate-600"
                        aria-label={t('test_shared.closeButton')}
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <div className="flex-grow p-6 overflow-y-auto space-y-6">
                    <section>
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">{t('jobAssessment.summary')}</h3>
                        <p className="text-base text-slate-600 bg-slate-50 p-3 rounded-md">{assessmentResult.roleSummary}</p>
                    </section>
                    <section>
                        <h3 className="text-lg font-semibold text-slate-700 mb-2">{t('jobAssessment.responsibilities')}</h3>
                        <ul className="space-y-2 list-disc list-inside text-slate-600">
                            {assessmentResult.keyResponsibilities.map((item, i) => <li key={i}>{item}</li>)}
                        </ul>
                    </section>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <section>
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">{t('jobAssessment.hardSkills')}</h3>
                            <div className="flex flex-wrap gap-2">
                                {assessmentResult.hardSkills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 text-sm font-medium text-indigo-800 bg-indigo-100 rounded-full">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                        <section>
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">{t('jobAssessment.softSkills')}</h3>
                             <div className="flex flex-wrap gap-2">
                                {assessmentResult.softSkills.map((skill, i) => (
                                    <span key={i} className="px-3 py-1 text-sm font-medium text-emerald-800 bg-emerald-100 rounded-full">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>
                    </div>

                    {isSuggestingImprovements && (
                        <div className="flex flex-col items-center justify-center p-4">
                            <div className="w-8 h-8 border-2 border-dashed rounded-full animate-spin border-indigo-500"></div>
                            <p className="mt-2 text-sm text-slate-500">{t('loader.analyzingText')}</p>
                        </div>
                    )}
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
                    <button
                        onClick={handleSuggestImprovements}
                        disabled={isSuggestingImprovements}
                        className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white transition-colors bg-indigo-500 rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
                    >
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
      <div>
        <label htmlFor="job-description" className="block mb-2 text-lg font-semibold text-slate-800">
          {t('step1.jobDescription')}
        </label>
        <textarea
          id="job-description"
          rows={8}
          className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition-shadow"
          placeholder={t('step1.jobDescriptionPlaceholder')}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <div className="mt-4">
            <button
                onClick={handleAssessJob}
                disabled={isAssessing || !jobDescription.trim()}
                className="flex items-center px-4 py-2 text-sm font-semibold text-white transition-colors bg-teal-500 rounded-md shadow-sm hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
                <LightBulbIcon className={`w-5 h-5 mr-2 ${isAssessing ? 'animate-pulse' : ''}`} />
                {isAssessing ? t('loader.analyzingText') : t('app.buttons.assessJob')}
            </button>
        </div>
      </div>
      <PipelineBuilder />
      <div className="flex justify-end pt-4">
        <button
          onClick={() => setCurrentStep(2)}
          className="px-6 py-3 font-semibold text-white transition-colors bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400"
          disabled={!jobDescription.trim()}
        >
          {t('app.buttons.next')}
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-800">{t('step2.criteria')}</h3>
            <button 
                onClick={handleSuggestCriteria}
                disabled={isSuggesting || !jobDescription.trim()}
                className="flex items-center px-3 py-1.5 text-sm font-semibold text-white transition-colors bg-indigo-500 rounded-md shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
                <SparklesIcon className={`w-4 h-4 mr-2 ${isSuggesting ? 'animate-spin' : ''}`} />
                {isSuggesting ? t('loader.analyzingText') : t('criteria.suggestWithAI')}
            </button>
        </div>
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="space-y-3">
            {criteria.map((c) => (
              <div key={c.id} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-6">
                  <label htmlFor={`criterion-name-${c.id}`} className="sr-only">{t('criteria.name')}</label>
                  <input
                    type="text"
                    id={`criterion-name-${c.id}`}
                    placeholder={t('criteria.namePlaceholder')}
                    value={c.name}
                    onChange={(e) => updateCriterion(c.id, 'name', e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  />
                </div>
                <div className="col-span-5">
                  <label htmlFor={`criterion-weight-${c.id}`} className="sr-only">{t('criteria.weight')}</label>
                  <select
                    id={`criterion-weight-${c.id}`}
                    value={c.weight}
                    onChange={(e) => updateCriterion(c.id, 'weight', parseInt(e.target.value, 10))}
                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 transition-shadow"
                  >
                    <option value="1">1 ({t('criteria.weights.low')})</option>
                    <option value="2">2</option>
                    <option value="3">3 ({t('criteria.weights.medium')})</option>
                    <option value="4">4</option>
                    <option value="5">5 ({t('criteria.weights.high')})</option>
                  </select>
                </div>
                <div className="col-span-1 text-center">
                  <button onClick={() => removeCriterion(c.id)} className="text-slate-400 hover:text-red-600 transition-colors" aria-label={t('criteria.remove')}>
                    <TrashIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={addCriterion} className="flex items-center mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
            <PlusCircleIcon className="w-5 h-5 mr-1" />
            {t('criteria.add')}
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="candidates-cv" className="block mb-2 text-lg font-semibold text-slate-800">
          {t('step2.candidates')}
        </label>
        <textarea
          id="candidates-cv"
          rows={10}
          className="w-full p-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 transition-shadow"
          placeholder={t('step2.candidatesPlaceholder')}
          value={candidatesCv}
          onChange={(e) => setCandidatesCv(e.target.value)}
        />
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={() => setCurrentStep(1)}
          className="px-6 py-3 font-semibold text-slate-700 transition-colors bg-slate-200 rounded-lg hover:bg-slate-300"
        >
          {t('app.buttons.back')}
        </button>
        <button
          onClick={handleAnalyze}
          className="px-6 py-3 font-semibold text-white transition-colors bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
          disabled={isLoading || !candidatesCv.trim()}
        >
          {t('app.analyzeButton')}
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      {isLoading && <Loader />}
      {error && (
        <div className="max-w-3xl p-4 mx-auto mt-8 text-center text-red-800 bg-red-100 border border-red-300 rounded-lg" role="alert">
          <h3 className="font-bold">{t('error.analysisFailed')}</h3>
          <p>{error}</p>
        </div>
      )}
      {rankedCandidates.length > 0 && (
        <div className="mt-8">
          <h2 className="my-8 text-3xl font-bold text-center text-slate-900">{t('app.analysisResultTitle')}</h2>
          {rankedCandidates.map((candidate, index) => (
            <CandidateCard key={candidate.id} candidate={candidate} rank={index + 1} />
          ))}
        </div>
      )}
       <div className="text-center mt-12">
            <button
            onClick={resetState}
            className="px-8 py-3 font-semibold text-white transition-colors bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {t('app.buttons.startOver')}
            </button>
        </div>
    </div>
  );
  
  return (
    <div className="max-w-5xl mx-auto">
        {renderAssessmentModal()}
        <StepIndicator currentStep={currentStep} />
        <div className="p-8 mt-10 bg-white border border-slate-200 rounded-xl shadow-xl">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
        </div>
    </div>
  );
};

export default RecruiterView;