use crate::to_string;
use crate::types::{AsDirectory, Pack};
use flate2::write::GzEncoder;
use flate2::Compression;
use std::fs::{create_dir_all, File};
use std::path::PathBuf;
use tar::{Builder, Header};

#[tauri::command]
pub async fn read_directory(path: PathBuf) -> Result<Pack, String> {
    Pack::try_from(path).map_err(to_string)
}

fn build_directory(
    builder: &mut Builder<GzEncoder<File>>,
    directory: &dyn AsDirectory,
    path: PathBuf,
) -> std::io::Result<()> {
    for sub_file in directory.files() {
        println!("{:?}", path.join(&sub_file.name));
        let mut header = Header::new_gnu();
        header.set_path(path.join(&sub_file.name))?;
        header.set_mode(0o755);
        header.set_size(0);
        header.set_cksum();
        builder.append(&header, "".as_bytes())?;
    }

    for sub_directory in directory.directories() {
        build_directory(builder, sub_directory, path.join(sub_directory.name()))?;
    }

    Ok(())
}

#[tauri::command]
pub async fn save_pack(pack: Pack, target_directory: PathBuf) -> Result<PathBuf, String> {
    let archive_path = target_directory.join("packs");
    if !archive_path.exists() {
        create_dir_all(&archive_path).map_err(to_string)?;
    }
    let archive_name = archive_path.join(&pack.name).with_extension("pck");
    let file = File::create(&archive_name).map_err(to_string)?;
    let enc = GzEncoder::new(file, Compression::best());
    let mut builder = Builder::new(enc);
    build_directory(&mut builder, &pack, PathBuf::new()).map_err(to_string)?;
    builder.finish().map_err(to_string)?;
    Ok(archive_name)
}
