use tauri_plugin_shell::ShellExt;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub async fn ask_local_ai(
    app: AppHandle,
    prompt: String,
) -> Result<String, String> {
    let resource_dir = app.path().resource_dir().map_err(|e| e.to_string())?;
    let model_path = resource_dir.join("models").join("model.gguf");
    let exe_path = resource_dir.join("bin").join("llama-cli.exe");
    
    // This connects to the llama-cli (llama.cpp engine)
    let output = app.shell()
        .command(exe_path.to_string_lossy().as_ref())
        .args([
            "-m", &model_path.to_string_lossy(),
            "-p", &format!("Como perito de FFmpeg, responde ao utilizador. Pedido: {}\n\nExplica brevemente o que vais fazer e numa nova linha fornece apenas o comando exato iniciado por 'COMANDO: ffmpeg' ou 'COMANDO: ffprobe'.", prompt),
            "-n", "512",
            "--log-disable"
        ])
        .output()
        .await
        .map_err(|e| format!("Falha ao iniciar processo: {}", e))?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(format!("Exit {}:\nStdout: {}\nStderr: {}", 
            output.status.code().unwrap_or(-1),
            String::from_utf8_lossy(&output.stdout),
            String::from_utf8_lossy(&output.stderr)
        ))
    }
}
