import { Link } from "react-router-dom";
import { Container, Nav, Navbar as BsNavbar} from 'react-bootstrap';

function Layout() {
  return (
    <BsNavbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{ background: "#141414", borderBottom: "1px solid #707070"}}>
      <Container>
        <BsNavbar.Toggle aria-controls="responsive-navbar-nav" />
        <BsNavbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link><Link to="/">Home</Link></Nav.Link>
            <Nav.Link><Link to="/locking">Locking</Link></Nav.Link>
            <Nav.Link><Link to="/deposit">Deposit</Link></Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="#deets">More deets</Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
              Dank memes
            </Nav.Link>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}

export default Layout;