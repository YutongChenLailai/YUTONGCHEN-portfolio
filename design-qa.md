# Design QA

- Reference: https://www.arrddon.com/ and https://www.arrddon.com/work
- Local preview: http://localhost:4174/
- Scope: recreated the reference site's visual language using Yutong Chen's own projects, text, and images; no changes to the live site.
- Desktop at 1280 × 720: `/work/` has the reference-style category filters, four-column project catalogue, and a right-side project preview that updates on hover/focus. 11 project rows render; no horizontal overflow. Pretendard Variable loads locally.
- Home interaction: project information follows the pointer and stays within the viewport; keyboard focus positions the information card accessibly.
- Mobile at 390 × 844: filters remain usable, project preview and list stack vertically, and the page has no horizontal overflow.
- Interaction checks: category filters update the list; hovering a project updates the preview; project images load.
- Code checks: `node --check script.js` and `node --check work/work.js` pass.

final result: passed
