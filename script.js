/* ==========================================================
   WebsitesDeal Bangladesh — Premium Motion Engine
   Apollo.io-inspired animations
   File: script.js
   ========================================================== */

(() => {
  "use strict";

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  /* ---------- 1. Page Ready ---------- */

  document.documentElement.classList.add("js-enabled");

  const onReady = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, {
        once: true
      });
    } else {
      callback();
    }
  };

  onReady(() => {
    document.body.classList.add("page-ready");

    /* ---------- 2. Scroll Progress ---------- */

    let progressBar = $("#scrollProgress");

    if (!progressBar) {
      progressBar = document.createElement("div");
      progressBar.id = "scrollProgress";
      progressBar.setAttribute("aria-hidden", "true");

      Object.assign(progressBar.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "0%",
        height: "3px",
        zIndex: "99999",
        pointerEvents: "none",
        background: "linear-gradient(90deg,#8ed52e,#d5ff83)",
        transition: "width 80ms linear"
      });

      document.body.appendChild(progressBar);
    }

    let scrollTicking = false;

    function updateScrollProgress() {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;

      const percentage =
        scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

      progressBar.style.width = `${Math.min(100, percentage)}%`;
      scrollTicking = false;
    }

    window.addEventListener(
      "scroll",
      () => {
        if (!scrollTicking) {
          window.requestAnimationFrame(updateScrollProgress);
          scrollTicking = true;
        }
      },
      { passive: true }
    );

    updateScrollProgress();

    /* ---------- 3. Sticky Header ---------- */

    const header =
      $("header") ||
      $(".site-header") ||
      $(".navbar") ||
      $(".main-header");

    function updateHeader() {
      if (!header) return;

      header.classList.toggle("is-scrolled", window.scrollY > 24);
    }

    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    /* ---------- 4. Scroll Reveal ---------- */

    const revealSelectors = [
      ".reveal",
      ".reveal-up",
      ".reveal-left",
      ".reveal-right",
      ".fade-in",
      ".animate-on-scroll",
      ".section-heading",
      ".category-card",
      ".product-card",
      ".website-card",
      ".pricing-card",
      ".feature-card",
      ".testimonial-card"
    ];

    const revealElements = [
      ...new Set(revealSelectors.flatMap((selector) => $$(selector)))
    ];

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealElements.forEach((element) => {
        element.classList.add("is-visible");
      });
    } else {
      revealElements.forEach((element) => {
        element.classList.add("motion-ready");
      });

      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.12,
          rootMargin: "0px 0px -35px 0px"
        }
      );

      revealElements.forEach((element) => {
        revealObserver.observe(element);
      });
    }

    /* ---------- 5. Staggered Card Animations ---------- */

    const staggerGroups = [
      ".categories-grid",
      ".category-grid",
      ".products-grid",
      ".websites-grid",
      ".pricing-grid",
      ".features-grid",
      ".testimonials-grid"
    ];

    staggerGroups.forEach((selector) => {
      $$(selector).forEach((group) => {
        const cards = $$(
          ".category-card, .product-card, .website-card, .pricing-card, .feature-card, .testimonial-card",
          group
        );

        cards.forEach((card, index) => {
          card.style.setProperty(
            "--reveal-delay",
            `${Math.min(index * 80, 480)}ms`
          );
        });
      });
    });

    /* ---------- 6. Animated Number Counters ---------- */

    const counterElements = $$(
      "[data-count], .counter, [data-counter]"
    );

    function animateCounter(element) {
      if (element.dataset.countAnimated === "true") return;

      element.dataset.countAnimated = "true";

      const rawValue =
        element.dataset.count ??
        element.dataset.counter ??
        element.textContent.trim();

      const numericValue = Number(
        String(rawValue).replace(/[^\d.-]/g, "")
      );

      if (!Number.isFinite(numericValue)) return;

      if (reduceMotion) {
        element.textContent = formatCounter(
          numericValue,
          element.dataset.countSuffix || ""
        );
        return;
      }

      const duration = 1400;
      const startTime = performance.now();

      function frame(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = numericValue * eased;

        element.textContent = formatCounter(
          current,
          element.dataset.countSuffix || ""
        );

        if (progress < 1) {
          requestAnimationFrame(frame);
        }
      }

      requestAnimationFrame(frame);
    }

    function formatCounter(value, suffix) {
      const rounded = Math.round(value);
      return rounded.toLocaleString("en-US") + suffix;
    }

    if ("IntersectionObserver" in window && !reduceMotion) {
      const counterObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            animateCounter(entry.target);
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.5 }
      );

      counterElements.forEach((counter) => {
        counterObserver.observe(counter);
      });
    } else {
      counterElements.forEach(animateCounter);
    }

    /* ---------- 7. Mobile Navigation ---------- */

    const menuToggle =
      $("#menuToggle") ||
      $("#mobileMenuToggle") ||
      $(".menu-toggle") ||
      $(".mobile-menu-toggle");

    const mobileMenu =
      $("#mobileMenu") ||
      $(".mobile-menu") ||
      $(".nav-links");

    if (menuToggle && mobileMenu) {
      menuToggle.setAttribute("aria-expanded", "false");

      menuToggle.addEventListener("click", () => {
        const isOpen =
          menuToggle.getAttribute("aria-expanded") === "true";

        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        mobileMenu.classList.toggle("is-open", !isOpen);
        document.body.classList.toggle("menu-open", !isOpen);
      });

      $$("a", mobileMenu).forEach((link) => {
        link.addEventListener("click", () => {
          menuToggle.setAttribute("aria-expanded", "false");
          mobileMenu.classList.remove("is-open");
          document.body.classList.remove("menu-open");
        });
      });

      document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape") return;

        menuToggle.setAttribute("aria-expanded", "false");
        mobileMenu.classList.remove("is-open");
        document.body.classList.remove("menu-open");
      });
    }

    /* ---------- 8. Smooth Anchor Scrolling ---------- */

    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (event) => {
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

        if (history.replaceState) {
          history.replaceState(null, "", href);
        }
      });
    });

    /* ---------- 9. Premium Card Hover ---------- */

    if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
      const interactiveCards = $$(
        ".product-card, .website-card, .category-card, .feature-card, .pricing-card"
      );

      interactiveCards.forEach((card) => {
        card.addEventListener("pointerenter", () => {
          card.classList.add("is-hovered");
        });

        card.addEventListener("pointerleave", () => {
          card.classList.remove("is-hovered");
        });
      });
    }

    /* ---------- 10. Hero Parallax ---------- */

    const heroVisual =
      $(".hero-visual") ||
      $(".hero-image") ||
      $(".hero-dashboard") ||
      $(".hero-preview");

    if (
      heroVisual &&
      !reduceMotion &&
      window.matchMedia("(hover: hover) and (min-width: 768px)").matches
    ) {
      let pointerFrame = null;

      document.addEventListener("pointermove", (event) => {
        if (pointerFrame) return;

        pointerFrame = requestAnimationFrame(() => {
          const x = (event.clientX / window.innerWidth - 0.5) * 8;
          const y = (event.clientY / window.innerHeight - 0.5) * 8;

          heroVisual.style.setProperty("--pointer-x", `${x}px`);
          heroVisual.style.setProperty("--pointer-y", `${y}px`);

          pointerFrame = null;
        });
      });
    }

    /* ---------- 11. Pricing Billing Toggle ---------- */

    const billingToggle =
      $("#billingToggle") ||
      $("[data-billing-toggle]");

    if (billingToggle) {
      const priceElements = $$("[data-monthly-price]");
      const isCheckbox = billingToggle.type === "checkbox";

      function updatePricing() {
        const annual = isCheckbox
          ? billingToggle.checked
          : billingToggle.getAttribute("aria-pressed") === "true";

        priceElements.forEach((priceElement) => {
          const monthly = priceElement.dataset.monthlyPrice;
          const yearly = priceElement.dataset.yearlyPrice;

          const selectedPrice = annual ? yearly : monthly;

          if (selectedPrice !== undefined) {
            priceElement.textContent = selectedPrice;
          }
        });

        if (!isCheckbox) {
          billingToggle.setAttribute("aria-pressed", String(!annual));
        }

        $$("[data-billing-label]").forEach((label) => {
          label.classList.toggle(
            "is-active",
            label.dataset.billingLabel === (annual ? "yearly" : "monthly")
          );
        });
      }

      billingToggle.addEventListener("change", updatePricing);

      if (!isCheckbox) {
        billingToggle.addEventListener("click", updatePricing);
      }

      updatePricing();
    }

    /* ---------- 12. Back To Top ---------- */

    let backToTop = $("#backToTop");

    if (!backToTop) {
      backToTop = document.createElement("button");
      backToTop.id = "backToTop";
      backToTop.type = "button";
      backToTop.setAttribute("aria-label", "Back to top");
      backToTop.textContent = "↑";

      Object.assign(backToTop.style, {
        position: "fixed",
        right: "22px",
        bottom: "22px",
        width: "46px",
        height: "46px",
        border: "1px solid rgba(183,243,74,.35)",
        borderRadius: "50%",
        background: "#b7f34a",
        color: "#07110d",
        fontSize: "23px",
        fontWeight: "700",
        cursor: "pointer",
        zIndex: "999",
        opacity: "0",
        visibility: "hidden",
        transform: "translateY(10px)",
        transition: "opacity .25s ease, transform .25s ease, visibility .25s",
        boxShadow: "0 8px 28px rgba(0,0,0,.2)"
      });

      document.body.appendChild(backToTop);
    }

    function updateBackToTop() {
      const visible = window.scrollY > 500;

      backToTop.style.opacity = visible ? "1" : "0";
      backToTop.style.visibility = visible ? "visible" : "hidden";
      backToTop.style.transform = visible
        ? "translateY(0)"
        : "translateY(10px)";
    }

    window.addEventListener("scroll", updateBackToTop, {
      passive: true
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    });

    updateBackToTop();

    /* ---------- 13. Current Year ---------- */

    $$("[data-current-year]").forEach((element) => {
      element.textContent = new Date().getFullYear();
    });

    /* ---------- 14. Newsletter Form Feedback ---------- */

    $$("[data-newsletter-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();

        const emailInput = $('input[type="email"]', form);
        const message = $("[data-form-message]", form);

        if (!emailInput || !emailInput.checkValidity()) {
          emailInput?.reportValidity();
          return;
        }

        if (message) {
          message.textContent =
            "ধন্যবাদ! ফর্মটি প্রস্তুত। সাবস্ক্রিপশন চালু করতে ব্যাকএন্ড সংযোগ প্রয়োজন।";
          message.setAttribute("role", "status");
        }
      });
    });

    /* ---------- 15. Image Loading ---------- */

    $$("img").forEach((image) => {
      if (!image.hasAttribute("loading") && !image.closest(".hero")) {
        image.loading = "lazy";
      }

      image.addEventListener("error", () => {
        image.classList.add("image-load-error");
      });
    });

    /* ---------- 16. Console Brand ---------- */

    console.info(
      "%c WebsitesDeal Bangladesh ",
      "background:#b7f34a;color:#07110d;padding:7px 12px;border-radius:5px;font-weight:bold;"
    );

    console.info("Premium motion engine initialized.");
  });
})();
