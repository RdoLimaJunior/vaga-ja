import React from 'react';
import { useTranslation } from 'react-i18next';

const Loader: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-600"></div>
      <p className="mt-4 text-lg font-semibold text-slate-700">{t('loader.analyzingText')}</p>
      <p className="text-sm text-slate-500">{t('loader.waitText')}</p>
    </div>
  );
};

export default Loader;