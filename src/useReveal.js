// import { useEffect, useRef } from "react";

// // Adds a "visible" class to an element when it scrolls into view.
// // Respects prefers-reduced-motion by just showing content immediately.
// export function useReveal() {
//   const ref = useRef(null);

//   useEffect(() => {
//     const node = ref.current;
//     if (!node) return;

//     const prefersReduced = window.matchMedia(
//       "(prefers-reduced-motion: reduce)"
//     ).matches;

//     if (prefersReduced) {
//       node.classList.add("visible");
//       return;
//     }

//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           node.classList.add("visible");
//           observer.unobserve(node);
//         }
//       },
//       { threshold: 0.15 }
//     );

//     observer.observe(node);
//     return () => observer.disconnect();
//   }, []);

//   return ref;
// }
// -----------------------------------------------------------
// 2
 import { useEffect, useRef } from "react";

// Adds a "visible" class when the element enters the viewport.
// Handles a separate animation when returning from a case study.
export function useReveal() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const isReturningToProject =
      window.location.hash.startsWith("#project-");

    // Reduced motion: show immediately.
    if (prefersReduced) {
      node.classList.add("visible");
      return;
    }

    // Returning from a case study.
    if (isReturningToProject) {
      node.classList.add("visible");
      node.classList.add("project-return");

      const timer = setTimeout(() => {
        node.classList.remove("project-return");
      }, 900);

      return () => clearTimeout(timer);
    }

    // Normal reveal behavior.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("visible");
          observer.unobserve(node);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return ref;
}