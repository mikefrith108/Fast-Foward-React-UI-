import React from 'react';
import logo from './logo.svg';
import './App.css';
import WireframeUI from './WireframeUI';

function App() {
  return (
    <div className="App">
      <WireframeUI />
      <div className="twine-download">
        <p>Download Twine to view your generated story:</p>
        <a href="https://twinery.org/">https://twinery.org/</a>
      </div>
    </div>
  );
}

export default App;

