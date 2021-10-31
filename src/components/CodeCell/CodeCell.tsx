import React, {useEffect, useState} from 'react';
import {bundler} from "../../codeBundler/bundler";
import CodeEditor from "../CodeEditor/codeEditor";
import Preview from "../Preview/Preview";
import Resizable from "../Resizable/Resizable";

const CodeCell = () => {
  const [input, setInput] = useState('');
  const [bundledCode, setBundledCode] = useState('')
  const [bundleError, setBundleError] = useState('')

  useEffect(() => {
    const timer = setTimeout(async () => {
      const bundleObj = await bundler(input);
      setBundledCode(bundleObj.code);
      setBundleError(bundleObj.error);
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [input])

  const onInputChange = (value: string | undefined) => {
    if (value) {
      setInput(value)
    }
  }

  return (
    <Resizable direction='vertical'>
      <div style={{height: '100%', display: 'flex'}}>
        <Resizable direction='horizontal'>
          <CodeEditor
            onChange={onInputChange}
            initialValue='const author = `Alexey`;'
          />
        </Resizable>
        <Preview
          bundleError={bundleError}
          code={bundledCode} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
