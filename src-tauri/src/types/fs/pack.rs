use super::directory::{AsDirectory, Directory};
use super::file::{File, Named};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Pack {
    name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    origin: Option<PathBuf>,
    directories: Vec<Directory>,
    files: Vec<File>,
}

impl Named for Pack {
    fn name(&self) -> &String {
        &self.name
    }
}

impl AsDirectory for Pack {
    fn directories(&self) -> &Vec<Directory> {
        &self.directories
    }

    fn files(&self) -> &Vec<File> {
        &self.files
    }

    fn directories_mut(&mut self) -> &mut Vec<Directory> {
        &mut self.directories
    }

    fn files_mut(&mut self) -> &mut Vec<File> {
        &mut self.files
    }
}

impl Pack {
    pub fn with_origin<P>(mut self, origin: P) -> Self
    where
        P: Into<PathBuf>,
    {
        self.origin = Some(origin.into());
        self
    }

    pub fn origin(&self) -> Option<&PathBuf> {
        self.origin.as_ref()
    }
}

impl From<Directory> for Pack {
    fn from(directory: Directory) -> Self {
        Self {
            origin: None,
            name: directory.name().to_owned(),
            directories: directory.directories().to_owned(),
            files: directory.files().to_owned(),
        }
    }
}

impl TryFrom<PathBuf> for Pack {
    type Error = std::io::Error;

    fn try_from(path: PathBuf) -> Result<Self, Self::Error> {
        let pack = Directory::try_from(&path).map(Pack::from)?;
        Ok(pack.with_origin(path))
    }
}
