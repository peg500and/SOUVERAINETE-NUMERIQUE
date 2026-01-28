import { useScores } from '../../context/ScoreContext';

export default function ProgressChart() {
  const { answeredQuestionsCount, totalQuestionsCount, axisScores } = useScores();
  const progressPercent = (answeredQuestionsCount / totalQuestionsCount) * 100;

  return (
    <div className="chart-container progress-chart">
      <h3>Progression du Questionnaire</h3>
      <div className="progress-overview">
        <div className="progress-circle-container">
          <svg viewBox="0 0 36 36" className="progress-circle">
            <path
              className="progress-circle-bg"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="progress-circle-fill"
              strokeDasharray={`${progressPercent}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.5" className="progress-circle-text">
              {Math.round(progressPercent)}%
            </text>
          </svg>
        </div>
        <div className="progress-stats">
          <div className="progress-stat">
            <span className="stat-value">{answeredQuestionsCount}</span>
            <span className="stat-label">Questions répondues</span>
          </div>
          <div className="progress-stat">
            <span className="stat-value">{totalQuestionsCount}</span>
            <span className="stat-label">Total questions</span>
          </div>
        </div>
      </div>

      <div className="axis-progress-list">
        {axisScores.map((axis) => (
          <div key={axis.axisId} className="axis-progress-item">
            <div className="axis-progress-header">
              <span className="axis-name">{axis.axis}</span>
              <span className="axis-count">{axis.answeredCount}/{axis.totalQuestions}</span>
            </div>
            <div className="axis-progress-bar">
              <div
                className="axis-progress-fill"
                style={{
                  width: `${(axis.answeredCount / axis.totalQuestions) * 100}%`,
                  backgroundColor: axis.color
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
