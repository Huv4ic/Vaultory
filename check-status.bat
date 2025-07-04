@echo off
echo Проверка статуса Git репозитория...

set "GIT_PATH=C:\Program Files\Git\bin\git.exe"

echo.
echo === Статус репозитория ===
"%GIT_PATH%" status

echo.
echo === Последние коммиты ===
"%GIT_PATH%" log --oneline -5

echo.
echo === Удаленные репозитории ===
"%GIT_PATH%" remote -v

echo.
echo === Ветки ===
"%GIT_PATH%" branch -a

pause 