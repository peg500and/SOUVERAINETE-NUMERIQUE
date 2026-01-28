import RadarChart from './Charts/RadarChart';
import BarChart from './Charts/BarChart';
import ProgressChart from './Charts/ProgressChart';
import { useScores } from '../context/ScoreContext';

export default function Scoring() {
  const { axisScores, globalScore } = useScores();

  return (
    <div className="scoring-tab">
      <h2>Scoring Automatique</h2>

      <div className="global-score-banner">
        <div className="global-score-label">Score Global de Résilience</div>
        <div className="global-score-value">{globalScore.toFixed(1)}%</div>
      </div>

      <div className="charts-grid">
        <RadarChart />
        <BarChart />
        <ProgressChart />
      </div>

      <div className="axis-scores-cards">
        <h3>Détail par Axe</h3>
        <div className="scores-grid">
          {axisScores.map((axis) => (
            <div
              key={axis.axisId}
              className="score-card"
              style={{ borderTopColor: axis.color }}
            >
              <div className="score-card-header">
                <span className="score-card-title">{axis.axis}</span>
              </div>
              <div className="score-card-value" style={{ color: axis.color }}>
                {axis.score.toFixed(1)}%
              </div>
              <div className="score-card-progress">
                <div className="score-card-bar">
                  <div
                    className="score-card-fill"
                    style={{
                      width: `${axis.score}%`,
                      backgroundColor: axis.color
                    }}
                  />
                </div>
                <span className="score-card-count">
                  {axis.answeredCount}/{axis.totalQuestions} questions
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
