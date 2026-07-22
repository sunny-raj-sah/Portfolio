import { useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import SectionHead from "./SectionHead";
import { profile } from "../data/portfolioData";
import { useReveal } from "../useReveal";
const FORMSPREE_URL = import.meta.env.VITE_FORMSPREE_URL;


export default function Contact() {
  const ref = useReveal();
  const [validated, setValidated] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    const el = e.currentTarget;
    e.preventDefault();

    if (el.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
      try {
    const response = await fetch(FORMSPREE_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        message: form.message,
        _subject: "New Message from Portfolio Contact Form",
      }),
    });

    if (response.ok) {
      setSent(true);
      setValidated(false);
      setForm({
        name: "",
        email: "",
        message: "",
      });
    } else {
      alert("Failed to send message.");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong.");
  }

    // Demo behavior: no backend is wired up yet, so we open the visitor's
    // email client pre-filled with the message. Swap this for a real
    // endpoint (e.g. Formspree, EmailJS, or your own API) when you're ready.
    // const subject = encodeURIComponent(`Portfolio contact from ${form.name}`);
    // const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    // window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;

    setSent(true);
    setValidated(false);
    setForm({ name: "", email: "", message: "" });
  };


 
  return (
    <section className="section" id="contact">
      <Container className="container-narrow reveal" ref={ref}>
        <SectionHead
          hash="ff00a11"
          title="// contact"
          subtitle="$ curl -X POST /contact"
        />
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="contact-card">
              {sent && (
                <Alert
                  variant="dark"
                  style={{
                    background: "rgba(92,225,198,0.1)",
                    border: "1px solid var(--mint-dim)",
                    color: "var(--mint)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.9rem",
                  }}
                  onClose={() => setSent(false)}
                  dismissible
                >
                  Your message has been sent successfully. I'll get back to you soon.
                </Alert>
              )}
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group controlId="contactName">
                      <Form.Label
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.85rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        Name
                      </Form.Label>
                      <Form.Control
                        required
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="form-control-dark"
                        placeholder="Jane Doe"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter your name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="contactEmail">
                      <Form.Label
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.85rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        Email
                      </Form.Label>
                      <Form.Control
                        required
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="form-control-dark"
                        placeholder="jane@example.com"
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid email.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Form.Group controlId="contactMessage">
                      <Form.Label
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.85rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        Message
                      </Form.Label>
                      <Form.Control
                        required
                        as="textarea"
                        rows={5}
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        className="form-control-dark"
                        placeholder="Let's talk about..."
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a message.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={12}>
                    <Button type="submit" className="btn-mint" size="lg">
                      Send message
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
