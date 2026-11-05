# quiz2 영어 단어 학습

`index.html`을 브라우저에서 열거나 정적 웹 서버/GitHub Pages에서 실행합니다.
영어 → 한국어, 한국어 → 영어, 유사어 모드와 결과 확인·오답 복습을 지원합니다.
현재 화면에서는 `quiz2` 단어장만 사용합니다.

## 10개씩 반복 학습

홈에서 **10개씩 반복 학습**을 선택합니다. 원본 순서로 나뉜 5개 챕터 중 하나와
문제 방향을 선택하면 그 챕터의 10개 단어를 무작위 순서로 풀 수 있습니다.
한 라운드가 끝나면 틀린 단어만 즉시 다음 라운드로 넘어가며, 모두 맞힐 때까지 반복합니다.
오답 복습에서는 방금 틀린 문제의 방향과 질문을 그대로 유지합니다.
틀리거나 **모르겠어요**를 누르면 정답을 확인하고 직접 다음으로 넘어갑니다.
완료 후 다음 챕터로 진행하거나 챕터를 다시 선택할 수 있습니다.
유사어만 선택하면 해당 챕터에서 유사어가 있는 단어만 출제합니다.
기존 테스트와 결과 저장은 별개이며, 학습 도중 새로고침하면 해당 챕터를 처음부터 시작합니다.

참고: [Quizlet Write 모드](https://help.quizlet.com/hc/en-us/articles/360030990531-Studying-with-Write-mode)의
첫 라운드 이후 오답을 다시 출제하는 흐름을 참고했습니다. 이 프로젝트는 요청한 대로
각 단어를 정답으로 맞히면 학습 대상에서 제외하며, 정답을 두 번 요구하지 않습니다.

## 폴더 구조

```text
index.html          단어장·모드 선택
quiz.html           퀴즈
study.html          단어 목록
result.html         결과·오답 복습
learn.html          학습 챕터·문제 방향 선택
practice.html       10개씩 오답 반복 학습
css/style.css       공통 스타일
css/learn.css       학습 화면 스타일
js/common.js        공통 채점·단어장·복습 함수
js/main.js          시작 화면
js/quiz.js          퀴즈 진행
js/study.js         단어 목록
js/result.js        결과 화면
js/learning.js      챕터 분할·학습 라운드 상태
js/learn.js         학습 설정 화면
js/practice.js      반복 학습 진행
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
node scripts/check-learning.mjs
```

단어 변환, 파일 경로, 세 가지 모드·혼합 모드, 결과 저장과 오답 복습을 검증합니다.
추가로 챕터 경계, 반복 오답, 모두 정답일 때의 완료 처리와 학습 모드를 검증합니다.

기존 프로젝트 주소: https://sjy084.github.io/ERW_vocabQuiz/

ⓒ 2025. J.Y.SHIN All rights reserved.
