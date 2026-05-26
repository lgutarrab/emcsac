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

toggle.addEventListener("click", () => {
  nav.classList.toggle("is-open");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("is-open"));
});
