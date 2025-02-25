use crate::to_string;
use crate::types::{AsDirectory, Pack};
use flate2::write::GzEncoder;
use flate2::Compression;
use std::fs::{create_dir_all, read_dir, File};
use std::path::PathBuf;

#[tauri::command]
pub async fn read_directory(path: PathBuf) -> Result<Pack, String> {
    Pack::try_from(path).map_err(to_string)
}

fn create_directory(
    tar: &mut tar::Builder<GzEncoder<File>>,
    origin: &PathBuf,
    path: &PathBuf,
    directory: &dyn AsDirectory,
) -> Result<(), std::io::Error> {
    for subfile in directory.files() {
        println!(
            "{:?}, {}",
            origin.join(path).join(&subfile.name),
            &subfile.name
        );
        tar.append_path_with_name(
            &origin.join(path).join(&subfile.name),
            path.join(&subfile.name),
        )?
    }

    for subdir in directory.directories() {
        create_directory(tar, &origin, &path.join(subdir.name()), subdir)?;
    }
    Ok(())
}

#[tauri::command]
pub async fn save_pack(pack: Pack, target_directory: PathBuf) -> Result<PathBuf, String> {
    let pack_directory = target_directory.join("packs");
    if !pack_directory.exists() {
        create_dir_all(&pack_directory).map_err(to_string)?;
    }
    let mut archive_name = pack_directory.join(&pack.id);
    archive_name.set_extension("pck");
    let tar_gz = File::create(&archive_name).map_err(to_string)?;
    let enc = GzEncoder::new(tar_gz, Compression::best());
    let mut tar: tar::Builder<GzEncoder<File>> = tar::Builder::new(enc);

    if let Some(ref origin) = pack.origin {
        create_directory(&mut tar, origin, &PathBuf::new(), &pack).map_err(to_string)?;
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
