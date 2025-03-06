use std::{fs::File, path::PathBuf};

use serde::{Deserialize, Serialize};

use super::fs::pack::Pack;

type Paths = Vec<PathBuf>;

#[derive(Debug, Serialize, Deserialize)]
pub struct Config {
    ignore: Option<Paths>,
}

const CONFIG_FILENAME: &str = "pack.config.json";

impl Pack {
    pub fn config(&self) -> Option<Config> {
        self.origin()
            .and_then(|origin| File::open(origin.join(CONFIG_FILENAME)).ok())
            .and_then(|f| serde_json::from_reader(f).ok())
    }
}
