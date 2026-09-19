const dotenv = require('dotenv');
dotenv.config();

const EXECUTION_LIMITS = {
  TIMEOUT_MS: parseInt(process.env.EXECUTION_TIMEOUT_MS, 10) || 5000,
  MEMORY_LIMIT: process.env.EXECUTION_MEMORY_LIMIT || '128m',
  CPU_LIMIT: process.env.EXECUTION_CPU_LIMIT || '0.5',
  PIDS_LIMIT: 64,
  MAX_OUTPUT_BYTES: parseInt(process.env.EXECUTION_MAX_OUTPUT_BYTES, 10) || 65536,
  MAX_CODE_BYTES: parseInt(process.env.EXECUTION_MAX_CODE_BYTES, 10) || 65536,
  CONTAINER_PREFIX: process.env.DOCKER_CONTAINER_PREFIX || 'codeforge-runner-'
};

const DOCKER_IMAGES = {
  java: process.env.DOCKER_IMAGE_JAVA || 'codeforge-java:latest',
  python: process.env.DOCKER_IMAGE_PYTHON || 'codeforge-python:latest',
  cpp: process.env.DOCKER_IMAGE_CPP || 'codeforge-cpp:latest'
};

const SUPPORTED_LANGUAGES = ['java', 'python', 'cpp'];

const LANGUAGE_CONFIGS = {
  java: {
    name: 'Java',
    extension: 'java',
    filename: 'Main.java',
    isCompiled: true,
    compileCmd: 'javac Main.java',
    runCmd: 'java -Xmx128m Main',
    starterCode: `public class Main {
    public static void main(String[] args) {
        // Read from standard input and write to standard output
        System.out.println("Hello, CodeForge!");
    }
}`
  },
  python: {
    name: 'Python',
    extension: 'py',
    filename: 'main.py',
    isCompiled: false,
    compileCmd: null,
    runCmd: 'python -u main.py',
    starterCode: `import sys

def main():
    # Read from standard input and write to standard output
    print("Hello, CodeForge!")

if __name__ == "__main__":
    main()`
  },
  cpp: {
    name: 'C++',
    extension: 'cpp',
    filename: 'main.cpp',
    isCompiled: true,
    compileCmd: 'g++ -O2 main.cpp -o main',
    runCmd: './main',
    starterCode: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // Read from standard input and write to standard output
    cout << "Hello, CodeForge!" << endl;
    return 0;
}`
  }
};

const EXECUTION_STATUS = {
  SUCCESS: 'SUCCESS',
  ACCEPTED: 'ACCEPTED',
  WRONG_ANSWER: 'WRONG_ANSWER',
  COMPILATION_ERROR: 'COMPILATION_ERROR',
  RUNTIME_ERROR: 'RUNTIME_ERROR',
  TIME_LIMIT_EXCEEDED: 'TIME_LIMIT_EXCEEDED',
  MEMORY_LIMIT_EXCEEDED: 'MEMORY_LIMIT_EXCEEDED',
  OUTPUT_LIMIT_EXCEEDED: 'OUTPUT_LIMIT_EXCEEDED',
  SYSTEM_ERROR: 'SYSTEM_ERROR'
};

const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

module.exports = {
  EXECUTION_LIMITS,
  DOCKER_IMAGES,
  SUPPORTED_LANGUAGES,
  LANGUAGE_CONFIGS,
  EXECUTION_STATUS,
  USER_ROLES
};
