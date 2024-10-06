import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { listen } from "@tauri-apps/api/event";
import { clearTempDir } from "./func.ts";
import { Nav } from "./components/nav.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <ThemeProvider>
            <Nav/>
            <App/>
        </ThemeProvider>
    </React.StrictMode>,
);

const unlistenCloseRequest = listen("tauri://close-requested", () => {
    clearTempDir().then(() => {
        return unlistenCloseRequest;
    })
        .then(unlisten => unlisten())
        .catch();
}).catch();
