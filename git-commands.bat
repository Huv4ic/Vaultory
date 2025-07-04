@echo off
echo Инициализация Git репозитория...

REM Устанавливаем путь к Git
set "GIT_PATH=C:\Program Files\Git\bin\git.exe"

echo Git найден: %GIT_PATH%

REM Инициализируем репозиторий
echo Инициализация репозитория...
"%GIT_PATH%" init

REM Добавляем все файлы
echo Добавление файлов...
"%GIT_PATH%" add .

REM Делаем коммит
echo Создание коммита...
"%GIT_PATH%" commit -m "Добавлена механика кейсов с анимацией и гарантией"

echo.
echo ========================================
echo Git репозиторий инициализирован!
echo.
echo Теперь нужно подключить к GitHub:
echo 1. Создайте репозиторий на GitHub.com
echo 2. Скопируйте URL репозитория
echo 3. Выполните команду:
echo    git remote add origin ВАШ_URL_РЕПОЗИТОРИЯ
echo    git push -u origin main
echo.
echo Или используйте GitHub Desktop для простой загрузки!
echo ========================================
pause 