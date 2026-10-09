/* =========================================================
   WEBSITESDEAL BANGLADESH
   Integrated Interaction System
   File: script.js
   ========================================================= */

(() => {
  "use strict";

  const doc = document;
  const root = doc.documentElement;
  const $ = (selector, scope = doc) =>
    scope.querySelector(selector);
  const $$ = (selector, scope = doc) =>
    Array.from(scope.querySelectorAll(selector));

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* PAGE READY */
  function pageReady() {
    root.classList.add("page-ready", "motion-ready");
    doc.body.classList.add("page-ready");
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", pageReady, {
      once: true
    });
  } else {
    pageReady();
  }

  /* CURRENT YEAR */
  $$("#current-year, #currentYear, .current-year, [data-current-year]")
    .forEach(element => {
      element.textContent = String(new Date().getFullYear());
    });

  /* SCROLL PROGRESS */
  let progress = $("#scrollProgress");

  if (!progress) {
    progress = doc.createElement("div");
    progress.id = "scrollProgress";
    progress.setAttribute("aria-hidden", "true");
    doc.body.appendChild(progress);
  }

  Object.assign(progress.style, {
    position: "fixed",
    top: "0",
    left: "0",
    height: "3px",
    width: "0%",
    zIndex: "2000",
    pointerEvents: "none",
    background: "var(--green, #b7f34a)",
    transition: "width 80ms linear"
  });

  let scrollPending = false;

  function updateScroll() {
    const maxScroll =
      root.scrollHeight - root.clientHeight;

    const percentage = maxScroll > 0
      ? (root.scrollTop / maxScroll) * 100
      : 0;

    progress.style.width = `${percentage}%`;

    const header = $(".site-header");
    if (header) {
      header.classList.toggle(
        "is-scrolled",
        root.scrollTop > 20
      );
    }

    const backTop = $("#backToTop, .back-to-top");
    if (backTop) {
      const visible = root.scrollTop > 450;
      backTop.classList.toggle("is-visible", visible);
      backTop.classList.toggle("visible", visible);
    }

    scrollPending = false;
  }

  window.addEventListener("scroll", () => {
    if (!scrollPending) {
      scrollPending = true;
      window.requestAnimationFrame(updateScroll);
    }
  }, { passive: true });

  updateScroll();

  /* MOBILE NAVIGATION */
  const menuButton = $(
    "#menuToggle, #mobileMenuToggle, .menu-toggle, .mobile-menu-toggle"
  );

  const navMenu = $(
    ".main-nav, #navLinks, #mobileMenu, .nav-links, .nav-menu"
  );

  function closeMenu() {
    if (!menuButton || !navMenu) return;

    navMenu.classList.remove("is-open", "active", "open");
    menuButton.classList.remove("is-open", "active");
    menuButton.setAttribute("aria-expanded", "false");
  }

  if (menuButton && navMenu) {
    menuButton.setAttribute("aria-expanded", "false");

    menuButton.addEventListener("click", () => {
      const isOpen = navMenu.classList.contains("is-open");

      closeMenu();

      if (!isOpen) {
        navMenu.classList.add("is-open");
        menuButton.classList.add("is-open");
        menuButton.setAttribute("aria-expanded", "true");
      }
    });

    $$("a", navMenu).forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    doc.addEventListener("click", event => {
      if (
        !navMenu.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* SMOOTH ANCHOR LINKS */
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;

      const target = $(href);
      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });

      if (history.replaceState) {
        history.replaceState(null, "", href);
      }
    });
  });

  /* BACK TO TOP */
  let backTop = $("#backToTop, .back-to-top");

  if (!backTop) {
    backTop = doc.createElement("button");
    backTop.id = "backToTop";
    backTop.type = "button";
    backTop.textContent = "↑";
    backTop.setAttribute("aria-label", "Back to top");
    doc.body.appendChild(backTop);
  }

  backTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth"
    });
  });

  /* SCROLL REVEAL */
  const revealElements = $$(
    ".reveal, .reveal-up, .fade-in, .category-card, " +
    ".website-card, .pricing-card, .process-card"
  );

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    revealElements.forEach((element, index) => {
      element.style.setProperty(
        "--reveal-delay",
        `${(index % 4) * 70}ms`
      );
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(element => {
      element.classList.add("is-visible");
    });
  }

  /* WEBSITE CATEGORY FILTER */
  const filterButtons = $$(".filter-button");
  const websiteCards = $$(".website-card");

  function filterWebsites(category) {
    websiteCards.forEach(card => {
      const matches =
        category === "all" ||
        card.dataset.type === category;

      card.hidden = !matches;
      card.setAttribute("aria-hidden", String(!matches));

      if (matches) {
        card.classList.remove("is-filtered-out");
      } else {
        card.classList.add("is-filtered-out");
      }
    });

    filterButtons.forEach(button => {
      const active = button.dataset.filter === category;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      filterWebsites(button.dataset.filter || "all");
    });
  });

  /* CATEGORY CARDS LINK TO FILTERED WEBSITES */
  $$(".category-card[data-category]").forEach(card => {
    card.addEventListener("click", () => {
      const category = card.dataset.category;
      const matchingButton = filterButtons.find(
        button => button.dataset.filter === category
      );

      if (matchingButton) {
        filterWebsites(category);
      }
    });
  });

  /* THEME TOGGLE */
  const themeButton = $(".theme-toggle");

  function applyTheme(theme, save = true) {
    const selected = theme === "light" ? "light" : "dark";

    root.dataset.theme = selected;
    root.style.colorScheme = selected;

    if (themeButton) {
      themeButton.textContent =
        selected === "dark" ? "☼" : "◐";

      themeButton.setAttribute(
        "aria-label",
        selected === "dark"
          ? "Switch to light theme"
          : "Switch to dark theme"
      );

      themeButton.setAttribute(
        "aria-pressed",
        String(selected === "light")
      );
    }

    if (save) {
      try {
        localStorage.setItem("wd-theme", selected);
      } catch (_) {}
    }
  }

  let savedTheme = "dark";

  try {
    savedTheme = localStorage.getItem("wd-theme") || "dark";
  } catch (_) {}

  applyTheme(savedTheme, false);

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      applyTheme(
        root.dataset.theme === "light" ? "dark" : "light"
      );
    });
  }

  /* LANGUAGE SWITCH FOUNDATION
     HTML will receive data-i18n attributes in the next step.
  */
  const languageButton = $(".language-toggle");

  function applyLanguage(language, save = true) {
    const selected = language === "en" ? "en" : "bn";

    root.lang = selected;
    root.dataset.language = selected;

    $$("[data-i18n]").forEach(element => {
      const key = element.dataset.i18n;
      const translated = element.dataset[selected];

      if (translated !== undefined) {
        element.textContent = translated;
      }
    });

    $$("[data-i18n-html]").forEach(element => {
      const translated = element.dataset[selected];

      if (translated !== undefined) {
        element.innerHTML = translated;
      }
    });

    if (languageButton) {
      languageButton.innerHTML =
        selected === "bn" ? 'EN <span>⌄</span>' :
        'বাংলা <span>⌄</span>';

      languageButton.setAttribute(
        "aria-label",
        selected === "bn"
          ? "Switch language to English"
          : "ভাষা বাংলায় পরিবর্তন করুন"
      );
    }

    if (save) {
      try {
        localStorage.setItem("wd-language", selected);
      } catch (_) {}
    }
  }

  let savedLanguage = "bn";

  try {
    savedLanguage =
      localStorage.getItem("wd-language") || "bn";
  } catch (_) {}

  applyLanguage(savedLanguage, false);

  if (languageButton) {
    languageButton.addEventListener("click", () => {
      applyLanguage(
        root.dataset.language === "bn" ? "en" : "bn"
      );
    });
  }

  /* IMAGE LOADING */
  $$("img").forEach(img => {
    if (!img.hasAttribute("decoding")) {
      img.decoding = "async";
    }

    if (!img.hasAttribute("loading") && !img.closest(".hero")) {
      img.loading = "lazy";
    }
  });

  /* PRICING BUTTON FEEDBACK */
  $$(".plan-button[data-plan]").forEach(button => {
    button.addEventListener("click", () => {
      const plan = button.dataset.plan;

      try {
        sessionStorage.setItem("wd-selected-plan", plan);
      } catch (_) {}

      /* The page currently has no checkout backend.
         Keep the existing contact-section navigation. */
    });
  });

  /* FAQ ACCORDION SUPPORT */
  $$("[data-faq-question], .faq-question").forEach(button => {
    button.addEventListener("click", () => {
      const expanded =
        button.getAttribute("aria-expanded") === "true";

      button.setAttribute("aria-expanded", String(!expanded));

      const answer = button.nextElementSibling;
      if (answer) answer.hidden = expanded;
    });
  });

  /* REDUCED MOTION SUPPORT */
  if (reduceMotion) {
    root.classList.add("reduce-motion");
  }

})();
