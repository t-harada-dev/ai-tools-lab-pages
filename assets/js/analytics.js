(function () {
  "use strict";

  function sendEvent(eventName, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params || {});
      return;
    }
    console.log("[analytics]", eventName, params || {});
  }

  function handleCtaClick(event) {
    var link = event.target.closest(".js-cta");
    if (!link) {
      return;
    }
    sendEvent("lp_cta_click", {
      cta_id: link.getAttribute("data-cta") || "unknown",
      href: link.getAttribute("href") || ""
    });
  }

  var firedDepth = {};

  function checkScrollDepth() {
    var scrollTop = window.scrollY || window.pageYOffset || 0;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) {
      return;
    }

    var depth = Math.round((scrollTop / docHeight) * 100);
    [50, 75, 90].forEach(function (threshold) {
      if (depth >= threshold && !firedDepth[threshold]) {
        firedDepth[threshold] = true;
        sendEvent("lp_scroll_depth", { percent: threshold });
      }
    });
  }

  document.addEventListener("click", handleCtaClick);
  window.addEventListener("scroll", checkScrollDepth, { passive: true });
  checkScrollDepth();
})();
