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

const getCurrentPageKey = (gallery) => {
  if (gallery.dataset.galleryPage) return gallery.dataset.galleryPage;
  const page = window.location.pathname.split("/").pop();
  return page || "index.html";
};

const createGalleryItem = (entry) => {
  const item = document.createElement("article");
  item.className = "gallery-item";
  item.dataset.filters = (entry.filters || []).join(" ");

  const caption = entry.caption || "";
  const media = document.createElement(entry.type === "video" ? "video" : "img");
  media.src = entry.src;

  if (entry.type === "video") {
    media.muted = true;
    media.playsInline = true;
    media.preload = "metadata";
    media.setAttribute("aria-label", caption);
  } else {
    media.alt = caption;
    media.loading = "lazy";
  }

  const captionEl = document.createElement("div");
  captionEl.className = "gallery-caption";
  captionEl.textContent = caption;

  item.append(media, captionEl);
  return item;
};

const renderGalleryItems = (gallery) => {
  const pageKey = getCurrentPageKey(gallery);
  const entries = window.EMCSAC_GALLERY_DATA?.pages?.[pageKey];
  if (!entries) return;

  gallery.replaceChildren(...entries.map(createGalleryItem));
};

const updateGalleryPreview = (detail, item) => {
  const preview = detail.querySelector(".gallery-preview");
  if (!preview || !item) return;

  const previewMedia = preview.querySelector(".gallery-preview-media");
  const previewCaption = preview.querySelector(".gallery-caption");
  const thumbMedia = item.querySelector("img, video");
  const thumbCaption = item.querySelector(".gallery-caption");
  if (!previewMedia || !thumbMedia) return;

  const media = document.createElement(thumbMedia.tagName.toLowerCase());
  media.src = thumbMedia.currentSrc || thumbMedia.src || "";

  if (media.tagName === "IMG") {
    media.alt = thumbMedia.alt || "";
  } else {
    media.controls = true;
    media.playsInline = true;
    media.preload = "metadata";
  }

  previewMedia.replaceChildren(media);
  previewCaption.textContent =
    thumbCaption?.textContent || thumbMedia?.alt || thumbMedia?.getAttribute("aria-label") || "";

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
  const navButtons = detail.querySelectorAll(".gallery-nav");
  const visibleItems = items.filter((item) => !item.classList.contains("hidden"));
  const hasVisible = visibleItems.length > 0;

  if (empty) empty.style.display = hasVisible ? "none" : "block";
  if (preview) preview.style.display = hasVisible ? "block" : "none";
  if (thumbs) thumbs.style.display = hasVisible ? "flex" : "none";
  navButtons.forEach((button) => {
    button.style.display = visibleItems.length > 1 ? "flex" : "none";
  });

  if (hasVisible) updateGalleryPreview(detail, visibleItems[0]);
};

const initGalleryFilters = () => {
  document.querySelectorAll(".service-detail").forEach((detail) => {
    const tabs = Array.from(detail.querySelectorAll(".service-list li"));
    const gallery = detail.querySelector(".service-gallery");
    if (!tabs.length || !gallery) return;

    renderGalleryItems(gallery);
    const items = Array.from(detail.querySelectorAll(".gallery-item"));

    const preview = document.createElement("div");
    preview.className = "gallery-preview";
    preview.innerHTML = '<div class="gallery-preview-media"></div><div class="gallery-caption"></div>';
    const prevBtn = document.createElement("button");
    prevBtn.className = "gallery-nav gallery-nav-prev";
    prevBtn.type = "button";
    prevBtn.setAttribute("aria-label", "Imagen anterior");
    prevBtn.innerHTML = "&#8249;";
    const nextBtn = document.createElement("button");
    nextBtn.className = "gallery-nav gallery-nav-next";
    nextBtn.type = "button";
    nextBtn.setAttribute("aria-label", "Imagen siguiente");
    nextBtn.innerHTML = "&#8250;";
    preview.appendChild(prevBtn);
    preview.appendChild(nextBtn);

    const empty = document.createElement("div");
    empty.className = "gallery-empty";
    empty.textContent = "No hay imagenes disponibles para esta subcategoria.";

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
