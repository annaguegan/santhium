import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Santhium</h1>
        <p>Plateforme sécurisée de transfert de documents médicaux</p>
        <div style={{ marginTop: '2rem' }}>
          <button style={{ margin: '1rem', padding: '1rem 2rem', fontSize: '1.2rem' }}>
            Je suis pharmacien
          </button>
          <button style={{ margin: '1rem', padding: '1rem 2rem', fontSize: '1.2rem' }}>
            Je suis patient
          </button>
        </div>
      </header>
    </div>
  );
}

export default App;