import { createResource, For, Show } from "solid-js";
import { readPackName } from "../lib/Pack";
import { appDataDir } from "@tauri-apps/api/path";

export default function Home() {
    const [pack_names] = createResource(async () =>
        readPackName(await appDataDir())
    );
    return (
        <>
            <a href="/creator">Create Pack</a>
            <main>
                <Show when={pack_names()}>
                    {(pack_names) => (
                        <For each={pack_names()}>
                            {(name) => <div>{name}</div>}
                        </For>
                    )}
                </Show>
            </main>
        </>
    );
}
