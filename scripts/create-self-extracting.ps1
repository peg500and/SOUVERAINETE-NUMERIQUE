<#
.SYNOPSIS
    Module MDT - Creation de l'application auto-extractible (Windows)

.DESCRIPTION
    Ce script cree une application auto-extractible contenant:
    - Le fichier HTML portable (single-file)
    - Un script de lancement PowerShell
    - Documentation et instructions

    L'archive auto-extractible peut etre distribuee comme un seul fichier
    qui s'extrait et lance l'application automatiquement.

.EXAMPLE
    .\create-self-extracting.ps1
#>

$ErrorActionPreference = "Stop"
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptPath

$VERSION = "0.5.0"
$DATE = Get-Date -Format "yyyyMMdd"
$DIST_PORTABLE = Join-Path $projectRoot "dist-portable"
$OUTPUT_DIR = Join-Path $projectRoot "dist-self-extracting"
$TEMP_DIR = Join-Path $OUTPUT_DIR "temp-package"

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  MODULE MDT - CREATION APPLICATION AUTO-EXTRACTIBLE" -ForegroundColor Cyan
Write-Host "  Version: $VERSION" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

# Verifier que le fichier HTML portable existe
$portableHtml = Join-Path $DIST_PORTABLE "mdt-dashboard-rgpd-portable.html"
if (-not (Test-Path $portableHtml)) {
    Write-Host "Le fichier HTML portable n'existe pas." -ForegroundColor Yellow
    Write-Host "Generation du fichier portable..." -ForegroundColor Blue
    & (Join-Path $scriptPath "build-single-file.ps1")
}

# Creer les repertoires de sortie
Write-Host "[1/5] Preparation des repertoires..." -ForegroundColor Yellow
if (Test-Path $TEMP_DIR) {
    Remove-Item -Path $TEMP_DIR -Recurse -Force
}
New-Item -ItemType Directory -Path $TEMP_DIR -Force | Out-Null
if (-not (Test-Path $OUTPUT_DIR)) {
    New-Item -ItemType Directory -Path $OUTPUT_DIR -Force | Out-Null
}

# Copier le fichier HTML portable
Write-Host "[2/5] Copie du fichier HTML portable..." -ForegroundColor Yellow
Copy-Item -Path $portableHtml -Destination (Join-Path $TEMP_DIR "index.html")

# Creer le script de lancement PowerShell
Write-Host "[3/5] Creation du script de lancement..." -ForegroundColor Yellow

$launcherContent = @'
<#
.SYNOPSIS
    MODULE MDT - Script de lancement

.DESCRIPTION
    Lance l'application MDT dans le navigateur par defaut

.EXAMPLE
    .\lancer-mdt.ps1
    .\lancer-mdt.ps1 -Server
#>

param(
    [switch]$Server,
    [int]$Port = 8080
)

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$htmlFile = Join-Path $scriptPath "index.html"

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  MODULE MDT - MESURE DE LA DEPENDANCE TECHNOLOGIQUE v0.5" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $htmlFile)) {
    Write-Host "Erreur: Le fichier index.html n'a pas ete trouve." -ForegroundColor Red
    exit 1
}

if ($Server) {
    Write-Host "Demarrage du serveur web local sur le port $Port..." -ForegroundColor Yellow
    Write-Host "URL: http://localhost:$Port" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Appuyez sur Ctrl+C pour arreter le serveur." -ForegroundColor Gray
    Write-Host ""

    # Utiliser Python si disponible
    $python = Get-Command python -ErrorAction SilentlyContinue
    $python3 = Get-Command python3 -ErrorAction SilentlyContinue

    Push-Location $scriptPath
    if ($python3) {
        & python3 -m http.server $Port
    } elseif ($python) {
        & python -m http.server $Port
    } else {
        Write-Host "Python non trouve. Ouverture directe du fichier..." -ForegroundColor Yellow
        Start-Process $htmlFile
    }
    Pop-Location
} else {
    Write-Host "Ouverture dans le navigateur..." -ForegroundColor Yellow
    Start-Process $htmlFile
    Write-Host ""
    Write-Host "L'application a ete lancee dans votre navigateur." -ForegroundColor Green
}

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
'@

Set-Content -Path (Join-Path $TEMP_DIR "lancer-mdt.ps1") -Value $launcherContent -Encoding UTF8

# Creer le fichier batch Windows
$batchContent = @"
@echo off
chcp 65001 >nul
echo.
echo ======================================================================
echo   MODULE MDT - MESURE DE LA DEPENDANCE TECHNOLOGIQUE v0.5
echo ======================================================================
echo.
echo Ouverture dans le navigateur par defaut...
start "" "%~dp0index.html"
echo.
echo L'application a ete lancee dans votre navigateur.
echo.
pause
"@

Set-Content -Path (Join-Path $TEMP_DIR "lancer-mdt.bat") -Value $batchContent -Encoding UTF8

# Creer le fichier README
$readmeContent = @"
======================================================================
  MODULE MDT - MESURE DE LA DEPENDANCE TECHNOLOGIQUE
  Version $VERSION - Application Auto-Extractible
======================================================================

DESCRIPTION
----------------------------------------------------------------------
Le Module MDT est un outil d'evaluation de la dependance technologique
et de la conformite RGPD des systemes d'information.

INSTALLATION
----------------------------------------------------------------------
Aucune installation requise ! L'application est 100% portable.

UTILISATION
----------------------------------------------------------------------

  METHODE 1 (Recommandee):
  Double-cliquez sur le fichier "index.html" pour l'ouvrir
  dans votre navigateur web par defaut.

  METHODE 2 (Windows - PowerShell):
  Executez: .\lancer-mdt.ps1

  METHODE 3 (Windows - Batch):
  Double-cliquez sur "lancer-mdt.bat"

CONTENU DE L'ARCHIVE
----------------------------------------------------------------------
  - index.html        : Application MDT complete (fichier unique)
  - lancer-mdt.ps1    : Script de lancement PowerShell
  - lancer-mdt.bat    : Script de lancement Windows
  - LISEZ-MOI.txt     : Cette documentation

CONFIDENTIALITE & RGPD
----------------------------------------------------------------------
  - Fonctionnement 100% local (aucune connexion internet requise)
  - Aucune donnee transmise a des serveurs externes
  - Pas de cookies ni de tracking
  - Vos reponses restent sur votre ordinateur

CONFIGURATION REQUISE
----------------------------------------------------------------------
  - Navigateur web moderne (Chrome, Firefox, Safari, Edge)
  - JavaScript active
  - Aucune autre dependance

======================================================================
  (c) Souverainete Numerique - Licence MIT
======================================================================
"@

Set-Content -Path (Join-Path $TEMP_DIR "LISEZ-MOI.txt") -Value $readmeContent -Encoding UTF8

# Creer l'archive ZIP
Write-Host "[4/5] Creation de l'archive ZIP..." -ForegroundColor Yellow
$zipName = "mdt-dashboard-v$VERSION-$DATE.zip"
$zipPath = Join-Path $OUTPUT_DIR $zipName

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

Compress-Archive -Path "$TEMP_DIR\*" -DestinationPath $zipPath -CompressionLevel Optimal

# Creer le script auto-extractible PowerShell
Write-Host "[5/5] Creation du script auto-extractible..." -ForegroundColor Yellow

$selfExtractName = "mdt-dashboard-v$VERSION-$DATE.ps1"
$selfExtractPath = Join-Path $OUTPUT_DIR $selfExtractName

# Encoder le ZIP en Base64
$zipBytes = [System.IO.File]::ReadAllBytes($zipPath)
$zipBase64 = [System.Convert]::ToBase64String($zipBytes)

$selfExtractContent = @"
<#
.SYNOPSIS
    MODULE MDT - Application Auto-Extractible
    Mesure de la Dependance Technologique & Conformite RGPD

.DESCRIPTION
    Ce fichier contient l'application MDT complete.
    Il s'extrait automatiquement et lance l'application.

.PARAMETER ExtractOnly
    Extraire sans lancer l'application

.PARAMETER Target
    Specifier le repertoire d'extraction

.EXAMPLE
    .\mdt-dashboard-v$VERSION-$DATE.ps1
    .\mdt-dashboard-v$VERSION-$DATE.ps1 -ExtractOnly
    .\mdt-dashboard-v$VERSION-$DATE.ps1 -Target "C:\MonDossier"
#>

param(
    [switch]`$ExtractOnly,
    [string]`$Target = "`$env:USERPROFILE\mdt-dashboard"
)

`$VERSION = "$VERSION"

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  MODULE MDT - MESURE DE LA DEPENDANCE TECHNOLOGIQUE v`$VERSION" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

# Donnees de l'archive encodee en Base64
`$zipBase64 = @"
$zipBase64
"@

Write-Host "Extraction vers: `$Target" -ForegroundColor Yellow

# Creer le repertoire cible
if (-not (Test-Path `$Target)) {
    New-Item -ItemType Directory -Path `$Target -Force | Out-Null
}

# Decoder et extraire
try {
    `$zipBytes = [System.Convert]::FromBase64String(`$zipBase64)
    `$tempZip = Join-Path `$env:TEMP "mdt-temp-`$([guid]::NewGuid()).zip"
    [System.IO.File]::WriteAllBytes(`$tempZip, `$zipBytes)

    Expand-Archive -Path `$tempZip -DestinationPath `$Target -Force
    Remove-Item `$tempZip -Force

    Write-Host "Extraction reussie!" -ForegroundColor Green
} catch {
    Write-Host "Erreur lors de l'extraction: `$_" -ForegroundColor Red
    exit 1
}

if (`$ExtractOnly) {
    Write-Host ""
    Write-Host "Application extraite vers: `$Target" -ForegroundColor Cyan
    Write-Host "Pour lancer: & '`$Target\lancer-mdt.ps1'" -ForegroundColor Gray
    Write-Host ""
    exit 0
}

# Lancer l'application
Write-Host ""
Write-Host "Lancement de l'application..." -ForegroundColor Yellow

`$htmlFile = Join-Path `$Target "index.html"
Start-Process `$htmlFile

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "  L'application MDT a ete lancee dans votre navigateur." -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Emplacement des fichiers: `$Target" -ForegroundColor Cyan
Write-Host "Pour relancer: & '`$Target\lancer-mdt.ps1'" -ForegroundColor Gray
Write-Host ""
"@

Set-Content -Path $selfExtractPath -Value $selfExtractContent -Encoding UTF8

# Nettoyer les fichiers temporaires
Write-Host ""
Write-Host "Nettoyage..." -ForegroundColor Gray
Remove-Item -Path $TEMP_DIR -Recurse -Force

# Statistiques
$zipSize = (Get-Item $zipPath).Length
$selfExtractSize = (Get-Item $selfExtractPath).Length

function Format-FileSize {
    param([long]$bytes)
    if ($bytes -lt 1024) { return "$bytes B" }
    if ($bytes -lt 1024*1024) { return "{0:N0} KB" -f ($bytes/1024) }
    return "{0:N2} MB" -f ($bytes/(1024*1024))
}

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "  SUCCES: Application auto-extractible creee!" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Fichiers generes:" -ForegroundColor Cyan
Write-Host "  Archive ZIP:        $zipPath ($(Format-FileSize $zipSize))" -ForegroundColor Gray
Write-Host "  Auto-extractible:   $selfExtractPath ($(Format-FileSize $selfExtractSize))" -ForegroundColor Gray
Write-Host ""
Write-Host "Pour distribuer l'application:" -ForegroundColor Cyan
Write-Host "  1. Partagez le fichier: $selfExtractName" -ForegroundColor Gray
Write-Host "  2. L'utilisateur execute: .\$selfExtractName" -ForegroundColor Gray
Write-Host "  3. L'application s'extrait et se lance automatiquement" -ForegroundColor Gray
Write-Host ""
Write-Host "Options du script auto-extractible:" -ForegroundColor Cyan
Write-Host "  -ExtractOnly    Extraire sans lancer" -ForegroundColor Gray
Write-Host "  -Target DIR     Specifier le repertoire d'extraction" -ForegroundColor Gray
Write-Host ""
