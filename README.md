# quiz2 영어 단어 학습

`index.html`을 브라우저에서 열거나 정적 웹 서버/GitHub Pages에서 실행합니다.
영어 → 한국어, 한국어 → 영어, 유사어 모드와 결과 확인·오답 복습을 지원합니다.
현재 화면에서는 `quiz2` 단어장만 사용합니다.

## 폴더 구조

```text
index.html          단어장·모드 선택
quiz.html           퀴즈
study.html          단어 목록
result.html         결과·오답 복습
css/style.css       공통 스타일
js/common.js        공통 채점·단어장·복습 함수
js/main.js          시작 화면
js/quiz.js          퀴즈 진행
js/study.js         단어 목록
js/result.js        결과 화면
words/test_word     quiz2 원본 텍스트
words/quiz2.js      원본에서 생성한 브라우저용 단어 데이터
words/legacy.js     기존 words.js 원본 보관 (화면에서 사용하지 않음)
scripts/generate-words.mjs  단어 데이터 생성 도구
```

## 단어 수정

`words/test_word`에 `영단어: 뜻` 형식으로 입력합니다.
뜻은 쉼표 또는 세미콜론으로 나누며, 영어 쪽 쉼표는 유사어를 구분합니다.
빈 줄과 `====` 구분선은 무시합니다. 원문 철자는 그대로 유지합니다.
텍스트를 수정한 뒤 프로젝트 폴더에서 다음 명령을 실행합니다 (Node.js 필요).

```sh
node scripts/generate-words.mjs
```

생성된 `words/quiz2.js`도 함께 커밋합니다. 브라우저는 생성된 데이터를 읽으므로
`index.html`을 직접 열어도 텍스트 파일을 fetch하는 제약 없이 실행됩니다.
생성 도구는 Node.js 기본 모듈만 사용하므로 별도 설치가 필요하지 않습니다.

## 검증

```sh
node scripts/check.mjs
```

단어 변환, 파일 경로, 세 가지 모드·혼합 모드, 결과 저장과 오답 복습을 검증합니다.

기존 프로젝트 주소: https://sjy084.github.io/ERW_vocabQuiz/

ⓒ 2025. J.Y.SHIN All rights reserved.
