 # Anvaya CRM
## Full-Stack Lead Management System

Anvaya CRM is a full-stack Customer Relationship Management application for organizing sales leads, assigning sales agents, tracking pipeline progress, recording discussions, and viewing sales reports.

It brings lead-management workflows into one workspace, with a React frontend, an Express REST API, and MongoDB persistence.

[**View Live Application**](https://anvaya-crm-lead-management-system.vercel.app/) · [**View GitHub Repository**](https://github.com/sunny-raj-sah/Anvaya-CRM.git)

---

## Project at a glance

| | |
|---|---|
| **Project type** | Full-stack CRM application |
| **Frontend** | React, React Router, Context API, **useReducer**, Axios |
| **Backend** | Node.js, Express.js, REST APIs |
| **Database** | MongoDB, Mongoose |
| **Authentication** | JWT, bcrypt |
| **Reporting** | MongoDB Aggregation, Chart.js, react-chartjs-2 |
| **Deployment** | Frontend hosted on Vercel; backend maintained as a separate Express application |

---

## 01. The problem

Sales teams need a reliable way to keep track of potential customers as they move through the sales process. When lead details, ownership, priority, and follow-up discussions are scattered, it becomes harder to understand the current pipeline and monitor progress.

Anvaya CRM addresses this by providing a centralized place to:

- Create and maintain lead records.
- Assign leads to sales agents.
- Track each lead's status and priority.
- Search and filter leads using multiple criteria.
- Record comments against individual leads.
- Review pipeline and sales-agent reports.

## 02. The solution

The application brings these activities into a single CRM workflow:

```text
Create a lead
     ↓
Assign a sales agent
     ↓
Set source and priority
     ↓
Track the lead through the sales pipeline
     ↓
Add comments and follow-up context
     ↓
Update the lead status
     ↓
Review reports and pipeline statistics
```

The sales pipeline supports five statuses: **New**, **Contacted**, **Qualified**, **Proposal Sent**, and **Closed**. Reports summarize lead distribution and closed leads by sales agent.

## 03. Core features

### Lead management

- Create, view, update, and delete leads.
- Store lead details such as name, source, assigned sales agent, status, priority, and closing information.
- Associate a lead with a sales agent using a MongoDB ObjectId reference.
- Retrieve related sales-agent details using Mongoose **populate()**.

### Search and filtering

Users can narrow down lead records by:

- Status
- Priority
- Source
- Sales agent
- Search term

The frontend represents filter selections in URL query parameters. For example:

```text
/leads?status=Qualified&priority=High
```

This keeps the filter state in the URL, supporting refresh persistence, browser navigation, and shareable filtered views.

### Sales-agent management

The application maintains sales-agent records containing information such as name, email, and phone number. Leads reference their assigned agent, allowing the application to display related agent information with the lead.

### Lead comments

Users can add discussion comments to a lead. Each comment records its lead, author information, comment text, and timestamps. New comments are associated with the authenticated application user and returned with author information.

### Reports and data visualization

The reporting area provides:

- Lead counts grouped by pipeline status.
- Recently closed leads from the last seven days.
- Closed-lead counts grouped by sales agent.

MongoDB aggregation performs the relevant grouping and counting. The frontend uses Chart.js through **react-chartjs-2** to visualize report data.

---

## 04. Application architecture

The application separates the React client, Express API, and MongoDB database.

```text
┌──────────────────────────────────┐
│          React Frontend          │
│                                  │
│  Pages and Components            │
│  React Router                    │
│  Context API and Reducers        │
│  Axios API Requests              │
└─────────────────┬────────────────┘
                  │
                  │ HTTP / REST API
                  ▼
┌──────────────────────────────────┐
│          Express Backend         │
│                                  │
│  Routes                          │
│  Authentication Middleware       │
│  Controllers                     │
│  Services                        │
│  Mongoose Models                 │
└─────────────────┬────────────────┘
                  │
                  │ Mongoose
                  ▼
┌──────────────────────────────────┐
│             MongoDB              │
│                                  │
│  Users · Leads · Agents           │
│  Comments                        │
└──────────────────────────────────┘
```

### Backend request flow

The backend follows a layered structure:

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Mongoose Model
  ↓
MongoDB
```

Routes define the API endpoints, middleware handles concerns such as authentication, controllers handle HTTP request and response flow, and services contain the corresponding application and data operations.

Keeping these responsibilities separate makes the backend easier to understand and maintain than placing database operations directly inside route handlers.

## 05. Authentication and protected access

Anvaya CRM uses JWT-based authentication and bcrypt password hashing.

The authentication API includes:

| Method | Endpoint | Purpose |
|---|---|---|
| **POST** | **/api/auth/register** | Register a user |
| **POST** | **/api/auth/login** | Authenticate a user |
| **GET** | **/api/auth/me** | Retrieve the current user |

During registration, passwords are hashed with bcrypt before being stored. During login, **bcrypt.compare()** verifies the submitted password against the stored hash. On successful login, the backend generates a JWT.

The frontend stores the token in **localStorage** and sends it with protected API requests using the Bearer authorization header:

```http
Authorization: Bearer <token>
```

Backend authentication middleware verifies the token and makes the authenticated user available to downstream handlers. The React application also uses a **ProtectedRoute** to restrict access to protected pages.

**Current authorization scope:** The user model includes **admin** and **user** role values, but the current route architecture primarily enforces JWT authentication. Full role-based authorization is not implemented and should be treated as a future improvement.

## 06. Frontend state management

The React application uses Context API to share state across related parts of the application. Separate contexts are maintained for:

- Authentication
- Agents
- Leads
- Comments
- Reports

Reducers handle state transitions for the relevant domains, including agent, comment, lead, and report state.

This keeps related state-management logic organized and avoids passing shared data through many layers of component props.

## 07. Reporting with MongoDB aggregation

Reporting calculations are handled in the backend rather than fetching all lead records and calculating every statistic in the React interface.

The reporting endpoints include:

| Endpoint | Report |
|---|---|
| **GET /api/report/pipeline** | Lead counts grouped by status |
| **GET /api/report/last-week** | Leads closed within the last seven days |
| **GET /api/report/closed-by-agent** | Closed-lead counts grouped by sales agent |

For example, the pipeline report groups lead documents by status and counts the documents in each group. The closed-by-agent report matches closed leads, groups them by assigned sales agent, counts them, and looks up the corresponding agent information.

The resulting API data is passed through the report context to the reporting page and displayed using Chart.js.

## 08. Engineering challenges and decisions

### Keeping backend responsibilities separated

**Challenge:** Lead management, authentication, comments, and reporting each involve different request and data-handling responsibilities.

**Approach:** I used separate routes, controllers, services, and models. This keeps HTTP handling separate from the application and database operations.

### Supporting combined lead filters

**Challenge:** Users need to filter leads using several criteria without requiring a separate API endpoint for every filter combination.

**Approach:** The **GET /api/leads** endpoint accepts optional query parameters such as **status**, **priority**, **source**, **salesAgent**, and **search**. The backend builds a MongoDB query from the filters provided by the user.

### Searching across lead and agent information

**Challenge:** A user may search for a lead using the assigned sales agent's name, even though that name belongs to a separate collection.

**Approach:** The backend first searches the Agent collection for matching names, obtains the matching agent IDs, and includes those IDs in the lead query. The final query combines the relevant search conditions using MongoDB's **$or** operator.

### Producing reports efficiently

**Challenge:** Pipeline and agent-level reports require grouped counts rather than ordinary lead CRUD operations.

**Approach:** I used MongoDB aggregation to group and count the relevant lead documents. This keeps report calculations in the data layer and returns report-oriented results to the frontend.

### Maintaining shared frontend state

**Challenge:** Multiple pages need access to shared lead, agent, comment, authentication, and report data.

**Approach:** I organized state by domain using React Context and reducers, keeping related state transitions in dedicated reducer logic.

---

## 09. Data relationships

The main data relationships connect users, comments, leads, and sales agents.

```text
User
  │
  │ authorUser
  ▼
Comment ───────────────► Lead
                          │
                          │ salesAgent
                          ▼
                        Agent
```

A lead stores a reference to its assigned sales agent. Comments are associated with a lead and the authenticated user who authored them. Mongoose **populate()** is used where related sales-agent or comment-author information needs to be returned with the primary record.

## 10. Security and current limitations

The current implementation includes:

- JWT-based authentication.
- bcrypt password hashing.
- Protected backend API routes.
- Protected frontend routes.
- Bearer-token authorization.
- An environment-based JWT secret.
- Password exclusion from current-user responses.

There are also areas that need further hardening. The JWT is currently stored in **localStorage**, and the application does not yet include refresh-token rotation, full RBAC enforcement, or resource-level authorization rules.

The current backend package does not contain a dedicated automated test suite. Pagination, a centralized error-handling middleware, broader request validation, caching, and activity logging are also potential improvements.

These are documented as limitations rather than features claimed as complete.

## 11. Future improvements

Potential next steps for the project include:

- Implement full role-based and resource-level authorization.
- Add pagination for lead listings.
- Add suitable MongoDB indexes for frequently queried fields.
- Improve search with debounced requests and optimized database search.
- Introduce refresh-token handling and stronger session security.
- Add centralized request validation and error handling.
- Create unit, API, and integration tests.
- Add caching for frequently requested report data.
- Introduce activity history and lead audit logs.
- Add real-time lead updates and notifications.
- Support report exports and additional analytics.

## 12. What I learned

Building Anvaya CRM helped me connect frontend state management, backend API design, authentication, database relationships, and reporting in one full-stack application.

The most valuable practical areas were:

- Designing REST APIs with Express.
- Separating routes, controllers, services, and models.
- Implementing JWT authentication and bcrypt password hashing.
- Protecting frontend routes and backend resources.
- Modeling MongoDB relationships with ObjectId references.
- Using Mongoose **populate()** to retrieve related records.
- Building dynamic MongoDB queries for combined filters.
- Using aggregation pipelines for reporting.
- Managing shared React state with Context API and **useReducer**.
- Synchronizing filter state with URL query parameters.
- Presenting backend report data with Chart.js.

---

## Project links
 **Live Application:**  
[anvaya-crm-lead-management-system.vercel.app](https://anvaya-crm-lead-management-system.vercel.app/)

**GitHub Repository:**  
[github.com/sunny-raj-sah/Anvaya-CRM](https://github.com/sunny-raj-sah/Anvaya-CRM.git)
## Author

**Sunny Raj**  
Full Stack Developer

> **while (!understood) { tryAgain(); }**
