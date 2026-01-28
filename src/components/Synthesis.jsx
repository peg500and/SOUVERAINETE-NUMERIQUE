import DoughnutChart from './Charts/DoughnutChart';
import GaugeChart from './Charts/GaugeChart';
import { useScores } from '../context/ScoreContext';
import { idtInterpretation } from '../data/questions';

export default function Synthesis() {
  const {
    globalScore,
    idt,
    idtLevel,
    axisScores,
    answeredQuestionsCount,
    totalQuestionsCount,
    exportResults
  } = useScores();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="synthesis-tab">
      <h2>Synthèse & Indice de Dépendance Technologique</h2>

      <div className="synthesis-main-cards">
        <div className="main-card global-card">
          <div className="card-icon">📊</div>
          <div className="card-label">Score Global MDT</div>
          <div className="card-value">{globalScore.toFixed(1)}%</div>
          <div className="card-sublabel">Résilience globale</div>
        </div>

        <div className="main-card idt-card">
          <div className="card-icon">{idtLevel.emoji}</div>
          <div className="card-label">Indice de Dépendance Technologique (IDT)</div>
          <div className="card-value" style={{ color: idtLevel.color }}>
            {idt.toFixed(1)}
          </div>
          <div
            className="card-interpretation"
            style={{ backgroundColor: idtLevel.color }}
          >
            {idtLevel.level} - {idtLevel.description}
          </div>
        </div>
      </div>

      <div className="charts-row">
        <DoughnutChart />
        <GaugeChart />
      </div>

      <div className="summary-section">
        <h3>Résumé par Axe</h3>
        <div className="summary-table">
          <table>
            <thead>
              <tr>
                <th>Axe de Dépendance</th>
                <th>Score</th>
                <th>Progression</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {axisScores.map((axis) => (
                <tr key={axis.axisId}>
                  <td>
                    <span
                      className="axis-indicator"
                      style={{ backgroundColor: axis.color }}
                    />
                    {axis.axis}
                  </td>
                  <td className="score-cell">{axis.score.toFixed(1)}%</td>
                  <td>
                    <div className="table-progress">
                      <div
                        className="table-progress-fill"
                        style={{
                          width: `${axis.score}%`,
                          backgroundColor: axis.color
                        }}
                      />
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        axis.answeredCount === axis.totalQuestions
                          ? 'complete'
                          : 'incomplete'
                      }`}
                    >
                      {axis.answeredCount}/{axis.totalQuestions}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="interpretation-section">
        <h3>Échelle d'interprétation IDT</h3>
        <div className="scale-items">
          {idtInterpretation.map((level) => (
            <div
              key={level.level}
              className={`scale-item ${idt >= level.min && idt <= level.max ? 'active' : ''}`}
            >
              <div className="scale-range">IDT {level.min}-{level.max}</div>
              <div className="scale-indicator" style={{ backgroundColor: level.color }}>
                {level.emoji}
              </div>
              <div className="scale-info">
                <div className="scale-level">{level.level}</div>
                <div className="scale-desc">{level.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="completion-info">
        <div className="completion-card">
          <span className="completion-label">Questionnaire complété à</span>
          <span className="completion-value">
            {((answeredQuestionsCount / totalQuestionsCount) * 100).toFixed(0)}%
          </span>
          <span className="completion-detail">
            ({answeredQuestionsCount} / {totalQuestionsCount} questions)
          </span>
        </div>
      </div>

      <div className="export-section">
        <button className="export-btn" onClick={exportResults}>
          <span className="btn-icon">📥</span>
          Exporter les résultats (JSON)
        </button>
        <button className="export-btn print-btn" onClick={handlePrint}>
          <span className="btn-icon">🖨️</span>
          Imprimer le rapport
        </button>
      </div>
    </div>
  );
}
