# 고민 컴파일러 (life-motto)

고민을 입력하면 그 고민을 해결하는 "인생 모토" 코드 한 조각을 VS Code 화면처럼 띄워 주는 웹사이트.

```js
// exam season
while (exam.daysLeft > 0) {
  study(25);
  rest(5);
}
pass();
```

## 동작 방식

- 터미널에 고민을 입력하면 키워드로 카테고리를 분류하고, 미리 써 둔 코드 중 하나를 랜덤으로 보여 줍니다.
- 카테고리: study · compare · people · career · motivation · rest · love · money · anxiety · life
- AI 호출이나 서버가 없는 정적 사이트라 비용 없이 운영할 수 있습니다.

## 파일 구조

| 파일 | 역할 |
| --- | --- |
| `index.html` | 화면 (VS Code 스타일 레이아웃) |
| `script.js` | 분류, 랜덤 선택, 문법 하이라이트, 타이핑 효과 |
| `codes.js` | 코드 라이브러리 (카테고리별 키워드 + 코드) |

## 코드 추가하기

`codes.js`에서 원하는 카테고리의 `codes` 배열에 문자열을 하나 추가하면 됩니다. 들여쓰기는 공백 2칸.

## 로컬에서 실행

`index.html`을 브라우저로 열면 됩니다.
