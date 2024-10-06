import { Container, Stack } from "react-bootstrap";
import { InitialLoadingBar, InitialLoadingState } from "../components/initial-loading-bar.tsx";

export type InitialLoadingPageProps = {
    state: InitialLoadingState;
    version: string;
}

export function InitialLoadingPage({ state, version }: InitialLoadingPageProps) {
    return <Container className="pt-5">
        <Stack>
            <h1>사전 로딩중...</h1>
            <p>버전: {version}</p>
            <InitialLoadingBar state={state} />
        </Stack>
    </Container>;
}
