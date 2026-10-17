@echo off
setlocal
cd /d "%~dp0"
echo.
echo   BLACK OPS II - SURVEILLANCE ROOM
echo   Serveur local : http://localhost:8080/
echo   Ctrl+C pour arreter.
echo.
where py >NUL 2>NUL
if not errorlevel 1 goto :usepy
where python >NUL 2>NUL
if not errorlevel 1 goto :usepython
echo Python 3 est introuvable. Installez-le depuis https://www.python.org/downloads/
echo ou lancez le projet avec n'importe quel serveur statique.
pause
exit /b 1
:usepy
py -m http.server 8080
goto :end
:usepython
python -m http.server 8080
:end
pause
