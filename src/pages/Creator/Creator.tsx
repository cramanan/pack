import { createStore, SetStoreFunction } from "solid-js/store";
import { createStep, MultiSteps, StepProps } from "../../components/MultiSteps";
import { defaultPack, Pack } from "../../types/FileSystem";
import { readDir, savePack } from "../../lib/Pack";
import { createResource, Resource } from "solid-js";
import { appDataDir } from "@tauri-apps/api/path";
import FileTree from "./FileTree";

function Create(props: { setPack: SetStoreFunction<Pack> } & StepProps) {
    return (
        <>
            <h2>Create a pack</h2>
            <div class="flex gap-3">
                <button
                    onClick={() => {
                        props.setPack({ ...defaultPack });
                        props.next();
                    }}
                >
                    From scratch
                </button>
                <button
                    onClick={async () => {
                        props.setPack({ ...(await readDir()) });
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
}

function Edit(props: { pack: Pack } & StepProps) {
    return (
        <>
            <form onSubmit={(e) => e.preventDefault()}>
                <h2>Edit the pack</h2>
                <input type="text" value={props.pack.id} />
                <FileTree directory={props.pack} />
            </form>
            <div class="flex gap-3">
                <button onClick={props.previous}>Back</button>
                <button onClick={props.next}>Next</button>
            </div>
        </>
    );
}

function Save(props: { directory: Resource<string>; pack: Pack } & StepProps) {
    const savePackInTargetDirectory = async () => {
        const targetDirectory = props.directory();
        if (!targetDirectory) return;
        const installedPath = await savePack(props.pack, targetDirectory);
        console.log(installedPath);
    };

    return (
        <>
            <h2>Save the pack</h2>
            <input type="text" value={props.directory()} />
            <div class="flex gap-3">
                <button onClick={props.previous}>Back</button>
                <button onClick={savePackInTargetDirectory}>Done</button>
            </div>
        </>
    );
}

export default function Creator() {
    const [pack, setPack] = createStore({ ...defaultPack });
    const [directory] = createResource(appDataDir);

    const createPage = createStep(Create, { setPack });
    const editPage = createStep(Edit, { pack });
    const savePage = createStep(Save, { directory, pack });

    return (
        <>
            <header>Pack Creator</header>
            <MultiSteps>
                {createPage}
                {editPage}
                {savePage}
                <div>Done</div>
            </MultiSteps>
        </>
    );
}
