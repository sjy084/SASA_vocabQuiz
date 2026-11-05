import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = path => readFileSync(resolve(root, path), 'utf8');
const context = vm.createContext({});
for (const path of ['words/quiz2.js', 'js/common.js', 'js/learning.js']) vm.runInContext(read(path), context);
const api = vm.runInContext('({ getWordSet, getLearningChapters, getLearningModes, canLearnWord, makeLearningQuestion, LearningSession })', context);
const words = api.getWordSet().words;
const chapters = api.getLearningChapters();
assert.equal(chapters.length, 5);
assert.equal(chapters[0].words[0], words[0]);
assert.equal(chapters[1].words[0], words[10]);
assert.deepEqual(Array.from(chapters).flatMap(chapter => [...chapter.words]), [...words]);
assert.equal(api.getLearningChapters(words.slice(0, 23))[2].words.length, 3);

const items = [...chapters[0].words];
const session = new api.LearningSession(items, values => [...values]);
const missed = [items[1], items[7]];
for (let i = 0; i < 10; i++) {
  assert.equal(session.current, items[i]);
  assert(session.recordAnswer(!missed.includes(items[i])));
  assert.equal(session.recordAnswer(true), false);
  session.advance();
}
assert.equal(session.mastered, 8);
assert.equal(session.round, 2);
assert.equal(session.completed, false);
assert.deepEqual(session.queue, missed);
// Repeated failure must never complete the chapter or introduce passed words.
for (let round = 0; round < 5; round++) {
  for (const word of missed) {
    assert.equal(session.current, word);
    session.recordAnswer(false);
    session.advance();
  }
  assert.equal(session.completed, false);
  assert.equal(session.mastered, 8);
}
session.recordAnswer(true);
session.advance();
session.recordAnswer(false);
session.advance();
assert.equal(session.queue.length, 1);
assert.equal(session.current, missed[1]);
session.recordAnswer(true);
session.advance();
assert.equal(session.completed, true);
assert.equal(session.mastered, 10);
assert.equal(session.recordAnswer(false), false);
assert.throws(() => new api.LearningSession([]));

for (const chapter of chapters) {
  for (const mode of ['en-ko', 'ko-en', 'synonym', 'en-ko,ko-en,synonym']) {
    const modes = api.getLearningModes(mode);
    const eligible = chapter.words.filter(word => api.canLearnWord(word, modes));
    if (!eligible.length) continue;
    const questions = eligible.map(word => api.makeLearningQuestion(word, modes));
    assert(questions.every(item => item.question && item.answers.length));
    const pass = new api.LearningSession(questions);
    for (let index = 0; index < questions.length; index++) { pass.recordAnswer(true); pass.advance(); }
    assert.equal(pass.completed, true);
  }
}
const synonyms = api.makeLearningQuestion(words.find(word => word.term === 'remarkable'), ['ko-en']);
assert(synonyms.answers.includes('notable'));
for (const page of ['learn', 'practice']) {
  for (const match of read(`${page}.html`).matchAll(/(?:src|href)="([^"#]+)"/g)) {
    if (!/^[a-z]+:/i.test(match[1])) assert(existsSync(resolve(root, match[1])));
  }
}
assert(!read('js/practice.js').includes('localStorage.setItem'));
console.log('PASS: fixed chapters, final partial chapter, repeated error rounds, completion gating, modes, asset paths, test storage isolation.');
