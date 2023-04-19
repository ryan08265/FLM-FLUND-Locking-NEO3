import { Link } from "react-router-dom";
import { Container, Nav, NavItem, Navbar as BsNavbar} from 'react-bootstrap';
import logo from '../../assets/images/logo.svg';
import './index.scss';
function Navbar() {
  return (
    <BsNavbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{ background: "#141414", borderBottom: "1px solid #707070"}}>
      <Container>
        <Link
					className='d-flex align-items-center navbar-brand mr-0 c-logo-container'
					to="/"
				>
					<img src={logo} alt="Logo"/>
				</Link>
        <BsNavbar.Toggle aria-controls="responsive-navbar-nav" style={{ background: "#D8D3D3" }}/>
        <BsNavbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className="custom-navbar-button custom-navbar-normal-button"><Link to="/">Home</Link></Nav.Link>
            <Nav.Link className="custom-navbar-button custom-navbar-normal-button"><Link to="/locking">Locking</Link></Nav.Link>
            <Nav.Link className="custom-navbar-button custom-navbar-normal-button"><Link to="/deposit">Deposit</Link></Nav.Link>
          </Nav>
          <NavItem className='custom-navbar-button auth-button'>
							Connect Wallet
					</NavItem>
          
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}

export default Navbar;