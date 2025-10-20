@echo off
echo Clearing all caches and restarting development server...

echo Cleaning TypeScript build cache...
npx tsc --build --clean

echo Removing Vite cache...
if exist node_modules\.vite rmdir /s /q node_modules\.vite

echo Removing dist folder...
if exist dist rmdir /s /q dist

echo Removing .tsbuildinfo files...
del /s /q *.tsbuildinfo 2>nul

echo Cache cleared! Please restart your development server.
echo Run: npm run dev
pause
