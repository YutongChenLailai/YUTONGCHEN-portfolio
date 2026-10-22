const detailBase = "project/?id=";
const projects = [
  ["How Community Feedback Affects Vibe Coding Creative Processes", "community-feedback-vibe-coding", "A bounded workflow for turning community feedback into AI-mediated app revisions.", "HCI · vibe coding · community feedback", "2027", "Human–AI co-creation · collaborative iteration", ["Research"]],
  ["Sketches as Previews: How Humans Sketch Visual Representations for Videos", "sketches-as-previews", "How people turn videos into storyboard-style visual previews.", "HCI · visual representation · video previews", "2027", "Visual communication · collaborative evaluation", ["Research"]],
  ["VIVID", "vivid", "Revisiting community memories with AI.", "human–AI interaction · participatory design", "2026", "Human–AI co-creation", ["Design", "Research"]],
  ["PoopSlaves", "poopslaves", "Speculative VR system.", "VR · interaction · research", "2025", "Speculative systems", ["Design", "Research"]],
  ["Value Machine", "value-machine", "Participatory art-market critique.", "installation · authorship · participation", "2025", "Authorship · cultural value", ["Art", "Design"]],
  ["Drown in Algae", "drown-in-algae", "Ecological witnessing.", "bio-art · coastal ecology · installation", "2025", "Ecology · environmental value", ["Art", "Design"]],
  ["Plantiever’s Illusion", "plantievers-illusion", "Moving-image installation.", "film · installation · cultural symbols", "2024", "Cultural symbols · memory", ["Art"]],
  ["Fetorium", "fetorium", "Perceiving smell without physical odor.", "interactive installation · experimental media art", "2024", "Olfaction · perception", ["Art", "Design"]],
  ["Plated Fantasies", "plated-fantasies", "Reframing food perception.", "sensory interaction · perception", "2024", "Food · sensory experience", ["Art", "Design"]],
  ["Closet X", "closet-x", "AI wardrobe interface.", "UX · AI recognition · virtual try-on", "2024", "AI · wardrobe", ["Design", "Research"]],
  ["Navigating the Past", "navigating-the-past", "Urban memory in augmented reality.", "AR · heritage · urban experience", "2024", "Urban memory · heritage", ["Design", "Research"]],
  ["Feeding Fear / PEEEP", "feeding-fear", "Experimental moving image.", "video art · social psychology", "2023", "Fear · social psychology", ["Art"]],
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
    const imageName = slug === "community-feedback-vibe-coding" ? "community-feedback-vibe-coding-20261022.webp" : `${slug}.${extension}`;
    card.innerHTML = `<img src="assets/projects/${imageName}" alt="${title}" loading="${index < 3 ? "eager" : "lazy"}"><span class="meta"><strong>${title}</strong><span class="description">${copy}</span><span class="category">${medium}</span><span class="year">${year}</span></span>`;
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
if (cursor && matchMedia("(pointer:fine)").matches) {
  addEventListener("pointermove", event => {
    cursor.style.transform = `translate3d(${event.clientX}px,${event.clientY}px,0)`;
    cursor.classList.add("show");
    cursor.classList.toggle("is-action", Boolean(event.target.closest("a,button")));
  });
  document.documentElement.addEventListener("mouseleave", () => cursor.classList.remove("show"));
} else if (cursor) {
  const interactive = "a,button,summary,[role='button'],input,select,textarea,label[for]";
  let touchActive = false;
  let hideTimer = 0;

  addEventListener("touchstart", event => {
    const touch = event.touches[0];
    if (!touch || !event.target.closest(interactive) || event.target.closest(".work-table")) return;
    clearTimeout(hideTimer);
    touchActive = true;
    cursor.style.transform = `translate3d(${touch.clientX}px,${touch.clientY}px,0)`;
    cursor.classList.add("show", "is-action", "is-touch");
  }, {passive:true});

  addEventListener("touchmove", event => {
    const touch = event.touches[0];
    if (!touchActive || !touch) return;
    cursor.style.transform = `translate3d(${touch.clientX}px,${touch.clientY}px,0)`;
  }, {passive:true});

  const releaseTouch = () => {
    if (!touchActive) return;
    touchActive = false;
    hideTimer = setTimeout(() => cursor.classList.remove("show", "is-action", "is-touch"), 90);
  };
  addEventListener("touchend", releaseTouch, {passive:true});
  addEventListener("touchcancel", releaseTouch, {passive:true});
}
