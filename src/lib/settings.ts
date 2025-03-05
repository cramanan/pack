import { invoke } from "@tauri-apps/api/core";
import { Settings } from "../types/settings";

enum Commands {
    GET_SETTINGS = "get_settings",
}

export function getSettings() {
    return invoke<Settings>(Commands.GET_SETTINGS);
}

export async function saveSettings(settings: Settings) {
    console.log(settings);
}
