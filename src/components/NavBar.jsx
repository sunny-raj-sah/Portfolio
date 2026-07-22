import { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { profile } from "../data/portfolioData";

const links = [
  { href: "#about", label: "about" },
  { href: "#experience", label: "experience" },
  { href: "#skills", label: "skills" },
  { href: "#projects", label: "projects" },
  { href: "#education", label: "education" },
  { href: "#contact", label: "contact" },
];

export default function NavBar() {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // close mobile menu on route/hash change
    const close = () => setExpanded(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className="nav-glass"
      variant="dark"
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container className="container-narrow">
        <Navbar.Brand href="#top" className="brand-mono">
          {profile.name.split(" ")[0].toLowerCase()}<span>.dev</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            {links.map((l) => (
              <Nav.Link
                key={l.href}
                href={l.href}
                className="nav-link-custom"
                onClick={() => setExpanded(false)}
              >
                {l.label}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
