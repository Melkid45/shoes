import Splide from "@splidejs/splide";
import {
  ArrowDownRight,
  ArrowRight,
  Box,
  ChevronDown,
  ChevronRight,
  createIcons,
  Heart,
  Menu,
  Minus,
  Plus,
  Search,
  Star,
  User,
  X,
} from "lucide";
import "@splidejs/splide/css";
import { initNavigation, initLogin } from "./navigation.js";
import { initValidation } from "./validation.js";
import { initCatalogUI } from "./catalog.js";
createIcons({
  icons: {
    ChevronDown,
    Search,
    Heart,
    Box,
    User,
    ArrowDownRight,
    ArrowRight,
    Star,
    Plus,
    X,
    ChevronRight,
    Minus,
    Menu,
  },
});

// Faq

let faqItems = document.querySelectorAll(".faq__item");

faqItems.forEach((item) => {
  item.addEventListener("click", function (e) {
    let bottom = item.querySelector(".faq__item-bot");
    let height = bottom.scrollHeight;
    if (item.classList.contains("current")) {
      bottom.style.maxHeight = 0;
      item.classList.remove("current");
    } else {
      faqItems.forEach((faq) => {
        let bottom = faq.querySelector(".faq__item-bot");
        bottom.style.maxHeight = 0;
        faq.classList.remove("current");
      });
      bottom.style.maxHeight = `${height}px`;
      item.classList.add("current");
    }
  });
});

// Hero: ручное переключение и свайп без автопрокрутки.
const heroSlider = document.querySelector(".hero__slider");
if (heroSlider) {
  const hero = heroSlider.closest(".hero");
  const slider = new Splide(heroSlider, {
    type: "loop", perPage: 1, arrows: false, pagination: false,
    keyboard: "focused", speed: 450,
    reducedMotion: { speed: 0 },
  });
  const update = () => {
    hero.querySelector(".hero__count").textContent =
      `${String(slider.index + 1).padStart(2, "0")} / ${String(slider.length).padStart(2, "0")}`;
    const models = ["Кеды «Движение»", "Свобода движения", "Комфорт каждый день", "Комфорт в движении"];
    hero.querySelector(".hero__model h2").textContent = models[slider.index];
  };
  slider.on("mounted moved", update);
  slider.mount();
  hero.querySelectorAll(".hero__arrows button").forEach((button, i) => {
    button.addEventListener("click", () => slider.go(i ? ">" : "<"));
  });
}

// Product Slider

let productSlider = document.querySelector(".product__slider");

if (productSlider) {
  new Splide(productSlider, {
    perMove: 1,
    perPage: 1,
    pagination: false,
    type: "loop",
    gap: 24,
  }).mount();
}

// Person

let personButtons = document.querySelectorAll(".person__navigation-item");
let personSections = document.querySelectorAll(".sections__item");

personButtons.forEach((button, index) => {
  button.addEventListener("click", function () {
    personButtons.forEach((bt) => {
      bt.classList.remove("current");
    });
    button.classList.add("current");
    personSections.forEach((item, i) => {
      if (i == index) {
        item.classList.add("current");
      } else {
        item.classList.remove("current");
      }
    });
  });
});

initNavigation();
initLogin();
initCatalogUI();
initValidation();

// Размер раскрытого ответа обновляется при переносе текста на новой ширине.
window.addEventListener("resize", () => {
  document
    .querySelectorAll(".faq__item.current .faq__item-bot")
    .forEach((answer) => {
      answer.style.maxHeight = `${answer.scrollHeight}px`;
    });
});

document.querySelectorAll(".faq__item-top").forEach((trigger) => {
  trigger.tabIndex = 0;
  trigger.setAttribute("role", "button");
  trigger.setAttribute("aria-expanded", "false");
  trigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      trigger.click();
    }
  });
});
const faqObserver = new MutationObserver(() => {
  document.querySelectorAll(".faq__item").forEach((item) => {
    item
      .querySelector(".faq__item-top")
      ?.setAttribute(
        "aria-expanded",
        String(item.classList.contains("current")),
      );
  });
});
document
  .querySelectorAll(".faq__item")
  .forEach((item) =>
    faqObserver.observe(item, { attributes: true, attributeFilter: ["class"] }),
  );

const breadcrumb = document.querySelector(".breadcrumbs li:last-child p");
const pageNames = {
  "index.html": "Главная",
  "catalog.html": "Каталог",
  "order.html": "Оформление заказа",
  "product.html": "Кеды «Движение»",
  "card.html": "Корзина",
  "person.html": "Личный кабинет",
  "about.html": "О нас",
  "buy.html": "Где купить",
  "guard.html": "Гарантия и возврат",
  "review.html": "Отзывы",
  "phylosophy.html": "Философия МягкойОбуви",
};
if (breadcrumb)
  breadcrumb.textContent =
    pageNames[location.pathname.split("/").pop() || "index.html"] ||
    breadcrumb.textContent;
