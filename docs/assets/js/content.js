// Renders page-specific content from the JSON files in /content.
// Each render function only runs if its mount element exists on the current page.

const ROLE_LABELS = { Professor: "Professor", PhD: "Ph.D. Student", MS: "M.S. Student", Alumni: "Alumni" };
const ROLE_ORDER = ["Professor", "PhD", "MS", "Alumni"];

function escapeHtml(str = "") {
  return str.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function personCard(p, idx) {
  const photo = p.photo
    ? `<img class="person-photo" src="${escapeHtml(p.photo)}" alt="${escapeHtml(p.name)}">`
    : `<div class="person-photo">PHOTO</div>`;
  const email = p.email
    ? `<a class="person-email" href="mailto:${escapeHtml(p.email)}">${escapeHtml(p.email)}</a>`
    : "";
  const clickable = p.cv ? ` card-clickable" data-detail-idx="${idx}` : "";
  return `
    <div class="person-card${clickable}">
      ${photo}
      <div>
        <div class="person-name">${escapeHtml(p.name)}</div>
        <div class="person-title">${escapeHtml(p.title || "")}</div>
        <p class="person-bio">${escapeHtml(p.bio || "")}</p>
        ${email}
      </div>
    </div>`;
}

async function renderPeople() {
  const mount = document.getElementById("people-mount");
  if (!mount) return;
  const people = await fetch("content/people.json", { cache: "no-cache" }).then((r) => r.json());

  const groups = ROLE_ORDER.map((role) => ({
    role,
    members: people.map((p, i) => [p, i]).filter(([p]) => p.role === role),
  })).filter((g) => g.members.length);

  mount.innerHTML = groups
    .map(
      (g) => `
      <div class="people-role-group">
        <div class="people-role-title">${ROLE_LABELS[g.role] || g.role}</div>
        <div class="card-grid">${g.members.map(([p, i]) => personCard(p, i)).join("")}</div>
      </div>`
    )
    .join("");

  mount.querySelectorAll("[data-detail-idx]").forEach((card) => {
    card.addEventListener("click", () => {
      const person = people[Number(card.getAttribute("data-detail-idx"))];
      openDetailModal({
        title: person.name,
        meta: person.title,
        image: person.photo,
        detail: person.cv,
      });
    });
  });
}

function openDetailModal({ title, meta, image, detail }) {
  const modal = document.getElementById("detailModal");
  if (!modal) return;

  const imageEl = document.getElementById("detailModalImage");
  if (image) {
    imageEl.src = image;
    imageEl.alt = title || "";
    imageEl.style.display = "block";
  } else {
    imageEl.style.display = "none";
  }

  document.getElementById("detailModalTitle").textContent = title || "";
  const metaEl = document.getElementById("detailModalMeta");
  metaEl.textContent = meta || "";
  metaEl.style.display = meta ? "block" : "none";
  document.getElementById("detailModalBody").textContent = detail || "";

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeDetailModal() {
  const modal = document.getElementById("detailModal");
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function wireDetailModalDismiss() {
  const modal = document.getElementById("detailModal");
  if (!modal) return;
  modal.querySelectorAll("[data-modal-close]").forEach((el) =>
    el.addEventListener("click", closeDetailModal)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDetailModal();
  });
}
wireDetailModalDismiss();

function facilityCardHtml(f, idx) {
  const img = f.image
    ? `<img class="card-thumb" src="${escapeHtml(f.image)}" alt="${escapeHtml(f.name)}">`
    : `<div class="card-thumb card-thumb-empty">PHOTO</div>`;
  return `<div class="card card-clickable" data-detail-idx="${idx}">${img}<h3>${escapeHtml(f.name)}</h3><p>${escapeHtml(f.description)}</p></div>`;
}

function projectCardHtml(p, idx) {
  const img = p.image
    ? `<img class="card-thumb" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}">`
    : "";
  return `<div class="card card-clickable" data-detail-idx="${idx}">
    ${img}
    <h3>${escapeHtml(p.title)}</h3>
    <p class="pub-meta">${escapeHtml(p.period || "")}${p.funding ? " · " + escapeHtml(p.funding) : ""}</p>
    <p>${escapeHtml(p.description || "")}</p>
  </div>`;
}

function wireDetailClicks(mount, items, metaFn) {
  mount.querySelectorAll("[data-detail-idx]").forEach((card) => {
    card.addEventListener("click", () => {
      const item = items[Number(card.getAttribute("data-detail-idx"))];
      openDetailModal({
        title: item.title || item.name,
        meta: metaFn ? metaFn(item) : "",
        image: item.image,
        detail: item.detail || item.description,
      });
    });
  });
}

async function renderResearch() {
  const areasMount = document.getElementById("areas-mount");
  const projectsMount = document.getElementById("projects-mount");
  const facilityMount = document.getElementById("facility-mount");
  if (!areasMount && !projectsMount && !facilityMount) return;

  const research = await fetch("content/research.json", { cache: "no-cache" }).then((r) => r.json());

  if (areasMount) {
    areasMount.innerHTML = research.areas
      .map((a) => `<div class="card"><h3>${escapeHtml(a.title)}</h3><p>${escapeHtml(a.description)}</p></div>`)
      .join("");
  }
  if (projectsMount) {
    projectsMount.innerHTML = research.projects.map(projectCardHtml).join("");
    wireDetailClicks(projectsMount, research.projects, (p) =>
      [p.period, p.funding].filter(Boolean).join(" · ")
    );
  }
  if (facilityMount) {
    facilityMount.innerHTML = research.facility.map(facilityCardHtml).join("");
    wireDetailClicks(facilityMount, research.facility, () => "");
  }
}

async function renderBenefits() {
  const mount = document.getElementById("benefits-mount");
  if (!mount) return;
  const benefits = await fetch("content/benefits.json", { cache: "no-cache" }).then((r) => r.json());

  mount.innerHTML = benefits
    .map((b) => `<div class="card"><h3>${escapeHtml(b.title)}</h3><p>${escapeHtml(b.description)}</p></div>`)
    .join("");
}

async function renderPublications() {
  const mount = document.getElementById("publications-mount");
  if (!mount) return;
  const byYear = await fetch("content/publications.json", { cache: "no-cache" }).then((r) => r.json());

  mount.innerHTML = byYear
    .sort((a, b) => b.year - a.year)
    .map(
      (group) => `
      <div class="pub-year">${group.year}</div>
      ${group.items
        .map(
          (item) => `
        <div class="pub-item">
          <span class="pub-type">${escapeHtml(item.type)}</span>
          <div class="pub-title">${item.link ? `<a href="${escapeHtml(item.link)}" target="_blank" rel="noopener">${escapeHtml(item.title)}</a>` : escapeHtml(item.title)}</div>
          <div class="pub-meta">${escapeHtml(item.authors)} — ${escapeHtml(item.venue)}</div>
        </div>`
        )
        .join("")}`
    )
    .join("");
}

async function renderNews() {
  const mount = document.getElementById("news-mount");
  if (!mount) return;
  const news = await fetch("content/news.json", { cache: "no-cache" }).then((r) => r.json());

  mount.innerHTML = news
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(
      (n) => `
      <div class="news-item">
        <div class="news-date">${escapeHtml(n.date)}</div>
        <div>
          <div class="news-title">${n.link ? `<a href="${escapeHtml(n.link)}" target="_blank" rel="noopener">${escapeHtml(n.title)}</a>` : escapeHtml(n.title)}</div>
          <div class="news-content">${escapeHtml(n.content)}</div>
        </div>
      </div>`
    )
    .join("");
}

renderPeople();
renderResearch();
renderBenefits();
renderPublications();
renderNews();
