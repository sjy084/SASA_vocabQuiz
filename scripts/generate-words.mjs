import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

// Keep the text file as the source; generate browser data for file:// and hosting.
export function parseWords(text) {
  const words = text.split(/\r?\n/).flatMap((raw, index) => {
    const line = raw.trim();
    if (!line || /^=+$/.test(line)) return [];
    const separator = line.indexOf(':');
    if (separator < 1) throw new Error(`Invalid word entry on line ${index + 1}`);
    const terms = line.slice(0, separator).split(',').map(value => value.trim()).filter(Boolean);
    const meaning = line.slice(separator + 1).split(/[,;]/).map(value => value.trim()).filter(Boolean);
    if (!terms.length || !meaning.length) throw new Error(`Missing word or meaning on line ${index + 1}`);
    return [{ term: terms[0], meaning, synonyms: terms.slice(1) }];
  });
  if (!words.length) throw new Error('The word list is empty');
  if (new Set(words.map(word => word.term)).size !== words.length) throw new Error('Duplicate word entries');
  return words;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const text = await readFile(new URL('../words/test_word', import.meta.url), 'utf8');
  const words = parseWords(text);
  const output = '// Generated from words/test_word by scripts/generate-words.mjs.\n'
    + `const WORD_SETS = ${JSON.stringify({ quiz2: { name: 'quiz2', words } }, null, 2)};\n`;
  await writeFile(new URL('../words/quiz2.js', import.meta.url), output);
  console.log(`Generated quiz2: ${words.length} entries`);
}
