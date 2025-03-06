use std::{
    fs::OpenOptions,
    io::{Seek, SeekFrom},
};

use tauri::{App, Manager};

use crate::types::settings::Settings;

pub fn init_settings(
    app: &mut App,
) -> std::result::Result<(), Box<dyn std::error::Error + 'static>> {
    let settings: Settings = {
        let resolver = app.path();
        let settings_path = resolver.app_config_dir()?.join("settings.json");
        dbg!(&settings_path);
        let mut settings_file = OpenOptions::new()
            .read(true)
            .write(true)
            .create(true)
            .open(settings_path)?;

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

    dbg!(&settings);

    app.manage(settings.clone());
    app.set_theme(Some(settings.theme().to_owned().into()));
    Ok(())
}

#[tauri::command]
pub async fn get_settings(state: tauri::State<'_, Settings>) -> Result<&Settings, String> {
    Ok(state.inner())
}
