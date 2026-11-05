import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { parseWords } from './generate-words.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');

function openPage(script, saved = {}) {
  const elements = new Map();
  const listeners = {};
  const element = id => {
    if (!elements.has(id)) elements.set(id, {
      value: '', checked: false, disabled: false, textContent: '', innerHTML: '', style: {}, children: [],
      addEventListener() {}, focus() {}, appendChild(child) { this.children.push(child); }
    });
    return elements.get(id);
  };
  const context = vm.createContext({
    document: { getElementById: element, createElement: element, addEventListener() {} },
    window: { addEventListener: (name, fn) => { listeners[name] = fn; } },
    localStorage: {
      getItem: key => saved[key] ?? null,
      setItem: (key, value) => { saved[key] = String(value); },
      removeItem: key => { delete saved[key]; }
    },
    location: { href: '' }, alert: message => { throw new Error(message); },
    setTimeout: () => 1, clearTimeout() {}
  });
  for (const path of ['words/quiz2.js', 'js/common.js', `js/${script}.js`]) {
    vm.runInContext(read(path), context, { filename: path });
  }
  return { context, element, saved, run: code => vm.runInContext(code, context), init: () => listeners.DOMContentLoaded?.() };
}

for (const page of ['index', 'quiz', 'study', 'result']) {
  const html = read(`${page}.html`);
  for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    if (!/^[a-z]+:/i.test(match[1])) assert(existsSync(resolve(root, match[1])), `${page}: missing ${match[1]}`);
  }
  assert(!html.includes('legacy.js'));
}
assert.equal((read('index.html').match(/<option /g) || []).length, 1);
assert(read('index.html').includes('<option value="quiz2">quiz2</option>'));

const parsed = parseWords(read('words/test_word'));
assert.equal(parsed.length, 50);
assert.deepEqual(parsed.find(word => word.term === 'remarkable').synonyms, ['noticeable', 'notable']);
assert.throws(() => parseWords('bad entry'), /Invalid/);
assert.throws(() => parseWords('word: '), /Missing/);
assert.throws(() => parseWords('====\n'), /empty/);

const start = openPage('main');
assert.deepEqual(JSON.parse(start.run('JSON.stringify(getWordSet().words)')), parsed,
  'Generated data differs from words/test_word; run node scripts/generate-words.mjs');
start.element('mode-enko').checked = true;
start.run('startQuiz()');
assert.equal(start.saved.wordSet, 'quiz2');
assert.equal(start.context.location.href, 'quiz.html');
start.run('startStudy()');
assert.equal(start.context.location.href, 'study.html');

const study = openPage('study', { wordSet: 'superintelligence' });
study.init();
assert.equal(study.element('study-title').textContent, 'quiz2');
assert.equal(study.element('word-list').children.length, 50);

for (const mode of ['en-ko', 'ko-en', 'synonym', 'en-ko,ko-en,synonym']) {
  const quiz = openPage('quiz', { wordSet: 'superintelligence', mode });
  quiz.init();
  const count = quiz.run('quizData.words.length');
  assert.equal(count, mode === 'synonym' ? 1 : 50);
  for (let index = 0; index < count; index++) {
    quiz.element('answer').value = quiz.run('quizData.currentAnswers.at(-1)');
    quiz.run('handleSubmit()');
    assert(quiz.element('result').innerHTML.includes('result-correct'));
    quiz.run('checkAnswer()');
    assert.equal(quiz.run('quizData.wrongList.length'), 0);
    quiz.run('handleSubmit()');
  }
  assert.equal(quiz.saved.totalCount, String(count));
  assert.equal(quiz.saved.wrongCount, '0');
  assert.equal(quiz.saved.resultWordSet, 'quiz2');
  assert.equal(quiz.context.location.href, 'result.html');
}

const wrong = openPage('quiz', { wordSet: 'quiz2', mode: 'en-ko' });
wrong.init();
wrong.element('answer').value = '__wrong__';
wrong.run('handleSubmit(); checkAnswer()');
assert.equal(wrong.run('quizData.wrongList.length'), 1);
wrong.run('handleSubmit()');
for (let index = 1; index < 50; index++) {
  wrong.element('answer').value = wrong.run('quizData.currentAnswers[0]');
  wrong.run('handleSubmit(); handleSubmit()');
}
assert.equal(wrong.saved.wrongCount, '1');
const result = openPage('result', wrong.saved);
result.init();
assert.equal(result.element('retry-btn').style.display, 'flex');
result.run('retryWrong()');
assert.equal(result.saved.wordSet, 'retry_quiz2');
const retry = openPage('quiz', result.saved);
retry.init();
assert.equal(retry.run('quizData.words.length'), 1);
retry.element('answer').value = retry.run('quizData.currentAnswers[0]');
retry.run('handleSubmit(); handleSubmit()');
assert.equal(retry.saved.wrongCount, '0');

const stale = openPage('quiz', { wordSet: 'retry_123', mode: 'en-ko', wrongList: '[{"term":"old word"}]' });
stale.init();
assert.equal(stale.run('quizData.words.length'), 50);
const corrupt = openPage('result', { resultWordSet: 'quiz2', wrongList: '{' });
assert.equal(corrupt.run('getSavedWrongWords().length'), 0);
const parens = parsed.find(word => word.term === 'chunk').meaning[0];
assert.equal(start.run(`expandAnswers(${JSON.stringify(parens)}).length`), 3);
console.log('PASS: assets, 50 words, all modes, answer variants, results, retry, stale storage, duplicate submission.');
