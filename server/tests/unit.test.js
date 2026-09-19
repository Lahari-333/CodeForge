const { normalizeOutput, compareOutputs } = require('../src/utils/outputNormalizer');
const { LANGUAGE_CONFIGS, SUPPORTED_LANGUAGES, EXECUTION_STATUS } = require('../src/config/constants');

describe('Unit Tests: Output Normalizer & Execution Config', () => {
  test('normalizeOutput handles CRLF, trailing spaces, and blank lines', () => {
    const raw = "  hello world   \r\nline two   \r\n\r\n";
    const expected = "hello world\nline two";
    expect(normalizeOutput(raw)).toBe(expected);
  });

  test('compareOutputs returns true for equivalent outputs with different line endings', () => {
    const output1 = "42\r\n100\r\n";
    const output2 = "42\n100";
    expect(compareOutputs(output1, output2)).toBe(true);
  });

  test('compareOutputs returns false for different values', () => {
    const output1 = "42\n";
    const output2 = "43\n";
    expect(compareOutputs(output1, output2)).toBe(false);
  });

  test('supported languages include java, python, cpp', () => {
    expect(SUPPORTED_LANGUAGES).toEqual(['java', 'python', 'cpp']);
    expect(LANGUAGE_CONFIGS.java.filename).toBe('Main.java');
    expect(LANGUAGE_CONFIGS.python.filename).toBe('main.py');
    expect(LANGUAGE_CONFIGS.cpp.filename).toBe('main.cpp');
  });

  test('execution statuses are all defined properly', () => {
    expect(EXECUTION_STATUS.SUCCESS).toBe('SUCCESS');
    expect(EXECUTION_STATUS.ACCEPTED).toBe('ACCEPTED');
    expect(EXECUTION_STATUS.WRONG_ANSWER).toBe('WRONG_ANSWER');
    expect(EXECUTION_STATUS.COMPILATION_ERROR).toBe('COMPILATION_ERROR');
    expect(EXECUTION_STATUS.RUNTIME_ERROR).toBe('RUNTIME_ERROR');
    expect(EXECUTION_STATUS.TIME_LIMIT_EXCEEDED).toBe('TIME_LIMIT_EXCEEDED');
    expect(EXECUTION_STATUS.MEMORY_LIMIT_EXCEEDED).toBe('MEMORY_LIMIT_EXCEEDED');
    expect(EXECUTION_STATUS.OUTPUT_LIMIT_EXCEEDED).toBe('OUTPUT_LIMIT_EXCEEDED');
    expect(EXECUTION_STATUS.SYSTEM_ERROR).toBe('SYSTEM_ERROR');
  });
});
