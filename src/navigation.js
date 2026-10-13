export function initNavigation() {
  const nav = document.querySelector(".header__navigation");
  const toggle = document.querySelector(".header__menu-toggle");
  if (!nav || !toggle) return;

  const closeMenu = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Открыть меню");
    nav.querySelectorAll("details[open]").forEach((item) => {
      item.open = false;
    });
  };
  toggle.addEventListener("click", () => {
    const open = !nav.classList.contains("is-open");
    closeMenu();
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    if (open) nav.querySelector("a").focus();
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });
  const dropdowns = [...document.querySelectorAll("[data-dropdown]")];
  const hoverMenu = matchMedia("(width > 1280px) and (hover: hover) and (pointer: fine)");
  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("pointerenter", () => {
      if (hoverMenu.matches) dropdown.open = true;
    });
    dropdown.addEventListener("pointerleave", () => {
      if (hoverMenu.matches) dropdown.open = false;
    });
    dropdown.querySelector("summary").addEventListener("click", (event) => {
      // На десктопе мышью управляет наведение; клавиатура и тач сохраняют details.
      if (hoverMenu.matches && event.detail > 0) event.preventDefault();
    });
    dropdown.addEventListener("focusout", (event) => {
      if (!dropdown.contains(event.relatedTarget) && !dropdown.matches(":hover"))
        dropdown.open = false;
    });
    dropdown.addEventListener("toggle", () => {
      if (dropdown.open)
        dropdowns.forEach((other) => {
          if (other !== dropdown) other.open = false;
        });
    });
  });
  document.addEventListener("click", (event) => {
    dropdowns.forEach((dropdown) => {
      if (!dropdown.contains(event.target)) dropdown.open = false;
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const openDropdown = dropdowns.find((item) => item.open);
      if (openDropdown) {
        openDropdown.open = false;
        openDropdown.querySelector("summary").focus();
      } else if (nav.classList.contains("is-open")) {
        closeMenu();
        toggle.focus();
      }
    }
    if (event.key === "Tab" && nav.classList.contains("is-open")) {
      const focusable = [toggle, ...nav.querySelectorAll("a, summary")].filter(
        (el) => el.getClientRects().length,
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  matchMedia("(width > 1280px)").addEventListener("change", closeMenu);
}

export function initLogin() {
  const dialog = document.querySelector("dialog.login");
  if (!dialog) return;
  document.querySelectorAll(".open--button").forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelector(".header__navigation")
        ?.classList.remove("is-open");
      const toggle = document.querySelector(".header__menu-toggle");
      toggle?.setAttribute("aria-expanded", "false");
      toggle?.setAttribute("aria-label", "Открыть меню");
      dialog.showModal();
    }),
  );
  dialog
    .querySelector(".close--button")
    ?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  const tabs = [...dialog.querySelectorAll(".login__head-choose h3")];
  const forms = [...dialog.querySelectorAll(".login__form")];
  tabs.forEach((tab, index) => {
    tab.setAttribute("role", "button");
    tab.tabIndex = 0;
    const activate = () => {
      tabs.forEach((item, i) => {
        item.classList.toggle("current", i === index);
        item.setAttribute("aria-pressed", String(i === index));
      });
      forms.forEach((form, i) => form.classList.toggle("current", i === index));
    };
    tab.setAttribute("aria-pressed", String(index === 0));
    tab.addEventListener("click", activate);
    tab.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activate();
      }
    });
  });
}
