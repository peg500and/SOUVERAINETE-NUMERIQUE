import KPIBarChart from './Charts/KPIBarChart';
import { useScores } from '../context/ScoreContext';

function getScoreColor(score) {
  if (score === null) return '#6c757d';
  if (score >= 80) return '#28a745';
  if (score >= 60) return '#17a2b8';
  if (score >= 40) return '#ffc107';
  if (score >= 20) return '#fd7e14';
  return '#dc3545';
}

function getScoreLabel(score) {
  if (score === null) return 'Non renseigné';
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Bon';
  if (score >= 40) return 'Moyen';
  if (score >= 20) return 'Faible';
  return 'Critique';
}

export default function KPI() {
  const { kpiScores } = useScores();

  return (
    <div className="kpi-tab">
      <h2>Indicateurs Clés de Performance</h2>

      <div className="kpi-chart-section">
        <KPIBarChart />
      </div>

      <div className="kpi-grid">
        {kpiScores.map((kpi) => (
          <div
            key={kpi.id}
            className="kpi-card"
            style={{ borderLeftColor: getScoreColor(kpi.score) }}
          >
            <div className="kpi-header">
              <span className="kpi-id">{kpi.id}</span>
              <span
                className="kpi-badge"
                style={{ backgroundColor: getScoreColor(kpi.score) }}
              >
                {getScoreLabel(kpi.score)}
              </span>
            </div>
            <div className="kpi-title">{kpi.title}</div>
            <div className="kpi-description">{kpi.description}</div>
            <div className="kpi-footer">
              <div className="kpi-value" style={{ color: getScoreColor(kpi.score) }}>
                {kpi.score !== null ? `${kpi.score.toFixed(1)}%` : 'N/A'}
              </div>
              <div className="kpi-questions">
                {kpi.answeredCount}/{kpi.totalQuestions} questions
              </div>
            </div>
            <div className="kpi-progress-bar">
              <div
                className="kpi-progress-fill"
                style={{
                  width: `${kpi.score ?? 0}%`,
                  backgroundColor: getScoreColor(kpi.score)
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
