# Design — the seven homepage opening scenes, built to the client's detail

19 Nov 2026. Scope: `/changes` only. `/`, `/v1`…`/v13`, `/original` stay frozen.

## Intent

The client's 15 Nov brief, point 2, gives seven opening scenes and, for each, **what to show**. The
words are already in (`lib/changes.js`, verbatim, buttons on 1 and 7, Explore Materials / Skip Intro).
The visuals are not — that is brief point 9, open since 18 Nov. This closes it.

## Goals

- Each scene shows what the client asked it to show.
- The five opening rules hold: words readable long enough, never blurred/hidden/covered, intro
  skippable, no long paragraphs, no flooring scene.
- Everything is built from code the project already has — V1's tunnel, V11's roll and winding web,
  the four stages from `oem/Curve.jsx`.

## Non-goals

- No change to V1's tunnel engine: `SCROLL_LENGTH`, `MSG_Z`, `beatTravel`, `HOLD_A/B`, the type
  scale and the rack focus all stay as they are.
- No new section on the page, no new scene, no extra scroll length.
- Nothing outside `/changes`.

## Anti-goals

- A photo montage on scene 3 — the client rules it out by name.
- Stock footage standing in for our manufacturing (standing rule 4).
- A second long scroll journey; the roll is a visual inside the existing tunnel, not a new sequence.

## Constraints

- The tunnel is CSS 3D with flat panels. A real roll means WebGL, which the project already runs
  (`kit/LazyCanvas.jsx`, the architectural page).
- No "fabric" finish exists in `lib/materials.js` — scene 2 names it, so wood/metal/stone carry it
  and fabric is flagged to the client as a missing asset.
- No roll-and-carton photograph exists. Scene 5 is therefore built, not photographed.
- Reduced motion must have a still fallback; the canvas must stop when off screen.

## Approaches considered

1. **Flat panels only.** Cheapest, no new tech — but "moving into a roll" does not read as anything,
   and there is no roll-and-carton asset to place. Rejected: it does not do what the scene asks.
2. **Fix only the unambiguous parts** (cluster mapping, scene 7, scene 6) and leave 1 and 5.
   Rejected: leaves the two scenes the client described most precisely undone.
3. **Real 3D roll, reusing V11.** Chosen. `objects/Roll.jsx` already is a roll that takes a finish as
   its surface map and has wound end caps; `v14/RawScene.jsx` already has chrome rollers and a sheet
   shader whose `uLen` makes film emerge. Gives the client literally what they asked for and invents
   no new visual vocabulary.

## The design

### One new component

`components/concepts/changes/RollStage.jsx` — a single `LazyCanvas` layer sitting **behind** the
message cards in the hero, not inside the CSS 3D scene (a canvas inside a 3D transform rasterises
flat and costs compositing; behind also guarantees it never covers the words).

It takes the hero's `travel` value and shows:

- **Scene 1** — a sheet of finished film running off chrome rollers and winding onto a roll, looping
  continuously. V14's `Sheet` shader and `Machine` rollers, cut down: `uLen` on a loop instead of
  scroll, no hopper, no pellets, no screens. Finish map is a real catalogue finish.
- **Scene 5** — the same roll at rest, with a matching carton beside it, both carrying a small
  `Your Brand` mark. Carton is a `RoundedBox` in the roll's own core colour. Subtle, material in
  front: the client's words.

Opacity and scale are driven by distance from that scene's plateau, so it arrives and leaves with
the scene. `frameloop` is off outside scenes 1 and 5. Under `prefers-reduced-motion` the sheet and
the roll do not rotate — the composition is simply there.

### Changes inside `changes/Hero.jsx`

| Scene | Shows now | Shows after |
|---|---|---|
| 1 Behind Every Surface | nothing | the roll stage, film winding on |
| 2 The finish your range is missing | cast swatches *(wrong set)* | wood, stone and metal — `arch` + `deco` |
| 3 Cast films | architectural swatches *(wrong set)* | **three** cast panels, not twelve — one restrained visual, no montage |
| 4 Choose the look | decorative swatches | finish variations; anything unmade carries a `Concept` tag |
| 5 Your Brand | everything | the roll stage, roll + carton marked Your Brand |
| 6 Choose. Test. Approve. Produce. | everything | the four stage names as a hairline row under the headline |
| 7 The Next Great Surface | stock factory-at-night video | **clear screen** — video dropped, no panels, words still |

Mechanically that is: `CLUSTERS` re-pointed scene by scene (cast → scene 3 at `n: 3`, arch+deco →
scene 2, deco variations → scene 4), `CLOSING_VIDEO` and its `data-depth` backdrop removed, and a
`stages` field on scene 6 in `lib/changes.js` rendered as the same `grid-cols-[48px_1fr]` hairline
row the enquiry section uses.

Scene 6's four stage names come from `STAGES` in `oem/Curve.jsx`, which gains an `export`. No
output changes anywhere else.

### Opening rules

- *Readable long enough* — unchanged; `HOLD_A/HOLD_B` already hold each message.
- *Never blurred, hidden or covered* — the rack focus is sharp at every hold, and the existing
  centre-clearance rule already fades panels that would cross a card. The roll sits behind the text.
  Scene 3 going from twelve panels to three removes the busiest offender.
- *Skip* — already there.
- *No long paragraphs* — the copy is the client's, untouched.
- *Flooring* — no scene, and none added.

## Left to the builder

Finish choice for the roll (a metallic from `MATS`), carton proportions, the exact fade window
either side of each plateau, and where the `Your Brand` mark sits on the carton.

## Open with the client — not blockers, but flag in the next reply

1. Scene 4: which finishes in the catalogue are **real products**? Anything unmade must be marked as
   a concept and we cannot tell which is which. Until they answer, scene 4 shows only existing
   catalogue finishes and marks nothing — honest, but it under-delivers "develop your own".
2. Scene 2 names **fabric**; there is no fabric finish in the library.
3. Scene 1 says "a *real* film finish" — the roll's surface is currently a stock photograph.
