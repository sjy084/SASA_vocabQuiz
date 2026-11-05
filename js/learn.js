function selectedLearningModes() {
  return [...document.querySelectorAll('input[name="learn-mode"]:checked')].map(input => input.value);
}

function renderLearningChapters() {
  const modes = selectedLearningModes();
  const previous = document.querySelector('input[name="chapter"]:checked')?.value;
  const chapters = getLearningChapters();
  const container = document.getElementById('chapters');
  container.replaceChildren();
  document.getElementById('chapter-summary').textContent =
    `총 ${getWordSet().words.length}개 단어 · ${chapters.length}개 챕터 · 원본 순서대로 최대 10개씩`;
  for (const chapter of chapters) {
    const count = chapter.words.filter(word => canLearnWord(word, modes)).length;
    const label = document.createElement('label');
    label.className = `chapter-card${count ? '' : ' chapter-unavailable'}`;
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'chapter';
    radio.value = String(chapter.index);
    radio.disabled = count === 0;
    radio.checked = count > 0 && previous === radio.value;
    const heading = document.createElement('strong');
    heading.textContent = `챕터 ${chapter.index + 1}`;
    const range = document.createElement('span');
    range.textContent = `${chapter.start}–${chapter.start + chapter.words.length - 1}번 · ${count}개 학습 가능`;
    const preview = document.createElement('span');
    preview.className = 'chapter-preview';
    preview.textContent = chapter.words.map(word => word.term).join(' · ');
    label.append(radio, heading, range, preview);
    container.appendChild(label);
  }
  if (!document.querySelector('input[name="chapter"]:checked')) {
    const first = document.querySelector('input[name="chapter"]:not(:disabled)');
    if (first) first.checked = true;
  }
  const available = !!document.querySelector('input[name="chapter"]:checked');
  document.getElementById('start-learning').disabled = !available;
  document.getElementById('setup-message').textContent = !modes.length
    ? '문제 방향을 하나 이상 선택해주세요.'
    : !available ? '선택한 방향으로 학습할 수 있는 단어가 없습니다.' : '';
}

window.addEventListener('DOMContentLoaded', () => {
  renderLearningChapters();
  document.querySelectorAll('input[name="learn-mode"]').forEach(input =>
    input.addEventListener('change', renderLearningChapters)
  );
  document.getElementById('learning-form').addEventListener('submit', event => {
    event.preventDefault();
    const chapter = document.querySelector('input[name="chapter"]:checked');
    const modes = selectedLearningModes();
    if (!chapter || !modes.length) return;
    const params = new URLSearchParams({ chapter: chapter.value, mode: modes.join(',') });
    location.href = `practice.html?${params}`;
  });
});
