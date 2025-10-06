import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Candidate } from '../types';
import { BriefcaseIcon, AcademicCapIcon, LightBulbIcon, ChevronDownIcon } from './icons';

interface CandidateCardProps {
  candidate: Candidate;
  rank: number;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-red-500';
};
const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, rank }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="w-full max-w-4xl p-6 mx-auto mt-6 bg-white border border-slate-200 rounded-xl shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            <span className="text-indigo-600">#{rank}</span> {candidate.name}
          </h2>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-slate-500">{t('candidateCard.overallScore')}</div>
          <div className="text-3xl font-bold text-indigo-600">{candidate.overallScore.toFixed(1)}</div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-700 border-b border-slate-200 pb-2">{t('candidateCard.scoreBreakdown')}</h3>
        {candidate.scores.map((item) => (
          <div key={item.criterionName}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-base font-medium text-slate-800">{item.criterionName}</span>
              <span className={`text-base font-bold ${getScoreTextColor(item.score)}`}>{item.score}</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${getScoreColor(item.score)}`}
                style={{ width: `${item.score}%` }}
              ></div>
            </div>
             <p className="mt-1 text-sm text-slate-600 italic">
                <span className="font-semibold">{t('candidateCard.justification')}:</span> {item.justification}
            </p>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center px-4 py-2 text-sm font-semibold text-indigo-600 transition-colors border border-indigo-200 rounded-full hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isExpanded ? t('candidateCard.showLess') : t('candidateCard.showMore')}
          <ChevronDownIcon className={`w-5 h-5 ml-2 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isExpanded && (
        <div className="mt-6 space-y-8 border-t border-slate-200 pt-6 animate-fade-in">
          {candidate.workExperience && candidate.workExperience.length > 0 && (
            <section>
              <h3 className="flex items-center text-xl font-semibold text-slate-800 mb-4">
                <BriefcaseIcon className="w-6 h-6 mr-3 text-indigo-600" />
                {t('candidateCard.workExperience')}
              </h3>
              <div className="space-y-6 border-l-2 border-slate-200 ml-3 pl-8">
                {candidate.workExperience.map((exp, index) => (
                  <div key={index} className="relative">
                    <div className="absolute w-4 h-4 bg-slate-300 rounded-full -left-[42px] top-1.5 border-4 border-white"></div>
                    <p className="font-bold text-slate-800 text-lg">{exp.jobTitle}</p>
                    <p className="text-sm font-medium text-indigo-600">{exp.company}</p>
                    <p className="text-xs text-slate-500 mb-2">{exp.dates}</p>
                    <p className="text-base text-slate-600">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {candidate.education && candidate.education.length > 0 && (
             <section>
              <h3 className="flex items-center text-xl font-semibold text-slate-800 mb-4">
                <AcademicCapIcon className="w-6 h-6 mr-3 text-indigo-600" />
                {t('candidateCard.education')}
              </h3>
              <div className="space-y-3 pl-9">
                {candidate.education.map((edu, index) => (
                  <div key={index}>
                     <p className="font-bold text-slate-800">{edu.degree}</p>
                     <p className="text-sm font-medium text-indigo-600">{edu.institution}</p>
                     <p className="text-xs text-slate-500">{edu.dates}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {candidate.skills && candidate.skills.length > 0 && (
             <section>
              <h3 className="flex items-center text-xl font-semibold text-slate-800 mb-4">
                <LightBulbIcon className="w-6 h-6 mr-3 text-indigo-600" />
                {t('candidateCard.skills')}
              </h3>
              <div className="flex flex-wrap gap-2 pl-9">
                {candidate.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 text-sm font-medium text-indigo-800 bg-indigo-100 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default CandidateCard;