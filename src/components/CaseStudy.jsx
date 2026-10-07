import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import pdfRag from "../data/case-studies/pdf-rag.md?raw";
import workasana from "../data/case-studies/workasana.md?raw";
import anvayaCrm from "../data/case-studies/anvaya-crm.md?raw";
import trendoraEcommerce from "../data/case-studies/trendora-ecommerce.md?raw";
import realTimeChat from "../data/case-studies/real-time-chat.md?raw";
import langchainAiAdmin from "../data/case-studies/langchain-ai-admin.md?raw";
import kaviospix from "../data/case-studies/kaviospix.md?raw";

const caseStudies = {
  "pdf-rag": pdfRag,
  "workasana": workasana,
  "anvaya-crm": anvayaCrm,
  "trendora-ecommerce": trendoraEcommerce,
  "real-time-chat": realTimeChat,
  "langchain-ai-admin": langchainAiAdmin,
  "kaviospix": kaviospix,
};

const projectAnchors = {
  "pdf-rag": "project-pdf-rag",
  "workasana": "project-workasana",
  "anvaya-crm": "project-anvaya-crm",
  "trendora-ecommerce": "project-trendora-ecommerce",
  "real-time-chat": "project-real-time-chat",
  "langchain-ai-admin": "project-langchain-ai-admin",
  "kaviospix": "project-kaviospix",
};

export default function CaseStudy() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const content = caseStudies[slug];
  const projectAnchor = projectAnchors[slug];

  if (!content) {
    return (
      <main className="case-study-page">
        <div className="container-narrow">
          <div className="case-study-not-found">
            <h1>Case Study Not Found</h1>

            <p>
              The case study <strong>"{slug}"</strong> could not be found.
            </p>

            {/* back button */}
            <div className="case-study-topbar">
              <button
                type="button"
                className="btn btn-sm  case-study-back"
                onClick={() =>
                  navigate("/", {
                    state: {
                      returnToProject: projectAnchor,
                    },
                  })
                }
              >
                ← Back to Portfolio
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="case-study-page">
      <div className="container-narrow">
        {/* Back button */}
        {/* <div className="case-study-topbar"> */}
        {/* <a href={`/#${projectAnchor}`}  className="case-study-back">
            ← Back to Portfolio
          </a> */}
        {/* <button
            type="button"
            className="case-study-back"
            onClick={() =>
              navigate("/", {
                state: {
                  returnToProject: projectAnchor,
                },
              })
            }
          >
            ← Back to Portfolio
          </button> */}
        {/* </div> */}
        <div className="case-study-topbar">
          <button
            type="button"
            className="btn btn-sm  case-study-back"
            onClick={() =>
              navigate("/", {
                state: {
                  returnToProject: projectAnchor,
                },
              })
            }
          >
            ← Back to Portfolio
          </button>
        </div>
        {/* Markdown content */}
        <article className="case-study-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="case-study-title">{children}</h1>
              ),

              h2: ({ children }) => (
                <h2 className="case-study-heading">{children}</h2>
              ),

              h3: ({ children }) => (
                <h3 className="case-study-subheading">{children}</h3>
              ),

              p: ({ children }) => (
                <p className="case-study-paragraph">{children}</p>
              ),

              ul: ({ children }) => (
                <ul className="case-study-list">{children}</ul>
              ),

              ol: ({ children }) => (
                <ol className="case-study-list">{children}</ol>
              ),

              li: ({ children }) => <li>{children}</li>,

              blockquote: ({ children }) => (
                <blockquote className="case-study-quote">{children}</blockquote>
              ),

              code: ({ inline, children }) => {
                if (inline) {
                  return (
                    <code className="case-study-inline-code">{children}</code>
                  );
                }

                return (
                  <pre className="case-study-code">
                    <code>{children}</code>
                  </pre>
                );
              },

              table: ({ children }) => (
                <div className="case-study-table-wrapper">
                  <table className="case-study-table">{children}</table>
                </div>
              ),

              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="case-study-link"
                >
                  {children}
                </a>
              ),

              hr: () => <hr className="case-study-divider" />,
            }}
          >
            {content}
          </ReactMarkdown>
        </article>

        {/* Back button */}

        <div className="case-study-topbar">
          <button
            type="button"
            className="btn btn-sm  case-study-back"
            onClick={() =>
              navigate("/", {
                state: {
                  returnToProject: projectAnchor,
                },
              })
            }
          >
            ← Back to Portfolio
          </button>
        </div>
      </div>
    </main>
  );
}
