import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const NavbarComponent: React.FC = () => {
    return (
        <Navbar className="navbar" expand="lg" fixed="top" bg="primary" variant="dark">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Car Rental
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">
                            Home
                        </Nav.Link>
                        <Nav.Link as={Link} to="/models">
                            Car Models
                        </Nav.Link>
                        <Nav.Link as={Link} to="/fleet">
                            Fleet
                        </Nav.Link>
                        <NavDropdown title="Services" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Service 1</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Service 2</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Service 3</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                Separated Link
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponent;
