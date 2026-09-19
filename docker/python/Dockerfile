# Python Execution Sandbox for CodeForge
FROM python:3.11-alpine

# Security: Create non-root user
RUN addgroup -S runner && adduser -S runner -G runner -u 1001

# Create workspace directory
WORKDIR /workspace
RUN chown -R runner:runner /workspace

# Switch to non-root user
USER runner

# Run Python unbuffered by default
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

CMD ["sh"]
