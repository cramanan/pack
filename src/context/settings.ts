import { createContext, Resource, useContext } from "solid-js";
import { Settings } from "../types/settings";

export const settingsContext = createContext<Resource<Settings>>();

export const useSettings = () => {
    const context = useContext(settingsContext);
    if (!context) throw new Error("Uninitialized context");
    return context;
};
