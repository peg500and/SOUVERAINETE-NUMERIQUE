import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';

const ModuleMDTRGPD = () => {
  const [scores, setScores] = useState({});
  const [activeTab, setActiveTab] = useState('questionnaire');

  const questions = {
    'Dépendance fournisseurs': [
      { id: 'Q1', text: "Le fournisseur principal dépasse-t-il 50 % des dépenses du système critique ?", weight: 1.0 },
      { id: 'Q2', text: "Existe-t-il un second fournisseur opérationnel (multi-sourcing) ?", weight: 1.0 },
      { id: 'Q3', text: "Les interfaces sont-elles basées sur des standards ouverts ?", weight: 1.0 },
      { id: 'Q4', text: "La solution permet-elle une extraction complète des données ?", weight: 1.0 },
      { id: 'Q5', text: "Une migration vers un autre fournisseur a-t-elle été testée ?", weight: 1.0 }
    ],
    'Dépendance opérateurs': [
      { id: 'Q6', text: "Le service critique dépend-il d'un opérateur unique (cloud, hébergeur, réseau) ?", weight: 1.0 },
      { id: 'Q7', text: "Les zones géographiques d'hébergement sont-elles maîtrisées ?", weight: 1.0 },
      { id: 'Q8', text: "Existe-t-il une architecture multi-zone / multi-région ?", weight: 1.0 },
      { id: 'Q9', text: "Les logs et opérations SOC sont-ils localisés dans une juridiction compatible ?", weight: 1.0 }
    ],
    'Dépendance Data & IA': [
      { id: 'Q10', text: "Les données critiques sont-elles stockées et traitées dans l'UE ?", weight: 1.0 },
      { id: 'Q11', text: "Les flux internationaux sont-ils documentés et contrôlés ?", weight: 1.0 },
      { id: 'Q12', text: "Les modèles IA utilisés sont-ils explicables et auditables ?", weight: 1.0 },
      { id: 'Q13', text: "L'organisation maîtrise-t-elle les jeux d'entraînement critiques ?", weight: 1.0 },
      { id: 'Q30', text: "Les principes de privacy by design et by default sont-ils intégrés dès la conception des systèmes ?", weight: 1.2, rgpd: true }
    ],
    'Dépendance contractuelle': [
      { id: 'Q14', text: "Les clauses essentielles (audit, réversibilité, SLA, changement de contrôle) sont-elles présentes ?", weight: 1.0 },
      { id: 'Q15', text: "Le fournisseur est-il soumis à des lois extraterritoriales incompatibles ?", weight: 1.0 },
      { id: 'Q16', text: "Existe-t-il un plan de sortie contractuel testé ?", weight: 1.0 },
      { id: 'Q17', text: "Les preuves de conformité sont-elles disponibles et à jour ?", weight: 1.0 },
      { id: 'Q29', text: "Les audits réguliers des sous-traitants (sécurité, conformité RGPD) sont-ils prévus contractuellement et effectivement réalisés ?", weight: 1.2, rgpd: true }
    ],
    'Dépendance opérationnelle': [
      { id: 'Q18', text: "L'organisation peut-elle opérer le service sans le fournisseur ?", weight: 1.0 },
      { id: 'Q19', text: "Les compétences critiques sont-elles documentées et redondées ?", weight: 1.0 },
      { id: 'Q20', text: "Un plan de transfert de connaissances est-il en place ?", weight: 1.0 },
      { id: 'Q21', text: "Les équipes internes ont-elles accès aux outils d'administration ?", weight: 1.0 }
    ],
    'Dépendance Juridique & RGPD': [
      { id: 'Q22', text: "Un registre des activités de traitement est-il tenu à jour conformément à l'article 30 du RGPD ?", weight: 1.5, critical: true, rgpd: true },
      { id: 'Q23', text: "Une analyse d'impact (DPIA) a-t-elle été réalisée pour les traitements à risque élevé (Art. 35 RGPD) ?", weight: 1.2, rgpd: true },
      { id: 'Q24', text: "Les contrats avec les sous-traitants contiennent-ils toutes les clauses obligatoires de l'article 28 du RGPD ?", weight: 1.5, critical: true, rgpd: true },
      { id: 'Q25', text: "Les transferts de données hors UE/EEE s'appuient-ils sur des mécanismes juridiques valides (CCT, Décision d'adéquation) ?", weight: 1.3, rgpd: true },
      { id: 'Q26', text: "Des procédures opérationnelles garantissent-elles l'exercice des droits des personnes (accès, rectification, effacement, portabilité) dans les délais légaux ?", weight: 1.0, rgpd: true },
      { id: 'Q27', text: "Une procédure de gestion des violations de données est-elle définie et testée (notification CNIL sous 72h) ?", weight: 1.5, critical: true, rgpd: true },
      { id: 'Q28', text: "Un DPO (interne ou externe) est-il désigné, dispose-t-il des moyens nécessaires, et est-il associé aux décisions stratégiques ?", weight: 1.2, rgpd: true }
    ]
  };

  const scoreOptions = [
    { value: 0, label: '0 - Non-résilient', color: '#dc2626', description: 'Pas de mise en œuvre' },
    { value: 1, label: '1 - Documenté', color: '#f97316', description: 'Intentions formalisées' },
    { value: 3, label: '3 - Déployé', color: '#eab308', description: 'Moyens en place' },
    { value: 5, label: '5 - Contrôlé', color: '#16a34a', description: 'Résultats mesurés' }
  ];

  const handleScoreChange = (questionId, value) => {
    setScores(prev => ({ ...prev, [questionId]: value }));
  };

  const calculations = useMemo(() => {
    const axeScores = {};
    const axeScoresWeighted = {};
    let totalScore = 0;
    let totalWeightedScore = 0;
    let totalQuestions = 0;
    let totalWeight = 0;
    let rgpdScore = 0;
    let rgpdWeight = 0;
    let technicalScore = 0;
    let technicalWeight = 0;

    const criticalAlerts = [];

    Object.entries(questions).forEach(([axeName, axeQuestions]) => {
      let axeScore = 0;
      let axeWeightedScore = 0;
      let axeMaxWeighted = 0;

      axeQuestions.forEach((q) => {
        const score = scores[q.id] || 0;
        const weight = q.weight || 1.0;

        axeScore += score;
        axeWeightedScore += score * weight;
        axeMaxWeighted += 5 * weight;
        totalScore += score;
        totalWeightedScore += score * weight;
        totalQuestions += 1;
        totalWeight += weight;

        // Calculer scores RGPD vs Technique
        if (q.rgpd) {
          rgpdScore += score * weight;
          rgpdWeight += 5 * weight;
        } else {
          technicalScore += score * weight;
          technicalWeight += 5 * weight;
        }

        // Alertes critiques
        if (q.critical && score < 3) {
          criticalAlerts.push({
            question: q.id,
            text: q.text,
            score: score,
            severity: score === 0 ? 'rouge' : 'orange'
          });
        }
      });

      const axeMax = axeQuestions.length * 5;
      axeScores[axeName] = axeMax > 0 ? (axeScore / axeMax) * 100 : 0;
      axeScoresWeighted[axeName] = axeMaxWeighted > 0 ? (axeWeightedScore / axeMaxWeighted) * 100 : 0;
    });

    const scoreGlobal = totalQuestions > 0 ? (totalScore / (totalQuestions * 5)) * 100 : 0;
    const scoreGlobalWeighted = totalWeight > 0 ? (totalWeightedScore / (totalWeight * 5)) * 100 : 0;

    const idtSimple = 100 - scoreGlobal;
    const idtWeighted = 100 - scoreGlobalWeighted;

    // Calcul IDT v2.0 avec pondération technique/juridique
    const rgpdPercent = rgpdWeight > 0 ? (rgpdScore / rgpdWeight) * 100 : 0;
    const technicalPercent = technicalWeight > 0 ? (technicalScore / technicalWeight) * 100 : 0;

    const idtTechnical = 100 - technicalPercent;
    const idtRgpd = 100 - rgpdPercent;
    const idtV2 = (idtTechnical * 0.6) + (idtRgpd * 0.4);

    let interpretation = '';
    let interpretationColor = '';
    if (idtV2 < 20) {
      interpretation = 'Très faible - Organisation autonome';
      interpretationColor = '#16a34a';
    } else if (idtV2 < 40) {
      interpretation = 'Faible - Dépendance maîtrisée';
      interpretationColor = '#84cc16';
    } else if (idtV2 < 60) {
      interpretation = 'Modérée - Risques significatifs';
      interpretationColor = '#eab308';
    } else if (idtV2 < 80) {
      interpretation = 'Forte - Dépendance critique';
      interpretationColor = '#f97316';
    } else {
      interpretation = 'Très forte - Risque systémique';
      interpretationColor = '#dc2626';
    }

    // Interprétation RGPD spécifique
    let rgpdInterpretation = '';
    let rgpdColor = '';
    if (rgpdPercent >= 80) {
      rgpdInterpretation = 'Excellence - Conformité avancée';
      rgpdColor = '#16a34a';
    } else if (rgpdPercent >= 60) {
      rgpdInterpretation = 'Satisfaisant - Conformité opérationnelle';
      rgpdColor = '#84cc16';
    } else if (rgpdPercent >= 40) {
      rgpdInterpretation = 'Partiel - Vigilance requise';
      rgpdColor = '#eab308';
    } else if (rgpdPercent >= 20) {
      rgpdInterpretation = 'Insuffisant - Risque de sanction';
      rgpdColor = '#f97316';
    } else {
      rgpdInterpretation = 'Critique - Non-conformité majeure';
      rgpdColor = '#dc2626';
    }

    return {
      axeScores,
      axeScoresWeighted,
      scoreGlobal,
      scoreGlobalWeighted,
      idtSimple,
      idtWeighted,
      idtTechnical,
      idtRgpd,
      idtV2,
      interpretation,
      interpretationColor,
      rgpdPercent,
      technicalPercent,
      rgpdInterpretation,
      rgpdColor,
      criticalAlerts
    };
  }, [scores]);

  const barChartData = Object.entries(calculations.axeScoresWeighted).map(([axe, score]) => ({
    axe: axe.replace('Dépendance ', ''),
    'Résilience (%)': parseFloat(score.toFixed(1))
  }));

  const radarData = Object.entries(calculations.axeScoresWeighted).map(([axe, score]) => ({
    axe: axe.replace('Dépendance ', '').substring(0, 15),
    score: parseFloat(score.toFixed(1)),
    fullMark: 100
  }));

  const pieData = [
    { name: 'Résilience', value: parseFloat(calculations.scoreGlobalWeighted.toFixed(1)) },
    { name: 'Dépendance', value: parseFloat(calculations.idtWeighted.toFixed(1)) }
  ];

  const idtComparisonData = [
    { name: 'Technique', idt: parseFloat(calculations.idtTechnical.toFixed(1)) },
    { name: 'RGPD/Juridique', idt: parseFloat(calculations.idtRgpd.toFixed(1)) },
    { name: 'IDT Global v2.0', idt: parseFloat(calculations.idtV2.toFixed(1)) }
  ];

  const COLORS = ['#16a34a', calculations.interpretationColor];

  const kpis = [
    { id: 'KPI-1', name: 'Dépendance fournisseur', description: 'Concentration économique et technique', question: 'Q1' },
    { id: 'KPI-2', name: 'Exposition extraterritoriale', description: 'Exposition aux lois non-UE', question: 'Q7' },
    { id: 'KPI-3', name: 'Portabilité réelle', description: 'Capacité à migrer workloads/données', question: 'Q4' },
    { id: 'KPI-4', name: 'Autonomie opérationnelle', description: 'Opération sans prestataire', question: 'Q18' },
    { id: 'KPI-5', name: 'Souveraineté data', description: 'Localisation + contrôle données', question: 'Q10' },
    { id: 'KPI-6', name: 'Diversification effective', description: 'Multi-sourcing réel', question: 'Q2' },
    { id: 'KPI-7', name: 'Dépendance contractuelle', description: 'Clauses essentielles', question: 'Q17' },
    { id: 'KPI-8', name: 'Maturité RGPD', description: 'Moyenne Q22, Q23, Q24, Q27, Q28', questions: ['Q22', 'Q23', 'Q24', 'Q27', 'Q28'], type: 'average' },
    { id: 'KPI-9', name: 'Risque juridique transfrontalier', description: 'Moyenne Q15, Q25', questions: ['Q15', 'Q25'], type: 'average' },
    { id: 'KPI-10', name: 'Contractualisation RGPD', description: 'Moyenne Q24, Q29', questions: ['Q24', 'Q29'], type: 'average' }
  ];

  const getKpiValue = (kpi) => {
    if (kpi.type === 'average' && kpi.questions) {
      const validScores = kpi.questions.map(q => scores[q] || 0).filter(s => s !== undefined);
      return validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : 0;
    }
    return scores[kpi.question] || 0;
  };

  const getKpiColor = (value) => {
    if (value >= 4) return '#16a34a';
    if (value >= 3) return '#84cc16';
    if (value >= 2) return '#eab308';
    if (value >= 1) return '#f97316';
    return '#dc2626';
  };

  const getKpiStatus = (value) => {
    if (value >= 4) return 'Excellent';
    if (value >= 3) return 'Satisfaisant';
    if (value >= 2) return 'À améliorer';
    if (value >= 1) return 'Insuffisant';
    return 'Critique';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 border-indigo-600">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-indigo-900 mb-2">
                Module MDT - Mesure de la Dépendance Technologique
              </h1>
              <p className="text-gray-600 mb-1">
                Indice de Résilience Numérique (IRN) v0.5 - Évaluation intégrée technique et RGPD
              </p>
              <div className="flex gap-4 mt-2">
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                  30 questions
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  6 axes + RGPD
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                  10 KPI
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold" style={{ color: calculations.interpretationColor }}>
                {calculations.idtV2.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">IDT Global v2.0</div>
            </div>
          </div>
        </div>

        {/* Alertes critiques */}
        {calculations.criticalAlerts.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-start">
              <div className="text-3xl mr-4">⚠️</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-red-900 mb-2">Alertes de conformité critique</h3>
                <p className="text-red-700 mb-3">
                  {calculations.criticalAlerts.length} question(s) critique(s) nécessite(nt) une attention immédiate :
                </p>
                <div className="space-y-2">
                  {calculations.criticalAlerts.map((alert, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 border-l-4" style={{ borderColor: alert.severity === 'rouge' ? '#dc2626' : '#f97316' }}>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="font-semibold text-gray-900">{alert.question}:</span>
                          <span className="ml-2 text-gray-700">{alert.text}</span>
                        </div>
                        <span className="ml-4 px-3 py-1 rounded-full text-white text-sm font-semibold"
                              style={{ backgroundColor: alert.severity === 'rouge' ? '#dc2626' : '#f97316' }}>
                          Score: {alert.score}/5
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b overflow-x-auto">
            {['questionnaire', 'scores', 'kpi', 'rgpd', 'synthese'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-6 py-4 font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white border-b-4 border-indigo-800'
                    : 'text-gray-600 hover:bg-indigo-50'
                }`}
              >
                {tab === 'questionnaire' && 'Questionnaire'}
                {tab === 'scores' && 'Scores par Axe'}
                {tab === 'kpi' && 'KPI'}
                {tab === 'rgpd' && 'Analyse RGPD'}
                {tab === 'synthese' && 'Synthèse & IDT'}
              </button>
            ))}
          </div>
        </div>

        {/* Questionnaire Tab */}
        {activeTab === 'questionnaire' && (
          <div className="space-y-6">
            {Object.entries(questions).map(([axeName, axeQuestions]) => (
              <div key={axeName} className={`bg-white rounded-xl shadow-lg p-6 ${axeName.includes('RGPD') ? 'border-l-4 border-purple-500' : ''}`}>
                <div className="flex items-center justify-between mb-4 border-b-2 border-indigo-200 pb-2">
                  <h2 className="text-2xl font-bold text-indigo-800">
                    {axeName}
                  </h2>
                  {axeName.includes('RGPD') && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                      Nouveau
                    </span>
                  )}
                </div>
                <div className="space-y-4">
                  {axeQuestions.map((q) => (
                    <div key={q.id} className={`border-l-4 pl-4 py-2 ${q.rgpd ? 'border-purple-400 bg-purple-50' : 'border-indigo-300'}`}>
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-[300px]">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-indigo-600">{q.id}:</span>
                            {q.critical && <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold">CRITIQUE</span>}
                            {q.rgpd && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-bold">RGPD</span>}
                            {q.weight > 1.0 && <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-bold">x{q.weight}</span>}
                          </div>
                          <span className="text-gray-700">{q.text}</span>
                        </div>
                        <div className="flex gap-2">
                          {scoreOptions.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleScoreChange(q.id, option.value)}
                              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                scores[q.id] === option.value
                                  ? 'ring-4 ring-offset-2 scale-105'
                                  : 'opacity-60 hover:opacity-100'
                              }`}
                              style={{
                                backgroundColor: option.color,
                                color: 'white',
                                ringColor: option.color
                              }}
                              title={option.description}
                            >
                              {option.value}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Légende */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Échelle de notation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {scoreOptions.map((option) => (
                  <div key={option.value} className="flex items-center gap-3 p-3 rounded-lg border-2" style={{ borderColor: option.color }}>
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: option.color }}>
                      {option.value}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{option.label.split(' - ')[1]}</div>
                      <div className="text-sm text-gray-600">{option.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scores Tab */}
        {activeTab === 'scores' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-indigo-900 mb-6">Résilience par axe de dépendance</h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="axe" angle={-45} textAnchor="end" height={120} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Résilience (%)" fill="#4f46e5" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-indigo-900 mb-6">Vue radar - Profil de résilience</h2>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="axe" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar name="Score de résilience" dataKey="score" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(calculations.axeScoresWeighted).map(([axe, score]) => {
                const color = score >= 80 ? '#16a34a' : score >= 60 ? '#84cc16' : score >= 40 ? '#eab308' : score >= 20 ? '#f97316' : '#dc2626';
                return (
                  <div key={axe} className="bg-white rounded-xl shadow-lg p-6 border-l-4" style={{ borderColor: color }}>
                    <h3 className="font-bold text-gray-800 mb-2">{axe}</h3>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div className="h-4 rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: color }}></div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold" style={{ color }}>
                        {score.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* KPI Tab */}
        {activeTab === 'kpi' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-indigo-900 mb-6">Indicateurs clés de performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {kpis.map((kpi) => {
                  const value = getKpiValue(kpi);
                  const color = getKpiColor(value);
                  const status = getKpiStatus(value);
                  const isNew = kpi.id.match(/KPI-[8-9]|KPI-10/);

                  return (
                    <div key={kpi.id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md p-5 border-l-4" style={{ borderColor: color }}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{kpi.id}</h3>
                          {isNew && <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs font-bold">NOUVEAU</span>}
                        </div>
                        <div className="text-2xl font-bold" style={{ color }}>
                          {value.toFixed(1)}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-700 mb-1">{kpi.name}</div>
                      <div className="text-xs text-gray-600 mb-3">{kpi.description}</div>
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: color }}>
                          {status}
                        </span>
                        <span className="text-xs text-gray-500">
                          {kpi.questions ? `${kpi.questions.length} questions` : kpi.question}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Seuils d'alerte KPI</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-indigo-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">KPI</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-indigo-900">Valeur</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-indigo-900">Statut</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">Seuil critique</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-indigo-900">Action requise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {kpis.map((kpi) => {
                      const value = getKpiValue(kpi);
                      const color = getKpiColor(value);
                      const status = getKpiStatus(value);
                      const isCritical = value < 3;

                      return (
                        <tr key={kpi.id} className={isCritical ? 'bg-red-50' : ''}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{kpi.name}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-lg font-bold" style={{ color }}>{value.toFixed(1)}/5</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: color }}>
                              {status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {kpi.id.match(/KPI-[1234567]/) && '< 4/5'}
                            {kpi.id === 'KPI-8' && '< 3/5 (RGPD)'}
                            {kpi.id === 'KPI-9' && '< 3/5'}
                            {kpi.id === 'KPI-10' && '< 4/5 (RGPD)'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {isCritical ? "Plan d'action immédiat" : 'Maintenir le niveau'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* RGPD Analysis Tab */}
        {activeTab === 'rgpd' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <h2 className="text-2xl font-bold text-purple-900 mb-4">Analyse de conformité RGPD</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-5 shadow">
                  <div className="text-sm text-gray-600 mb-1">Score RGPD</div>
                  <div className="text-4xl font-bold mb-2" style={{ color: calculations.rgpdColor }}>
                    {calculations.rgpdPercent.toFixed(1)}%
                  </div>
                  <div className="text-sm font-semibold" style={{ color: calculations.rgpdColor }}>
                    {calculations.rgpdInterpretation}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-5 shadow">
                  <div className="text-sm text-gray-600 mb-1">IDT Juridique</div>
                  <div className="text-4xl font-bold mb-2" style={{ color: calculations.rgpdColor }}>
                    {calculations.idtRgpd.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    Dépendance juridique
                  </div>
                </div>
                <div className="bg-white rounded-lg p-5 shadow">
                  <div className="text-sm text-gray-600 mb-1">Questions RGPD</div>
                  <div className="text-4xl font-bold mb-2 text-indigo-600">
                    9/30
                  </div>
                  <div className="text-sm text-gray-600">
                    Dimension juridique
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Comparaison IDT Technique vs Juridique</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={idtComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="idt" fill="#7c3aed" name="Indice de Dépendance (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">KPI RGPD Détaillés</h3>
              <div className="space-y-4">
                {kpis.filter(k => k.id.match(/KPI-8|KPI-9|KPI-10/)).map((kpi) => {
                  const value = getKpiValue(kpi);
                  const color = getKpiColor(value);

                  return (
                    <div key={kpi.id} className="border-l-4 pl-4 py-3 bg-purple-50 rounded-r-lg" style={{ borderColor: color }}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-bold text-gray-900">{kpi.name}</span>
                          <span className="ml-2 text-sm text-gray-600">({kpi.id})</span>
                        </div>
                        <div className="text-2xl font-bold" style={{ color }}>
                          {value.toFixed(1)}/5
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 mb-2">{kpi.description}</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div className="h-3 rounded-full transition-all" style={{ width: `${(value / 5) * 100}%`, backgroundColor: color }}></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {kpi.questions?.join(', ')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-amber-900 mb-3">Matrice de risques RGPD</h3>
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4">
                  <div className="font-semibold text-gray-900 mb-2">Risques de sanction</div>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Score RGPD &lt; 40% : <span className="font-bold text-red-600">Risque de sanction élevé</span> (jusqu'à 4% CA mondial)</li>
                    <li>• Questions critiques (Q22, Q24, Q27) &lt; 3 : <span className="font-bold text-orange-600">Non-conformité majeure</span></li>
                    <li>• KPI-8 (Maturité RGPD) &lt; 3 : <span className="font-bold text-orange-600">Vigilance CNIL requise</span></li>
                  </ul>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="font-semibold text-gray-900 mb-2">Échelle de conformité</div>
                  <div className="grid grid-cols-5 gap-2 text-xs">
                    <div className="bg-red-100 text-red-800 p-2 rounded text-center font-semibold">0-20%<br/>Critique</div>
                    <div className="bg-orange-100 text-orange-800 p-2 rounded text-center font-semibold">20-40%<br/>Insuffisant</div>
                    <div className="bg-yellow-100 text-yellow-800 p-2 rounded text-center font-semibold">40-60%<br/>Partiel</div>
                    <div className="bg-lime-100 text-lime-800 p-2 rounded text-center font-semibold">60-80%<br/>Satisfaisant</div>
                    <div className="bg-green-100 text-green-800 p-2 rounded text-center font-semibold">80-100%<br/>Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Synthèse Tab */}
        {activeTab === 'synthese' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-lg p-8 border-t-4" style={{ borderColor: calculations.interpretationColor }}>
              <h2 className="text-3xl font-bold text-indigo-900 mb-6">Synthèse globale</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="text-sm text-gray-600 mb-1">Score global pondéré</div>
                  <div className="text-4xl font-bold text-indigo-600">
                    {calculations.scoreGlobalWeighted.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Résilience globale</div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="text-sm text-gray-600 mb-1">IDT Global v2.0</div>
                  <div className="text-4xl font-bold" style={{ color: calculations.interpretationColor }}>
                    {calculations.idtV2.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">60% Technique + 40% RGPD</div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="text-sm text-gray-600 mb-1">IDT Technique</div>
                  <div className="text-4xl font-bold text-blue-600">
                    {calculations.idtTechnical.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Dépendance opérationnelle</div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md">
                  <div className="text-sm text-gray-600 mb-1">IDT Juridique</div>
                  <div className="text-4xl font-bold" style={{ color: calculations.rgpdColor }}>
                    {calculations.idtRgpd.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Dépendance RGPD</div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md mb-6">
                <div className="text-center">
                  <div className="text-xl font-semibold text-gray-700 mb-2">Niveau de dépendance</div>
                  <div className="text-3xl font-bold mb-4" style={{ color: calculations.interpretationColor }}>
                    {calculations.interpretation}
                  </div>
                  <div className="max-w-2xl mx-auto">
                    <div className="flex justify-between text-xs text-gray-600 mb-2">
                      <span>Très faible</span>
                      <span>Faible</span>
                      <span>Modérée</span>
                      <span>Forte</span>
                      <span>Très forte</span>
                    </div>
                    <div className="relative h-8 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full">
                      <div
                        className="absolute top-0 w-4 h-full bg-white border-4 border-gray-800 rounded-full transform -translate-x-1/2"
                        style={{ left: `${calculations.idtV2}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Répartition Résilience/Dépendance</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Évolution IDT</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[
                    { version: 'IDT Simple', value: calculations.idtSimple },
                    { version: 'IDT Pondéré', value: calculations.idtWeighted },
                    { version: 'IDT v2.0', value: calculations.idtV2 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="version" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Échelle d'interprétation IDT v2.0</h3>
              <div className="space-y-3">
                {[
                  { range: '0-20%', label: 'Très faible', description: 'Organisation autonome - Dépendances maîtrisées', color: '#16a34a' },
                  { range: '21-40%', label: 'Faible', description: 'Dépendance maîtrisée - Surveillance continue', color: '#84cc16' },
                  { range: '41-60%', label: 'Modérée', description: "Risques significatifs - Plan d'action requis", color: '#eab308' },
                  { range: '61-80%', label: 'Forte', description: 'Dépendance critique - Actions immédiates', color: '#f97316' },
                  { range: '81-100%', label: 'Très forte', description: 'Risque systémique - Urgence maximale', color: '#dc2626' }
                ].map((level) => (
                  <div key={level.range} className="flex items-center gap-4 p-4 rounded-lg border-2" style={{ borderColor: level.color }}>
                    <div className="w-24 text-center">
                      <div className="font-bold text-lg" style={{ color: level.color }}>{level.range}</div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{level.label}</div>
                      <div className="text-sm text-gray-600">{level.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-3">Nouveautés v0.5</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li>• <strong>Nouvel axe RGPD :</strong> 7 questions dédiées à la conformité juridique</li>
                <li>• <strong>Pondération intelligente :</strong> Questions critiques avec coefficient multiplicateur</li>
                <li>• <strong>IDT v2.0 :</strong> Calcul hybride (60% technique + 40% juridique)</li>
                <li>• <strong>3 nouveaux KPI :</strong> Maturité RGPD, Risque transfrontalier, Contractualisation</li>
                <li>• <strong>Alertes critiques :</strong> Détection automatique des non-conformités majeures</li>
                <li>• <strong>Analyse RGPD dédiée :</strong> Onglet spécifique avec matrice de risques</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleMDTRGPD;
