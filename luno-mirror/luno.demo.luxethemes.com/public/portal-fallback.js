(function () {
  var MODAL_ID = "local-portal-modal";

  function normalizePortalMode(raw) {
    if (!raw) return null;
    if (raw.indexOf("signin") === 0) return "signin";
    if (raw.indexOf("signup") === 0) return "signup";
    if (raw.indexOf("account") === 0) return "account";
    return null;
  }

  function portalTarget(mode) {
    if (mode === "signin") return "/sign-in/";
    if (mode === "signup") return "/sign-up/";
    if (mode === "account") return "/membership/";
    return "/";
  }

  function ensureModal() {
    var modal = document.getElementById(MODAL_ID);
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = MODAL_ID;
    modal.setAttribute("aria-hidden", "true");
    modal.style.cssText = [
      "position:fixed",
      "inset:0",
      "z-index:9999",
      "display:none",
      "align-items:center",
      "justify-content:center",
      "background:rgba(10,12,16,0.62)",
      "backdrop-filter:blur(3px)",
      "padding:24px"
    ].join(";");

    var panel = document.createElement("div");
    panel.style.cssText = [
      "position:relative",
      "width:min(980px,96vw)",
      "height:min(86vh,820px)",
      "border-radius:14px",
      "overflow:hidden",
      "background:#fff",
      "box-shadow:0 20px 70px rgba(0,0,0,.35)"
    ].join(";");

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.textContent = "Close";
    closeBtn.setAttribute("aria-label", "Close dialog");
    closeBtn.style.cssText = [
      "position:absolute",
      "top:10px",
      "right:10px",
      "z-index:2",
      "border:0",
      "padding:8px 10px",
      "border-radius:999px",
      "background:rgba(0,0,0,.65)",
      "color:#fff",
      "cursor:pointer",
      "font:600 12px/1 system-ui,-apple-system,sans-serif"
    ].join(";");

    var iframe = document.createElement("iframe");
    iframe.title = "Membership portal";
    iframe.setAttribute("loading", "eager");
    iframe.style.cssText = [
      "width:100%",
      "height:100%",
      "border:0",
      "display:block",
      "background:#fff"
    ].join(";");

    panel.appendChild(closeBtn);
    panel.appendChild(iframe);
    modal.appendChild(panel);
    document.body.appendChild(modal);

    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closePortal();
      }
    });

    closeBtn.addEventListener("click", closePortal);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.style.display !== "none") {
        closePortal();
      }
    });

    return modal;
  }

  function openPortal(mode, preserveHash) {
    var modal = ensureModal();
    var iframe = modal.querySelector("iframe");
    iframe.src = portalTarget(mode) + "?embedded=1";
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (!preserveHash) {
      var nextHash = "#/portal/" + (mode === "signin" ? "signin" : mode === "account" ? "account" : "signup");
      if (window.location.hash !== nextHash) {
        history.pushState(null, "", nextHash);
      }
    }
  }

  function closePortal() {
    var modal = document.getElementById(MODAL_ID);
    if (!modal) return;
    var iframe = modal.querySelector("iframe");
    if (iframe) iframe.src = "about:blank";
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (window.location.hash.indexOf("#/portal/") === 0) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }

  function bindPortalTriggers() {
    document.querySelectorAll("[data-portal]").forEach(function (node) {
      var mode = normalizePortalMode(node.getAttribute("data-portal"));
      if (!mode) return;

      if (node.tagName === "A") {
        node.setAttribute("href", "#/portal/" + (mode === "account" ? "account" : mode));
      } else {
        node.style.cursor = "pointer";
      }

      node.addEventListener("click", function (e) {
        e.preventDefault();
        openPortal(mode);
      });
    });

    // Header buttons were rewritten to /sign-in/ and /sign-up/; restore portal-style behavior.
    document.querySelectorAll('a[href="/sign-in/"]').forEach(function (a) {
      if (a.textContent && a.textContent.trim().toLowerCase() === "sign in") {
        a.setAttribute("href", "#/portal/signin");
        a.addEventListener("click", function (e) {
          e.preventDefault();
          openPortal("signin");
        });
      }
    });

    document.querySelectorAll('a[href="/sign-up/"]').forEach(function (a) {
      if (a.textContent && a.textContent.trim().toLowerCase() === "subscribe") {
        a.setAttribute("href", "#/portal/signup");
        a.addEventListener("click", function (e) {
          e.preventDefault();
          openPortal("signup");
        });
      }
    });

    // Legacy hash links
    document.querySelectorAll('a[href="#/portal/signin"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        openPortal("signin");
      });
    });
    document.querySelectorAll('a[href="#/portal/signup"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        openPortal("signup");
      });
    });
  }

  function bindSubscribeForms() {
    document.querySelectorAll('form[data-members-form="subscribe"]').forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        openPortal("signup");
      });
    });
  }

  function handleHashRoute() {
    var hash = window.location.hash || "";
    if (hash.indexOf("#/portal/") !== 0) {
      closePortal();
      return;
    }

    var mode = hash.replace("#/portal/", "").split("/")[0];
    mode = normalizePortalMode(mode) || "signup";
    openPortal(mode, true);
  }

  function boot() {
    bindPortalTriggers();
    bindSubscribeForms();
    handleHashRoute();
    window.addEventListener("hashchange", handleHashRoute);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
