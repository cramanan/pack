import { Resource } from "solid-js";

export type SettingsStore = [
    settings: Resource<Settings>,
    {
        set<K extends keyof Settings>(key: K, value: Settings[K]): void;
        save: () => Promise<void>;
    }
];

export type Settings = {
    saveDirectory?: string;
};
