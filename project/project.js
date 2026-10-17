const media = {
  "poopslaves": ["gallery/outcome-01.webp","gallery/outcome-02.webp","gallery/outcome-03.webp","gallery/outcome-04.webp","gallery/outcome-05.webp"],
  "value-machine": ["gallery/outcome-01.webp","gallery/outcome-02.webp","gallery/outcome-03.webp","gallery/outcome-04.webp","gallery/outcome-05.webp","gallery/outcome-06.webp","gallery/outcome-07.webp"],
  "plantievers-illusion": ["cover/detail-hero.webp","gallery/outcome-01.webp","gallery/outcome-02.webp","gallery/outcome-03.webp","gallery/outcome-04.webp","gallery/outcome-05.webp","gallery/outcome-07.webp","gallery/outcome-08.webp","gallery/outcome-09.webp"],
  "fetorium": ["cover/detail-hero.webp","portfolio/spread-01.webp","portfolio/spread-02.webp","portfolio/spread-03.webp","portfolio/spread-04.webp","portfolio/spread-05.webp"],
  "plated-fantasies": ["detail/hero.jpg","portfolio/spread-01.webp","portfolio/spread-02.webp","portfolio/spread-03.webp","portfolio/spread-04.webp"],
  "closet-x": ["gallery/final-outcome-portfolio.webp","gallery/outcome-01.jpg"],
  "navigating-the-past": ["gallery/outcome-01.webp"],
  "feeding-fear": ["gallery/outcome-01.webp"],
  "forbidden-hue": ["gallery/outcome-01.webp"]
};

const main = document.querySelector("#project-main");
const slug = new URLSearchParams(location.search).get("id");
const projectCatalogue = window.portfolioProjects || [];
const projectIndex = projectCatalogue.findIndex(item => item[1] === slug);
const selectedProject = projectCatalogue[projectIndex];
const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[char]);

if (!selectedProject) {
  document.title = "Project not found — Yutong Chen";
  main.innerHTML = `<section class="project-error"><h1>Project not found</h1><a href="../work/">Return to Work</a></section>`;
} else {
  const [title, id, description, format, year, focus, categories] = selectedProject;
  const hero = `../assets/details/${id}/cover/cover.${id === "closet-x" || id === "drown-in-algae" ? "jpg" : "webp"}`;
  const gallery = (media[id] || []).map(path => `../assets/details/${id}/${path}`);
  const previous = projectCatalogue[(projectIndex - 1 + projectCatalogue.length) % projectCatalogue.length];
  const next = projectCatalogue[(projectIndex + 1) % projectCatalogue.length];
  document.title = `${title} — Yutong Chen`;
  document.querySelector('meta[name="description"]').content = `${title}: ${description}`;
  main.innerHTML = `
    <article>
      <header class="project-heading">
        <h1>${escapeHtml(title)}</h1>
        <div class="project-intro">
          <p class="project-lede">${escapeHtml(description)} ${escapeHtml(focus)} explored through ${escapeHtml(format.toLowerCase())}.</p>
          <dl class="project-meta"><dt>Year</dt><dd>${escapeHtml(year)}</dd><dt>Format</dt><dd>${escapeHtml(format)}</dd><dt>Focus</dt><dd>${escapeHtml(focus)}</dd><dt>Fields</dt><dd>${escapeHtml(categories.join(" · "))}</dd></dl>
        </div>
      </header>
      <figure class="project-hero"><img src="${hero}" alt="${escapeHtml(title)} project image" fetchpriority="high"><figcaption class="project-caption">${escapeHtml(title)} — project documentation.</figcaption></figure>
      <section class="project-copy"><h2>Overview</h2><div><p>${escapeHtml(description)}</p><p>The project brings ${escapeHtml(focus.toLowerCase())} into an experience that can be entered, tested and discussed. The work develops through research, prototyping and visual documentation.</p></div></section>
      ${gallery.length ? `<section class="project-gallery project-gallery--pair" aria-label="Project documentation">${gallery.map((src,index) => `<figure><img src="${src}" alt="${escapeHtml(title)} documentation ${index + 1}" loading="lazy"><figcaption class="project-caption">Project documentation ${String(index + 1).padStart(2,"0")}.</figcaption></figure>`).join("")}</section>` : ""}
      <section class="project-copy"><h2>Process</h2><div><p>${escapeHtml(format)} is used as a way to examine ${escapeHtml(focus.toLowerCase())} through direct experience.</p><p>The final outcome connects the project’s research question with a concrete interaction, allowing its ideas to be encountered rather than only described.</p></div></section>
      <nav class="project-nav" aria-label="Project navigation"><a href="?id=${previous[1]}">← ${escapeHtml(previous[0])}</a><a href="?id=${next[1]}">${escapeHtml(next[0])} →</a></nav>
    </article>`;
}
