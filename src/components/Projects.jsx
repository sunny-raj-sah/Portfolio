import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FiStar, FiGithub, FiExternalLink } from "react-icons/fi";
import SectionHead from "./SectionHead";
import { projects } from "../data/portfolioData";
import { useReveal } from "../useReveal";

export default function Projects() {
  const ref = useReveal();

  return (
    <section className="section section-alt" id="projects">
      <Container className="container-narrow reveal" ref={ref}>
        <SectionHead
          hash="c7b3a91"
          title="// projects"
          subtitle="$ ls ~/projects --starred"
        />
        <Row className="g-4">
          {projects.map((p) => (
            <Col md={6} key={p.hash}>
              <Card className="project-card">
                <Card.Body className="d-flex flex-column h-100">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="project-hash">{p.hash}</span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.8rem",
                        color: "var(--amber)",
                      }}
                    >
                      <FiStar style={{ marginBottom: 2 }} /> {p.stars}
                    </span>
                  </div>
                  <div className="project-name mb-2">{p.name}</div>
                  <p className="project-desc flex-grow-1">{p.description}</p>
                  <div className="mb-3">
                    {p.tags.map((t) => (
                      <span className="tag-badge" key={t}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      href={p.repo}
                      size="sm"
                      className="btn-mint"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FiGithub style={{ marginBottom: 2 }} /> Code
                    </Button>
                    <Button
                      href={p.link}
                      size="sm"
                      variant="outline-light"
                      className="btn-outline-mint"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FiExternalLink style={{ marginBottom: 2 }} /> Live
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
