<#
.SYNOPSIS
    Script de creation d'un fichier HTML auto-contenu (single-file)
    pour le Module MDT - Mesure de la Dependance Technologique

.DESCRIPTION
    Ce script:
    1. Lance le build Vite standard
    2. Lit les fichiers generes (HTML, CSS, JS)
    3. Inline tout dans un seul fichier HTML portable

.EXAMPLE
    .\build-single-file.ps1
#>

$ErrorActionPreference = "Stop"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptPath

$DIST_DIR = Join-Path $projectRoot "dist"
$OUTPUT_DIR = Join-Path $projectRoot "dist-portable"
$OUTPUT_FILE = Join-Path $OUTPUT_DIR "mdt-dashboard-rgpd-portable.html"

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  Module MDT - Creation du fichier HTML portable" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# Etape 1: Build Vite
Write-Host "[1/4] Build de production..." -ForegroundColor Yellow
try {
    Push-Location $projectRoot
    npm run build
    Pop-Location
    Write-Host "      Build termine" -ForegroundColor Green
} catch {
    Write-Host "      Erreur lors du build: $_" -ForegroundColor Red
    exit 1
}

# Etape 2: Lire les fichiers du build
Write-Host ""
Write-Host "[2/4] Lecture des fichiers generes..." -ForegroundColor Yellow

if (-not (Test-Path $DIST_DIR)) {
    Write-Host "      Erreur: Le dossier dist/ n'existe pas" -ForegroundColor Red
    exit 1
}

# Lire le fichier HTML principal
$htmlPath = Join-Path $DIST_DIR "index.html"
$htmlContent = Get-Content -Path $htmlPath -Raw -Encoding UTF8

# Trouver et lire les fichiers CSS et JS
$assetsDir = Join-Path $DIST_DIR "assets"
$cssFiles = @()
$jsFiles = @()

if (Test-Path $assetsDir) {
    $cssFiles = Get-ChildItem -Path $assetsDir -Filter "*.css"
    $jsFiles = Get-ChildItem -Path $assetsDir -Filter "*.js"
}

Write-Host "      Fichiers CSS trouves: $($cssFiles.Count)" -ForegroundColor Gray
Write-Host "      Fichiers JS trouves: $($jsFiles.Count)" -ForegroundColor Gray

# Lire le contenu CSS
$cssContent = ""
foreach ($cssFile in $cssFiles) {
    $cssContent += (Get-Content -Path $cssFile.FullName -Raw -Encoding UTF8) + "`n"
    Write-Host "      + CSS: $($cssFile.Name)" -ForegroundColor Gray
}

# Lire le contenu JS
$jsContent = ""
foreach ($jsFile in $jsFiles) {
    $jsContent += (Get-Content -Path $jsFile.FullName -Raw -Encoding UTF8) + "`n"
    Write-Host "      + JS: $($jsFile.Name)" -ForegroundColor Gray
}

Write-Host "      Fichiers lus" -ForegroundColor Green

# Etape 3: Creer le fichier HTML unique
Write-Host ""
Write-Host "[3/4] Creation du fichier HTML portable..." -ForegroundColor Yellow

# Supprimer les references externes CSS et JS
$htmlContent = $htmlContent -replace '<link[^>]*rel="stylesheet"[^>]*href="[^"]*assets[^"]*"[^>]*>', ''
$htmlContent = $htmlContent -replace '<script[^>]*type="module"[^>]*src="[^"]*assets[^"]*"[^>]*></script>', ''
$htmlContent = $htmlContent -replace '<script[^>]*src="[^"]*assets[^"]*"[^>]*type="module"[^>]*></script>', ''

# Injecter le CSS inline dans le head
$styleTag = "<style id=`"mdt-inline-styles`">`n$cssContent</style>"
$htmlContent = $htmlContent -replace '</head>', "$styleTag`n</head>"

# Injecter le JS inline avant </body>
$scriptTag = "<script type=`"module`" id=`"mdt-inline-script`">`n$jsContent</script>"
$htmlContent = $htmlContent -replace '</body>', "$scriptTag`n</body>"

# Ajouter des metadonnees pour la version portable
$date = Get-Date -Format "yyyy-MM-ddTHH:mm:ss"
$portableComment = @"

<!--
  =====================================================================
  MODULE MDT - MESURE DE LA DEPENDANCE TECHNOLOGIQUE v0.5
  =====================================================================

  Application portable auto-contenue
  Genere le: $date
  Version: 0.5.0-portable

  Ce fichier HTML contient l'integralite de l'application MDT:
  - Interface React complete
  - 30 questions d'evaluation (21 techniques + 9 RGPD)
  - 10 indicateurs cles de performance (KPI)
  - Calcul IDT v2.0 hybride (60% technique + 40% RGPD)
  - Visualisations interactives (graphiques, tableaux)

  Instructions d'utilisation:
  1. Double-cliquez sur ce fichier pour l'ouvrir dans votre navigateur
  2. L'application fonctionne 100% hors-ligne
  3. Vos donnees restent locales (aucune transmission)

  Conformite RGPD:
  - Aucune collecte de donnees personnelles
  - Fonctionnement local uniquement
  - Pas de cookies ni de tracking

  =====================================================================
-->

"@

$htmlContent = $htmlContent -replace '<!DOCTYPE html>', "<!DOCTYPE html>$portableComment"

# Creer le dossier de sortie
if (-not (Test-Path $OUTPUT_DIR)) {
    New-Item -ItemType Directory -Path $OUTPUT_DIR -Force | Out-Null
}

# Ecrire le fichier final
Set-Content -Path $OUTPUT_FILE -Value $htmlContent -Encoding UTF8
Write-Host "      Fichier HTML portable cree" -ForegroundColor Green

# Etape 4: Afficher les statistiques
Write-Host ""
Write-Host "[4/4] Statistiques..." -ForegroundColor Yellow

$htmlSize = (Get-Item $OUTPUT_FILE).Length
$cssSize = [System.Text.Encoding]::UTF8.GetByteCount($cssContent)
$jsSize = [System.Text.Encoding]::UTF8.GetByteCount($jsContent)

function Format-FileSize {
    param([long]$bytes)
    if ($bytes -lt 1024) { return "$bytes B" }
    if ($bytes -lt 1024*1024) { return "{0:N2} KB" -f ($bytes/1024) }
    return "{0:N2} MB" -f ($bytes/(1024*1024))
}

Write-Host "      Taille CSS:    $(Format-FileSize $cssSize)" -ForegroundColor Gray
Write-Host "      Taille JS:     $(Format-FileSize $jsSize)" -ForegroundColor Gray
Write-Host "      Taille totale: $(Format-FileSize $htmlSize)" -ForegroundColor Gray
Write-Host ""
Write-Host "      Fichier genere: $OUTPUT_FILE" -ForegroundColor Cyan

Write-Host ""
Write-Host "======================================================" -ForegroundColor Green
Write-Host "  SUCCES: Fichier HTML portable cree !" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Pour utiliser l'application:" -ForegroundColor White
Write-Host "  1. Ouvrez le fichier dans un navigateur web" -ForegroundColor Gray
Write-Host "  2. Partagez-le par email, USB, ou tout autre moyen" -ForegroundColor Gray
Write-Host "  3. Aucune installation requise" -ForegroundColor Gray
Write-Host ""
