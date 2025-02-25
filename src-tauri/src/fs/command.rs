use crate::to_string;
use crate::types::Pack;
use std::path::PathBuf;

#[tauri::command]
pub async fn read_dir(path: PathBuf) -> Result<Pack, String> {
    Pack::try_from(path).map_err(to_string)
}

#[tauri::command]
pub async fn save_pack(pack: Pack, target_directory: PathBuf) -> Result<(), String> {
    println!("{:?}", target_directory);
    println!("{:#?}", pack);
    Ok(())
}
