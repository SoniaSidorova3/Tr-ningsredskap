const SEK = new Intl.NumberFormat('sv-SE', { style:'currency', currency:'SEK' });
const PRODUCTS = [{"id": "kit-pastell", "name": "Pastell Basic Kit", "price": 129900, "image": "./assets/img/img8.jpeg", "description": "Allt du behöver för hemmaträning i mjuka pastellfärger."}, {"id": "hantlar-5-8", "name": "Hantlar 5 & 8 kg – Pastell", "price": 69900, "image": "./assets/img/img2.jpeg", "description": "Set med två par neoprenhantlar."}, {"id": "kettlebell-8", "name": "Kettlebell 8 kg – Pastell", "price": 49900, "image": "./assets/img/img3.jpeg", "description": "Greppvänlig kettlebell med slitstark beläggning."}, {"id": "yogamatta", "name": "Yogamatta – Pastell", "price": 39900, "image": "./assets/img/img3.jpeg", "description": "6 mm tjocklek, bra grepp och lätt att rulla."}, {"id": "foamroller-gul", "name": "Foam Roller – Gul", "price": 34900, "image": "./assets/img/img3.jpeg", "description": "Triggerpunktsmassage och återhämtning."}, {"id": "outdoor-set", "name": "Outdoor Set – Grön", "price": 139900, "image": "./assets/img/img7.jpeg", "description": "Perfekt för träning utomhus – vikter, matta, band och flaska."}, {"id": "kit-host", "name": "Höstkollektionen – Kit", "price": 149900, "image": "./assets/img/img4.jpeg", "description": "Varma jordnära toner – hantlar, kettlebell, matta och hopprep."}, {"id": "studio-bench", "name": "Justbar Träningsbänk", "price": 229900, "image": "./assets/img/img5.jpeg", "description": "Stabil bänk med flera lutningslägen."}, {"id": "lopband", "name": "Kompakt Löpband", "price": 499900, "image": "./assets/img/img5.jpeg", "description": "Hopfällbart löpband för hemmabruk med tyst motor."}]; // Inbäddade produkter (ingen fetch)

const state = { cart: loadCart(), query: '' };

init();
function init() {
  document.getElementById('searchInput').addEventListener('input', (e) => { state.query = e.target.value.trim().toLowerCase(); render(); });
  setupCartUI();
  render();
}

function render() {
  const app = document.getElementById('app');
  app.innerHTML='';
  app.append(hero(), productGrid(filtered()), footer());
}

function hero() {
  const wrap = el('section', {class:'hero'});
  wrap.append(
    el('img', {class:'hero__img', src: './assets/img/img1.jpeg', alt: 'Träning möter design'}),
    el('div', {class:'hero__content'},
      el('h1', {class:'hero__title'}, 'Träning möter design'),
      el('p', {class:'hero__lead'}, 'Pastell, Höst, Minimalism och Power – välj ditt tema och börja träna hemma.')
    )
  );
  return wrap;
}

function productGrid(list) {
  const sec = el('section', {class:'page'});
  sec.append(el('h2', {}, 'Produkter'));
  const grid = el('div', {class:'cards', role:'list'});
  list.forEach(p => grid.append(card(p)));
  if(!list.length) grid.append(el('p', {}, 'Inga produkter matchar din sökning.'));
  sec.append(grid);
  return sec;
}

function card(p) {
  const tpl = document.getElementById('productCardTpl').content.cloneNode(true);
  tpl.querySelector('.card__image').src = p.image;
  tpl.querySelector('.card__image').alt = p.name;
  tpl.querySelector('.card__title').textContent = p.name;
  tpl.querySelector('.card__price').textContent = SEK.format(p.price/100);
  tpl.querySelector('.addToCartBtn').addEventListener('click', () => addToCart(p.id, 1));
  return tpl;
}

function filtered() { const q = state.query; return PRODUCTS.filter(p => !q || p.name.toLowerCase().includes(q)); }
function footer() { return el('p', {class:'footer'}, '© ', new Date().getFullYear().toString(), ' Träningsredskap'); }

function el(tag, attrs={}, ...children) { const n=document.createElement(tag); Object.entries(attrs).forEach(([k,v])=>{ if(k==='class') n.className=v; else if(k.startsWith('on')) n.addEventListener(k.slice(2).toLowerCase(), v); else if(k==='html') n.innerHTML=v; else n.setAttribute(k,v); }); children.flat().forEach(c=>n.append(c)); return n; }

// ---- Kundvagn (demo) ----
function setupCartUI() {
  const drawer = document.getElementById('cartDrawer');
  const backdrop = document.getElementById('backdrop');
  const openBtn = document.getElementById('cartButton');
  const closeBtn = document.getElementById('closeCart');
  const checkoutBtn = document.getElementById('checkoutBtn');
  function open() { drawer.classList.add('open'); drawer.setAttribute('aria-hidden','false'); backdrop.hidden=false; }
  function close() { drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); backdrop.hidden=true; }
  openBtn.addEventListener('click', open); closeBtn.addEventListener('click', close); backdrop.addEventListener('click', close);
  checkoutBtn.addEventListener('click', () => { close(); alert('Detta är en demo – ingen betalning sker.'); });
  renderCartItems();
}
function renderCartItems() {
  const wrap = document.getElementById('cartItems'); wrap.innerHTML='';
  const tpl = document.getElementById('cartItemTpl'); let subtotal=0;
  Object.entries(state.cart).forEach(([id, qty])=>{
    const p = PRODUCTS.find(x=>x.id===id); if(!p) return;
    subtotal += p.price*qty;
    const node = tpl.content.cloneNode(true);
    node.querySelector('.cart-item__img').src = p.image;
    node.querySelector('.cart-item__img').alt = p.name;
    node.querySelector('.cart-item__title').textContent = p.name;
    node.querySelector('.cart-item__price').textContent = SEK.format(p.price/100);
    const qtyInput = node.querySelector('.qty-input'); qtyInput.value = qty;
    node.querySelector('.inc').addEventListener('click', ()=> changeQty(id,+1));
    node.querySelector('.dec').addEventListener('click', ()=> changeQty(id,-1));
    qtyInput.addEventListener('change',(e)=> setQty(id, parseInt(e.target.value||'1',10)));
    node.querySelector('.remove').addEventListener('click', ()=> removeFromCart(id));
    wrap.append(node);
  });
  document.getElementById('cartSubtotal').textContent = SEK.format(subtotal/100);
}
function addToCart(id, qty=1) { state.cart[id]=(state.cart[id]||0)+qty; saveCart(); updateCartBadge(); renderCartItems(); document.getElementById('cartDrawer').classList.add('open'); document.getElementById('backdrop').hidden=false; document.getElementById('cartDrawer').setAttribute('aria-hidden','false'); }
function removeFromCart(id) { delete state.cart[id]; saveCart(); updateCartBadge(); renderCartItems(); }
function changeQty(id, delta) { const next=Math.max(1,(state.cart[id]||1)+delta); state.cart[id]=next; saveCart(); updateCartBadge(); renderCartItems(); }
function setQty(id, qty) { const next=Math.max(1, qty||1); state.cart[id]=next; saveCart(); updateCartBadge(); renderCartItems(); }
function loadCart() { try { return JSON.parse(localStorage.getItem('cart')||'{}'); } catch { return {}; } }
function saveCart() { localStorage.setItem('cart', JSON.stringify(state.cart)); }
function updateCartBadge() { const count=Object.values(state.cart).reduce((a,b)=>a+b,0); document.getElementById('cartCount').textContent = count; }
