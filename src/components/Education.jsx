import { Container } from "react-bootstrap";
import SectionHead from "./SectionHead";
import { education } from "../data/portfolioData";
import { useReveal } from "../useReveal";

export default function Education() {
  const ref = useReveal();

  return (
    <section className="section section-alt" id="education">
      <Container className="container-narrow reveal" ref={ref}>
        <SectionHead hash="b91e04a" title="// education" />
        <div className="timeline">
          {education.map((ed) => (
            <div className="timeline-item" key={ed.hash}>
              <span className="timeline-dot" />
              <div className="timeline-hash">{ed.hash}</div>
              <div className="timeline-role">{ed.school}</div>
              <div>
                <span className="timeline-company">{ed.degree}</span>
                {" · "}
                <span className="timeline-period">{ed.period}</span>
              </div>
              <p className="mt-2" style={{ color: "#c3c8d3" }}>
                {ed.detail}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
