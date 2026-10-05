# One Purple Unicorn Pro Theme Development

## 개발 환경 설정

### 초기 설정 (최초 1회)
```bash
# 테마 루트: setup/shiki.ts 등이 쓰는 의존성(@slidev/types, katex)
npm install

# 예시 덱: Slidev CLI
cd example
npm install
```

### 개발 워크플로우
```bash
cd example
npm run dev          # http://localhost:3031 (slides.md, theme: ../)
```
- 테마 파일(CSS, Vue)을 수정하면 HMR로 바로 반영돼요. 새 파일이나 의존성을 추가했을 때는 서버를 재시작하세요.
- `example/slides.md`가 모든 레이아웃·컴포넌트·효과의 데모예요. 기능을 추가하면 여기에도 슬라이드를 추가하세요.

## 파일 구조

```
slidev-theme-one-purple-unicorn-pro/
├── package.json         # 테마 설정(slidev 필드: 폰트, colorSchema), 배포 파일 목록
├── styles.css           # CSS 엔트리 (import 순서가 우선순위에 영향)
├── styles/
│   ├── colors.css       # 색 토큰 (다크 기본값)
│   ├── light-theme.css  # 라이트 모드 팔레트 재정의
│   ├── index.css        # 본문 슬라이드 공통 스타일 (slide-bare 제외)
│   ├── main.css         # 타이포그래피, 표, 카드, 알림
│   ├── animations.css   # anim-* / hover-* (컴포넌트 스타일보다 뒤에 로드)
│   └── ...
├── layouts/             # 레이아웃 (옛 이름은 프리셋 별칭)
├── components/          # 공개 컴포넌트 (Badge, StoryBox, ...)
│   └── internal/        # 레이아웃 빌딩 블록 (CenteredSlide, GridColumns, ...)
├── utils/               # 공용 로직 (레이아웃 목록, $...$ 렌더링, 테두리 빛)
├── setup/               # Slidev 셋업 (shiki 테마, 앱 셋업)
├── global-top.vue       # 스테이지 표시
├── global-bottom.vue    # 진행바, 페이지 번호
└── example/             # 데모 덱 (배포에는 포함 안 됨)
```

## 규칙

- **레이아웃 역할 클래스**: 레이아웃 루트에 `slide-dark`(라이트 모드에서도 어두운 배경), `slide-bare`(본문 공통 스타일 제외)를 붙여요. CSS는 레이아웃 이름 목록 대신 이 클래스로 판단해요.
- **파라미터화**: 값은 `var(--이름, 기본값)` 형태로 열어 두고, 기본값은 현재 모습 그대로 유지해요. 새 변수는 README의 Customization 표에 추가하세요.
- **색**: 직접 색 값 대신 `colors.css`의 토큰을 쓰세요. 라이트 모드 값은 `light-theme.css`에서 재정의해요. 다른 변수를 참조하는 변수(`--content-*` 등)는 재정의할 때 같이 다시 선언해야 해요.
- **Vue scoped CSS**: `:global(A) B`는 B가 빠질 수 있어서 쓰지 마세요. `html.dark .x`처럼 일반 선택자를 쓰면 돼요.

## 검증

변경 전후로 데모 덱 전체를 다크·라이트로 캡처해서 비교하면 의도하지 않은 변경을 잡을 수 있어요. 특히 선택자 우선순위를 바꾸는 리팩터링은 꼭 비교하세요.

## 배포

```bash
npm version <x.y.z> --no-git-tag-version
git commit -am "chore(release): bump version to vX.Y.Z"
git tag -a vX.Y.Z -m "vX.Y.Z"
git push origin main --follow-tags
npm publish          # 2FA: 브라우저에서 승인
```
