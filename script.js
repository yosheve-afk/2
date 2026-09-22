/* =========================================================
   Amara Okafor, Accountant Portfolio, interactions
   ========================================================= */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fmt = new Intl.NumberFormat("en-US");

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky nav: shadow on scroll ---------- */
  var nav = document.getElementById("nav");
  function onScroll() {
    nav.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("nav-menu");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("is-open", open);
  }
  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  menu.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setMenu(false);
      toggle.focus();
    }
  });
  document.addEventListener("click", function (e) {
    if (!nav.contains(e.target)) setMenu(false);
  });
  // Reset when resizing back to desktop
  window.matchMedia("(min-width: 901px)").addEventListener("change", function (mq) {
    if (mq.matches) setMenu(false);
  });

  /* ---------- Active nav link on scroll ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link"));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Scroll reveal (Intersection Observer) ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  // Small stagger for siblings (services, timeline entries)
  document.querySelectorAll(".services, .timeline").forEach(function (group) {
    group.querySelectorAll(".reveal").forEach(function (el, i) {
      el.style.setProperty("--delay", i * 90 + "ms");
    });
  });

  if ("IntersectionObserver" in window && !prefersReduced) {
    var io = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Hero stat counters ---------- */
  function countUp(el, duration) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (prefersReduced) { el.textContent = fmt.format(target); return; }
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt.format(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Hero ledger: the one orchestrated moment ----------
     Rows fade in one at a time, totals count up, then the ledger
     settles to "Balanced" with a gold double underline. */
  var ledger = document.getElementById("ledger");
  var rows = ledger ? ledger.querySelectorAll(".ledger__row") : [];
  var totalD = document.getElementById("total-d");
  var totalC = document.getElementById("total-c");
  var status = document.getElementById("ledger-status");

  function fillRow(row) {
    var d = Number(row.getAttribute("data-d"));
    var c = Number(row.getAttribute("data-c"));
    var cells = row.querySelectorAll(".num");
    cells[0].textContent = d ? fmt.format(d) : "";
    cells[1].textContent = c ? fmt.format(c) : "";
  }

  function runLedger() {
    if (!ledger) return;
    var sumD = 0;
    var sumC = 0;

    function finish() {
      totalD.textContent = fmt.format(sumD);
      totalC.textContent = fmt.format(sumC);
      ledger.classList.add("is-balanced");
      status.textContent = sumD === sumC ? "Balanced" : "Out of balance";
    }

    if (prefersReduced) {
      rows.forEach(function (row) {
        fillRow(row);
        row.classList.add("is-in");
        sumD += Number(row.getAttribute("data-d"));
        sumC += Number(row.getAttribute("data-c"));
      });
      finish();
      return;
    }

    rows.forEach(function (row, i) {
      window.setTimeout(function () {
        fillRow(row);
        row.classList.add("is-in");
        sumD += Number(row.getAttribute("data-d"));
        sumC += Number(row.getAttribute("data-c"));
        totalD.textContent = fmt.format(sumD);
        totalC.textContent = fmt.format(sumC);
        if (i === rows.length - 1) window.setTimeout(finish, 450);
      }, 500 + i * 420);
    });
  }

  runLedger();
  document.querySelectorAll("[data-count]").forEach(function (el) {
    window.setTimeout(function () { countUp(el, 1400); }, 300);
  });

  /* ---------- Services: expandable rows ---------- */
  document.querySelectorAll(".service__btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
    });
  });

  /* ---------- Contact form: validation + friendly confirmation ---------- */
  var form = document.getElementById("contact-form");
  var formStatus = document.getElementById("form-status");

  function setError(input, message) {
    var field = input.closest(".field");
    field.classList.toggle("has-error", Boolean(message));
    field.querySelector(".field__error").textContent = message || "";
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function validate() {
    var ok = true;
    var name = form.elements.name;
    var email = form.elements.email;
    var message = form.elements.message;

    if (!name.value.trim()) { setError(name, "Enter your name."); ok = false; }
    else setError(name, "");

    if (!email.value.trim()) { setError(email, "Enter your email address."); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      setError(email, "Enter a valid email address, like name@company.com."); ok = false;
    } else setError(email, "");

    if (message.value.trim().length < 10) {
      setError(message, "Add a short message (at least 10 characters)."); ok = false;
    } else setError(message, "");

    return ok;
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      formStatus.className = "form__status";
      formStatus.textContent = "";

      if (!validate()) {
        var firstBad = form.querySelector('[aria-invalid="true"]');
        if (firstBad) firstBad.focus();
        return;
      }

      /* TODO: connect to your backend or a form service
         (e.g. Formspree, Netlify Forms, or your own endpoint):
         fetch("/api/contact", { method: "POST", body: new FormData(form) }) */

      formStatus.classList.add("is-success");
      formStatus.textContent = "Message sent. I'll reply within one working day.";
      form.reset();
    });

    form.addEventListener("input", function (e) {
      var t = e.target;
      if (t.closest(".field") && t.closest(".field").classList.contains("has-error")) validate();
    });
  }
})();
