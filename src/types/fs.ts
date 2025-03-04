// TODO: maybe change Symlink to be equal to File
export type Symlink = {
    name: string;
};

export type File = {
    name: string;
    body: Uint8Array;
};

export type Directory = {
    name: string;
    directories: Directory[];
    files: File[];
    symlinks: Symlink[];
};

export type Pack = Directory & {
    id: string;
    origin?: string;
};

export const defaultPack: Pack = {
    id: "",
    name: "Untitled",
    directories: [],
    files: [],
    symlinks: [],
};
