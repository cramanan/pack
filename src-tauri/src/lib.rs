mod fs;
mod settings;
mod types;
mod utils;

use fs::{import_from_directory, save_pack};

use settings::{get_settings, init_settings};
use tauri::generate_handler;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        // TODO: Export this closure into a function
        .setup(init_settings)
        .invoke_handler(generate_handler![
            // settings
            get_settings,
            // fs
            import_from_directory,
            save_pack,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
