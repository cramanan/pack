import { createSignal, For, JSXElement, Match, Switch } from "solid-js";

type Prettify<T> = {
    [K in keyof T]: T[K];
} & {};

export type StepProps = { previous: () => void; next: () => void };

type ChildrenStep =
    | ((props: StepProps) => JSXElement)
    | (() => JSXElement)
    | JSXElement;

export function createStep<
    T extends Record<string, unknown> & StepProps,
    U extends Omit<T, keyof StepProps>
>(component: (args: Prettify<T>) => JSXElement, args: Prettify<U>) {
    return function (props: StepProps) {
        return component({ ...args, ...props } as T);
    };
}

export function MultiSteps(props: { children: ChildrenStep[] }) {
    const [current, setCurrent] = createSignal(0);

    // prevent illegal invocation with variadic
    const next = (..._args: unknown[]) =>
        setCurrent((prev) => Math.min(prev + 1, props.children.length - 1));

    // prevent illegal invocation with variadic
    const previous = (..._args: unknown[]) =>
        setCurrent((prev) => Math.max(prev - 1, 0));

    return (
        <Switch>
            <For each={props.children}>
                {(child, index) => (
                    <Match when={current() === index()}>
                        {child instanceof Function
                            ? child({ previous, next })
                            : child}
                    </Match>
                )}
            </For>
        </Switch>
    );
}
