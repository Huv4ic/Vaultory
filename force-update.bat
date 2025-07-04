@echo off
echo Принудительное обновление на GitHub...

set "GIT_PATH=C:\Program Files\Git\bin\git.exe"

REM Добавляем все изменения
echo Добавление изменений...
"%GIT_PATH%" add .

REM Делаем новый коммит
echo Создание коммита...
"%GIT_PATH%" commit -m "Обновление: улучшенная механика кейсов с анимациями"

REM Принудительно загружаем
echo Загрузка на GitHub...
"%GIT_PATH%" push origin master

echo.
echo ========================================
echo Обновление загружено на GitHub!
echo.
echo Проверьте настройки Netlify:
echo 1. Base directory: (пустое)
echo 2. Build command: npm run build
echo 3. Publish directory: dist
echo.
echo Ссылка на репозиторий:
echo https://github.com/Huv4ic/Vaultory
echo ========================================
pause 