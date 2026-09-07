use tauri_plugin_shell::ShellExt;
use tauri::{AppHandle, State};

#[tauri::command]
pub async fn run_safe_shell(
    app: AppHandle,
    command: String,
    policy: State<'_, crate::policy::Policy>,
) -> Result<String, String> {
    let mut parts = shlex::split(&command).ok_or("Erro ao fazer parse do comando")?;
    if parts.is_empty() { return Err("Comando vazio".to_string()); }
    let cmd = parts.remove(0);
    let args = parts;

    policy.check_executable(&cmd)?;
    policy.check_args(&args)?;

    let output = app.shell()
        .command(&cmd)
        .args(&args)
        .output()
        .await
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(String::from_utf8_lossy(&output.stdout).to_string())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}
