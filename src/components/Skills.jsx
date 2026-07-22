import { Container, Row, Col, ProgressBar } from "react-bootstrap";
import SectionHead from "./SectionHead";
import { skills } from "../data/portfolioData";
import { useReveal } from "../useReveal";

function SkillGroup({ title, items }) {
  return (
    <div className="mb-4">
      <h6
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          fontSize: "0.78rem",
          letterSpacing: "0.06em",
        }}
      >
        {title}
      </h6>
      {items.map((s) => (
        <div key={s.name}>
          <div className="skill-name">
            <span>{s.name}</span>
            <span>{s.level}%</span>
          </div>
          <ProgressBar now={s.level} className="progress-custom" />
        </div>
      ))}
    </div>
  );
}

export default function Skills() {
  const ref = useReveal();

  return (
    <section className="section" id="skills">
      <Container className="container-narrow reveal" ref={ref}>
        <SectionHead hash="4d8e2f0" title="// skills" />
        <Row className="g-5">
          <Col md={6}>
            <SkillGroup title="Languages" items={skills.languages} />
          </Col>
          <Col md={6}>
            <SkillGroup title="Systems & Infra" items={skills.systems} />
          </Col>
        </Row>
        <div className="mt-2">
          <h6
            style={{
              fontFamily: "var(--font-mono)",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              fontSize: "0.78rem",
              letterSpacing: "0.06em",
            }}
          >
            Tools
          </h6>
          {skills.tools.map((t) => (
            <span className="tool-badge" key={t}>
              {t}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
