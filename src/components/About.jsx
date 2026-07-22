import { Container, Row, Col } from "react-bootstrap";
import SectionHead from "./SectionHead";
import { about } from "../data/portfolioData";
import { useReveal } from "../useReveal";

export default function About() {
  const ref = useReveal();

  return (
    <section className="section section-alt" id="about">
      <Container className="container-narrow reveal" ref={ref}>
        <SectionHead hash="a1c00de" title="// about" />
        <Row className="g-5 align-items-start">
          <Col lg={7}>
            <p style={{ fontSize: "1.1rem", lineHeight: 1.8, color: "#c3c8d3" }}>
              {about.summary}
            </p>
          </Col>
          <Col lg={5}>
            <Row className="g-3">
              {about.highlights.map((h) => (
                <Col xs={6} key={h.label}>
                  <div className="stat-card">
                    <div className="stat-value">{h.value}</div>
                    <div className="stat-label">{h.label}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
