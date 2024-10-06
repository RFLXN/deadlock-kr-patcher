#[derive(serde::Deserialize)]
pub struct Version {
    pub version: String,
}

pub enum FontPatch {
    None,
    BuiltIn,
    External,
}

pub struct InstallOptions {
    pub install_path: String,
    pub font_patch: FontPatch,
}
