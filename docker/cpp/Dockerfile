# C++ Execution Sandbox for CodeForge
FROM alpine:3.19

# Install g++, gcc, and standard library headers
RUN apk add --no-cache g++ gcc musl-dev libstdc++

# Security: Create non-root user
RUN addgroup -S runner && adduser -S runner -G runner -u 1001

# Create workspace directory
WORKDIR /workspace
RUN chown -R runner:runner /workspace

# Switch to non-root user
USER runner

CMD ["sh"]
