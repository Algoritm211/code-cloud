import React, {useEffect, useRef} from 'react';
import './preview.css'

interface IPreviewProps {
  code: string
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

const Preview: React.FC<IPreviewProps> = ({code}) => {
  const iframeRef = useRef<any>();

  useEffect(() => {
    iframeRef.current.srcdoc = iframeCodeRunnerTemplate
    // Timeout for initializing srcdoc (previous line of code)
    // srcDoc doesn't have enough time for initialize and user can't
    // see visual side of code (srcDoc didn't have enough time to initialize html structure and set listeners)
    setTimeout(() => {
      iframeRef
        .current
        .contentWindow
        .postMessage(code, '*')
    }, 125)
  }, [code])

  return (
    <div className='preview-wrapper'>
      <iframe
        ref={iframeRef}
        style={{backgroundColor: 'white'}}
        title='run_jsx'
        // srcDoc={iframeCodeRunnerTemplate}
        sandbox='allow-scripts'
      />
    </div>
  );
};

export default Preview;

