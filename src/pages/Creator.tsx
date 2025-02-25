import { createStore, SetStoreFunction } from "solid-js/store";
import { MultiSteps, StepProps } from "../components/MultiSteps";
import { defaultPack, Pack } from "../types/FileSystem";
import { readDir, savePack } from "../lib/Pack";
import { createResource, Resource } from "solid-js";
import { appDataDir } from "@tauri-apps/api/path";

function Create(setPack: SetStoreFunction<Pack>) {
    return function (props: StepProps) {
        return (
            <>
                <h2>Create a pack</h2>
                <div class="flex gap-3">
                    <button
                        onClick={() => {
                            setPack({ ...defaultPack });
                            props.next();
                        }}
                    >
                        From scratch
                    </button>
                    <button
                        onClick={async () => {
                            setPack(await readDir());
                            props.next();
                        }}
                    >
                        From a local directory
                    </button>
                </div>
                <div>
                    <a href="/">Back</a>
                </div>
            </>
        );
    };
}

function Edit(pack: Pack, setPack: SetStoreFunction<Pack>) {
    return function (props: StepProps) {
        return (
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
                        onChange={(e) => setPack("name", e.target.value)}
                    />
                </form>
                <div class="flex gap-3">
                    <button onClick={props.previous}>Back</button>
                    <button onClick={props.next}>Next</button>
                </div>
            </>
        );
    };
}

function Save(directory: Resource<string>, pack: Pack) {
    return function (props: StepProps) {
        console.log(directory(), pack);
        const savePackInTargetDirectory = async () => {
            const targetDirectory = directory();
            if (!targetDirectory) return;
            console.log("saving pack at", targetDirectory);
            savePack(pack, targetDirectory);
        };

        return (
            <>
                <h2>Save the pack</h2>
                <input type="text" value={directory()} />
                <div class="flex gap-3">
                    <button onClick={props.previous}>Back</button>
                    <button onClick={savePackInTargetDirectory}>Done</button>
                </div>
            </>
        );
    };
}

export default function Creator() {
    const [pack, setPack] = createStore({ ...defaultPack });
    const [directory] = createResource(appDataDir);

    const createPage = Create(setPack);
    const editPage = Edit(pack, setPack);
    const savePage = Save(directory, pack);

    return (
        <>
            <header>Pack Creator</header>
            <MultiSteps>
                {createPage}
                {editPage}
                {savePage}
                <div>
                    {" "}
                    <h1>Done</h1>
                    <a href="/">Back to Home</a>
                </div>
            </MultiSteps>
        </>
    );
}
