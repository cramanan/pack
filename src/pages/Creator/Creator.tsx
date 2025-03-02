import { createMutable } from "solid-js/store";
import { createStep, MultiSteps, StepProps } from "../../components/MultiSteps";
import { defaultPack, File, Pack } from "../../types/fs";
import { createEffect, createResource, createSignal } from "solid-js";
import { appDataDir } from "@tauri-apps/api/path";
import FileTree from "../../components/FileTree";
import { importFromDirectory, openDirectory, savePack } from "../../lib/Pack";
import { path } from "@tauri-apps/api";

function Create(props: { pack: Pack } & StepProps) {
    const handleImport = async () => {
        const pack = await importFromDirectory();
        Object.assign(props.pack, pack);
        props.next();
    };

    return (
        <>
            <h2>Create a pack</h2>
            <div class="flex gap-3">
                <button onClick={props.next}>From scratch</button>
                <button onClick={handleImport}>From a local directory</button>
            </div>
            <div>
                <a href="/">Back</a>
            </div>
        </>
    );
}

function Edit(props: { pack: Pack } & StepProps) {
    const [selectedFile, setSelectedFile] = createSignal<File>();
    const [body, setBody] = createSignal("");

    const onInput = (e: { target: HTMLTextAreaElement }) =>
        setBody(e.target.value);

    const onSave = () => selectedFile() && (selectedFile()!.body = body());

    return (
        <div class="flex justify-between">
            <div>
                <form onSubmit={(e) => e.preventDefault()}>
                    <h2>Edit the pack</h2>
                    <FileTree
                        directory={props.pack}
                        onNewFile={setSelectedFile}
                        onFileClick={setSelectedFile}
                    />
                </form>
                <div class="flex gap-3">
                    <button onClick={props.previous}>Back</button>
                    <button onClick={props.next}>Next</button>
                </div>
            </div>
            <pre>{JSON.stringify(props.pack, null, 4)}</pre>
            <aside>
                <h1>editor</h1>
                <h2>{selectedFile()?.name}</h2>
                <button onClick={onSave}>Save</button>
                <textarea
                    class="border"
                    onInput={onInput}
                    value={selectedFile()?.body ?? ""}
                ></textarea>
            </aside>
        </div>
    );
}

function Save(props: { pack: Pack } & StepProps) {
    const [directory, { mutate }] = createResource(appDataDir, {
        initialValue: "",
    });

    const chooseTargetDirectory = async () => {
        const target = await openDirectory();
        target && mutate(target);
    };

    const savePackInTargetDirectory = async () => {
        const targetDirectory = directory();
        if (!targetDirectory) return;
        const path = await savePack(props.pack, targetDirectory);
        console.log(path);
        props.next();
    };

    createEffect(async () => {
        const target = directory();
        target && console.log(await path.join(target, props.pack.name, ".pck"));
    });

    return (
        <>
            <h2>Save the pack</h2>
            <div>
                <div>{directory()}</div>
                <div onClick={chooseTargetDirectory}>Choose Target</div>
                <div>Pack will be saved as: {}</div>
            </div>
            <div class="flex gap-3">
                <button onClick={props.previous}>Back</button>
                <button onClick={savePackInTargetDirectory}>SAVE</button>
            </div>
        </>
    );
}

const steps = [Create, Edit, Save];

export default function Creator() {
    const pack = createMutable({ ...defaultPack });
    const pages = steps.map((component) => createStep(component, { pack }));

    return (
        <>
            <header>Pack Creator</header>
            <MultiSteps>{pages}</MultiSteps>
        </>
    );
}
