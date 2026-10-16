const workProjects = window.portfolioProjects.map(([title, slug, description, format, year, focus, categories]) => ({
  title, slug, description, format, year, focus, categories,
  image: `../assets/projects/${slug}.${slug === "closet-x" || slug === "drown-in-algae" ? "jpg" : "webp"}`,
  url: `https://yutongchenlailai.github.io/yutong-portfolio/#project/${slug}`
}));
const filters = document.querySelector("#work-filters");
const table = document.querySelector("#work-table");
const count = document.querySelector("#work-count");
const preview = {
  image: document.querySelector("#preview-image"),
  link: document.querySelector("#preview-link"),
  title: document.querySelector("#preview-title"),
  description: document.querySelector("#preview-description"),
  year: document.querySelector("#preview-year"),
  format: document.querySelector("#preview-format"),
  focus: document.querySelector("#preview-focus"),
  more: document.querySelector("#preview-more")
};
const categories = ["Art", "Design", "Research"];
let activeFilter = "All";
let activeProject = workProjects[0];

const escapeText = text => text.replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const waveText = text => `<span class="pointer-title"><span class="pointer-title__base">${escapeText(text)}</span><span class="pointer-title__wave" aria-hidden="true">${[...text].map(char => `<span class="pointer-title__char">${char === " " ? "&nbsp;" : escapeText(char)}</span>`).join("")}</span></span>`;

const measureWaveText = row => {
  row.querySelectorAll(".pointer-title").forEach(title => {
    const base = title.querySelector(".pointer-title__base");
    const style = getComputedStyle(base);
    const context = document.createElement("canvas").getContext("2d");
    context.font = style.font;
    const tracking = Number.parseFloat(style.letterSpacing) || 0;
    let left = 0;
    title.querySelectorAll(".pointer-title__char").forEach(char => {
      char.style.left = `${left}px`;
      left += context.measureText(char.textContent).width + tracking;
    });
  });
};

const updatePreview = (project) => {
  activeProject = project;
  preview.image.classList.add("is-loading");
  preview.image.onload = () => preview.image.classList.remove("is-loading");
  preview.image.onerror = () => preview.image.classList.remove("is-loading");
  preview.image.alt = `${project.title} project preview`;
  preview.image.src = project.image;
  preview.link.href = project.url;
  preview.title.textContent = project.title;
  preview.description.textContent = project.description;
  preview.year.textContent = project.year;
  preview.format.textContent = project.format;
  preview.focus.textContent = project.focus;
  preview.more.href = project.url;
};

const renderFilters = () => {
  filters.innerHTML = "";
  [{name:"All", count:workProjects.length}, ...categories.map(name => ({name, count:workProjects.filter(p => p.categories.includes(name)).length}))].forEach(({name, count: total}) => {
    const button = document.createElement("button");
    button.className = "work-filter";
    button.type = "button";
    button.dataset.filter = name;
    button.setAttribute("aria-pressed", String(name === activeFilter));
    if (name !== "All") button.innerHTML = `<span class="filter-dot filter-dot--${name.toLowerCase()}" aria-hidden="true"></span>`;
    button.append(document.createTextNode(name));
    const number = document.createElement("sup");
    number.className = "work-filter-count";
    number.textContent = total;
    button.append(number);
    button.addEventListener("click", () => {
      activeFilter = name;
      filters.querySelectorAll(".work-filter").forEach(filter => filter.setAttribute("aria-pressed", String(filter.dataset.filter === name)));
      renderRows();
    });
    filters.append(button);
  });
};

const renderRows = () => {
  const visible = workProjects.filter(project => activeFilter === "All" || project.categories.includes(activeFilter));
  table.innerHTML = "";
  visible.forEach(project => {
    const row = document.createElement("a");
    row.className = "work-row";
    row.href = project.url;
    row.setAttribute("role", "listitem");
    row.setAttribute("aria-label", `${project.title}, ${project.format}, ${project.focus}, ${project.year}`);
    const dots = project.categories.map(category => `<span class="category-dot category-dot--${category.toLowerCase()}" aria-hidden="true"></span>`).join("");
    row.innerHTML = `<span class="work-cell work-title">${waveText(project.title)}</span><span class="work-cell work-format">${waveText(project.format)}<span class="category-dots" aria-hidden="true">${dots}</span></span><span class="work-cell work-focus">${waveText(project.focus)}</span><span class="work-cell work-year">${project.year}</span>`;
    row.addEventListener("pointerenter", () => {
      updatePreview(project);
      measureWaveText(row);
      row.classList.add("is-waving");
    });
    row.addEventListener("pointerleave", () => row.classList.remove("is-waving"));
    row.addEventListener("focus", () => updatePreview(project));
    table.append(row);
  });
  count.textContent = `${visible.length} projects`;
  if (!visible.includes(activeProject)) updatePreview(visible[0] || workProjects[0]);
};

renderFilters();
renderRows();

if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
  table.addEventListener("pointermove", event => {
    const row = event.target.closest(".work-row");
    if (!row) return;
    row.querySelectorAll(".pointer-title__char").forEach(char => {
      const rect = char.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const distance = center - event.clientX;
      const force = Math.max(0, 76 - Math.abs(distance)) / 76;
      char.style.setProperty("--glyph-x", `${Math.sign(distance || 1) * force * 22}px`);
    });
  });
  table.addEventListener("pointerout", event => {
    const row = event.target.closest(".work-row");
    if (row && !row.contains(event.relatedTarget)) row.querySelectorAll(".pointer-title__char").forEach(char => char.style.removeProperty("--glyph-x"));
  });
}
