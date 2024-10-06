use crate::constants::*;
use crate::errors::Error;
use crate::models::{FontPatch, InstallOptions, Version};
use std::fs;
use std::fs::File;
use std::io::{copy, Cursor};
use std::path::Path;

static mut INSTALL_OPTIONS: InstallOptions = InstallOptions {
    install_path: String::new(),
    font_patch: FontPatch::None,
};

#[tauri::command]
pub async fn fetch_version() -> Result<String, Error> {
    let version = reqwest::get(VERSION_URL)
        .await?
        .json::<Version>()
        .await?
        .version;
    Ok(version)
}

#[tauri::command]
pub fn create_temp_dir() -> Result<(), Error> {
    fs::create_dir_all("deadlock-kr-temp")?;
    Ok(())
}

#[tauri::command]
pub fn clear_temp_dir() -> Result<(), Error> {
    fs::remove_dir_all("deadlock-kr-temp")?;
    Ok(())
}

async fn download_patch(url: &str, file_name: &str) -> Result<(), Error> {
    let response = reqwest::get(url).await?;
    let mut file = std::fs::File::create(file_name)?;
    let mut content = Cursor::new(response.bytes().await?);
    copy(&mut content, &mut file)?;
    Ok(())
}

#[tauri::command]
pub async fn download_korean_patch() -> Result<(), Error> {
    download_patch(KOREAN_PATCH_URL, KOREAN_PATCH_FILE).await?;
    Ok(())
}

#[tauri::command]
pub async fn download_builtin_font_patch() -> Result<(), Error> {
    download_patch(BUILTIN_FONT_PATCH_URL, BUILTIN_FONT_PATCH_FILE).await?;
    Ok(())
}

#[tauri::command]
pub async fn download_external_font_patch() -> Result<(), Error> {
    download_patch(EXTERNAL_FONT_PATCH_URL, EXTERNAL_FONT_PATCH_FILE).await?;
    Ok(())
}

fn unzip_patch(input: &str, output: &str) -> Result<(), Error> {
    let file = File::open(input)?;
    let mut archive = zip::ZipArchive::new(file)?;
    archive.extract(&output)?;

    Ok(())
}

fn create_not_found() -> Error {
    Error::Io(std::io::Error::new(
        std::io::ErrorKind::NotFound,
        "Install path not found",
    ))
}

fn create_invalid_font_patch() -> Error {
    Error::Io(std::io::Error::new(
        std::io::ErrorKind::InvalidInput,
        "Invalid font patch",
    ))
}

#[tauri::command]
pub fn resolve_install_options(install_path: String, font_patch: String) -> Result<(), Error> {
    let base_path = Path::new(&install_path);
    if !(base_path.is_dir()) {
        return Err(create_not_found());
    }

    let game_path = base_path.join("game");
    if !(game_path.is_dir()) {
        return Err(create_not_found());
    }

    unsafe {
        INSTALL_OPTIONS.install_path = String::from(&install_path);
    }

    match font_patch.as_str() {
        "None" => unsafe {
            INSTALL_OPTIONS.font_patch = FontPatch::None;
        },
        "BuiltIn" => unsafe {
            INSTALL_OPTIONS.font_patch = FontPatch::BuiltIn;
        },
        "External" => unsafe {
            INSTALL_OPTIONS.font_patch = FontPatch::External;
        },
        _ => return Err(create_invalid_font_patch()),
    }

    Ok(())
}

#[tauri::command]
pub fn unzip_korean_patch() -> Result<(), Error> {
    unzip_patch(KOREAN_PATCH_FILE, KOREAN_PATCH_UNZIP)?;

    Ok(())
}

fn copy_recursively(from: &str, to: &str) -> Result<(), Error> {
    let from_path = Path::new(from);
    let to_path = Path::new(to);

    if !from_path.exists() {
        return Err(create_not_found());
    }

    if !from_path.is_dir() {
        return Err(create_not_found());
    }

    copy_dir_all(&from_path, &to_path)
}

fn copy_dir_all(src: &Path, dst: &Path) -> Result<(), Error> {
    if !dst.exists() {
        fs::create_dir_all(dst)?;
    }

    for entry_result in fs::read_dir(src)? {
        let entry = entry_result?;
        let file_type = entry.file_type()?;
        let src_path = entry.path();
        let dst_path = dst.join(entry.file_name());

        if file_type.is_dir() {
            copy_dir_all(&src_path, &dst_path)?;
        } else if file_type.is_file() {
            fs::copy(&src_path, &dst_path)?;
        }
    }

    Ok(())
}

#[tauri::command]
pub fn apply_korean_patch() -> Result<String, Error> {
    unsafe {
        let target_path = &INSTALL_OPTIONS.install_path;
        let source_path = KOREAN_PATCH_UNZIP;

        copy_recursively(source_path, target_path)?;
    }

    unsafe {
        match INSTALL_OPTIONS.font_patch {
            FontPatch::None => Ok(String::from("None")),
            FontPatch::BuiltIn => Ok(String::from("BuiltIn")),
            FontPatch::External => Ok(String::from("External")),
        }
    }
}

#[tauri::command]
pub fn unzip_font_patch() -> Result<(), Error> {
    unsafe {
        let target_path = match INSTALL_OPTIONS.font_patch {
            FontPatch::BuiltIn => BUILTIN_FONT_UNZIP,
            FontPatch::External => EXTERNAL_FONT_UNZIP,
            _ => return Err(create_invalid_font_patch()),
        };

        let source_path = match INSTALL_OPTIONS.font_patch {
            FontPatch::BuiltIn => BUILTIN_FONT_PATCH_FILE,
            FontPatch::External => EXTERNAL_FONT_PATCH_FILE,
            _ => return Err(create_invalid_font_patch()),
        };

        unzip_patch(source_path, target_path)?;
    }

    Ok(())
}

#[tauri::command]
pub fn apply_font_patch() -> Result<(), Error> {
    unsafe {
        let target_path = &INSTALL_OPTIONS.install_path;
        let source_path = match INSTALL_OPTIONS.font_patch {
            FontPatch::BuiltIn => BUILTIN_FONT_UNZIP,
            FontPatch::External => EXTERNAL_FONT_UNZIP,
            _ => return Err(create_invalid_font_patch()),
        };

        copy_recursively(source_path, target_path)?;
    }

    Ok(())
}

#[tauri::command]
pub fn open_github() -> Result<(), Error> {
    webbrowser::open(GITHUB_URL)?;
    Ok(())
}

#[tauri::command]
pub fn open_dc() -> Result<(), Error> {
    webbrowser::open(DC_URL)?;
    Ok(())
}
