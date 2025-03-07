import { For, Show } from "solid-js";
import { getSettings } from "../../lib/settings";
import { openDirectory } from "../../lib/Pack";

export default function Settings() {
    const [settings, { set, save }] = getSettings();
    const handleTheme = (e: { target: HTMLSelectElement }) => {
        const value = e.target.value;
        if (value === "Light" || value === "Dark") set("theme", value);
    };

    const handleSaveDirectory = async () => {
        const saveDirectory = await openDirectory();
        if (saveDirectory) set("saveDirectory", saveDirectory);
    };

    return (
        <Show when={settings()} fallback="Loading...">
            {(settings) => (
                <div>
                    {/* <pre>{JSON.stringify(settings(), null, 4)}</pre> */}
                    <label for="theme">Theme</label>
                    <select onChange={handleTheme}>
                        <For each={["Light", "Dark"] as const}>
                            {(value) => (
                                <option
                                    value={value}
                                    selected={settings().theme === value}
                                >
                                    {value}
                                </option>
                            )}
                        </For>
                    </select>
                    <div>
                        <label for="save-directory">Save Directory</label>
                        <div>{settings().saveDirectory}</div>
                        <button onClick={handleSaveDirectory}>Folder</button>
                    </div>
                    <button onClick={save}>SAVE</button>
                </div>
            )}
        </Show>
    );
}
