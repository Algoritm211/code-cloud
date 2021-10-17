import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import * as esbuild from 'esbuild-wasm';
import {unpkgPathPlugin} from "./plugins/unpkg-path-plugin";
import {loadFilePlugin} from "./plugins/load-file-plugin";

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const esBuildService = useRef<any>(null);
  const iframeRef = useRef<any>()

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

    iframeRef.current.srcdoc = iframeCodeRunnerTemplate

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

    // setCode(result.outputFiles[0].text)
    iframeRef
      .current
      .contentWindow
      .postMessage(result.outputFiles[0].text, '*')
  }

  const onInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(event.target.value)
  }

  const iframeCodeRunnerTemplate = `
   <html lang='uk'>
    <head>
    <title>Code execution</title>
    <body>
      <div id='root'>
      </div>
      <script>
        window.addEventListener('message', (event) => {
          try {
            eval(event.data);
          } catch (error) {
            const root = document.querySelector('#root');
            root.innerHTML = '<div style="color: red">' +
                              '<h3>Runtime error</h3>' + 
                                error + 
                              '<div>'
            console.error(error)       
          }
        });
      </script>
    </body>
   </html>
  `
  return (
    <div className='container'>
      <h1>Code cloud</h1>
      <textarea
        onChange={onInputChange}
        cols={30}
        rows={10}
      >
      </textarea>
      <button onClick={onSubmitCode}>
        Submit code
      </button>
      <iframe
        ref={iframeRef}
        title='run_jsx'
        srcDoc={iframeCodeRunnerTemplate}
        sandbox='allow-scripts'
        src='/test.html'
      />
    </div>
  );
}

export default App;
