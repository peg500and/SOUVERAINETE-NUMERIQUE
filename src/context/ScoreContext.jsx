import { createContext, useContext, useState, useMemo } from 'react';
import { questions, idtInterpretation, kpiDefinitions } from '../data/questions';

const ScoreContext = createContext();

export function ScoreProvider({ children }) {
  const [scores, setScores] = useState({});

  const setScore = (questionId, score) => {
    setScores(prev => ({ ...prev, [questionId]: score }));
  };

  const axisScores = useMemo(() => {
    return questions.map(axis => {
      let total = 0;
      let count = 0;

      axis.items.forEach(question => {
        if (scores[question.id] !== undefined) {
          total += scores[question.id];
          count++;
        }
      });

      const percentage = count > 0 ? (total / (count * 5)) * 100 : 0;
      const answeredCount = count;
      const totalQuestions = axis.items.length;

      return {
        axis: axis.axis,
        axisId: axis.axisId,
        color: axis.color,
        score: percentage,
        answeredCount,
        totalQuestions,
        rawScore: total,
        maxPossible: count * 5
      };
    });
  }, [scores]);

  const globalScore = useMemo(() => {
    let totalScore = 0;
    let totalQuestions = 0;

    questions.forEach(axis => {
      axis.items.forEach(question => {
        if (scores[question.id] !== undefined) {
          totalScore += scores[question.id];
          totalQuestions++;
        }
      });
    });

    return totalQuestions > 0 ? (totalScore / (totalQuestions * 5)) * 100 : 0;
  }, [scores]);

  const idt = useMemo(() => {
    return 100 - globalScore;
  }, [globalScore]);

  const idtLevel = useMemo(() => {
    return idtInterpretation.find(level => idt >= level.min && idt <= level.max) || idtInterpretation[0];
  }, [idt]);

  const kpiScores = useMemo(() => {
    return kpiDefinitions.map(kpi => {
      let total = 0;
      let count = 0;

      kpi.questions.forEach(qId => {
        if (scores[qId] !== undefined) {
          total += scores[qId];
          count++;
        }
      });

      const percentage = count > 0 ? (total / (count * 5)) * 100 : null;

      return {
        ...kpi,
        score: percentage,
        answeredCount: count,
        totalQuestions: kpi.questions.length
      };
    });
  }, [scores]);

  const answeredQuestionsCount = useMemo(() => {
    return Object.keys(scores).length;
  }, [scores]);

  const totalQuestionsCount = useMemo(() => {
    return questions.reduce((acc, axis) => acc + axis.items.length, 0);
  }, []);

  const exportResults = () => {
    const data = {
      date: new Date().toISOString(),
      version: 'IRN v0.4',
      scores,
      axisScores: axisScores.map(a => ({
        axis: a.axis,
        score: a.score.toFixed(1) + '%',
        answered: `${a.answeredCount}/${a.totalQuestions}`
      })),
      kpiScores: kpiScores.map(k => ({
        id: k.id,
        title: k.title,
        score: k.score !== null ? k.score.toFixed(1) + '%' : 'N/A'
      })),
      summary: {
        globalScore: globalScore.toFixed(1) + '%',
        idt: idt.toFixed(1),
        idtLevel: idtLevel.level,
        interpretation: idtLevel.description,
        answeredQuestions: `${answeredQuestionsCount}/${totalQuestionsCount}`
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MDT_Results_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const value = {
    scores,
    setScore,
    axisScores,
    globalScore,
    idt,
    idtLevel,
    kpiScores,
    answeredQuestionsCount,
    totalQuestionsCount,
    exportResults
  };

  return (
    <ScoreContext.Provider value={value}>
      {children}
    </ScoreContext.Provider>
  );
}

export function useScores() {
  const context = useContext(ScoreContext);
  if (!context) {
    throw new Error('useScores must be used within a ScoreProvider');
  }
  return context;
}
