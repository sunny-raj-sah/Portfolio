# Workasana — Task Management Application

## 1. Project Overview

Workasana is a full-stack task management application designed to provide a centralized workspace for organizing projects, tasks, teams, users, tags, and progress.

The application was built using **React, Node.js, Express.js, MongoDB, JWT, Context API, and Mongoose**.

The primary engineering goal was to build a complete full-stack workflow where a React application communicates with a secured REST API and persists structured task-management data in MongoDB.

### Project Details

| Category         | Details                     |
| ---------------- | --------------------------- |
| Project          | Workasana                   |
| Type             | Full-Stack Web Application  |
| Frontend         | React + Vite                |
| Backend          | Node.js + Express.js        |
| Database         | MongoDB                     |
| ODM              | Mongoose                    |
| Authentication   | JWT                         |
| State Management | Context API + useReducer    |
| UI               | Bootstrap + React-Bootstrap |
| Charts           | Chart.js                    |
| Deployment       | Vercel + MongoDB Atlas      |

---

# 2. Problem Statement

Task and project information can become difficult to manage when projects, teams, owners, deadlines, and task statuses are spread across different places.

A centralized application can provide a structured workflow for:

* Creating projects
* Organizing tasks
* Assigning owners
* Associating tasks with teams
* Tracking task status
* Filtering work
* Viewing progress
* Managing users and tags
* Reviewing productivity statistics

Workasana was built to demonstrate this workflow through a full-stack web application.

---

# 3. Application Architecture

The application follows a client-server architecture.

```text
┌──────────────────────────────┐
│          React UI            │
│                              │
│ Pages / Components / Hooks   │
└──────────────┬───────────────┘
               │
               │ Axios
               │ REST API
               ▼
┌──────────────────────────────┐
│       Express.js API         │
│                              │
│ Routes → Middleware →        │
│ Controllers                  │
└──────────────┬───────────────┘
               │
               │ Mongoose
               ▼
┌──────────────────────────────┐
│         MongoDB              │
│                              │
│ Users / Tasks / Projects /   │
│ Teams / Tags                 │
└──────────────────────────────┘
```

This separation keeps the frontend responsible for presentation and client-side state while the backend manages API operations, authentication, and persistence.

---

# 4. Frontend Architecture

The frontend is built with React and Vite.

The application is organized into:

```text
client/src/
├── components/
├── context/
├── pages/
├── services/
├── assets/
├── App.jsx
└── main.jsx
```

### Pages

The application contains dedicated pages for:

* Login
* Signup
* Dashboard
* Projects
* Project Details
* Task Details
* Teams
* Reports
* Settings

### Components

Reusable components handle functionality such as:

* Task creation
* Task editing
* Project creation
* Task cards
* Project cards
* Team management
* Task search
* Sidebar
* Protected routes

This keeps large page components from containing every UI responsibility themselves.

---

# 5. Authentication Architecture

Authentication uses JWT.

The flow starts when a user registers or logs in.

```text
                 Register / Login
                        │
                        ▼
                  Express Route
                        │
                        ▼
                Auth Controller
                        │
               ┌────────┴────────┐
               │                 │
           Register             Login
               │                 │
               ▼                 ▼
        bcrypt.hash()       bcrypt.compare()
               │                 │
               └────────┬────────┘
                        ▼
                   Generate JWT
                        │
                        ▼
                   React Client
                        │
                        ▼
                    localStorage
```

The token contains the user's ID and expires after seven days.

---

# 6. Password Security

Passwords are not stored as plain text.

During registration:

```text
Plain Password
      │
      ▼
bcrypt.hash()
      │
      ▼
Hashed Password
      │
      ▼
MongoDB
```

During login:

```text
Entered Password
      │
      ▼
bcrypt.compare()
      │
      ▼
Stored Hash
```

This provides a basic password-protection mechanism instead of persisting raw passwords.

---

# 7. JWT Middleware

Protected APIs use authentication middleware.

The middleware reads:

```http
Authorization: Bearer <token>
```

It then verifies the token using the server-side JWT secret.

```text
HTTP Request
     │
     ▼
Authorization Header
     │
     ▼
authMiddleware
     │
     ├── Missing → 401
     │
     ├── Invalid → 401
     │
     └── Valid
           │
           ▼
       Controller
```

This middleware is applied to project, task, team, user, and tag routes.

The `/api/auth/me` endpoint also requires authentication.

---

# 8. Frontend Authentication State

The React application uses `AuthContext`.

The authentication reducer manages states such as:

```text
SET_LOADING
LOGIN_SUCCESS
LOAD_USER
LOGOUT
```

The state contains:

```text
user
token
isAuthenticated
loading
```

On application startup, the context checks for an existing token.

If a token exists, it calls:

```http
GET /api/auth/me
```

to retrieve the current authenticated user.

If the request fails, the token is removed and the user is logged out.

---

# 9. Protected Frontend Routes

The application uses a reusable `ProtectedRoute` component.

Protected areas include:

```text
/dashboard
/projects
/projects/:id
/tasks/:id
/teams
/reports
/settings
```

The authentication boundary therefore exists on both sides:

```text
Frontend
   │
   ▼
ProtectedRoute
   │
   ▼
Backend
   │
   ▼
JWT Middleware
```

This prevents the UI from relying only on client-side route protection.

---

# 10. Axios Interceptor

The application creates a centralized Axios instance.

Before a request is sent, the interceptor checks:

```js
localStorage.getItem("token")
```

If a token exists, it attaches:

```http
Authorization: Bearer <token>
```

This creates a reusable authentication mechanism for API requests.

Without an interceptor, each API call would need to manually construct the authorization header.

---

# 11. Task Management

Tasks are the central entity of Workasana.

Each task contains:

```text
Task
├── name
├── project
├── team
├── owners[]
├── tags[]
├── dueDate
├── timeToComplete
├── status
└── timestamps
```

Supported statuses are:

```text
To Do
In Progress
Completed
Blocked
```

The application supports the complete task CRUD lifecycle:

```text
Create
  ↓
Read
  ↓
Update
  ↓
Status Update
  ↓
Delete
```

---

# 12. Task Relationships

A task is connected to multiple entities.

```text
                ┌──────────────┐
                │   Project    │
                └──────▲───────┘
                       │
                       │
┌──────────┐      ┌────┴─────┐      ┌──────────┐
│  Team    │◄─────│   Task   │─────►│  User    │
└──────────┘      └────┬─────┘      └──────────┘
                       │
                       ▼
                    Tags
```

MongoDB ObjectId references are used for:

* Project
* Team
* Owners

Tags are currently stored as strings in the Task model.

---

# 13. Mongoose Population

Because tasks contain ObjectId references, the backend uses Mongoose `populate()`.

For example:

```js
.populate("project", "name")
.populate("team", "name")
.populate("owners", "name email")
```

Instead of returning only IDs, the API can return the related information required by the UI.

This simplifies frontend rendering.

---

# 14. Task Filtering

The task API accepts query parameters:

```text
project
team
status
owner
```

For example:

```http
GET /api/tasks?status=Completed
```

or:

```http
GET /api/tasks?project=<projectId>&status=In%20Progress
```

The controller builds a MongoDB filter dynamically:

```text
Request Query
     │
     ▼
project / team / status / owner
     │
     ▼
MongoDB filter object
     │
     ▼
Task.find(filter)
```

This provides server-side filtering rather than downloading all data and performing every filter entirely in the browser.

---

# 15. Project Management

The project module provides:

```text
POST   /api/projects
GET    /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
```

Projects currently contain:

```text
name
description
timestamps
```

Projects provide a higher-level grouping for tasks.

---

# 16. Team Management

Teams can be created and maintained through REST APIs.

The team model contains:

```text
name
description
```

The API supports:

```text
Create
Read
Update
Delete
```

Tasks reference teams using MongoDB ObjectIds.

---

# 17. User Management

Workasana maintains an application-level `User` model for task ownership.

The User model contains:

```text
name
email
```

The application also has a separate `AuthUser` model for login credentials.

This creates two distinct concepts:

```text
AuthUser
   │
   └── Authentication identity

User
   │
   └── Application/task identity
```

This separation is an important implementation detail of the current project.

---

# 18. Tag Management

Tags are managed through their own REST API.

Supported operations include:

```text
Create Tag
Get Tags
Update Tag
Delete Tag
```

Tasks can contain multiple tag values.

Example:

```text
["UI", "Feature"]
```

---

# 19. Dashboard

The dashboard provides a centralized overview of application activity.

It brings together information about:

* Tasks
* Projects
* Status
* Progress

The objective is to reduce the need to navigate through multiple pages to understand the current work state.

---

# 20. Reports and Data Visualization

The Reports page uses:

* Chart.js
* react-chartjs-2

to present application statistics visually.

The project demonstrates the flow:

```text
MongoDB Data
     │
     ▼
REST API
     │
     ▼
React State
     │
     ▼
Chart.js
     │
     ▼
Visual Report
```

This converts raw task/project information into visual summaries.

---

# 21. Profile Management

The settings module provides:

```text
Update Profile
Change Password
```

Endpoints:

```http
PUT /api/settings/profile
PUT /api/settings/password
```

These routes use the profile authentication middleware.

---

# 22. REST API Design

The backend follows resource-oriented REST endpoints.

For example:

```text
/api/projects
/api/tasks
/api/teams
/api/users
/api/tags
```

Each resource has its own:

```text
Route
Controller
Model
```

This makes the backend modular.

---

# 23. Controller Architecture

Controllers separate request handling from route declarations.

For example:

```text
taskRoutes.js
      │
      ▼
taskController.js
      │
      ▼
Task.js
      │
      ▼
MongoDB
```

The same pattern is used for:

```text
Authentication
Projects
Tasks
Teams
Users
Tags
Profiles
```

This follows a lightweight MVC-style organization.

---

# 24. Seed Data

The backend provides a database seeding script.

Command:

```bash
npm run seed
```

The seed process clears existing task-management collections and creates sample:

* Teams
* Users
* Tags
* Projects
* Tasks

This makes local development and demonstration easier.

---

# 25. Error Handling

Controllers use `try/catch` blocks for asynchronous operations.

For example, when a requested resource does not exist:

```json
{
  "message": "Task not found"
}
```

The API returns:

```http
404 Not Found
```

Authentication failures return:

```http
401 Unauthorized
```

This gives the frontend predictable HTTP responses.

---

# 26. Important Engineering Challenge — Authentication State

One challenge was keeping authentication state synchronized across the application.

The solution was to combine:

```text
localStorage
      +
AuthContext
      +
useReducer
      +
/auth/me
```

The token provides persistence across refreshes, while `/auth/me` verifies the current authenticated identity.

---

# 27. Important Engineering Challenge — Related Data

Tasks depend on several other resources.

A task needs information about:

```text
Project
Team
Owners
Tags
```

Returning only ObjectIds would require additional client-side requests.

Mongoose `populate()` was therefore used for relevant references.

This keeps the task response useful to the frontend.

---

# 28. Important Engineering Challenge — Filtering

Task filtering could have been implemented entirely on the frontend.

Instead, the backend accepts filtering parameters and constructs a database query.

This gives the architecture:

```text
UI Filter
   │
   ▼
Query Parameter
   │
   ▼
REST API
   │
   ▼
MongoDB Query
   │
   ▼
Filtered Response
```

This approach also provides a path toward handling larger datasets later.

---

# 29. Important Engineering Challenge — Shared React State

Multiple pages need common application information.

For example:

```text
Projects
Tasks
Teams
Users
Tags
```

Instead of passing all of this through deeply nested component props, the application uses Context API.

`useReducer` provides explicit state transitions.

---

# 30. Security Considerations

The application currently implements:

* bcrypt password hashing
* JWT authentication
* protected Express routes
* protected React routes
* Bearer token authorization
* environment-based secrets

However, there are areas that could be strengthened in a production-grade system.

The current frontend stores JWTs in `localStorage`. A more hardened implementation could use:

* HTTP-only secure cookies
* refresh-token rotation
* CSRF protection where applicable
* stronger request validation
* rate limiting
* centralized error handling
* role-based authorization
* resource ownership checks

These are identified as future engineering improvements rather than current implemented features.

---

# 31. Scalability Considerations

The current implementation is suitable for a project-scale application, but several areas would need improvement as data volume grows.

Potential improvements include:

### Pagination

Current task retrieval returns matching task documents directly.

For a large production dataset:

```text
GET /api/tasks?page=2&limit=20
```

could reduce response size.

### Database Indexes

Frequently filtered fields could receive appropriate MongoDB indexes.

### Server-Side Search

Search could be moved completely to the database for large datasets.

### Caching

Frequently requested dashboard statistics could potentially be cached.

---

# 32. Testing Strategy

The current repository does not contain a dedicated automated test suite.

A future testing strategy could include:

### Backend

* Authentication tests
* Controller tests
* API integration tests
* Validation tests

### Frontend

* Component tests
* Protected-route tests
* Form tests
* Context tests

### End-to-End

Tools such as Playwright or Cypress could test workflows such as:

```text
Signup
   ↓
Login
   ↓
Create Project
   ↓
Create Task
   ↓
Update Status
   ↓
View Report
```

---

# 33. Deployment Architecture

The deployed application separates frontend and backend concerns.

```text
             Vercel
        ┌──────────────┐
        │ React Client │
        └───────┬──────┘
                │
                │ HTTPS REST API
                ▼
        ┌──────────────┐
        │ Express API  │
        └───────┬──────┘
                │
                ▼
        ┌──────────────┐
        │ MongoDB Atlas│
        └──────────────┘
```

The frontend receives the API base URL through:

```env
VITE_API_URL
```

---

# 34. Project Structure

```text
Workasana/
│
├── client/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       └── App.jsx
│
└── server/
    └── src/
        ├── config/
        ├── controllers/
        ├── middleware/
        ├── models/
        ├── routes/
        ├── data.js
        └── server.js
```

The structure clearly separates frontend presentation/state from backend API/data responsibilities.

---

# 35. Key Engineering Decisions

### React + Express

Using React with an Express REST API provides a clear client-server boundary.

### Context API

Context API is sufficient for the current application state requirements.

### useReducer

`useReducer` provides predictable state transitions for authentication and shared application state.

### JWT

JWT provides stateless authentication between the frontend and backend.

### MongoDB

MongoDB fits the application's document-oriented task-management data and works naturally with Mongoose references.

### Mongoose

Mongoose provides:

* Schemas
* Validation
* ObjectId references
* Population
* Database access abstraction

---

# 36. What This Project Demonstrates

From a recruiter/interviewer perspective, the project demonstrates practical experience with:

```text
Frontend
├── React
├── React Router
├── Hooks
├── Context API
├── useReducer
└── Bootstrap

Backend
├── Node.js
├── Express.js
├── REST APIs
├── Middleware
└── JWT

Database
├── MongoDB
├── Mongoose
├── References
└── populate()

Engineering
├── Authentication
├── CRUD
├── Filtering
├── State Management
├── API Integration
└── Deployment
```

---

# 37. Interview Questions This Project Can Support

### Authentication

* How does JWT authentication work?
* Why hash passwords?
* What is bcrypt?
* What is the difference between authentication and authorization?
* Why use an Axios interceptor?
* How does a protected route work?

### React

* Why use Context API?
* What is `useReducer`?
* When would you use `useReducer` instead of `useState`?
* How does `useEffect` work in authentication initialization?
* How does React Router protect pages?

### Backend

* How does Express middleware work?
* How do routes and controllers interact?
* How would you structure a REST API?
* How do you handle errors in asynchronous controllers?

### MongoDB

* Why use Mongoose?
* What is an ObjectId reference?
* What does `populate()` do?
* How would you optimize task filtering?
* When would you introduce indexes?

### System Design

* How would you scale task retrieval?
* How would you implement pagination?
* How would you implement role-based access?
* How would you add real-time task updates?
* How would you improve authentication security?

---

# 38. Limitations of the Current Implementation

The current implementation is a practical full-stack project rather than a production-scale collaboration platform.

Known areas for improvement include:

* No dedicated automated test suite
* No refresh-token rotation
* JWT stored in `localStorage`
* No role-based access control
* Limited request validation
* No centralized Express error middleware
* No pagination on task retrieval
* No real-time synchronization
* No activity/audit history
* No notification system
* Authentication users and application users are represented by separate models

These limitations also provide clear directions for future iterations.

---

# 39. Future Improvements

Potential future versions could add:

1. Role-based access control.
2. HTTP-only access/refresh-token authentication.
3. Task comments.
4. Task attachments.
5. Notifications.
6. Real-time task updates with WebSockets.
7. Pagination and advanced search.
8. Audit logs.
9. Automated testing.
10. API documentation with OpenAPI/Swagger.
11. Stronger schema validation.
12. Resource-level authorization.
13. Centralized backend error handling.
14. Performance monitoring.

---

# 40. Learning Outcome

Workasana strengthened my understanding of full-stack development by requiring me to connect multiple application layers.

The complete request lifecycle is:

```text
User Interaction
       ↓
React Component
       ↓
Context / Hook
       ↓
Axios
       ↓
Express Route
       ↓
JWT Middleware
       ↓
Controller
       ↓
Mongoose
       ↓
MongoDB
       ↓
JSON Response
       ↓
React State
       ↓
UI Update
```

The project helped reinforce practical concepts including:

* REST API design
* JWT authentication
* Password hashing
* Express middleware
* React Context
* `useReducer`
* Axios interceptors
* MongoDB relationships
* Mongoose population
* CRUD architecture
* Query filtering
* Data visualization
* Deployment

---

# 41. Links

**Live Application**

https://workasana-task-management-applicati-phi.vercel.app/login

**GitHub Repository**

https://github.com/sunny-raj-sah/Workasana---Task-Management-Application

---

# 42. Conclusion

Workasana was built as a practical full-stack task management system combining a React frontend, Express REST API, JWT authentication, Mongoose data modeling, and MongoDB persistence.

The project goes beyond basic CRUD by connecting authentication, protected routes, shared React state, related MongoDB documents, task filtering, dashboards, reports, and deployment into one application.

The architecture also provides a foundation for future improvements such as role-based authorization, real-time collaboration, pagination, notifications, audit logging, and stronger production security.

---

## Author

**Sunny Raj**

Full Stack Engineer

> while (!understood) { tryAgain(); }
