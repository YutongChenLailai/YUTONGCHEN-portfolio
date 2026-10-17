const detailBase = "project/?id=";
const projects = [
  ["PoopSlaves", "poopslaves", "Speculative VR system.", "VR · interaction · research", "2025", "Speculative systems", ["Design", "Research"]],
  ["Value Machine", "value-machine", "Participatory art-market critique.", "installation · authorship · participation", "2025", "Authorship · cultural value", ["Art", "Design"]],
  ["Plantiever’s Illusion", "plantievers-illusion", "Moving-image installation.", "film · installation · cultural symbols", "2024", "Cultural symbols · memory", ["Art"]],
  ["Fetorium", "fetorium", "Perceiving smell without physical odor.", "interactive installation · experimental media art", "2024", "Olfaction · perception", ["Art", "Design"]],
  ["Plated Fantasies", "plated-fantasies", "Reframing food perception.", "sensory interaction · perception", "2024", "Food · sensory experience", ["Art", "Design"]],
  ["Closet X", "closet-x", "AI wardrobe interface.", "UX · AI recognition · virtual try-on", "2024", "AI · wardrobe", ["Design", "Research"]],
  ["Navigating the Past", "navigating-the-past", "Urban memory in augmented reality.", "AR · heritage · urban experience", "2024", "Urban memory · heritage", ["Design", "Research"]],
  ["VIVID", "vivid", "Revisiting community memories with AI.", "human–AI interaction · participatory design", "2026", "Human–AI co-creation", ["Design", "Research"]],
  ["Feeding Fear / PEEEP", "feeding-fear", "Experimental moving image.", "video art · social psychology", "2023", "Fear · social psychology", ["Art"]],
  ["Drown in Algae", "drown-in-algae", "Ecological witnessing.", "bio-art · coastal ecology · installation", "2025", "Ecology · environmental value", ["Art", "Design"]],
  ["The Forbidden Hue", "forbidden-hue", "Heritage through virtual play.", "VR game · heritage · narrative", "2023", "Heritage · narrative", ["Art", "Design"]]
];
window.portfolioProjects = projects;

const grid = document.querySelector(".work-grid");
if (grid) {
  projects.forEach(([title, slug, copy, medium, year], index) => {
    const card = document.createElement("a");
    card.className = `project project-${index + 1}`;
    card.href = detailBase + slug;
    const extension = slug === "closet-x" || slug === "drown-in-algae" ? "jpg" : "webp";
    card.innerHTML = `<img src="assets/projects/${slug}.${extension}" alt="${title}" loading="${index < 3 ? "eager" : "lazy"}"><span class="meta"><strong>${title}</strong><span class="description">${copy}</span><span class="category">${medium}</span><span class="year">${year}</span></span>`;
    grid.append(card);
  });

  let activeProject = null;
  let pointerAction = false;
  document.addEventListener("pointerdown", () => { pointerAction = true; });
  document.addEventListener("keydown", () => { pointerAction = false; });
  const positionMeta = (card, x, y) => {
    const meta = card.querySelector(".meta");
    const rect = meta.getBoundingClientRect();
    let left = x + 16;
    let top = y + 16;
    if (left + rect.width > innerWidth - 12) left = x - rect.width - 16;
    if (top + rect.height > innerHeight - 12) top = y - rect.height - 16;
    meta.style.left = `${Math.max(12, left)}px`;
    meta.style.top = `${Math.max(12, top)}px`;
  };
  grid.addEventListener("pointerover", (event) => {
    const card = event.target.closest(".project");
    if (!card) return;
    activeProject?.classList.remove("is-active");
    activeProject = card;
    card.classList.add("is-active");
    positionMeta(card, event.clientX, event.clientY);
  });
  grid.addEventListener("pointermove", (event) => {
    if (activeProject) positionMeta(activeProject, event.clientX, event.clientY);
  });
  grid.addEventListener("pointerout", (event) => {
    const card = event.target.closest(".project");
    if (card && !card.contains(event.relatedTarget)) {
      card.classList.remove("is-active");
      if (activeProject === card) activeProject = null;
    }
  });
  grid.addEventListener("focusin", (event) => {
    const card = event.target.closest(".project");
    if (!card || pointerAction || !event.target.matches(":focus-visible")) return;
    card.classList.add("is-active");
    const rect = card.getBoundingClientRect();
    positionMeta(card, rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
  grid.addEventListener("focusout", (event) => {
    const card = event.target.closest(".project");
    if (card && !card.contains(event.relatedTarget)) card.classList.remove("is-active");
  });
}

const cursor = document.querySelector(".cursor");
if (matchMedia("(pointer:fine)").matches) {
  addEventListener("pointermove", event => {
    cursor.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
    cursor.classList.add("show");
    cursor.classList.toggle("is-action", Boolean(event.target.closest("a,button")));
  });
  document.documentElement.addEventListener("mouseleave", () => cursor.classList.remove("show"));
}
