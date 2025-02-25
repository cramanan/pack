import { createSignal, For, Show } from "solid-js";
import { Directory } from "../../types/FileSystem";
import Folder from "lucide-solid/icons/folder";
import File from "lucide-solid/icons/file";

export default function FileTree(props: { directory: Directory }) {
    const [collapse, setCollapse] = createSignal(true);
    const toggle = () => setCollapse((prev) => !prev);
    return (
        <div class="px-3">
            <div onClick={toggle} class="flex items-center gap-1">
                <Folder width={20} /> <span>{props.directory.name}</span>
            </div>
            <Show when={!collapse()}>
                <For each={props.directory.directories}>
                    {(directory) => <FileTree directory={directory} />}
                </For>
                <For each={props.directory.files}>
                    {(file) => (
                        <div class="flex items-center gap-2">
                            <File />
                            <span>{file.name}</span>
                        </div>
                    )}
                </For>
            </Show>
        </div>
    );
}
