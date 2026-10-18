const media = {
  "poopslaves": ["gallery/outcome-01.webp","gallery/outcome-02.webp","gallery/outcome-03.webp","gallery/outcome-04.webp","gallery/outcome-05.webp"],
  "value-machine": ["gallery/outcome-01.webp","gallery/outcome-02.webp","gallery/outcome-03.webp","gallery/outcome-04.webp","gallery/outcome-05.webp","gallery/outcome-06.webp","gallery/outcome-07.webp"],
  "plantievers-illusion": ["cover/detail-hero.webp","gallery/outcome-01.webp","gallery/outcome-02.webp","gallery/outcome-03.webp","gallery/outcome-04.webp","gallery/outcome-05.webp","gallery/outcome-07.webp","gallery/outcome-08.webp","gallery/outcome-09.webp"],
  "fetorium": ["cover/detail-hero.webp"],
  "plated-fantasies": ["detail/hero.jpg"],
  "closet-x": ["gallery/final-outcome-portfolio.webp"],
  "navigating-the-past": ["gallery/outcome-01.webp"],
  "feeding-fear": ["gallery/outcome-01.webp"],
  "forbidden-hue": ["gallery/outcome-01.webp"]
};
const videos = {
  "poopslaves": [["-NzMnuMocVc","Main film / 主片"],["4yT4qBsznL8","Interactive outcome / 交互成果"],["fpVo-T5GLMI","CAVE dome showcase / 穹顶展示"]],
  "plantievers-illusion": [["IBD6i4xdrcI","Installation film / 装置影像"]],
  "value-machine": [["tD2CHMm-ljE","Project film / 项目影像"]],
  "fetorium": [["fRwI4zcNDsA","Project film / 项目影像"]],
  "plated-fantasies": [["fV_Jrce0Wlg","Project film / 项目影像"]],
  "closet-x": [["7PBkRF7aY6c","Project film / 项目影像"]],
  "feeding-fear": [["bo7ichlhwmQ","Project film / 项目影像"]]
};
const portfolioCounts = {"poopslaves":6,"plantievers-illusion":4,"value-machine":5,"fetorium":5,"plated-fantasies":4};
const heroOverrides = {"closet-x":"../assets/details/closet-x/gallery/outcome-01.jpg"};
const projectCopy = {
  "poopslaves": ["A rule-based virtual economy where bodily waste becomes scarce, governable value. The work makes unequal extraction tangible through constrained agency.", "一个把排泄物设为稀缺货币的推想式 VR 系统，让权力、价值与身体控制变得可感。"],
  "value-machine": ["Visitors feed a fictional artist-machine, generate images and participate in their valuation, exposing how reputation manufactures artistic worth.", "邀请观众参与艺术生产与定价，揭示声誉如何制造价值。"],
  "plantievers-illusion": ["A moving-image installation that keeps auspicious symbols recognisable while changing the conditions under which they are seen, felt and interpreted.", "以动态影像和空间装置重组传统吉祥符号，在熟悉与陌生之间激活文化记忆。"],
  "fetorium": ["An odorless interactive installation that turns facial reactions to odor-associated imagery into the expansion and turbulence of a digital Odor Seed.", "一个没有真实气味的交互装置，将观众面对气味关联影像时的面部反应转化为数字 Odor Seed 的膨胀与躁动。"],
  "plated-fantasies": ["A tactile food interface that uses sound and moving image to make learned cultural and media associations visible again.", "将食物转化为触觉界面，通过声音与动态影像让习惯性的文化和媒体联想重新变得可见。"],
  "closet-x": ["A wardrobe-management system connecting garment recognition, personal styling, sustainable use and virtual dressing.", "连接衣物识别、个人造型、虚拟试穿与可持续管理的智能衣橱。"],
  "navigating-the-past": ["A multi-layered navigation experience reconnecting Harbin’s historic streets with archival stories, spatial memory and contemporary movement.", "用增强现实与分层导航连接哈尔滨历史街区、档案故事与当代行走。"],
  "vivid": ["A generative-AI-assisted platform through which residents revisit, correct, and discuss place-based community memories.", "一个支持居民重新讲述、修正并讨论社区空间记忆的生成式 AI 交互平台。"],
  "feeding-fear": ["A visual investigation of how fear is repeatedly fed by institutions, environments and the social circulation of suspicion.", "研究恐惧如何被环境、制度与社会传播持续喂养的实验影像。"],
  "drown-in-algae": ["Drown in Algae explores how living interfaces and feedback mechanisms can make invisible pollution, ecological remediation, and their environmental value perceptible, intelligible, and participatory.", "Drown in Algae 探索如何通过生命界面与反馈机制，让不可见的污染、生态修复及其环境价值变得可感知、可理解、可参与。"],
  "forbidden-hue": ["How does immersive interaction shape users’ understanding of historical authenticity, cultural identity and narrative power?", "沉浸式交互如何塑造用户对历史真实性、文化身份与叙事权力的理解？"]
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
  const hero = heroOverrides[id] || `../assets/details/${id}/cover/cover.${id === "closet-x" || id === "drown-in-algae" ? "jpg" : "webp"}`;
  const [longCopy, chineseCopy] = projectCopy[id] || [description, ""];
  const gallery = (media[id] || []).map(path => `../assets/details/${id}/${path}`);
  const portfolio = Array.from({length:portfolioCounts[id] || 0}, (_,index) => `../assets/details/${id}/portfolio/spread-${String(index + 1).padStart(2,"0")}.webp`);
  const previous = projectCatalogue[(projectIndex - 1 + projectCatalogue.length) % projectCatalogue.length];
  const next = projectCatalogue[(projectIndex + 1) % projectCatalogue.length];
  document.title = `${title} — YUTONG CHEN Portfolio`;
  document.querySelector('meta[name="description"]').content = `${title}: ${description}`;
  main.innerHTML = `
    <article>
      <header class="project-heading">
        <h1>${escapeHtml(title)}</h1>
        <div class="project-intro">
          <div><p class="project-lede">${escapeHtml(longCopy)}</p>${chineseCopy ? `<p class="project-cn" lang="zh-CN">${escapeHtml(chineseCopy)}</p>` : ""}</div>
          <dl class="project-meta"><dt>Year</dt><dd>${escapeHtml(year)}</dd><dt>Format</dt><dd>${escapeHtml(format)}</dd><dt>Focus</dt><dd>${escapeHtml(focus)}</dd><dt>Fields</dt><dd>${escapeHtml(categories.join(" · "))}</dd></dl>
        </div>
      </header>
      <figure class="project-hero"><img src="${hero}" alt="${escapeHtml(title)} project image" fetchpriority="high"><figcaption class="project-caption">${escapeHtml(title)} — project documentation.</figcaption></figure>
      <section class="project-copy"><h2>Overview</h2><div><p>${escapeHtml(description)}</p><p>The project brings ${escapeHtml(focus.toLowerCase())} into an experience that can be entered, tested and discussed. The work develops through research, prototyping and visual documentation.</p></div></section>
      ${videos[id] ? `<section class="project-videos" aria-label="${escapeHtml(title)} videos">${videos[id].map(([videoId,label]) => `<figure class="project-video"><iframe src="https://www.youtube-nocookie.com/embed/${videoId}" title="${escapeHtml(title)} — ${escapeHtml(label)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe><figcaption class="project-caption">${escapeHtml(label)}</figcaption></figure>`).join("")}</section>` : ""}
      ${gallery.length ? `<section class="project-gallery project-gallery--pair" aria-label="Project documentation">${gallery.map((src,index) => `<figure><img src="${src}" alt="${escapeHtml(title)} documentation ${index + 1}" loading="lazy"><figcaption class="project-caption">Project documentation ${String(index + 1).padStart(2,"0")}.</figcaption></figure>`).join("")}</section>` : ""}
      ${portfolio.length ? `<section class="portfolio-series"><header><div><h2>Portfolio series</h2><p>Original full-resolution spreads</p></div><p>Drag or scroll horizontally / 左右滑动</p></header><div class="portfolio-rail" tabindex="0" aria-label="${escapeHtml(title)} portfolio images">${portfolio.map((src,index) => `<figure><img src="${src}" alt="${escapeHtml(title)} portfolio spread ${index + 1}" loading="lazy" draggable="false"><figcaption class="project-caption">${String(index + 1).padStart(2,"0")} / ${String(portfolio.length).padStart(2,"0")}</figcaption></figure>`).join("")}</div></section>` : ""}
      <section class="project-copy"><h2>Process</h2><div><p>${escapeHtml(format)} is used as a way to examine ${escapeHtml(focus.toLowerCase())} through direct experience.</p><p>The final outcome connects the project’s research question with a concrete interaction, allowing its ideas to be encountered rather than only described.</p></div></section>
      <nav class="project-nav" aria-label="Project navigation"><a href="?id=${previous[1]}">← ${escapeHtml(previous[0])}</a><a href="?id=${next[1]}">${escapeHtml(next[0])} →</a></nav>
    </article>`;

  main.querySelectorAll(".project-nav a").forEach(link => {
    const label = link.textContent;
    link.setAttribute("aria-label", label);
    link.innerHTML = Array.from(label).map(char => `<span class="project-nav-char">${char === " " ? "&nbsp;" : escapeHtml(char)}</span>`).join("");
    const reset = () => link.querySelectorAll(".project-nav-char").forEach(char => char.style.transform = "");
    link.addEventListener("pointermove", event => link.querySelectorAll(".project-nav-char").forEach(char => {
      const rect = char.getBoundingClientRect();
      const distance = (rect.left + rect.width / 2) - event.clientX;
      char.style.transform = Math.abs(distance) < 54 ? `translateX(${Math.sign(distance || 1) * (54 - Math.abs(distance)) * .38}px)` : "";
    }));
    link.addEventListener("pointerleave", reset);
    link.addEventListener("blur", reset);
  });

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
