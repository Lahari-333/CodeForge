import React from 'react';
import { LANGUAGES } from '../constants/languages';

const LanguageSelector = ({ selectedLanguage, onSelectLanguage, disabled = false }) => {
  return (
    <div className="flex items-center gap-1.5 p-1 bg-[#0A0E17] border border-slate-800 rounded-xl">
      {LANGUAGES.map((lang) => {
        const isSelected = selectedLanguage === lang.id;
        return (
          <button
            key={lang.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectLanguage(lang.id)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              isSelected
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {lang.name}
            <span className="ml-1 text-[10px] opacity-70 font-mono">({lang.version})</span>
          </button>
        );
      })}
    </div>
  );
};

export default LanguageSelector;
