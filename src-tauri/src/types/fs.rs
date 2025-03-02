use serde::{Deserialize, Serialize};
use std::fs::read_dir;
use std::io::Error;
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct File {
    pub name: String,
    pub body: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Symlink {
    name: String,
}

pub trait AsDirectory {
    fn name(&self) -> &String;
    // fn name_mut(&mut self) -> &mut String;
    fn directories(&self) -> &Vec<Directory>;
    fn directories_mut(&mut self) -> &mut Vec<Directory>;
    fn files(&self) -> &Vec<File>;
    fn files_mut(&mut self) -> &mut Vec<File>;
    // fn symlinks(&self) -> &Vec<Symlink>;
    // fn symlinks_mut(&mut self) -> &mut Vec<Symlink>;

    fn clear_bodies(&mut self) {
        for sub_file in self.files_mut().iter_mut() {
            sub_file.body = sub_file.body.take().filter(|body| !body.is_empty());
        }

        for sub_dir in self.directories_mut().iter_mut() {
            sub_dir.clear_bodies();
        }
    }
}

#[derive(Debug, Default, Serialize, Deserialize, Clone)]
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

    // fn symlinks(&self) -> &Vec<Symlink> {
    //     &self.symlinks
    // }

    // fn name_mut(&mut self) -> &mut String {
    //     &mut self.name
    // }

    fn directories_mut(&mut self) -> &mut Vec<Directory> {
        &mut self.directories
    }

    fn files_mut(&mut self) -> &mut Vec<File> {
        &mut self.files
    }

    // fn symlinks_mut(&mut self) -> &mut Vec<Symlink> {
    //     &mut self.symlinks
    // }
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

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Pack {
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

    // fn symlinks(&self) -> &Vec<Symlink> {
    //     &self.symlinks
    // }

    // fn name_mut(&mut self) -> &mut String {
    //     &mut self.name
    // }

    fn directories_mut(&mut self) -> &mut Vec<Directory> {
        &mut self.directories
    }

    fn files_mut(&mut self) -> &mut Vec<File> {
        &mut self.files
    }

    // fn symlinks_mut(&mut self) -> &mut Vec<Symlink> {
    //     &mut self.symlinks
    // }
}

impl Pack {
    pub fn with_origin<P>(mut self, origin: P) -> Self
    where
        P: Into<PathBuf>,
    {
        self.origin = Some(origin.into());
        self
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
        Self {
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
        let pack = Directory::try_from(&path).map(Pack::from)?;
        Ok(pack.with_origin(path))
    }
}
