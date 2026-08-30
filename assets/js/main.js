// Loads shared header/footer partials, injects site-wide info from content/site.json,
// and wires up the mobile navigation toggle. Runs on every page.

async function loadPartial(url, mountId) {
  const res = await fetch(url, { cache: "no-cache" });
  const html = await res.text();
  document.getElementById(mountId).innerHTML = html;
}

function applySiteFields(site) {
  document.querySelectorAll("[data-site-field]").forEach((el) => {
    const key = el.getAttribute("data-site-field");
    if (site[key] !== undefined) el.textContent = site[key];
  });
  document.querySelectorAll("[data-site-mailto]").forEach((el) => {
    el.href = `mailto:${site.contactEmail}`;
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

async function initLayout() {
  await Promise.all([
    loadPartial("/assets/partials/header.html", "site-header"),
    loadPartial("/assets/partials/footer.html", "site-footer"),
  ]);

  const site = await fetch("/content/site.json", { cache: "no-cache" }).then((r) => r.json());
  applySiteFields(site);
  setActiveNav();
  wireNavToggle();

  const yearEl = document.getElementById("footerYear");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  document.dispatchEvent(new CustomEvent("layout:ready", { detail: { site } }));
}

initLayout();
