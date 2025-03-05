import { getSettings } from "../../lib/settings";
import { SettingsStore } from "../../types/settings";
import { settingsContext } from "../settings";
import { createResource, ParentProps, Suspense } from "solid-js";

export default function SettingsProvider(props: ParentProps) {
    const [settings, { mutate }] = createResource(getSettings);
    const store: SettingsStore = [
        settings,
        {
            set: (key, value) => mutate((prev) => ({ ...prev, [key]: value })),
            async save() {
                const value = settings();
                if (!value) return;
                console.log(value);
            },
        },
    ];

    return (
        <settingsContext.Provider value={store}>
            <Suspense>{props.children}</Suspense>
        </settingsContext.Provider>
    );
}
