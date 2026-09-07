$ErrorActionPreference = 'Continue'

$binPath = "c:\Users\HP\Documents\Coding\MediaForge\src-tauri\bin"
$modelsPath = "c:\Users\HP\Documents\Coding\MediaForge\src-tauri\models"

Write-Host "A remover binários do FFmpeg e Llama de $binPath ..." -ForegroundColor Yellow
if (Test-Path $binPath) {
    Remove-Item -Path "$binPath\*" -Recurse -Force
    Write-Host "Pasta bin/ limpa com sucesso!" -ForegroundColor Green
} else {
    Write-Host "Pasta bin/ não existe." -ForegroundColor Gray
}

Write-Host "A remover modelo AI de $modelsPath ..." -ForegroundColor Yellow
if (Test-Path $modelsPath) {
    Remove-Item -Path "$modelsPath\*" -Recurse -Force
    Write-Host "Pasta models/ limpa com sucesso!" -ForegroundColor Green
} else {
    Write-Host "Pasta models/ não existe." -ForegroundColor Gray
}

Write-Host "Limpeza de dependências locais concluída!" -ForegroundColor Cyan
