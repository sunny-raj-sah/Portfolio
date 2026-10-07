 
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import NavBar from "./components/NavBar";
import Hero from "./components/Hero";
import About from "./components/About";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

import CaseStudy from "./components/CaseStudy";

function Portfolio() {
  const location = useLocation();

 
  //   if (location.hash === "#projects") {
  //     const timer = setTimeout(() => {
  //       const projectsSection = document.getElementById("projects");

  //       if (projectsSection) {
  //         projectsSection.scrollIntoView({
  //           behavior: "smooth",
  //           block: "start",
  //         });
  //       }
  //     }, 100);

  //     return () => clearTimeout(timer);
  //   }
  // }, [location]);
 

 useEffect(() => {
  const projectId = location.state?.returnToProject;

  if (!projectId) return;

  let attempts = 0;
  const maxAttempts = 20;

  const findAndScroll = () => {
    const element = document.getElementById(projectId);

    if (element) {
      element.scrollIntoView({
        behavior: "instant",
        block: "center",
      });

      // Clear navigation state after returning
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );

      return;
    }

    attempts++;

    if (attempts < maxAttempts) {
      requestAnimationFrame(findAndScroll);
    }
  };

  requestAnimationFrame(findAndScroll);

}, [location.state]);

  return (
    <>
      <NavBar />
      <Hero />
      <About />
      <Experience />
      <Skills />
      <Projects />
      <Education />
      <Contact />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />

        <Route
          path="/case-study/:slug"
          element={<CaseStudy />}
        />
      </Routes>
    </BrowserRouter>
  );
}