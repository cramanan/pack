import { createSignal, For, Match, Switch } from "solid-js";
import { JSX } from "solid-js";

type ChildrenStep =
    | ((next: () => void, previous: () => void) => JSX.Element)
    | (() => JSX.Element);

export function MultiSteps(props: { children: ChildrenStep[] }) {
    const [current, setCurrent] = createSignal(0);

    const next = () =>
        setCurrent((prev) => Math.min(prev + 1, props.children.length - 1));

    const previous = () => setCurrent((prev) => Math.max(prev - 1, 0));

    return (
        <Switch fallback={<div>Invalid step</div>}>
            <For each={props.children}>
                {(child, index) => (
                    <Match when={current() === index()}>
                        {child(next, previous)}
                    </Match>
                )}
            </For>
        </Switch>
    );
}
