mod fs;
mod types;
use fs::{read_directory, save_pack};
use tauri::generate_handler;

pub fn to_string(value: impl ToString) -> String {
    value.to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(generate_handler![read_directory, save_pack])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
