@echo off
title Vexel 3D - Lanzador de Servidores
echo.
echo  ==========================================
echo   VEXEL 3D - Iniciando servidores...
echo  ==========================================
echo.
echo  [1] App Editor    -^>  http://localhost:8002
echo  [2] Centro Info   -^>  http://localhost:8003
echo.
echo  Abre tu navegador en esas direcciones.
echo  Cierra esta ventana para apagar TODO.
echo.

:: Servidor App Editor (puerto 8002)
start "App Vexel 3D - Puerto 8002" cmd /k "node "%~dp0server.js" 8002 "%~dp0app vexel""

:: Servidor Centro de Informacion (puerto 8001)  
start "Centro Informacion - Puerto 8003" cmd /k "node "%~dp0server.js" 8003 "%~dp0""

timeout /t 2 >nul
start "" "http://localhost:8002"
start "" "http://localhost:8003"

echo  Ambos navegadores abiertos. ^(Ctrl+C en cada ventana para detener^)
pause
