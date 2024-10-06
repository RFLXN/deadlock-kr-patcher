import { ProgressBar } from "react-bootstrap";

enum InstallStates {
    ResolvingInstallOptions,
    UnzipingKoreanPatch,
    ApplyingKoreanPatch,
    UnzipingFontPatch,
    ApplyingFontPatch,
    Done,
    Complete
}

export type InstallState = keyof typeof InstallStates;

export type InstallBarProps = {
    state: InstallState;
}

const stateToLabel: Record<InstallState, string> = {
    ResolvingInstallOptions: "[1/5] 설치 옵션 확인중",
    UnzipingKoreanPatch: "[2/5] 한글패치 압축 해제중",
    ApplyingKoreanPatch: "[3/5] 한글패치 적용중",
    UnzipingFontPatch: "[4/5] 폰트 패치 압축 해제중",
    ApplyingFontPatch: "[5/5] 폰트 패치 적용중",
    Done: "[5/5] 작업 완료",
    Complete: "[5/5] 작업 완료"
}

const stateToProgress: Record<InstallState, number> = {
    ResolvingInstallOptions: 0,
    UnzipingKoreanPatch: 20,
    ApplyingKoreanPatch: 40,
    UnzipingFontPatch: 60,
    ApplyingFontPatch: 80,
    Done: 100,
    Complete: 100
}

export function InstallBar({ state }: InstallBarProps) {
    const isAnimated = state != "Done" && state != "Complete";
    const variant = state == "Done" || state == "Complete" ? "success" : undefined;
    return <ProgressBar style={{ height: "2rem" }} variant={variant} animated={isAnimated} now={stateToProgress[state]} label={stateToLabel[state]} />
}
