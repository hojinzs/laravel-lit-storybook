# Laravel Storybook Example

이 프로젝트는 Laravel 12와 Web Components(Lit)를 활용한 모던 웹 애플리케이션 개발 예제입니다. Storybook을 도입하여 컴포넌트 주도 개발(CDD) 환경을 구축하고, 인터랙션 테스트와 CI/CD 파이프라인까지 통합된 모범 사례를 제시합니다.

## Tech Stack

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: Lit 3 (Web Components), TailwindCSS 4
- **Build Tool**: Vite 7
- **Component Development**: Storybook 8
- **Testing**:
    - Backend: Pest 4
    - Frontend: Vitest 4
- **Language**: TypeScript

## Preview

- [Storybook Demo](https://hojinzs.github.io/laravel-lit-storybook)

## Getting Started

이 프로젝트를 로컬 환경에서 실행하는 방법입니다.

### Prerequisites (사전 요구사항)

- PHP 8.2 이상
- Composer
- Node.js 22.x 이상
- npm 10.x 이상

### Installation (설치 및 실행)

1. **프로젝트 클론**
   ```bash
   git clone <repository-url>
   cd storybook-example
   ```

2. **Backend 의존성 설치 및 설정**
   ```bash
   composer install
   cp .env.example .env
   php artisan key:generate
   touch database/database.sqlite # SQLite 사용 시
   php artisan migrate
   ```

3. **Frontend 의존성 설치**
   ```bash
   npm install
   ```

4. **개발 서버 실행**
   Laravel 서버와 Vite 개발 서버를 동시에 실행합니다.
   ```bash
   npm run dev
   ```
   또는 각각 실행:
   ```bash
   php artisan serve
   ```
   ```bash
   php artisan serve
   npm run storybook # Storybook 실행
   ```

## Guide: Adding Storybook to Laravel

이 저장소와 같이 Laravel 프로젝트에 Storybook을 처음부터 설정하는 방법입니다.

### 0. Laravel 프로젝트 생성

```bash
laravel new lit-project
cd lit-project
```

### 1. Web Component (Lit) 설치

프로젝트 루트 디렉토리에서 다음 명령어를 실행하여 lit을 설치합니다.

```bash
npm install lit
```

Storybook 에서는 `package.json`의 의존성을 보고 라이브러리에 맞는 renderer를 자동으로 설치합니다. `lit`이나 `react` 같은 라이브러리가 설치되어 있어야 Storybook이 정상적으로 초기화됩니다.

### 2. Storybook 설치

프로젝트 루트 디렉토리에서 다음 명령어를 실행합니다.

```bash
npx storybook@latest init
```

### 3. Storybook 디렉토리 설정 수정

Storybook이 설치되면 두 개의 폴더가 생성됩니다.

1. `.storybook`: Storybook 설정 파일 디렉토리
2. `stories`: 예제 컴포넌트와 문서 디렉토리

Laravel의 구조에 맞게 리소스를 관리하기 위해 `.storybook/main.ts` (또는 .js) 파일을 수정하여 `resources/js` 디렉토리를 바라보도록 설정합니다.

```javascript
const config = {
    // ...
    "stories": [
        "../resources/js/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    ],
    // ...
}
```

### 4. Storybook 실행

```bash
npm run storybook
```

브라우저에서 `http://localhost:6006`으로 접속하여 Storybook을 확인할 수 있습니다.

## Development Workflow

### Storybook

컴포넌트 개발 및 문서는 Storybook을 통해 관리됩니다.

```bash
npm run storybook
```
- 브라우저에서 `http://localhost:6006` 접속
- 스토리 파일 위치: `resources/js/**/*.stories.ts`

### Testing

**Frontend (Component & Logic)**
Vitest를 사용하여 컴포넌트와 유틸리티를 테스트합니다.
```bash
npx vitest
```

**Backend (Laravel)**
Pest를 사용하여 API 및 백엔드 로직을 테스트합니다.
```bash
php artisan test
```

## Project Structure

주요 디렉토리 구조는 다음과 같습니다.

```
├── app/                  # Laravel Core Code
├── resources/
│   ├── js/
│   │   ├── components/   # Lit Web Components & Stories
│   │   └── app.ts        # Entry Point
├── .storybook/           # Storybook Configuration
└── tests/                # Pest & Vitest Tests
```

---

## About This Example (구현 가이드)

본 프로젝트가 어떻게 구성되었는지에 대한 상세 설명입니다.

### 1. Web Component (Lit) & Storybook Integration
React/Vue 대신 표준 Web Component 기술인 **Lit**을 사용하여 프레임워크 의존성을 낮추고 성능을 최적화했습니다. Storybook은 `package.json`의 의존성을 분석하여 자동으로 `@storybook/web-components-vite` 빌더를 구성합니다.

### 2. Features

- **TypeScript Support**: 모든 컴포넌트와 스토리는 TypeScript로 작성되어 타입 안정성을 보장합니다.
- **Interaction Testing**: Storybook의 `play` 함수를 활용하여 컴포넌트 내부 동작(클릭, 입력 등)을 테스트합니다.
- **API Mocking Strategy**: 외부 의존성(API 등)을 직접 import 하지 않고, **의존성 주입(Dependency Injection)** 패턴을 사용하여 테스트 용이성을 높였습니다. 
    - [상세 구현 보기: Interaction Testing API Mocking](#interaction-testing-api-mocking)

### 3. CI/CD

GitHub Actions를 통해 코드 품질을 관리합니다.
- **Test Workflow**: `.github/workflows/storybook_test.yml` (Vitest 실행)
- **Deployment**: `.github/workflows/storybook.yml` (GitHub Pages 배포)

---

### Interaction Testing API Mocking (상세)

예제 코드: [todo-app.component.ts](/resources/js/components/todo-app.component.ts)

Storybook에서 API 호출 없이 컴포넌트의 인터랙션 테스트를 할 수 있습니다.

#### API Mocking

Storybook에서 API 모킹은 일반적으로 [msw](https://mswjs.io/)를 권장합니다. 하지만 msw를 이용한 모킹은 vitest 환경에서는 별도의 설정이 필요하고 복잡해질 수 있습니다. 이 프로젝트에서는 **WEB Component에 API 객체를 주입(Injection)**하는 단순하고 강력한 방법을 사용합니다.

```typescript
// 컴포넌트 정의 (API를 생성자 인자로 받음)
export class TodoApp extends HTMLElement {
    constructor(private api: ApiClient = defaultApi) {
        super();
        this.attachShadow({ mode: 'open' });
    }
    // ...
}
```

```typescript
// Storybook용 Mock 주입
customElements.define('todo-app-story', class extends TodoApp {
    constructor() {
        super(mockApi); // Mock API 주입
    }
});

const meta: Meta<Args> = {
    title: 'Todo/App',
    component: 'todo-app-story',
    render: () => html`<todo-app-story></todo-app-story>`
};
```

## Contact

프로젝트 관련 문의는 github issue에 남겨주세요.

- Author: [hojinzs](https://github.com/hojinzs)
- Blog: https://blog.moncher.xyz