$ErrorActionPreference = 'Stop'
$bin = "c:\Users\HP\Documents\Coding\MediaForge\src-tauri\bin"

Write-Host "Downloading Llama.cpp AVX2 with curl..."
curl.exe -L "https://github.com/ggml-org/llama.cpp/releases/download/b3600/llama-b3600-bin-win-avx2-x64.zip" -o "$bin\llama.zip"

Write-Host "Extracting Llama..."
Expand-Archive -Path "$bin\llama.zip" -DestinationPath "$bin\llama_temp" -Force
Copy-Item "$bin\llama_temp\llama-cli.exe" "$bin\llama-cli-x86_64-pc-windows-msvc.exe" -Force
Copy-Item "$bin\llama_temp\llama-cli.exe" "$bin\llama-cli-x86_64-pc-windows-gnu.exe" -Force
Remove-Item "$bin\llama.zip" -Force
Remove-Item "$bin\llama_temp" -Recurse -Force
Write-Host "Done!"
