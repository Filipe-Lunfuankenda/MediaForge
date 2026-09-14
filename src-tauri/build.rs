use std::env;
use std::fs::{self, File};
use std::path::Path;

fn main() {
    let target = env::var("TARGET").unwrap_or_default();
    let ext = if target.contains("windows") { ".exe" } else { "" };
    let bin_dir = Path::new("bin");
    let _ = fs::create_dir_all(bin_dir);
    let keep_bin = bin_dir.join(".keep");
    if !keep_bin.exists() {
        let _ = File::create(&keep_bin);
    }

    let models_dir = Path::new("models");
    let _ = fs::create_dir_all(models_dir);
    let keep_models = models_dir.join(".keep");
    if !keep_models.exists() {
        let _ = File::create(&keep_models);
    }

    for bin_name in &["ffmpeg", "ffprobe"] {
        let sidecar_filename = format!("{}-{}{}", bin_name, target, ext);
        let sidecar_path = bin_dir.join(&sidecar_filename);
        if !sidecar_path.exists() {
            let _ = File::create(&sidecar_path);
        }
    }

    tauri_build::build()
}

