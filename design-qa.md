# Design QA

- Reference: https://www.arrddon.com/ and https://www.arrddon.com/work
- Local preview: http://localhost:4174/
- Scope: recreated the reference site's visual language using Yutong Chen's own projects, text, and images; no changes to the live site.
- Desktop at 1280 × 720: `/work/` has the reference-style category filters, four-column project catalogue, and a right-side project preview that updates on hover/focus. 11 project rows render; no horizontal overflow. Pretendard Variable loads locally.
- Home interaction: project information follows the pointer and stays within the viewport; keyboard focus positions the information card accessibly.
- Mobile at 390 × 844: filters remain usable, project preview and list stack vertically, and the page has no horizontal overflow.
- Interaction checks: category filters update the list; hovering a project updates the preview; project images load.
- Work typography and motion: the catalogue is reduced to project, one core keyword, and year. All three columns use Pretendard Variable at `clamp(18px, 1.5vw, 26px)`, weight 400, tracking `-.025em`, and line-height 1.2. Each column responds to the 42px `#ffff18` pointer. Touch and reduced-motion users receive the static layout.
- Code checks: `node --check script.js` and `node --check work/work.js` pass.

final result: passed after desktop interaction correction

- Work index uses the bundled Pretendard Variable face and the reference scale, weight, tracking and line height.
- Hovered rows preserve their original column widths while a measured character layer moves away from the pointer.
- Truncated catalogue copy keeps its original character spacing; off-screen glyphs do not animate and the visible tail fades at the text boundary.
- The homepage information card remains fixed to viewport coordinates and updates on every pointer move.
- Touch and reduced-motion layouts keep stable text instead of the character effect.
- Automated viewport checks passed at 1952, 1440, 1024, 761, 760 and 430px with zero horizontal overflow.
