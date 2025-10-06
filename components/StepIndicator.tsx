import React from 'react';
import { useTranslation } from 'react-i18next';
import { ClipboardDocumentListIcon, UsersIcon, ChartBarSquareIcon } from './icons';

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const { t } = useTranslation();
  const steps = [
    { id: 1, name: t('app.steps.step1'), icon: ClipboardDocumentListIcon },
    { id: 2, name: t('app.steps.step2'), icon: UsersIcon },
    { id: 3, name: t('app.steps.step3'), icon: ChartBarSquareIcon },
  ];

  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'flex-1' : ''}`}>
            {step.id < currentStep ? (
              // Completed Step
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-indigo-600" />
                </div>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600">
                  <step.icon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <span className="absolute -bottom-7 w-max -translate-x-1/2 left-1/2 text-center text-xs font-semibold text-indigo-600">{step.name}</span>
              </>
            ) : step.id === currentStep ? (
              // Current Step
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-slate-200" />
                </div>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-600 bg-white">
                  <step.icon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
                </div>
                 <span className="absolute -bottom-7 w-max -translate-x-1/2 left-1/2 text-center text-xs font-semibold text-indigo-600">{step.name}</span>
              </>
            ) : (
              // Upcoming Step
              <>
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="h-0.5 w-full bg-slate-200" />
                </div>
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-300 bg-white">
                  <step.icon className="h-6 w-6 text-slate-400" aria-hidden="true" />
                </div>
                <span className="absolute -bottom-7 w-max -translate-x-1/2 left-1/2 text-center text-xs font-medium text-slate-500">{step.name}</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default StepIndicator;