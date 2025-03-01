import { invoke } from "@tauri-apps/api/core";
import { Commands } from "../types/commands";
import { Pack } from "../types/fs";

export function savePack(pack: Pack, targetDirectory: string) {
    return invoke<string>(Commands.SAVE_PACK, { pack, targetDirectory });
}
