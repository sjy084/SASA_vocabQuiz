// study.js - 단어장 페이지 스크립트

window.addEventListener('DOMContentLoaded', () => {
  const wordSet = getWordSet();
  localStorage.setItem('wordSet', ACTIVE_WORD_SET);

  // 제목 업데이트
  document.getElementById('study-title').textContent = wordSet.name;

  // 단어 테이블 생성
  const tbody = document.getElementById('word-list');
  wordSet.words.forEach(word => {
    const tr = document.createElement('tr');

    // 유사어가 있으면 표시
    let synonymText = '';
    if (word.synonyms && word.synonyms.length > 0) {
      synonymText = `<br><span style="color: #059669; font-size: 0.9rem;">유사어: ${word.synonyms.join(', ')}</span>`;
    }

    tr.innerHTML = `
      <td>${word.term}${synonymText}</td>
      <td>${word.meaning.join(', ')}</td>
    `;
    tbody.appendChild(tr);
  });
});
