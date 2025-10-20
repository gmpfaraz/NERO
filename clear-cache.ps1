Write-Host "Clearing all caches and restarting development server..." -ForegroundColor Green

Write-Host "Cleaning TypeScript build cache..." -ForegroundColor Yellow
npx tsc --build --clean

Write-Host "Removing Vite cache..." -ForegroundColor Yellow
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite"
}

Write-Host "Removing dist folder..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
}

Write-Host "Removing .tsbuildinfo files..." -ForegroundColor Yellow
Get-ChildItem -Recurse -Name "*.tsbuildinfo" | ForEach-Object { Remove-Item $_ -Force }

Write-Host "Cache cleared! Please restart your development server." -ForegroundColor Green
Write-Host "Run: npm run dev" -ForegroundColor Cyan
