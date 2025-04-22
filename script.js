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
  const elClass = formatClass(element.element.class)
  renderElement(element, elClass)
});
