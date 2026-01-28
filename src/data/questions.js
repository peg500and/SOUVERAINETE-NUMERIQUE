export const questions = [
  {
    axis: 'Dépendance fournisseurs',
    axisId: 'fournisseurs',
    color: '#4472C4',
    items: [
      { id: 'Q1', text: 'Le fournisseur principal dépasse-t-il 50 % des dépenses du système critique ?' },
      { id: 'Q2', text: 'Existe-t-il un second fournisseur opérationnel (multi-sourcing) ?' },
      { id: 'Q3', text: 'Les interfaces sont-elles basées sur des standards ouverts ?' },
      { id: 'Q4', text: 'La solution permet-elle une extraction complète des données ?' },
      { id: 'Q5', text: 'Une migration vers un autre fournisseur a-t-elle été testée ?' }
    ]
  },
  {
    axis: 'Dépendance opérateurs',
    axisId: 'operateurs',
    color: '#ED7D31',
    items: [
      { id: 'Q6', text: "Le service critique dépend-il d'un opérateur unique (cloud, hébergeur, réseau) ?" },
      { id: 'Q7', text: "Les zones géographiques d'hébergement sont-elles maîtrisées ?" },
      { id: 'Q8', text: 'Existe-t-il une architecture multi-zone / multi-région ?' },
      { id: 'Q9', text: 'Les logs et opérations SOC sont-ils localisés dans une juridiction compatible ?' }
    ]
  },
  {
    axis: 'Dépendance Data & IA',
    axisId: 'data',
    color: '#A5A5A5',
    items: [
      { id: 'Q10', text: "Les données critiques sont-elles stockées et traitées dans l'UE ?" },
      { id: 'Q11', text: 'Les flux internationaux sont-ils documentés et contrôlés ?' },
      { id: 'Q12', text: 'Les modèles IA utilisés sont-ils explicables et auditables ?' },
      { id: 'Q13', text: "L'organisation maîtrise-t-elle les jeux d'entraînement critiques ?" }
    ]
  },
  {
    axis: 'Dépendance contractuelle',
    axisId: 'contractuelle',
    color: '#FFC000',
    items: [
      { id: 'Q14', text: 'Les clauses essentielles (audit, réversibilité, SLA, changement de contrôle) sont-elles présentes ?' },
      { id: 'Q15', text: 'Le fournisseur est-il soumis à des lois extraterritoriales incompatibles ?' },
      { id: 'Q16', text: 'Existe-t-il un plan de sortie contractuel testé ?' },
      { id: 'Q17', text: 'Les preuves de conformité sont-elles disponibles et à jour ?' }
    ]
  },
  {
    axis: 'Dépendance opérationnelle',
    axisId: 'operationnelle',
    color: '#5B9BD5',
    items: [
      { id: 'Q18', text: "L'organisation peut-elle opérer le service sans le fournisseur ?" },
      { id: 'Q19', text: 'Les compétences critiques sont-elles documentées et redondées ?' },
      { id: 'Q20', text: 'Un plan de transfert de connaissances est-il en place ?' },
      { id: 'Q21', text: "Les équipes internes ont-elles accès aux outils d'administration ?" }
    ]
  }
];

export const scoreLabels = {
  0: { label: 'Non-résilient', description: 'Dépendance forte', color: '#dc3545' },
  1: { label: 'Documenté', description: 'Processus identifié', color: '#ffc107' },
  3: { label: 'Déployé', description: 'Solution en place', color: '#17a2b8' },
  5: { label: 'Contrôlé', description: 'Autonomie forte', color: '#28a745' }
};

export const idtInterpretation = [
  { min: 0, max: 20, level: 'Très faible', description: 'Organisation autonome', color: '#28a745', emoji: '🟢' },
  { min: 21, max: 40, level: 'Faible', description: 'Dépendance maîtrisée', color: '#ffc107', emoji: '🟡' },
  { min: 41, max: 60, level: 'Modérée', description: 'Risques significatifs', color: '#fd7e14', emoji: '🟠' },
  { min: 61, max: 80, level: 'Forte', description: 'Dépendance critique', color: '#dc3545', emoji: '🟠' },
  { min: 81, max: 100, level: 'Très forte', description: 'Risque systémique', color: '#721c24', emoji: '🔴' }
];

export const kpiDefinitions = [
  {
    id: 'KPI-1',
    title: 'Dépendance fournisseur',
    description: 'Mesure la concentration économique et technique',
    questions: ['Q1', 'Q2', 'Q3']
  },
  {
    id: 'KPI-2',
    title: 'Exposition extraterritoriale',
    description: "Mesure l'exposition aux lois non-UE",
    questions: ['Q9', 'Q10', 'Q15']
  },
  {
    id: 'KPI-3',
    title: 'Portabilité réelle',
    description: 'Capacité à migrer workloads / données',
    questions: ['Q4', 'Q5']
  },
  {
    id: 'KPI-4',
    title: 'Autonomie opérationnelle',
    description: 'Capacité à opérer sans prestataire',
    questions: ['Q18', 'Q19', 'Q20', 'Q21']
  },
  {
    id: 'KPI-5',
    title: 'Souveraineté data',
    description: 'Localisation + contrôle des données',
    questions: ['Q10', 'Q11', 'Q13']
  },
  {
    id: 'KPI-6',
    title: 'Diversification effective',
    description: 'Multi-sourcing réel',
    questions: ['Q2', 'Q6', 'Q8']
  },
  {
    id: 'KPI-7',
    title: 'Dépendance contractuelle',
    description: 'Capacité à imposer des clauses',
    questions: ['Q14', 'Q16', 'Q17']
  }
];
