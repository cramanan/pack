/* @refresh reload */
import { Route, Router } from "@solidjs/router";
import { render } from "solid-js/web";
import "./index.css";
import Home from "./pages/Home";
import Creator from "./pages/Creator/Creator";

render(
    () => (
        <Router>
            <Route path="/" component={Home} />
            <Route path="/creator" component={Creator} />
        </Router>
    ),
    document.getElementById("root") as HTMLElement
);
