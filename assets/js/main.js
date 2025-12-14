const params = new URLSearchParams(window.location.search);
let page = params.get('page');

if (!page) page = 'introduction/introduction';
sel_page = `docs/${page}.html`;


fetch(sel_page)
  .then(response => {
    if (!response.ok) throw new Error(`Failed to load ${sel_page}`);
    return response.text();
  })
  .then(html => {
    document.querySelector('main').innerHTML = html;
    main();
  })
  .catch(err => {
    console.error(err);
    document.querySelector('main').innerHTML = `<p style="color:red;">Error loading ${sel_page}</p>`;
  });

async function loadSidebar() {
try {
  const res = await fetch("menu.json");
  const data = await res.json();

  const sidebar = document.getElementById("sidebar-container");

  data.sections.forEach(section => {
    const sectionTitle = document.createElement("h3");
    sectionTitle.textContent = section.title;
    sidebar.appendChild(sectionTitle);

    const ul = document.createElement("ul");

    section.items.forEach(item => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `index.html?page=${item.page}`;
      a.textContent = item.label;

      if (page === item.page) {
        a.classList.add("active");
        document.title = `Moding AOE2 - ${item.label}`;
      }

      li.appendChild(a);
      ul.appendChild(li);
    });

    sidebar.appendChild(ul);
  });

} catch (err) {
  console.error("Failed to load sidebar:", err);
}
}

loadSidebar();

function linkify(url, regex) {
  if (regex.test(page)) return;
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(textNode => {
    if (!textNode.parentElement) return;
    if (textNode.parentElement.tagName === "A") return; // don't double-wrap

    if (!regex.test(textNode.nodeValue)) return;

    const span = document.createElement("span");
    span.innerHTML = textNode.nodeValue.replace(regex, match => {
      return `<a href="${url}">${match}</a>`;
    });

    textNode.replaceWith(...span.childNodes);
  });
}

function for_all_civs() {
  const regex = /^.*\{\{civ\}\}.*$/m;
  civs = ["AFTI", "ASIA","MEDI", "MESO", "NOMAD", "ORIE", "SEAS", "SLAV", "WEST"];

  if (regex.test(page)) return;
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(textNode => {
    if (!textNode.parentElement) return;
    if (textNode.parentElement.tagName === "A") return; // don't double-wrap

    if (!regex.test(textNode.nodeValue)) return;

    const span = document.createElement("span");
    civs.forEach(civ =>{
      let value = textNode.nodeValue;
      span.innerHTML += value.replace("{{civ}}", civ);
    });

    textNode.replaceWith(...span.childNodes);
  });
}

function main(){
  // Copy Code
  

  document.querySelectorAll("pre").forEach(pre => {

    const span = document.createElement("span");
    span.textContent = "Copy code";

    span.addEventListener("click", () => {
      const code = pre.querySelector("code")?.innerText || pre.innerText;

      navigator.clipboard.writeText(code).then(() => {
        const old = span.textContent;
        span.textContent = "Copied!";
        setTimeout(() => span.textContent = old, 800);
      });
    });

    pre.appendChild(span);


  document.querySelectorAll("pre code").forEach(code => {
    if (code.dataset.attrHighlighted) return;
    code.dataset.attrHighlighted = "1";

    const raw = code.textContent;

    const highlighted = raw.replace(
      /("[^"]+")\s*:/g,
      `${'<span class="json-attr">$1</span>'}:`
    );

    code.innerHTML = highlighted;
  });
    
  
  });

linkify(
  "index.html?page=in-game-ui/collection",
  /\bcollections?\b/i
);

linkify(
  "index.html?page=in-game-ui/viewport",
  /\bviewports?\b/i
);

linkify(
  "index.html?page=in-game-ui/viewport",
  /\widgets?\b/i
);


linkify(
  "index.html?page=in-game-ui/state-materials",
  /\bstate-? ?materials?\b/i
);
linkify(
  "index.html?page=in-game-ui/state-materials",
  /\bdeadzones?\b/i
);

for_all_civs();
}