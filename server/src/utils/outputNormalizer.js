/**
 * Normalizes output strings for consistent comparison.
 * - Converts CRLF and CR to LF
 * - Trims trailing whitespace from each line
 * - Trims leading and trailing whitespace/newlines from the whole output
 */
const normalizeOutput = (str) => {
  if (typeof str !== 'string') {
    return '';
  }

  return str
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')
    .trim();
};

/**
 * Compares actual execution output with expected test case output.
 * Returns true if both match after normalization.
 */
const compareOutputs = (actual, expected) => {
  const normActual = normalizeOutput(actual);
  const normExpected = normalizeOutput(expected);
  return normActual === normExpected;
};

module.exports = {
  normalizeOutput,
  compareOutputs
};
