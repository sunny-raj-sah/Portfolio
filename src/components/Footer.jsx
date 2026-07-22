import { Container } from "react-bootstrap";
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from "react-icons/fi";
import { socials, profile } from "../data/portfolioData";

export default function Footer() {
  return (
    <footer className="footer">
      <Container>
        <div className="mb-3">
          <a href={socials.github} className="social-icon" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
            <FiGithub />
          </a>
          <a href={socials.linkedin} className="social-icon" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <FiLinkedin />
          </a>
          {/* <a href={socials.twitter} className="social-icon" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
            <FiTwitter />
          </a> */}
          <a href={socials.email} className="social-icon" aria-label="Email">
            <FiMail />
          </a>
        </div>
        <p className="footer-text">
          {"// built by "}
          {profile.name} · {new Date().getFullYear()}
        </p>
      </Container>
    </footer>
  );
}
