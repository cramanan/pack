use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Default, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
    theme: Theme,

    #[serde(skip_serializing_if = "Option::is_none")]
    save_directory: Option<PathBuf>,
}

#[derive(Debug, Default, Serialize, Deserialize, Clone)]
pub enum Theme {
    #[default]
    Light,
    Dark,
}

impl From<Theme> for tauri::Theme {
    fn from(value: Theme) -> Self {
        match value {
            Theme::Light => Self::Light,
            Theme::Dark => Self::Dark,
        }
    }
}

impl Settings {
    pub fn theme(&self) -> &Theme {
        &self.theme
    }

    pub fn with_save_directory(self, path: PathBuf) -> Self {
        Self {
            save_directory: Some(path),
            ..self
        }
    }

    // pub fn save_directory(&self) -> Option<&PathBuf> {
    //     self.save_directory.as_ref()
    // }
}
