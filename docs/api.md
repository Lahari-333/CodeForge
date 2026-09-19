# CodeForge REST API Documentation

Base URL: `http://localhost:5000/api`

All responses adhere to the standard format:
```json
{
  "success": true,
  "message": "Status description",
  "data": { ... }
}
```
Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": { ... }
}
```

---

## 1. System & Health

### GET `/api/health`
Checks server status, MySQL connection, and Docker daemon readiness.

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-09-19T13:00:00.000Z",
  "services": {
    "api": "healthy",
    "database": "connected",
    "dockerEngine": "ready"
  }
}
```

---

## 2. Authentication

### POST `/api/auth/register`
Creates a new user account.

**Request Body:**
```json
{
  "name": "Jane Developer",
  "username": "janedev",
  "email": "jane@example.com",
  "password": "Password@123",
  "confirmPassword": "Password@123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user": { "id": 3, "name": "Jane Developer", "username": "janedev", "email": "jane@example.com", "role": "USER" },
    "token": "eyJhbGciOiJIUzI1NiIsIn..."
  }
}
```

### POST `/api/auth/login`
Authenticates a user by username or email.

**Request Body:**
```json
{
  "identifier": "janedev",
  "password": "Password@123"
}
```

### GET `/api/auth/me`
*Headers: `Authorization: Bearer <token>`*
Returns current authenticated user details.

---

## 3. Code Execution

### POST `/api/execute`
*Headers: Optional `Authorization: Bearer <token>`*
Executes arbitrary code against custom stdin inside an ephemeral Docker container.

**Request Body:**
```json
{
  "language": "python",
  "code": "import sys\nprint('Hello from CodeForge!')",
  "stdin": ""
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Execution completed.",
  "data": {
    "status": "SUCCESS",
    "stdout": "Hello from CodeForge!\n",
    "stderr": "",
    "executionTime": 24,
    "memoryUsage": 16
  }
}
```

---

## 4. Problems

### GET `/api/problems`
Query Parameters:
* `search`: string
* `difficulty`: `Easy` | `Medium` | `Hard` | `All`
* `category`: string
* `page`: integer (default: 1)
* `limit`: integer (default: 10)

### GET `/api/problems/:slug`
Fetches problem details. **Security note:** Only public sample test cases (`is_sample = TRUE`) are returned. Hidden evaluation test cases are strictly filtered out.

### POST `/api/problems` (Admin Only)
*Headers: `Authorization: Bearer <admin_token>`*
Creates a new coding problem with sample and hidden test cases.

### PUT `/api/problems/:id` (Admin Only)
Updates problem details.

### DELETE `/api/problems/:id` (Admin Only)
Deletes problem and cascades to test cases and submissions.

---

## 5. Submissions & Grading

### POST `/api/submissions/run-sample`
Runs code against the problem's public sample test cases. Returns detailed input, expected output, actual output, and pass/fail state for each sample case.

### POST `/api/submissions/submit`
*Headers: `Authorization: Bearer <token>`*
Submits code for evaluation against all test cases (both public sample and hidden edge cases).

**Request Body:**
```json
{
  "problemId": 1,
  "language": "python",
  "code": "class Solution: ..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Solution submitted successfully.",
  "data": {
    "id": 12,
    "status": "ACCEPTED",
    "executionTime": 18,
    "memoryUsage": 16,
    "passedTests": 5,
    "totalTests": 5,
    "errorMessage": null
  }
}
```

### GET `/api/submissions/my`
*Headers: `Authorization: Bearer <token>`*
Fetches paginated submission history for the authenticated user.

### GET `/api/submissions/:id`
*Headers: `Authorization: Bearer <token>`*
Fetches source code and details for a single submission. Non-admin users can only view their own submissions.

---

## 6. User Profile & Dashboard

### GET `/api/users/profile`
*Headers: `Authorization: Bearer <token>`*
Returns user statistics, problem solved breakdown (Easy, Medium, Hard), acceptance rate, and language distribution.

### GET `/api/users/dashboard`
*Headers: `Authorization: Bearer <token>`*
Returns summary cards, 7-day activity metrics for Recharts, recommended problems, and recent submissions.
