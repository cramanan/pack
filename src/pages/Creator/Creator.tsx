import { createMutable } from "solid-js/store";
import { createStep, MultiSteps, StepProps } from "../../components/MultiSteps";
import { defaultPack, File, Pack } from "../../types/fs";
import { createResource, createSignal } from "solid-js";
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
                    value={selectedFile()?.body}
                ></textarea>
            </aside>
        </div>
    );
}

function Save(props: { pack: Pack } & StepProps) {
    const [directory] = createResource(appDataDir);
    const savePackInTargetDirectory = async () => {
        const targetDirectory = directory();
        if (!targetDirectory) return;
        await savePack(props.pack, targetDirectory);
        props.next();
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
