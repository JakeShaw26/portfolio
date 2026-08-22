// `<ViewTransition>` (React's integration with the native View Transitions
// API) ships in the React canary channel that Next.js 16's App Router
// bundles internally — `import { ViewTransition } from "react"` resolves at
// build time even though the plain `react` package in node_modules doesn't
// export it. `@types/react`'s default `index.d.ts` doesn't declare it either
// (it's only in the `canary` type-only channel), so without this reference
// `tsc --noEmit` fails even though the real build succeeds. Same pattern as
// `src/types/images.d.ts`.
/// <reference types="react/canary" />
