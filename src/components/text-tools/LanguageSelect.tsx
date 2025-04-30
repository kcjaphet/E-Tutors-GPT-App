
import React from 'react';
import { LanguageSelectProps } from './types';

const LanguageSelect: React.FC<LanguageSelectProps> = ({ language, setLanguage }) => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="language" className="text-sm font-medium">
        Translate to:
      </label>
      <select
        id="language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-ring"
      >
        <option value="Spanish">Spanish</option>
        <option value="French">French</option>
        <option value="German">German</option>
        <option value="Italian">Italian</option>
        <option value="Portuguese">Portuguese</option>
        <option value="Japanese">Japanese</option>
        <option value="Chinese">Chinese</option>
      </select>
    </div>
  );
};

export default LanguageSelect;
