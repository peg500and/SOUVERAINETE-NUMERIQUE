const tabs = [
  { id: 'questionnaire', label: 'Questionnaire', icon: '📝' },
  { id: 'scoring', label: 'Scoring', icon: '📈' },
  { id: 'kpi', label: 'KPI', icon: '🎯' },
  { id: 'synthese', label: 'Synthèse', icon: '📊' }
];

export default function Tabs({ activeTab, setActiveTab }) {
  return (
    <nav className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span className="tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
