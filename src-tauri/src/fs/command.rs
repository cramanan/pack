use crate::to_string;
use crate::types::Pack;
use flate2::write::GzEncoder;
use flate2::Compression;
use std::fs::{create_dir_all, read_dir, File};
use std::path::PathBuf;

#[tauri::command]
pub async fn read_directory(path: PathBuf) -> Result<Pack, String> {
    Pack::try_from(path).map_err(to_string)
}

#[tauri::command]
pub async fn save_pack(pack: Pack, target_directory: PathBuf) -> Result<PathBuf, String> {
    let pack_directory = target_directory.join("packs");
    if !pack_directory.exists() {
        create_dir_all(&pack_directory).map_err(to_string)?;
    }
    let mut archive_name = pack_directory.join(pack.id);
    archive_name.set_extension("pck");
    let tar_gz = File::create(&archive_name).map_err(to_string)?;
    let enc = GzEncoder::new(tar_gz, Compression::best());
    let mut tar = tar::Builder::new(enc);
    if let Some(origin) = pack.origin {
        for subfile in pack.files {
            let mut file = File::open(origin.join(&subfile.name)).map_err(to_string)?;
            tar.append_file(&subfile.name, &mut file)
                .map_err(to_string)?
        }
    }

    tar.finish().map_err(to_string)?;
    Ok(archive_name)
}

#[tauri::command]
pub async fn read_packs_name(target_directory: PathBuf) -> Result<Vec<PathBuf>, String> {
    let pack_directory = target_directory.join("packs");
    if !pack_directory.exists() {
        Err("No packs directory found".to_string())
    } else {
        let entries = read_dir(pack_directory).map_err(to_string)?;
        let predicate = |res: Result<std::fs::DirEntry, std::io::Error>| {
            if let Ok(entry) = res {
                PathBuf::from(entry.file_name())
                    .file_stem()
                    .map(PathBuf::from)
            } else {
                None
            }
        };
        Ok(entries.filter_map(predicate).collect())
    }
}
