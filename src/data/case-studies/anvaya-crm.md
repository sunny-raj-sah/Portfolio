# Anvaya CRM — Lead Management System

## 1. Project Overview

Anvaya CRM is a full-stack Customer Relationship Management application designed around sales-lead management.

The application allows users to manage leads, sales agents, lead discussions, filtering, and business reports through a React frontend backed by an Express REST API and MongoDB.

The project was built to strengthen practical understanding of:

* Full-stack architecture
* JWT authentication
* REST APIs
* MongoDB relationships
* Service-layer architecture
* React Context
* `useReducer`
* URL-based filtering
* MongoDB aggregation
* Data visualization

---

# 2. Problem Statement

Sales teams need a structured way to track potential customers from their initial contact through the closing stage.

Without a centralized system, lead information can become difficult to organize:

* Which leads are new?
* Which leads have been contacted?
* Which leads are qualified?
* Which sales agent owns a lead?
* Which leads have high priority?
* Which leads have recently been closed?
* How many leads are currently in each pipeline stage?

Anvaya CRM addresses these workflows through a centralized lead-management application.

---

# 3. Solution

The application provides a CRM workspace where authenticated users can:

```text
Create Lead
    ↓
Assign Sales Agent
    ↓
Set Priority
    ↓
Track Status
    ↓
Add Comments
    ↓
Move Through Pipeline
    ↓
Close Lead
```

Reports then transform the stored lead data into pipeline and sales-agent statistics.

---

# 4. High-Level Architecture

```text
┌─────────────────────────────┐
│        React Frontend       │
│                             │
│ Pages / Components          │
│ Context / Reducers          │
│ React Router                │
└──────────────┬──────────────┘
               │
               │ Axios
               │ REST API
               ▼
┌─────────────────────────────┐
│       Express Backend       │
│                             │
│ Routes                      │
│ JWT Middleware              │
│ Controllers                 │
│ Services                    │
└──────────────┬──────────────┘
               │
               │ Mongoose
               ▼
┌─────────────────────────────┐
│          MongoDB            │
│                             │
│ Users / Leads / Agents      │
│ Comments                    │
└─────────────────────────────┘
```

---

# 5. Backend Architecture

The backend follows:

```text
Routes
   ↓
Middleware
   ↓
Controllers
   ↓
Services
   ↓
Models
   ↓
MongoDB
```

This was an important architectural choice.

Instead of putting database operations directly inside routes, the application separates responsibilities.

For example:

```text
leadRoutes.js
      ↓
leadController.js
      ↓
leadService.js
      ↓
Lead.js
      ↓
MongoDB
```

---

# 6. Authentication

Anvaya CRM implements JWT-based authentication.

The main authentication endpoints are:

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

The login process is:

```text
User
 │
 ▼
Login Form
 │
 ▼
POST /api/auth/login
 │
 ▼
authController
 │
 ▼
authService
 │
 ▼
Find User
 │
 ▼
bcrypt.compare()
 │
 ▼
Generate JWT
 │
 ▼
Return User + Token
 │
 ▼
localStorage
```

---

# 7. Password Hashing

Registration uses bcrypt:

```text
Password
   │
   ▼
bcrypt.hash(password, 10)
   │
   ▼
Password Hash
   │
   ▼
MongoDB
```

Login then verifies:

```text
Entered Password
      │
      ▼
bcrypt.compare()
      │
      ▼
Stored Hash
```

This avoids storing plain-text passwords.

---

# 8. JWT Strategy

The generated JWT contains:

```js
{
  userId
}
```

The token currently expires after:

```text
1 day
```

The client stores the token in:

```text
localStorage
```

and sends it as:

```http
Authorization: Bearer <token>
```

---

# 9. Protected Backend Routes

CRM resources are protected by `authMiddleware`.

```text
Request
   │
   ▼
Authorization Header
   │
   ▼
JWT Verification
   │
   ├── Invalid → 401
   │
   └── Valid
         │
         ▼
       req.user
         │
         ▼
      Controller
```

Protected resources include:

* Agents
* Leads
* Comments
* Reports

---

# 10. Protected Frontend Routes

The React application uses a `ProtectedRoute`.

Public:

```text
/login
/register
```

Protected:

```text
/
/leads
/leads/new
/leads/:id
/leads/edit/:id
/leads/status
/agents
/agents/new
/reports
/agent/status
/settings
```

The application therefore protects both:

```text
Frontend Navigation
        +
Backend API Access
```

---

# 11. Authentication State

Authentication is managed through `AuthContext`.

It stores:

```text
user
token
loading
error
```

and exposes:

```text
login()
register()
logout()
getCurrentUser()
```

When the application loads, it checks for a stored JWT.

If one exists:

```text
localStorage
     │
     ▼
Stored JWT
     │
     ▼
GET /api/auth/me
     │
     ▼
Current User
```

If the request fails, the token is removed.

---

# 12. Lead Model

The central data model is `Lead`.

```text
Lead
├── name
├── source
├── salesAgent
├── status
├── priority
├── timeToClose
├── tags[]
├── closedAt
├── createdAt
└── updatedAt
```

The `salesAgent` field is a MongoDB reference:

```text
salesAgent → Agent
```

---

# 13. Sales Pipeline

The CRM defines five lead states:

```text
New
 ↓
Contacted
 ↓
Qualified
 ↓
Proposal Sent
 ↓
Closed
```

This provides a simple representation of the sales lifecycle.

The current status is stored directly on each Lead document.

---

# 14. Lead Sources

The system supports several lead sources:

```text
Website
Referral
Cold Call
LinkedIn
Facebook
Instagram
Email Campaign
Trade Show
```

This information can later be used for source-level analytics.

---

# 15. Lead Priority

Each lead has one of:

```text
High
Medium
Low
```

The priority is stored in MongoDB and can be used as a filter from the lead-management UI.

---

# 16. Sales Agent Relationship

Agents have:

```text
name
email
phone
```

A lead stores the assigned agent's ObjectId.

```text
             ┌────────────┐
             │   Agent    │
             └─────▲──────┘
                   │
                   │ ObjectId
                   │
             ┌─────┴──────┐
             │    Lead    │
             └────────────┘
```

The backend uses:

```js
.populate("salesAgent")
```

to return the associated sales-agent information.

---

# 17. Lead CRUD

The lead lifecycle supports:

```text
Create
Read
Update
Delete
```

Endpoints:

```text
POST   /api/leads
GET    /api/leads
GET    /api/leads/:id
PUT    /api/leads/:id
DELETE /api/leads/:id
```

The service layer contains the corresponding database operations.

---

# 18. Search and Filtering

The lead-management page supports filtering through:

```text
status
priority
source
salesAgent
search
```

Example:

```text
/leads?status=Qualified&priority=High
```

The frontend converts filter state into URL parameters and API requests.

---

# 19. Search Implementation

The backend search is more than a simple lead-name search.

When the user searches:

```text
"Sunny"
```

the backend first searches the Agent collection for matching names.

```text
Search
  │
  ├── Lead fields
  │
  └── Agent names
         │
         ▼
     Agent IDs
```

The resulting IDs are included in the lead query.

The final MongoDB query uses `$or` to search across:

```text
name
source
status
priority
salesAgent
```

This allows the UI to find leads through both lead information and assigned-agent names.

---

# 20. URL-Synchronized Filters

One useful frontend design decision was storing filter state in the URL.

Example:

```text
/leads?status=Qualified&priority=High
```

This means the filtering state is represented by the route itself.

Benefits include:

* Refresh persistence
* Browser back/forward support
* Shareable filtered URLs
* Easier debugging
* Clear representation of UI state

---

# 21. Comment System

Each lead can contain discussion comments.

```text
Lead
 │
 ├── Comment
 ├── Comment
 └── Comment
```

A comment contains:

```text
lead
author
authorUser
commentText
createdAt
updatedAt
```

The current implementation associates new comments with the authenticated application user.

---

# 22. Comment Lifecycle

The comment flow is:

```text
Lead Details
     │
     ▼
Comment Form
     │
     ▼
POST /api/leads/:leadId/comments
     │
     ▼
Authenticated User
     │
     ▼
Create Comment
     │
     ▼
Populate Author Information
     │
     ▼
Return Comment
```

Comments are sorted newest first.

---

# 23. Reports Architecture

The reporting system has its own route/controller/service layers.

```text
Reports Page
      │
      ▼
ReportContext
      │
      ▼
Report API
      │
      ▼
Report Controller
      │
      ▼
Report Service
      │
      ▼
MongoDB
```

This keeps reporting calculations separate from normal lead CRUD operations.

---

# 24. Pipeline Report

Endpoint:

```text
GET /api/report/pipeline
```

The report uses MongoDB aggregation.

Conceptually:

```text
Lead Collection
      │
      ▼
Group by status
      │
      ▼
Count documents
      │
      ▼
Pipeline statistics
```

Example result:

```json
[
  {
    "status": "New",
    "count": 10
  },
  {
    "status": "Qualified",
    "count": 5
  }
]
```

---

# 25. Recently Closed Leads

Endpoint:

```text
GET /api/report/last-week
```

The backend calculates the date seven days before the current time.

It then retrieves leads where:

```text
status = Closed
```

and:

```text
updatedAt >= last seven days
```

The sales agent is populated for each result.

---

# 26. Closed Leads by Agent

Endpoint:

```text
GET /api/report/closed-by-agent
```

The aggregation process is:

```text
Lead
 │
 ▼
Match Closed Leads
 │
 ▼
Group by salesAgent
 │
 ▼
Count closed leads
 │
 ▼
Lookup Agent
 │
 ▼
Return Agent Name + Count
```

This creates the data required for agent-level reporting.

---

# 27. Chart Integration

The frontend uses:

```text
Chart.js
react-chartjs-2
```

The reporting data is converted into chart-friendly structures.

```text
MongoDB
   ↓
Aggregation
   ↓
REST API
   ↓
ReportContext
   ↓
Reports Page
   ↓
Chart.js
```

This demonstrates the complete flow from database analytics to frontend visualization.

---

# 28. React State Architecture

The application uses separate Contexts:

```text
AuthContext
AgentContext
LeadContext
CommentContext
ReportContext
```

Reducers are also separated:

```text
agentReducer
commentReducer
leadReducer
reportReducer
```

This keeps each domain's state transitions isolated.

---

# 29. Lead Context

The Lead Context is responsible for managing lead-related frontend operations.

Conceptually:

```text
LeadContext
    │
    ├── Fetch leads
    ├── Create lead
    ├── Update lead
    ├── Delete lead
    └── Filter/search leads
```

The reducer then updates the relevant frontend state.

---

# 30. Backend Service Layer

The service layer was one of the important architectural decisions.

Instead of:

```text
Route → MongoDB
```

the application uses:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Model
  ↓
MongoDB
```

For example:

```text
getLeads()
   ↓
getAllLeads()
   ↓
Lead.find(query)
```

This separation makes business/data logic easier to maintain.

---

# 31. Data Relationships

The main relationships are:

```text
User
 │
 └──── authorUser
             │
             ▼
          Comment
             ▲
             │
            lead
             │
             ▼
           Lead
             │
             │ salesAgent
             ▼
           Agent
```

The CRM therefore connects authentication users, comments, leads, and sales agents.

---

# 32. Error Handling

Controllers handle errors with `try/catch`.

Examples include:

```text
401 Unauthorized
```

for authentication failures.

```text
404 Not Found
```

when a requested lead or comment does not exist.

The API returns JSON messages that can be consumed by the frontend.

---

# 33. Important Engineering Challenge — Authentication

One major challenge was integrating authentication into an already structured CRM application.

The solution required changes across multiple layers:

```text
Frontend
   │
   ├── AuthContext
   ├── Login/Register
   ├── localStorage
   └── ProtectedRoute
          │
          ▼
Backend
   │
   ├── authRoutes
   ├── authController
   ├── authService
   └── authMiddleware
          │
          ▼
       MongoDB
```

This demonstrates why authentication is not only a frontend feature; it must be enforced at the API boundary as well.

---

# 34. Important Engineering Challenge — Filtering

The CRM supports several filters simultaneously.

Instead of maintaining separate endpoints for every combination, the API accepts query parameters.

```text
GET /api/leads
```

with optional:

```text
status
priority
source
salesAgent
search
```

The service dynamically constructs the MongoDB query.

This keeps the API surface relatively small.

---

# 35. Important Engineering Challenge — Reporting

Reports require calculations that are different from normal CRUD operations.

Instead of retrieving every lead and calculating everything in React, MongoDB performs aggregation for:

* Pipeline counts
* Closed leads by agent

This moves appropriate computation closer to the data layer.

---

# 36. Important Engineering Challenge — Shared Frontend State

Multiple pages need access to common data.

For example:

```text
Lead List
Lead Details
Dashboard
Lead Views
Reports
```

Context API and reducers provide a way to share state without passing data through many levels of component props.

---

# 37. Security Considerations

Current security mechanisms include:

* JWT authentication
* bcrypt password hashing
* Protected backend routes
* Protected frontend routes
* Bearer-token authentication
* Environment-based JWT secret
* Password exclusion from current-user responses

The current token is stored in `localStorage`.

For a more hardened production architecture, future improvements could include:

* HTTP-only cookies
* Refresh-token rotation
* CSRF protection where appropriate
* Request validation
* Rate limiting
* Centralized authorization rules
* Resource-level permission checks

---

# 38. Current Authorization Scope

The User model contains:

```text
role
```

with:

```text
admin
user
```

However, the current route architecture primarily uses JWT authentication to protect CRM resources.

Full role-based authorization enforcement is therefore a future improvement rather than something to claim as fully implemented.

---

# 39. Scalability Considerations

The current project is suitable for a practical CRM application.

For a larger dataset, several improvements would be useful.

### Pagination

Lead queries could support:

```text
page
limit
```

instead of loading every matching lead.

### Database Indexing

Frequently queried fields such as:

```text
status
priority
source
salesAgent
createdAt
```

could receive appropriate indexes.

### Search Optimization

Search could eventually use:

* MongoDB text indexes
* Atlas Search
* Debounced frontend requests

### Caching

Frequently requested dashboard/report data could potentially be cached.

---

# 40. Testing

The current backend package does not contain a dedicated automated test suite.

A future testing strategy could include:

### Unit Tests

* Service functions
* Reducers
* Utility functions

### API Tests

* Authentication
* Lead CRUD
* Filtering
* Comments
* Reports

### Integration Tests

```text
Login
 ↓
Create Lead
 ↓
Assign Agent
 ↓
Add Comment
 ↓
Update Status
 ↓
Generate Report
```

---

# 41. Deployment

The frontend is deployed as a Vite React application.

Live application:

```text
https://anvaya-crm-lead-management-system.vercel.app/
```

The backend is structured as a separate Express application.

The production architecture is:

```text
                ┌────────────────┐
                │ Vercel React   │
                │   Frontend     │
                └───────┬────────┘
                        │
                        │ REST API
                        ▼
                ┌────────────────┐
                │ Express API    │
                │   Backend      │
                └───────┬────────┘
                        │
                        ▼
                ┌────────────────┐
                │    MongoDB     │
                │    Database    │
                └────────────────┘
```

---

# 42. Limitations

The current implementation has several areas that could be improved:

* No pagination
* No dedicated automated tests
* No refresh-token mechanism
* JWT stored in `localStorage`
* Limited centralized validation
* No centralized error-handling middleware
* No full RBAC enforcement
* No caching layer
* No real-time updates
* No activity/audit log
* No advanced authorization at the resource level

These limitations provide clear directions for future versions.

---

# 43. Future Improvements

Potential next iterations include:

1. Role-based access control.
2. Pagination.
3. Debounced search.
4. MongoDB indexing.
5. Redis caching.
6. Centralized error middleware.
7. Stronger request validation.
8. Automated unit tests.
9. API integration tests.
10. Docker support.
11. CI/CD.
12. Activity logs.
13. Lead history.
14. Real-time lead updates.
15. Notification system.
16. Advanced analytics.
17. Export functionality.

---

# 44. Key Engineering Decisions

### Layered Backend

Routes, controllers, services, and models have separate responsibilities.

### JWT Authentication

JWT provides stateless authentication for protected APIs.

### Context API

Context provides shared application state without introducing Redux.

### useReducer

Reducers provide explicit state transitions for complex domains.

### MongoDB References

Leads reference sales agents through ObjectIds.

### Mongoose Populate

Related sales-agent and comment-user information can be returned with the primary records.

### MongoDB Aggregation

Report calculations are performed through database aggregation rather than relying entirely on frontend calculations.

### URL Query Parameters

Lead filtering state is represented in the URL, making filters persistent and shareable.

---

# 45. What I Learned

Anvaya CRM strengthened my understanding of building a complete full-stack business application.

The project helped me understand how different concerns connect:

```text
Authentication
      +
State Management
      +
REST APIs
      +
Database Relationships
      +
Filtering
      +
Aggregation
      +
Data Visualization
```

The most important learning areas were:

* JWT authentication
* Protected routes
* Password hashing
* Express middleware
* Controller/service separation
* MongoDB relationships
* Mongoose `populate()`
* MongoDB aggregation
* Context API
* `useReducer`
* URL search parameters
* CRUD operations
* Chart.js
* Full-stack API integration

---

# 46. Interview Concepts Demonstrated

This project provides practical examples for discussing:

### JavaScript

* Async/await
* Promises
* Array operations
* Object manipulation
* Error handling

### React

* Components
* Props
* Hooks
* Context API
* `useReducer`
* `useEffect`
* React Router

### Backend

* Express routing
* Middleware
* Controllers
* Service layers
* REST APIs
* JWT
* bcrypt

### Database

* MongoDB
* Mongoose
* ObjectId references
* `populate()`
* Aggregation pipelines
* Query filtering

### System Design

* Client-server architecture
* Authentication boundaries
* Layered backend architecture
* State management
* Database relationships
* Reporting architecture

---

# 47. Project Structure

```text
Anvaya CRM
│
├── frontend
│   └── src
│       ├── components
│       ├── context
│       ├── hooks
│       ├── layouts
│       ├── pages
│       ├── reducers
│       ├── routes
│       └── services
│
└── backend
    └── src
        ├── config
        ├── controllers
        ├── middleware
        ├── models
        ├── routes
        ├── seed
        ├── services
        └── server.js
```

---

# 48. Links

**Live Application**

https://anvaya-crm-lead-management-system.vercel.app/

**GitHub Repository**

https://github.com/sunny-raj-sah/-Anvaya-CRM---Lead-Management-System

---

# 49. Conclusion

Anvaya CRM is a practical full-stack CRM application that combines lead management, authentication, sales-agent relationships, comments, filtering, reporting, and data visualization.

The project demonstrates the complete lifecycle of a full-stack feature:

```text
React UI
   ↓
Context / Reducer
   ↓
Axios
   ↓
Express Route
   ↓
JWT Middleware
   ↓
Controller
   ↓
Service
   ↓
Mongoose
   ↓
MongoDB
```

The architecture also provides a foundation for future improvements such as stronger authorization, pagination, caching, automated testing, real-time collaboration, and advanced analytics.

---

## Author

**Sunny Raj**

Full Stack Engineer

> while (!understood) { tryAgain(); }
