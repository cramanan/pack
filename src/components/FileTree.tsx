import { For } from "solid-js";
import { Directory, File } from "../types/fs";
import Folder from "lucide-solid/icons/folder";
import FileIcon from "lucide-solid/icons/file";
import FilePlus from "lucide-solid/icons/file-plus-2";
import FolderPlus from "lucide-solid/icons/folder-plus";
import Trash from "lucide-solid/icons/trash-2";
import { createMutable } from "solid-js/store";

type Callbacks = {
    onNewFile?: (file: File) => void;
    onFileClick?: (file: File) => void;
};

export default function FileTree(props: { directory: Directory } & Callbacks) {
    const addFile = () => {
        const name = prompt("File Name:");
        if (!name?.trim()) return;
        const file = createMutable<File>({ name, body: new Uint8Array() });
        const files = [...props.directory.files, file];
        props.directory.files = files;

        props.onNewFile && props.onNewFile(file);
    };

    const addDirectory = () => {
        const name = prompt("Directory Name:");
        if (!name) return;

        const directory = {
            name,
            directories: [],
            files: [],
            symlinks: [],
        };
        const directories = [...props.directory.directories, directory];
        props.directory.directories = directories;
    };

    return (
        <div class="px-3 select-none cursor-pointer">
            <div class="flex items-center gap-1">
                <Folder size={20} />
                <h2>{props.directory.name}</h2>
                <FilePlus size={20} onClick={addFile} />
                <FolderPlus size={20} onClick={addDirectory} />
            </div>
            <For each={props.directory.directories}>
                {(subdirectory) => (
                    <FileTree
                        directory={subdirectory}
                        onNewFile={props.onNewFile}
                        onFileClick={props.onFileClick}
                    />
                )}
            </For>
            <For each={props.directory.files}>
                {(file) => (
                    <div class="flex items-center gap-2">
                        <div
                            class="flex items-center"
                            onDblClick={() =>
                                props.onFileClick && props.onFileClick(file)
                            }
                        >
                            <FileIcon />
                            <div class="cursor-default">{file.name}</div>
                        </div>
                        <Trash size={20} />
                    </div>
                )}
            </For>
        </div>
    );
}
