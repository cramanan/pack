use crate::types::fs::{directory::AsDirectory, file::Named, pack::Pack};
use crate::utils::to_string;
use flate2::Compression;
use flate2::write::GzEncoder;
use std::fs::File;
use std::path::PathBuf;
use tar::{Builder, Header};

#[tauri::command]
pub async fn import_from_directory(path: PathBuf) -> Result<Pack, String> {
    Pack::try_from(path)
        .inspect(|pack| println!("{:?}", pack.config()))
        .map_err(to_string)
}

fn build_directory(
    builder: &mut Builder<GzEncoder<File>>,
    directory: &impl AsDirectory,
    path: PathBuf,
) -> std::io::Result<()> {
    for sub_file in directory.files() {
        let mut header = Header::new_gnu();
        header.set_path(path.join(sub_file.name()))?;
        header.set_mode(0o755);
        header.set_size(sub_file.len() as u64);
        header.set_cksum();
        builder.append(&header, sub_file.body().as_slice())?;
    }

    for sub_directory in directory.directories() {
        build_directory(builder, sub_directory, path.join(sub_directory.name()))?;
    }

    Ok(())
}

fn build_directory_from_origin(
    builder: &mut Builder<GzEncoder<File>>,
    directory: &impl AsDirectory,
    origin: &PathBuf,
    path: PathBuf,
) -> std::io::Result<()> {
    for subfile in directory.files() {
        builder.append_path_with_name(
            origin.join(&path).join(subfile.name()),
            path.join(subfile.name()),
        )?
    }

    for subdir in directory.directories() {
        build_directory_from_origin(builder, subdir, &origin, path.join(subdir.name()))?;
    }

    Ok(())
}

#[tauri::command]
pub async fn save_pack(pack: Pack, target_directory: PathBuf) -> Result<PathBuf, String> {
    let archive_name = target_directory.join(pack.name()).with_extension("pck");
    let file = File::create(&archive_name).map_err(to_string)?;
    let enc = GzEncoder::new(file, Compression::best());
    let mut builder = Builder::new(enc);

    (if let Some(origin) = pack.origin() {
        build_directory_from_origin(&mut builder, &pack, origin, PathBuf::new())
    } else {
        build_directory(&mut builder, &pack, PathBuf::new())
    })
    .map_err(to_string)?;

    builder.finish().map_err(to_string)?;
    Ok(archive_name)
}
