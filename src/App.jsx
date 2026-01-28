import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import UgaiaLogo from './components/UgaiaLogo';

// Données pour les graphiques
const securityData = [
  { month: 'Jan', threats: 120, blocked: 118, incidents: 2 },
  { month: 'Fév', threats: 98, blocked: 96, incidents: 2 },
  { month: 'Mar', threats: 156, blocked: 155, incidents: 1 },
  { month: 'Avr', threats: 134, blocked: 132, incidents: 2 },
  { month: 'Mai', threats: 189, blocked: 188, incidents: 1 },
  { month: 'Juin', threats: 145, blocked: 145, incidents: 0 },
];

const sovereigntyScore = [
  { name: 'Infrastructure', score: 85, fullMark: 100 },
  { name: 'Données', score: 92, fullMark: 100 },
  { name: 'Applications', score: 78, fullMark: 100 },
  { name: 'Réseau', score: 88, fullMark: 100 },
  { name: 'Identité', score: 95, fullMark: 100 },
  { name: 'Conformité', score: 82, fullMark: 100 },
];

const dataLocation = [
  { name: 'France', value: 65, color: '#29B6F6' },
  { name: 'Europe', value: 25, color: '#66BB6A' },
  { name: 'International', value: 10, color: '#FF6B35' },
];

const complianceData = [
  { category: 'RGPD', score: 94 },
  { category: 'NIS2', score: 87 },
  { category: 'SecNumCloud', score: 92 },
  { category: 'ISO 27001', score: 89 },
  { category: 'HDS', score: 85 },
];

const trafficData = [
  { time: '00:00', incoming: 2400, outgoing: 1800 },
  { time: '04:00', incoming: 1398, outgoing: 1200 },
  { time: '08:00', incoming: 5800, outgoing: 4200 },
  { time: '12:00', incoming: 7890, outgoing: 5600 },
  { time: '16:00', incoming: 6390, outgoing: 4800 },
  { time: '20:00', incoming: 4490, outgoing: 3200 },
];

function App() {
  return (
    <div className="dashboard">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <UgaiaLogo size={50} />
          <div className="header-title">
            <h1>UGAIA</h1>
            <p>Dashboard Souveraineté Numérique</p>
          </div>
        </div>
        <div className="header-right">
          <div className="status-badge">
            <span className="status-dot"></span>
            Système Opérationnel
          </div>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="kpi-container">
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: '#29B6F6' }}>🛡️</div>
          <div className="kpi-content">
            <span className="kpi-value">99.8%</span>
            <span className="kpi-label">Taux de Protection</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: '#66BB6A' }}>📊</div>
          <div className="kpi-content">
            <span className="kpi-value">90%</span>
            <span className="kpi-label">Données en France</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: '#FF6B35' }}>⚡</div>
          <div className="kpi-content">
            <span className="kpi-value">8</span>
            <span className="kpi-label">Incidents (6 mois)</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon" style={{ background: '#AB47BC' }}>✓</div>
          <div className="kpi-content">
            <span className="kpi-value">89%</span>
            <span className="kpi-label">Score Conformité</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Security Trends */}
        <div className="chart-card">
          <h3>Menaces & Protection</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={securityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="threats"
                stackId="1"
                stroke="#FF6B35"
                fill="#FF6B35"
                fillOpacity={0.3}
                name="Menaces détectées"
              />
              <Area
                type="monotone"
                dataKey="blocked"
                stackId="2"
                stroke="#29B6F6"
                fill="#29B6F6"
                fillOpacity={0.6}
                name="Menaces bloquées"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sovereignty Radar */}
        <div className="chart-card">
          <h3>Score de Souveraineté</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={sovereigntyScore}>
              <PolarGrid stroke="#e0e0e0" />
              <PolarAngleAxis dataKey="name" tick={{ fill: '#666', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#666' }} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#29B6F6"
                fill="#29B6F6"
                fillOpacity={0.5}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Data Location Pie */}
        <div className="chart-card">
          <h3>Localisation des Données</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dataLocation}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {dataLocation.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Compliance Bar Chart */}
        <div className="chart-card">
          <h3>Conformité Réglementaire</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={complianceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis type="number" domain={[0, 100]} stroke="#666" />
              <YAxis dataKey="category" type="category" stroke="#666" width={80} />
              <Tooltip />
              <Bar dataKey="score" fill="#29B6F6" radius={[0, 4, 4, 0]}>
                {complianceData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.score >= 90 ? '#66BB6A' : entry.score >= 80 ? '#29B6F6' : '#FF6B35'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Network Traffic */}
        <div className="chart-card wide">
          <h3>Trafic Réseau (24h)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="incoming"
                stroke="#29B6F6"
                strokeWidth={2}
                dot={{ fill: '#29B6F6' }}
                name="Entrant (MB/s)"
              />
              <Line
                type="monotone"
                dataKey="outgoing"
                stroke="#FF6B35"
                strokeWidth={2}
                dot={{ fill: '#FF6B35' }}
                name="Sortant (MB/s)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>UGAIA - Souveraineté Numérique © 2026 | P. Erol GIRAUDY</p>
      </footer>
    </div>
  );
}

export default App;
