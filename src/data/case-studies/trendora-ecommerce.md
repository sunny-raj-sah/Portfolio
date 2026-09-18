# Trendora — Full Stack E-Commerce Platform

## Project Overview

Trendora is a full-stack e-commerce application built using the **MERN stack**.

The project was designed to simulate the core architecture of a modern shopping platform while providing hands-on experience with authentication, REST APIs, MongoDB data modeling, frontend state management, product discovery, cart workflows, wishlist functionality, address management, and order-related backend services.

The application separates the React frontend from the Node.js/Express backend and uses MongoDB as the primary database.

---

## Problem

A shopping application requires more than displaying products.

The system needs to coordinate several independent concerns:

* User authentication
* Product discovery
* Search and filtering
* Wishlist management
* Shopping cart management
* Address management
* Checkout
* Order management
* User-specific data
* Persistent database storage
* Protected API access

The main engineering challenge was designing these features so that the frontend state and backend resources remained clearly separated.

---

## Goals

The project focused on building a practical full-stack application with:

1. JWT-based authentication
2. Protected backend APIs
3. Product search and filtering
4. Wishlist functionality
5. Cart management
6. Address management
7. Order-related APIs
8. MongoDB data modeling
9. React Context and reducer-based state management
10. Responsive frontend UI

---

# Core Features

## 1. Authentication

Users can register and log in to the application.

The backend:

* Hashes passwords using bcrypt
* Generates JWT tokens
* Validates Bearer tokens
* Retrieves the authenticated user
* Protects private resources

The authentication token is stored by the current frontend implementation in browser local storage.

The protected request flow is:

```text
Login
  ↓
JWT generated
  ↓
Token stored in browser
  ↓
API request
  ↓
Authorization: Bearer <token>
  ↓
Authentication middleware
  ↓
User lookup
  ↓
Protected controller
```

---

# 2. Product Discovery

The product API supports:

* Product listing
* Product details
* Category filtering
* Text search
* Rating filtering
* Price sorting

The API accepts query parameters such as:

```text
category
search
rating
sort
```

Example:

```text
GET /api/products?category=Clothing&search=shirt&rating=4&sort=lowToHigh
```

The backend uses MongoDB queries to apply the requested filters.

The frontend then consumes the API response and presents the products through reusable product cards and product grids.

---

# 3. Product Details

Each product contains:

```text
title
brand
description
image
category
price
rating
stock
featured
```

The product details page provides the user with a focused view of an individual product before adding it to the cart or wishlist.

---

# 4. Wishlist

Wishlist functionality is available to authenticated users.

The API supports:

```text
GET    /api/wishlist
POST   /api/wishlist/:productId
DELETE /api/wishlist/:productId
```

Instead of creating a separate wishlist collection, the project stores product references inside the user's MongoDB document.

This keeps the relationship simple:

```text
User
 └── wishlist[]
       ├── Product ID
       ├── Product ID
       └── Product ID
```

---

# 5. Shopping Cart

The cart supports:

* Adding products
* Increasing quantity
* Decreasing quantity
* Removing products
* Retrieving cart contents

Cart API:

```text
GET    /api/cart
POST   /api/cart/:productId
PUT    /api/cart/:productId
DELETE /api/cart/:productId
```

The cart is embedded in the `User` document:

```text
User
 └── cart[]
       ├── product
       └── quantity
```

When an existing product is added again, its quantity can be increased rather than creating another duplicate cart entry.

---

# 6. Address Management

Authenticated users can manage shipping addresses.

Available operations:

```text
GET    /api/address
POST   /api/address
PUT    /api/address/:addressId
DELETE /api/address/:addressId
```

Each address contains:

```text
name
phone
street
city
state
country
pincode
```

Addresses are embedded inside the user's document.

---

# 7. Order Backend

The backend contains a dedicated `Order` model.

An order stores:

```text
user
items
shippingAddress
totalItems
totalPrice
orderStatus
createdAt
updatedAt
```

Order items retain:

```text
product
quantity
price
```

This design allows the order to preserve the price associated with the transaction instead of relying exclusively on the current product price.

Supported order statuses are:

```text
Placed
Processing
Shipped
Delivered
Cancelled
```

The backend exposes:

```text
POST /api/orders
GET  /api/orders
```

The authenticated user can retrieve their own order history.

### Current frontend limitation

The current `Checkout.jsx` implementation creates a local order through `OrderContext` and navigates to the order-success page.

It currently does **not** call:

```text
POST /api/orders
```

Therefore, the backend order infrastructure exists, but the current frontend checkout flow is not yet fully connected to it.

This is an important architectural distinction and an area for future integration.

---

# System Architecture

```text
┌──────────────────────────────────────────────┐
│                  React App                   │
│                                              │
│ Pages → Components → Contexts → Reducers    │
└──────────────────────┬───────────────────────┘
                       │
                       │ HTTP / JSON
                       ▼
┌──────────────────────────────────────────────┐
│               API Layer                      │
│                                              │
│ api.js                                       │
│ productApi.js                                │
│ wishlistApi.js                               │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│             Express Backend                  │
│                                              │
│ Routes → Middleware → Controllers             │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                 Mongoose                     │
│                                              │
│ User     Product     Order                   │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│                  MongoDB                     │
└──────────────────────────────────────────────┘
```

---

# Backend Architecture

The backend follows a route-controller-model style structure.

```text
Request
  ↓
Route
  ↓
Authentication Middleware
  ↓
Controller
  ↓
Mongoose Model
  ↓
MongoDB
  ↓
Response
```

The backend is divided into:

```text
routes/
controllers/
models/
middleware/
```

This separation keeps HTTP routing, business logic, database models, and authentication concerns easier to maintain.

---

# Authentication Architecture

The authentication middleware reads:

```text
Authorization: Bearer <JWT>
```

The middleware then:

1. Extracts the token.
2. Verifies the token using `JWT_SECRET`.
3. Reads the `userId` from the decoded payload.
4. Finds the user in MongoDB.
5. Attaches the user to `req.user`.
6. Allows the protected controller to continue.

Invalid, missing, or expired authentication results in an unauthorized response.

---

# Data Modeling

One of the important design decisions was determining which data should be embedded and which should have its own collection.

## User-owned data

The following are embedded in `User`:

```text
wishlist
cart
addresses
```

These are closely associated with one user and are frequently accessed as part of the user's shopping session.

## Independent entities

Products and orders use separate collections:

```text
Product
Order
```

Products are shared resources referenced by users.

Orders represent historical transactional records and therefore deserve their own collection.

---

# Frontend State Management

The frontend uses multiple React contexts.

```text
AuthContext
ProductContext
SearchContext
WishlistContext
CartContext
AddressContext
OrderContext
```

`AppProvider` composes these providers.

Reducers handle state transitions for areas such as:

```text
Authentication
Cart
Orders
Addresses
Products
Wishlist
```

This approach provides predictable state transitions without adding Redux to the project.

---

# API Design

The API is organized around domain resources.

```text
/api/auth
/api/users
/api/products
/api/wishlist
/api/cart
/api/address
/api/orders
```

This keeps the backend resource-oriented and makes protected functionality easier to identify.

For example:

```text
/api/products
```

is responsible for product discovery, while:

```text
/api/cart
```

handles authenticated cart operations.

---

# Search and Filtering

Product discovery combines backend query parameters with frontend presentation logic.

The backend accepts:

```text
category
search
rating
sort
```

For example:

```text
GET /api/products?search=phone&rating=4&sort=lowToHigh
```

The backend can construct a MongoDB query based on the supplied parameters.

Search is performed against the product title, while rating filtering uses a minimum rating condition.

---

# Security Implementation

Security-related implementation includes:

### Password hashing

Passwords are hashed using bcrypt rather than storing plaintext passwords.

### JWT authentication

The backend uses signed JWTs with a configured expiration period.

### Protected resources

Private resources require a valid Bearer token.

### User-specific data

Cart, wishlist, addresses, and orders are associated with the authenticated user.

### Environment configuration

Sensitive configuration such as:

```text
MONGO_URI
JWT_SECRET
```

is loaded through environment variables.

---

# Engineering Decisions

## Embedded cart and wishlist

A separate Cart or Wishlist model was not necessary for the current application scope.

Embedding these references inside `User` simplifies user-specific retrieval and updates.

## Separate Order model

Orders are kept separate because they represent historical records rather than temporary shopping state.

## Context + Reducers

The project uses React's built-in state-management capabilities instead of introducing a larger state-management library.

## Generic API helper

The frontend contains a reusable API request layer responsible for:

* Base API configuration
* JSON requests
* Authorization headers
* API errors

This avoids duplicating request logic throughout the application.

---

# Challenges and Lessons

## 1. Authentication boundaries

Building authentication required coordinating three layers:

```text
Login UI
   ↓
JWT storage
   ↓
Protected API
```

A token alone is not enough. The backend must validate it on every protected request.

---

## 2. User-specific MongoDB data

Cart, wishlist, and addresses belong to a specific user.

Embedding these structures in the user document simplified the initial architecture while still allowing authenticated CRUD operations.

---

## 3. Frontend/backend responsibility

The project demonstrates why frontend state and backend persistence must be clearly separated.

For example, the current checkout UI creates local order state, while the backend already provides persistent order APIs.

The next step is to connect these two layers so that:

```text
Checkout
  ↓
POST /api/orders
  ↓
MongoDB Order
  ↓
Order History
```

becomes the actual production flow.

---

# Current Limitations

The current project does not yet implement:

* Payment gateway integration
* Product pagination
* Admin dashboard
* Product administration
* Payment verification
* Complete inventory reservation
* Product review system
* Frontend-to-backend order integration
* Automated test suite
* Production-grade rate limiting
* Strict CORS allowlisting

These are planned engineering extensions rather than features currently claimed as implemented.

---

# Future Architecture

A more complete production version could evolve toward:

```text
                         ┌───────────────┐
                         │    React      │
                         └───────┬───────┘
                                 │
                                 ▼
                         ┌───────────────┐
                         │ API Gateway   │
                         └───────┬───────┘
                                 │
                 ┌───────────────┼───────────────┐
                 ▼               ▼               ▼
          Authentication      Products        Orders
                 │               │               │
                 └───────────────┼───────────────┘
                                 ▼
                           MongoDB
                                 │
                 ┌───────────────┼───────────────┐
                 ▼               ▼               ▼
             Inventory        Payments       Analytics
```

Possible future improvements include:

* Payment provider integration
* Inventory reservation
* Admin APIs
* Product pagination
* Order status management
* Refresh-token authentication
* API validation
* Rate limiting
* Automated testing
* Cloud image storage
* Caching
* Monitoring and logging

---

# Tech Stack

| Layer             | Technology             |
| ----------------- | ---------------------- |
| Frontend          | React                  |
| Build Tool        | Vite                   |
| Routing           | React Router           |
| UI                | Bootstrap              |
| State             | Context API + Reducers |
| Backend           | Node.js + Express.js   |
| Database          | MongoDB                |
| ODM               | Mongoose               |
| Authentication    | JWT                    |
| Password Security | bcrypt                 |
| Notifications     | React Toastify         |
| Icons             | Bootstrap Icons        |

---

# What This Project Demonstrates

Trendora demonstrates practical experience with:

* Full-stack MERN architecture
* React application structure
* REST API development
* JWT authentication
* Express middleware
* MongoDB schema design
* Mongoose
* Embedded documents
* Protected routes
* Search and filtering
* Context API
* Reducer-based state management
* Frontend/backend separation
* Environment configuration
* E-commerce domain modeling
* Cart and wishlist workflows
* Order data modeling

---

# Project Links

* Live Application: https://mern-shopping-site-43xo.vercel.app/
* GitHub Repository: https://github.com/sunny-raj-sah/MERN-Shopping-Site.git

---

# Conclusion

Trendora was built as a practical full-stack e-commerce system rather than only a frontend shopping interface.

The project covers the complete development path from:

```text
React UI
   ↓
Frontend State
   ↓
REST API
   ↓
Authentication Middleware
   ↓
Express Controllers
   ↓
Mongoose
   ↓
MongoDB
```

The project also exposes an important real-world engineering lesson: implementing backend capabilities and integrating them completely into the frontend are separate tasks. The existing order APIs provide the foundation for persistent order management, while connecting the current checkout flow to those APIs is the next architectural step.
