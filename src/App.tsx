import React from 'react';
import './App.css';
import CodeCell from "./components/CodeCell/CodeCell";

const App: React.FC = () => {
  return (
    <>
      <h1>Code cloud</h1>
      <CodeCell />
      <CodeCell />
    </>
  );
}

export default App;
