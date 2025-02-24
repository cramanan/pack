use serde::Serialize;
use std::fs::read_dir;
use std::path::PathBuf;

use crate::to_string;

#[derive(Debug, Serialize)]
pub struct File {
    name: String,
}

#[derive(Debug, Serialize)]
pub struct Symlink {
    name: String,
}

#[derive(Debug, Default, Serialize)]
pub struct Directory {
    name: String,
    files: Vec<File>,
    symlinks: Vec<Symlink>,
    directories: Vec<Directory>,
}

impl TryFrom<PathBuf> for Directory {
    type Error = String;

    fn try_from(path: PathBuf) -> Result<Self, Self::Error> {
        let mut directory = Directory::default();
        directory.name = path.to_str().ok_or("Error".to_string())?.to_string();
        let entries = read_dir(&path).map_err(to_string)?;
        for entry in entries.filter_map(Result::ok) {
            let mut file_name = path.clone();
            file_name.push(entry.file_name());
            let file_type = entry.file_type().map_err(to_string)?;
            if file_type.is_dir() {
                directory.directories.push(Directory::try_from(file_name)?);
            } else if file_type.is_file() {
                let file = File {
                    name: file_name.to_str().ok_or("Error".to_string())?.to_string(),
                };
                directory.files.push(file);
            }
        }
        Ok(directory)
    }
}
