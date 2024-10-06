mod commands;
mod constants;
mod errors;
mod models;

use commands::*;
use errors::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .level(log::LevelFilter::Info)
                .build(),
        )
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            fetch_version,
            create_temp_dir,
            clear_temp_dir,
            download_korean_patch,
            download_builtin_font_patch,
            download_external_font_patch,
            resolve_install_options,
            unzip_korean_patch,
            apply_korean_patch,
            unzip_font_patch,
            apply_font_patch,
            open_github,
            open_dc
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
