import { open } from "@tauri-apps/plugin-dialog";
import { Directory } from "../types/FileSystem";
import { invoke } from "@tauri-apps/api/core";
import { Commands } from "./Commands";

export async function readDir() {
    const path = await open({ multiple: false, directory: true });
    if (!path) throw new Error("No path");

    return await invoke<Directory>(Commands.READ_DIR, { path });
}
