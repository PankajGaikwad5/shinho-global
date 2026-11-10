## Project rules

- Use JavaScript only. Create `.js` and `.jsx` files; do not add TypeScript files, type annotations, `tsconfig.json`, or TypeScript dependencies.
- Use Tailwind CSS utility classes in JSX for component styling, including responsive layouts and interaction states. Prefer existing utilities and design tokens; use arbitrary values when exact values are required. Preserve source-design inline values verbatim when an exact port requires them. Use custom CSS only when Tailwind cannot express a required effect or for global browser-level rules, and never invent utility class names.
- Keep the initial scaffold minimal. Do not add product pages, features, or visual design unless specifically requested.
- Use GSAP for coordinated timelines and scroll-driven sequences, Motion for React component transitions and interaction animation, Lenis for smooth scrolling, and Three.js through React Three Fiber and Drei for 3D scenes. Avoid duplicating an effect across animation libraries.
- Keep browser-only animation and 3D code in client components. Clean up animation contexts, listeners, and animation frames when components unmount, and respect reduced-motion preferences.
- Prefer semantic HTML, accessible controls, and responsive Tailwind classes. Do not add dependencies without a concrete need.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
