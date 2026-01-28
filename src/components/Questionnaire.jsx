import { questions, scoreLabels } from '../data/questions';
import { useScores } from '../context/ScoreContext';

function ScoreButton({ questionId, scoreValue, isSelected, onSelect }) {
  const scoreInfo = scoreLabels[scoreValue];

  return (
    <button
      className={`score-btn ${isSelected ? 'selected' : ''}`}
      data-score={scoreValue}
      onClick={() => onSelect(questionId, scoreValue)}
      title={`${scoreInfo.label}: ${scoreInfo.description}`}
    >
      {scoreValue}
    </button>
  );
}

function Question({ question, currentScore, onScoreChange }) {
  return (
    <div className="question">
      <div className="question-id">{question.id}</div>
      <div className="question-text">{question.text}</div>
      <div className="score-selector">
        {[0, 1, 3, 5].map((score) => (
          <ScoreButton
            key={score}
            questionId={question.id}
            scoreValue={score}
            isSelected={currentScore === score}
            onSelect={onScoreChange}
          />
        ))}
      </div>
    </div>
  );
}

function AxisSection({ axisData, scores, onScoreChange, axisScore }) {
  return (
    <div className="axis-section">
      <div className="axis-header" style={{ borderLeftColor: axisData.color }}>
        <span className="axis-title">{axisData.axis}</span>
        <span className="axis-score">{axisScore.toFixed(1)}%</span>
      </div>
      <div className="axis-questions">
        {axisData.items.map((question) => (
          <Question
            key={question.id}
            question={question}
            currentScore={scores[question.id]}
            onScoreChange={onScoreChange}
          />
        ))}
      </div>
    </div>
  );
}

export default function Questionnaire() {
  const { scores, setScore, axisScores, answeredQuestionsCount, totalQuestionsCount } = useScores();

  return (
    <div className="questionnaire-tab">
      <div className="instructions">
        <h3>Instructions</h3>
        <ol>
          <li>Évaluez chaque question en cliquant sur le score approprié (0, 1, 3, ou 5)</li>
          <li>Les scores se calculent automatiquement</li>
          <li>Consultez les autres onglets pour voir les résultats détaillés</li>
        </ol>
        <div className="progress-indicator">
          <span className="progress-text">
            Progression: {answeredQuestionsCount} / {totalQuestionsCount} questions
          </span>
          <div className="progress-bar-mini">
            <div
              className="progress-bar-fill"
              style={{ width: `${(answeredQuestionsCount / totalQuestionsCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="legend">
        <h3>Échelle de notation</h3>
        <div className="legend-items">
          {Object.entries(scoreLabels).map(([score, info]) => (
            <div key={score} className="legend-item">
              <div className="legend-score" style={{ backgroundColor: info.color }}>
                {score}
              </div>
              <div className="legend-text">
                <strong>{info.label}</strong>
                <span>{info.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="questions-container">
        {questions.map((axisData) => {
          const axisScoreData = axisScores.find((a) => a.axisId === axisData.axisId);
          return (
            <AxisSection
              key={axisData.axisId}
              axisData={axisData}
              scores={scores}
              onScoreChange={setScore}
              axisScore={axisScoreData?.score || 0}
            />
          );
        })}
      </div>
    </div>
  );
}
