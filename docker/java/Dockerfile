# Java Execution Sandbox for CodeForge
FROM eclipse-temurin:17-jdk-alpine

# Security: Create non-root user
RUN addgroup -S runner && adduser -S runner -G runner -u 1001

# Create workspace directory with restricted permissions
WORKDIR /workspace
RUN chown -R runner:runner /workspace

# Switch to non-root user
USER runner

CMD ["sh"]
