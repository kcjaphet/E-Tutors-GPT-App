
import React from 'react';
import { ToneSelectProps } from './types';

const ToneSelect: React.FC<ToneSelectProps> = ({ tone, setTone }) => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="tone" className="text-sm font-medium">
        Adjust tone to:
      </label>
      <select
        id="tone"
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-ring"
      >
        <option value="professional">Professional</option>
        <option value="casual">Casual</option>
        <option value="friendly">Friendly</option>
        <option value="formal">Formal</option>
        <option value="persuasive">Persuasive</option>
        <option value="enthusiastic">Enthusiastic</option>
      </select>
    </div>
  );
};

export default ToneSelect;
