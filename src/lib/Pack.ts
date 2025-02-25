import { open } from "@tauri-apps/plugin-dialog";
import { Pack } from "../types/FileSystem";
import { invoke } from "@tauri-apps/api/core";
import { Commands } from "./Commands";

export async function readDir() {
    const path = await open({ multiple: false, directory: true });
    if (!path) throw new Error("No path");

    return await invoke<Pack>(Commands.READ_DIR, { path });
}

export async function savePack(pack: Pack, targetDirectory: string) {
    return await invoke<string>(Commands.SAVE_PACK, { pack, targetDirectory });
}
