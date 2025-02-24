/* @refresh reload */
import { Route, Router } from "@solidjs/router";
import { render } from "solid-js/web";
import "./index.css";
import Home from "./pages/Home";

render(
    () => (
        <Router>
            <Route component={Home} />
        </Router>
    ),
    document.getElementById("root") as HTMLElement
);
