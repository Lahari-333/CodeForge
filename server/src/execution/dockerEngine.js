const { exec, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const {
  EXECUTION_LIMITS,
  DOCKER_IMAGES,
  LANGUAGE_CONFIGS,
  EXECUTION_STATUS
} = require('../config/constants');

// Base directory for temporary execution files
const TEMP_EXEC_DIR = path.resolve(__dirname, '../../temp-exec');

// Ensure base temp directory exists
if (!fs.existsSync(TEMP_EXEC_DIR)) {
  fs.mkdirSync(TEMP_EXEC_DIR, { recursive: true });
}

/**
 * Checks if the Docker CLI and daemon are responsive.
 */
const checkDockerAvailable = () => {
  return new Promise((resolve) => {
    exec('docker info', { timeout: 3000 }, (error) => {
      if (error) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

/**
 * Safe directory cleanup
 */
const cleanupDirectory = (dirPath) => {
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  } catch (err) {
    console.error(`Failed to clean up temp dir ${dirPath}:`, err.message);
  }
};

/**
 * Executes a shell command inside an isolated Docker container with strict resource limits.
 */
const runDockerCommand = ({
  image,
  containerName,
  hostWorkspaceDir,
  command,
  stdinContent = '',
  timeoutMs = EXECUTION_LIMITS.TIMEOUT_MS
}) => {
  return new Promise((resolve) => {
    let stdoutBuffer = '';
    let stderrBuffer = '';
    let isTimedOut = false;
    let isOutputExceeded = false;
    let timer = null;

    // Convert Windows backslashes to forward slashes for Docker volume mount
    const normalizedMountPath = hostWorkspaceDir.replace(/\\/g, '/');

    // Strict Docker security & resource isolation arguments
    const dockerArgs = [
      'run',
      '--name', containerName,
      '--network', 'none',                       // Disallow all outbound and inbound network access
      '--cpus', String(EXECUTION_LIMITS.CPU_LIMIT), // CPU limit (e.g. 0.5 CPU)
      '-m', EXECUTION_LIMITS.MEMORY_LIMIT,       // Memory limit (e.g. 128m)
      '--memory-swap', EXECUTION_LIMITS.MEMORY_LIMIT, // Prevent swap abuse
      '--pids-limit', String(EXECUTION_LIMITS.PIDS_LIMIT), // Prevent fork bombs
      '-i',                                      // Interactive for streaming stdin
      '-v', `${normalizedMountPath}:/workspace`, // Strictly mount temp workspace only
      '-w', '/workspace',
      '--rm',                                    // Auto-remove container on exit
      image,
      'sh', '-c', command
    ];

    const startTime = Date.now();

    const proc = spawn('docker', dockerArgs);

    // Timeout watchdog
    timer = setTimeout(() => {
      isTimedOut = true;
      // Force kill container via docker CLI
      exec(`docker kill ${containerName}`, () => {});
      proc.kill('SIGKILL');
    }, timeoutMs);

    // Feed stdin if provided
    if (stdinContent) {
      proc.stdin.write(stdinContent);
    }
    proc.stdin.end();

    proc.stdout.on('data', (data) => {
      const chunk = data.toString('utf8');
      if (Buffer.byteLength(stdoutBuffer + chunk, 'utf8') > EXECUTION_LIMITS.MAX_OUTPUT_BYTES) {
        isOutputExceeded = true;
        exec(`docker kill ${containerName}`, () => {});
        proc.kill('SIGKILL');
      } else {
        stdoutBuffer += chunk;
      }
    });

    proc.stderr.on('data', (data) => {
      const chunk = data.toString('utf8');
      if (Buffer.byteLength(stderrBuffer + chunk, 'utf8') > EXECUTION_LIMITS.MAX_OUTPUT_BYTES) {
        isOutputExceeded = true;
        exec(`docker kill ${containerName}`, () => {});
        proc.kill('SIGKILL');
      } else {
        stderrBuffer += chunk;
      }
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      const executionTime = Date.now() - startTime;
      resolve({
        exitCode: -1,
        stdout: stdoutBuffer,
        stderr: err.message,
        executionTime,
        isTimedOut: false,
        isOutputExceeded: false,
        systemError: true
      });
    });

    proc.on('close', (exitCode) => {
      clearTimeout(timer);
      const executionTime = Date.now() - startTime;

      resolve({
        exitCode,
        stdout: stdoutBuffer,
        stderr: stderrBuffer,
        executionTime,
        isTimedOut,
        isOutputExceeded,
        systemError: false
      });
    });
  });
};

/**
 * Main execution interface for running code in a secure Docker sandbox.
 */
const executeCode = async ({ language, code, stdin = '' }) => {
  const isAvailable = await checkDockerAvailable();

  if (!isAvailable) {
    return {
      status: EXECUTION_STATUS.SYSTEM_ERROR,
      stdout: '',
      stderr: 'Docker execution engine is unavailable. Docker is either not installed or Docker Desktop daemon is not running on the server host. Please ensure Docker Desktop is started to enable secure container execution.',
      executionTime: 0,
      memoryUsage: 0,
      errorDetails: 'Docker daemon unreachable'
    };
  }

  const langConfig = LANGUAGE_CONFIGS[language];
  if (!langConfig) {
    return {
      status: EXECUTION_STATUS.SYSTEM_ERROR,
      stdout: '',
      stderr: `Unsupported language: ${language}`,
      executionTime: 0,
      memoryUsage: 0
    };
  }

  const image = DOCKER_IMAGES[language];
  const execId = `${Date.now()}-${uuidv4().substring(0, 8)}`;
  const containerName = `${EXECUTION_LIMITS.CONTAINER_PREFIX}${execId}`;
  const workspaceDir = path.join(TEMP_EXEC_DIR, execId);

  try {
    // 1. Create temporary host workspace
    fs.mkdirSync(workspaceDir, { recursive: true });

    // 2. Write source file and input file
    const sourceFilePath = path.join(workspaceDir, langConfig.filename);
    fs.writeFileSync(sourceFilePath, code, 'utf8');
    const inputFilePath = path.join(workspaceDir, 'input.txt');
    fs.writeFileSync(inputFilePath, stdin || '', 'utf8');

    // 3. If compiled language, perform compilation step
    if (langConfig.isCompiled) {
      const compileRes = await runDockerCommand({
        image,
        containerName: `${containerName}-cmp`,
        hostWorkspaceDir: workspaceDir,
        command: langConfig.compileCmd,
        stdinContent: '',
        timeoutMs: 10000 // 10s compile timeout
      });

      if (compileRes.isTimedOut) {
        return {
          status: EXECUTION_STATUS.TIME_LIMIT_EXCEEDED,
          stdout: '',
          stderr: 'Compilation timed out.',
          executionTime: compileRes.executionTime,
          memoryUsage: 0
        };
      }

      if (compileRes.exitCode !== 0) {
        return {
          status: EXECUTION_STATUS.COMPILATION_ERROR,
          stdout: compileRes.stdout,
          stderr: compileRes.stderr || 'Compilation failed with unknown error.',
          executionTime: compileRes.executionTime,
          memoryUsage: 0
        };
      }
    }

    // 4. Execution Step
    const execRes = await runDockerCommand({
      image,
      containerName,
      hostWorkspaceDir: workspaceDir,
      command: `${langConfig.runCmd} < input.txt`,
      stdinContent: stdin,
      timeoutMs: EXECUTION_LIMITS.TIMEOUT_MS
    });

    if (execRes.isOutputExceeded) {
      return {
        status: EXECUTION_STATUS.OUTPUT_LIMIT_EXCEEDED,
        stdout: execRes.stdout,
        stderr: 'Standard output limit exceeded (64 KB). Output was truncated.',
        executionTime: execRes.executionTime,
        memoryUsage: 0
      };
    }

    if (execRes.isTimedOut) {
      return {
        status: EXECUTION_STATUS.TIME_LIMIT_EXCEEDED,
        stdout: execRes.stdout,
        stderr: `Time Limit Exceeded: Execution took longer than ${EXECUTION_LIMITS.TIMEOUT_MS / 1000} seconds.`,
        executionTime: execRes.executionTime,
        memoryUsage: 0
      };
    }

    // Exit code 137 typically indicates container killed by SIGKILL (e.g. OOM killer)
    if (execRes.exitCode === 137) {
      return {
        status: EXECUTION_STATUS.MEMORY_LIMIT_EXCEEDED,
        stdout: execRes.stdout,
        stderr: `Memory Limit Exceeded: Process exceeded memory limit of ${EXECUTION_LIMITS.MEMORY_LIMIT}.`,
        executionTime: execRes.executionTime,
        memoryUsage: 128
      };
    }

    if (execRes.exitCode !== 0) {
      return {
        status: EXECUTION_STATUS.RUNTIME_ERROR,
        stdout: execRes.stdout,
        stderr: execRes.stderr || `Process terminated with exit code ${execRes.exitCode}`,
        executionTime: execRes.executionTime,
        memoryUsage: 16
      };
    }

    return {
      status: EXECUTION_STATUS.SUCCESS,
      stdout: execRes.stdout,
      stderr: execRes.stderr,
      executionTime: execRes.executionTime,
      memoryUsage: 18
    };
  } catch (error) {
    return {
      status: EXECUTION_STATUS.SYSTEM_ERROR,
      stdout: '',
      stderr: `Internal execution error: ${error.message}`,
      executionTime: 0,
      memoryUsage: 0
    };
  } finally {
    // 5. Clean up temporary directory and container remnants
    cleanupDirectory(workspaceDir);
  }
};

module.exports = {
  checkDockerAvailable,
  executeCode,
  runDockerCommand
};
