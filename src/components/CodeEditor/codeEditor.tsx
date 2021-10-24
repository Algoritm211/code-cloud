import React, {useRef} from 'react';
import MonacoEditor, {OnMount} from '@monaco-editor/react';
import prettier from 'prettier';
import parser from "prettier/parser-babel";
import './codeEditor.css'

interface CodeEditorProps {
  initialValue: string
  onChange: (value: string | undefined) => void
}

const CodeEditor: React.FC<CodeEditorProps> = ({initialValue, onChange}) => {
  const editorRef = useRef<any>(null)

  const onEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor
  }

  const onFormatCode = () => {
    const unformatted = editorRef.current.getModel().getValue();

    const formattedCode = prettier.format(unformatted, {
      parser: 'babel',
      plugins: [parser],
      singleQuote: true,
      semi: true,
      tabWidth: 2
    })

    editorRef.current.setValue(formattedCode);
  }

  return (
    <div className='editor-wrapper'>
      <button
        className='format-btn button is-primary'
        onClick={onFormatCode}>
        Format code
      </button>
      <MonacoEditor
        onMount={onEditorDidMount}
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
    </div>
  );
};

export default CodeEditor;
