import { createStore } from "solid-js/store";
import { MultiSteps } from "../components/MultiSteps";
import { defaultPack } from "../types/FileSystem";
import { readDir, savePack } from "../lib/Pack";
import { createResource } from "solid-js";
import { appDataDir } from "@tauri-apps/api/path";

export default function Creator() {
    const [pack, setPack] = createStore(defaultPack);
    const [directory] = createResource(appDataDir);
    const savePackInTargetDirectory = async () => {
        const targetDirectory = directory();
        if (!targetDirectory) return;
        console.log("saving pack at", targetDirectory);
        savePack(pack, targetDirectory);
    };

    return (
        <>
            <header>Pack Creator</header>
            <MultiSteps>
                {({ next }) => (
                    <>
                        <h2>Create a pack</h2>
                        <div class="flex gap-3">
                            <button onClick={next}>From scratch</button>
                            <button
                                onClick={async () => {
                                    setPack(await readDir());
                                    next();
                                }}
                            >
                                From a local directory
                            </button>
                        </div>
                        <div>
                            <a href="/">Back</a>
                        </div>
                    </>
                )}
                {({ previous, next }) => (
                    <>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <h2>Edit the pack</h2>
                            <div class="whitespace-pre">
                                {JSON.stringify(pack, null, 4)}
                            </div>
                            <input
                                type="text"
                                class="w-fit"
                                value={pack.name}
                                onChange={(e) =>
                                    setPack("name", e.target.value)
                                }
                            />
                        </form>
                        <div class="flex gap-3">
                            <button onClick={() => previous()}>Back</button>
                            <button onClick={() => next()}>Done</button>
                        </div>
                    </>
                )}
                {({ previous }) => (
                    <>
                        <h2>Save the pack</h2>
                        <input type="text" value={directory()} />
                        <div class="flex gap-3">
                            <button onClick={() => previous()}>Back</button>
                            <button onClick={savePackInTargetDirectory}>
                                Done
                            </button>
                        </div>
                    </>
                )}
            </MultiSteps>
        </>
    );
}
