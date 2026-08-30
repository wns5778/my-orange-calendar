# 🍊 My Orange Calendar

나만의 캘린더 + 할 일(투두리스트) + 메모 앱. 오렌지 & 화이트 톤의 개인용 웹앱(PWA)으로,
PC 브라우저와 안드로이드 폰에서 같은 계정으로 로그인하면 Firebase를 통해 실시간으로 데이터가 동기화됩니다.

## 기술 스택

- React + Vite (PWA)
- Firebase Authentication (이메일/비밀번호 로그인)
- Firebase Firestore (실시간 데이터 동기화)

배포는 무료 호스팅 서비스인 **Vercel**을 사용합니다.

---

## 1단계. Firebase 프로젝트 만들기 (무료)

1. https://console.firebase.google.com 접속 후 Google 계정으로 로그인
2. **프로젝트 추가** 클릭 → 프로젝트 이름 입력 (예: `my-orange-calendar`) → 계속 진행 (Google Analytics는 꺼도 무방)
3. 생성된 프로젝트에서 좌측 메뉴 **빌드 > Authentication** 클릭 → **시작하기**
   - **Sign-in method** 탭에서 **이메일/비밀번호** 로그인 방식을 사용 설정
4. 좌측 메뉴 **빌드 > Firestore Database** 클릭 → **데이터베이스 만들기**
   - 위치는 가까운 리전 선택 (예: `asia-northeast3` 서울)
   - 보안 규칙은 일단 "테스트 모드"로 시작해도 되지만, 아래 3단계에서 반드시 규칙을 교체하세요
5. 프로젝트 개요 옆 톱니바퀴 → **프로젝트 설정 > 일반** 탭 → 하단 "내 앱"에서 **웹 앱 추가**(</> 아이콘) 클릭
   - 앱 닉네임 입력 후 등록하면 `firebaseConfig` 객체가 표시됩니다. 이 값들을 복사해두세요.

## 2단계. 이 프로젝트에 Firebase 설정 연결하기

1. 프로젝트 루트에 `.env` 파일을 새로 만들고, `.env.example`을 참고해서 1단계에서 복사한 값을 채워 넣으세요.

```bash
cp .env.example .env
```

```
VITE_FIREBASE_API_KEY=복사한 apiKey
VITE_FIREBASE_AUTH_DOMAIN=복사한 authDomain
VITE_FIREBASE_PROJECT_ID=복사한 projectId
VITE_FIREBASE_STORAGE_BUCKET=복사한 storageBucket
VITE_FIREBASE_MESSAGING_SENDER_ID=복사한 messagingSenderId
VITE_FIREBASE_APP_ID=복사한 appId
```

2. 로컬에서 실행해보기

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속 → 이메일/비밀번호로 회원가입하면 바로 사용 가능합니다.

## 3단계. Firestore 보안 규칙 설정 (중요)

본인 데이터만 본인이 읽고 쓸 수 있도록, Firebase 콘솔 > Firestore Database > **규칙** 탭에서
이 저장소의 [`firestore.rules`](firestore.rules) 내용을 그대로 복사해서 붙여넣고 **게시**하세요.
이 단계를 건너뛰면 테스트 모드 규칙이 30일 후 만료되어 데이터를 읽고 쓸 수 없게 되거나,
반대로 아무나 데이터에 접근할 수 있는 상태로 남을 수 있습니다.

## 4단계. 무료 배포 (Vercel)

1. https://vercel.com 에서 GitHub 계정(또는 이메일)으로 가입
2. 이 프로젝트 폴더를 GitHub 저장소로 올리기 (또는 Vercel CLI 사용)
3. Vercel 대시보드에서 **Add New > Project** → 방금 올린 저장소 선택 → Framework는 자동으로 "Vite"로 인식됨
4. **Environment Variables**에 `.env`에 넣었던 6개 값을 동일하게 등록
5. **Deploy** 클릭 → 몇 분 후 `https://프로젝트이름.vercel.app` 같은 주소가 발급됨

이제 이 주소를 PC 브라우저에서도, 안드로이드 폰 브라우저(Chrome)에서도 열 수 있습니다.

## 5단계. 안드로이드에 앱처럼 설치하기 (PWA)

1. 안드로이드 Chrome에서 배포된 주소로 접속
2. 우측 상단 점 3개 메뉴 → **앱 설치** 또는 **홈 화면에 추가** 선택
3. 홈 화면에 오렌지색 아이콘이 생기고, 탭하면 주소창 없이 일반 앱처럼 열립니다

## 6단계. 폰-PC 동기화 사용법

- PC와 폰 양쪽에서 **같은 이메일/비밀번호**로 로그인하면, 한쪽에서 일정/할 일/메모를 추가·수정·삭제할 때
  다른 쪽 화면에도 실시간으로 자동 반영됩니다 (Firestore 실시간 리스너 사용).
- 별도의 "동기화" 버튼은 없으며, 로그인만 되어 있으면 인터넷 연결 시 자동으로 동기화됩니다.

---

## 폴더 구조

```
src/
  components/   화면 구성 요소 (캘린더, 할 일, 메모, 로그인, 모달 등)
  hooks/        Firebase 인증/Firestore 연동 훅
  utils/date.js 날짜 계산 유틸
  firebase.js   Firebase 초기화
  App.jsx       탭 전환 및 전체 레이아웃
```

## 주요 기능

- **캘린더**: 월 단위 보기, 날짜별 일정 추가(제목/시간/메모/색상), 그 날짜에 마감인 할 일도 함께 표시
- **할 일**: 텍스트 + 선택적 마감일 추가, 진행 중/완료/전체 필터, 완료 체크
- **메모**: 제목 + 내용 자유 작성, 특정 날짜에 연결 가능, 검색

## 로컬 개발 명령어

```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드 (dist/ 폴더 생성)
npm run preview  # 빌드 결과 미리보기
```
