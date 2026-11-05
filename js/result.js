// result.js - 결과 페이지 스크립트

window.addEventListener('DOMContentLoaded', () => {
  const totalCount = parseInt(localStorage.getItem('totalCount') || '0');
  const wrongCount = parseInt(localStorage.getItem('wrongCount') || '0');

  if (totalCount === 0 || localStorage.getItem('resultWordSet') !== ACTIVE_WORD_SET) {
    location.href = 'index.html';
    return;
  }

  // 점수 표시
  const scoreDiv = document.getElementById('score');
  scoreDiv.innerHTML = `
    총 <strong style="color: #059669;">${totalCount}</strong>개 문제 중
    <strong style="color: #dc2626;">${wrongCount}</strong>개 틀림
  `;

  // 틀린 문제가 있으면 복습 버튼 표시
  if (wrongCount > 0) {
    document.getElementById('retry-btn').style.display = 'flex';
  }
});

function retryWrong() {
  const wrongList = getSavedWrongWords();

  if (wrongList.length === 0) {
    alert('틀린 문제가 없습니다!');
    return;
  }

  // 오답 복습 모드로 설정
  localStorage.setItem('wordSet', 'retry_quiz2');

  // mode가 없으면 기본값 설정
  let mode = localStorage.getItem('mode');
  if (!mode) {
    mode = 'en-ko';
    localStorage.setItem('mode', mode);
  }
  // 퀴즈 페이지로 이동
  location.href = 'quiz.html';
}
