export const LANGUAGES = [
  {
    id: 'python',
    name: 'Python',
    monacoLang: 'python',
    extension: 'py',
    version: '3.11',
    defaultCode: `import sys

def main():
    # Read input from standard input
    print("Hello, CodeForge!")

if __name__ == "__main__":
    main()`
  },
  {
    id: 'java',
    name: 'Java',
    monacoLang: 'java',
    extension: 'java',
    version: 'OpenJDK 17',
    defaultCode: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        // Read input from standard input
        System.out.println("Hello, CodeForge!");
    }
}`
  },
  {
    id: 'cpp',
    name: 'C++',
    monacoLang: 'cpp',
    extension: 'cpp',
    version: 'GCC 13 (C++17)',
    defaultCode: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);

    // Read input from standard input
    cout << "Hello, CodeForge!" << "\n";
    return 0;
}`
  }
];

export const STATUS_COLORS = {
  ACCEPTED: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400'
  },
  SUCCESS: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400'
  },
  WRONG_ANSWER: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    text: 'text-rose-400',
    dot: 'bg-rose-400'
  },
  COMPILATION_ERROR: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    dot: 'bg-amber-400'
  },
  RUNTIME_ERROR: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    dot: 'bg-orange-400'
  },
  TIME_LIMIT_EXCEEDED: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    dot: 'bg-yellow-400'
  },
  MEMORY_LIMIT_EXCEEDED: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    dot: 'bg-purple-400'
  },
  OUTPUT_LIMIT_EXCEEDED: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    dot: 'bg-amber-400'
  },
  SYSTEM_ERROR: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    text: 'text-red-400',
    dot: 'bg-red-400'
  }
};
