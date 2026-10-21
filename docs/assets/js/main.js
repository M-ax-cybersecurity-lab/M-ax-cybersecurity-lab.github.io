// Loads shared header/footer partials, injects site-wide info from content/site.json,
// and wires up the mobile navigation toggle. Runs on every page.

async function loadPartial(url, mountId) {
  const res = await fetch(url, { cache: "no-cache" });
  const html = await res.text();
  document.getElementById(mountId).innerHTML = html;
}

function gmailComposeUrl(email) {
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
}

function applySiteFields(site) {
  document.querySelectorAll("[data-site-field]").forEach((el) => {
    const key = el.getAttribute("data-site-field");
    if (site[key] !== undefined) el.textContent = site[key];
  });
  document.querySelectorAll("[data-site-mailto]").forEach((el) => {
    el.href = gmailComposeUrl(site.contactEmail);
    el.target = "_blank";
    el.rel = "noopener";
  });
  document.title = document.title.replace("{{labNameKo}}", site.labNameKo);

  const hero = document.querySelector(".hero");
  if (hero && site.bannerImage) {
    hero.style.backgroundImage = `linear-gradient(rgba(5, 11, 26, 0.75), rgba(5, 11, 26, 0.75)), url("${site.bannerImage}")`;
    hero.style.backgroundSize = "cover";
    hero.style.backgroundPosition = "center";
  }
}

function setActiveNav() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav > ul > li").forEach((li) => {
    const link = li.querySelector(":scope > a");
    if (link && link.getAttribute("href").endsWith(path)) {
      link.style.color = "var(--color-cyan-400)";
    }
  });
}

function wireNavToggle() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // On small screens, tapping an "About"/"Research" top link expands its sub-menu
  // instead of navigating away immediately (second tap follows the link).
  nav.querySelectorAll(".has-sub > a").forEach((link) => {
    link.addEventListener("click", (e) => {
      if (window.innerWidth > 860) return;
      const parent = link.parentElement;
      if (!parent.classList.contains("open")) {
        e.preventDefault();
        parent.classList.add("open");
      }
    });
  });
}

// Site-wide text fields (labels, titles, descriptions) live spread across
// several content files, each owned by the page/collection it belongs to.
// Merge them into one lookup object for data-site-field/data-site-mailto.
const SITE_FIELD_SOURCES = [
  "/content/site.json",
  "/content/nav.json",
  "/content/about.json",
  "/content/people.json",
  "/content/research.json",
  "/content/publications.json",
  "/content/news.json",
];

async function loadSiteFields() {
  const parts = await Promise.all(
    SITE_FIELD_SOURCES.map((url) => fetch(url, { cache: "no-cache" }).then((r) => r.json()))
  );
  return Object.assign({}, ...parts);
}

// Recruitment popup: shown whenever the visitor *arrives* at the site (typed URL,
// bookmark, external link, reload) but not when moving between pages of the site,
// and not again after "오늘 하루 보지 않기" (until the local date changes) or
// "더 이상 보지 않기" (permanent; localStorage, keyed by the content version so
// bumping `version` in content/recruit.json re-shows it for a new round).
const RECRUIT_HIDE_KEY = "recruitPopupHidden";
const RECRUIT_HIDE_TODAY_KEY = "recruitPopupHiddenDate";

function localDateString() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function isArrivalNavigation() {
  const nav = performance.getEntriesByType("navigation")[0];
  if (nav && nav.type === "back_forward") return false;
  if (nav && nav.type === "reload") return true;
  try {
    return !document.referrer || new URL(document.referrer).origin !== location.origin;
  } catch (e) {
    return true;
  }
}

function storageGet(store, key) {
  try { return store.getItem(key); } catch (e) { return null; }
}
function storageSet(store, key, value) {
  try { store.setItem(key, value); } catch (e) { /* storage blocked: ignore */ }
}

function buildRecruitPopup(data, site) {
  const root = document.createElement("div");
  root.className = "recruit-popup";
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.setAttribute("aria-labelledby", "recruitTitle");

  const backdrop = document.createElement("div");
  backdrop.className = "recruit-popup-backdrop";
  const panel = document.createElement("div");
  panel.className = "recruit-popup-panel";
  root.append(backdrop, panel);

  const langEls = []; // [element, koText, enText]
  const bilingual = (tag, ko, en, cls) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    el.textContent = ko;
    langEls.push([el, ko, en || ko]);
    return el;
  };

  const eyebrow = document.createElement("div");
  eyebrow.className = "recruit-eyebrow";
  eyebrow.textContent = "Recruiting";
  const title = bilingual("h3", data.title, data.titleEn);
  title.id = "recruitTitle";
  const intro = bilingual("p", data.intro, data.introEn, "recruit-intro");

  const list = document.createElement("dl");
  list.className = "recruit-list";
  (data.items || []).forEach((it) => {
    list.append(
      bilingual("dt", it.label, it.labelEn),
      bilingual("dd", it.value, it.valueEn)
    );
  });

  const mail = document.createElement("a");
  mail.className = "btn recruit-mail";
  mail.href = gmailComposeUrl(site.contactEmail);
  mail.target = "_blank";
  mail.rel = "noopener";
  mail.textContent = data.contactButtonLabel;
  langEls.push([mail, data.contactButtonLabel, data.contactButtonLabelEn || data.contactButtonLabel]);

  const today = document.createElement("button");
  today.type = "button";
  today.className = "recruit-dismiss";
  today.textContent = data.todayLabel;
  langEls.push([today, data.todayLabel, data.todayLabelEn || data.todayLabel]);

  const dismiss = document.createElement("button");
  dismiss.type = "button";
  dismiss.className = "recruit-dismiss";
  dismiss.textContent = data.dismissLabel;
  langEls.push([dismiss, data.dismissLabel, data.dismissLabelEn || data.dismissLabel]);

  const close = document.createElement("button");
  close.type = "button";
  close.className = "recruit-close";
  close.textContent = data.closeLabel;
  langEls.push([close, data.closeLabel, data.closeLabelEn || data.closeLabel]);

  const actions = document.createElement("div");
  actions.className = "recruit-actions";
  const footBtns = document.createElement("div");
  footBtns.className = "recruit-foot";
  footBtns.append(today, dismiss, close);
  actions.append(mail, footBtns);

  const lang = document.createElement("button");
  lang.type = "button";
  lang.className = "lang-toggle recruit-lang";
  lang.dataset.lang = "ko";
  lang.textContent = "English";
  lang.addEventListener("click", () => {
    const showEn = lang.dataset.lang !== "en";
    langEls.forEach(([el, ko, en]) => { el.textContent = showEn ? en : ko; });
    lang.dataset.lang = showEn ? "en" : "ko";
    lang.textContent = showEn ? "한글" : "English";
  });

  panel.append(eyebrow, title, lang, intro, list, actions);

  const hide = () => {
    root.remove();
    document.removeEventListener("keydown", onKey);
  };
  const onKey = (e) => { if (e.key === "Escape") hide(); };
  document.addEventListener("keydown", onKey);
  backdrop.addEventListener("click", hide);
  close.addEventListener("click", hide);
  today.addEventListener("click", () => {
    storageSet(localStorage, RECRUIT_HIDE_TODAY_KEY, localDateString());
    hide();
  });
  dismiss.addEventListener("click", () => {
    storageSet(localStorage, RECRUIT_HIDE_KEY, data.version || "1");
    hide();
  });
  return root;
}

async function initRecruitPopup(site) {
  try {
    const data = await fetch("/content/recruit.json", { cache: "no-cache" }).then((r) => r.json());
    if (!data.enabled) return;
    if (storageGet(localStorage, RECRUIT_HIDE_KEY) === (data.version || "1")) return;
    if (storageGet(localStorage, RECRUIT_HIDE_TODAY_KEY) === localDateString()) return;
    if (!isArrivalNavigation()) return;
    document.body.appendChild(buildRecruitPopup(data, site));
  } catch (e) {
    /* popup is optional: never break the page */
  }
}

async function initLayout() {
  await Promise.all([
    loadPartial("/assets/partials/header.html", "site-header"),
    loadPartial("/assets/partials/footer.html", "site-footer"),
  ]);

  const site = await loadSiteFields();
  applySiteFields(site);
  setActiveNav();
  wireNavToggle();

  const yearEl = document.getElementById("footerYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  initRecruitPopup(site);

  document.dispatchEvent(new CustomEvent("layout:ready", { detail: { site } }));
}

initLayout();
