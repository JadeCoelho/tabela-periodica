import { elements } from "./elements.js";

function getList() {
  try {
    elements.sort((a, b) => a.element.atomicNumber - b.element.atomicNumber);
    return elements;
  } catch (error) {
    console.log(`Erro ao carregar lista: ${error}`);
    return [];
  }
}

function formatClass(c) {
  return c
    .normalize("NFD") // á = ´a; ã = ~a
    .replace(/[\u0301-\u0327]/g, "") // ´
    .replace(/\s+/g, "-")
    .toLowerCase();
}
//.replace(/[\u0301-\u0327\u00B4\u007E\u0327]/g, "");

function formatAtomicMass(element) {
  const num = element.element.atomicMass.range.min;

  if (Number.isInteger(num)) {
    return num;
  }

  const numString = num.toString().split(".");
  return `${numString[0]}.${numString[1].slice(0, 3)}`;
}

const list = getList();
const table = document.querySelector(".table");

function renderElementContent(element) {
  return `
  <header class="d-flex">
    <span class="atomNum">${element.element.atomicNumber}</span>
    <span class="atomMass">${formatAtomicMass(element)}</span>
  </header>
  <h2>${element.abbr}</h2>
  <p>${element.element.name}</p>
  `;
}

function renderElement(element, elementClass) {
  const el = document.createElement("div");
  el.classList.add("element", elementClass, "fd-col");
  el.style.gridColumn = element.element.group.column;
  el.style.gridRow = element.element.period;
  el.innerHTML = renderElementContent(element);
  table.appendChild(el);
}

list.forEach((element) => {
  const elClass = formatClass(element.element.class);
  renderElement(element, elClass);
});

const btnMode = document.querySelector(".btn-mode");
const btnVisibility = document.querySelector(".btn-visibility");

function toggleMode() {
  document.body.classList.toggle("dark-mode");
}

function toggleVisibility() {
  const isHidden = document.body.classList.toggle("hide-elements");
  btnVisibility.innerHTML = isHidden
    ? '<i class="bx bx-hide"></i>'
    : '<i class="bx bx-show"></i>';

  if (!isHidden) {
    allElements.forEach((element) => element.classList.remove("visible"));
  }
}

btnMode.addEventListener("click", toggleMode);
btnVisibility.addEventListener("click", toggleVisibility);

function filterFBlock(fb) {
  return list.filter((e) => e.element.class == fb);
}

const filteredLantanideos = filterFBlock("Lantanídeos");
const filteredActinideos = filterFBlock("Actinídeos");

filteredLantanideos.shift();
filteredActinideos.shift();

function hideFBlock(fb) {
  const fbEl = document.querySelectorAll(`.${fb}`);
  fbEl.forEach((el, i) => {
    if (i !== 0) el.style.display = "none";
  });
}

hideFBlock("lantanideos");
hideFBlock("actinideos");

const fBlock = document.querySelector(".f-block");

function renderRow(els, elClass) {
  els.forEach((el) => {
    const fEl = document.createElement("div");
    fEl.classList.add("element", elClass, "fd-col");
    fEl.innerHTML = renderElementContent(el);
    fBlock.appendChild(fEl);
  });
}

renderRow(filteredLantanideos, "lantanideos");
renderRow(filteredActinideos, "actinideos");

const allElements = document.querySelectorAll(".element");

function toggleElementVisibility(element) {
  element.addEventListener("click", () => {
    if (document.body.classList.contains("hide-elements")) {
      element.classList.toggle("visible");
    } else {
      element.classList.remove("visible");
    }
  });
}

allElements.forEach((e) => toggleElementVisibility(e));

const classes = [...new Set(list.map((element) => element.element.class))];

const legend = document.querySelector(".legend");

const root = document.documentElement;

function getCustomStyle(element, elementClass) {
  const color = getComputedStyle(root)
    .getPropertyValue(`--${elementClass}`)
    .trim();
  const borderStyle = document.body.classList.contains("dark-mode")
    ? `2px solid color-mix(in srgb, ${color}, #fff 28%)`
    : `2px solid color-mix(in srgb, ${color}, transparent 50%)`;
  element.classList.add("active");
  element.style.border = borderStyle;
}

function setDefaultStyle(element) {
  element.style.border = "none";
}

classes.forEach((cl) => {
  const formattedClass = formatClass(cl);
  const li = document.createElement("li");
  li.classList.add(formattedClass);

  li.innerHTML = `
  <span>${cl}</span>
  `;

  legend.appendChild(li);

  li.addEventListener("click", () => {
    allElements.forEach((element) => {
      element.classList.contains(formattedClass)
        ? getCustomStyle(element, formattedClass)
        : setDefaultStyle(element);
    });
  });
});

document.body.addEventListener("click", (event) => {
  if (event.target === event.currentTarget || event.target == table) {
    const active = document.querySelectorAll(".active");
    active.forEach((atv) => {
      atv.classList.remove("active");
      setDefaultStyle(atv);
    });
  }
});


