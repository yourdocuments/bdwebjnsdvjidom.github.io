/* =========================================================
   WEBSITESDEAL BANGLADESH
   Premium Motion & Interaction System
   File: script.js
   ========================================================= */

(() => {
  "use strict";

  const doc = document;
  const root = doc.documentElement;
  const body = doc.body;

  /* ================= PAGE READY ================= */

  const pageReady = () => {
    root.classList.add("page-ready");
    root.classList.add("motion-ready");
    body.classList.add("page-ready");
  };

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", pageReady, { once: true });
  } else {
    pageReady();
  }

  /* ================= SAFE SELECTORS ================= */

  const $ = (selector, scope = doc) => scope.querySelector(selector);
  const $$ = (selector, scope = doc) =>
    Array.from(scope.querySelectorAll(selector));

  /* ================= SCROLL PROGRESS ================= */

  let progressBar = $(
    "#scrollProgress, .scroll-progress, .scroll-progress-bar"
  );

  if (!progressBar) {
    progressBar = doc.createElement("div");
    progressBar.id = "scrollProgress";
    progressBar.setAttribute("aria-hidden", "true");
    body.appendChild(progressBar);
  }

  progressBar.style.cssText +=
    ";position:fixed;top:0;left:0;height:3px;width:0;" +
    "z-index:2000;pointer-events:none;";

  let scrollTicking = false;

  function updateScrollProgress() {
    const scrollable =
      root.scrollHeight - root.clientHeight;

    const progress = scrollable > 0
      ? (root.scrollTop / scrollable) * 100
      : 0;

    progressBar.style.width = `${Math.min(100, progress)}%`;

    const header = $(
      "header, .site-header, .navbar, .main-header"
    );

    if (header) {
      header.classList.toggle("is-scrolled", root.scrollTop > 20);
    }

    const backTop = $("#backToTop, .back-to-top");

    if (backTop) {
      const visible = root.scrollTop > 450;

      backTop.classList.toggle("visible", visible);
      backTop.classList.toggle("is-visible", visible);
      backTop.setAttribute("aria-hidden", String(!visible));
    }

    scrollTicking = false;
  }

  window.addEventListener("scroll", () => {
    if (!scrollTicking) {
      scrollTicking = true;
      window.requestAnimationFrame(updateScrollProgress);
    }
  }, { passive: true });

  updateScrollProgress();

  /* ================= SCROLL REVEAL ================= */

  const revealSelectors = [
    ".reveal",
    ".reveal-up",
    ".fade-in",
    ".category-card",
    ".product-card",
    ".website-card",
    ".pricing-card",
    ".feature-card",
    ".testimonial-card"
  ];

  const revealElements = $$(revealSelectors.join(","));

  revealElements.forEach((element, index) => {
    if (!element.hasAttribute("data-reveal-delay")) {
      const siblings = Array.from(element.parentElement?.children || [])
        .filter(child => child.matches(revealSelectors.join(",")));

      const siblingIndex = siblings.indexOf(element);

      element.style.setProperty(
        "--reveal-delay",
        `${Math.max(0, siblingIndex) * 75}ms`
      );
    } else {
      const delay = Number(element.dataset.revealDelay) || 0;
      element.style.setProperty("--reveal-delay", `${delay}ms`);
    }

    element.classList.add("reveal-item");
  });

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    });

    revealElements.forEach(element => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(element => {
      element.classList.add("is-visible");
    });
  }

  /* ================= MOBILE NAVIGATION ================= */

  const menuButton = $(
    "#menuToggle, #mobileMenuToggle, .menu-toggle, .mobile-menu-toggle"
  );

  const navMenu = $(
    "#navLinks, #mobileMenu, .nav-links, .nav-menu"
  );

  function closeMobileMenu() {
    if (!menuButton || !navMenu) return;

    navMenu.classList.remove("is-open", "active", "open");
    menuButton.classList.remove("is-open", "active");
    menuButton.setAttribute("aria-expanded", "false");
  }

  if (menuButton && navMenu) {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Toggle navigation");

    menuButton.addEventListener("click", () => {
      const isOpen = navMenu.classList.contains("is-open");

      closeMobileMenu();

      if (!isOpen) {
        navMenu.classList.add("is-open");
        menuButton.classList.add("is-open");
        menuButton.setAttribute("aria-expanded", "true");
      }
    });

    $$("a", navMenu).forEach(link => {
      link.addEventListener("click", closeMobileMenu);
    });

    doc.addEventListener("click", event => {
      if (
        !navMenu.contains(event.target) &&
        !menuButton.contains(event.target)
      ) {
        closeMobileMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 680) {
        closeMobileMenu();
      }
    });
  }

  /* ================= SMOOTH ANCHOR SCROLL ================= */

  $$('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      let target;

      try {
        target = $(href);
      } catch {
        return;
      }

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });

      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", href);
      }
    });
  });

  /* ================= BACK TO TOP ================= */

  let backToTop = $("#backToTop, .back-to-top");

  if (!backToTop) {
    backToTop = doc.createElement("button");
    backToTop.id = "backToTop";
    backToTop.type = "button";
    backToTop.innerHTML = "&#8593;";
    backToTop.setAttribute("aria-label", "Back to top");
    backToTop.setAttribute("aria-hidden", "true");
    body.appendChild(backToTop);
  }

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth"
    });
  });

  /* ================= CARD HOVER ================= */

  const interactiveCards = $$(
    ".website-card, .product-card, .category-card, " +
    ".pricing-card, .feature-card, .testimonial-card"
  );

  interactiveCards.forEach(card => {
    card.addEventListener("pointerenter", () => {
      card.classList.add("is-hovered");
    });

    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-hovered");
    });
  });

  /* ================= ANIMATED COUNTERS ================= */

  const counters = $$(
    "[data-count], [data-counter], .counter"
  );

  function animateCounter(element) {
    if (element.dataset.countAnimated === "true") return;

    const rawValue =
      element.dataset.count ??
      element.dataset.counter ??
      element.textContent.trim();

    const target = Number(String(rawValue).replace(/,/g, ""));

    if (!Number.isFinite(target)) return;

    element.dataset.countAnimated = "true";

    const duration = reduceMotion
      ? 0
      : Number(element.dataset.duration) || 1400;

    const originalText = element.textContent.trim();
    const prefix = element.dataset.prefix || "";
    const suffix = element.dataset.suffix || "";

    const useGrouping = element.dataset.grouping !== "false";
    const decimals = Number(element.dataset.decimals) || 0;

    const formatNumber = value => {
      const formatted = value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping
      });

      return `${prefix}${formatted}${suffix}`;
    };

    if (duration === 0) {
      element.textContent = formatNumber(target);
      return;
    }

    const startTime = performance.now();

    function frame(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = target * eased;

      element.textContent = formatNumber(current);

      if (progress < 1) {
        window.requestAnimationFrame(frame);
      } else {
        element.textContent = formatNumber(target);
      }
    }

    if (
      !element.dataset.count &&
      !element.dataset.counter &&
      !prefix &&
      !suffix
    ) {
      element.dataset.counterOriginal = originalText;
    }

    window.requestAnimationFrame(frame);
  }

  if ("IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
      counterObserver.observe(counter);
    });
  } else {
    counters.forEach(animateCounter);
  }

  /* ================= PRICING BILLING TOGGLE ================= */

  const billingToggle = $(
    "#billingToggle, [data-billing-toggle]"
  );

  function updateBillingPrices(isYearly) {
    $$("[data-monthly], [data-yearly]").forEach(priceElement => {
      const newPrice = isYearly
        ? priceElement.dataset.yearly
        : priceElement.dataset.monthly;

      if (newPrice !== undefined) {
        priceElement.textContent = newPrice;
      }
    });

    $$("[data-billing-label]").forEach(label => {
      label.classList.toggle("active", label.dataset.billingLabel === (
        isYearly ? "yearly" : "monthly"
      ));
    });

    $$("[data-billing-period]").forEach(period => {
      period.textContent = isYearly ? "year" : "month";
    });

    doc.dispatchEvent(new CustomEvent("billingchange", {
      detail: { billing: isYearly ? "yearly" : "monthly" }
    }));
  }

  if (billingToggle) {
    const isCheckbox =
      billingToggle instanceof HTMLInputElement &&
      ["checkbox", "radio"].includes(billingToggle.type);

    const initialYearly = isCheckbox
      ? billingToggle.checked
      : billingToggle.getAttribute("aria-pressed") === "true";

    updateBillingPrices(initialYearly);

    billingToggle.addEventListener("change", () => {
      const yearly = isCheckbox
        ? billingToggle.checked
        : billingToggle.classList.contains("active");

      updateBillingPrices(yearly);
    });

    if (!isCheckbox) {
      billingToggle.addEventListener("click", () => {
        const yearly =
          billingToggle.getAttribute("aria-pressed") !== "true";

        billingToggle.setAttribute("aria-pressed", String(yearly));
        billingToggle.classList.toggle("active", yearly);

        updateBillingPrices(yearly);
      });
    }
  }

  /* ================= HERO PARALLAX ================= */

  if (!reduceMotion && window.matchMedia("(min-width: 900px)").matches) {
    const heroVisuals = $$(
      ".hero-visual, .hero-image, .hero-dashboard, .hero-preview"
    );

    heroVisuals.forEach(visual => {
      visual.addEventListener("pointermove", event => {
        const rect = visual.getBoundingClientRect();

        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        visual.style.transform =
          `perspective(900px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg)`;
      });

      visual.addEventListener("pointerleave", () => {
        visual.style.transform = "";
      });
    });
  }

  /* ================= IMAGE LAZY LOADING ================= */

  $$("img").forEach(img => {
    if (!img.hasAttribute("loading") && !img.closest(".hero")) {
      img.loading = "lazy";
    }

    if (!img.hasAttribute("decoding")) {
      img.decoding = "async";
    }
  });

  /* ================= CURRENT YEAR ================= */

  $$("[data-current-year], #currentYear, .current-year").forEach(element => {
    element.textContent = String(new Date().getFullYear());
  });

  /* ================= NEWSLETTER FORM ================= */

  $$("[data-newsletter-form], .newsletter-form").forEach(form => {
    form.addEventListener("submit", event => {
      event.preventDefault();

      const emailInput = $('input[type="email"]', form);
      const message = $(
        "[data-newsletter-message], .newsletter-message, .form-message"
      );

      if (!emailInput || !emailInput.checkValidity()) {
        if (emailInput) {
          emailInput.reportValidity();
        }
        return;
      }

      if (message) {
        message.textContent =
          "ধন্যবাদ! ফর্মটি প্রস্তুত। ইমেইল সাবস্ক্রিপশন চালু করতে সার্ভার সংযোগ প্রয়োজন।";

        message.setAttribute("role", "status");
      }

      form.dispatchEvent(new CustomEvent("newsletter:submitted", {
        bubbles: true,
        detail: { email: emailInput.value.trim() }
      }));
    });
  });

  /* ================= FAQ ACCORDION ================= */

  $$("[data-faq-question], .faq-question").forEach(question => {
    question.addEventListener("click", () => {
      const item = question.closest(".faq-item") || question.parentElement;
      const answer = item?.querySelector(
        "[data-faq-answer], .faq-answer"
      );

      if (!answer) return;

      const isOpen = question.getAttribute("aria-expanded") === "true";

      question.setAttribute("aria-expanded", String(!isOpen));
      answer.hidden = isOpen;
      item.classList.toggle("is-open", !isOpen);
    });
  });

  /* ================= ESCAPE KEY ================= */

  doc.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  /* ================= DEBUG ================= */

  console.info(
    "%c WebsitesDeal Bangladesh ",
    "background:#b7f34a;color:#07110d;padding:5px 9px;border-radius:5px;font-weight:bold;",
    "Premium UI initialized."
  );

})();
