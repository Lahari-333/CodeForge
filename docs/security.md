# CodeForge Security & Sandboxing Architecture

Executing untrusted code submitted by anonymous or authenticated users over the web is inherently risky. CodeForge implements multi-layered isolation principles to prevent sandbox escapes, resource exhaustion, host inspection, and network abuse.

---

## 1. Why Arbitrary Code Cannot Run on the Host
If arbitrary user code were executed directly using Node.js `child_process.exec()` on the host:
* A user could inspect and steal environment files (`.env`), database passwords, and JWT secret keys.
* A user could access or drop the MySQL database.
* A user could launch infinite fork bombs (`:(){ :|:& };:`) or infinite loops, consuming 100% host CPU and memory.
* A user could install backdoors, download malicious binaries, or participate in distributed denial of service (DDoS) attacks.

Therefore, **CodeForge never runs untrusted code directly on the host machine.** All code is executed inside ephemeral Docker containers.

---

## 2. Implemented Sandbox Protections

| Protection | Implementation | Threat Mitigated |
| :--- | :--- | :--- |
| **Network Isolation** | `--network none` | Prevents outbound malware downloads, data exfiltration, and socket scanning |
| **Memory Limitation** | `-m 128m --memory-swap 128m` | Prevents RAM exhaustion; triggers SIGKILL (Exit code 137) converted to `MEMORY_LIMIT_EXCEEDED` |
| **CPU Quotas** | `--cpus 0.5` | Throttles CPU consumption to at most half a core per execution |
| **Process / Fork Limits** | `--pids-limit 64` | Completely neutralizes fork bombs and thread starvation attacks |
| **Non-Root Execution** | Dockerfiles define user `runner` (uid 1001) | Restricts container root filesystem access and privilege escalation |
| **Mount Isolation** | Mounts *only* ephemeral `temp-exec/<uuid>` | Host root filesystem, system files, and Docker socket are never mounted |
| **Secret Isolation** | No environment variables passed to `docker run` | Container has zero access to database credentials or `.env` |
| **Watchdog Timeout** | 5000ms wall-clock timer + `docker kill` | Prevents infinite loops (`while True: pass`) |
| **Output Truncation** | 64 KB max stdout/stderr buffer | Prevents terminal freezing and buffer exhaustion attacks |
| **Automatic Cleanup** | `--rm` flag + `fs.rmSync()` in `finally` block | Leaves zero lingering containers or temporary files |

---

## 3. Web & Application Security

* **Password Security:** Passwords hashed with `bcryptjs` using a salt work factor of 10. Plaintext passwords are never logged or stored.
* **SQL Injection Prevention:** All database operations use MySQL prepared statements with parameterized inputs via `mysql2/promise`.
* **JWT Integrity:** Tokens are signed using HMAC-SHA256 with a long random secret key. Expired tokens are rejected.
* **Server-Side RBAC:** Admin endpoints require explicit server-side role verification (`req.user.role === 'ADMIN'`). Client-side UI hiding is never solely relied upon.
* **Hidden Test Case Secrecy:** When fetching problem details, `test_cases` are filtered with `is_sample = TRUE`. Hidden inputs and expected outputs are never delivered to the client.
* **Diagnostic Sanitization:** Unhandled database exceptions or internal stack traces are caught by `error.middleware.js` and scrubbed before responding to clients.

---

## 4. Local Development Sandbox Limitations

While the implemented configuration represents practical best-practices for local developer environments, honest limitations must be documented:
1. **Host-Level Kernel Sharing:** Docker containers on Linux share the host Linux kernel. In a production cloud deployment (e.g. AWS or GCP), multi-tenant code platforms typically employ micro-VM virtualization like AWS Firecracker or Google gVisor (`runsc`) for hardware-level isolation.
2. **Local Windows Docker Architecture:** On Windows, Docker Desktop operates via a WSL2 virtual machine.
3. **Availability Fallback:** If Docker Desktop is offline on the server host, the execution manager gracefully reports `SYSTEM_ERROR: Docker execution engine is unavailable. Docker is either not installed or Docker Desktop daemon is not running on the server host`, preserving API stability without crashing.
