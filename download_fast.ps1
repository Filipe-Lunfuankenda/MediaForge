$bin = "c:\Users\HP\Documents\Coding\MediaForge\src-tauri\bin"
$models = "c:\Users\HP\Documents\Coding\MediaForge\src-tauri\models"

Write-Host "Downloading FFmpeg with curl..."
curl.exe -L "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip" -o "$bin\ffmpeg.zip"
Write-Host "Extracting FFmpeg..."
Expand-Archive -Path "$bin\ffmpeg.zip" -DestinationPath "$bin\ffmpeg_temp" -Force
Copy-Item "$bin\ffmpeg_temp\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe" "$bin\ffmpeg-x86_64-pc-windows-msvc.exe" -Force
Copy-Item "$bin\ffmpeg_temp\ffmpeg-master-latest-win64-gpl\bin\ffprobe.exe" "$bin\ffprobe-x86_64-pc-windows-msvc.exe" -Force
Copy-Item "$bin\ffmpeg_temp\ffmpeg-master-latest-win64-gpl\bin\ffplay.exe" "$bin\ffplay-x86_64-pc-windows-msvc.exe" -Force
Copy-Item "$bin\ffmpeg_temp\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe" "$bin\ffmpeg-x86_64-pc-windows-gnu.exe" -Force
Copy-Item "$bin\ffmpeg_temp\ffmpeg-master-latest-win64-gpl\bin\ffprobe.exe" "$bin\ffprobe-x86_64-pc-windows-gnu.exe" -Force
Copy-Item "$bin\ffmpeg_temp\ffmpeg-master-latest-win64-gpl\bin\ffplay.exe" "$bin\ffplay-x86_64-pc-windows-gnu.exe" -Force
Remove-Item "$bin\ffmpeg.zip" -Force
Remove-Item "$bin\ffmpeg_temp" -Recurse -Force

Write-Host "Downloading Llama.cpp with curl..."
curl.exe -L "https://github.com/ggerganov/llama.cpp/releases/download/b3600/llama-b3600-bin-win-msvc-x64.zip" -o "$bin\llama.zip"
Write-Host "Extracting Llama..."
Expand-Archive -Path "$bin\llama.zip" -DestinationPath "$bin\llama_temp" -Force
Copy-Item "$bin\llama_temp\llama-cli.exe" "$bin\llama-cli-x86_64-pc-windows-msvc.exe" -Force
Copy-Item "$bin\llama_temp\llama-cli.exe" "$bin\llama-cli-x86_64-pc-windows-gnu.exe" -Force
Remove-Item "$bin\llama.zip" -Force
Remove-Item "$bin\llama_temp" -Recurse -Force

Write-Host "Downloading GGUF Model with curl..."
curl.exe -L "https://huggingface.co/Qwen/Qwen2-0.5B-Instruct-GGUF/resolve/main/qwen2-0_5b-instruct-q4_k_m.gguf?download=true" -o "$models\model.gguf"

Write-Host "Done!"
