use chrono::Utc;
use serde::{Deserialize, Serialize};
use std::fs::read_dir;
use std::io::Error;
use std::path::PathBuf;
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize)]
pub struct File {
    pub name: String,
    pub body: Option<Vec<u8>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Symlink {
    name: String,
}

pub trait AsDirectory {
    fn name(&self) -> &String;
    fn directories(&self) -> &Vec<Directory>;
    fn files(&self) -> &Vec<File>;
    fn symlinks(&self) -> &Vec<Symlink>;
}

#[derive(Debug, Default, Serialize, Deserialize)]
pub struct Directory {
    pub name: String,
    pub files: Vec<File>,
    pub symlinks: Vec<Symlink>,
    pub directories: Vec<Directory>,
}

impl AsDirectory for Directory {
    fn name(&self) -> &String {
        &self.name
    }
    fn directories(&self) -> &Vec<Directory> {
        &self.directories
    }

    fn files(&self) -> &Vec<File> {
        &self.files
    }

    fn symlinks(&self) -> &Vec<Symlink> {
        &self.symlinks
    }
}

impl TryFrom<&PathBuf> for Directory {
    type Error = Error;

    fn try_from(path: &PathBuf) -> Result<Self, Self::Error> {
        let mut directory = Directory::default();

        let entries = read_dir(&path)?;
        directory.name = path
            .file_name()
            .ok_or(Error::new(
                std::io::ErrorKind::InvalidData,
                "Invalid file name",
            ))?
            .to_str()
            .ok_or(Error::new(
                std::io::ErrorKind::InvalidData,
                "Invalid UTF-8 sequence",
            ))?
            .to_string();

        for entry in entries.filter_map(Result::ok) {
            let file_type = entry.file_type()?;
            let absolute_path = path.join(entry.file_name());
            // println!("{:?}", absolute_path);
            if file_type.is_dir() {
                directory
                    .directories
                    .push(Directory::try_from(&absolute_path)?);
            } else if file_type.is_file() {
                directory.files.push(File {
                    name: entry.file_name().to_str().unwrap().to_string(), // TODO: remove unwrap
                    body: None,
                });
            }
        }
        Ok(directory)
    }
}

#[derive(Debug, Default, Serialize, Deserialize)]
pub struct Pack {
    pub id: String,
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub origin: Option<PathBuf>,
    pub directories: Vec<Directory>,
    pub files: Vec<File>,
    pub symlinks: Vec<Symlink>,
}

impl AsDirectory for Pack {
    fn name(&self) -> &String {
        &self.name
    }
    fn directories(&self) -> &Vec<Directory> {
        &self.directories
    }

    fn files(&self) -> &Vec<File> {
        &self.files
    }

    fn symlinks(&self) -> &Vec<Symlink> {
        &self.symlinks
    }
}

impl From<Directory> for Pack {
    fn from(
        Directory {
            name,
            files,
            symlinks,
            directories,
        }: Directory,
    ) -> Self {
        let id = {
            let uuid = Uuid::new_v4();
            let timestamp = Utc::now().format("%Y%m%d%H%M%S").to_string();
            format!("{}_{}", uuid, timestamp)
        };

        Self {
            id,
            origin: None,
            name,
            directories,
            files,
            symlinks,
        }
    }
}

impl TryFrom<PathBuf> for Pack {
    type Error = Error;

    fn try_from(path: PathBuf) -> Result<Self, Self::Error> {
        let mut pack = Directory::try_from(&path).map(Pack::from)?;
        pack.origin = Some(path);
        Ok(pack)
    }
}
