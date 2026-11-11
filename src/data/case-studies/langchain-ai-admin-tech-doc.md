 # GradeLens AI
## AI-Powered Education Management & Learning Analytics Platform

**A full-stack education management platform combining academic workflows, role-based access control, performance analytics, and AI-assisted educational insights.**

**Project Type:** Full-Stack Application | AI Engineering | EdTech  
**Role:** Full-Stack Developer & AI Engineer  
**Architecture:** Client–Server Architecture  
**Development Focus:** TypeScript, React, Node.js, PostgreSQL, Prisma ORM, and LLM Integration

---

## 1. Executive Summary

Educational institutions manage large amounts of academic information across students, classrooms, teachers, homework, submissions, and assessments.

When these operations are handled through disconnected systems, administrators and teachers often spend significant time managing records, tracking academic progress, and identifying students who need additional support.

**GradeLens AI** addresses this challenge through an integrated education management platform that centralizes academic workflows and provides AI-assisted access to educational information.

The platform supports three primary user roles:

- **Admin:** Manages teachers, classrooms, student-related operations, and institutional information.
- **Teacher:** Works with assigned classrooms, manages academic activities, and monitors student performance.
- **Student:** Accesses classroom-related learning activities and academic information.

An integrated AI assistant allows users to interact with educational information through natural-language questions, with access determined by their application role and classroom context.

Rather than building a standalone chatbot, the objective was to integrate AI into an actual education management workflow.

## 2. The Problem

Educational management involves several interconnected responsibilities.

### Fragmented academic operations

Student records, classroom information, homework, submissions, and quiz results need to be managed consistently.

### Limited visibility into student performance

Teachers and administrators need a convenient way to understand academic progress and identify students who may require additional attention.

### Repetitive information retrieval

Finding specific information often requires navigating multiple screens, filtering records, and manually interpreting data.

### Access-control requirements

Different users should have different levels of access.

For example:
- An administrator needs an institution-wide view.
- A teacher should work within their assigned academic context.
- A student should not be able to access another student's private information.

### The opportunity

Build a centralized platform that combines academic management, structured data access, analytics, and contextual AI assistance.

## 3. Project Objectives

The project was designed around the following objectives:

1. Build a centralized academic management platform.
2. Implement authentication and role-based authorization.
3. Support classroom and student management workflows.
4. Provide homework and submission management.
5. Organize quiz results and academic performance information.
6. Provide analytics to support student performance evaluation.
7. Integrate an AI assistant into the existing application.
8. Ensure AI responses respect user roles and relevant classroom access.
9. Build a maintainable backend using TypeScript and modular architecture.
10. Deploy the application as an accessible web platform.

## 4. Solution Overview

GradeLens AI brings academic operations and AI-assisted insights into one application.

### Core application modules

| Module | Purpose |
|---|---|
| Authentication | Secure user login and registration |
| Role Management | Different experiences for Admin, Teacher, and Student |
| Classroom Management | Organize and manage academic classrooms |
| Student Management | Maintain student records and classroom relationships |
| Teacher Management | Administrative teacher management |
| Homework | Create and manage academic assignments |
| Submissions | Track student homework submissions |
| Quiz Results | Organize assessment performance |
| Analytics | Understand student performance and support requirements |
| AI Assistant | Ask contextual questions about educational information |

The platform is designed around the relationship between users, classrooms, academic activities, and student performance.

## 5. User Roles and Access Architecture

One of the important engineering requirements was ensuring that users receive information appropriate to their role.

### Admin

Administrators have broader institutional responsibilities.

Their workflows include:
- Managing teachers.
- Accessing classroom information.
- Managing student-related information.
- Reviewing academic operations.
- Accessing institution-wide information through the AI assistant.

### Teacher

Teachers work within their assigned academic context.

Their workflows include:
- Accessing relevant classrooms.
- Working with student information.
- Managing homework and submissions.
- Reviewing quiz results.
- Understanding student performance.
- Asking classroom-related questions through AI.

### Student

Students interact with the learning side of the platform.

Their workflows include:
- Accessing relevant academic information.
- Viewing homework and learning activities.
- Accessing their academic information.
- Using AI assistance for general educational questions and assigned-classroom context where applicable.

### Authorization principle

Authentication and authorization are separate responsibilities.

Authentication establishes who the user is.

Authorization establishes what the authenticated user is allowed to access.

GradeLens AI uses role-aware backend logic to enforce these distinctions.

## 6. Core Features

### 6.1 Authentication and Role-Based Access

The application provides authentication for different categories of users.

After authentication, the application uses the user's role to determine the appropriate application experience and available operations.

**Engineering concepts:**
- JWT-based authentication.
- Protected backend routes.
- Middleware-based authorization.
- Role-based access control.
- Authenticated API communication.

### 6.2 Classroom Management

Classrooms are a central part of the application data model.

They provide the academic context connecting students, teachers, and classroom activities.

The classroom module supports:
- Retrieving classroom information.
- Organizing classroom records.
- Connecting students with their academic environment.
- Providing classroom context for AI-assisted queries.

### 6.3 Student Management

Student information is organized within the educational structure.

The platform supports student-related operations and relationships with classrooms.

This allows other modules to use consistent academic context instead of maintaining disconnected student information.

### 6.4 Teacher Management

The administrative interface includes teacher management functionality.

Administrators can manage teacher records and use teacher assignments as part of the academic organization.

### 6.5 Homework and Submission Management

Homework management connects academic tasks with student participation.

The platform separates homework information from student submission information, allowing academic activities and their completion status to be managed independently.

This creates a foundation for monitoring submission activity and identifying incomplete work.

### 6.6 Quiz Results and Performance Tracking

Quiz results provide structured information about student assessment performance.

These records form part of the analytics and AI information layer.

The purpose is to make academic performance information easier to retrieve and interpret.

### 6.7 Student Performance Analytics

The analytics module helps interpret academic performance and identify students who may need additional support.

The project includes a support-classification threshold:

`SUPPORT_THRESHOLD = 60`

This threshold is used in the relevant analytics classification logic.

It provides a configurable starting point for distinguishing students who may require additional academic support.

It should be understood as an application rule, not a validated educational diagnosis.

### 6.8 AI-Powered Educational Assistant

The AI assistant is a central feature of GradeLens AI.

Instead of requiring users to manually navigate different academic modules, the assistant provides a natural-language interface for asking questions.

Examples of potential questions include:

**Administrator**
- Show me the available classrooms.
- Summarize academic activity across classrooms.
- Which students may need additional academic support?

**Teacher**
- Summarize the performance of students in my selected classroom.
- Which students have incomplete homework submissions?
- Explain the quiz performance of my classroom.

**Student**
- Help me understand my academic performance.
- Explain a concept I am studying.
- Answer questions using my assigned classroom context, when available.

The exact information returned depends on the role, available data, and implemented query capabilities.

### Role-aware AI architecture

The AI assistant uses a shared backend entry point rather than requiring separate frontend AI routes for each role.

The backend determines the appropriate context based on the authenticated user.

The intended processing flow is:

1. Receive an authenticated AI request.
2. Identify the user's role.
3. Determine the relevant classroom or academic context.
4. Retrieve the permitted educational information.
5. Prepare the context for AI processing.
6. Generate a response through the LLM integration.
7. Return the response to the frontend.

**Important engineering decision:** AI access should be controlled by backend authorization and data retrieval logic, not merely by hiding frontend options.

### 6.9 Contextual Classroom Selection

For administrative and teacher AI workflows, classroom selection provides context for the questions being asked.

The classroom selector includes debounced search to avoid unnecessary requests while the user is typing.

The AI experience also accommodates student access:

- Students can use AI for general educational questions.
- When an assigned classroom is available, it can provide relevant academic context.

This avoids forcing every user through the same classroom-selection workflow.

### 6.10 Floating AI Chat Interface

The AI assistant is integrated into the existing application through a floating chat experience.

The implementation uses local browser storage to retain chat state under the key:

`gradelens-floating-ai-chat`

This provides a more accessible interaction model without requiring users to navigate to a separate AI page.

---

## 7. System Architecture

GradeLens AI follows a client–server architecture with separate frontend and backend responsibilities.

### High-level architecture

```text
                  USER
                    |
                    v
           React Frontend (Vite)
                    |
                    v
             API Communication
                    |
                    v
        Node.js + Express Backend
                    |
          +---------+----------+
          |                    |
          v                    v
    Authentication       Business Logic
    & Authorization      & Services
          |                    |
          +---------+----------+
                    |
                    v
             Prisma ORM
                    |
                    v
              PostgreSQL
                    |
          +---------+----------+
          |                    |
          v                    v
    Academic Data         AI Assistant
                               |
                               v
                         AI Service Layer
                               |
                               v
                          Groq LLM API
                               |
                               v
                         AI Response
```

### Frontend responsibilities

The React frontend handles:
- User interaction.
- Role-specific application experiences.
- Form handling and validation.
- API communication.
- Classroom selection.
- Academic dashboards.
- Analytics presentation.
- AI chat interaction.

### Backend responsibilities

The Express backend handles:
- API routing.
- Authentication.
- Authorization.
- Request validation.
- Business logic.
- Database operations.
- AI request orchestration.
- Error handling.

### Database responsibilities

PostgreSQL stores the structured application information.

Prisma ORM provides the database access and schema-management layer.

### AI responsibilities

The AI service handles the application-side orchestration of educational queries, relevant context, and LLM communication.

---

## 8. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Build Tool | Vite |
| Language | TypeScript / JavaScript |
| UI Framework | Bootstrap |
| Backend | Node.js |
| API Framework | Express.js |
| Backend Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Database Hosting | Neon |
| AI Provider | Groq |
| AI Integration | LLM API integration |
| Authentication | JWT |
| Deployment | Vercel |
| Version Control | Git and GitHub |

The architecture separates presentation, business logic, database access, and AI orchestration to support maintainability and future development.

## 9. Database Design and Data Relationships

PostgreSQL was selected to manage structured educational data and relationships.

The platform's data model is centered around academic entities and their associations.

### Conceptual data relationships

```text
                 USER
                   |
          +--------+--------+
          |                 |
        ADMIN             TEACHER
                            |
                            v
                         CLASSROOM
                            |
                            v
                          STUDENT
                            |
             +--------------+-------------+
             |              |             |
             v              v             v
          HOMEWORK       SUBMISSION    QUIZ RESULT
             |
             v
       Academic Activity
```

This is a conceptual overview rather than a complete Prisma entity-relationship diagram.

The database schema is managed through Prisma migrations.

One example of a schema evolution in the project was the addition of the student–proctor assignment relationship:

`20261028062250_add_student_proctor_assignment`

This reflects the need to represent additional educational relationships as the application evolves.

## 10. AI Integration: Engineering Approach

The AI assistant was designed as an application feature rather than an independent chatbot.

The important engineering challenge is not simply generating an answer. It is retrieving the right information for the correct user before generating that answer.

### AI request lifecycle

```text
User Message
     |
     v
Authenticated API Request
     |
     v
Identify User and Role
     |
     v
Determine Query Context
     |
     v
Retrieve Relevant Data
     |
     v
Prepare AI Context
     |
     v
Groq LLM Integration
     |
     v
Generate Response
     |
     v
Return Response to UI
```

### Why this approach?

An unrestricted AI assistant could potentially expose information outside a user's intended academic context.

Therefore, the backend must establish the relevant access boundaries before using academic information in an AI request.

This principle is especially important when the application serves multiple roles with different responsibilities.

### AI service design

The AI functionality is organized in a dedicated backend service:

`backend/src/services/ai-assistant.service.ts`

This keeps AI-specific orchestration separate from frontend presentation and general API routing.

The service is designed to work with the existing classroom retrieval functionality rather than introducing unnecessary duplicate data-access logic.

---

## 11. Important Engineering Decisions

### Decision 1: TypeScript-based full-stack architecture

The project uses TypeScript in the frontend and backend development stack.

**Why?**

- Better development-time type checking.
- More explicit interfaces and data contracts.
- Improved maintainability.
- Easier understanding of service inputs and outputs.

### Decision 2: PostgreSQL instead of JSON-based persistence

A relational database provides a more suitable foundation for an application containing connected academic entities.

**Why?**

- Structured relationships.
- Referential integrity.
- Relational queries.
- Database migrations.
- A foundation for future scalability.

### Decision 3: Prisma ORM

Prisma provides a structured way to interact with PostgreSQL.

It also makes schema evolution and database migrations easier to manage.

### Decision 4: Shared AI API entry point

Rather than creating separate AI routes for every role, the project uses a shared AI endpoint with role-aware backend processing.

**Why?**

- Less duplicated routing logic.
- Centralized AI orchestration.
- Easier maintenance.
- Consistent authorization boundaries.

### Decision 5: Backend-controlled AI context

The backend determines which educational information is relevant to the current user.

This is more reliable than treating frontend-selected classroom information as sufficient authorization.

### Decision 6: Floating AI interface

The assistant is accessible within the existing application.

This reduces navigation friction and makes AI assistance part of the regular academic workflow.

### Decision 7: Debounced classroom search

Search requests are delayed until the user pauses typing.

This reduces unnecessary API requests and improves the search interaction.

---

## 12. Challenges and How They Were Approached

### Challenge 1: Designing role-aware application workflows

**Problem:** Administrators, teachers, and students have different responsibilities.

**Approach:** Introduce role-based application behavior and backend authorization rather than relying on a single shared user experience.

**Learning:** Role-based access control needs to be reflected across both API and UI architecture.

### Challenge 2: Integrating AI into an existing application

**Problem:** A generic chatbot cannot automatically understand the application's academic structure.

**Approach:** Build a dedicated AI service and integrate classroom retrieval into the existing AI request workflow.

**Learning:** Context retrieval and application authorization are as important as LLM integration.

### Challenge 3: Handling classroom context

**Problem:** AI questions from administrators, teachers, and students do not necessarily refer to the same academic scope.

**Approach:** Use role-aware classroom context, including classroom selection for staff and assigned-classroom context for students where applicable.

**Learning:** AI context should be determined by application rules rather than assumed from user input.

### Challenge 4: Evolving the database schema

**Problem:** New requirements introduce additional relationships between academic entities.

**Approach:** Use Prisma migrations to evolve the relational data model.

**Learning:** Database design is an ongoing engineering responsibility, not a one-time task.

### Challenge 5: Keeping the AI experience inside the application

**Problem:** A separate AI page would create unnecessary navigation and disconnect AI from academic workflows.

**Approach:** Integrate a floating AI interface into the existing application.

**Learning:** Good AI product design should consider the user's workflow, not only the underlying model.

### Challenge 6: Efficient classroom search

**Problem:** Triggering an API request for every keystroke can create unnecessary traffic.

**Approach:** Implement debounced search in the classroom-selection experience.

**Learning:** Small frontend decisions can improve both perceived performance and backend efficiency.

---

## 13. Security Considerations

GradeLens AI handles educational information, making authorization an important architectural concern.

The following principles guide its implementation:

- Authenticate users before allowing protected operations.
- Enforce role permissions in backend routes and services.
- Avoid relying on frontend visibility as an authorization mechanism.
- Validate incoming request data.
- Keep database credentials and AI API keys in environment variables.
- Retrieve AI context according to the authenticated user's permissions.
- Avoid exposing sensitive academic records through unrestricted AI prompts.

**Security principle:**

An authenticated user should only be able to retrieve information that their role and assigned academic context permit.

A production deployment should additionally undergo security testing, including authorization-boundary tests, rate limiting, audit logging, and validation of AI-generated data access.

---

## 14. Testing and Validation Strategy

A reliable academic platform needs validation across different layers.

The following checklist describes the important verification areas for the project.

### Authentication
- [ ] Valid login.
- [ ] Invalid credentials.
- [ ] Missing or expired JWT.
- [ ] Protected route access.
- [ ] Logout behavior.

### Role-Based Authorization
- [ ] Admin-specific operations.
- [ ] Teacher-specific operations.
- [ ] Student-specific operations.
- [ ] Unauthorized cross-role requests.
- [ ] Classroom access boundaries.

### Academic Workflows
- [ ] Classroom retrieval.
- [ ] Student management.
- [ ] Teacher management.
- [ ] Homework creation and retrieval.
- [ ] Submission handling.
- [ ] Quiz result retrieval.

### Analytics
- [ ] Student performance calculations.
- [ ] Support classification logic.
- [ ] Empty data handling.
- [ ] Invalid or missing academic information.

### AI Assistant
- [ ] Admin classroom queries.
- [ ] Teacher classroom queries.
- [ ] Student general questions.
- [ ] Student assigned-classroom context.
- [ ] Unauthorized information requests.
- [ ] Empty AI requests.
- [ ] LLM provider failures.
- [ ] Classroom search behavior.

### Deployment
- [ ] Frontend production build.
- [ ] Backend production build.
- [ ] Environment variable configuration.
- [ ] Database connectivity.
- [ ] Frontend-to-backend communication.
- [ ] CORS configuration.

These are validation criteria, not a claim that every test has already passed. The final review should record the actual result of each test.

---

## 15. Current Limitations and Areas for Improvement

A strong engineering project should also recognize what remains to be improved.

Potential areas for further development include:

1. **Automated testing:** Expand unit, integration, and end-to-end coverage.
2. **Audit logging:** Maintain a history of sensitive administrative operations.
3. **AI evaluation:** Test response correctness, grounding, and consistency.
4. **AI observability:** Track latency, failures, and token usage.
5. **Rate limiting:** Protect sensitive API and AI endpoints from abuse.
6. **Scalable analytics:** Optimize performance as academic datasets grow.
7. **Advanced reporting:** Add downloadable academic reports and visual summaries.
8. **Monitoring:** Introduce structured application logs and deployment monitoring.
9. **AI safety:** Improve handling of ambiguous requests and unauthorized data queries.
10. **Performance optimization:** Review database indexes, query efficiency, and caching opportunities.

These improvements provide a roadmap for evolving the platform toward production-grade educational software.

---

## 16. Future Roadmap

### Phase 1 — Platform Reliability
- Expand automated testing.
- Strengthen validation.
- Improve error handling.
- Review authorization boundaries.

### Phase 2 — Advanced Analytics
- Classroom-level performance trends.
- Historical performance comparisons.
- Academic progress reports.
- Improved student support insights.

### Phase 3 — AI Intelligence
- More grounded educational responses.
- Improved contextual retrieval.
- Better AI evaluation.
- More detailed classroom insights.
- AI-assisted academic recommendations.

### Phase 4 — Scalability
- Performance optimization.
- Monitoring and observability.
- Background processing where needed.
- Improved data access patterns.

---

## 17. What I Learned Building GradeLens AI

GradeLens AI strengthened my understanding of building complete software systems rather than isolated features.

### Full-Stack Engineering
- Structuring a React application.
- Building REST APIs with Node.js and Express.
- Organizing backend services.
- Handling frontend and backend integration.
- Managing application state and forms.

### Backend Engineering
- Authentication and JWT.
- Role-based authorization.
- API design.
- Request validation.
- Service-layer architecture.
- Error handling.

### Database Engineering
- Relational database design.
- PostgreSQL.
- Prisma ORM.
- Schema migrations.
- Entity relationships.
- Data retrieval.

### AI Engineering
- LLM API integration.
- AI service orchestration.
- Context-aware AI workflows.
- Role-aware data retrieval.
- Natural-language interaction with structured information.

### Deployment and Development
- Environment configuration.
- Git and GitHub workflows.
- Production deployment.
- Frontend/backend connectivity.
- Debugging deployment and integration issues.

Most importantly, I learned that adding AI to a product is not just about connecting an LLM API. It requires thoughtful data retrieval, authorization, context management, and integration with the application's existing architecture.

---

## 18. Project Impact and Engineering Value

GradeLens AI brings several related academic workflows into one application.

Its engineering value comes from combining:

- A centralized education management system.
- Role-based application access.
- Structured academic data.
- Student performance analytics.
- AI-assisted natural-language interaction.
- A modular TypeScript backend.
- Relational database architecture.

The project demonstrates how conventional full-stack engineering and AI capabilities can work together to solve a domain-specific problem.

**The key idea is to make educational information easier to manage, understand, and access while respecting application-level permissions.**

---

## 19. Conclusion

GradeLens AI represents an effort to build a complete, AI-enabled educational management platform.

The project goes beyond a basic CRUD application by combining multiple academic workflows, relational data management, role-based authorization, performance analytics, and AI-assisted interaction.

The most important engineering lesson was understanding that a useful AI-powered product requires more than a model integration.

It requires a well-designed application architecture, reliable backend services, structured data, appropriate access boundaries, and an interface that fits the user's workflow.

**GradeLens AI is a practical demonstration of my growth in full-stack software development and applied AI engineering.**

---

## 20. Project Resources

- **Live Application:** [https://grade-lens-ai-six.vercel.app/]
- **GitHub Repository:** [https://github.com/sunny-raj-sah/GradeLens-AI.git]
- **Product Walkthrough:** [https://drive.google.com/file/d/1yQ1OGfDZWrqAw0yItCoePeJQoX586k38/view?usp=sharing]
 

**Built with React, TypeScript, Node.js, Express, PostgreSQL, Prisma, and Groq.**