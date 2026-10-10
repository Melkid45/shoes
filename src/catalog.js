// Только раскрытие фильтра. Логику каталога подключим в WordPress.
export function initCatalogUI() {
  const catalog = document.querySelector(".catalog");
  if (!catalog) return;

  const dialog = catalog.querySelector("#catalog-filter");
  const button = catalog.querySelector(".main__filter");
  const desktop = matchMedia("(width > 1024px)");
  const open = () => {
    if (desktop.matches) dialog.show();
    else dialog.showModal();
    button.setAttribute("aria-expanded", "true");
  };
  button.addEventListener("click", () => {
    if (dialog.open) dialog.close();
    else open();
  });
  dialog.querySelector(".filter__close").addEventListener("click", () => {
    dialog.close();
    button.focus();
  });
  dialog.addEventListener("close", () =>
    button.setAttribute("aria-expanded", String(dialog.open)),
  );
  dialog.addEventListener("click", (event) => {
    if (desktop.matches) return;
    const box = dialog.getBoundingClientRect();
    if (
      event.target === dialog &&
      (event.clientX < box.left ||
        event.clientX > box.right ||
        event.clientY < box.top ||
        event.clientY > box.bottom)
    )
      dialog.close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && desktop.matches && dialog.open) {
      dialog.close();
      button.focus();
    }
  });
  desktop.addEventListener("change", () => {
    if (!dialog.open) return;
    dialog.close();
    open();
  });
  dialog
    .querySelector("form")
    .addEventListener("submit", (event) => event.preventDefault());
}
