@echo off
REM Ejecutar servidor PowerShell
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor.ps1"
pause
