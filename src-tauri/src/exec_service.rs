use tauri_plugin_shell::ShellExt;
use tauri_plugin_shell::process::CommandEvent;
use tauri::{AppHandle, State, Emitter};#[derive(serde::Serialize, Clone)]
struct LinePayload {
    id: String,
    line: String,
}

#[derive(serde::Serialize, Clone)]
struct EndPayload {
    id: String,
    code: i32,
}


#[tauri::command]
pub async fn run_job(
    app: AppHandle,
    id: String,
    tool: String,
    command: String,
    cwd: String,
    policy: State<'_, crate::policy::Policy>,
) -> Result<(), String> {
    if tool != "ffmpeg" && tool != "ffprobe" && tool != "ffplay" {
        return Err("Ferramenta inválida".to_string());
    }
    
    let argv = shlex::split(&command).ok_or("Erro ao fazer parse dos argumentos")?;
    policy.check_args(&argv)?;
    
    let (mut rx, _child) = app.shell()
        .sidecar(&tool)
        .map_err(|e| e.to_string())?
        .args(&argv)
        .current_dir(cwd)
        .spawn()
        .map_err(|e| e.to_string())?;

    let app_clone = app.clone();
    let id_clone = id.clone();
    
    tokio::spawn(async move {
        while let Some(ev) = rx.recv().await {
            match ev {
                CommandEvent::Stdout(b) | CommandEvent::Stderr(b) => {
                    let _ = app_clone.emit("job-line", LinePayload {
                        id: id_clone.clone(),
                        line: String::from_utf8_lossy(&b).to_string(),
                    });
                }
                CommandEvent::Terminated(t) => {
                    let _ = app_clone.emit("job-end", EndPayload {
                        id: id_clone.clone(),
                        code: t.code.unwrap_or(0),
                    });
                }
                _ => {}
            }
        }
    });

    Ok(())
}
