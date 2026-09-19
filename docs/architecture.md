# CodeForge System Architecture

CodeForge is a full-stack, secure online code execution and competitive programming platform. It is engineered to allow developers to write, test, execute, and submit code in multiple programming languages (Python, Java, and C++) inside isolated containerized environments.

---

## 1. High-Level Architecture Diagram

```mermaid
flowchart TD
    subgraph ClientLayer ["Client Layer (React + Vite)"]
        UI["Modern Dark Developer UI (Tailwind CSS)"]
        Monaco["Monaco Code Editor"]
        Router["React Router v6"]
        AxiosClient["Axios HTTP Client + JWT Interceptors"]
    end

    subgraph ServerLayer ["Backend API Layer (Node.js + Express)"]
        ExpressApp["Express.js Server"]
        AuthMid["JWT Authentication & RBAC Middleware"]
        Validators["Input Validation Layer"]
        Controllers["REST Controllers"]
        Services["Business Services (Auth, Problem, Submission, User)"]
    end

    subgraph SandboxLayer ["Execution Sandbox Layer (Docker)"]
        ExecMgr["Docker Execution Manager"]
        TempWorkspace["Ephemeral Host Workspace (temp-exec/)"]
        DockerCLI["Docker Engine (docker run / kill / rm)"]
        JavaBox["codeforge-java Sandbox (Temurin 17 Alpine)"]
        PyBox["codeforge-python Sandbox (Python 3.11 Alpine)"]
        CppBox["codeforge-cpp Sandbox (GCC 13 Alpine)"]
    end

    subgraph DatabaseLayer ["Database Layer (MySQL 8.0)"]
        UsersTab["users"]
        ProblemsTab["problems"]
        TestCasesTab["test_cases (sample + hidden)"]
        SubmissionsTab["submissions"]
        ExecHistoryTab["execution_history"]
    end

    ClientLayer -->|HTTP / REST API (JWT)| ExpressApp
    ExpressApp --> AuthMid
    AuthMid --> Validators
    Validators --> Controllers
    Controllers --> Services
    Services -->|mysql2 connection pool| DatabaseLayer
    Services -->|Spawn & Monitor| ExecMgr
    ExecMgr --> TempWorkspace
    ExecMgr --> DockerCLI
    DockerCLI --> JavaBox
    DockerCLI --> PyBox
    DockerCLI --> CppBox
```

---

## 2. Component Descriptions

### 2.1 Client Layer
* **React 18 & Vite:** Fast build system and reactive UI rendering.
* **Monaco Editor:** High-performance web-based code editor providing syntax highlighting, bracket matching, auto-indentation, and dark theme support (`vs-dark`).
* **Tailwind CSS:** Dark developer-focused palette (`#07090E`, `#0E1524`, `#1F2937`) with responsive layouts, customizable status indicators, and clean typography.
* **Recharts:** Interactive SVG charts visualizing daily submission volume, success rates, and difficulty breakdowns.
* **Context Providers:**
  * `AuthContext`: Centralized authentication state, persistent JWT session management, user profile data, and role privileges.
  * `ToastContext`: Dynamic, auto-dismissing feedback notifications for execution states and error warnings.

### 2.2 Backend API Layer
* **Express.js Framework:** Clean modular routing, centralized error handling, and structured request/response pipelines.
* **Security & Hardening:**
  * `helmet`: Configures secure HTTP response headers.
  * `cors`: Restricts cross-origin resource sharing to trusted origins.
  * Input Validators: Deep validation for code size (max 64KB), language enum, problem properties, and credentials.
* **JWT & bcryptjs:** Cryptographically strong password hashing (10 salt rounds) and HMAC-SHA256 tokens with configurable expirations.
* **RBAC (Role-Based Access Control):** Server-side enforcement distinguishing standard `USER` accounts from administrative `ADMIN` accounts.

### 2.3 Execution Sandbox Layer
* **Non-Root Docker Containers:** Executes untrusted user code inside ephemeral containers.
* **Strict Resource Limiting:**
  * **Memory:** 128 MB RAM (`-m 128m --memory-swap 128m`) to prevent memory exhaustion attacks.
  * **CPU:** 0.5 CPU quota (`--cpus 0.5`) to prevent CPU hogging.
  * **Process Limit:** Max 64 PIDs (`--pids-limit 64`) to neutralize fork bombs.
  * **Network Disabled:** `--network none` completely cuts off ingress and egress traffic.
  * **Timeout Watchdog:** 5000ms wall-clock timer with active `docker kill` enforcement.
  * **Output Truncation:** 64 KB output buffer cap to prevent terminal buffer overflows.

### 2.4 Database Layer
* **MySQL 8.0 InnoDB:** Relational consistency, foreign key constraints with `CASCADE` rules, and optimized indexes on slugs, difficulties, categories, and user queries.
