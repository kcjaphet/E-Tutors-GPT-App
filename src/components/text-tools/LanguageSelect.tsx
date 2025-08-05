
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSelectProps } from './types';

const LanguageSelect: React.FC<LanguageSelectProps> = ({ language, setLanguage }) => {
  const { t } = useTranslation();
  
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="language" className="text-sm font-medium">
        {t('language.translateTo')}
      </label>
      <select
        id="language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-ring"
      >
        <option value="Spanish">{t('language.spanish')}</option>
        <option value="French">{t('language.french')}</option>
        <option value="German">{t('language.german')}</option>
        <option value="Italian">{t('language.italian')}</option>
        <option value="Portuguese">{t('language.portuguese')}</option>
        <option value="Japanese">{t('language.japanese')}</option>
        <option value="Chinese">{t('language.chinese')}</option>
      </select>
    </div>
  );
};

export default LanguageSelect;
