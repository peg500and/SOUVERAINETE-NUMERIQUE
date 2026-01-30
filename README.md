# Module MDT - Mesure de la Dépendance Technologique

**Indice de Résilience Numérique (IRN) v0.5**

Tableau de bord d'évaluation intégrée technique et RGPD pour mesurer et suivre la dépendance technologique de votre organisation.

## Aperçu

Le Module MDT est un outil d'auto-évaluation permettant aux organisations de :
- Mesurer leur niveau de dépendance technologique
- Évaluer leur conformité RGPD
- Identifier les risques critiques
- Suivre des KPI de résilience numérique

## Caractéristiques

| Fonctionnalité | Description |
|----------------|-------------|
| **30 questions** | Questionnaire complet couvrant tous les axes de dépendance |
| **6 axes + RGPD** | Analyse structurée par domaine |
| **10 KPI** | Indicateurs clés de performance avec seuils d'alerte |
| **IDT v2.0** | Calcul hybride (60% technique + 40% juridique) |
| **Alertes critiques** | Détection automatique des non-conformités |

## Les 6 Axes d'Évaluation

### 1. Dépendance Fournisseurs (Q1-Q5)
- Concentration économique
- Multi-sourcing
- Standards ouverts
- Extraction des données
- Tests de migration

### 2. Dépendance Opérateurs (Q6-Q9)
- Opérateur unique
- Zones géographiques
- Architecture multi-zone
- Localisation SOC

### 3. Dépendance Data & IA (Q10-Q13, Q30)
- Stockage dans l'UE
- Flux internationaux
- Explicabilité IA
- Jeux d'entraînement
- Privacy by design

### 4. Dépendance Contractuelle (Q14-Q17, Q29)
- Clauses essentielles
- Lois extraterritoriales
- Plan de sortie
- Preuves de conformité
- Audits sous-traitants

### 5. Dépendance Opérationnelle (Q18-Q21)
- Autonomie d'opération
- Documentation des compétences
- Transfert de connaissances
- Accès aux outils d'administration

### 6. Dépendance Juridique & RGPD (Q22-Q28)
- Registre des traitements (Art. 30)
- Analyse d'impact DPIA (Art. 35)
- Clauses sous-traitants (Art. 28)
- Transferts hors UE/EEE
- Droits des personnes
- Notification des violations (72h)
- DPO

## Échelle de Notation

| Score | Niveau | Description |
|-------|--------|-------------|
| **0** | Non-résilient | Pas de mise en œuvre |
| **1** | Documenté | Intentions formalisées |
| **3** | Déployé | Moyens en place |
| **5** | Contrôlé | Résultats mesurés |

## Les 10 KPI

| KPI | Nom | Questions |
|-----|-----|-----------|
| KPI-1 | Dépendance fournisseur | Q1 |
| KPI-2 | Exposition extraterritoriale | Q7 |
| KPI-3 | Portabilité réelle | Q4 |
| KPI-4 | Autonomie opérationnelle | Q18 |
| KPI-5 | Souveraineté data | Q10 |
| KPI-6 | Diversification effective | Q2 |
| KPI-7 | Dépendance contractuelle | Q17 |
| KPI-8 | Maturité RGPD | Q22, Q23, Q24, Q27, Q28 |
| KPI-9 | Risque juridique transfrontalier | Q15, Q25 |
| KPI-10 | Contractualisation RGPD | Q24, Q29 |

## Interprétation de l'IDT v2.0

| Plage | Niveau | Signification |
|-------|--------|---------------|
| 0-20% | Très faible | Organisation autonome - Dépendances maîtrisées |
| 21-40% | Faible | Dépendance maîtrisée - Surveillance continue |
| 41-60% | Modérée | Risques significatifs - Plan d'action requis |
| 61-80% | Forte | Dépendance critique - Actions immédiates |
| 81-100% | Très forte | Risque systémique - Urgence maximale |

## Conformité RGPD

### Échelle de conformité RGPD

| Score | Niveau | Risque |
|-------|--------|--------|
| 0-20% | Critique | Non-conformité majeure |
| 20-40% | Insuffisant | Risque de sanction |
| 40-60% | Partiel | Vigilance requise |
| 60-80% | Satisfaisant | Conformité opérationnelle |
| 80-100% | Excellence | Conformité avancée |

### Questions Critiques RGPD

Les questions suivantes sont marquées comme **critiques** (coefficient x1.5) :
- **Q22** : Registre des activités de traitement (Art. 30)
- **Q24** : Clauses sous-traitants (Art. 28)
- **Q27** : Procédure de notification des violations (72h)

Un score < 3 sur ces questions déclenche une alerte critique.

## Installation

### Prérequis

- Node.js 18+
- npm ou yarn

### Installation locale

```bash
# Cloner le repository
git clone https://github.com/votre-username/SOUVERAINETE-NUMERIQUE.git
cd SOUVERAINETE-NUMERIQUE

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour production
npm run build
```

## Application Portable & Auto-Extractible

Le Module MDT peut être distribué sous forme d'application portable ou auto-extractible, ne nécessitant aucune installation.

### 1. Fichier HTML Portable (Single-File)

Génère un fichier HTML unique contenant l'intégralité de l'application :

```bash
# Linux/macOS (Node.js)
npm run build:portable

# Windows (PowerShell)
npm run build:portable:ps
```

**Sortie :** `dist-portable/mdt-dashboard-rgpd-portable.html`

**Caractéristiques :**
- Fichier HTML autonome (~730 KB)
- CSS et JavaScript inline
- Fonctionne hors-ligne
- Ouvrir directement dans un navigateur
- Idéal pour partage par email ou clé USB

### 2. Script Auto-Extractible

Crée un script auto-extractible qui s'extrait et se lance automatiquement.

#### Linux/macOS (.sh)

```bash
npm run build:self-extracting
```

**Sortie :** `dist-self-extracting/mdt-dashboard-vX.X.X-YYYYMMDD.sh`

**Options :**
```bash
# Exécution standard (extrait et lance)
./mdt-dashboard-v0.5.0-YYYYMMDD.sh

# Extraire sans lancer l'application
./mdt-dashboard-v0.5.0-YYYYMMDD.sh --extract-only

# Extraire vers un répertoire spécifique
./mdt-dashboard-v0.5.0-YYYYMMDD.sh --target /chemin/personnalise

# Afficher l'aide
./mdt-dashboard-v0.5.0-YYYYMMDD.sh --help
```

#### Windows (.ps1)

```powershell
npm run build:self-extracting:ps
```

**Sortie :** `dist-self-extracting/mdt-dashboard-vX.X.X-YYYYMMDD.ps1`

**Options :**
```powershell
# Exécution standard (extrait et lance)
.\mdt-dashboard-v0.5.0-YYYYMMDD.ps1

# Extraire sans lancer l'application
.\mdt-dashboard-v0.5.0-YYYYMMDD.ps1 -ExtractOnly

# Extraire vers un répertoire spécifique
.\mdt-dashboard-v0.5.0-YYYYMMDD.ps1 -Target "C:\MonDossier"
```

### 3. Build Complet

Génère à la fois le fichier portable et le script auto-extractible :

```bash
# Linux/macOS
npm run build:all

# Windows (PowerShell)
npm run build:all:ps
```

### Contenu de l'Archive Auto-Extractible

| Fichier | Description |
|---------|-------------|
| `index.html` | Application MDT complète (single-file) |
| `lancer-mdt.sh` | Script de lancement Linux/macOS |
| `lancer-mdt.bat` | Script de lancement Windows |
| `LISEZ-MOI.txt` | Documentation utilisateur |

### Structure des Builds

```
SOUVERAINETE-NUMERIQUE/
├── dist/                    # Build standard Vite
├── dist-portable/           # Fichier HTML autonome
│   └── mdt-dashboard-rgpd-portable.html
├── dist-self-extracting/    # Application auto-extractible
│   ├── mdt-dashboard-vX.X.X-YYYYMMDD.sh      # Linux/macOS
│   ├── mdt-dashboard-vX.X.X-YYYYMMDD.ps1     # Windows PowerShell
│   ├── mdt-dashboard-vX.X.X-YYYYMMDD.tar.gz  # Archive Linux
│   └── mdt-dashboard-vX.X.X-YYYYMMDD.zip     # Archive Windows
└── scripts/
    ├── build-single-file.js       # Script Node.js (cross-platform)
    ├── build-single-file.ps1      # Script PowerShell (Windows)
    ├── create-self-extracting.sh  # Script Bash (Linux/macOS)
    └── create-self-extracting.ps1 # Script PowerShell (Windows)
```

## Technologies

- **React 18** - Interface utilisateur
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **Recharts** - Graphiques et visualisations

## Structure du Projet

```
SOUVERAINETE-NUMERIQUE/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   └── ModuleMDTRGPD.jsx    # Composant principal
│   ├── assets/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Onglets du Tableau de Bord

### 1. Questionnaire
Interface de saisie des 30 questions avec :
- Notation interactive (0, 1, 3, 5)
- Indicateurs visuels RGPD et critiques
- Coefficients de pondération

### 2. Scores par Axe
- Graphique en barres de la résilience par axe
- Vue radar du profil de résilience
- Barres de progression par domaine

### 3. KPI
- Cartes des 10 indicateurs clés
- Tableau des seuils d'alerte
- Statuts et actions requises

### 4. Analyse RGPD
- Score RGPD global
- Comparaison IDT Technique vs Juridique
- KPI RGPD détaillés
- Matrice de risques

### 5. Synthèse & IDT
- Vue globale des scores
- Jauge de niveau de dépendance
- Graphique de répartition
- Évolution des versions IDT

## Nouveautés v0.5

- Nouvel axe RGPD : 7 questions dédiées à la conformité juridique
- Pondération intelligente : Questions critiques avec coefficient multiplicateur
- IDT v2.0 : Calcul hybride (60% technique + 40% juridique)
- 3 nouveaux KPI : Maturité RGPD, Risque transfrontalier, Contractualisation
- Alertes critiques : Détection automatique des non-conformités majeures
- Analyse RGPD dédiée : Onglet spécifique avec matrice de risques
- **Application portable** : Fichier HTML unique auto-contenu (~730 KB)
- **Script auto-extractible** : Distribution facilitée sans installation requise

## Licence

MIT

## Contribution

Les contributions sont les bienvenues ! Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les guidelines.

## Support

Pour toute question ou suggestion, ouvrez une issue sur GitHub.
