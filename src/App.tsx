import { error, info } from "@tauri-apps/plugin-log";
import {
    applyFontPatch,
    applyKoreanPatch, clearTempDir,
    createTempDir,
    downloadBuiltInFontPatch,
    downloadExternalFontPatch,
    downloadKoreanPatch, exitApp,
    fetchVersion,
    resolveInstallOptions, unzipFontPatch, unzipKoreanPatch
} from "./func.ts";
import { useEffect, useState } from "react";
import type { InitialLoadingState } from "./components/initial-loading-bar.tsx";
import { InitialLoadingPage } from "./pages/init-loading.tsx";
import { InstallControlPage } from "./pages/install-control.tsx";
import { InstallState } from "./components/install-bar.tsx";
import { InstallPage } from "./pages/install.tsx";
import { CompletePage } from "./pages/complete.tsx";
import { InstallFailPage } from "./pages/install-fail.tsx";

type installOptions = {
    installPath: string;
    fontPatch: "None" | "BuiltIn" | "External";
};


export function App() {
    const [remoteVersion, setRemoteVersion] = useState("버전 확인중");
    const [initialLoadingState, setInitialLoadingState] = useState<InitialLoadingState>("FetchingVersion");

    const [isInstalling, setIsInstalling] = useState(false);

    const [installState, setInstallState] = useState<InstallState>("ResolvingInstallOptions");
    const [isInstallFailed, setIsInstallFailed] = useState(false);
    const [installOptions, setInstallOptions] = useState<installOptions>({
        installPath: "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Deadlock",
        fontPatch: "None"
    });

    const doInitialLoading = async () => {
        const remoteVersion = await fetchVersion();
        setRemoteVersion(remoteVersion);
        setInitialLoadingState("CreateTempDir");

        await createTempDir();
        setInitialLoadingState("DownloadingKoreanPatches");

        await downloadKoreanPatch();
        setInitialLoadingState("DownloadingBuiltInFontPatches");

        await downloadBuiltInFontPatch();
        setInitialLoadingState("DownloadingExternalFontPatches");

        await downloadExternalFontPatch();
        setInitialLoadingState("Ready");

        setTimeout(() => {
            setInitialLoadingState("Complete");
        }, 1000 * 2);
    };

    const doInstallEnd = async () => {
        setInstallState("Done");
        await clearTempDir();
        setTimeout(() => {
            setInstallState("Complete");
        }, 1000 * 2);
        setTimeout(() => {
            exitApp().catch();
        }, 1000 * 8);
    };

    const doInstall = async (installPath: string, fontPatch: "None" | "BuiltIn" | "External") => {
        setIsInstalling(true);
        setInstallOptions({ installPath, fontPatch });

        try {
            await resolveInstallOptions(installPath, fontPatch);
            setInstallState("UnzipingKoreanPatch");

            await unzipKoreanPatch();
            setInstallState("ApplyingKoreanPatch");

            const next = await applyKoreanPatch();

            if (next == "None") {
                await doInstallEnd();
                return;
            }
            setInstallState("UnzipingFontPatch");

            await unzipFontPatch();
            setInstallState("ApplyingFontPatch");

            await applyFontPatch();
            await doInstallEnd();
        } catch (e) {
            setIsInstallFailed(true);
            info(String(e)).catch();
        }
    };

    useEffect(() => {
        doInitialLoading().catch(e => {
            error(e).catch();
        })
    }, []);

    if (initialLoadingState !== "Complete") {
        return <InitialLoadingPage state={initialLoadingState} version={remoteVersion} />;
    }

    if (!isInstalling && !isInstallFailed) {
        return <InstallControlPage doInstall={doInstall} />;
    }

    if (isInstallFailed) {
        return <InstallFailPage />
    }

    if (installState !== "Complete") {
        return <InstallPage state={installState} installPath={installOptions.installPath} fontPatch={installOptions.fontPatch} />;
    }

    return <CompletePage installPath={installOptions.installPath} fontPatch={installOptions.fontPatch} />;
}

export default App;
