use crate::{types::settings::Settings, utils::to_string};
use serde_json::to_writer_pretty;
use std::{
    fs::OpenOptions,
    io::{Seek, SeekFrom},
    path::PathBuf,
    sync::Mutex,
};
use tauri::{App, Manager};

pub struct SettingsState {
    settings: Mutex<Settings>,
    settings_path: PathBuf,
}

pub fn init_settings(
    app: &mut App,
) -> std::result::Result<(), Box<dyn std::error::Error + 'static>> {
    let resolver = app.path();
    let settings_path = resolver.app_config_dir()?.join("settings.json");
    let raw_settings: Settings = {
        dbg!(&settings_path);
        let mut settings_file = OpenOptions::new()
            .read(true)
            .write(true)
            .create(true)
            .open(&settings_path)?;

        let value = match serde_json::from_reader(&settings_file) {
            Ok(value) => value,
            Err(read_error) => {
                eprintln!("Failed to read default settings: {}", read_error);
                Settings::default().with_save_directory(resolver.app_data_dir()?)
            }
        };

        // May be inefficient
        // Reset the cursor to the beginning of the file before writing
        settings_file.seek(SeekFrom::Start(0))?;
        // Truncate the file to remove any old content
        settings_file.set_len(0)?;

        if let Err(write_error) = serde_json::to_writer_pretty(settings_file, &value) {
            eprintln!("Failed to write default settings: {}", write_error);
        }

        value
    };

    app.set_theme(Some(raw_settings.theme().to_owned().into()));

    let settings = Mutex::new(raw_settings);
    app.manage(SettingsState {
        settings,
        settings_path,
    });
    Ok(())
}

#[tauri::command]
pub async fn get_settings(state: tauri::State<'_, SettingsState>) -> Result<Settings, String> {
    let settings = state.settings.lock().map_err(to_string)?;
    Ok(settings.clone())
}

#[tauri::command]

pub async fn save_settings(
    state: tauri::State<'_, SettingsState>,
    settings: Settings,
) -> Result<(), String> {
    let file = OpenOptions::new()
        .write(true)
        .truncate(true)
        .open(&state.settings_path)
        .map_err(to_string)?;

    let mut settings_guard = state.settings.lock().map_err(to_string)?;

    *settings_guard = settings;

    to_writer_pretty(file, &*settings_guard).map_err(to_string)
}
