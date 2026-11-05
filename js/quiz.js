// quiz.js - 퀴즈 페이지 스크립트

let quizData = {
  words: [],
  modes: [],
  currentIndex: 0,
  wrongList: [],
  answered: false,
  autoNextTimer: null
};

// 페이지 로드 시 초기화
window.addEventListener('DOMContentLoaded', () => {
  const wordSetKey = localStorage.getItem('wordSet');
  const modeString = localStorage.getItem('mode');

  if (!wordSetKey || !modeString) {
    alert('설정값이 없습니다. 처음 화면으로 이동합니다.');
    location.href = 'index.html';
    return;
  }

  // 오답 복습 모드 체크
  if (wordSetKey === 'retry_quiz2') {
    const wrongList = getSavedWrongWords();
    if (wrongList.length === 0) {
      alert('틀린 문제가 없습니다.');
      location.href = 'index.html';
      return;
    }
    quizData.words = [...wrongList].sort(() => Math.random() - 0.5);
  } else {
    const wordSet = getWordSet();
    localStorage.setItem('wordSet', ACTIVE_WORD_SET);
    quizData.words = [...wordSet.words].sort(() => Math.random() - 0.5);
  }

  quizData.modes = modeString.split(',').filter(mode =>
    ['en-ko', 'ko-en', 'synonym'].includes(mode)
  );
  if (!quizData.modes.length) quizData.modes = ['en-ko'];

  // 유사어 모드만 선택된 경우, 유사어가 있는 단어만 필터링
  if (quizData.modes.length === 1 && quizData.modes[0] === 'synonym') {
    quizData.words = quizData.words.filter(word => word.synonyms && word.synonyms.length > 0);

    if (quizData.words.length === 0) {
      alert('유사어가 있는 단어가 없습니다. 다른 모드를 선택해주세요.');
      location.href = 'index.html';
      return;
    }
  }

  quizData.currentIndex = 0;
  quizData.wrongList = [];

  showQuestion();

  // 확인/다음 버튼 클릭 이벤트
  document.getElementById('submit-btn').addEventListener('click', handleSubmit);

  // Enter 키 이벤트
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  });
});

function handleSubmit() {
  if (!quizData.answered) {
    checkAnswer();
  } else {
    if (quizData.autoNextTimer) {
      clearTimeout(quizData.autoNextTimer);
      quizData.autoNextTimer = null;
    }
    nextQuestion();
  }
}

function showQuestion() {
  if (quizData.autoNextTimer) {
    clearTimeout(quizData.autoNextTimer);
    quizData.autoNextTimer = null;
  }

  const { words, modes, currentIndex } = quizData;

  if (currentIndex >= words.length) {
    // 퀴즈 완료
    localStorage.setItem('resultWordSet', ACTIVE_WORD_SET);
    localStorage.setItem('totalCount', words.length);
    localStorage.setItem('wrongCount', quizData.wrongList.length);
    localStorage.setItem('wrongList', JSON.stringify(quizData.wrongList));
    location.href = 'result.html';
    return;
  }

  const word = words[currentIndex];

  // 현재 모드 선택
  let currentMode;
  const availableModes = modes.filter(m => {
    if (m === 'synonym') {
      return word.synonyms && word.synonyms.length > 0;
    }
    return true;
  });

  // 사용 가능한 모드가 없으면 단어 건너뛰기
  if (availableModes.length === 0) {
    quizData.currentIndex++;
    showQuestion();
    return;
  }

  currentMode = availableModes[Math.floor(Math.random() * availableModes.length)];

  // 문제와 정답 설정
  let question, answers, modeBadgeText;

  if (currentMode === 'en-ko') {
    question = word.term;
    answers = word.meaning;
    modeBadgeText = '영어 → 한국어';
  } else if (currentMode === 'ko-en') {
    question = word.meaning.join(', ');
    answers = [word.term, ...(word.synonyms || [])];
    modeBadgeText = '한국어 → 영어';
  } else if (currentMode === 'synonym') {
    // 유사어 모드 (이미 유사어가 있는 경우만 여기 도달)
    const allWords = [word.term, ...word.synonyms];
    const questionIndex = Math.floor(Math.random() * allWords.length);
    question = allWords[questionIndex];
    answers = allWords.filter((_, index) => index !== questionIndex);
    modeBadgeText = '유사어 (영어 → 영어)';
  }

  quizData.answered = false;

  // UI 업데이트
  document.getElementById('counter').textContent = `${currentIndex + 1} / ${words.length}`;
  document.getElementById('progress').style.width = `${((currentIndex + 1) / words.length) * 100}%`;
  document.getElementById('mode-badge').textContent = modeBadgeText;
  document.getElementById('question').textContent = question;
  document.getElementById('answer').value = '';
  document.getElementById('answer').disabled = false;
  document.getElementById('result').innerHTML = '';
  document.getElementById('submit-btn').textContent = '확인';

  // 입력창에 포커스
  setTimeout(() => {
    const answerInput = document.getElementById('answer');
    if (answerInput) {
      answerInput.focus();
    }
  }, 100);

  // 현재 정답 저장
  quizData.currentAnswers = answers;
  quizData.currentWord = word;
}

function checkAnswer() {
  if (quizData.answered) return;
  const userAnswer = document.getElementById('answer').value.trim();
  const { currentAnswers, currentWord } = quizData;

  if (!userAnswer) {
    alert('답을 입력해주세요!');
    return;
  }

  quizData.answered = true;

  // 모든 가능한 답 확장
  const expandedAnswers = currentAnswers.flatMap(ans => expandAnswers(ans));

  // 정답 체크 (대소문자 무시)
  const isCorrect = expandedAnswers.some(ans =>
    ans.toLowerCase() === userAnswer.toLowerCase()
  );

  // 결과 표시
  const resultDiv = document.getElementById('result');
  if (isCorrect) {
    resultDiv.innerHTML = `
      <div class="result-correct">
        <div class="result-title">
          <svg style="width: 24px; height: 24px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          정답입니다!
        </div>
      </div>
    `;
  } else {
    resultDiv.innerHTML = `
      <div class="result-wrong">
        <div class="result-title">
          <svg style="width: 24px; height: 24px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          틀렸습니다
        </div>
        <div class="result-answer">정답: <strong>${currentAnswers.join(', ')}</strong></div>
      </div>
    `;
    quizData.wrongList.push(currentWord);
  }

  // 버튼을 "다음"으로 변경
  document.getElementById('answer').disabled = true;
  document.getElementById('submit-btn').textContent = '다음';

  // 2초 후 자동으로 다음 문제로
  quizData.autoNextTimer = setTimeout(() => {
    quizData.autoNextTimer = null;
    nextQuestion();
  }, 2000);
}

function nextQuestion() {
  if (!quizData.answered) return;
  // 타이머가 있으면 취소
  if (quizData.autoNextTimer) {
    clearTimeout(quizData.autoNextTimer);
    quizData.autoNextTimer = null;
  }

  quizData.currentIndex++;
  showQuestion();
}
