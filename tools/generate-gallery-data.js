const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const imageRoot = path.join(rootDir, "Imagenes");
const outputFile = path.join(rootDir, "gallery-data.js");

const mediaExts = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".webm", ".mov"]);
const videoExts = new Set([".mp4", ".webm", ".mov"]);

const pageRoots = {
  "contra-incendios.html": "SISTEMA CONTRA INCENDIO",
  "gasfiteria.html": "GASFITERIA",
  "aguas-residuales.html": "HIDRAULICO",
  "servicios-mecanicos.html": "MECANICO",
  "sistema-piscina.html": "PISCINA",
  "sistemas-electricos.html": "ELECTRICO",
  "sistemas-hidraulicos.html": "HIDRAULICO",
};

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

const toWebPath = (file) => path.relative(rootDir, file).split(path.sep).join("/");

const readTabs = (page) => {
  const html = fs.readFileSync(path.join(rootDir, page), "utf8");
  return [...html.matchAll(/<li data-filter="([^"]+)">([^<]+)<\/li>/g)].map((match) => ({
    filter: match[1],
    label: match[2].trim(),
  }));
};

const walkMedia = (dir) => {
  if (!fs.existsSync(dir)) return [];

  const entries = fs
    .readdirSync(dir, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name, "es", { numeric: true, sensitivity: "base" }));

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkMedia(fullPath);
    if (entry.isFile() && mediaExts.has(path.extname(entry.name).toLowerCase())) return [fullPath];
    return [];
  });
};

const getDirectoryFilters = (file, categoryRoot, tabsByFilter) => {
  const relativeDir = path.relative(categoryRoot, path.dirname(file));
  if (!relativeDir || relativeDir === ".") return [];

  return relativeDir
    .split(path.sep)
    .map(normalizeFilter)
    .filter((filter) => tabsByFilter.has(filter));
};

const getCaption = (filters, tabsByFilter) => {
  const lastFilter = filters[filters.length - 1];
  return tabsByFilter.get(lastFilter) || tabsByFilter.get(filters[0]) || "";
};

const buildPageData = (page, categoryName) => {
  const categoryRoot = path.join(imageRoot, categoryName);
  const tabs = readTabs(page);
  const tabsByFilter = new Map(tabs.map((tab) => [tab.filter, tab.label]));

  return walkMedia(categoryRoot)
    .map((file) => {
      const directoryFilters = getDirectoryFilters(file, categoryRoot, tabsByFilter);
      const filters = [...new Set(directoryFilters)].filter((filter) => tabsByFilter.has(filter));

      if (!filters.length) return null;

      return {
        src: toWebPath(file),
        type: videoExts.has(path.extname(file).toLowerCase()) ? "video" : "image",
        filters,
        caption: getCaption(filters, tabsByFilter),
      };
    })
    .filter(Boolean);
};

const pages = Object.fromEntries(
  Object.entries(pageRoots).map(([page, categoryName]) => [page, buildPageData(page, categoryName)]),
);

const total = Object.values(pages).reduce((sum, entries) => sum + entries.length, 0);
const generated = {
  total,
  pages,
};

const content = `window.EMCSAC_GALLERY_DATA = ${JSON.stringify(generated, null, 2)};\n`;
fs.writeFileSync(outputFile, content, "utf8");

console.log(`gallery-data.js actualizado con ${total} archivo(s) de galeria.`);
for (const [page, entries] of Object.entries(pages)) {
  console.log(`- ${page}: ${entries.length}`);
}
