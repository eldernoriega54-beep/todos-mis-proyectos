@echo off
REM Ejecutar servidor CENTRO (puerto 8001)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0servidor_centro.ps1"
pause
