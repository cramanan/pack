import { Show } from "solid-js";
import { useSettings } from "../../context/settings";

export default function Settings() {
    const [settings, { save }] = useSettings();
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
