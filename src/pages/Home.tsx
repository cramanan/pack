import { createEffect } from "solid-js";
import { useSettings } from "../context/settings";

export default function Home() {
    createEffect(() => console.log(useSettings()()));
    return <a href="/creator">Create Pack</a>;
}
