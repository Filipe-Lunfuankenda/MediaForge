$ErrorActionPreference = 'Stop'
$bin = "c:\Users\HP\Documents\Coding\MediaForge\src-tauri\bin"
$models = "c:\Users\HP\Documents\Coding\MediaForge\src-tauri\models"
New-Item -ItemType Directory -Force -Path $bin
New-Item -ItemType Directory -Force -Path $models

# Clean old dummy files
Remove-Item -Path "$bin\*" -Force

# FFmpeg
Write-Host "Downloading FFmpeg..."
Invoke-WebRequest -Uri "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip" -OutFile "$bin\ffmpeg.zip"
Expand-Archive -Path "$bin\ffmpeg.zip" -DestinationPath "$bin\ffmpeg_temp" -Force
Copy-Item "$bin\ffmpeg_temp\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe" "$bin\ffmpeg-x86_64-pc-windows-msvc.exe" -Force
Copy-Item "$bin\ffmpeg_temp\ffmpeg-master-latest-win64-gpl\bin\ffprobe.exe" "$bin\ffprobe-x86_64-pc-windows-msvc.exe" -Force
Copy-Item "$bin\ffmpeg_temp\ffmpeg-master-latest-win64-gpl\bin\ffplay.exe" "$bin\ffplay-x86_64-pc-windows-msvc.exe" -Force
Copy-Item "$bin\ffmpeg_temp\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe" "$bin\ffmpeg-x86_64-pc-windows-gnu.exe" -Force
Copy-Item "$bin\ffmpeg_temp\ffmpeg-master-latest-win64-gpl\bin\ffprobe.exe" "$bin\ffprobe-x86_64-pc-windows-gnu.exe" -Force
Copy-Item "$bin\ffmpeg_temp\ffmpeg-master-latest-win64-gpl\bin\ffplay.exe" "$bin\ffplay-x86_64-pc-windows-gnu.exe" -Force
Remove-Item "$bin\ffmpeg.zip" -Force
Remove-Item "$bin\ffmpeg_temp" -Recurse -Force

# Llama.cpp
Write-Host "Downloading Llama.cpp..."
Invoke-WebRequest -Uri "https://github.com/ggerganov/llama.cpp/releases/download/b3600/llama-b3600-bin-win-msvc-x64.zip" -OutFile "$bin\llama.zip"
Expand-Archive -Path "$bin\llama.zip" -DestinationPath "$bin\llama_temp" -Force
Copy-Item "$bin\llama_temp\llama-cli.exe" "$bin\llama-cli-x86_64-pc-windows-msvc.exe" -Force
Copy-Item "$bin\llama_temp\llama-cli.exe" "$bin\llama-cli-x86_64-pc-windows-gnu.exe" -Force
Remove-Item "$bin\llama.zip" -Force
Remove-Item "$bin\llama_temp" -Recurse -Force

# Model
Write-Host "Downloading GGUF Model..."
Invoke-WebRequest -Uri "https://huggingface.co/Qwen/Qwen2-0.5B-Instruct-GGUF/resolve/main/qwen2-0_5b-instruct-q4_k_m.gguf?download=true" -OutFile "$models\model.gguf"

Write-Host "Done!"
