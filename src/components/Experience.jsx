import { Container } from "react-bootstrap";
import SectionHead from "./SectionHead";
import { experience } from "../data/portfolioData";
import { useReveal } from "../useReveal";

export default function Experience() {
  const ref = useReveal();

  return (
    <section className="section" id="experience">
      <Container className="container-narrow reveal" ref={ref}>
        <SectionHead
          hash="9a1f5c3"
          title="// experience"
          subtitle="$ git log --author=me --oneline"
        />
        <div className="timeline">
          {experience.map((job) => (
            <div className="timeline-item" key={job.hash}>
              <span className="timeline-dot" />
              <div className="timeline-hash">{job.hash}</div>
              <div className="timeline-role">{job.role}</div>
              <div>
                <span className="timeline-company">{job.company}</span>
                {" · "}
                <span className="timeline-period">
                  {job.period} · {job.location}
                </span>
              </div>
              <ul className="timeline-points">
                {job.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
