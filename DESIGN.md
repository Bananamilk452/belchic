# DESIGN.md — Belchic 프론트엔드 UI 디자인 문서

## 1. 디자인 철학

Belchic의 UI는 다음 네 가지 원칙 위에 설계되어 있습니다.

### 미니멀리스트 모노크롬

고딕풍 로리타 의류가 가진 어둡고 낭만적인 무드를 절제된 흑백 명암 대비만으로 해석합니다. 별도의 accent color 없이 OKLCH 흑백 스케일을 사용해 여백과 테두리, 타이포그래피의 명암 차이만으로 모든 시각적 계층을 표현합니다.

- 배경은 흰색(light) 또는 어두운 회색(dark), 텍스트는 그 반대
- 강조가 필요한 조작 가능 요소는 검은 테두리(`border-black`)로 뚜렷한 경계 제공
- 선택/활성 상태는 검은 배경 + 흰 텍스트로 반전

### 고대비 인터랙션

모든 조작 가능한 요소는 사용자가 그 존재와 상태를 명확히 인지할 수 있도록 설계합니다.

- **기본**: 검은 테두리로 구분 (`border-black`, `border-border`)
- **hover**: opacity 또는 background-color 변경
- **focus-visible**: ring으로 외곽선 표시
- **active/selected**: 배경색 반전 (bg-black text-white)
- **disabled**: opacity 감소 + 포인터 이벤트 차단

### 한국어 퍼스트

언어 기본값이 한국어인 쇼핑몰입니다. 모든 UI 텍스트, placeholder, 에러 메시지, 버튼 라벨은 한국어로 작성합니다. 숫자/통화 포맷팅은 `ko-KR` 로케일을 사용합니다 (`₩` 기호 + 3자리 콤마).

### 절제된 움직임

애니메이션은 다음 세 종류만 사용하며 과도한 트랜지션은 지양합니다.

| 애니메이션               | 구현                                | 사용처             |
| ------------------------ | ----------------------------------- | ------------------ |
| `slide-in-bottom`        | `@keyframes` (translateY + opacity) | 검색 오버레이 진입 |
| `animate-pulse`          | Tailwind 내장                       | Skeleton 로딩      |
| SVG `<animateTransform>` | `rotate` + `dur="1s"`               | Spinner            |

---

## 2. shadcn/ui 활용

이 프로젝트는 [shadcn/ui](https://ui.shadcn.com)를 기반으로 하며, Tailwind CSS v4 + Radix UI + CSS Variables 기반의 디자인 토큰 체계를 사용합니다.

> **참고**: shadcn/ui 및 Tailwind CSS v4의 최신 문서는 Context7 MCP 서버를 통해 조회할 수 있습니다.

---

## 3. 디자인 토큰

### 3-1 컬러 시스템

shadcn/ui의 **neutral** 베이스 컬러를 채택했습니다. 모든 색상은 OKLCH 색공간의 CSS custom properties로 정의되어 있으며, Tailwind v4의 `@theme inline`을 통해 `bg-primary`, `text-muted-foreground` 등 시맨틱 유틸리티 클래스로 접근합니다.

**규칙**: 새 컴포넌트에서는 `text-black`, `bg-white` 등 하드코딩 색상을 사용하지 않고 반드시 시맨틱 변수를 사용합니다. **유일한 예외**는 고대비 인터랙션 경계선을 표현해야 하는 `border-black`입니다.

### 3-2 타이포그래피

| CSS 변수       | 폰트                         | 포맷                                                   | 용도                                           |
| -------------- | ---------------------------- | ------------------------------------------------------ | ---------------------------------------------- |
| `--font-sans`  | Outfit + Pretendard Variable | Outfit: Google Fonts (300~700), Pretendard: 로컬 woff2 | 기본 UI, 버튼, 라벨, 본문                      |
| `--font-serif` | Noto Serif KR                | Google Fonts (300~700)                                 | 강조 제목 (현재 Favorite "관심 상품"에만 사용) |
| `--font-mono`  | Geist Mono                   | 등록만 됨                                              | 코드 표시용 (현재 실제 사용 없음)              |

- `--font-sans`는 Outfit이 라틴 문자를, Pretendard Variable이 한글을 담당하는 fallback 체인
- `--font-heading`은 `--font-sans`와 동일
- 본문 기본 사이즈는 Tailwind base (16px) 기준, 제목은 `text-[40px]` (`font-serif`) 또는 `text-lg`/`text-sm` 위계

### 3-3 Radius

기준 `--radius: 0.625rem`을 바탕으로 6단계 스케일을 사용합니다.

| 토큰                           | 계산식                | 용도 예시                    |
| ------------------------------ | --------------------- | ---------------------------- |
| `--radius-sm`                  | `var(--radius) * 0.6` | 작은 요소                    |
| `--radius-md`                  | `var(--radius) * 0.8` | Button 기본, Input, Skeleton |
| `--radius-lg`                  | `var(--radius)`       | 기본 radius                  |
| `--radius-xl` ~ `--radius-4xl` | 1.4배 ~ 2.6배         | 큰 카드, 모달                |

일부 컴포넌트는 디자인 의도에 따라 `rounded-none`(Sheet, DropdownMenu), `rounded-full`(Pill, LikeButton)을 직접 지정합니다.
사용자가 직접 조작할 수 있는 요소들에 대해서는 기본적으로 `rounded-none`을 사용하여 경계를 명확히 함과 동시에 고딕풍 디자인을 실현해야 합니다.

---

## 4. 레이아웃 시스템

### 4-1 Global Shell

```
<html lang="ko">
  <body class="flex min-h-full flex-col">
    <GlobalHeader />   ← border-b로 구분, 고정(sticky) 아님
    {children}
    <GlobalFooter />
    <Toaster />        ← fixed overlay, z-index 상위
```

GlobalHeader, GlobalFooter는 모든 페이지에 공통 적용됩니다. 그 외의 페이지 내부 콘텐츠는 자유롭게 레이아웃을 구성합니다.

### 4-2 컨테이너 너비 규칙

넓은 화면에서 콘텐츠가 과도하게 흩어지는 것을 방지하기 위해 `max-w-*`를 적용합니다. 새 페이지 설계 시 다음 우선순위로 선택합니다.

| 우선순위 | max-width   | 사용 예시                                            |
| -------- | ----------- | ---------------------------------------------------- |
| 1순위    | `max-w-7xl` | Header 내부, Footer 저작권 영역, Favorite 페이지, 홈 |
| 2순위    | `max-w-6xl` | 컬렉션/검색 상품 그리드, 정렬 바                     |
| 3순위    | `max-w-5xl` | Footer 빠른 링크 영역                                |

### 4-3 그리드 시스템

상품 목록은 모든 페이지에서 동일한 2단계 반응형 그리드를 사용합니다.

```
grid grid-cols-2 gap-4 md:grid-cols-4
```

- **모바일** (`<768px`): 2컬럼
- **데스크탑** (`≥768px`): 4컬럼
- 각 그리드 아이템은 `col-span-1 w-full`로 래핑
- 갭은 `gap-4` 통일

### 4-4 반응형 분기점 참고

| 요소                 | 모바일                         | 데스크탑 (≥ `md` 브레이크포인트) |
| -------------------- | ------------------------------ | -------------------------------- |
| **내비게이션**       | 햄버거 아이콘 → Sheet 슬라이드 | DesktopNavMenu (DropdownMenu)    |
| **계정 아이콘**      | 숨김 (`hidden`)                | 표시 (`md:flex`)                 |
| **상품 그리드**      | 2컬럼                          | 4컬럼                            |
| **Footer 빠른 링크** | 세로 스택                      | 가로 정렬 (`md:flex-row`)        |
| **Footer 저작권**    | 세로 스택                      | 가로 정렬 (`md:justify-start`)   |

---

## 5. 컴포넌트 계층 구조

### 5-1 디렉토리 분류

```
components/
├── ui/          ← shadcn/radix 기반 Primitive. 완전히 범용적.
│                   (Button, Input, Dimmer, DropdownMenu, Sheet 등)
├── shared/      ← 여러 Feature에서 공유되는 중간 수준 컴포넌트
│                   (ProductListPagination)
├── auth/        ← 인증 Feature
│                   (SignInForm, SignUpForm)
├── product/     ← 상품 Feature + ProductContext
│                   (ProductCard, ProductDetail, ProductList, ProductContext)
├── cart/        ← 장바구니 Feature
│                   (Cart, CartItem)
├── collection/  ← 컬렉션 Feature
│                   (CollectionProductList)
├── search/      ← 검색 Feature
│                   (SearchProductList)
├── favorite/    ← 관심상품 Feature
│                   (Favorite)
└── (root)/      ← 전역 레이아웃 수준
                    (GlobalHeader, GlobalFooter, SearchBar, SearchTab)
```

### 5-2 의존 방향

```
ui  ←  shared  ←  feature  ←  layout
```

Feature끼리는 가능한 한 직접 참조를 피합니다. 예외적으로 `ProductCard`는 product 패키지에 속하지만 favorite과 collection에서도 사용됩니다.

### 5-3 Server / Client 컴포넌트 구분

| 유형               | Server Component                                                         | Client Component                                               |
| ------------------ | ------------------------------------------------------------------------ | -------------------------------------------------------------- |
| **UI Primitive**   | Button, Input, NativeSelect, Pill, Skeleton, Spinner, Dimmer, Pagination | DropdownMenu, Field, Sheet, Quantity, Separator, Label, Sonner |
| **Feature/Layout** | GlobalFooter                                                             | GlobalHeader, 모든 Feature 컴포넌트                            |

대부분의 UI Primitive는 Server Component로 작성하고, 내부 상태나 Radix UI hook이 필요한 경우에만 Client Component로 작성합니다. 모든 Feature 컴포넌트는 Client Component입니다.

---

## 6. 새 컴포넌트 설계 체크리스트

새로운 UI 컴포넌트나 페이지를 추가할 때 아래 항목을 확인합니다.

### 6-1 색상

- [ ] 하드코딩 색상(`text-black`, `bg-white`, `text-gray-500` 등) 대신 시맨틱 변수 사용
- [ ] `text-foreground`, `bg-background`, `text-muted-foreground`, `text-destructive` 등
- [ ] 경계선은 `border-border` 사용. 단, 고대비 인터랙션 경계가 필요하면 `border-black` 예외 허용
- [ ] Dark mode에서도 정상 대비를 보이는지 확인

### 6-2 인터랙션 상태

- [ ] **hover**: `hover:bg-*`, `hover:opacity-*`, `group-hover:` 패턴으로 시각 피드백 제공
- [ ] **focus-visible**: Tailwind base layer가 `* { outline-ring/50 }`을 전역 적용하므로, 추가 스타일은 필요한 경우만
- [ ] **disabled**: `disabled:opacity-50 disabled:pointer-events-none`
- [ ] **active/selected**: `bg-black text-white` (toggle), `bg-secondary` (list item), `variant="outline"` (pagination)

### 6-3 상태 UI

#### 로딩 상태

실제 콘텐츠와 동일한 형태의 Skeleton을 제공합니다.

- 상품 목록: 카드 그리드 형태의 Skeleton
- 장바구니: 테이블 행 형태의 Skeleton
- 상품 상세: 이미지 + 옵션 + 설명 블록 Skeleton

#### 빈 상태 (Empty)

한국어 안내 메시지 + 대체 액션을 함께 제공합니다.

참고 :
| 위치 | 메시지 | 대체 액션 |
|---|---|---|
| 장바구니 | "카트가 비어있습니다." | — |
| 관심 상품 | "관심 상품이 없습니다." | "쇼핑 계속하기" 링크 |
| 검색 결과 | "검색 결과가 없습니다." | SearchBar (재검색 유도) |
| 없는 컬렉션 | "존재하지 않는 컬렉션입니다." | — |

#### 에러 상태 처리 예시

- **폼 유효성 오류**: `FieldError` 컴포넌트에 `errors` 배열을 전달합니다. 단일 에러는 인라인 텍스트, 복수 에러는 `<ul>` 불릿 리스트로 표시합니다.
- **비동기 작업 실패**: Sonner `toast.error()`로 알립니다. Optimistic mutation의 경우 onError 콜백에서 캐시를 rollback한 후 toast를 호출합니다.

### 6-4 애니메이션

| 목적          | 적용 방법                                                                   |
| ------------- | --------------------------------------------------------------------------- |
| 요소 진입     | `animate-slide-in-bottom` (검색 오버레이용). 그 외는 Sheet 내장 slide 사용  |
| 로딩 표시     | `animate-pulse` (Skeleton) 또는 `<Spinner />`                               |
| 호버 트랜지션 | `transition-opacity`, `transition-transform`, `transition-all duration-300` |

### 6-5 접근성

- [ ] 폼 입력: 오류 시 `aria-invalid` 속성 + `FieldError` + `role="alert"`
- [ ] 필드 그룹: `role="group"` 또는 `FieldSet` + `FieldLegend` 사용
- [ ] 아이콘 버튼: 아이콘만으로 행동을 유추할 수 있는지 확인. 모호하면 `sr-only` 텍스트 추가
- [ ] 키보드: Radix UI 기반 컴포넌트는 접근성을 내장하고 있습니다 (DropdownMenu, Sheet의 키보드 네비게이션, 포커스 트랩, ESC 닫기)

---

## 7. 주요 UI 패턴 카탈로그

프로젝트 전반에서 반복해서 등장하는 복합 UI 패턴들입니다. 유사한 기능 구현 시 참고합니다.

### 7-1 검색 오버레이

**위치**: `components/SearchTab.tsx` + `components/SearchBar.tsx`

```
SearchTab (open 상태일 때만 렌더링)
  └── Dimmer (fixed bg-black/50, 클릭/ESC로 닫기)
       └── SearchBar (slide-in-bottom 애니메이션, react-hook-form + Zod)
```

- `open`/`onOpenChange` prop으로 외부에서 제어
- 제출 시 `/search?q={query}`로 라우팅 후 오버레이 닫힘
- 닫기: X 버튼, Dimmer 클릭, Esc 키

### 7-2 모바일 네비게이션

**위치**: `components/global-header.tsx` (MobileNavSheet 내부 함수)

```
MobileNavSheet (Sheet, side="left")
  ├── SheetHeader (로고)
  └── 메뉴 목록
       ├── 단순 링크 → Link, 클릭 시 Sheet 닫힘
       └── 서브메뉴 있음 → 재귀 MobileNavSheet (중첩 Sheet)
            └── Back 버튼 (subtitle + ArrowLeftIcon)
```

- 서브메뉴가 있는 항목은 `Trigger` render prop으로 중첩 Sheet의 트리거를 전달
- 재귀적 구조로 이론상 무한 깊이의 서브메뉴 지원

### 7-3 이미지 크로스페이드 (ProductCard)

**위치**: `components/product/ProductCard.tsx`

```
Link (group, relative, overflow-hidden)
  ├── img 1 (메인 이미지, opacity-100 → group-hover:opacity-50)
  └── img 2 (variant 이미지, absolute, opacity-0 → group-hover:opacity-100 + scale-105)
```

두 이미지를 겹쳐 놓고, 호버 시 opacity를 교차하며 variant 이미지를 scale-up 합니다. `transition-all duration-300`으로 부드럽게 전환됩니다.

### 7-4 옵션 선택 → 이미지 연동

**위치**: `components/product/ProductDetail.tsx` + `components/product/ProductContext.tsx`

1. 사용자가 Pill을 클릭 → variant index 변경
2. `ProductContext`의 `setSelectedVariantIndex` 호출
3. `selectedImageIndex`가 선택된 variant의 `featuredImage` 위치로 자동 변경
4. `ProductImageSlider`에서 `scrollIntoView({ behavior: "smooth" })`로 해당 썸네일로 스크롤

### 7-5 Optimistic Mutation (장바구니)

**위치**: `components/cart/Cart.tsx`

```
useMutation({
  mutationFn: updateCartItemAction,
  onMutate: async () => {
    cancelQueries → getQueryData → setQueryData(optimistic)  // 즉시 UI 반영
  },
  onError: (_error, _variables, context) => {
    setQueryData(context.previous)                           // rollback
    toast.error("...")
  },
  onSettled: () => invalidateQueries()
})
```

- 수량 변경과 아이템 삭제 모두 동일한 optimistic 패턴 사용
- `loadingItemId` state로 변경 중인 행에 Spinner 표시

### 7-6 URL State 동기화

**위치**: `components/collection/CollectionProductList.tsx`, `components/search/SearchProductList.tsx`

```
nuqs useQueryState → URL query params (page, sort)
  → TanStack Query useQuery → Server Action 호출 → 데이터
  → ProductListPagination 렌더링
```

- `page`는 `parseAsInteger`, `sort`는 `parseAsStringLiteral(SORT_VALUES)`
- 정렬 변경 시 page를 1로 리셋
- 페이지네이션 링크는 `buildHref()`로 URL 생성, 클릭 시 `e.preventDefault()` 후 client-side로 상태 변경
- Next.js Link의 href와 onClick을 함께 사용해 SEO + SPA 네비게이션 양립

### 7-7 Debounce 입력 (장바구니 수량)

**위치**: `components/cart/CartItem.tsx`

```typescript
const debouncedOnQuantityChange = debounce(onQuantityChange, 500);

useEffect(() => {
  return () => {
    debouncedOnQuantityChange.cancel();
  };
}, []);
```

`es-toolkit`의 `debounce`를 사용해 500ms 지연 후 수량 변경 요청을 전송합니다. 컴포넌트 unmount 시 `cancel()`로 클린업합니다.

### 7-8 폼 유효성 검사

**위치**: `SignInForm.tsx`, `SignUpForm.tsx`, `SearchBar.tsx`

```
react-hook-form (useForm) + Zod schema (@hookform/resolvers/zod)
  ├── Controller / register
  ├── Field
  │   ├── FieldLabel
  │   ├── Input (aria-invalid={fieldState.invalid})
  │   └── FieldError (errors=[fieldState.error])
  └── Button (type="submit", formState.isSubmitting 시 비활성화 + 텍스트 변경)
```

---

## 8. 아이콘 체계

### lucide-react

일반 목적의 아이콘은 [lucide-react](https://lucide.dev)에서 가져옵니다.

### 커스텀 SVG 아이콘

브랜드 특화 또는 lucide-react에서 찾을 수 없는 아이콘은 `resources/icons/`에 SVG React 컴포넌트로 추가합니다.

| 파일             | 용도                            |
| ---------------- | ------------------------------- |
| `Account.tsx`    | 계정/마이페이지                 |
| `ArrowLeft.tsx`  | 모바일 네비게이션 Back 버튼     |
| `ArrowRight.tsx` | 모바일 네비게이션 서브메뉴 진입 |
| `Cart.tsx`       | 장바구니                        |
| `Menu.tsx`       | 모바일 햄버거 메뉴              |
| `Search.tsx`     | 검색                            |
| `Wishlist.tsx`   | 관심 상품                       |

**새 아이콘 추가 규칙**:

1. lucide-react에서 먼저 검색
2. 없으면 `resources/icons/`에 SVG 컴포넌트로 추가
3. 컴포넌트는 `SVGProps<SVGSVGElement>`를 props로 받고 `className`을 통해 크기/색상 제어 가능해야 함

---

## 9. 폰트 로딩 전략

| 폰트                    | 로딩 방식          | 설정                                                                                      |
| ----------------------- | ------------------ | ----------------------------------------------------------------------------------------- |
| **Pretendard Variable** | `next/font/local`  | `src: "./PretendardVariable.woff2"`, `variable: "--font-pretendard"`                      |
| **Outfit**              | `next/font/google` | `subsets: ["latin"]`, `weight: [300,400,500,600,700]`, `variable: "--font-outfit"`        |
| **Noto Serif KR**       | `next/font/google` | `subsets: ["latin"]`, `weight: [300,400,500,600,700]`, `variable: "--font-noto-serif-kr"` |

모든 폰트는 CSS variable로 등록되며, Tailwind의 `font-sans`/`font-serif` 유틸리티를 통해 접근합니다. Pretendard는 로컬 파일로, Outfit과 Noto Serif KR은 Google Fonts CDN을 통해 로드되며 Next.js가 자동으로 `font-display: swap` 및 서브셋 최적화를 처리합니다.

---

## 10. 글로벌 CSS 구조

파일: `app/globals.css`

```
@import "tailwindcss";         ← Tailwind v4
@import "tw-animate-css";      ← 애니메이션 유틸리티
@import "shadcn/tailwind.css"; ← shadcn/ui 베이스 스타일

@custom-variant dark (&:is(.dark *));  ← 다크 모드 활성화 조건

@theme {
  @keyframes slide-in-bottom { ... }    ← 커스텀 키프레임
  --animate-slide-in-bottom: ...;       ← 커스텀 애니메이션 유틸리티
}

@theme inline {
  --color-*: ...;   ← shadcn 시맨틱 컬러
  --font-*: ...;    ← 폰트
  --radius-*: ...;  ← radius 스케일
}

:root { ... }   ← Light 모드 CSS 변수
.dark { ... }   ← Dark 모드 CSS 변수

@layer base {
  * { @apply border-border outline-ring/50; }
  body { @apply bg-background text-foreground; }
  html { @apply font-sans; }
}
```

Tailwind v4의 `@import "tailwindcss"` 방식과 `@theme inline`으로 CSS variable을 유틸리티 클래스에 매핑합니다. v3의 `tailwind.config.js`는 사용하지 않습니다.
