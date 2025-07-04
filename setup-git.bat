@echo off
echo Настройка Git конфигурации...

set "GIT_PATH=C:\Program Files\Git\bin\git.exe"

REM Настраиваем git
echo Настройка пользователя...
"%GIT_PATH%" config --global user.email "user@example.com"
"%GIT_PATH%" config --global user.name "User"

REM Делаем коммит
echo Создание коммита...
"%GIT_PATH%" commit -m "Добавлена механика кейсов с анимацией и гарантией"

echo.
echo ========================================
echo Git настроен и коммит создан!
echo.
echo Теперь нужно подключить к GitHub:
echo 1. Создайте репозиторий на GitHub.com
echo 2. Скопируйте URL репозитория
echo 3. Выполните команды:
echo    "C:\Program Files\Git\bin\git.exe" remote add origin ВАШ_URL_РЕПОЗИТОРИЯ
echo    "C:\Program Files\Git\bin\git.exe" push -u origin main
echo.
echo Или используйте GitHub Desktop для простой загрузки!
echo ========================================
pause 