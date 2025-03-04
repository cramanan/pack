use std::{io::Error, path::PathBuf};

use serde::{Deserialize, Serialize};

use super::file::{File, Named};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Directory {
    name: String,
    files: Vec<File>,
    directories: Vec<Directory>,
}

impl Named for Directory {
    fn name(&self) -> &String {
        &self.name
    }
}

pub trait AsDirectory {
    fn directories(&self) -> &Vec<Directory>;
    fn directories_mut(&mut self) -> &mut Vec<Directory>;

    fn files(&self) -> &Vec<File>;
    fn files_mut(&mut self) -> &mut Vec<File>;
}

impl AsDirectory for Directory {
    fn directories(&self) -> &Vec<Directory> {
        &self.directories
    }

    fn directories_mut(&mut self) -> &mut Vec<Directory> {
        &mut self.directories
    }

    fn files(&self) -> &Vec<File> {
        &self.files
    }

    fn files_mut(&mut self) -> &mut Vec<File> {
        &mut self.files
    }
}

impl Directory {
    pub fn new(name: String) -> Self {
        Self {
            name,
            files: Vec::new(),
            directories: Vec::new(),
        }
    }
}

impl TryFrom<&PathBuf> for Directory {
    type Error = Error;

    fn try_from(path: &PathBuf) -> Result<Self, Self::Error> {
        let name = path
            .file_name()
            .ok_or(Error::new(
                std::io::ErrorKind::InvalidData,
                "Invalid file name",
            ))?
            .to_string_lossy()
            .to_string();
        let mut directory = Directory::new(name);

        let entries = path.read_dir()?;

        for entry in entries.filter_map(Result::ok) {
            let file_type = entry.file_type()?;

            if file_type.is_dir() {
                let absolute_path = path.join(entry.file_name());
                directory
                    .directories_mut()
                    .push(Directory::try_from(&absolute_path)?);
            } else if file_type.is_file() {
                let name = entry.file_name().to_str().unwrap().to_string(); // TODO: remove unwrap
                directory.files_mut().push(File::new(name));
            }
        }
        Ok(directory)
    }
}
