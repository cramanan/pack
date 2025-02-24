use std::path::PathBuf;

use crate::types::Directory;

#[tauri::command]
pub async fn read_dir(path: PathBuf) -> Result<Directory, String> {
    Directory::try_from(path)
}
