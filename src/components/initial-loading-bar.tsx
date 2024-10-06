import { ProgressBar } from "react-bootstrap";

enum InitialLoadingStates {
    FetchingVersion,
    CreateTempDir,
    DownloadingKoreanPatches,
    DownloadingBuiltInFontPatches,
    DownloadingExternalFontPatches,
    Complete,
    Ready
}

export type InitialLoadingState = keyof typeof InitialLoadingStates;

export type InitialLoadingBarProps = {
    state: InitialLoadingState;
}

const stateToLabel: Record<InitialLoadingState, string> = {
    FetchingVersion: "[1/6] 한글패치 버전 확인중",
    CreateTempDir: "[2/6] 임시 디렉토리 생성중",
    DownloadingKoreanPatches: "[3/6] 한글패치 다운로드중",
    DownloadingBuiltInFontPatches: "[4/6] 폰트 개선 패치 (내장 폰트) 다운로드중",
    DownloadingExternalFontPatches: "[5/6] 폰트 개선 패치 (맞춤 폰트) 다운로드중",
    Ready: "[6/6] 준비 완료!",
    Complete: "[6/6] 준비 완료!"
}

const stateToProgress: Record<InitialLoadingState, number> = {
    FetchingVersion: 0,
    CreateTempDir: 20,
    DownloadingKoreanPatches: 40,
    DownloadingBuiltInFontPatches: 60,
    DownloadingExternalFontPatches: 80,
    Ready: 100,
    Complete: 100
}

export function InitialLoadingBar({ state }: InitialLoadingBarProps) {
    const isAnimated = state != "Ready" && state != "Complete";
    const variant = state == "Ready" || state == "Complete" ? "success" : undefined;
    return <ProgressBar style={{ height: "2rem" }} variant={variant} animated={isAnimated} now={stateToProgress[state]} label={stateToLabel[state]}/>;
}
