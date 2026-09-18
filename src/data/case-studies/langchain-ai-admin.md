# LangChain AI Admin Query Assistant

## Project Overview

The **LangChain AI Admin Query Assistant** is an AI-powered administrative dashboard that allows authorized administrators to query student and academic data using natural language.

Instead of requiring administrators to write database queries or manually inspect datasets, the application provides a Streamlit interface where an administrator can ask questions such as:

```text
Which students haven't submitted their homework?
```

or:

```text
Show me average quiz scores by class
```

The application converts the natural-language request into an analysis over a pandas DataFrame through a LangChain-powered agent.

A key part of the system is **access control before AI processing**. Administrators are assigned specific grades, classes, and regions, and the application filters the dataset according to those permissions before passing the data to the AI query engine.

---

# Problem

Educational administrative data can contain a large amount of information about:

* Students
* Grades
* Classes
* Regions
* Homework submission
* Quiz scores
* Quiz dates
* Quiz names

Traditional data analysis requires administrators to understand the underlying data structure or manually filter records.

The goal of this project was to create a simpler interface where an administrator could ask questions in natural language while ensuring that the AI only operates on data within the administrator's authorized scope.

---

# Goals

The project was designed around five main goals:

1. Provide natural-language querying over structured student data.
2. Restrict data access based on administrator permissions.
3. Build a simple interactive dashboard using Streamlit.
4. Keep data loading, access control, and AI querying modular.
5. Add authentication so only authenticated users can access the dashboard.

---

# Core Features

## 1. Natural-Language Data Querying

The primary feature is the ability to ask questions about student data using normal language.

Examples include:

```text
Which students haven't submitted their homework?
```

```text
Show me average quiz scores by class
```

```text
Which students scored above 80?
```

```text
List quizzes scheduled after November 10
```

The application passes the filtered DataFrame to a LangChain pandas DataFrame agent.

The high-level flow is:

```text
Natural Language Question
          ↓
      QueryEngine
          ↓
LangChain DataFrame Agent
          ↓
      LLM Reasoning
          ↓
   DataFrame Analysis
          ↓
      Text Response
```

---

# 2. Access Control Before AI Processing

Access control is one of the most important architectural decisions in the application.

Each administrator has an access profile containing:

```text
allowed_grades
allowed_classes
allowed_regions
```

For example:

```json
{
  "admin_id": "A001",
  "admin_name": "Mrs. Gupta",
  "allowed_grades": [8],
  "allowed_classes": ["8A", "8B"],
  "allowed_regions": ["North"]
}
```

Another administrator can have a different scope:

```json
{
  "admin_id": "A002",
  "admin_name": "Mr. Verma",
  "allowed_grades": [9],
  "allowed_classes": ["9A"],
  "allowed_regions": ["South"]
}
```

The `AccessControl` class applies these restrictions to the complete student DataFrame.

```text
Complete Student Dataset
          ↓
     AccessControl
          ↓
 ┌────────┼─────────┐
 │        │         │
Grade   Class     Region
 │        │         │
 └────────┼─────────┘
          ↓
 Authorized Dataset
          ↓
      QueryEngine
```

This is important because the AI query engine receives the **filtered DataFrame**, rather than the complete dataset.

---

# 3. Defense-in-Depth Data Flow

The application follows this security-oriented sequence:

```text
User Authentication
        ↓
Authenticated Session
        ↓
Admin Access Profile
        ↓
AccessControl
        ↓
Filtered DataFrame
        ↓
LangChain Query Engine
        ↓
Natural Language Analysis
        ↓
Response
```

The access-control layer therefore sits before the AI analysis layer.

This design reduces the amount of data exposed to the AI agent and establishes a clear separation between authorization and query processing.

---

# 4. Streamlit Dashboard

The application is built using Streamlit.

The dashboard provides:

* Admin profile selection
* Access-scope information
* Accessible student count
* Example queries
* Natural-language query input
* AI-generated responses
* Filtered-data preview
* Query history
* Clear-history functionality
* Logout

The sidebar displays the administrator's current access scope:

```text
Grades
Classes
Regions
```

It also shows the number of records available within that scope.

---

# 5. Example Queries

The interface provides predefined examples to make the AI functionality easier to explore.

### Homework

```text
Which students haven't submitted their homework?
```

### Performance

```text
Show me average quiz scores by class
```

### Upcoming quizzes

```text
List quizzes scheduled after November 10
```

Users can also enter their own natural-language questions.

---

# 6. Query History

Each submitted query and its generated response are stored in Streamlit session state.

The application maintains:

```python
st.session_state.query_history
```

Each history item contains:

```text
query
response
```

The interface displays previous queries using expandable sections.

This allows an administrator to review previous analysis without immediately repeating the same request.

---

# 7. Accessible Data Preview

After access control is applied, the application displays the accessible record count.

The dashboard can also expose the filtered DataFrame through an expandable section.

This provides a useful transparency layer:

```text
Admin
  ↓
Access Scope
  ↓
Number of Accessible Records
  ↓
Filtered Data Preview
  ↓
AI Query
```

The administrator can therefore understand the data scope being analyzed.

---

# Architecture

The project follows a modular Python architecture.

```text
                         ┌─────────────────────┐
                         │     Streamlit UI     │
                         │       app.py         │
                         └──────────┬──────────┘
                                    │
                     ┌──────────────┼──────────────┐
                     │              │              │
                     ▼              ▼              ▼
               DataLoader     AccessControl    Auth Layer
                     │              │              │
                     ▼              ▼              ▼
              Student/Admin    Filtered Data   Authenticated
                  Data             │             Session
                                   │
                                   ▼
                            ┌───────────────┐
                            │  QueryEngine  │
                            └───────┬───────┘
                                    │
                                    ▼
                            LangChain Agent
                                    │
                                    ▼
                               ChatGroq
                                    │
                                    ▼
                              AI Response
```

---

# Project Structure

```text
LangChain-AI-Admin-Query-Assistant/
│
├── data/
│   ├── students_data.json
│   └── admins_data.json
│
├── src/
│   ├── app.py
│   ├── auth.py
│   ├── access_control.py
│   ├── data_loader.py
│   ├── query_engine.py
│   │
│   └── components/
│       └── auth_ui.py
│
├── requirements.txt
├── render.yaml
└── README.md
```

The application separates the major responsibilities instead of placing all logic inside the Streamlit entry point.

---

# Data Loading Layer

The `DataLoader` class handles reading the JSON datasets.

It loads:

```text
data/students_data.json
data/admins_data.json
```

Student data is converted into a pandas DataFrame:

```text
JSON
 ↓
Python objects
 ↓
pandas.DataFrame
```

The administrator dataset remains a collection of administrator profiles that can be selected by the application.

This abstraction also keeps the data source separate from the rest of the application.

---

# Student Data Model

The student dataset contains fields such as:

```text
student_id
student_name
grade
class
region
homework_submitted
quiz_score
quiz_date
quiz_name
```

For example:

```json
{
  "student_id": "S006",
  "student_name": "Ananya Gupta",
  "grade": 8,
  "class": "8A",
  "region": "North",
  "homework_submitted": true,
  "quiz_score": 94,
  "quiz_date": "2026-11-08",
  "quiz_name": "Math Quiz 2"
}
```

The structured format makes the data suitable for pandas-based analysis.

---

# Access Control Implementation

The `AccessControl` class receives an administrator profile.

It applies three independent filters.

## Grade

```python
filtered_df = filtered_df[
    filtered_df["grade"].isin(
        self.admin_profile["allowed_grades"]
    )
]
```

## Class

```python
filtered_df = filtered_df[
    filtered_df["class"].isin(
        self.admin_profile["allowed_classes"]
    )
]
```

## Region

```python
filtered_df = filtered_df[
    filtered_df["region"].isin(
        self.admin_profile["allowed_regions"]
    )
]
```

The result is the dataset that the administrator is allowed to analyze.

---

# AI Query Engine

The `QueryEngine` is responsible for translating the administrator's natural-language question into a DataFrame analysis.

The current implementation uses:

```text
LangChain
+
create_pandas_dataframe_agent
+
ChatGroq
+
Pandas DataFrame
```

The agent is initialized with the already-filtered DataFrame.

Conceptually:

```text
filtered_df
     ↓
QueryEngine
     ↓
Pandas DataFrame Agent
     ↓
ChatGroq
     ↓
DataFrame operations
     ↓
Natural-language response
```

The query engine also supplies the model with information about the DataFrame columns and a date context.

---

# LLM Integration

The current implementation uses `ChatGroq` through LangChain.

Configuration is loaded from environment variables:

```text
GROQ_MODEL
GROQ_API_KEY
```

The query engine configures the model with:

```text
temperature = 0
max_tokens = 800
```

A deterministic temperature is useful for data-analysis tasks where predictable responses are preferred.

The repository also contains an earlier OpenAI-based implementation in commented code, but the active query engine currently uses Groq.

---

# Authentication

The project was extended with a frontend authentication layer around the Streamlit application.

The authentication UI provides:

```text
Login
Sign Up
```

The authentication flow communicates with an external backend authentication API.

The backend returns a JWT after successful authentication.

The application stores the token in browser `localStorage`.

The authentication flow is:

```text
Login / Signup
      ↓
Authentication API
      ↓
JWT
      ↓
Browser localStorage
      ↓
Authenticated Streamlit session
      ↓
Admin Dashboard
```

Logout removes the stored authentication token and returns the user to the authentication interface.

The application prevents access to the main dashboard when the user is not authenticated.

---

# Why Authentication and Access Control Are Separate

The project contains two different security concerns.

### Authentication

Answers:

> "Who is allowed to enter the application?"

### Authorization / Access Control

Answers:

> "Which student data is this administrator allowed to analyze?"

The architecture separates these responsibilities:

```text
Authentication
     ↓
Authenticated User
     ↓
Admin Access Profile
     ↓
Authorization Filtering
     ↓
AI Data Query
```

This separation is important because being authenticated does not automatically mean that a user should have access to every dataset.

---

# Error Handling

The query engine wraps AI processing in exception handling.

If the agent fails while processing a request, the application returns an error message instead of terminating the dashboard.

The authentication UI also handles:

* Missing credentials
* Password mismatch
* Invalid login
* Authentication server connection failures
* Missing JWT responses
* Failed signup requests

This keeps failures visible to the user instead of exposing raw application crashes.

---

# Caching

The Streamlit application uses:

```python
@st.cache_resource
```

for the data-loading function.

This prevents the application from repeatedly loading the same JSON datasets on every Streamlit rerun.

The cached resource returns:

```text
students_df
admins_list
```

which can then be reused by the dashboard.

---

# Key Engineering Decisions

## 1. Filter Before AI Processing

The most important architectural decision is to apply access control before initializing the query engine.

Instead of:

```text
All Data
 ↓
AI
 ↓
Filter
```

the application uses:

```text
All Data
 ↓
Access Control
 ↓
Authorized Data
 ↓
AI
```

This makes the security boundary explicit.

---

## 2. Modular Data Loading

Data access is isolated in `DataLoader`.

This means the application does not need to know how JSON files are opened when performing access control or AI analysis.

The same interface can later be adapted to another data source.

---

## 3. Separate Query Engine

AI processing is encapsulated in `QueryEngine`.

The Streamlit UI therefore does not need to manage:

* LLM initialization
* LangChain agent creation
* DataFrame query execution
* AI exception handling

This keeps the UI layer simpler.

---

## 4. Session-Based Query History

Query history is maintained in Streamlit session state rather than being written to a permanent database.

This is appropriate for the current application scope while keeping the implementation simple.

---

# End-to-End Request Flow

Consider the query:

```text
Which students haven't submitted their homework?
```

The application processes it as follows:

```text
1. User authenticates
        ↓
2. Admin profile is selected
        ↓
3. AccessControl reads permissions
        ↓
4. Student DataFrame is filtered
        ↓
5. Filtered DataFrame is passed to QueryEngine
        ↓
6. LangChain creates the DataFrame analysis
        ↓
7. ChatGroq processes the query
        ↓
8. Agent performs the required DataFrame operation
        ↓
9. Response is returned
        ↓
10. Query + response are added to history
        ↓
11. Result is displayed in Streamlit
```

This flow demonstrates how authentication, authorization, data processing, and AI can be composed into one application.

---

# Deployment

The application includes a `render.yaml` configuration for deployment on Render.

The deployment configuration:

```text
Runtime: Python
Python Version: 3.11.11
Plan: Free
```

The application starts with:

```bash
streamlit run src/app.py --server.port=$PORT --server.address=0.0.0.0
```

Dependencies are installed from:

```text
requirements.txt
```

---

# Technology Stack

| Category             | Technology                   |
| -------------------- | ---------------------------- |
| Language             | Python                       |
| UI                   | Streamlit                    |
| AI Framework         | LangChain                    |
| LLM Integration      | LangChain ChatGroq           |
| Data Analysis        | Pandas                       |
| Numerical Processing | NumPy                        |
| Authentication       | JWT-based external auth flow |
| Browser Storage      | localStorage                 |
| Configuration        | python-dotenv                |
| Deployment           | Render                       |
| Data Source          | JSON                         |

---

# Challenges

## Natural-language data analysis

Users can ask questions in many different ways.

The query engine therefore needs to translate flexible language into operations over structured data.

LangChain's pandas DataFrame agent provides the abstraction required to connect the natural-language request with DataFrame operations.

---

## Access-controlled AI

Allowing an AI system to analyze unrestricted data would create an unnecessary data-exposure boundary.

The project addresses this by filtering the dataset first:

```text
Permissions
    ↓
Filtered DataFrame
    ↓
AI Agent
```

This was an important lesson in combining AI functionality with authorization logic.

---

## Streamlit rerun model

Streamlit applications rerun portions of the application when users interact with widgets.

The project therefore uses:

```text
st.session_state
```

for state that needs to survive reruns, including:

* Selected admin
* Query history
* Current query
* Authentication state

The application also uses caching for data loading.

---

# Current Limitations

The current implementation has several areas that can be improved.

### JSON data source

The application currently works with local JSON datasets.

A production version could use:

```text
PostgreSQL
MongoDB
```

or another managed database.

### AI agent execution

The current DataFrame agent uses:

```text
allow_dangerous_code=True
```

This is an important security consideration because arbitrary code execution capabilities should not be exposed without strong isolation in a production environment.

### Authentication architecture

Authentication is currently connected to an external backend while the Streamlit application handles the frontend/session side.

A production system could centralize authentication and authorization around a dedicated identity service.

### Query persistence

Query history currently exists in Streamlit session state and is not persisted as long-term audit data.

### Static admin profiles

Administrator access scopes currently come from the admin dataset rather than a dedicated persistent authorization service.

---

# Future Improvements

Potential improvements include:

* Replace JSON with PostgreSQL or MongoDB
* Add persistent query history
* Add audit logging
* Add centralized role and permission management
* Add stronger input validation
* Add rate limiting
* Add production-grade authentication
* Add isolated/sandboxed AI execution
* Add CSV/PDF export
* Add analytics dashboards
* Add more complex educational queries
* Add database-backed reporting
* Add automated tests
* Add monitoring and application logging

---

# What This Project Demonstrates

This project demonstrates practical experience across both traditional software engineering and AI application development.

### Backend / Software Engineering

* Python application architecture
* Modular design
* Authentication
* JWT handling
* Access control
* Session management
* Error handling
* Environment configuration

### Data

* JSON data processing
* pandas DataFrames
* Data filtering
* Structured educational datasets
* Aggregation and analysis

### AI Engineering

* LangChain
* LLM integration
* Natural-language data querying
* DataFrame agents
* Prompt/context construction
* AI-assisted structured-data analysis

### Frontend

* Streamlit
* Interactive widgets
* Session state
* Query history
* Responsive authentication UI

---

# Key Takeaway

The main engineering concept demonstrated by this project is the combination of **authorization and AI data analysis**.

The system does not simply send the complete student dataset to an LLM.

Instead, it follows:

```text
                    User
                     ↓
              Authentication
                     ↓
             Admin Permission
                     ↓
              AccessControl
                     ↓
             Authorized Data
                     ↓
              LangChain Agent
                     ↓
                  LLM
                     ↓
             DataFrame Analysis
                     ↓
               AI Response
```

This architecture demonstrates an important principle for AI-powered applications:

> **AI should operate within the data boundaries established by the application's authorization layer.**

That separation makes the system easier to reason about and provides a foundation for replacing the current JSON datasets with a production database and expanding the authorization model in the future.
