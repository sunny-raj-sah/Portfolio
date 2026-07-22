# Engineer Portfolio (React + react-bootstrap)

A fully working, modern portfolio site built with React, Vite, and react-bootstrap.
Dark "engineer's changelog" theme — git-log style section markers, terminal-style hero.

## Run it locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview   # preview the production build locally
```

## Where to put your real info

Everything is centralized in **`src/data/portfolioData.js`**. Edit that one file to replace:

- `profile` — name, roles, tagline, location, links
- `about` — summary + stat highlights
- `education` — schools, degrees, dates
- `experience` — jobs, bullet points
- `skills` — languages / systems / tools
- `projects` — your repos, tags, links
- `socials` — GitHub / LinkedIn / Twitter / email

You generally shouldn't need to touch the component files at all — just this data file.

## Structure

```
src/
  components/
    NavBar.jsx
    Hero.jsx
    About.jsx
    Experience.jsx
    Skills.jsx
    Projects.jsx
    Education.jsx
    Contact.jsx
    Footer.jsx
    SectionHead.jsx
  data/portfolioData.js   <- edit this for your real content
  useReveal.js            <- scroll-reveal animation hook
  index.css               <- design tokens + all styling
  App.jsx
  main.jsx
```

## Notes

- The contact form is client-side only — submitting it opens the visitor's email
  client pre-filled with their message (via `mailto:` or you can integrate with FORMSPREE api ). To actually receive
  submissions without the visitor needing an email client, wire it up to a
  service like Formspree, EmailJS, or your own backend endpoint inside
  `src/components/Contact.jsx`.
- Fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (labels/data) — loaded from Google Fonts in `index.html`.
- Fully responsive, keyboard-focus visible, and respects `prefers-reduced-motion`.
