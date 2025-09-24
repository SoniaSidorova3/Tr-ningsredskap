// Hjälpfunktioner
const fmt = new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' });
const $ = (sel) => document.querySelector(sel);
const el = (tag, cls) => { const n = document.createElement(tag); if (cls) n.className = cls; return n; };

// PRODUKTER (använder dina filer img2..img5)
const products = [
  {
    id: "KIT-PASTELL",
    name: "Pastell Basic Kit",
    basePrice: 1299,
    image: "https://soniasidorova3.github.io/Tr-ningsredskap/img2.jpeg",
    description: "Komplett startkit för hemmaträning. Halkfri matta, miniband, och korta hantlar.",
    variants: [
      { id: "rosa", label: "Rosa", price: 1299 },
      { id: "mint", label: "Mint", price: 1299 },
      { id: "sand", label: "Sand", price: 1299 },
    ],
  },
  {
    id: "HANT-PASTELL",
    name: "Hantlar 5 & 8 kg – Pastell",
    basePrice: 699,
    image: "https://soniasidorova3.github.io/Tr-ningsredskap/img3.jpeg",
    description: "Gummibelagda hantlar i två viktpar. Skonsamma mot golv, bra grepp.",
    variants: [
      { id: "rosa", label: "Rosa", price: 699 },
      { id: "mint", label: "Mint", price: 699 },
      { id: "sand", label: "Sand", price: 699 },
    ],
  },
  {
    id: "BAND-POWER",
    name: "Power Band Set",
    basePrice: 499,
    image: "https://soniasidorova3.github.io/Tr-ningsredskap/img4.jpeg",
    description: "Tre motstånd: lätt, medium, hårt. Funktionell träning, rörlighet & rehab.",
    variants: [
      { id: "svart", label: "Svart", price: 499 },
      { id: "multi", label: "Multicolor", price: 499 },
    ],
  },
  {
    id: "YOGA-MIN",
    name: "Yogamatta – Minimalism",
    basePrice: 399,
    image: "https://soniasidorova3.github.io/Tr-ningsredskap/img5.jpeg",
    description: "4 mm TPE – mjuk, lätt att torka av. Rem för transport ingår.",
    variants: [
      { id: "grå", label: "Grå", price: 399 },
      { id: "svart", label: "Svart", price: 399 },
    ],
  },
];

// FÄRDIGA FÄRGSET (bundle med liten rabatt)
const bundles = [
  {
    id: "SET-PASTELL-MINT",
    name: "Färgset Pastell – Mint",
    items: ["KIT-PASTELL", "HANT-PASTELL", "YOGA-MIN"],
    variantMap: { "KIT-PASTELL": "mint", "HANT-PASTELL": "mint", "YOGA-MIN": "grå" },
    image: "https://soniasidorova3.github.io/Tr-ningsredskap/img2.jpeg",
    description: "Matchat set i mint/neutral. Perfekt hemmagym-start.",
    price: 1299 + 699 + 399 - 200 // 200 kr paket-rabatt
  },
  {
    id: "SET-PASTELL-ROSA",
    name: "Färgset Pastell – Rosa",
    items: ["KIT-PASTELL", "HANT-PASTELL", "YOGA-MIN"],
    variantMap: { "KIT-PASTELL": "rosa", "HANT-PASTELL": "rosa", "YOGA-MIN": "grå" },
    image: "https://soniasidorova3.github.io/Tr-ningsredskap/img2.jpeg",
    description: "Matchat set i rosa/neutral. Sparar 200 kr jämfört med att köpa separat.",
    price: 1299 + 699 + 399 - 200
  }
];

// Kundvagn (minimalt, i minnet)
const cart = [];

function addToCart(item) {
  // item: {id, name, variantLabel, price, qty, image}
  const key = `${item.id}-${item.variantLabel}`;
  const existing = cart.find(c => c.key === key);
  if (existing) existing.qty += item.qty;
  else cart.push({ key, ...item });
  renderCart();
}

function removeFromCart(key) {
  const i = cart.findIndex(c => c.key === key);
  if (i > -1) cart.splice(i,1);
  renderCart();
}

function renderProducts() {
  const grid = $("#productGrid");
  grid.innerHTML = "";
  products.forEach(p => {
    const card = el("article","card");
    const img = el("img"); img.src = p.image; img.alt = p.name;
    const pad = el("div","pad");
    const h3 = el("h3"); h3.textContent = p.name;
    const desc = el("p","muted"); desc.textContent = p.description;

    const select = el("select","select");
    p.variants.forEach(v=>{
      const opt = el("option");
      opt.value = v.id; opt.textContent = `${v.label} — ${fmt.format(v.price)}`;
      select.appendChild(opt);
    });

    const price = el("div","price");
    price.textContent = fmt.format(p.variants[0].price);

    select.addEventListener("change", ()=>{
      const v = p.
