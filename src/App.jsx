import { useState } from 'react';
import { ScoreProvider } from './context/ScoreContext';
import Header from './components/Header';
import Tabs from './components/Tabs';
import Questionnaire from './components/Questionnaire';
import Scoring from './components/Scoring';
import KPI from './components/KPI';
import Synthesis from './components/Synthesis';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('questionnaire');

  return (
    <ScoreProvider>
      <div className="app">
        <div className="container">
          <Header />
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="content">
            {activeTab === 'questionnaire' && <Questionnaire />}
            {activeTab === 'scoring' && <Scoring />}
            {activeTab === 'kpi' && <KPI />}
            {activeTab === 'synthese' && <Synthesis />}
          </main>
        </div>
      </div>
    </ScoreProvider>
  );
}

export default App;
