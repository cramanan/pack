use crate::to_string;
use crate::types::fs::{AsDirectory, Pack};
use flate2::Compression;
use flate2::write::GzEncoder;
use std::fs::File;
use std::path::PathBuf;
use tar::{Builder, Header};

#[tauri::command]
pub async fn import_from_directory(path: PathBuf) -> Result<Pack, String> {
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
        let data = sub_file.body.clone().unwrap_or_default();
        header.set_size(data.len() as u64);
        header.set_cksum();
        builder.append(&header, data.as_bytes())?;
    }

    for sub_directory in directory.directories() {
        build_directory(builder, sub_directory, path.join(sub_directory.name()))?;
    }

    Ok(())
}

fn build_directory_from_origin(
    builder: &mut Builder<GzEncoder<File>>,
    directory: &dyn AsDirectory,
    origin: &PathBuf,
    path: PathBuf,
) -> std::io::Result<()> {
    for subfile in directory.files() {
        println!(
            "{:?}, {:?}",
            origin.join(&path).join(&subfile.name),
            path.join(&subfile.name)
        );

        builder.append_path_with_name(
            origin.join(&path).join(&subfile.name),
            path.join(&subfile.name),
        )?
    }

    for subdir in directory.directories() {
        build_directory_from_origin(builder, subdir, &origin, path.join(subdir.name()))?;
    }

    Ok(())
}

#[tauri::command]
pub async fn save_pack(mut pack: Pack, target_directory: PathBuf) -> Result<PathBuf, String> {
    pack.clear_bodies();
    let archive_name = target_directory.join(&pack.name).with_extension("pck");
    let file = File::create(&archive_name).map_err(to_string)?;
    let enc = GzEncoder::new(file, Compression::best());
    let mut builder = Builder::new(enc);

    if let Some(ref origin) = pack.origin {
        build_directory_from_origin(&mut builder, &pack, &origin, PathBuf::new())
            .map_err(to_string)?;
    } else {
        build_directory(&mut builder, &pack, PathBuf::new()).map_err(to_string)?;
    }

    builder.finish().map_err(to_string)?;
    Ok(archive_name)
}
