const media = {
  "poopslaves": ["gallery/outcome-01.webp","gallery/outcome-02.webp","gallery/outcome-03.webp","gallery/outcome-04.webp","gallery/outcome-05.webp"],
  "value-machine": ["gallery/outcome-01.webp","gallery/outcome-02.webp","gallery/outcome-03.webp","gallery/outcome-04.webp","gallery/outcome-05.webp","gallery/outcome-06.webp","gallery/outcome-07.webp"],
  "plantievers-illusion": ["cover/detail-hero.webp","gallery/outcome-01.webp","gallery/outcome-02.webp","gallery/outcome-03.webp","gallery/outcome-04.webp","gallery/outcome-05.webp","gallery/outcome-07.webp","gallery/outcome-08.webp","gallery/outcome-09.webp"],
  "fetorium": ["cover/detail-hero.webp"],
  "plated-fantasies": ["detail/hero.jpg"],
  "closet-x": ["gallery/final-outcome-portfolio.webp","gallery/outcome-01.jpg"],
  "navigating-the-past": ["gallery/outcome-01.webp"],
  "feeding-fear": ["gallery/outcome-01.webp"],
  "forbidden-hue": ["gallery/outcome-01.webp"]
};
const videos = {
  "poopslaves": "-NzMnuMocVc",
  "plantievers-illusion": "IBD6i4xdrcI",
  "value-machine": "tD2CHMm-ljE",
  "fetorium": "fRwI4zcNDsA",
  "plated-fantasies": "fV_Jrce0Wlg",
  "closet-x": "7PBkRF7aY6c",
  "feeding-fear": "bo7ichlhwmQ"
};
const portfolioCounts = {"poopslaves":6,"plantievers-illusion":4,"value-machine":5,"fetorium":5,"plated-fantasies":4};

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
  const portfolio = Array.from({length:portfolioCounts[id] || 0}, (_,index) => `../assets/details/${id}/portfolio/spread-${String(index + 1).padStart(2,"0")}.webp`);
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
      ${videos[id] ? `<section class="project-video" aria-label="${escapeHtml(title)} video"><iframe src="https://www.youtube-nocookie.com/embed/${videos[id]}" title="${escapeHtml(title)} video" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></section>` : ""}
      ${gallery.length ? `<section class="project-gallery project-gallery--pair" aria-label="Project documentation">${gallery.map((src,index) => `<figure><img src="${src}" alt="${escapeHtml(title)} documentation ${index + 1}" loading="lazy"><figcaption class="project-caption">Project documentation ${String(index + 1).padStart(2,"0")}.</figcaption></figure>`).join("")}</section>` : ""}
      ${portfolio.length ? `<section class="portfolio-series"><header><div><h2>Portfolio series</h2><p>Original full-resolution spreads</p></div><p>Drag or scroll horizontally / 左右滑动</p></header><div class="portfolio-rail" tabindex="0" aria-label="${escapeHtml(title)} portfolio images">${portfolio.map((src,index) => `<figure><img src="${src}" alt="${escapeHtml(title)} portfolio spread ${index + 1}" loading="lazy" draggable="false"><figcaption class="project-caption">${String(index + 1).padStart(2,"0")} / ${String(portfolio.length).padStart(2,"0")}</figcaption></figure>`).join("")}</div></section>` : ""}
      <section class="project-copy"><h2>Process</h2><div><p>${escapeHtml(format)} is used as a way to examine ${escapeHtml(focus.toLowerCase())} through direct experience.</p><p>The final outcome connects the project’s research question with a concrete interaction, allowing its ideas to be encountered rather than only described.</p></div></section>
      <nav class="project-nav" aria-label="Project navigation"><a href="?id=${previous[1]}">← ${escapeHtml(previous[0])}</a><a href="?id=${next[1]}">${escapeHtml(next[0])} →</a></nav>
    </article>`;

  main.querySelectorAll(".portfolio-rail").forEach(rail => {
    let startX = 0;
    let startScroll = 0;
    rail.addEventListener("pointerdown", event => {
      startX = event.clientX;
      startScroll = rail.scrollLeft;
      rail.classList.add("is-dragging");
      rail.setPointerCapture(event.pointerId);
    });
    rail.addEventListener("pointermove", event => {
      if (rail.hasPointerCapture(event.pointerId)) rail.scrollLeft = startScroll - (event.clientX - startX);
    });
    rail.addEventListener("pointerup", event => {
      rail.releasePointerCapture(event.pointerId);
      rail.classList.remove("is-dragging");
    });
    rail.addEventListener("keydown", event => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      rail.scrollBy({left:(event.key === "ArrowRight" ? 1 : -1) * rail.clientWidth * .85, behavior:"smooth"});
    });
  });
}
