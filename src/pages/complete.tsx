import { Container } from "react-bootstrap";

export type CompletePageProps = {
    installPath: string;
    fontPatch: "None" | "BuiltIn" | "External";
};

const fontPatchLabels = {
    None: "없음",
    BuiltIn: "내장 폰트 패치",
    External: "외부 폰트 패치"
};

export function CompletePage({ installPath, fontPatch }: CompletePageProps) {
    return <Container className="pt-5">
        <h1>한글 패치 완료</h1>
        <p>설치 경로: {installPath}</p>
        <p>폰트 패치: {fontPatchLabels[fontPatch]}</p>
        <h3>잠시 뒤 종료됩니다.</h3>

    </Container>;
}
