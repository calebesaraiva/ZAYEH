@echo off
echo ============================================
echo   ZAYEH - Iniciando ambiente dev
echo ============================================

echo.
echo [1/4] Subindo PostgreSQL...
docker compose up -d postgres
timeout /t 3 /nobreak >nul

echo.
echo [2/4] Rodando migrations + seed...
cd backend
call npx prisma db push --skip-generate
call npx ts-node prisma/seed.ts
cd ..

echo.
echo [3/4] Iniciando backend (porta 3333)...
start "ZAYEH Backend" cmd /k "cd backend && npx ts-node-dev --respawn --transpile-only src/index.ts"

timeout /t 2 /nobreak >nul

echo.
echo [4/4] Iniciando frontend (porta 5173)...
start "ZAYEH Frontend" cmd /k "npm run dev"

echo.
echo ============================================
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:3333
echo  Dashboard: http://localhost:5173/dashboard
echo  Admin: admin@zayeh.com.br / zayeh@2026
echo ============================================
echo.
pause
