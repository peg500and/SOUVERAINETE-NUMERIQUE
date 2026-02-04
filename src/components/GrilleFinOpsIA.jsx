import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function GrilleFinOpsIA() {
  const [scores, setScores] = useState({});
  const [pillarScores, setPillarScores] = useState({
    pillar1: 0,
    pillar2: 0,
    pillar3: 0,
    pillar4: 0
  });
  const [totalScore, setTotalScore] = useState(0);

  const criteria = {
    pillar1: {
      name: "JUSTIFICATION MÉTIER & ROI",
      maxScore: 10,
      color: "bg-blue-900",
      items: [
        { id: "1.1", text: "Le projet répond-il à un besoin métier quantifiable ?" },
        { id: "1.2", text: "Le coût unitaire par transaction/inférence est-il connu et documenté ?" },
        { id: "1.3", text: "Un ROI prévisionnel a-t-il été calculé (avec point mort identifié) ?" },
        { id: "1.4", text: "Un budget plafond (Kill Switch) est-il défini et validé par la direction ?" },
        { id: "1.5", text: "Des KPI de succès métier (au-delà des métriques techniques) sont-ils établis ?" }
      ]
    },
    pillar2: {
      name: "SOBRIÉTÉ TECHNIQUE & ARCHITECTURE",
      maxScore: 12,
      color: "bg-blue-700",
      items: [
        { id: "2.1", text: "Le modèle choisi est-il le plus léger capable de réaliser la tâche (right-sizing) ?" },
        { id: "2.2", text: "Les prompts sont-ils optimisés pour minimiser la consommation de tokens ?" },
        { id: "2.3", text: "L'architecture permet-elle le traitement différé (CPU) plutôt que temps réel (GPU) ?" },
        { id: "2.4", text: "Les données sont-elles nettoyées/compressées avant envoi au modèle ?" },
        { id: "2.5", text: "Une stratégie de cache est-elle implémentée pour réduire les appels redondants ?" },
        { id: "2.6", text: "Le projet privilégie-t-il les SLM locaux (Mistral, PHI-4) aux LLM cloud ?" }
      ]
    },
    pillar3: {
      name: "VISIBILITÉ & GOUVERNANCE",
      maxScore: 12,
      color: "bg-blue-700",
      items: [
        { id: "3.1", text: "Un système de tagging permettant l'isolation budgétaire du projet est-il actif ?" },
        { id: "3.2", text: "Le chef de projet métier reçoit-il et valide-t-il mensuellement les rapports de coûts ?" },
        { id: "3.3", text: "Des alertes automatiques sont-elles configurées en cas de dérive budgétaire ?" },
        { id: "3.4", text: "Les coûts sont-ils ventilés par centre de coût/service/équipe ?" },
        { id: "3.5", text: "Un audit de consommation est-il réalisé au minimum trimestriellement ?" },
        { id: "3.6", text: "Le projet respecte-t-il les contraintes RGPD et de souveraineté des données ?" }
      ]
    },
    pillar4: {
      name: "SCALABILITÉ & ENGAGEMENT",
      maxScore: 10,
      color: "bg-blue-900",
      items: [
        { id: "4.1", text: "Une estimation de consommation à échelle (×10, ×100 utilisateurs) existe-t-elle ?" },
        { id: "4.2", text: "Des Saving Plans ou capacités réservées sont-ils utilisés pour volumes prévisibles ?" },
        { id: "4.3", text: "Le projet peut-il être désactivé sans impacter les services critiques ?" },
        { id: "4.4", text: "Une stratégie de sortie (exit plan) est-elle documentée en cas d'échec ?" },
        { id: "4.5", text: "Le projet évalue-t-il régulièrement les alternatives européennes moins coûteuses ?" }
      ]
    }
  };

  const interpretations = [
    { range: "34-42", level: "✅ EXCELLENT", color: "bg-green-100 border-green-500", textColor: "text-green-800", analysis: "Projet mature avec gouvernance financière solide", action: "Capitaliser et documenter les bonnes pratiques" },
    { range: "26-33", level: "⚠️ SATISFAISANT", color: "bg-yellow-100 border-yellow-500", textColor: "text-yellow-800", analysis: "Bases solides mais marges d'amélioration identifiables", action: "Prioriser les critères à 0/1 point" },
    { range: "18-25", level: "🟠 RISQUÉ", color: "bg-orange-100 border-orange-500", textColor: "text-orange-800", analysis: "Lacunes significatives en gouvernance ou architecture", action: "Plan d'action urgent sur piliers faibles" },
    { range: "0-17", level: "🔴 CRITIQUE", color: "bg-red-100 border-red-500", textColor: "text-red-800", analysis: "Risque financier élevé, projet non viable en l'état", action: "Suspension jusqu'à correction des fondamentaux" }
  ];

  const alerts = [
    { pillar: "Pilier 1", threshold: "< 6/10", action: "Gel du projet jusqu'à business case validé", critical: true },
    { pillar: "Pilier 2", threshold: "< 8/12", action: "Audit technique obligatoire sous 15 jours", critical: true },
    { pillar: "Pillar 3", threshold: "< 8/12", action: "Mise en place tagging + alerting sous 7 jours", critical: true },
    { pillar: "Pilier 4", threshold: "< 6/10", action: "Modélisation financière exigée avant scaling", critical: true }
  ];

  const handleScoreChange = (criteriaId, value) => {
    setScores(prev => ({
      ...prev,
      [criteriaId]: value
    }));
  };

  useEffect(() => {
    // Calcul des scores par pilier
    const newPillarScores = {};
    Object.keys(criteria).forEach(pillarKey => {
      const pillarItems = criteria[pillarKey].items;
      const pillarTotal = pillarItems.reduce((sum, item) => {
        return sum + (scores[item.id] || 0);
      }, 0);
      newPillarScores[pillarKey] = pillarTotal;
    });
    setPillarScores(newPillarScores);

    // Calcul du score total
    const total = Object.values(newPillarScores).reduce((sum, score) => sum + score, 0);
    setTotalScore(total);
  }, [scores]);

  const getInterpretation = () => {
    if (totalScore >= 34) return interpretations[0];
    if (totalScore >= 26) return interpretations[1];
    if (totalScore >= 18) return interpretations[2];
    return interpretations[3];
  };

  const getAlertStatus = (pillarKey, score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (pillarKey === 'pillar1' && score < 6) return 'critical';
    if ((pillarKey === 'pillar2' || pillarKey === 'pillar3') && score < 8) return 'critical';
    if (pillarKey === 'pillar4' && score < 6) return 'critical';
    if (percentage < 60) return 'warning';
    return 'good';
  };

  const ScoreButton = ({ criteriaId, value, label }) => {
    const isSelected = scores[criteriaId] === value;
    const baseClasses = "px-4 py-2 border-2 rounded-lg font-semibold transition-all duration-200";
    const selectedClasses = isSelected
      ? value === 2 ? "bg-green-500 border-green-600 text-white"
        : value === 1 ? "bg-yellow-500 border-yellow-600 text-white"
        : "bg-red-500 border-red-600 text-white"
      : "bg-white border-gray-300 text-gray-700 hover:border-gray-400";

    return (
      <button
        onClick={() => handleScoreChange(criteriaId, value)}
        className={`${baseClasses} ${selectedClasses}`}
      >
        {label}
      </button>
    );
  };

  const interpretation = getInterpretation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-2xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-blue-900 text-center mb-2">
            GRILLE D'ÉVALUATION FINOPS
          </h1>
          <h2 className="text-2xl font-semibold text-blue-700 text-center mb-4">
            POUR PROJETS D'INTELLIGENCE ARTIFICIELLE
          </h2>
          <p className="text-center text-gray-600 italic">
            Matrice d'analyse de la maturité financière et opérationnelle
          </p>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-center text-blue-900 italic">
              « Pour déterminer si un projet d'IA est FinOps compatible,<br />
              il faut s'assurer que chaque euro investi génère de la valeur. »
            </p>
          </div>
        </div>

        {/* Score Total Dashboard */}
        <div className="bg-white rounded-xl shadow-2xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">SCORE TOTAL DU PROJET</h3>
            <div className="text-5xl font-bold text-blue-900">
              {totalScore}<span className="text-3xl text-gray-500">/42</span>
            </div>
          </div>

          <div className={`p-6 rounded-lg border-l-8 ${interpretation.color}`}>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl font-bold">{interpretation.level}</span>
                  <span className="text-lg text-gray-600">({interpretation.range} points)</span>
                </div>
                <p className={`text-lg mb-2 ${interpretation.textColor}`}>
                  <strong>Analyse :</strong> {interpretation.analysis}
                </p>
                <p className={`text-lg ${interpretation.textColor}`}>
                  <strong>Action recommandée :</strong> {interpretation.action}
                </p>
              </div>
            </div>
          </div>

          {/* Progress bars for each pillar */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {Object.entries(criteria).map(([pillarKey, pillar]) => {
              const score = pillarScores[pillarKey];
              const percentage = (score / pillar.maxScore) * 100;
              const alertStatus = getAlertStatus(pillarKey, score, pillar.maxScore);

              return (
                <div key={pillarKey} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm text-gray-700">{pillar.name}</span>
                    <span className="font-bold text-lg">
                      {score}<span className="text-sm text-gray-500">/{pillar.maxScore}</span>
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        alertStatus === 'critical' ? 'bg-red-500' :
                        alertStatus === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  {alertStatus === 'critical' && (
                    <div className="mt-2 text-xs text-red-600 font-semibold flex items-center gap-1">
                      <AlertCircle size={14} />
                      SEUIL D'ALERTE DÉPASSÉ
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Critères d'évaluation */}
        {Object.entries(criteria).map(([pillarKey, pillar], pillarIndex) => (
          <div key={pillarKey} className="bg-white rounded-xl shadow-xl p-6 mb-6">
            <div className={`${pillar.color} text-white rounded-lg p-4 mb-6 flex justify-between items-center`}>
              <h3 className="text-xl font-bold">
                PILIER {pillarIndex + 1} : {pillar.name}
              </h3>
              <div className="text-2xl font-bold">
                {pillarScores[pillarKey]}/{pillar.maxScore}
              </div>
            </div>

            <div className="space-y-4">
              {pillar.items.map((item, index) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border-2 ${
                    index % 2 === 0 ? 'bg-blue-50' : 'bg-white'
                  } border-gray-200`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium mb-3">{item.id} {item.text}</p>
                      <div className="flex gap-3">
                        <ScoreButton criteriaId={item.id} value={2} label="OUI (2pts)" />
                        <ScoreButton criteriaId={item.id} value={1} label="PARTIEL (1pt)" />
                        <ScoreButton criteriaId={item.id} value={0} label="NON (0pt)" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-400 min-w-[60px] text-right">
                      {scores[item.id] !== undefined ? scores[item.id] : '—'}/2
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Interprétation complète des scores */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">INTERPRÉTATION DES SCORES</h3>
          <div className="space-y-4">
            {interpretations.map((interp, index) => (
              <div
                key={index}
                className={`p-5 rounded-lg border-l-8 ${interp.color} ${
                  totalScore >= parseInt(interp.range.split('-')[0]) &&
                  totalScore <= parseInt(interp.range.split('-')[1])
                    ? 'ring-4 ring-blue-300 shadow-lg'
                    : ''
                }`}
              >
                <div className="grid grid-cols-4 gap-4">
                  <div className="font-bold text-center">
                    <div className="text-sm text-gray-600 mb-1">SCORE</div>
                    <div className="text-xl">{interp.range}</div>
                  </div>
                  <div className="font-bold">
                    <div className="text-sm text-gray-600 mb-1">NIVEAU</div>
                    <div className="text-lg">{interp.level}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">ANALYSE</div>
                    <div className="text-sm">{interp.analysis}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">ACTION</div>
                    <div className="text-sm">{interp.action}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seuils d'alerte */}
        <div className="bg-white rounded-xl shadow-xl p-6">
          <h3 className="text-2xl font-bold text-red-700 mb-6 flex items-center gap-3">
            <AlertCircle size={32} />
            SEUILS D'ALERTE PAR PILIER
          </h3>
          <div className="space-y-3">
            {alerts.map((alert, index) => {
              const pillarNum = parseInt(alert.pillar.split(' ')[1]);
              const pillarKey = `pillar${pillarNum}`;
              const currentScore = pillarScores[pillarKey];
              const maxScore = criteria[pillarKey].maxScore;
              const thresholdValue = parseInt(alert.threshold.match(/\d+/)[0]);
              const isTriggered = currentScore < thresholdValue;

              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    isTriggered
                      ? 'bg-red-50 border-red-500'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="grid grid-cols-3 gap-4 items-center">
                    <div className="font-bold">
                      {alert.pillar}
                      {isTriggered && (
                        <span className="ml-2 text-red-600 text-sm">⚠️ ALERTE ACTIVE</span>
                      )}
                    </div>
                    <div className="text-center">
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold">
                        Seuil : {alert.threshold}
                      </span>
                      <div className="text-sm text-gray-600 mt-1">
                        Score actuel : {currentScore}/{maxScore}
                      </div>
                    </div>
                    <div className="text-sm">
                      <strong>Action immédiate :</strong> {alert.action}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p className="mb-2">Document de travail – Grille d'évaluation FinOps pour projets IA</p>
          <p>© 2025 – Extrait de « La Dictature de l'IA et sa Gouvernance »</p>
        </div>
      </div>
    </div>
  );
}
