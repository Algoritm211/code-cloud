import React from 'react';
import MonacoEditor from '@monaco-editor/react';

interface CodeEditorProps {
  initialValue: string
  onChange: (value: string | undefined) => void
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  initialValue,
  onChange
  }) => {

  return (
    <MonacoEditor
      onChange={onChange}
      value={initialValue}
      theme='vs-dark'
      language='javascript'
      height='400px'
      options={{
        wordWrap: 'on',
        fontSize: 16,
        minimap: {enabled: false},
        folding: false,
        lineNumbersMinChars: 2,
        tabSize: 2
      }}
    />
  );
};

export default CodeEditor;
