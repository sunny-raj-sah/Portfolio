// import NavBar from "./components/NavBar";
// import Hero from "./components/Hero";
// import About from "./components/About";
// import Experience from "./components/Experience";
// import Skills from "./components/Skills";
// import Projects from "./components/Projects";
// import Education from "./components/Education";
// import Contact from "./components/Contact";
// import Footer from "./components/Footer";

// export default function App() {
//   return (
//     <>
//       <NavBar />
//       <Hero />
//       <About />
//       <Experience />
//       <Skills />
//       <Projects />
//       <Education />
//       <Contact />
//       <Footer />
//     </>
//   );
// }
// -------------------------------------------------------------------------------------------
// ----------------------------------------------------------------

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
  if (location.hash !== "#projects") return;

  const timer = setTimeout(() => {
    const projectsSection = document.getElementById("projects");

    if (!projectsSection) return;

    // First move to the projects section instantly
    projectsSection.scrollIntoView({
      behavior: "instant",
      block: "start",
    });

    // Add animation class
    projectsSection.classList.remove("projects-return-animation");

    // Force browser to restart animation
    void projectsSection.offsetWidth;

    projectsSection.classList.add("projects-return-animation");

    // Remove class after animation finishes
    const removeAnimation = setTimeout(() => {
      projectsSection.classList.remove("projects-return-animation");
    }, 900);

    return () => clearTimeout(removeAnimation);
  }, 150);

  return () => clearTimeout(timer);
}, [location]);


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