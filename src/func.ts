import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { exit } from "@tauri-apps/plugin-process";

export async function fetchVersion(): Promise<string> {
    return invoke("fetch_version");
}

export async function createTempDir(): Promise<void> {
    return invoke("create_temp_dir");
}

export async function clearTempDir(): Promise<void> {
    return invoke("clear_temp_dir");
}

export async function downloadKoreanPatch(): Promise<void> {
    return invoke("download_korean_patch");
}

export async function downloadBuiltInFontPatch(): Promise<void> {
    return invoke("download_builtin_font_patch");
}

export async function downloadExternalFontPatch(): Promise<void> {
    return invoke("download_external_font_patch");
}

export async function getInstallPath(): Promise<string | null> {
    return await open({
        multiple: false,
        directory: true,
        defaultPath: "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Deadlock"
    });
}

export async function resolveInstallOptions(installPath: string, fontPatch: "None" | "BuiltIn" | "External"): Promise<void> {
    return invoke("resolve_install_options", {
        installPath, fontPatch
    });
}

export async function unzipKoreanPatch(): Promise<void> {
    return invoke("unzip_korean_patch");
}

export async function applyKoreanPatch(): Promise<"None" | "BuiltIn" | "External"> {
    return invoke("apply_korean_patch");
}

export async function unzipFontPatch(): Promise<void> {
    return invoke("unzip_font_patch");
}

export async function applyFontPatch(): Promise<void> {
    return invoke("apply_font_patch");
}

export async function openGithub(): Promise<void> {
    return invoke("open_github");
}

export async function openDC(): Promise<void> {
    return invoke("open_dc");
}

export async function exitApp(): Promise<void> {
    return exit(0);
}
