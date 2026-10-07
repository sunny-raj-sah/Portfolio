# KaviosPix — Secure Photo Management Platform

> A full-stack photo management platform focused on authentication, authorization, protected resources, image management, and album sharing.

---

## 01. Overview

KaviosPix is a full-stack photo management application inspired by modern cloud photo platforms.

The goal was not only to build a CRUD-based image application, but to understand how a real application handles:

* User authentication
* Protected routes
* JWT-based API security
* Resource-level authorization
* File uploads
* Protected file serving
* Album sharing
* Image organization
* Frontend/backend communication
* Reusable application architecture

The application allows users to authenticate with Google, create albums, upload images, organize photos with tags, mark images as favorites, add comments, and share albums with other users.

---

# 02. Problem Statement

Managing personal images becomes difficult when photos are spread across different folders, devices, or applications.

A simple photo application can provide upload and delete functionality, but a real application needs to answer more complex questions:

```text
Who owns this album?

Who can access this album?

Can a shared user delete the album?

Can a user access an image from another album?

Can someone access an image simply by knowing its ID?

Can an uploaded file be trusted?

How should authentication and authorization be separated?
```

These questions became the main engineering focus of KaviosPix.

---

# 03. Project Goals

The project was designed around several goals.

### Functional Goals

* Authenticate users using Google OAuth
* Create and manage albums
* Upload images
* Organize images using tags
* Filter images
* Mark images as favorites
* Add comments
* Share albums
* Revoke album access

### Engineering Goals

* Implement JWT authentication
* Build reusable authorization middleware
* Protect image resources
* Validate file uploads
* Separate controllers, routes, middleware, and models
* Build reusable React components
* Keep frontend and backend responsibilities separate

---

# 04. Core Product Flow

The overall user journey is:

```text
Landing Page
     │
     ▼
Google Authentication
     │
     ▼
JWT Authentication
     │
     ▼
Dashboard
     │
     ├── Create Album
     │
     ├── Open Album
     │      │
     │      ├── Upload Images
     │      ├── Add Tags
     │      ├── Add Comments
     │      ├── Favorite Images
     │      └── Share Album
     │
     └── Favorites
```

---

# 05. Architecture

KaviosPix uses a client-server architecture.

```text
                    ┌──────────────────────┐
                    │      React App       │
                    │                      │
                    │ Pages                │
                    │ Components           │
                    │ Context              │
                    │ Protected Routes     │
                    └──────────┬───────────┘
                               │
                               │ Axios
                               │ JWT
                               ▼
                    ┌──────────────────────┐
                    │    Express Server    │
                    │                      │
                    │ Routes               │
                    │ Controllers          │
                    │ Middleware           │
                    │ Error Handling       │
                    └──────────┬───────────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
                 ▼             ▼             ▼
             MongoDB         JWT          Multer
                 │                           │
                 ▼                           ▼
         Users / Albums /              Image Files
             Images
```

---

# 06. Technology Decisions

## React

React was used to build the user interface because the application contains multiple interactive areas:

* Albums
* Image galleries
* Upload forms
* Sharing forms
* Favorites
* Comments
* Filters

Reusable components make these areas easier to maintain.

---

## Node.js and Express

Express provides the API layer between the frontend and database.

It handles:

* Authentication
* Authorization
* Album operations
* Image operations
* File uploads
* Comments
* Favorites
* Sharing

---

## MongoDB

MongoDB was selected because the application's resources naturally map to document-oriented models.

The primary entities are:

```text
User
Album
Image
```

---

## JWT

JWT is used to authenticate API requests after the Google OAuth login flow.

The client sends:

```http
Authorization: Bearer <token>
```

The backend verifies the token before processing protected requests.

---

## Google OAuth

Instead of implementing password-based authentication, KaviosPix uses Google OAuth.

This provides:

```text
User
 ↓
Google
 ↓
OAuth Callback
 ↓
Application User
 ↓
JWT
```

---

## Multer

Multer handles multipart image uploads.

It provides:

* File handling
* File type filtering
* File size limits
* Generated filenames

---

# 07. Authentication Architecture

Authentication starts with Google OAuth.

```text
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       │ Continue with Google
       ▼
┌─────────────┐
│ Google OAuth│
└──────┬──────┘
       │
       │ Callback
       ▼
┌──────────────────┐
│ Express Backend  │
└────────┬─────────┘
         │
         ▼
    Find/Create User
         │
         ▼
     Generate JWT
         │
         ▼
      Frontend
         │
         ▼
   Authenticated App
```

The backend stores the application-level user using a UUID-style identifier.

---

# 08. JWT Request Lifecycle

Once authenticated, protected API requests follow this process:

```text
HTTP Request
     │
     ▼
Authorization Header
     │
     ▼
Extract Bearer Token
     │
     ▼
Verify JWT
     │
     ▼
Find User
     │
     ▼
req.user
     │
     ▼
Continue Request
```

If the token is missing or invalid:

```http
401 Unauthorized
```

---

# 09. Authentication vs Authorization

One of the most important concepts implemented in the project is the distinction between authentication and authorization.

### Authentication

Answers:

> Who are you?

```text
JWT
 ↓
User Identity
```

### Authorization

Answers:

> What are you allowed to access?

```text
User
 ↓
Album
 ↓
Permission
```

This distinction became particularly important when implementing album sharing.

---

# 10. Album Authorization

Each album contains:

```text
albumId
ownerId
sharedUsers[]
```

The backend checks whether the current user is:

```text
Album Owner
      OR
Shared User
```

The authorization middleware effectively follows:

```text
Find Album
    │
    ▼
Is User Owner?
    │
    ├── Yes ──► Allow
    │
    └── No
         │
         ▼
Is User Shared?
         │
         ├── Yes ──► Allow
         │
         └── No ───► 403
```

This keeps authorization logic outside individual controllers.

---

# 11. Why Middleware?

Instead of writing authorization checks repeatedly inside every controller, the project uses middleware.

For example:

```text
authenticate
     ↓
requireAlbumOwner
     ↓
controller
```

or:

```text
authenticate
     ↓
requireAlbumAccess
     ↓
requireImageInAlbum
     ↓
controller
```

This makes authorization:

* Reusable
* Centralized
* Easier to reason about
* Easier to extend

---

# 12. Protected Image Architecture

Protecting image files was one of the most important design decisions.

A naive implementation could expose:

```text
/uploads/image.jpg
```

as a public resource.

That creates a problem.

If the image URL becomes known, the application may lose control over who can access the image.

KaviosPix instead exposes image retrieval through an authenticated API route.

```text
GET
/albums/:albumId/images/:imageId/file
```

The request passes through:

```text
JWT Authentication
        ↓
Album Access
        ↓
Image Belongs to Album
        ↓
Serve Image
```

---

# 13. Image Relationship Validation

The application receives both:

```text
albumId
imageId
```

It is not enough to check whether both records exist.

The backend must verify:

```text
image.albumId === requested.albumId
```

This prevents an image belonging to another album from being accessed through a manipulated route.

The flow is:

```text
Request
  │
  ├── albumId
  │
  └── imageId
       │
       ▼
Find Image
       │
       ▼
Verify Image → Album relationship
       │
       ▼
Continue
```

---

# 14. Image Upload Architecture

Image upload uses multipart form data.

```text
React
 │
 │ FormData
 ▼
Express
 │
 ▼
Authentication
 │
 ▼
Album Owner Check
 │
 ▼
Multer
 │
 ├── MIME Type
 ├── File Size
 └── Filename
 │
 ▼
Image Controller
 │
 ▼
MongoDB
```

Supported formats:

```text
JPEG
PNG
WebP
```

Maximum size:

```text
5 MB
```

---

# 15. Why Backend Validation?

Frontend validation improves user experience, but it cannot be treated as a security mechanism.

For example:

```text
Frontend:
"Only PNG allowed"

        ≠

Backend:
"Only PNG allowed"
```

The backend independently validates the uploaded file.

This follows the principle:

> Never trust client-side validation alone.

---

# 16. Album Sharing

Album sharing allows an owner to grant access to other users.

The owner provides email addresses:

```json
{
  "emails": [
    "user1@example.com",
    "user2@example.com"
  ]
}
```

The emails are stored in the album's:

```text
sharedUsers[]
```

field.

Access is then evaluated by the backend.

---

# 17. Owner vs Shared User

The sharing system creates two permission levels.

### Owner

```text
Create
Read
Update
Delete
Share
Revoke
Upload
Delete Images
Manage Comments
```

### Shared User

```text
Read permitted resources
Access protected images
Use supported photo interactions
```

The important point is that sharing an album does not automatically transfer ownership.

---

# 18. Tags and Filtering

Images can contain multiple tags.

Example:

```text
travel
nature
college
friends
vacation
```

Filtering can be requested through query parameters.

```http
GET /albums/:albumId/images?tags=travel,nature
```

The backend can then return images matching the requested tag criteria.

---

# 19. Favorites

Favorite functionality allows users to maintain a collection of preferred images.

The flow is:

```text
Image
  │
  ▼
Favorite Action
  │
  ▼
API
  │
  ▼
Authorization
  │
  ▼
Update Image
  │
  ▼
Frontend State
```

A dedicated Favorites page provides a centralized view.

---

# 20. Comments

Comments are associated with images.

A comment operation requires:

```text
Authenticated User
        ↓
Album Permission
        ↓
Image Relationship
        ↓
Comment Validation
        ↓
Save Comment
```

Validation includes:

* Empty comment prevention
* Maximum length
* Image relationship
* Authorization

---

# 21. Frontend Architecture

The frontend separates reusable UI from application pages.

```text
src/
│
├── components/
│   ├── albums/
│   ├── images/
│   └── common/
│
├── context/
│
├── pages/
│
├── routes/
│
├── services/
│
└── main.jsx
```

---

# 22. Component Architecture

Album functionality is divided into reusable components.

```text
albums/
├── AlbumHeader
├── AlbumShareForm
├── AlbumUploadForm
└── CreateAlbumForm
```

Image functionality is separated into:

```text
images/
├── ImageCard
├── ImageComments
├── ImageFilter
└── ImageGallery
```

This keeps large pages from becoming monolithic components.

---

# 23. Service Layer

API calls are separated from UI components.

The project contains services such as:

```text
api.js
auth.service.js
album.service.js
image.service.js
user.service.js
```

This creates a separation between:

```text
UI
 ↓
Service
 ↓
API
```

instead of putting HTTP logic directly inside every component.

---

# 24. Protected Frontend Routes

The frontend also contains protected route handling.

```text
User
 │
 ▼
ProtectedRoute
 │
 ├── Authenticated → Application
 │
 └── Unauthenticated → Login
```

However, this is primarily a user-experience mechanism.

Actual resource security remains on the backend.

---

# 25. Error Handling

The backend contains dedicated error-handling middleware.

The project also uses utility helpers for:

* Application errors
* Async request handling
* Centralized error responses

This keeps controller code cleaner and provides a consistent API response structure.

---

# 26. API Design Philosophy

The API is organized around resources.

Instead of designing endpoints around UI actions, the application uses resources such as:

```text
/auth
/albums
/albums/:albumId
/albums/:albumId/images
/albums/:albumId/images/:imageId
```

This makes the API easier to understand and extend.

---

# 27. Important Engineering Decision

One of the biggest lessons from this project was:

```text
Do not trust the frontend.
```

For example:

```text
Hide Delete Button
```

does not mean:

```text
Delete API is secure
```

The backend must still execute:

```text
Authenticate
     ↓
Authorize
     ↓
Validate Resource
     ↓
Execute Operation
```

This principle influenced the design of the entire application.

---

# 28. Challenges

## Challenge 1 — OAuth Callback

Google OAuth introduces a multi-step authentication flow.

The application needed to correctly coordinate:

```text
Google
 ↓
Backend Callback
 ↓
JWT
 ↓
Frontend Callback
 ↓
Authentication State
```

---

## Challenge 2 — Album-Level Permissions

A simple JWT check was not enough.

A valid user could still be unauthorized to access a particular album.

This required a separate authorization layer.

---

## Challenge 3 — Protected Images

Images required more than a database lookup.

The application had to verify:

```text
User
 +
Album
 +
Image
```

before serving the file.

---

## Challenge 4 — File Validation

Uploaded files needed server-side validation for:

```text
MIME Type
File Size
Upload Errors
```

---

## Challenge 5 — Component Complexity

As album and image features grew, large React pages became harder to maintain.

The solution was to extract functionality into reusable components such as:

```text
ImageGallery
ImageCard
ImageComments
ImageFilter
AlbumShareForm
AlbumUploadForm
```

---

# 29. Debugging and Development Lessons

During development, several classes of problems required debugging across both frontend and backend layers.

Examples included:

```text
React state synchronization
        ↓
API response handling
        ↓
JWT authentication
        ↓
Middleware ordering
        ↓
Album authorization
        ↓
File uploads
        ↓
Protected image access
```

This reinforced the importance of tracing a feature through the complete request lifecycle rather than debugging only the UI.

---

# 30. What I Learned

KaviosPix significantly improved my understanding of full-stack engineering.

### React

I practiced:

* Component architecture
* React Router
* Context API
* Protected routes
* API integration
* State management
* Form handling
* Reusable components
* Loading states
* Error states

### Node.js / Express

I practiced:

* REST API design
* Controllers
* Middleware
* JWT authentication
* Authorization
* File uploads
* Error handling
* Protected resources

### MongoDB

I practiced:

* Mongoose schemas
* Relationships
* Indexed fields
* Arrays
* Filtering
* Resource queries

### Security

The biggest learning was the difference between:

```text
Authentication
```

and:

```text
Authorization
```

and why both must be enforced on the backend.

---

# 31. Future Improvements

The current architecture can be extended with:

### Storage

Move uploaded files from local storage to:

```text
Cloud Storage
```

such as an object-storage service.

### Performance

Add:

* Image thumbnails
* Pagination
* Lazy loading
* Infinite scrolling
* Caching

### Search

Introduce:

```text
Image Search
Album Search
Tag Search
```

### Sharing

Expand permissions into roles such as:

```text
Owner
Editor
Viewer
```

### Testing

Add:

```text
Unit Tests
Integration Tests
API Tests
End-to-End Tests
```

### Observability

Introduce:

```text
Logging
Monitoring
Error Tracking
Performance Metrics
```

---

# 32. Final Architecture

The complete system can be summarized as:

```text
                    USER
                      │
                      ▼
               Google OAuth
                      │
                      ▼
                 JWT Token
                      │
                      ▼
               React Application
                      │
                      ▼
                   Axios
                      │
                      ▼
               Express API
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
       Authentication     Authorization
             │                 │
             └────────┬────────┘
                      ▼
                Controllers
                      │
             ┌────────┴────────┐
             │                 │
             ▼                 ▼
          MongoDB           Multer
             │                 │
             ▼                 ▼
       Users / Albums       Image Files
             │
             ▼
      Protected Resources
```

---

# 33. Portfolio Impact

KaviosPix demonstrates more than basic CRUD development.

It demonstrates practical understanding of:

```text
Frontend Architecture
        +
REST API Design
        +
Authentication
        +
Authorization
        +
OAuth
        +
JWT
        +
File Management
        +
Resource-Level Security
        +
MongoDB
        +
React State Management
```

The strongest part of the project is the security architecture:

```text
Authenticated User
        ↓
Authorized Resource
        ↓
Validated Relationship
        ↓
Protected Operation
```

This makes KaviosPix a strong project to discuss in a backend, full-stack, or SDE-1 interview.

---

# 34. Conclusion

KaviosPix started as a photo management application but became an exercise in understanding how real full-stack systems protect and manage resources.

The most important engineering lesson was:

> **Authentication tells the system who the user is; authorization determines what that user is allowed to do.**

By combining Google OAuth, JWT authentication, album-level permissions, protected image serving, file validation, and reusable React components, KaviosPix demonstrates a practical approach to building a secure full-stack application.
