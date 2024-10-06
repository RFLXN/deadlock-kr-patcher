import { Container, Navbar, Nav as BsNav } from "react-bootstrap";
import { openDC, openGithub } from "../func.ts";

export function Nav() {
    const onGithubClick = () => {
        openGithub().catch();
    };

    const onDcClick = () => {
        openDC().catch();
    };

    return <Navbar expand="lg">
        <Container>
            <BsNav>
                <BsNav.Link onClick={onGithubClick}>Github</BsNav.Link>
                <BsNav.Link onClick={onDcClick}>DC</BsNav.Link>
            </BsNav>
        </Container>
    </Navbar>
}
