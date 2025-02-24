// TODO: maybe change Symlink to be equal to File
export type Symlink = {
    name: string;
};

export type File = {
    name: string;
    body: string;
};

export type Directory = {
    name: string;
    directories: Directory[];
    files: File[];
    symlinks: Symlink[];
};

export type Pack = Directory & {
    id: string;
};

export const defaultPack: Pack = {
    id: "",
    name: "Untitled",
    directories: [],
    files: [],
    symlinks: [],
};
