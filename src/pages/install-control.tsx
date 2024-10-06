import { Button, Container, Form, InputGroup } from "react-bootstrap";
import { ReactEventHandler, useState } from "react";
import { getInstallPath } from "../func.ts";

type FontPatch = "None" | "BuiltIn" | "External";

export type InstallControlPageProps = {
    doInstall: (installPath: string, fontPatch: FontPatch) => void | Promise<void>;
};

export function InstallControlPage({doInstall}: InstallControlPageProps) {
    const [installPath, setInstallPath] = useState("C:\\Program Files (x86)\\Steam\\steamapps\\common\\Deadlock");
    const [fontPatch, setFontPatch] = useState<FontPatch>("None");

    const onPathSelectClick = async () => {
        const path = await getInstallPath();
        if (path) setInstallPath(path);
    }

    const onFontPatchChange: ReactEventHandler<HTMLSelectElement> = (e) => {
        setFontPatch(e.currentTarget.value as FontPatch);
    }

    const onInstallClick = async () => {
        doInstall(installPath, fontPatch);
    }

    return <Container className="pt-5">
        <Form>
            <Form.Group>
                <Form.Label column={true}>설치 경로</Form.Label>
                <InputGroup>
                    <Form.Control type="text" disabled value={installPath}></Form.Control>
                    <Button onClick={onPathSelectClick}>경로 선택</Button>
                </InputGroup>
                <Form.Text>
                    데드락이 설치된 경로 ("game" 폴더가 들어있는 "Deadlock" 폴더를 선택해주세요)
                </Form.Text>
                <br />
                <Form.Text>
                    데드락 기본 설치 경로: C:\Program Files (x86)\Steam\steamapps\common\Deadlock
                </Form.Text>
            </Form.Group>

            <Form.Group className="mt-2">
                <Form.Label column={true}>폰트 패치</Form.Label>
                <Form.Select value={fontPatch} onChange={onFontPatchChange}>
                    <option value="None">없음</option>
                    <option value="BuiltIn">내장 폰트 패치</option>
                    <option value="External">맞춤 폰트(외장 폰트) 패치</option>
                </Form.Select>
            </Form.Group>

            <Button variant="success" size="lg" className="mt-5 w-100" onClick={onInstallClick}>설치</Button>
        </Form>
    </Container>;
}
