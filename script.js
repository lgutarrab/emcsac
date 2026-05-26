const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-nav-toggle]");
const whatsappFloat = document.querySelector(".whatsapp-float");
const footer = document.querySelector(".site-footer");

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const setWhatsappPosition = () => {
  if (!whatsappFloat || !footer) return;

  const baseBottom = window.matchMedia("(max-width: 640px)").matches ? 16 : 22;
  const footerTop = footer.getBoundingClientRect().top;
  const overlap = window.innerHeight - footerTop;
  const bottom = overlap > 0 ? Math.max(baseBottom, overlap + 12) : baseBottom;

  whatsappFloat.style.setProperty("--whatsapp-bottom", `${bottom}px`);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });
setWhatsappPosition();
window.addEventListener("scroll", setWhatsappPosition, { passive: true });
window.addEventListener("resize", setWhatsappPosition);

if (toggle) {
  toggle.addEventListener("click", () => {
    if (nav) nav.classList.toggle("is-open");
  });
}

if (nav) {
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("is-open"));
  });
}

const normalizeFilter = (value) =>
  value
    .toString()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

const getItemFilters = (item) =>
  (item.dataset.filters || item.dataset.filter || "")
    .toString()
    .split(/[\s,]+/)
    .map((value) => value.trim())
    .filter(Boolean);

const updateGalleryPreview = (detail, item) => {
  const preview = detail.querySelector(".gallery-preview");
  if (!preview || !item) return;

  const previewImage = preview.querySelector("img");
  const previewCaption = preview.querySelector(".gallery-caption");
  const thumbImage = item.querySelector("img");
  const thumbCaption = item.querySelector(".gallery-caption");

  previewImage.src = thumbImage?.src || "";
  previewImage.alt = thumbImage?.alt || "";
  previewCaption.textContent = thumbCaption?.textContent || thumbImage?.alt || "";

  detail.querySelectorAll(".gallery-item").forEach((thumb) => {
    thumb.classList.toggle("is-selected", thumb === item);
  });
};

const movePreview = (detail, items, delta) => {
  const visibleItems = items.filter((it) => !it.classList.contains("hidden"));
  if (!visibleItems.length) return;
  const currentIndex = visibleItems.findIndex((it) => it.classList.contains("is-selected"));
  const idx = currentIndex >= 0 ? currentIndex : 0;
  const next = (idx + delta + visibleItems.length) % visibleItems.length;
  const nextItem = visibleItems[next];
  if (nextItem) {
    updateGalleryPreview(detail, nextItem);
    nextItem.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }
};

  const updateGalleryVisibility = (detail, items) => {
  const preview = detail.querySelector(".gallery-preview");
  const thumbs = detail.querySelector(".gallery-thumbs");
  const empty = detail.querySelector(".gallery-empty");
  const visibleItems = items.filter((item) => !item.classList.contains("hidden"));
  const hasVisible = visibleItems.length > 0;

  if (empty) empty.style.display = hasVisible ? "none" : "block";
  if (preview) preview.style.display = hasVisible ? "block" : "none";
    if (thumbs) thumbs.style.display = hasVisible ? "flex" : "none";

  if (hasVisible) updateGalleryPreview(detail, visibleItems[0]);
};

const initGalleryFilters = () => {
  document.querySelectorAll(".service-detail").forEach((detail) => {
    const tabs = Array.from(detail.querySelectorAll(".service-list li"));
    const gallery = detail.querySelector(".service-gallery");
    const items = Array.from(detail.querySelectorAll(".gallery-item"));
    if (!tabs.length || !gallery) return;

    const preview = document.createElement("div");
    preview.className = "gallery-preview";
    preview.innerHTML = '<img alt="" /><div class="gallery-caption"></div>';
    const prevBtn = document.createElement("button");
    prevBtn.className = "gallery-nav gallery-nav-prev";
    prevBtn.type = "button";
    prevBtn.innerHTML = "‹";
    const nextBtn = document.createElement("button");
    nextBtn.className = "gallery-nav gallery-nav-next";
    nextBtn.type = "button";
    nextBtn.innerHTML = "›";
    preview.appendChild(prevBtn);
    preview.appendChild(nextBtn);

    const empty = document.createElement("div");
    empty.className = "gallery-empty";
    empty.textContent = "No hay imágenes disponibles para esta subcategoría.";

    const thumbs = document.createElement("div");
    thumbs.className = "gallery-thumbs";

    items.forEach((item) => {
      item.addEventListener("click", () => {
        if (!item.classList.contains("hidden")) {
          updateGalleryPreview(detail, item);
          item.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
        }
      });
      thumbs.appendChild(item);
    });

    gallery.innerHTML = "";
    gallery.append(preview, empty, thumbs);

    prevBtn.addEventListener("click", () => movePreview(detail, items, -1));
    nextBtn.addEventListener("click", () => movePreview(detail, items, 1));

    tabs.forEach((tab) => {
      if (!tab.dataset.filter) tab.dataset.filter = normalizeFilter(tab.textContent);
      tab.addEventListener("click", () => {
        const filter = tab.dataset.filter;
        tabs.forEach((t) => t.classList.toggle("is-active", t.dataset.filter === filter));
        items.forEach((item) => {
          const matches = getItemFilters(item).includes(filter);
          item.classList.toggle("hidden", !matches);
        });
        updateGalleryVisibility(detail, items);
      });
    });

    const first = tabs[0];
    if (first) first.click();
  });
};

initGalleryFilters();
