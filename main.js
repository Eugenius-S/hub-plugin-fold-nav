// Свернуть пункты над списком сессий в один «Разделы». Свёрнутость хранится в этом браузере; открытый пункт
// остаётся виден, пока он открыт.
const KEY = "hub.navFolded";
const folded = () => localStorage.getItem(KEY) !== "0";   // по умолчанию свёрнуто

export default function register(hub) {
  hub.addStyle("style.css");
  hub.addSlot("sidebar.nav", {
    id: "fold",
    render(root) {
      let b = root.querySelector(".nav-fold");
      if (!b) {
        b = hub.el("button", "srow nav nav-fold");
        b.type = "button";
        b.addEventListener("click", () => {
          localStorage.setItem(KEY, folded() ? "0" : "1");
          apply(root, b);
        });
        root.replaceChildren(b);
      }
      // пункты и корень слота попадают на страницу уже после render — смотрим на них следом
      queueMicrotask(() => apply(root, b));
    },
  });

  function apply(root, b) {
    const host = root.parentElement;
    if (!host) return;
    const items = [...host.querySelectorAll(":scope > .srow.nav")];
    const f = folded();
    host.classList.toggle("nav-folded", f);
    const g = hub.el("span", "glyph"), ic = hub.el("span", "icon ext-icon");
    ic.style.setProperty("--src", `url("${hub.url("icon.svg")}")`); g.append(ic);
    const txt = hub.el("span", "txt");
    const names = items.map((i) => i.querySelector(".nm")?.textContent).filter(Boolean);
    txt.append(hub.el("span", "nm", "Разделы"), hub.el("span", "lb", names.join(", ")));
    const chev = hub.el("span", "chev", "▸");
    b.replaceChildren(g, txt, chev);
    b.setAttribute("aria-expanded", String(!f));
    b.title = f ? "Показать пункты" : "Свернуть пункты";
  }
}
