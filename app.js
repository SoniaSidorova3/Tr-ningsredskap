// ===== Hjälp =====
const BASE = "https://soniasidorova3.github.io/Tr-ningsredskap/";
const fmt = new Intl.NumberFormat("sv-SE",{style:"currency",currency:"SEK"});
const $ = s => document.querySelector(s);
const el = (t,c)=>{const n=document.createElement(t); if(c) n.className=c; return n;};

// ===== Produkter =====
const products = [
  {
    id:"KIT-PASTELL",
    name:"Pastell Basic Kit",
    image: BASE+"img2.jpeg",
    description:"Komplett startkit för hemmaträning: halkfri matta, miniband och korta hantlar.",
    variants:[
      {id:"rosa",  label:"Rosa",  price:1299},
      {id:"mint",  label:"Mint",  price:1299},
      {id:"sand",  label:"Sand",  price:1299},
    ]
  },
  {
    id:"HANT-PASTELL",
    name:"Hantlar 5 & 8 kg – Pastell",
    image: BASE+"img3.jpeg",
    description:"Gummibelagda hantlar (5 & 8 kg). Skonsamma mot golv, bra grepp.",
    variants:[
      {id:"rosa",  label:"Rosa",  price:699},
      {id:"mint",  label:"Mint",  price:699},
      {id:"sand",  label:"Sand",  price:699},
    ]
  },
  {
    id:"BAND-POWER",
    name:"Power Band Set",
    image: BASE+"img4.jpeg",
    description:"Tre motstånd (lätt/medium/hårt). För funktionell träning och rehab.",
    variants:[
      {id:"svart", label:"Svart", price:499},
      {id:"multi", label:"Multicolor", price:499},
    ]
  },
  {
    id:"YOGA-MIN",
    name:"Yogamatta – Minimalism",
    image: BASE+"img5.jpeg",
    description:"4 mm TPE – mjuk, lätt att torka av. Rem för transport ingår.",
    variants:[
      {id:"grå",   label:"Grå",   price:399},
      {id:"svart", label:"Svart", price:399},
    ]
  }
];

// ===== Färgset (rabatt) =====
const bundles = [
  {
    id:"SET-PASTELL-MINT",
    name:"Färgset Pastell – Mint",
    items:["KIT-PASTELL","HANT-PASTELL","YOGA-MIN"],
    variantMap:{"KIT-PASTELL":"mint","HANT-PASTELL":"mint","YOGA-MIN":"grå"},
    image: BASE+"img2.jpeg",
    description:"Matchat set i mint/neutral.",
    discount:200  // dras i kundvagn
  },
  {
    id:"SET-PASTELL-ROSA",
    name:"Färgset Pastell – Rosa",
    items:["KIT-PASTELL","HANT-PASTELL","YOGA-MIN"],
    variantMap:{"KIT-PASTELL":"rosa","HANT-PASTELL":"rosa","YOGA-MIN":"grå"},
    image: BASE+"img2.jpeg",
    description:"Matchat set i rosa/neutral.",
    discount:200
  }
];

// ===== Kundvagn =====
const cart = [];
const subtotal = () => cart.reduce((s,i)=>s + i.price*i.qty, 0);
function addToCart(item){
  const key = `${item.id}:${item.variant||"std"}`;
  const ex = cart.find(x=>x.key===key);
  if(ex) ex.qty += item.qty;
  else cart.push({...item,key});
  renderCart();
}
function removeFromCart(key){
  const i = cart.findIndex(x=>x.key===key);
  if(i>-1){ cart.splice(i,1); renderCart(); }
}

// ===== Render produkter =====
function renderProducts(){
  const grid = $("#productGrid"); grid.innerHTML="";
  products.forEach(p=>{
    const card = el("article","card");
    const img = el("img"); img.src=p.image; img.alt=p.name;
    const pad = el("div","pad");
    const h3 = el("h3"); h3.textContent=p.name;
    const desc = el("p","muted"); desc.textContent=p.description;

    const select = el("select","select");
    p.variants.forEach(v=>{
      const o = el("option");
      o.value=v.id; o.textContent = `${v.label} — ${fmt.format(v.price)}`;
      select.appendChild(o);
    });

    const qty = el("div","qty");
    const l = el("label"); l.textContent="Antal";
    const input = el("input"); input.type="number"; input.min="1"; input.value="1";
    qty.append(l,input);

    const add = el("button","primary"); add.textContent="Lägg i kundvagn";
    add.onclick = ()=>{
      const v = p.variants.find(x=>x.id===select.value) || p.variants[0];
      addToCart({id:p.id,name:p.name,variant:v.label,price:v.price,qty:Math.max(1,parseInt(input.value||"1",10)),image:p.image});
      $("#cartDrawer").classList.add("open");
    };

    pad.append(h3,desc,select,qty,add);
    card.append(img,pad);
    grid.append(card);
  });
}

// ===== Render färgset =====
function renderBundles(){
  const grid = $("#bundleGrid"); grid.innerHTML="";
  bundles.forEach(b=>{
    const card = el("article","card");
    const img = el("img"); img.src = b.image; img.alt=b.name;
    const pad = el("div","pad");
    const h3 = el("h3"); h3.textContent=b.name;
    const desc = el("p","muted"); desc.textContent=b.description;

    // pris = summering av ingående varor minus rabatt
    const sum = b.items.reduce((s,id)=>{
      const p = products.find(x=>x.id===id);
      const v = p.variants.find(x=>x.id===b.variantMap[id]) || p.variants[0];
      return s + v.price;
    },0) - (b.discount||0);
    const price = el("div","price"); price.textContent = fmt.format(sum);

    const add = el("button","primary"); add.textContent="Lägg set i kundvagn";
    add.onclick = ()=>{
      b.items.forEach(id=>{
        const p = products.find(x=>x.id===id);
        const v = p.variants.find(x=>x.id===b.variantMap[id]) || p.variants[0];
        addToCart({id:p.id,name:p.name,variant:v.label,price:v.price,qty:1,image:p.image});
      });
      if(b.discount) addToCart({id:b.id,name:`${b.name} – paketrabatt`,price:-b.discount,qty:1,image:b.image});
      $("#cartDrawer").classList.add("open");
    };

    pad.append(h3,desc,price,add);
    card.append(img,pad);
    grid.append(card);
  });
}

// ===== Kundvagns-UI =====
function renderCart(){
  $("#cartCount").textContent = cart.reduce((s,i)=>s+i.qty,0);
  $("#cartSubtotal").textContent = fmt.format(subtotal());
  const list = $("#cartItems"); list.innerHTML="";
  if(cart.length===0){ list.innerHTML = '<p class="muted">Kundvagnen är tom.</p>'; return; }
  cart.forEach(i=>{
    const row = el("div","cart-row");
    const img = el("img","thumb"); img.src=i.image; img.alt=i.name;
    const info = el("div");
    info.innerHTML = `<strong>${i.name}</strong><br><span class="muted">${i.variant||""}</span><br>${i.qty} × ${fmt.format(i.price)}`;
    const rm = el("button","secondary"); rm.textContent="Ta bort"; rm.onclick=()=>removeFromCart(i.key);
    row.append(img,info,rm);
    list.append(row);
  });
}

// ===== Checkout via e-post =====
function buildMailto(){
  let lines = ["Beställning – Träningsredskap",""];
  cart.forEach(i=>lines.push(`${i.qty} × ${i.name}${i.variant?` (${i.variant})`:""} – ${fmt.format(i.price)}`));
  lines.push("",`Delsumma: ${fmt.format(subtotal())}`,"","Namn:","Adress:","Telefon:");
  const body = encodeURIComponent(lines.join("\n"));
  const subject = encodeURIComponent("Beställning – Träningsredskap");
  return `mailto:order@example.com?subject=${subject}&body=${body}`;
}

// ===== Init =====
function init(){
  renderProducts();
  renderBundles();
  $("#cartBtn").onclick = ()=>$("#cartDrawer").classList.add("open");
  $("#closeCart").onclick = ()=>$("#cartDrawer").classList.remove("open");
  $("#checkoutBtn").onclick = ()=>{ if(cart.length) window.location.href = buildMailto(); };
}
document.addEventListener("DOMContentLoaded", init);
