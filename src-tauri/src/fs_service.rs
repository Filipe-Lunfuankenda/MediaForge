use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Node {
    pub path: String,
    pub is_dir: bool,
    pub size: u64,
}

#[tauri::command]
pub async fn list_dir(path: String, state: tauri::State<'_, crate::policy::Policy>) -> Result<Vec<Node>, String> {
    state.ensure_readable(&path)?;
    let mut out = vec![];
    let mut rd = tokio::fs::read_dir(&path).await.map_err(|e| e.to_string())?;
    
    while let Some(e) = rd.next_entry().await.map_err(|e| e.to_string())? {
        let m = e.metadata().await.map_err(|e| e.to_string())?;
        out.push(Node {
            path: e.path().to_string_lossy().to_string(),
            is_dir: m.is_dir(),
            size: m.len(),
        });
    }
    Ok(out)
}

#[tauri::command]
pub async fn get_drives() -> Result<Vec<Node>, String> {
    let mut out = vec![];
    #[cfg(windows)]
    {
        for c in b'A'..=b'Z' {
            let path = format!("{}:\\", c as char);
            if std::path::Path::new(&path).exists() {
                out.push(Node {
                    path: path.clone(),
                    is_dir: true,
                    size: 0,
                });
            }
        }
    }
    #[cfg(not(windows))]
    {
        out.push(Node {
            path: "/".to_string(),
            is_dir: true,
            size: 0,
        });
    }
    Ok(out)
}
