@echo off
echo Загрузка проекта на GitHub...

set "GIT_PATH=C:\Program Files\Git\bin\git.exe"

REM Настраиваем git
echo Настройка пользователя...
"%GIT_PATH%" config --global user.email "user@example.com"
"%GIT_PATH%" config --global user.name "User"

REM Добавляем все файлы
echo Добавление всех файлов...
"%GIT_PATH%" add .

REM Делаем коммит
echo Создание коммита...
"%GIT_PATH%" commit -m "Добавлена механика кейсов с анимацией и гарантией"

REM Подключаем к GitHub репозиторию
echo Подключение к GitHub репозиторию...
"%GIT_PATH%" remote add origin https://github.com/Huv4ic/Vaultory.git

REM Загружаем на GitHub
echo Загрузка на GitHub...
"%GIT_PATH%" push -u origin master

echo.
echo ========================================
echo Проект успешно загружен на GitHub!
echo.
echo Ссылка на репозиторий:
echo https://github.com/Huv4ic/Vaultory
echo.
echo Netlify автоматически обновится с новой версией!
echo ========================================
pause 