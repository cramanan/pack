import { createContext, useContext } from "solid-js";
import { SettingsStore } from "../types/settings";

export const settingsContext = createContext<SettingsStore>();

export const useSettings = () => {
    const context = useContext(settingsContext);
    if (!context) throw new Error("Uninitialized context");
    return context;
};
