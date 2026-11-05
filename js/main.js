// main.js - 메인 페이지 스크립트

function startQuiz() {
  const wordSet = ACTIVE_WORD_SET;
  const modeEnKo = document.getElementById('mode-enko').checked;
  const modeKoEn = document.getElementById('mode-koen').checked;
  const modeSynonym = document.getElementById('mode-synonym').checked;

  if (!modeEnKo && !modeKoEn && !modeSynonym) {
    alert('최소 하나의 모드를 선택해주세요!');
    return;
  }

  localStorage.removeItem('resultWordSet');

  // 설정 저장
  localStorage.setItem('wordSet', wordSet);

  let modes = [];
  if (modeEnKo) modes.push('en-ko');
  if (modeKoEn) modes.push('ko-en');
  if (modeSynonym) modes.push('synonym');

  localStorage.setItem('mode', modes.join(','));

  // 퀴즈 페이지로 이동
  location.href = 'quiz.html';
}

function startStudy() {
  const wordSet = ACTIVE_WORD_SET;
  localStorage.setItem('wordSet', wordSet);
  location.href = 'study.html';
}
