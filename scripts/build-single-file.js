#!/usr/bin/env node
/**
 * Script de création d'un fichier HTML auto-contenu (single-file)
 * pour le Module MDT - Mesure de la Dépendance Technologique
 *
 * Ce script:
 * 1. Lance le build Vite standard
 * 2. Lit les fichiers générés (HTML, CSS, JS)
 * 3. Inline tout dans un seul fichier HTML portable
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const DIST_DIR = join(projectRoot, 'dist');
const OUTPUT_DIR = join(projectRoot, 'dist-portable');
const OUTPUT_FILE = join(OUTPUT_DIR, 'mdt-dashboard-rgpd-portable.html');

console.log('🚀 Module MDT - Création du fichier HTML portable');
console.log('================================================\n');

// Étape 1: Build Vite
console.log('📦 Étape 1/4: Build de production...');
try {
  execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
  console.log('✅ Build terminé\n');
} catch (error) {
  console.error('❌ Erreur lors du build:', error.message);
  process.exit(1);
}

// Étape 2: Lire les fichiers du build
console.log('📂 Étape 2/4: Lecture des fichiers générés...');

if (!existsSync(DIST_DIR)) {
  console.error('❌ Le dossier dist/ n\'existe pas');
  process.exit(1);
}

// Lire le fichier HTML principal
const htmlPath = join(DIST_DIR, 'index.html');
let htmlContent = readFileSync(htmlPath, 'utf-8');

// Trouver et lire les fichiers CSS et JS
const assetsDir = join(DIST_DIR, 'assets');
const assetFiles = existsSync(assetsDir) ? readdirSync(assetsDir) : [];

const cssFiles = assetFiles.filter(f => f.endsWith('.css'));
const jsFiles = assetFiles.filter(f => f.endsWith('.js'));

console.log(`   📄 Fichiers CSS trouvés: ${cssFiles.length}`);
console.log(`   📄 Fichiers JS trouvés: ${jsFiles.length}`);

// Lire le contenu CSS
let cssContent = '';
for (const cssFile of cssFiles) {
  const cssPath = join(assetsDir, cssFile);
  cssContent += readFileSync(cssPath, 'utf-8') + '\n';
  console.log(`   ✓ CSS: ${cssFile}`);
}

// Lire le contenu JS
let jsContent = '';
for (const jsFile of jsFiles) {
  const jsPath = join(assetsDir, jsFile);
  jsContent += readFileSync(jsPath, 'utf-8') + '\n';
  console.log(`   ✓ JS: ${jsFile}`);
}

console.log('✅ Fichiers lus\n');

// Étape 3: Créer le fichier HTML unique
console.log('🔧 Étape 3/4: Création du fichier HTML portable...');

// Supprimer les références externes CSS et JS
htmlContent = htmlContent.replace(/<link[^>]*rel="stylesheet"[^>]*href="[^"]*assets[^"]*"[^>]*>/gi, '');
htmlContent = htmlContent.replace(/<script[^>]*type="module"[^>]*src="[^"]*assets[^"]*"[^>]*><\/script>/gi, '');
htmlContent = htmlContent.replace(/<script[^>]*src="[^"]*assets[^"]*"[^>]*type="module"[^>]*><\/script>/gi, '');

// Injecter le CSS inline dans le head
const styleTag = `<style id="mdt-inline-styles">\n${cssContent}</style>`;
htmlContent = htmlContent.replace('</head>', `${styleTag}\n</head>`);

// Injecter le JS inline avant </body>
const scriptTag = `<script type="module" id="mdt-inline-script">\n${jsContent}</script>`;
htmlContent = htmlContent.replace('</body>', `${scriptTag}\n</body>`);

// Ajouter des métadonnées pour la version portable
const portableComment = `
<!--
  ═══════════════════════════════════════════════════════════════════════
  MODULE MDT - MESURE DE LA DÉPENDANCE TECHNOLOGIQUE v0.5
  ═══════════════════════════════════════════════════════════════════════

  🇫🇷 Application portable auto-contenue
  📅 Généré le: ${new Date().toISOString()}
  📋 Version: 0.5.0-portable

  Ce fichier HTML contient l'intégralité de l'application MDT:
  - Interface React complète
  - 30 questions d'évaluation (21 techniques + 9 RGPD)
  - 10 indicateurs clés de performance (KPI)
  - Calcul IDT v2.0 hybride (60% technique + 40% RGPD)
  - Visualisations interactives (graphiques, tableaux)

  📌 Instructions d'utilisation:
  1. Double-cliquez sur ce fichier pour l'ouvrir dans votre navigateur
  2. L'application fonctionne 100% hors-ligne
  3. Vos données restent locales (aucune transmission)

  🔒 Conformité RGPD:
  - Aucune collecte de données personnelles
  - Fonctionnement local uniquement
  - Pas de cookies ni de tracking

  ═══════════════════════════════════════════════════════════════════════
-->
`;

htmlContent = htmlContent.replace('<!DOCTYPE html>', `<!DOCTYPE html>\n${portableComment}`);

// Créer le dossier de sortie
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Écrire le fichier final
writeFileSync(OUTPUT_FILE, htmlContent, 'utf-8');
console.log('✅ Fichier HTML portable créé\n');

// Étape 4: Afficher les statistiques
console.log('📊 Étape 4/4: Statistiques...');
const stats = {
  htmlSize: Buffer.byteLength(htmlContent, 'utf-8'),
  cssSize: Buffer.byteLength(cssContent, 'utf-8'),
  jsSize: Buffer.byteLength(jsContent, 'utf-8')
};

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

console.log(`   📄 Taille CSS:  ${formatSize(stats.cssSize)}`);
console.log(`   📄 Taille JS:   ${formatSize(stats.jsSize)}`);
console.log(`   📄 Taille totale: ${formatSize(stats.htmlSize)}`);
console.log(`\n   📁 Fichier généré: ${OUTPUT_FILE}`);

console.log('\n═══════════════════════════════════════════════════════════════════════');
console.log('✨ SUCCÈS: Fichier HTML portable créé !');
console.log('═══════════════════════════════════════════════════════════════════════');
console.log(`\n📌 Pour utiliser l'application:`);
console.log(`   1. Ouvrez le fichier dans un navigateur web`);
console.log(`   2. Partagez-le par email, USB, ou tout autre moyen`);
console.log(`   3. Aucune installation requise\n`);
