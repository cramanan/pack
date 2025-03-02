import { invoke } from "@tauri-apps/api/core";
import { Commands } from "../types/commands";
import { Pack } from "../types/fs";
import { open } from "@tauri-apps/plugin-dialog";

export function openDirectory() {
    return open({ directory: true, canCreateDirectories: true });
}

export async function importFromDirectory() {
    const path = await openDirectory();
    if (!path) throw new Error("Path Error");

    return invoke<Pack>(Commands.IMPORT_FROM_DIRECTORY, { path });
}

export function savePack(pack: Pack, targetDirectory: string) {
    return invoke<string>(Commands.SAVE_PACK, { pack, targetDirectory });
}
