/* @refresh reload */
import { Route, Router } from "@solidjs/router";
import { render } from "solid-js/web";
import "./index.css";
import Home from "./pages/Home";
import Creator from "./pages/Creator/Creator";
import SettingsProvider from "./context/providers/SettingsProvider";
import Settings from "./pages/Settings/Settings";

render(
    () => (
        <SettingsProvider>
            <Router>
                <Route path="/" component={Home} />
                <Route path="/creator" component={Creator} />
                <Route path="/settings" component={Settings} />
            </Router>
        </SettingsProvider>
    ),
    document.getElementById("root") as HTMLElement
);
