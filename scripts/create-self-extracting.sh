#!/bin/bash
#═══════════════════════════════════════════════════════════════════════════════
# MODULE MDT - CRÉATION DE L'APPLICATION AUTO-EXTRACTIBLE
#═══════════════════════════════════════════════════════════════════════════════
#
# Ce script crée une application auto-extractible contenant:
# - Le fichier HTML portable (single-file)
# - Un serveur web Python intégré (optionnel)
# - Documentation et instructions
#
# L'archive auto-extractible peut être distribuée comme un seul fichier
# qui s'extrait et lance l'application automatiquement.
#
#═══════════════════════════════════════════════════════════════════════════════

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Répertoires
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DIST_PORTABLE="$PROJECT_ROOT/dist-portable"
OUTPUT_DIR="$PROJECT_ROOT/dist-self-extracting"
TEMP_DIR="$OUTPUT_DIR/temp-package"
VERSION="0.5.0"
DATE=$(date +%Y%m%d)

echo -e "${CYAN}"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo "  MODULE MDT - CRÉATION APPLICATION AUTO-EXTRACTIBLE"
echo "  Version: $VERSION"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo -e "${NC}"

# Vérifier que le fichier HTML portable existe
if [ ! -f "$DIST_PORTABLE/mdt-dashboard-rgpd-portable.html" ]; then
    echo -e "${YELLOW}⚠️  Le fichier HTML portable n'existe pas.${NC}"
    echo -e "${BLUE}📦 Génération du fichier portable...${NC}"
    cd "$PROJECT_ROOT"
    node scripts/build-single-file.js
fi

# Créer les répertoires de sortie
echo -e "\n${BLUE}📁 Préparation des répertoires...${NC}"
rm -rf "$TEMP_DIR"
mkdir -p "$TEMP_DIR"
mkdir -p "$OUTPUT_DIR"

# Copier le fichier HTML portable
echo -e "${BLUE}📄 Copie du fichier HTML portable...${NC}"
cp "$DIST_PORTABLE/mdt-dashboard-rgpd-portable.html" "$TEMP_DIR/index.html"

# Créer le script de lancement
echo -e "${BLUE}🚀 Création du script de lancement...${NC}"
cat > "$TEMP_DIR/lancer-mdt.sh" << 'LAUNCHER_EOF'
#!/bin/bash
#═══════════════════════════════════════════════════════════════════════════════
# MODULE MDT - SCRIPT DE LANCEMENT
#═══════════════════════════════════════════════════════════════════════════════

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HTML_FILE="$SCRIPT_DIR/index.html"
PORT=8080

echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"
echo "  🇫🇷 MODULE MDT - MESURE DE LA DÉPENDANCE TECHNOLOGIQUE v0.5"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""

# Vérifier que le fichier HTML existe
if [ ! -f "$HTML_FILE" ]; then
    echo "❌ Erreur: Le fichier index.html n'a pas été trouvé."
    exit 1
fi

# Option 1: Ouvrir directement dans le navigateur (recommandé)
echo "📌 Options de lancement:"
echo ""
echo "  [1] Ouvrir directement dans le navigateur (recommandé)"
echo "  [2] Démarrer un serveur web local (port $PORT)"
echo "  [3] Afficher le chemin du fichier"
echo ""
read -p "Votre choix [1-3]: " choice

case $choice in
    1)
        echo ""
        echo "🌐 Ouverture dans le navigateur..."
        if command -v xdg-open &> /dev/null; then
            xdg-open "$HTML_FILE"
        elif command -v open &> /dev/null; then
            open "$HTML_FILE"
        elif command -v start &> /dev/null; then
            start "$HTML_FILE"
        else
            echo "📂 Ouvrez ce fichier dans votre navigateur:"
            echo "   $HTML_FILE"
        fi
        ;;
    2)
        echo ""
        echo "🖥️  Démarrage du serveur web local sur le port $PORT..."
        echo "   URL: http://localhost:$PORT"
        echo ""
        echo "   Appuyez sur Ctrl+C pour arrêter le serveur."
        echo ""
        cd "$SCRIPT_DIR"
        if command -v python3 &> /dev/null; then
            python3 -m http.server $PORT
        elif command -v python &> /dev/null; then
            python -m SimpleHTTPServer $PORT 2>/dev/null || python -m http.server $PORT
        elif command -v php &> /dev/null; then
            php -S localhost:$PORT
        else
            echo "❌ Aucun serveur web disponible (Python/PHP requis)"
            echo "   Utilisez l'option 1 pour ouvrir directement le fichier."
        fi
        ;;
    3)
        echo ""
        echo "📂 Chemin du fichier HTML:"
        echo "   $HTML_FILE"
        echo ""
        echo "   Copiez ce chemin et ouvrez-le dans votre navigateur."
        ;;
    *)
        echo "Option invalide. Ouverture directe par défaut..."
        if command -v xdg-open &> /dev/null; then
            xdg-open "$HTML_FILE"
        fi
        ;;
esac

echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"
LAUNCHER_EOF

chmod +x "$TEMP_DIR/lancer-mdt.sh"

# Créer le script Windows (batch)
echo -e "${BLUE}🪟 Création du script Windows...${NC}"
cat > "$TEMP_DIR/lancer-mdt.bat" << 'BATCH_EOF'
@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════════════════════════════
echo   MODULE MDT - MESURE DE LA DEPENDANCE TECHNOLOGIQUE v0.5
echo ═══════════════════════════════════════════════════════════════════════════════
echo.
echo Ouverture dans le navigateur par defaut...
start "" "%~dp0index.html"
echo.
echo L'application a ete lancee dans votre navigateur.
echo.
pause
BATCH_EOF

# Créer le fichier README
echo -e "${BLUE}📝 Création de la documentation...${NC}"
cat > "$TEMP_DIR/LISEZ-MOI.txt" << 'README_EOF'
═══════════════════════════════════════════════════════════════════════════════
  MODULE MDT - MESURE DE LA DÉPENDANCE TECHNOLOGIQUE
  Version 0.5.0 - Application Auto-Extractible
═══════════════════════════════════════════════════════════════════════════════

📋 DESCRIPTION
─────────────────────────────────────────────────────────────────────────────────
Le Module MDT est un outil d'évaluation de la dépendance technologique et de
la conformité RGPD des systèmes d'information. Il permet de:

  • Évaluer la résilience numérique sur 6 axes (30 questions)
  • Analyser la conformité RGPD (9 questions dédiées)
  • Calculer l'Indice de Dépendance Technologique (IDT v2.0)
  • Visualiser 10 indicateurs clés de performance (KPI)
  • Identifier les risques critiques et alertes

🚀 INSTALLATION
─────────────────────────────────────────────────────────────────────────────────
Aucune installation requise ! L'application est 100% portable.

📌 UTILISATION
─────────────────────────────────────────────────────────────────────────────────

  MÉTHODE 1 (Recommandée):
  ────────────────────────
  Double-cliquez simplement sur le fichier "index.html" pour l'ouvrir
  dans votre navigateur web par défaut.

  MÉTHODE 2 (Linux/macOS):
  ────────────────────────
  Exécutez le script de lancement:
    $ ./lancer-mdt.sh

  MÉTHODE 3 (Windows):
  ────────────────────
  Double-cliquez sur "lancer-mdt.bat"

📂 CONTENU DE L'ARCHIVE
─────────────────────────────────────────────────────────────────────────────────
  • index.html        - Application MDT complète (fichier unique)
  • lancer-mdt.sh     - Script de lancement Linux/macOS
  • lancer-mdt.bat    - Script de lancement Windows
  • LISEZ-MOI.txt     - Cette documentation

🔒 CONFIDENTIALITÉ & RGPD
─────────────────────────────────────────────────────────────────────────────────
  • Fonctionnement 100% local (aucune connexion internet requise)
  • Aucune donnée transmise à des serveurs externes
  • Pas de cookies ni de tracking
  • Vos réponses restent sur votre ordinateur

💡 FONCTIONNALITÉS
─────────────────────────────────────────────────────────────────────────────────

  QUESTIONNAIRE (30 questions):
  • 21 questions techniques (axes 1-5)
  • 9 questions RGPD (axe 6)
  • Pondération intelligente des questions critiques

  6 AXES D'ÉVALUATION:
  1. Dépendance Fournisseurs
  2. Dépendance Opérateurs
  3. Dépendance Données & IA
  4. Dépendance Contractuelle
  5. Dépendance Opérationnelle
  6. Dépendance Juridique & RGPD

  10 INDICATEURS CLÉS (KPI):
  • Score Global de Résilience
  • Indice de Concentration Fournisseurs
  • Indice de Souveraineté des Données
  • Indice de Réversibilité
  • Maturité RGPD
  • Et plus...

  CALCUL IDT v2.0:
  • 60% score technique
  • 40% score RGPD/juridique
  • Interprétation automatique du niveau de dépendance

⚙️ CONFIGURATION REQUISE
─────────────────────────────────────────────────────────────────────────────────
  • Navigateur web moderne (Chrome, Firefox, Safari, Edge)
  • JavaScript activé
  • Aucune autre dépendance

📧 SUPPORT
─────────────────────────────────────────────────────────────────────────────────
Pour toute question ou suggestion, consultez le dépôt GitHub du projet.

═══════════════════════════════════════════════════════════════════════════════
  © Souveraineté Numérique - Licence MIT
═══════════════════════════════════════════════════════════════════════════════
README_EOF

# Créer l'archive tar.gz
echo -e "\n${BLUE}📦 Création de l'archive compressée...${NC}"
ARCHIVE_NAME="mdt-dashboard-v${VERSION}-${DATE}.tar.gz"
cd "$TEMP_DIR"
tar -czf "$OUTPUT_DIR/$ARCHIVE_NAME" .

# Créer le script auto-extractible
echo -e "${BLUE}🔧 Création du script auto-extractible...${NC}"
SELF_EXTRACT_FILE="$OUTPUT_DIR/mdt-dashboard-v${VERSION}-${DATE}.sh"

cat > "$SELF_EXTRACT_FILE" << 'SELF_EXTRACT_HEADER'
#!/bin/bash
#═══════════════════════════════════════════════════════════════════════════════
#  MODULE MDT - APPLICATION AUTO-EXTRACTIBLE
#  Mesure de la Dépendance Technologique & Conformité RGPD
#═══════════════════════════════════════════════════════════════════════════════
#
#  Ce fichier contient l'application MDT complète.
#  Il s'extrait automatiquement et lance l'application.
#
#  Usage: ./mdt-dashboard-vX.X.X-YYYYMMDD.sh [--extract-only] [--help]
#
#═══════════════════════════════════════════════════════════════════════════════

VERSION="0.5.0"
EXTRACT_DIR="${HOME}/mdt-dashboard"
ARCHIVE_MARKER="__ARCHIVE_BELOW__"

show_help() {
    echo ""
    echo "MODULE MDT - Application Auto-Extractible v$VERSION"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --extract-only    Extraire sans lancer l'application"
    echo "  --target DIR      Extraire vers un répertoire spécifique"
    echo "  --help            Afficher cette aide"
    echo ""
    exit 0
}

# Traitement des arguments
EXTRACT_ONLY=false
while [[ $# -gt 0 ]]; do
    case $1 in
        --extract-only)
            EXTRACT_ONLY=true
            shift
            ;;
        --target)
            EXTRACT_DIR="$2"
            shift 2
            ;;
        --help|-h)
            show_help
            ;;
        *)
            shift
            ;;
    esac
done

echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"
echo "  🇫🇷 MODULE MDT - MESURE DE LA DÉPENDANCE TECHNOLOGIQUE v$VERSION"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""

# Trouver la ligne de début de l'archive
SCRIPT_PATH="$(realpath "$0")"
ARCHIVE_LINE=$(grep -n "^$ARCHIVE_MARKER" "$SCRIPT_PATH" | cut -d: -f1)

if [ -z "$ARCHIVE_LINE" ]; then
    echo "❌ Erreur: Archive non trouvée dans le script."
    exit 1
fi

# Créer le répertoire d'extraction
echo "📂 Extraction vers: $EXTRACT_DIR"
mkdir -p "$EXTRACT_DIR"

# Extraire l'archive
ARCHIVE_START=$((ARCHIVE_LINE + 1))
tail -n +$ARCHIVE_START "$SCRIPT_PATH" | base64 -d | tar -xzf - -C "$EXTRACT_DIR"

if [ $? -eq 0 ]; then
    echo "✅ Extraction réussie!"
else
    echo "❌ Erreur lors de l'extraction."
    exit 1
fi

if [ "$EXTRACT_ONLY" = true ]; then
    echo ""
    echo "📌 Application extraite vers: $EXTRACT_DIR"
    echo "   Pour lancer: cd $EXTRACT_DIR && ./lancer-mdt.sh"
    echo ""
    exit 0
fi

# Lancer l'application
echo ""
echo "🚀 Lancement de l'application..."
echo ""

HTML_FILE="$EXTRACT_DIR/index.html"

# Ouvrir dans le navigateur
if command -v xdg-open &> /dev/null; then
    xdg-open "$HTML_FILE"
elif command -v open &> /dev/null; then
    open "$HTML_FILE"
elif command -v start &> /dev/null; then
    start "$HTML_FILE"
else
    echo "📂 Ouvrez ce fichier dans votre navigateur:"
    echo "   $HTML_FILE"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"
echo "✨ L'application MDT a été lancée dans votre navigateur."
echo ""
echo "📌 Emplacement des fichiers: $EXTRACT_DIR"
echo "   Pour relancer: cd $EXTRACT_DIR && ./lancer-mdt.sh"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""

exit 0

__ARCHIVE_BELOW__
SELF_EXTRACT_HEADER

# Ajouter l'archive encodée en base64
echo -e "${BLUE}📎 Encodage et ajout de l'archive...${NC}"
base64 "$OUTPUT_DIR/$ARCHIVE_NAME" >> "$SELF_EXTRACT_FILE"

# Rendre le script exécutable
chmod +x "$SELF_EXTRACT_FILE"

# Nettoyer les fichiers temporaires
echo -e "${BLUE}🧹 Nettoyage...${NC}"
rm -rf "$TEMP_DIR"

# Statistiques
ARCHIVE_SIZE=$(du -h "$OUTPUT_DIR/$ARCHIVE_NAME" | cut -f1)
SELF_EXTRACT_SIZE=$(du -h "$SELF_EXTRACT_FILE" | cut -f1)

echo -e "\n${GREEN}═══════════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✨ SUCCÈS: Application auto-extractible créée!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${CYAN}📊 Fichiers générés:${NC}"
echo "   📦 Archive:          $OUTPUT_DIR/$ARCHIVE_NAME ($ARCHIVE_SIZE)"
echo "   🚀 Auto-extractible: $SELF_EXTRACT_FILE ($SELF_EXTRACT_SIZE)"
echo ""
echo -e "${CYAN}📌 Pour distribuer l'application:${NC}"
echo "   1. Partagez le fichier: $(basename "$SELF_EXTRACT_FILE")"
echo "   2. L'utilisateur exécute: ./$(basename "$SELF_EXTRACT_FILE")"
echo "   3. L'application s'extrait et se lance automatiquement"
echo ""
echo -e "${CYAN}📌 Options du script auto-extractible:${NC}"
echo "   --extract-only    Extraire sans lancer"
echo "   --target DIR      Spécifier le répertoire d'extraction"
echo "   --help            Afficher l'aide"
echo ""
