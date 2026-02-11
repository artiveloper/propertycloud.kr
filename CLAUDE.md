# CLAUDE.md
> Next.js + React Query project instructions for Claude Code  
> Target: Lighthouse score ≥ 90

---

## 1. Stack & Goals

### Tech Stack
- Next.js (App Router)
- React (Function Components only)
- TypeScript (strict mode)
- TanStack React Query
- nuqs (query string management)
- Tailwind CSS

### Core Goals
- Lighthouse score ≥ 90
- Minimize client-side JavaScript
- Predictable data flow
- Domain-driven architecture

---

## 2. Architecture Principles

- Domain-based directory structure (MANDATORY)
- Server Components by default
- Client Components are minimized and explicit
- Server data state is managed ONLY by React Query
- UI components contain no data-fetching logic

---

## 3. Domain-based Directory Structure

All logic must be grouped by **domain**, not by technical role.

Example:
```
domain/
  article/
    article.apis.ts
    article.types.ts
    article.models.ts
    article.hooks.ts
    article.query-keys.ts
    article.query-options.ts
    article.prefetch.ts
    index.ts
```

### Rules
- One domain = one responsibility
- `index.ts` re-exports all public APIs using `export *` pattern
- No cross-domain deep imports
    - ❌ domain/article/article.query-options
    - ✅ domain/article

---

## 4. React Query Strategy

### 4.1 Query Keys (STRICT)

#### Rules
- Query keys must be arrays
- Stable & serializable only
- NEVER inline query keys
- Params must be a single object

#### Naming Convention
```
['domain', 'scope', params?]
```

#### Example
```ts
// article.query-keys.ts
export const articleQueryKeys = {
    all: ['article'] as const,

    list: (params: { page: number; category?: string }) =>
        [...articleQueryKeys.all, 'list', params] as const,

    detail: (articleId: number) =>
        [...articleQueryKeys.all, 'detail', articleId] as const,
}
```

---

### 4.2 Query Options (MANDATORY)

- All queries MUST use shared query option factories
- No inline `useQuery({ ... })`
- Query options must define:
    - queryKey
    - queryFn
    - staleTime (optional - uses global default if omitted)
    - gcTime (optional - uses global default if omitted)

#### When to Override Cache Settings
- ✅ Override: 실시간 데이터 (짧은 staleTime 필요)
- ✅ Override: 정적 데이터 (긴 staleTime으로 캐시 효율화)
- ❌ Skip: 일반적인 리스트/상세 (global 설정 사용)

#### Example
```ts
// article.query-options.ts
import { articleQueryKeys } from './article.query-keys'
import { fetchArticleList, fetchArticleDetail } from './article.apis'

export const articleQueryOptions = {
    // 기본 케이스: global 설정 사용 (staleTime/gcTime 생략)
    list: (params: { page: number; category?: string }) => ({
        queryKey: articleQueryKeys.list(params),
        queryFn: () => fetchArticleList(params),
    }),

    // 특수 케이스: global과 다른 캐시 전략이 필요할 때만 override
    detail: (articleId: number) => ({
        queryKey: articleQueryKeys.detail(articleId),
        queryFn: () => fetchArticleDetail(articleId),
        staleTime: 5 * 60_000,   // 상세 페이지는 더 오래 캐시
        gcTime: 30 * 60_000,
    }),
}
```

---

## 5. Prefetch Strategy (IMPORTANT)

### Prefetch Philosophy
- Prefetch strategy is defined per **domain**
- Pages/layouts must NOT define prefetch logic directly
- Pages only call domain prefetch functions

---

### 5.1 When to Prefetch

#### ✅ MUST Prefetch
- List pages (SEO, LCP critical)
- Detail pages reached via internal navigation
- Primary route data

#### ⚠️ OPTIONAL Prefetch
- Secondary tabs
- Non-critical related data

#### ❌ DO NOT Prefetch
- Infinite scroll next pages
- Highly volatile or user-specific data
- Modal-only data

---

### 5.2 Domain Prefetch Pattern

```ts
// article.prefetch.ts
import { QueryClient } from '@tanstack/react-query'
import { articleQueryOptions } from './article.query-options'

export const articlePrefetch = {
    async list(
        queryClient: QueryClient,
        params: { page: number; category?: string }
    ) {
        await queryClient.prefetchQuery(
            articleQueryOptions.list(params)
        )
    },

    async detail(
        queryClient: QueryClient,
        articleId: number
    ) {
        await queryClient.prefetchQuery(
            articleQueryOptions.detail(articleId)
        )
    },
}
```

---

## 6. Server / Client Boundary

### Server Side
- Responsible for prefetching and SEO-critical data
- No React Query hooks

### Client Side
- useQuery only with shared queryOptions
- No data-fetching logic in UI components

---

## 7. URL & Query Strings

- Use `nuqs` only
- Shared parsers are mandatory
- `null` removes the query param
- Enum defaults must be explicit
- Query params must map 1:1 to query keys

---

## 8. Loading / Error / Empty States

### Loading
- Initial load handled by Server Components
- Client loading only for pagination or manual refetch

### Error
- Errors must be explicit and domain-aware
- No silent failures

### Empty
- Empty state is NOT an error
- Must explain why data is empty

---

## 9. TypeScript Rules

- ❌ any
- ❌ non-null assertion (!)
- Prefer type over interface
- Narrow types early

---

## 10. What Claude Must Do

When generating code:
1. Follow domain-based structure strictly
2. Reuse query keys, options, and prefetch
3. Optimize for Lighthouse ≥ 90
4. Explain performance decisions briefly

When unsure:
- Ask ONE precise question only

---

## 11. Code Formatting Rules (MANDATORY)

- All code MUST use **4 spaces for indentation**
- Tabs (`\t`) are NOT allowed
- 2-space indentation is NOT allowed
- Applies to:
    - TypeScript
    - JavaScript
    - JSON
    - Tailwind class formatting
    - React / JSX / TSX

Example:
```ts
function example() {
    if (true) {
        console.log('4 spaces only')
    }
}
