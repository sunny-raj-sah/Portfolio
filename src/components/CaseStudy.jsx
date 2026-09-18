 import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import pdfRagContent from "../data/case-studies/pdf-rag.md?raw";

const caseStudies = {
  "pdf-rag": pdfRagContent,
};

export default function CaseStudy() {
  const { slug } = useParams();

  const content = caseStudies[slug];

  if (!content) {
    return (
      <main className="case-study-page">
        <div className="container-narrow">
          <div className="case-study-not-found">
            <h1>Case Study Not Found</h1>

            <p>
              The case study <strong>"{slug}"</strong> could not be found.
            </p>

            <Link to="/#projects" className="case-study-back">
              ← Back to Portfolio
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="case-study-page">
      <div className="container-narrow">

        {/* Back button */}
<div className="case-study-topbar">
  <a href="/#projects" className="case-study-back">
    ← Back to Portfolio
  </a>
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

              li: ({ children }) => (
                <li>{children}</li>
              ),

              blockquote: ({ children }) => (
                <blockquote className="case-study-quote">
                  {children}
                </blockquote>
              ),

              code: ({ inline, children }) => {
                if (inline) {
                  return (
                    <code className="case-study-inline-code">
                      {children}
                    </code>
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
                  <table className="case-study-table">
                    {children}
                  </table>
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

              hr: () => (
                <hr className="case-study-divider" />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </article>
 {/* Back button */}
<div className="case-study-topbar">
  <a href="/#projects" className="case-study-back">
    ← Back to Portfolio
  </a>
</div>
      </div>
    </main>
  );
}