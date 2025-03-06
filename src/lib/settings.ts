import { invoke } from "@tauri-apps/api/core";
import { Settings } from "../types/settings";
import { createResource } from "solid-js";

enum Commands {
    GET_SETTINGS = "get_settings",
    SAVE_SETTINGS = "save_settings",
}

export function getSettings() {
    const [settings, { mutate }] = createResource(() =>
        invoke<Settings>(Commands.GET_SETTINGS)
    );

    // TODO: add backend mutation
    const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
        mutate((prev) => ({ ...prev, [key]: value }));

    const save = () => invoke(Commands.SAVE_SETTINGS, { settings: settings() });

    return [settings, { set, save }] as const;
}
