use std::path::PathBuf;

use serde::{Deserialize, Serialize};

#[derive(Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
    #[serde(skip_serializing_if = "Option::is_none")]
    save_directory: Option<PathBuf>,
}

impl Settings {
    pub fn with_save_directory(self, path: PathBuf) -> Self {
        Self {
            save_directory: Some(path),
            ..self
        }
    }
}
