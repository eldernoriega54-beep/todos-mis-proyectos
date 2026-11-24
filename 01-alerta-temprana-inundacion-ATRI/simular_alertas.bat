@echo off
:menu
cls
echo ==========================================
echo      SIMULADOR DE ALERTAS A.T.R.I.
echo ==========================================
echo 1. Alerta Verde
echo 2. Alerta Amarilla
echo 3. Alerta Roja
echo 4. Salir
echo ==========================================
set /p nivel="Selecciona el nivel de alerta (1-3): "
if "%nivel%"=="4" goto :eof
echo.
echo Enviando alerta nivel %nivel% al dispositivo...
if "%nivel%"=="3" (
  "C:\Users\ELDER NORIEGA\AppData\Local\Android\Sdk\platform-tools\adb.exe" shell am start -n com.example.atri/.RedAlertActivity
) else (
  "C:\Users\ELDER NORIEGA\AppData\Local\Android\Sdk\platform-tools\adb.exe" shell am broadcast -a com.example.atri.ACTION_ALERT -n com.example.atri/.AlertReceiver --ei alert_level %nivel%
)
echo Alerta enviada.
pause
goto menu
