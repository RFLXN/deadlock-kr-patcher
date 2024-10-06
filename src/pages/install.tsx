import { InstallBar, InstallState } from "../components/install-bar.tsx";
import { Container, Stack } from "react-bootstrap";

export type InstallPageProps = {
    state: InstallState;
    installPath: string;
    fontPatch: "None" | "BuiltIn" | "External";
}

const fontPatchToLabel: Record<"None" | "BuiltIn" | "External", string> = {
    None: "없음",
    BuiltIn: "내장 폰트",
    External: "맞춤 폰트(외부 폰트)"
};

export function InstallPage({ state, installPath, fontPatch }: InstallPageProps) {
    return <Container className="pt-5">
        <Stack>
            <h1>한글 패치 설치중...</h1>
            <p>설치 경로: {installPath}</p>
            <p>폰트 패치: {fontPatchToLabel[fontPatch]}</p>
            <InstallBar state={state} />
        </Stack>
    </Container>;
}
