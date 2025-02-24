import { MultiSteps } from "../components/MultiSteps";

export default function Creator() {
    return (
        <>
            <header>Pack Creator</header>
            <MultiSteps>
                {({ next }) => (
                    <div>
                        <h2>Create a pack</h2>
                        <button onClick={() => next()}>From scratch</button>
                        <div>
                            <a href="/">Back</a>
                        </div>
                    </div>
                )}
                {({ previous, next }) => (
                    <div>
                        <h2>Edit the pack</h2>
                        Foo
                        <div class="flex gap-3">
                            <button onClick={() => previous()}>Back</button>
                            <button onClick={() => next()}>Done</button>
                        </div>
                    </div>
                )}
                {({ previous }) => (
                    <div>
                        <h2>Save the pack</h2>
                        <div>Dialog to see saved path (default)</div>
                        <div class="flex gap-3">
                            <button onClick={() => previous()}>Back</button>
                            <button onClick={() => console.log("Saving Pack")}>
                                Done
                            </button>
                        </div>
                    </div>
                )}
            </MultiSteps>
        </>
    );
}
