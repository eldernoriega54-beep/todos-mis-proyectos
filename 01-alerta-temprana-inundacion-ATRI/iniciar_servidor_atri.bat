@echo off
title SERVIDOR PUENTE LAN - SISTEMA ATRI
color 0B
echo ========================================================
echo        SISTEMA DE ALERTA TEMPRANA ATRI (PUENTE LAN)
echo ========================================================
echo.
echo Iniciando receptor TCP en puerto 5000...
echo Esperando senales del PLC Siemens S7-1200...
echo Las alertas se enviaran automaticamente a la app del celular.
echo.
python "d:\aplicacion A.T.R.I\servidor_puente_atri.py"
pause
