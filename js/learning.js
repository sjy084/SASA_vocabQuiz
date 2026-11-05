// Chapter boundaries follow the source order; only question order is shuffled.
function getLearningChapters(words = getWordSet().words) {
  const chapters = [];
  for (let offset = 0; offset < words.length; offset += 10) {
    chapters.push({ index: chapters.length, start: offset + 1, words: words.slice(offset, offset + 10) });
  }
  return chapters;
}

function getLearningModes(value) {
  return [...new Set(value.split(',').filter(mode => ['en-ko', 'ko-en', 'synonym'].includes(mode)))];
}

function canLearnWord(word, modes) {
  return modes.some(mode => mode !== 'synonym' || word.synonyms?.length > 0);
}

function shuffleLearningItems(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function makeLearningQuestion(word, modes) {
  const available = modes.filter(mode => canLearnWord(word, [mode]));
  const mode = available[Math.floor(Math.random() * available.length)];
  if (mode === 'en-ko') return { word, question: word.term, answers: word.meaning, badge: '영어 → 한국어' };
  if (mode === 'ko-en') return {
    word, question: word.meaning.join(', '), answers: [word.term, ...(word.synonyms || [])], badge: '한국어 → 영어'
  };
  const terms = [word.term, ...word.synonyms];
  const index = Math.floor(Math.random() * terms.length);
  return { word, question: terms[index], answers: terms.filter((_, i) => i !== index), badge: '유사어 (영어 → 영어)' };
}

class LearningSession {
  constructor(items, shuffle = shuffleLearningItems) {
    if (!items.length) throw new Error('학습할 단어가 없습니다.');
    this.shuffle = shuffle;
    this.queue = shuffle(items);
    this.total = items.length;
    this.index = 0;
    this.round = 1;
    this.missed = [];
    this.mastered = 0;
    this.attempts = 0;
    this.awaitingAdvance = false;
    this.completed = false;
  }

  get current() { return this.queue[this.index]; }

  recordAnswer(correct) {
    if (this.completed || this.awaitingAdvance) return false;
    if (correct) this.mastered++;
    else this.missed.push(this.current);
    this.attempts++;
    this.awaitingAdvance = true;
    return true;
  }

  advance() {
    if (this.completed || !this.awaitingAdvance) return;
    this.awaitingAdvance = false;
    this.index++;
    if (this.index < this.queue.length) return;
    if (this.missed.length) {
      this.queue = this.shuffle(this.missed);
      this.missed = [];
      this.index = 0;
      this.round++;
    } else {
      this.completed = true;
    }
  }
}
