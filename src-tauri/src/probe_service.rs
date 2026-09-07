use tauri_plugin_shell::ShellExt;
use tauri::AppHandle;

#[tauri::command]
pub async fn probe(app: AppHandle, path: String) -> Result<serde_json::Value, String> {
    let output = app.shell()
        .sidecar("ffprobe")
        .map_err(|e| e.to_string())?
        .args(["-v", "error", "-print_format", "json", "-show_format", "-show_streams", &path])
        .output()
        .await
        .map_err(|e| e.to_string())?;
    
    let json_str = String::from_utf8_lossy(&output.stdout);
    serde_json::from_str(&json_str).map_err(|e| e.to_string())
}
