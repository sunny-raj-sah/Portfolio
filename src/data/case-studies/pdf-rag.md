 # PDF Grounded AI Document Q&A RAG System

### Building a grounded question-answering system over a 637-page technical document

**Role:** Full Stack / AI Engineer
**Timeline:** June 2026 – July 2026
**Type:** AI-powered Full Stack Application

**Tech Stack:** React · Node.js · Express.js · LangChain · Hugging Face Embeddings · Groq · Retrieval-Augmented Generation

---

## 01 — Overview

Large language models are powerful at generating natural-language responses, but asking them questions about a specific technical document introduces a different problem: the model needs access to the relevant information before it can provide a reliable answer.

I built the **PDF Grounded AI Document Q&A System** to explore this problem by combining a full-stack web application with a Retrieval-Augmented Generation (RAG) pipeline.

The system allows a user to ask questions about a large PDF document and generates answers using information retrieved from the document rather than relying only on the model's general knowledge.

The project uses a **637-page technical PDF** as the knowledge source and processes the document into smaller chunks that can be embedded and searched semantically.

---

# 02 — The Problem

A straightforward approach to document question answering would be to send the entire document to an LLM with every user question.

That approach creates several problems:

* Large documents can exceed model context limits.
* Sending the entire document repeatedly is inefficient.
* The model may focus on irrelevant portions of the document.
* Responses can become less grounded in the source material.
* Processing and searching a large document becomes difficult as document size increases.

The core question I wanted to solve was:

> **How can a user ask natural-language questions about a large document while retrieving only the information relevant to that question?**

This led to the use of **Retrieval-Augmented Generation**.

---

# 03 — What I Built

The application combines a React frontend, Node.js/Express backend, and RAG pipeline.

At a high level:

```text
                User
                 │
                 ▼
          React Frontend
                 │
                 │ Question
                 ▼
          Node.js / Express
                 │
                 ▼
        Query Processing
                 │
                 ▼
       Semantic Retrieval
                 │
                 ▼
       Relevant PDF Chunks
                 │
                 ▼
              LLM
                 │
                 ▼
         Grounded Answer
                 │
                 ▼
          React Frontend
```

The important part of the system is that the LLM is not expected to independently "know" the document.

Instead, the application first retrieves relevant content and then provides that content as context for answer generation.

---

# 04 — RAG Architecture

The document processing and question-answering flow can be divided into two major stages.

### Stage 1 — Document Ingestion

```text
PDF Document
     │
     ▼
Text Extraction
     │
     ▼
Text Chunking
     │
     ▼
Embeddings
     │
     ▼
Vector Representation
     │
     ▼
Vector Storage
```

The 637-page document is broken into smaller chunks.

Each chunk is converted into a numerical representation using an embedding model.

These embeddings allow the system to compare the semantic meaning of a user's question with the content of the document.

---

### Stage 2 — Question Answering

```text
User Question
      │
      ▼
Question Embedding
      │
      ▼
Similarity Search
      │
      ▼
Relevant Chunks
      │
      ▼
Context Construction
      │
      ▼
LLM
      │
      ▼
Generated Answer
```

When a user submits a question, the question is converted into an embedding.

The system searches for document chunks that are semantically related to the question.

The retrieved information is then passed to the language model as context for generating the final response.

---

# 05 — Why RAG?

The key reason for using RAG was **grounding**.

Instead of asking:

```text
Question → LLM → Answer
```

the application follows:

```text
Question
   ↓
Retrieve relevant information
   ↓
Provide retrieved information as context
   ↓
Generate answer
```

This separates two responsibilities:

**Retrieval**

Find the information that is relevant to the question.

**Generation**

Use that information to produce a natural-language answer.

This architecture also makes the system easier to extend because retrieval and generation can be improved independently.

---

# 06 — Document Chunking

One of the important design decisions in a RAG system is how the source document is divided.

A complete PDF is too large to treat as one retrieval unit.

Instead, the document is divided into smaller chunks.

Conceptually:

```text
637-page PDF
      │
      ▼
 Text extraction
      │
      ▼
 ┌───────────────┐
 │ Chunk 1       │
 │ Chunk 2       │
 │ Chunk 3       │
 │ ...           │
 │ Chunk 1618+   │
 └───────────────┘
```

The project processed the document into **1,600+ chunks**.

The purpose of chunking is to create retrieval units that are small enough to search effectively while retaining enough surrounding context to make the retrieved information useful.

Chunk size and overlap are therefore important parameters that can directly affect retrieval quality.

---

# 07 — Embeddings and Semantic Retrieval

Keyword search is not always sufficient for natural-language questions.

For example, a user may ask:

> "What happens when an object is thrown vertically upward?"

while the document may describe the concept using different terminology.

Semantic embeddings allow the system to compare the meaning of the question with the meaning of document chunks.

The basic flow is:

```text
Document Chunk
      │
      ▼
Embedding Model
      │
      ▼
Vector

User Question
      │
      ▼
Embedding Model
      │
      ▼
Query Vector
      │
      ▼
Similarity Search
      │
      ▼
Relevant Document Chunks
```

For this project, Hugging Face embeddings were used as part of the retrieval pipeline.

---

# 08 — LLM Response Generation

After retrieving relevant document chunks, the system constructs the context used for answer generation.

Conceptually:

```text
User Question
      +
Retrieved Context
      │
      ▼
     LLM
      │
      ▼
Natural Language Answer
```

The generation layer was implemented using an LLM API through Groq.

During development, model availability changed over time, so the project also involved adapting the application to supported model versions.

The currently working generation model used during development was:

**`openai/gpt-oss-120b`**

This also highlighted an important practical aspect of AI application development: model providers and model availability can change, so model configuration should remain externalized rather than hardcoded throughout the application.

---

# 09 — Full Stack Architecture

The project was intentionally built as a full-stack application rather than as a standalone AI script.

```text
┌─────────────────────────────┐
│        React Frontend       │
│                             │
│  Question Input             │
│  Loading / Error States     │
│  Answer Display             │
└──────────────┬──────────────┘
               │
               │ HTTP Request
               ▼
┌─────────────────────────────┐
│      Node.js / Express      │
│                             │
│  Routes                     │
│  Controllers                │
│  Middleware                 │
│  Services                   │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        RAG Pipeline         │
│                             │
│  Document Processing        │
│  Chunking                   │
│  Embeddings                 │
│  Retrieval                  │
│  Context Construction       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│        LLM Provider         │
│           Groq              │
└──────────────┬──────────────┘
               │
               ▼
          Generated Answer
```

The separation between frontend, backend, and services also makes the application easier to maintain than placing the entire RAG workflow inside a single application file.

---

# 10 — Backend Design

The backend follows a separation between different application responsibilities.

```text
backend/
└── src/
    ├── controllers/
    ├── middlewares/
    ├── routes/
    └── services/
```

### Controllers

Responsible for handling incoming requests and returning responses.

### Routes

Define the application's API endpoints and connect requests to their corresponding controllers.

### Middleware

Provides request-level processing that can be applied before controller execution.

### Services

Contain the core application and RAG-related processing logic.

This separation keeps HTTP handling and core business/AI logic from becoming tightly coupled.

---

# 11 — Frontend

The frontend was built with React.

Its responsibilities include:

* Providing the question input interface.
* Sending questions to the backend.
* Handling loading states.
* Displaying generated answers.
* Handling API errors.
* Providing a simple interface for interacting with the RAG system.

The frontend communicates with the backend through API requests rather than directly implementing the complete RAG pipeline.

This keeps provider-specific logic on the server side.

---

# 12 — Security Considerations

One of the important lessons from building the application was that AI provider credentials should not be treated as frontend configuration.

API credentials should be stored using environment variables and handled by the backend.

The intended architecture is:

```text
React
  │
  │ Question
  ▼
Backend
  │
  │ Server-side API credentials
  ▼
AI Provider
```

rather than:

```text
React
  │
  │ Exposed API Key
  ▼
AI Provider
```

The project also needs continued hardening around uploaded PDF validation, request validation, rate limiting, and production-safe document handling.

These are areas I consider part of the next stage of the project rather than claiming them as completed functionality.

---

# 13 — Challenges

## Challenge 1 — Processing a Large Document

A 637-page document is significantly different from a small text file.

Processing the complete document as one context would be inefficient and difficult to scale.

### Solution

The document was divided into smaller chunks and converted into embeddings so that relevant sections could be retrieved independently.

---

## Challenge 2 — Retrieving Relevant Context

Retrieval quality directly affects the quality of the final answer.

If the wrong chunks are retrieved, even a capable LLM can produce an answer that does not properly address the user's question.

### Solution

The application uses semantic embeddings to retrieve content based on meaning rather than relying only on exact keyword matching.

---

## Challenge 3 — Model Availability

During development, several previously used or tested LLM models became unavailable or deprecated.

This required adapting the application to a currently supported model.

### Solution

The generation model was moved toward configurable provider/model settings instead of treating a specific model as a permanent assumption.

---

## Challenge 4 — Grounded Responses

A language model can generate plausible information even when the retrieved context does not sufficiently support the answer.

This makes retrieval and context construction just as important as the LLM itself.

### Solution

The application follows a retrieval-first workflow where relevant document content is supplied to the generation layer before producing the answer.

A future improvement is to add explicit source/page citations and automated groundedness evaluation.

---

# 14 — Validation and Evaluation

A major next step for the project is turning qualitative testing into measurable evaluation.

The evaluation should cover at least three areas:

### Retrieval Quality

Measure whether the correct document chunks are being retrieved for known questions.

Possible metrics:

* Recall@K
* Precision@K
* Hit Rate@K

### Answer Quality

Evaluate whether generated answers are:

* Grounded in retrieved context.
* Relevant to the question.
* Complete enough to be useful.

### System Performance

Measure:

* Retrieval latency.
* LLM response latency.
* End-to-end response time.
* Failure rate.

I intentionally do not claim numerical results here until these tests are actually executed.

---

# 15 — Deployment

The application uses separate frontend and backend deployments.

```text
User
 │
 ▼
React Application
 │
 │ API Request
 ▼
Node.js / Express Backend
 │
 ├── RAG Processing
 ├── Embeddings
 └── LLM API
```

The frontend is deployed separately from the backend, allowing each layer to be developed and deployed independently.

Environment-specific configuration is handled through environment variables rather than hardcoding provider configuration into the source code.

---

# 16 — Engineering Decisions

### Why React?

The project requires an interactive interface for submitting questions and displaying asynchronous AI responses.

React provides a component-based approach for managing this interaction.

### Why Node.js and Express?

The backend needs to expose APIs and coordinate document processing, retrieval, and LLM interaction.

Node.js provides a natural fit for the API layer while keeping the project within a JavaScript/TypeScript-oriented full-stack ecosystem.

### Why embeddings?

Embeddings enable semantic similarity search, allowing the system to retrieve conceptually relevant content even when the wording differs.

### Why RAG?

RAG provides a way to combine document-specific information retrieval with the language-generation capabilities of an LLM.

### Why separate services?

Separating routes, controllers, middleware, and services keeps the backend easier to maintain and allows the RAG pipeline to evolve independently from HTTP request handling.

---

# 17 — What I Learned

This project changed how I think about AI applications.

The main lesson was that building an AI application is not simply about connecting an LLM API to a frontend.

A useful AI system requires several engineering layers:

```text
Data
 ↓
Processing
 ↓
Retrieval
 ↓
Context
 ↓
Generation
 ↓
Evaluation
 ↓
Application
```

I also learned that retrieval quality can be as important as model quality in a RAG system.

A stronger model cannot completely compensate for poor context retrieval.

From the full-stack side, the project reinforced the importance of separating frontend interaction, backend APIs, and AI processing into clear responsibilities.

---

# 18 — Current Limitations

The current implementation can be further improved in several areas:

* Explicit source and page citations.
* Automated RAG evaluation.
* Persistent vector storage.
* Multi-document knowledge bases.
* Document-specific vector indexes.
* Conversation history.
* Streaming LLM responses.
* File validation and safer upload handling.
* API rate limiting.
* Authentication and user-specific document isolation.
* Retrieval reranking.
* Hybrid keyword + semantic search.

These improvements would move the project from a functional RAG demonstration toward a more production-oriented document intelligence system.

---

# 19 — Future Architecture

The longer-term architecture I would move toward is:

```text
                    User
                      │
                      ▼
                React Frontend
                      │
                      ▼
                API Gateway
                      │
             ┌────────┴────────┐
             ▼                 ▼
        Authentication      Rate Limit
             │
             ▼
        Document Service
             │
             ▼
      Document Processing
             │
       ┌─────┴─────┐
       ▼           ▼
    Chunking    Metadata
       │
       ▼
    Embeddings
       │
       ▼
   Vector Database
       │
       ▼
  Retrieval + Reranking
       │
       ▼
   Context Builder
       │
       ▼
       LLM
       │
       ▼
 Grounded Response
       │
       ▼
 Source Citations
```

This architecture would support multiple users, multiple documents, better retrieval quality, stronger security boundaries, and more measurable AI evaluation.

---

# 20 — Project Takeaway

The project started as an experiment in asking questions over a large PDF.

It evolved into a deeper exploration of how **retrieval, embeddings, LLMs, backend APIs, and frontend applications work together to build an AI-powered product**.

The most important engineering principle I took from the project is:

> **An effective AI application is not just an LLM. It is a complete system around the LLM.**

That includes reliable data processing, relevant retrieval, controlled context, secure APIs, application architecture, evaluation, and a usable interface.

---

## Links

**Live Demo:**
https://ai-powered-rag-system-for-grounded.vercel.app/

**GitHub:**
https://github.com/sunny-raj-sah/AI-powered-RAG-system-for-grounded-PDF-question-answering.git

**Technical Blog:**
*To be added after the Hashnode article is published.*

---

## Technologies

`React` `Node.js` `Express.js` `LangChain` `RAG` `Hugging Face` `Embeddings` `Groq` `LLM` `JavaScript`

````
 