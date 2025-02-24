import { createStore } from "solid-js/store";
import { MultiSteps } from "../components/MultiSteps";
import { defaultPack } from "../types/FileSystem";
import { readDir } from "../lib/Pack";

export default function Creator() {
    const [pack, setPack] = createStore(defaultPack);
    return (
        <>
            <header>Pack Creator</header>
            <MultiSteps>
                {({ next }) => (
                    <>
                        <h2>Create a pack</h2>
                        <div class="flex gap-3">
                            <button onClick={() => next()}>From scratch</button>
                            <button
                                onClick={async () => {
                                    const directory = await readDir();
                                    setPack((prev) => ({
                                        ...prev,
                                        ...directory,
                                    }));
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
                        <div>Dialog to see saved path (default)</div>
                        <div class="flex gap-3">
                            <button onClick={() => previous()}>Back</button>
                            <button onClick={() => console.log("Saving Pack")}>
                                Done
                            </button>
                        </div>
                    </>
                )}
            </MultiSteps>
        </>
    );
}
