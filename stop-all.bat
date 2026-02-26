@echo off
chcp 65001 > nul
echo ========================================
echo     VitaNote - 停止所有服务
echo ========================================
echo.

echo 正在停止后端进程...
taskkill /F /IM dotnet.exe 2> nul

echo 正在停止前端进程...
taskkill /F /IM node.exe 2> nul

echo.
echo ========================================
echo     服务已停止
echo ========================================
echo.
pause
