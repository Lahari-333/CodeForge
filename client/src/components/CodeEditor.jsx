import React from 'react';
import Editor from '@monaco-editor/react';
import { LANGUAGES } from '../constants/languages';

const CodeEditor = ({ language, value, onChange, readOnly = false, height = '100%' }) => {
  const langConfig = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];

  const handleEditorChange = (val) => {
    if (onChange) {
      onChange(val || '');
    }
  };

  return (
    <div className="w-full h-full min-h-[300px] border border-slate-800/80 rounded-xl overflow-hidden bg-[#1E1E1E]">
      <Editor
        height={height}
        language={langConfig.monacoLang}
        value={value}
        theme="vs-dark"
        onChange={handleEditorChange}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
          fontLigatures: true,
          lineNumbers: 'on',
          roundedSelection: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          padding: { top: 12, bottom: 12 },
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          renderLineHighlight: 'all',
          cursorBlinking: 'smooth',
          smoothScrolling: true
        }}
      />
    </div>
  );
};

export default CodeEditor;
