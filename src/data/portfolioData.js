
// -----------------------------------------------------------------------------------------------


// ─────────────────────────────────────────────────────────────
// EDIT THIS FILE to replace the demo content with your own info.
// Every component reads from here — you shouldn't need to touch
// component code just to update your content.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Sunny Raj",
  roles: [
    "Backend Engineer",
    "Full Stack Engineer",
    "AI Engineer (Entry Level)",
  ],
  tagline:
    "I build scalable backend systems, AI-powered applications, and real-time web solutions using Node.js, React, MongoDB, and LangChain.",
  location: "Lakhisarai, Bihar, India (open to relocation)",
  email: "sunnyraj01000@gmail.com",
  github: "https://github.com/sunny-raj-sah",
  linkedin: "https://linkedin.com/in/sunny-raj",
  resumeUrl: "https://drive.google.com/file/d/1nvMb1oACJ_4nvnc09d2xJlXoB4FLVL70/view?usp=sharing",
  // resumeUrl:  "/Sunny_Raj__Resume.pdf",

  avatarInitials: "SR",
  commitHash: "sr2026a",
};

export const about = {
  summary:
    "I'm a Backend-focused Full Stack Engineer with expertise in Node.js, Express.js, MongoDB, React, and AI technologies like LangChain and Retrieval-Augmented Generation (RAG). I enjoy building secure REST APIs, real-time applications, and intelligent AI solutions while continuously improving my Data Structures, Algorithms, and System Design skills.",
  highlights: [
    { label: "Experience", value: "Intern + Projects" },
    { label: "Projects", value: "10+" },
    { label: "College", value: "GIET University" },
    { label: "Focus", value: "Backend & AI" },
  ],
};

export const education = [
  {
    school: "GIET University, Gunupur, Odisha",
    degree: "B.Tech in Computer Science & Engineering",
    period: "(2021 — 2025)",
    detail: "CGPA: 7.32 / 10",
    hash: "giet732",
  },
  {
    school: "Bihar Board of Open Schooling & Examination",
    degree: "Senior Secondary (PCM)",
    period: "(2019 — 2021)",
    detail: "Score: 70%",
    hash: "bbose70",
  },
  {
    school: "Central Board of Secondary Education (CBSE)",
    degree: "Secondary Education(CBSE)",
    period: "(2016)",
    detail: "CGPA: 8.2 / 10",
    hash: "cbse82",
  },
];

export const experience = [
  {
    company: "Dumroo.ai",
    role: "Software Development Intern",
    period: "Dec 2025 — Mar 2026",
    location: "Remote",
    points: [
      "Developed backend APIs and AI-powered application features using Node.js and modern JavaScript.",
      "Collaborated with the engineering team to build scalable web applications and improve application performance.",
      "Worked on production-ready features following clean architecture and best coding practices.",
    ],
    hash: "dum001",
  },
  {
    company: "Tech Mahindra COE",
    role: "Software Development Trainee",
    period: "Jan 2025 —  Apr 2025",
    location: "COE Center, GIET University",
    points: [
      "Completed hands-on training in Java, Spring Boot, React, and Flutter.",
      "Built full-stack projects and strengthened software engineering fundamentals.",
      "Practiced REST API development and modern frontend architecture.",
    ],
    hash: "tm002",
  },
  {
    company: "Edu-versity",
    role: "Web Development Intern",
    period: "Apr 2023 — Jun 2023",
    location: "Remote",
    points: [
      "Built responsive web applications using HTML, CSS, JavaScript, and React.",
      "Worked on frontend UI development and API integration.",
    ],
    hash: "edu003",
  },
];

// export const skills = {
//   languages: [
//     { name: "JavaScript", level: 92 },
//     { name: "Python", level: 78 },
//     { name: "C++", level: 85 },
//     { name: "HTML / CSS", level: 90 },
//     { name: "SQL", level: 82 },
//   ],

//   systems: [
//     { name: "Node.js & Express.js", level: 92 },
//     { name: "MongoDB", level: 88 },
//     { name: "REST APIs & JWT", level: 90 },
//     { name: "Socket.io & WebSockets", level: 86 },
//     { name: "LangChain & RAG", level: 84 },
//   ],

//   tools: [
//     "React",
//     "Git",
//     "GitHub",
//     "Postman",
//     "Bootstrap",
//     "Render",
//     "Railway",
//     "Leaflet.js",
//   ],
// };

 
export const skills = {
  languages: [
    "JavaScript",
    "Python",
    "C++",
    "HTML / CSS",
    "SQL",
  ],

  systems: [
    "Node.js & Express.js",
    "MongoDB",
    "REST APIs & JWT",
    "Socket.io & WebSockets",
    "LangChain & RAG",
  ],

  tools: [
    "React",
    "Git",
    "GitHub",
    "Postman",
    "Bootstrap",
    "Render",
    "Railway",
    "Leaflet.js",
  ],
};

export const projects = [
  {
    name: "PDF Grounded AI Document Q&A RAG System",
    hash: "rag001",
    description:
      "Built a Retrieval-Augmented Generation (RAG) application with LangChain, embeddings, vector databases, and LLM APIs for semantic document search and AI-powered question answering.",
    tags: [
    "React",
    "Node.js",
    "Express",
    "RAG",
    "Hugging Face",
    "Groq",
    "LLM",
    "Embeddings",
    ],
    stars: "Featured",
    link: "https://ai-powered-rag-system-for-grounded.vercel.app/",
    repo: "https://github.com/sunny-raj-sah/AI-powered-RAG-system-for-grounded-PDF-question-answering.git",
  },
   {
    name: "Real-Time Chat Application",
    hash: "chat004",
    description:
      "Built a real-time chat platform with public rooms, private 1:1 messaging, live typing indicators, and dynamic room creation with member invites, using React and Socket.io over WebSockets.",
    tags: [
      "React",
      "Node.js",
      "Express",
      "Socket.io",
      "Bootstrap",
    ],
    stars: "Featured",
    link: "https://realtime-chat-client-uzfk.onrender.com/",
    repo: "https://github.com/sunny-raj-sah/RealTime-Chat.git",
  },
  {
  name: "Workasana — Task Management Application",
  hash: "workasana001",
  description:
    "Built a full-stack task management application with React, Node.js, Express, and MongoDB, featuring task assignment, project and team management, authentication, dashboards, filtering, and productivity tracking.",
  tags: [
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "JWT",
    "Context API",
    "REST API",
    "Bootstrap",
  ],
  stars: "Featured",
  date: "Aug 2026 – Sept 2026",
  link: "https://workasana-task-management-applicati-phi.vercel.app/login",
  repo:
    "https://github.com/sunny-raj-sah/Workasana---Task-Management-Application.git",
},
{
  name: "Anvaya CRM — Lead Management System",
  hash: "anvaya001",
  description:
    "Developed a CRM application for managing leads and customer interactions with structured lead tracking, status management, search and filtering, and a responsive interface for streamlined sales workflows.",
  tags: [
    "React",
    "Node.js",
    "Express",
    "MongoDB",
    "REST API",
    
    "JavaScript",
    "CSS",
  ],
  stars: "Featured",
  date: "June 2026 – July 2026",
  link: "https://anvaya-crm-lead-management-system.vercel.app/",
  repo:
    "https://github.com/sunny-raj-sah/-Anvaya-CRM---Lead-Management-System.git",
},
  // {
  //   name: "Real-Time Device Tracker",
  //   hash: "gps004",
  //   description:
  //     "Created a live GPS tracking system with React, Socket.io, Leaflet.js, and Google Maps APIs for monitoring multiple devices in real time.",
  //   tags: [
  //     "React",
  //     "Node.js",
  //     "Socket.io",
  //     "Leaflet",
  //     "Google Maps",
  //   ],
  //   stars: "Featured",
  //   link: "#",
  //   repo: "https://github.com/sunny-raj-sah/Real-time-device-tracker.git",
  // },
  {
  name: "Trendora - Full Stack E-Commerce Platform",
  hash: "ecom001",
  description:
    "Built a full-stack e-commerce application with secure JWT authentication, product search, category filtering, shopping cart, wishlist management, and responsive UI using the MERN stack.",
  tags: [
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "JWT",
    "Bootstrap",
    "Context API"
  ],
  stars: "Featured",
  link: "https://mern-shopping-site-43xo.vercel.app/",
  repo: "https://github.com/sunny-raj-sah/MERN-Shopping-Site.git",
},
{
    name: "LangChain-AI Admin Query Assistant",
    hash: "ai002",
    description:
      "Developed an AI-powered admin dashboard enabling natural-language queries over educational datasets with RBAC and dynamic analytics.",
    tags: [
      "Python",
      "LangChain",
      "Streamlit",
      "OpenAI",
      "RBAC",
    ],
    stars: "Featured",
    link: "https://ai-powered-admin-panel.onrender.com/",
    repo: "https://github.com/sunny-raj-sah/LangChain-AI-Admin-Query-Assistant.git",
  },
];

export const socials = {
  github: "https://github.com/sunny-raj-sah",
  linkedin: "https://linkedin.com/in/sunny-raj-885588313",
  twitter: "#",
  email: "mailto:sunnyraj01000@gmail.com",
};