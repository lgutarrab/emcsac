const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const toggle = document.querySelector("[data-nav-toggle]");
const whatsappFloat = document.querySelector(".whatsapp-float");
const footer = document.querySelector(".site-footer");

const setHeaderState = () => {
  if (!header) return;
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

const setNavOpen = (isOpen) => {
  if (!nav || !toggle) return;
  nav.classList.toggle("is-open", isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
};

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    setNavOpen(!nav.classList.contains("is-open"));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setNavOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(event.target) || toggle.contains(event.target)) return;
    setNavOpen(false);
  });
}

if (nav) {
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNavOpen(false));
  });
}

const initBrandCarousel = () => {
  const carousel = document.querySelector("[data-brand-carousel]");
  const track = carousel?.querySelector(".brand-track");
  if (!carousel || !track) return;

  const originalLogos = Array.from(track.querySelectorAll("img"));
  if (originalLogos.length <= 4) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let step = 0;
  let index = 0;
  let timer = null;
  let resetTimer = null;
  let firstRunTimer = null;
  let resizeTimer = null;

  const stop = () => {
    if (timer) window.clearInterval(timer);
    if (firstRunTimer) window.clearTimeout(firstRunTimer);
    timer = null;
    firstRunTimer = null;
  };

  const removeClones = () => {
    track.querySelectorAll("[data-brand-clone]").forEach((logo) => logo.remove());
  };

  const getVisibleCount = () => {
    if (window.matchMedia("(max-width: 640px)").matches) return 1;
    if (window.matchMedia("(max-width: 920px)").matches) return 2;
    return 4;
  };

  const syncClones = () => {
    removeClones();
    originalLogos.slice(0, getVisibleCount()).forEach((logo) => {
      const clone = logo.cloneNode(true);
      clone.dataset.brandClone = "true";
      clone.setAttribute("aria-hidden", "true");
      clone.alt = "";
      track.appendChild(clone);
    });
  };

  const measure = () => {
    const firstLogo = track.querySelector("img");
    const gap = Number.parseFloat(window.getComputedStyle(track).gap) || 0;
    step = firstLogo ? firstLogo.getBoundingClientRect().width + gap : 0;
    track.style.transform = `translate3d(${-index * step}px, 0, 0)`;
  };

  const reset = () => {
    track.style.transition = "none";
    index = 0;
    track.style.transform = "translate3d(0, 0, 0)";
    track.offsetHeight;
    track.style.transition = "";
  };

  const advance = () => {
    if (!step) return;
    index += 1;
    track.style.transform = `translate3d(${-index * step}px, 0, 0)`;

    if (index >= originalLogos.length) {
      if (resetTimer) window.clearTimeout(resetTimer);
      resetTimer = window.setTimeout(reset, 820);
    }
  };

  const start = () => {
    stop();
    carousel.classList.add("is-animated");
    carousel.classList.toggle("is-reduced-motion", reducedMotion.matches);
    track.style.setProperty("--brand-motion-duration", reducedMotion.matches ? "1ms" : "760ms");
    firstRunTimer = window.setTimeout(advance, reducedMotion.matches ? 1200 : 700);
    timer = window.setInterval(advance, reducedMotion.matches ? 4200 : 2600);
  };

  const setup = () => {
    stop();
    if (resetTimer) window.clearTimeout(resetTimer);
    reset();
    syncClones();
    measure();
    start();
  };

  carousel.addEventListener("focusin", stop);
  carousel.addEventListener("focusout", start);
  reducedMotion.addEventListener("change", setup);

  window.addEventListener("resize", () => {
    if (resizeTimer) window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(setup, 180);
  });

  setup();
};

initBrandCarousel();

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
  item.tabIndex = 0;
  item.setAttribute("role", "button");

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
    const isSelected = thumb === item;
    thumb.classList.toggle("is-selected", isSelected);
    thumb.setAttribute("aria-current", isSelected ? "true" : "false");
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
      const selectItem = () => {
        if (!item.classList.contains("hidden")) {
          updateGalleryPreview(detail, item);
          item.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
        }
      };

      item.addEventListener("click", selectItem);
      item.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectItem();
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
      tab.tabIndex = 0;
      tab.setAttribute("role", "button");
      tab.setAttribute("aria-pressed", "false");

      const activateTab = () => {
        const filter = tab.dataset.filter;
        tabs.forEach((t) => {
          const isActive = t.dataset.filter === filter;
          t.classList.toggle("is-active", isActive);
          t.setAttribute("aria-pressed", String(isActive));
        });
        items.forEach((item) => {
          const matches = getItemFilters(item).includes(filter);
          item.classList.toggle("hidden", !matches);
        });
        updateGalleryVisibility(detail, items);
      };

      tab.addEventListener("click", activateTab);
      tab.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activateTab();
        }
      });
    });

    const first = tabs[0];
    if (first) first.click();
  });
};

initGalleryFilters();
