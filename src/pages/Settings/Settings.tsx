import { Show } from "solid-js";
import { getSettings } from "../../lib/settings";

export default function Settings() {
    const [settings, { save }] = getSettings();

    return (
        <Show when={settings()} fallback="Loading...">
            {(settings) => (
                <div>
                    <pre>{JSON.stringify(settings(), null, 4)}</pre>
                    <button onClick={save}>SAVE</button>
                </div>
            )}
        </Show>
    );
}
