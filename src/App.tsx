import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import * as esbuild from 'esbuild-wasm';
import {unpkgPathPlugin} from "./plugins/unpkg-path-plugin";
import {loadFilePlugin} from "./plugins/load-file-plugin";
import CodeEditor from "./components/codeEditor/codeEditor";
import Preview from "./components/Preview/Preview";

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [bundledCode, setBundledCode] = useState('')
  const esBuildService = useRef<any>(null);

  const initializeESBuild = async () => {
    if (esBuildService.current !== null) {
      return;
    }
    await esbuild.initialize({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.13.4/esbuild.wasm'
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

    const result = await esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [
        unpkgPathPlugin(),
        loadFilePlugin(input)
      ],
      // For loading all packages in production mode
      // and replace global object to window in browser
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window'
      }
    })

    setBundledCode(result.outputFiles[0].text)
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
      <button onClick={onSubmitCode}>
        Submit
      </button>
      <Preview code={bundledCode} />
    </div>
  );
}

export default App;
