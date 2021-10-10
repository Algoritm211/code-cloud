import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import * as esbuild from 'esbuild-wasm';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const esBuildService = useRef<any>(null);

  const initializeESBuild = async () => {
    if (esBuildService.current !== null) {
      return;
    }
    await esbuild.initialize({
      worker: true,
      wasmURL: './esbuild.wasm'
    })
    esBuildService.current = true
  }

  useEffect(() => {
    initializeESBuild()
  }, [])

  const onSubmitCode = async () => {
    if (!esBuildService.current) {
      return alert('Service is not initialized try again in  5 seconds');
    }
    const result = await esbuild.transform(input, {
      target: 'es2015',
      loader: 'jsx',
    })
    setCode(result.code)
  }

  const onInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
  }
  return (
    <div className='container'>
      <h1>Code cloud</h1>
      <textarea
        onChange={onInputChange}
        cols={30}
        rows={10}>
      </textarea>
      <button onClick={onSubmitCode}>
        Submit code
      </button>
      <pre>
        {code}
      </pre>
    </div>
  );
}

export default App;
