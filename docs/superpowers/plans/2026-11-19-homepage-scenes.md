# Homepage Opening Scenes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give each of the seven opening scenes on `/changes` the visual the client's 15 Nov brief asks it to show.

**Architecture:** V1's CSS 3D depth tunnel is unchanged. The flying panel clusters are re-pointed scene by scene, scene 7's stock video is removed, scene 6 gains a four-stage text row, and one new WebGL layer (`RollStage`) sits behind the message cards to carry scene 1's winding roll and scene 5's roll-and-carton.

**Tech Stack:** Next.js 16 App Router, JavaScript, React 19, @react-three/fiber 9 + drei 10 + three 0.187 (all already installed), Tailwind v4 tokens.

**Spec:** `docs/superpowers/specs/2026-11-19-homepage-scenes-design.md`

## Global Constraints

- **Scope is `/changes` only.** `/`, `/v1`-`/v13` and `/original` are frozen. `components/concepts/v1/Hero.jsx` and `components/Lab.jsx` are write-protected.
- **This project has no test runner and browser automation is forbidden** (the user's machine is low-powered; a Playwright run made it unusable). Verification is exactly `npx eslint app components lib` and `npx next build`, plus a named visual check the user performs. Do not add a test framework - CLAUDE.md forbids new libraries.
- **Do not change V1's tunnel engine:** `SCROLL_LENGTH = 1100`, `MSG_Z`, `HOLD_D = -400`, `PLATEAU`, `HOLD_A = .16`, `HOLD_B = .12`, `beatTravel`, `easeIO`, the `H_STYLE`-`H6_STYLE` scale, `headStyle`, the rack-focus blur maths.
- **Copy is the client's and is already correct in `lib/changes.js`.** Do not reword, retitle or re-break any heading or supporting line.
- **Never apply `text-transform: uppercase` to a technical value** - CSS turns a micro sign into a capital M.
- **No new dependency.** Everything needed is installed.
- **Do not commit** unless the user asks.

## Review Focus

1. **WebGL unavailable or context lost** - the seven scenes and their words must still render; the canvas layer must never be load-bearing for the tunnel.
2. **`prefers-reduced-motion: reduce`** - the roll and the web must not rotate or scroll; the composition is simply present and still.
3. **Scrolled past the hero** - `frameloop` must be off outside scenes 1 and 5, or the canvas renders for the whole page.
4. **390px width** - scene 3's panels must not crowd the headline, and the roll composition must still read rather than crop to a sliver.
5. **Texture fails to load** (Unsplash blocked or offline) - the roll must render as a plain material, not black or invisible.

---

### Task 1: Re-point the panel clusters, scene by scene

**Files:**
- Modify: `components/concepts/changes/Hero.jsx` - the `CLUSTERS` const and the `cat` line inside the cluster loop

**Interfaces:**
- Produces: `CLUSTERS` entries whose `cat` may now be a string, an array of strings, or `null`.

- [ ] **Step 1: Replace `CLUSTERS` so each cluster carries the material its scene asks for**

The current list is one scene out of step: scene 2 gets cast swatches, scene 3 gets architectural, scene 4 gets decorative. Keep the existing `z` values (they already land a cluster as its message is read); change the **category and the count** per scene:

| cluster `z` | scene | `cat` | `n` |
|---|---|---|---|
| `-3000` | 02 the finish your range is missing | `['arch', 'deco']` | 12 |
| `-6200` | 03 cast films | `'cast'` | **3** |
| `-9400` | 04 choose the look | `null` (all) | 12 |
| `-12600` | 05 your brand | *removed* | - |
| `-15800` | 06 choose. test. approve. produce. | `null`, `offset: 13` | **5** |

Scene 3 drops from twelve panels to three: the client says "one restrained material or application visual only" and "do not turn this scene into a photo montage". Scene 5's cluster goes because the roll stage (Task 4) is that scene's visual and the client asks to "let the material remain the focus". Scene 6 thins to five so the tunnel empties toward scene 7's clear screen.

Give scene 3's cluster `spread: 1400` so three panels do not scatter across the whole beat.

- [ ] **Step 2: Let `cat` take an array**

In the `CLUSTERS.forEach` body, the line `const list = cat ? MATS.filter(m => m.cat === cat) : MATS;` must also accept an array. Nothing else in the loop changes.

- [ ] **Step 3: Record the scene-4 decision as a comment above `CLUSTERS`**

Scene 4 says any unmade finish must be marked as a concept. We cannot tell which of the 21 entries in `lib/materials.js` are real products, so scene 4 shows catalogue finishes only and invents no variations to mark. Say that in the comment, and that it is question 1 for the client.

- [ ] **Step 4: Verify**

Run: `npx eslint app components lib`
Expected: clean, no new warnings.

---

### Task 2: Clear screen on scene 7

**Files:**
- Modify: `components/concepts/changes/Hero.jsx` - the `BACKDROP_Z` and `CLOSING_VIDEO` consts, the backdrop `div`, the `Video` and `VIDEO` imports

**Interfaces:**
- Produces: a hero with no `<Video>` in it. `chapter` and `setChapter` stay - the HUD still reads them.

- [ ] **Step 1: Remove the closing shot**

Delete the `BACKDROP_Z` and `CLOSING_VIDEO` consts, the `<div data-depth={BACKDROP_Z}>` block with its `<Video>` and gradient overlay, and the now-unused `Video` and `VIDEO` imports. Leave `chapter`, `setChapter` and `SPLITS` alone.

Why: the client's scene 7 says "End on a clear screen. Keep the words still and easy to read", and standing rule 4 forbids stock footage standing in for our production - `VIDEO.factoryNight` is a stock aerial of someone else's factory.

- [ ] **Step 2: Comment where the backdrop was**

One line recording that scene 7 is intentionally empty, so nobody puts a visual back.

- [ ] **Step 3: Verify**

Run: `npx eslint app components lib` then `npx next build`
Expected: both clean, and no "Video is defined but never used".

---

### Task 3: The four-stage preview on scene 6

**Files:**
- Modify: `components/concepts/oem/Curve.jsx:15` - add `export` to `STAGES`
- Modify: `lib/changes.js` - add `stages: true` to scene 6
- Modify: `components/concepts/changes/Hero.jsx` - render the row

**Interfaces:**
- Consumes: `STAGES` from `../oem/Curve` - `[string, string][]`, four entries, each `[title, description]`.
- Produces: a `SEQUENCE` entry may carry `stages: true`.

- [ ] **Step 1: Export `STAGES` from `components/concepts/oem/Curve.jsx`**

Change `const STAGES = [` to `export const STAGES = [`. Nothing else in that file. One source, so the four names cannot drift from the OEM page's.

- [ ] **Step 2: Flag scene 6 in `lib/changes.js`**

Add `stages: true` to the sixth `SEQUENCE` entry (`head: ["Choose. Test.", "Approve. Produce."]`). Do not touch its `head`, `sub` or `label`.

- [ ] **Step 3: Render the row in `changes/Hero.jsx`**

Below the `<p className="v1h-sub">` supporting line, when `m.stages` is set, render the four `STAGES` titles as a single row: mono, `11px`, `letter-spacing: .14em`, uppercase, `heroMuted`, each title preceded by its index (`01`-`04`) in brass `#c2a274`, items separated by a `heroLine` hairline. Give the row `className="v1h-sub"` so it fades in with the supporting line on the `[data-on]` rule the headline already drives.

Titles only, not the descriptions - the client asks for "a short preview" and the opening rules forbid long paragraphs in these scenes.

- [ ] **Step 4: Verify**

Run: `npx eslint app components lib` then `npx next build`
Expected: both clean.

- [ ] **Step 5: Check the frozen side did not move**

Run: `git diff --stat components/concepts/oem/Curve.jsx`
Expected: one line changed - the `export` keyword only.

---

### Task 4: `RollStage` - scene 1's winding roll, scene 5's roll and carton

**Files:**
- Create: `components/concepts/changes/RollStage.jsx`
- Modify: `components/concepts/changes/Hero.jsx` - expose travel, mount the layer

**Interfaces:**
- Consumes: `Roll` from `../objects/Roll` (`<Roll map radius length lite emissive />`, axis along X); `LazyCanvas` and `Studio` from `../kit/LazyCanvas`; `U` and `MATS` from `@/lib/materials`.
- Produces: `export default function RollStage({ st, plateaus })`, where `st` is a ref whose `.current.travel` the hero writes every frame and `plateaus` is `[number, number]` - the travel values scene 1 and scene 5 are held at (`PLATEAU[0]` and `PLATEAU[4]`).

- [ ] **Step 1: Expose the hero's travel through a ref**

In `changes/Hero.jsx`, add `const st = useRef({ travel: 0 });` beside the other refs, and write `st.current.travel = travel` at the end of `tickHero`. Do not change how `travel` is computed.

- [ ] **Step 2: Build `RollStage`**

A `LazyCanvas` with `camera={{ position: [0, 0.6, 4.2], fov: 38 }}`, `style={{ position: 'absolute', inset: 0 }}` and a transparent clear. Inside: `<Studio />`, a scene-1 group and a scene-5 group.

Presence per scene, computed in one `useFrame` from `st.current.travel`:
`p = clamp01(1 - Math.abs(travel - plateau) / 1200)`, eased with the tunnel's own `-(Math.cos(Math.PI * x) - 1) / 2`. A group is `visible` only while its `p > 0.01`, and its `scale` lerps `0.88 -> 1` across `p` so it arrives with the message instead of sitting there waiting.

**Scene 1 - a film finish moving into a roll.** Two chrome cylinders (`meshStandardMaterial color="#d9d6d0" metalness={1} roughness={0.12}`, rotated `[0, 0, Math.PI / 2]`, as `v14/RawScene.jsx`'s `Machine` does), a flat web plane carrying the finish texture passing over them, and a `Roll` taking it up. The web moves by advancing `map.offset.x` each frame while the `Roll` rotates on X at the matching rate, so the finish visibly travels into the roll.

**Scene 5 - roll and carton.** One `Roll` at rest with a `RoundedBox` carton beside it, both carrying a small `YOUR BRAND` mark. Build the mark as a `CanvasTexture`, the way `objects/Roll.jsx` builds its end cap - do not add a text library. Keep it subtle: the client says let the material remain the focus.

Pick the finish from `MATS` (a metallic reads best under `Studio`'s lightformers) and load it through `U(id, 800)`.

- [ ] **Step 3: Handle the Review Focus cases**

- **Reduced motion:** read `matchMedia("(prefers-reduced-motion: reduce)").matches` once, the pattern at `components/concepts/shared/Video.jsx:17`; when set, skip the roll rotation and the `map.offset` advance.
- **Off screen:** `LazyCanvas` already stops the frameloop when the element leaves the viewport. Also drive the canvas `style.opacity` from `Math.max(p1, p5)` so it is invisible between scenes.
- **Texture failure:** give every mesh a `color` as well as a `map`, so a failed texture renders as a plain material rather than black.
- **Narrow screens:** `LazyCanvas`'s `FovFit` already widens the FOV below 1.6 aspect. Nothing extra needed.
- **No WebGL:** the canvas is a sibling of the tunnel, never a parent, so a failed context leaves the words untouched. Confirm by reading the mount, not by assuming.

- [ ] **Step 4: Mount it in the hero, behind the cards**

In the sticky stage `div`, render `<RollStage st={st} plateaus={[PLATEAU[0], PLATEAU[4]]} />` **before** the `sceneRef` div, and give `sceneRef` `zIndex: 1`. The canvas sits behind the message cards - the opening rules say words must never be covered by moving products.

- [ ] **Step 5: Verify**

Run: `npx eslint app components lib` then `npx next build`
Expected: both clean.

- [ ] **Step 6: Ask the user to look**

Start `npx next dev`, give them `http://localhost:3000/changes`, and ask for a screenshot of scene 1 and scene 5. Name the tell so they know the page is the right one: `/changes` has no V1-V13 switcher and says "Request samples". **Stop the server once they have looked** (`Get-NetTCPConnection -LocalPort 3000` finds a stuck one).

Do not guess at how it looks - the handoff records several rounds lost that way.

---

### Task 5: Update the handoff

**Files:**
- Modify: `../HANDOFF-SITE.md`

- [ ] **Step 1: Add a dated section**

What changed, what is verified (`eslint` and `next build`, plus whatever the user confirmed by eye), and what is still open: the three client questions from the spec, and whether the roll reads as the client meant it.

- [ ] **Step 2: Mark brief point 9 done**

It is listed as open in sections 8, 9 and 15. Record it as done in the single new entry rather than editing all three.
