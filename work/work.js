const projectKeywords = {
  "community-feedback-vibe-coding": "Community feedback",
  "sketches-as-previews": "Visual representation",
  "poopslaves": "Speculation",
  "value-machine": "Authorship",
  "plantievers-illusion": "Memory",
  "fetorium": "Olfaction",
  "plated-fantasies": "Perception",
  "closet-x": "AI",
  "navigating-the-past": "AR",
  "vivid": "Co-creation",
  "feeding-fear": "Fear",
  "drown-in-algae": "Ecology",
  "forbidden-hue": "Heritage"
};
const workProjects = window.portfolioProjects.map(([title, slug, description, format, year, focus, categories]) => ({
  title, slug, description, format, year, focus, categories, keyword: projectKeywords[slug] || focus || format,
  image: `../assets/projects/${slug}.${slug === "closet-x" || slug === "drown-in-algae" ? "jpg" : "webp"}`,
  url: `../project/?id=${slug}`
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

const escapeText = text => String(text ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const segmentText = text => Intl.Segmenter ? [...new Intl.Segmenter("en", {granularity:"grapheme"}).segment(text)] : [...text].map((segment, index) => ({segment, index}));
const waveText = text => `<span class="pointer-title"><span class="pointer-title__base">${escapeText(text)}</span><span class="pointer-title__wave" aria-hidden="true">${segmentText(text).filter(({segment}) => !/\s/.test(segment)).map(({segment, index}) => `<span class="pointer-title__char" data-start="${index}" data-length="${segment.length}">${escapeText(segment)}</span>`).join("")}</span></span>`;

const measureWaveText = row => {
  row.querySelectorAll(".pointer-title").forEach(title => {
    const base = title.querySelector(".pointer-title__base");
    const text = base.firstChild;
    const origin = title.getBoundingClientRect();
    const range = document.createRange();
    title.classList.toggle("is-truncated", base.scrollWidth > title.clientWidth + 1);
    title.querySelectorAll(".pointer-title__char").forEach(char => {
      const start = Number(char.dataset.start);
      range.setStart(text, start);
      range.setEnd(text, start + Number(char.dataset.length));
      const rect = range.getBoundingClientRect();
      char.hidden = rect.left >= origin.right;
      char.style.left = `${rect.left - origin.left}px`;
      char.dataset.left = rect.left;
      char.dataset.right = rect.right;
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
    row.setAttribute("aria-label", `${project.title}, ${project.keyword}, ${project.year}`);
    row.innerHTML = `<span class="work-cell work-title">${waveText(project.title)}</span><span class="work-cell work-format">${waveText(project.keyword)}</span><span class="work-cell work-year">${waveText(project.year)}</span>`;
    row.addEventListener("pointerenter", () => updatePreview(project));
    row.addEventListener("focus", () => updatePreview(project));
    table.append(row);
  });
  count.textContent = `${visible.length} projects`;
  if (!visible.includes(activeProject)) updatePreview(visible[0] || workProjects[0]);
};

renderFilters();
renderRows();
updatePreview(activeProject);

if (matchMedia("(prefers-reduced-motion:no-preference)").matches) {
  const marker = document.createElement("span");
  marker.className = "work-pointer";
  marker.setAttribute("aria-hidden", "true");
  document.body.append(marker);

  const rowsInMotion = new Set();
  const offsets = new WeakMap();
  let pointer = null;
  let frame = 0;

  const scheduleWave = () => {
    if (!frame) frame = requestAnimationFrame(animateWave);
  };

  const animateWave = () => {
    frame = 0;
    rowsInMotion.forEach(row => row.querySelectorAll(".pointer-title__char").forEach(char => {
      const state = offsets.get(char) || {value:0, target:0};
      state.target = 0;
      offsets.set(char, state);
    }));

    if (pointer) {
      const title = pointer.field.querySelector(".pointer-title");
      const chars = [...pointer.field.querySelectorAll(".pointer-title__char:not([hidden])")];
      const fieldRect = title?.getBoundingClientRect();
      if (fieldRect && chars.length) {
        const gap = Math.max(23, parseFloat(getComputedStyle(pointer.field).fontSize) * .675);
        const left = chars.filter(char => (Number(char.dataset.left) + Number(char.dataset.right)) / 2 < pointer.x);
        const right = chars.filter(char => !left.includes(char));
        const fields = [...pointer.row.querySelectorAll(".work-cell")];
        const fieldIndex = fields.indexOf(pointer.field);
        const previous = fields[fieldIndex - 1]?.getBoundingClientRect();
        const next = fields[fieldIndex + 1]?.getBoundingClientRect();
        const leftRoom = left.length ? Number(left[0].dataset.left) - fieldRect.left + (previous ? fieldRect.left - previous.right - 2 : fieldRect.left) : 0;
        const rightRoom = right.length ? fieldRect.right - Number(right.at(-1).dataset.right) + (next ? next.left - fieldRect.right - 2 : 16) : 0;
        const leftShift = Math.min(24, Math.max(0, leftRoom), Math.max(0, ...left.map(char => Number(char.dataset.right) - (pointer.x - gap))));
        const rightShift = Math.min(24, Math.max(0, rightRoom), Math.max(0, ...right.map(char => pointer.x + gap - Number(char.dataset.left))));
        left.forEach(char => offsets.get(char).target = -leftShift);
        right.forEach(char => offsets.get(char).target = rightShift);
      }
    }

    let moving = false;
    rowsInMotion.forEach(row => {
      if (!row.isConnected) return rowsInMotion.delete(row);
      let rowMoving = false;
      row.querySelectorAll(".pointer-title__char").forEach(char => {
        const state = offsets.get(char);
        const delta = state.target - state.value;
        const response = pointer?.touch ? .62 : .22;
        state.value = Math.abs(delta) < .05 ? state.target : state.value + delta * response;
        char.style.setProperty("--glyph-x", `${state.value.toFixed(2)}px`);
        if (Math.abs(state.target - state.value) >= .05) moving = rowMoving = true;
      });
      if ((!pointer || pointer.row !== row) && !rowMoving && [...row.querySelectorAll(".pointer-title__char")].every(char => Math.abs(offsets.get(char).value) < .05)) {
        row.classList.remove("is-waving");
        rowsInMotion.delete(row);
      }
    });
    if (moving) frame = requestAnimationFrame(animateWave);
  };

  const updatePointer = (x, y, target, touch = false) => {
    const row = target?.closest(".work-row");
    if (!row) {
      pointer = null;
      marker.classList.remove("is-visible");
      document.body.classList.remove("work-yellow-cursor");
      return scheduleWave();
    }
    marker.classList.add("is-visible");
    document.body.classList.add("work-yellow-cursor");
    marker.style.setProperty("--pointer-x", `${x}px`);
    marker.style.setProperty("--pointer-y", `${y}px`);
    const field = target.closest(".work-cell");
    if (!rowsInMotion.has(row)) {
      measureWaveText(row);
      row.classList.add("is-waving");
      rowsInMotion.add(row);
      row.querySelectorAll(".pointer-title__char").forEach(char => offsets.set(char, {value:0, target:0}));
    }
    pointer = field ? {row, field, x:Math.round(x), touch} : null;
    scheduleWave();
  };

  const releasePointer = () => {
    pointer = null;
    marker.classList.remove("is-visible");
    document.body.classList.remove("work-yellow-cursor");
    scheduleWave();
  };

  table.addEventListener("pointermove", event => {
    if (event.pointerType !== "touch") updatePointer(event.clientX, event.clientY, event.target);
  });
  table.addEventListener("pointerdown", event => {
    if (event.pointerType === "touch") updatePointer(event.clientX, event.clientY, document.elementFromPoint(event.clientX, event.clientY), true);
  }, {passive:true});
  table.addEventListener("touchstart", event => {
    const touch = event.touches[0];
    if (touch) updatePointer(touch.clientX, touch.clientY, document.elementFromPoint(touch.clientX, touch.clientY), true);
  }, {passive:true});
  table.addEventListener("touchmove", event => {
    const touch = event.touches[0];
    if (touch) updatePointer(touch.clientX, touch.clientY, document.elementFromPoint(touch.clientX, touch.clientY), true);
  }, {passive:true});
  table.addEventListener("touchend", releasePointer, {passive:true});
  table.addEventListener("touchcancel", releasePointer, {passive:true});
  table.addEventListener("pointerleave", event => {
    if (event.pointerType !== "touch") releasePointer();
  });
}
