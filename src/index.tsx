/* @refresh reload */
import { Route, Router } from "@solidjs/router";
import { render } from "solid-js/web";
import "./index.css";
import Home from "./pages/Home";
import Creator from "./pages/Creator/Creator";
import Settings from "./pages/Settings/Settings";

render(
    () => (
        <Router>
            <Route path="/" component={Home} />
            <Route path="/creator" component={Creator} />
            <Route path="/settings" component={Settings} />
        </Router>
    ),
    document.getElementById("root") as HTMLElement
);
