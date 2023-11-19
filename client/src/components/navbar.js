import React from "react";
 
// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";
 
// Here, we display our Navbar
export default function Navigationbar() {

    const handleLogout = () => {
      // Clear the token from localStorage
      localStorage.removeItem('token');
      // Redirect or handle logout success as needed
    };
  
 return (

  <Navbar expand="lg" bg="white" fixed="top" className="navbar-fixed-top bg-body-tertiary">
  <Container>
    <Navbar.Brand className="me-5 ms-0" href="/products">Inno</Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="me-auto">
      <Nav.Link className="me-5 ms-5" href="/products">Products</Nav.Link>
      <Nav.Link className="me-5 ms-5" href="/sales">Sales</Nav.Link>
        <NavDropdown className="me-5 ms-5" id="basic-nav-dropdown" title="Sales" href="/sales">
          <NavDropdown.Item href="/createSale">Create New Sale</NavDropdown.Item>
        </NavDropdown>
        <Nav.Link className="me-5 ms-5" href="/login" onClick={handleLogout} >Logout</Nav.Link>
        
        
      </Nav>
    </Navbar.Collapse>
  </Container>
</Navbar>


 );
}