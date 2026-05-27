@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo No se encontro Node.js. Instala Node.js o ejecuta el generador desde un entorno que lo tenga disponible.
  pause
  exit /b 1
)
node tools\generate-gallery-data.js
pause
