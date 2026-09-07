pub mod fs_service;
pub mod probe_service;
pub mod exec_service;
pub mod policy;
pub mod shell_service;
pub mod ai_service;
pub mod sys_service;



#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .manage(policy::Policy::new())
        .invoke_handler(tauri::generate_handler![
            fs_service::list_dir,
            fs_service::get_drives,
            probe_service::probe,
            exec_service::run_job,
            shell_service::run_safe_shell,
            ai_service::ask_local_ai,
            sys_service::get_sys_info
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
