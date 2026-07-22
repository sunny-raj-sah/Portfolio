import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FiArrowDownCircle } from "react-icons/fi";
import { profile } from "../data/portfolioData";

function useTypedRoles(roles) {
  const [text, setText] = useState("");
  const [roleIndex, setRoleIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[roleIndex % roles.length];
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      setText(current);
      return;
    }

    let timeout;
    if (!deleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), 55);
    } else if (!deleting && text.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1400);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), 30);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setRoleIndex((i) => i + 1);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, roleIndex, roles]);

  return text;
}

export default function Hero() {
  const typedRole = useTypedRoles(profile.roles);

  return (
    <section className="hero" id="top">
      <Container className="container-narrow">
        <Row className="align-items-center g-5">
          <Col lg={7}>
            <div
              className="section-hash mb-3"
              style={{ display: "inline-block" }}
            >
              commit {profile.commitHash}
            </div>
            <h1 className="hero-name">{profile.name}</h1>
            <p className="hero-tagline">{profile.tagline}</p>
            <div className="d-flex gap-3 mt-4 flex-wrap">
              <Button href="#projects" className="btn-mint" size="lg">
                View projects
              </Button>
              <Button
                href="#contact"
                variant="outline-light"
                className="btn-outline-mint"
                size="lg"
              >
                Get in touch
              </Button>
            </div>

             <a
              href={profile.resumeUrl}
              className="resume-link mt-3"
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              <FiArrowDownCircle aria-hidden="true" />
               Download resume
            </a>
          </Col>

          <Col lg={5}>
            <div className="terminal-window">
              <div className="terminal-bar">
                <span
                  className="terminal-dot"
                  style={{ background: "#ff5f56" }}
                />
                <span
                  className="terminal-dot"
                  style={{ background: "#ffbd2e" }}
                />
                <span
                  className="terminal-dot"
                  style={{ background: "#27c93f" }}
                />
              </div>
              <div className="terminal-body">
                <div>
                  <span className="terminal-prompt">$</span> whoami
                </div>
                <div>{profile.name}</div>
                <div className="mt-2">
                  <span className="terminal-prompt">$</span> role --current
                </div>
                <div>
                  <span className="typed-role">{typedRole}</span>
                  <span className="cursor-blink" aria-hidden="true" />
                </div>
                <div className="mt-2">
                  <span className="terminal-prompt">$</span> location
                </div>
                <div>{profile.location}</div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
