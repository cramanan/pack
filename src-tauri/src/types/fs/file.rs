use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct File {
    name: String,
    body: Vec<u8>,
}

impl File {
    pub fn new(name: String) -> Self {
        Self {
            name,
            body: Vec::new(),
        }
    }

    pub fn body(&self) -> &Vec<u8> {
        &self.body
    }

    pub fn len(&self) -> usize {
        self.body.len()
    }
}

pub trait Named {
    fn name(&self) -> &String;
}

impl Named for File {
    fn name(&self) -> &String {
        &self.name
    }
}
