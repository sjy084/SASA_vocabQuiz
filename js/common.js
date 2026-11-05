// Shared vocabulary, answer matching, and review storage.
const ACTIVE_WORD_SET = 'quiz2';

function getWordSet() {
  return WORD_SETS[ACTIVE_WORD_SET];
}

function expandAnswers(answer) {
  const results = [
    answer.trim(),
    answer.replace(/\(.*?\)/g, '').trim(),
    answer.replace(/[()]/g, '').trim()
  ];
  return [...new Set(results.filter(Boolean))];
}

function getSavedWrongWords() {
  if (localStorage.getItem('resultWordSet') !== ACTIVE_WORD_SET) return [];
  try {
    const saved = JSON.parse(localStorage.getItem('wrongList') || '[]');
    if (!Array.isArray(saved)) return [];
    const terms = new Set(saved.map(word => word?.term));
    return getWordSet().words.filter(word => terms.has(word.term));
  } catch {
    return [];
  }
}
