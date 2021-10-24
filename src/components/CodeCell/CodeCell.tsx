import React, {useState} from 'react';
import {bundler} from "../../codeBundler/bundler";
import CodeEditor from "../CodeEditor/codeEditor";
import Preview from "../Preview/Preview";

const CodeCell = () => {
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
};

export default CodeCell;
