(function () {
  "use strict";

  function sendEvent(name, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params || {});
      return;
    }
    console.log("[event]", name, params || {});
  }

  function initPageViewEvents() {
    var page = document.body.getAttribute("data-page");
    if (page === "compare") {
      sendEvent("view_compare");
    }
    if (page === "lp_plaud") {
      sendEvent("view_lp_plaud");
    }
  }

  function initScrollEvents() {
    var fired50 = false;
    var fired80 = false;

    function onScroll() {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) {
        return;
      }
      var depth = ((window.scrollY || 0) / max) * 100;

      if (!fired50 && depth >= 50) {
        fired50 = true;
        sendEvent("scroll_50");
      }

      if (!fired80 && depth >= 80) {
        fired80 = true;
        sendEvent("scroll_80");
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initFaqEvent() {
    document.querySelectorAll("details").forEach(function (details) {
      details.addEventListener("toggle", function () {
        if (details.open) {
          sendEvent("expand_faq", { summary: details.querySelector("summary")?.textContent?.trim() || "" });
        }
      });
    });
  }

  function initButtonActions() {
    document.addEventListener("click", function (event) {
      var usecaseButton = event.target.closest("[data-usecase-target]");
      if (usecaseButton) {
        var targetId = usecaseButton.getAttribute("data-usecase-target");
        var section = document.getElementById(targetId);
        sendEvent("click_usecase_button", { usecase: targetId });
        if (section) {
          event.preventDefault();
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }

      var affiliate = event.target.closest(".js-affiliate");
      if (affiliate) {
        sendEvent("click_affiliate", {
          product: affiliate.getAttribute("data-product") || "unknown",
          href: affiliate.getAttribute("href") || ""
        });
      }

      var a8Plaud = event.target.closest(".js-a8-plaud");
      if (a8Plaud) {
        sendEvent("click_a8_plaud", { href: a8Plaud.getAttribute("href") || "" });
      }

      var toCompare = event.target.closest(".js-to-compare");
      if (toCompare) {
        sendEvent("click_to_compare", { href: toCompare.getAttribute("href") || "" });
      }
    });
  }

  initPageViewEvents();
  initScrollEvents();
  initFaqEvent();
  initButtonActions();
})();
