import React, {useState} from 'react';
import './App.css';
import CodeEditor from "./components/codeEditor/codeEditor";
import Preview from "./components/Preview/Preview";
import {bundler} from "./codeBundler/bundler";

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [bundledCode, setBundledCode] = useState('')

  const onSubmitCode = async () => {
    const bundledCode = await bundler(input);
    setBundledCode(bundledCode);
  }

  const onInputChange = (value: string | undefined) => {
    if (value) {
      setInput(value)
    }
  }

  return (
    <div className='container'>
      <h1>Code cloud</h1>
      <CodeEditor
        onChange={onInputChange}
        initialValue='const author = `Alexey`;'
      />
      <div>
        <button onClick={onSubmitCode}>
          Submit
        </button>
      </div>
      <Preview code={bundledCode} />
    </div>
  );
}

export default App;
