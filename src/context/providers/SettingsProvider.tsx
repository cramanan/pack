import { getSettings } from "../../lib/settings";
import { settingsContext } from "../settings";
import { createResource, ParentProps, Suspense } from "solid-js";

export default function SettingsProvider(props: ParentProps) {
    const [settings] = createResource(getSettings);
    return (
        <settingsContext.Provider value={settings}>
            <Suspense>{props.children}</Suspense>
        </settingsContext.Provider>
    );
}
