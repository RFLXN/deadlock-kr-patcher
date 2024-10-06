import { Container } from "react-bootstrap";

export function InstallFailPage() {
    return <Container className="pt-5">
        <h1>설치 실패</h1>
        <p>설치하는 중 오류가 발생했습니다. 다시 시도해주세요.</p>
    </Container>
}
