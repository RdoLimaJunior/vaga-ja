import React from 'react';
import { useTranslation } from 'react-i18next';

interface CultureData {
    pace: number;
    structure: number;
    collaboration: number;
    communication: number;
    focus: number;
}

interface CultureMappingFormProps {
    cultureData: CultureData;
    onCultureDataChange: (field: keyof CultureData, value: number) => void;
}

const CultureSlider: React.FC<{
    label: string;
    leftEnd: string;
    rightEnd: string;
    value: number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, leftEnd, rightEnd, value, onChange }) => (
    <div>
        <label className="block text-lg font-semibold text-slate-800 mb-2">{label}</label>
        <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-500 w-24 text-right">{leftEnd}</span>
            <input
                type="range"
                min="1"
                max="100"
                value={value}
                onChange={onChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="text-sm font-medium text-slate-500 w-24 text-left">{rightEnd}</span>
        </div>
    </div>
);

const CultureMappingForm: React.FC<CultureMappingFormProps> = ({ cultureData, onCultureDataChange }) => {
    const { t } = useTranslation();

    const sliders = [
        { key: 'pace', label: t('cultureMapping.pace'), ends: t('cultureMapping.pace_ends', { returnObjects: true }) },
        { key: 'structure', label: t('cultureMapping.structure'), ends: t('cultureMapping.structure_ends', { returnObjects: true }) },
        { key: 'collaboration', label: t('cultureMapping.collaboration'), ends: t('cultureMapping.collaboration_ends', { returnObjects: true }) },
        { key: 'communication', label: t('cultureMapping.communication'), ends: t('cultureMapping.communication_ends', { returnObjects: true }) },
        { key: 'focus', label: t('cultureMapping.focus'), ends: t('cultureMapping.focus_ends', { returnObjects: true }) },
    ] as const;


    return (
        <section className="animate-fade-in space-y-8">
            <div className="text-center">
                 <h2 className="text-2xl font-bold text-slate-800">{t('step3_culture.title')}</h2>
                 <p className="mt-2 text-slate-600 max-w-2xl mx-auto">{t('step3_culture.description')}</p>
            </div>
           
            <div className="p-8 space-y-8 bg-slate-50 border border-slate-200 rounded-lg">
                {sliders.map(slider => {
                    // Fix: The return type of `t` with `returnObjects: true` is not specific enough.
                    // Cast the `ends` object to the expected shape to allow property access.
                    const ends = slider.ends as { left: string; right: string; };
                    return (
                        <CultureSlider
                            key={slider.key}
                            label={slider.label}
                            leftEnd={ends.left}
                            rightEnd={ends.right}
                            value={cultureData[slider.key]}
                            onChange={(e) => onCultureDataChange(slider.key, parseInt(e.target.value, 10))}
                        />
                    );
                })}
            </div>
        </section>
    );
};

export default CultureMappingForm;
