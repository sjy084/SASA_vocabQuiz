let practiceSession;
let practiceChapter;
let practiceModes;
let practiceTimer = null;

function updateLearningProgress() {
  const { mastered, total } = practiceSession;
  document.getElementById('mastery-count').textContent = `${mastered} / ${total}개 맞힘`;
  document.getElementById('progress').style.width = `${mastered / total * 100}%`;
  document.getElementById('mastery-progress').setAttribute('aria-valuenow', mastered);
  document.getElementById('mastery-progress').setAttribute('aria-valuemax', total);
}

function showLearningQuestion() {
  updateLearningProgress();
  if (practiceSession.completed) {
    document.getElementById('practice-panel').hidden = true;
    document.getElementById('completion-panel').hidden = false;
    document.getElementById('round-status').textContent = '모든 단어를 맞혔어요. 다음 챕터를 학습해볼까요?';
    document.getElementById('completion-title').textContent = `챕터 ${practiceChapter.index + 1} 학습 완료!`;
    document.getElementById('completion-detail').textContent =
      `${practiceSession.total}개 단어를 모두 맞혔습니다. 총 ${practiceSession.round}라운드, ${practiceSession.attempts}문제를 풀었어요.`;
    const nextChapter = getLearningChapters()[practiceChapter.index + 1];
    const next = document.getElementById('next-chapter');
    if (nextChapter && nextChapter.words.some(word => canLearnWord(word, practiceModes))) {
      next.hidden = false;
      next.textContent = `다음 챕터 ${nextChapter.index + 1} 학습`;
      next.href = `practice.html?${new URLSearchParams({ chapter: String(nextChapter.index), mode: practiceModes.join(',') })}`;
    }
    document.getElementById('completion-title').focus();
    return;
  }
  const item = practiceSession.current;
  document.getElementById('round-status').textContent = practiceSession.round === 1
    ? '1라운드 · 먼저 챕터의 단어를 한 번씩 풀어보세요.'
    : `${practiceSession.round}라운드 · 틀렸던 ${practiceSession.queue.length}개 단어를 다시 풀어요.`;
  document.getElementById('counter').textContent = `${practiceSession.index + 1} / ${practiceSession.queue.length}`;
  document.getElementById('mode-badge').textContent = item.badge;
  document.getElementById('question').textContent = item.question;
  const input = document.getElementById('answer');
  input.value = '';
  input.disabled = false;
  document.getElementById('submit-btn').textContent = '확인';
  document.getElementById('skip-btn').disabled = false;
  document.getElementById('result').replaceChildren();
  input.focus();
}

function answerLearningQuestion(dontKnow = false) {
  if (!practiceSession || practiceSession.completed || practiceSession.awaitingAdvance) return;
  const input = document.getElementById('answer');
  const value = input.value.trim();
  if (!value && !dontKnow) {
    input.focus();
    return;
  }
  const answers = practiceSession.current.answers;
  const correct = !dontKnow && answers.flatMap(expandAnswers)
    .some(answer => answer.toLowerCase() === value.toLowerCase());
  practiceSession.recordAnswer(correct);
  input.disabled = true;
  document.getElementById('skip-btn').disabled = true;
  document.getElementById('submit-btn').textContent = '다음';
  const feedback = document.createElement('div');
  feedback.className = `${correct ? 'result-correct' : 'result-wrong'} learning-answer`;
  feedback.textContent = answers.join(', ');
  document.getElementById('result').replaceChildren(feedback);
  updateLearningProgress();
  if (correct) practiceTimer = setTimeout(advanceLearningQuestion, 2000);
  document.getElementById('submit-btn').focus();
}

function advanceLearningQuestion() {
  if (!practiceSession || practiceSession.completed || !practiceSession.awaitingAdvance) return;
  if (practiceTimer !== null) clearTimeout(practiceTimer);
  practiceTimer = null;
  practiceSession.advance();
  showLearningQuestion();
}

window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const chapterValue = params.get('chapter');
  const chapterIndex = chapterValue !== null && /^\d+$/.test(chapterValue) ? Number(chapterValue) : -1;
  practiceChapter = getLearningChapters()[chapterIndex];
  practiceModes = getLearningModes(params.get('mode') || 'en-ko');
  if (!practiceChapter || !practiceModes.length) {
    document.getElementById('practice-panel').hidden = true;
    document.getElementById('practice-error').textContent = '챕터와 문제 방향을 다시 선택해주세요.';
    return;
  }
  const words = practiceChapter.words.filter(word => canLearnWord(word, practiceModes));
  if (!words.length) {
    document.getElementById('practice-panel').hidden = true;
    document.getElementById('practice-error').textContent = '이 챕터에는 선택한 방향으로 학습할 단어가 없습니다. 다른 챕터나 방향을 선택해주세요.';
    return;
  }
  practiceSession = new LearningSession(words.map(word => makeLearningQuestion(word, practiceModes)));
  document.getElementById('chapter-title').textContent = `챕터 ${practiceChapter.index + 1} 학습`;
  document.getElementById('answer-form').addEventListener('submit', event => {
    event.preventDefault();
    if (event.isComposing) return;
    if (practiceSession.awaitingAdvance) advanceLearningQuestion();
    else answerLearningQuestion();
  });
  document.getElementById('answer').addEventListener('keydown', event => {
    if (event.key === 'Enter' && event.isComposing) event.preventDefault();
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Enter' || event.isComposing || practiceSession.completed || !practiceSession.awaitingAdvance) return;
    event.preventDefault();
    if (!event.repeat) advanceLearningQuestion();
  });
  document.getElementById('skip-btn').addEventListener('click', () => answerLearningQuestion(true));
  window.addEventListener('pagehide', () => clearTimeout(practiceTimer));
  showLearningQuestion();
});
