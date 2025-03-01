import { createMutable, createStore } from "solid-js/store";
import { createStep, MultiSteps, StepProps } from "../../components/MultiSteps";
import { defaultPack, File, Pack } from "../../types/fs";
import { createEffect, createResource, createSignal, Show } from "solid-js";
import { appDataDir } from "@tauri-apps/api/path";
import FileTree from "../../components/FileTree";
import { savePack } from "../../lib/Pack";

function Create(props: { pack: Pack } & StepProps) {
    return (
        <>
            <h2>Create a pack</h2>
            <div class="flex gap-3">
                <button onClick={props.next}>From scratch</button>
            </div>
            <div>
                <a href="/">Back</a>
            </div>
        </>
    );
}

function Edit(props: { pack: Pack } & StepProps) {
    const [file, setFile] = createStore<File>({
        name: "untitled",
    });

    return (
        <div class="flex justify-between">
            <div>
                <form onSubmit={(e) => e.preventDefault()}>
                    <h2>Edit the pack</h2>
                    <FileTree directory={props.pack} onNewFile={setFile} />
                </form>
                <div class="flex gap-3">
                    <button onClick={props.previous}>Back</button>
                    <button onClick={props.next}>Next</button>
                </div>
            </div>

            <aside>
                <h1>editor</h1>
                <h2>{file.name}</h2>
                <textarea value={file.body ?? ""}></textarea>
            </aside>
        </div>
    );
}

function Save(props: { pack: Pack } & StepProps) {
    const [directory] = createResource(appDataDir);
    const savePackInTargetDirectory = () => {
        const targetDirectory = directory();
        if (!targetDirectory) return;
        savePack(props.pack, targetDirectory);
    };
    return (
        <>
            <h2>Save the pack</h2>
            <div>
                <input type="text" value={directory()} />
                <div>dialog here</div>
            </div>
            <div class="flex gap-3">
                <button onClick={props.previous}>Back</button>
                <button onClick={savePackInTargetDirectory}>SAVE</button>
            </div>
        </>
    );
}

export default function Creator() {
    const pack = createMutable({ ...defaultPack });

    const createPage = createStep(Create, { pack });
    const editPage = createStep(Edit, { pack });
    const savePage = createStep(Save, { pack });

    return (
        <>
            <header>Pack Creator</header>
            <MultiSteps>
                {/* {createPage} */}
                {editPage}
                {savePage}
            </MultiSteps>
        </>
    );
}
