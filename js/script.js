/* ==========================================================================
   Granitebrook Builders — Demonstration Website
   Vanilla JavaScript. No dependencies, no API keys, no tracking.
   All forms run in DEMO MODE: nothing is transmitted anywhere.
   To connect a real backend, see README.md → "Connecting real lead capture".
   ========================================================================== */
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  /* ------------------------------------------------------------------
     0. Configuration — edit these to rebrand / connect services
     ------------------------------------------------------------------ */
  var CONFIG = {
    companyName: "Granitebrook Builders",
    demoMode: true,            // set to false only after wiring FORM_ENDPOINT
    formEndpoint: "",          // e.g. "/api/lead" (Cloudflare Pages Function) — never put secrets here
    // Business hours: 0 = Sunday … 6 = Saturday. [openHour, closeHour] in 24h, or null when closed.
    hours: { 0: null, 1: [7, 18], 2: [7, 18], 3: [7, 18], 4: [7, 18], 5: [7, 18], 6: [8, 13] },
    // ZIP codes / towns served (fictional service area)
    serviceTowns: ["Ashford", "Millbrook", "Cedar Ridge", "Harlow Springs", "Westvale", "Stonebridge", "Pine Hollow", "Northgate", "Lakeview", "Riverside"],
    serviceZips: ["75001", "75002", "75003", "75004", "75005", "75006", "75007", "75008", "75009", "75010", "75011", "75012"]
  };

  /* Unsplash image helper — photos are hotlinked per the Unsplash License/API guidelines. */
  function img(id, w) {
    if (/[\/.]/.test(id)) return id; // local path, e.g. "images/projects/my-photo.jpg"
    return "https://images.unsplash.com/photo-" + id + "?auto=format&fit=crop&w=" + (w || 1200) + "&q=75";
  }

  /* ------------------------------------------------------------------
     1. Data — sample projects & testimonials (ALL FICTIONAL)
     ------------------------------------------------------------------ */
  var PROJECTS = [
    {
      id: "cedar-ridge-farmhouse", title: "Cedar Ridge Modern Farmhouse", cats: ["residential"],
      location: "Cedar Ridge", size: "3,400 sq ft", duration: "9 months", year: "Sample",
      summary: "A ground-up custom home with board-and-batten styling, vaulted great room, and energy-efficient envelope.",
      details: "Illustrative scope: site prep, foundation, framing, MEP rough-in, spray-foam insulation, standing-seam accents, custom millwork, and final landscaping coordination.",
      images: ["1580587771525-78b9dba3b914", "1556156653-e5a7c69cc263", "1748063578185-3d68121b11ff"]
    },
    {
      id: "harlow-hillside", title: "Harlow Springs Hillside Residence", cats: ["residential"],
      location: "Harlow Springs", size: "4,850 sq ft", duration: "12 months", year: "Sample",
      summary: "Contemporary residence with pool deck, retaining walls, and floor-to-ceiling glazing.",
      details: "Illustrative scope: engineered retaining walls, post-tensioned slab, steel moment frames for large openings, pool deck, and smart-home pre-wire.",
      images: ["1600596542815-ffad4c1539a9", "1783125127199-860da9744dcc"]
    },
    {
      id: "millbrook-plaza", title: "Millbrook Professional Plaza", cats: ["commercial"],
      location: "Millbrook", size: "28,000 sq ft", duration: "14 months", year: "Sample",
      summary: "Two-story medical and professional office building with structured parking.",
      details: "Illustrative scope: tilt-up concrete shell, curtain wall, ADA-compliant site work, tenant improvement build-outs, and commercial HVAC.",
      images: ["1587994990528-14263e4ee443", "1621831337128-35676ca30868", "1723256761894-e7a8f5b47349"]
    },
    {
      id: "northgate-center", title: "Northgate Corporate Center", cats: ["commercial"],
      location: "Northgate", size: "62,000 sq ft", duration: "20 months", year: "Sample",
      summary: "Mid-rise corporate office with mirrored glass façade and landscaped campus.",
      details: "Illustrative scope: general contracting, steel erection coordination, unitized curtain wall, LEED-oriented MEP systems, and phased occupancy.",
      images: ["1776359913316-659ad961e7c8", "1580741276595-92d7e435d1f4", "1609668477087-9db6c2eb56ed"]
    },
    {
      id: "westvale-kitchen", title: "Westvale Loft Kitchen Transformation", cats: ["remodeling", "before-after"],
      location: "Westvale", size: "420 sq ft", duration: "7 weeks", year: "Sample",
      summary: "Gut renovation turning a bare-brick shell into a bright kitchen with an island and brass accents.",
      details: "Illustrative scope: demolition, structural header, new electrical circuits and lighting, plumbing relocation, custom cabinetry, quartz tops, and tile.",
      images: ["1661937070967-999d120dcf92", "1507089947368-19c1da9775ae", "1785535573585-8f962fa3cda5"],
      before: "1661937070967-999d120dcf92", after: "1507089947368-19c1da9775ae"
    },
    {
      id: "stonebridge-bath", title: "Stonebridge Primary Bath Remodel", cats: ["remodeling", "before-after"],
      location: "Stonebridge", size: "160 sq ft", duration: "5 weeks", year: "Sample",
      summary: "From stripped-down room to a warm, spa-style bath with freestanding tub.",
      details: "Illustrative scope: subfloor repair, waterproofing, new supply and drain lines, freestanding tub, custom vanity, and LED mirror lighting.",
      images: ["1566447695072-9f6cc2c84fb6", "1733426107854-ee00a25d72a7", "1733425844220-feab971190ff"],
      before: "1566447695072-9f6cc2c84fb6", after: "1733426107854-ee00a25d72a7"
    },
    {
      id: "pine-hollow-custom", title: "Pine Hollow Ground-Up Custom Home", cats: ["residential", "before-after"],
      location: "Pine Hollow", size: "3,900 sq ft", duration: "10 months", year: "Sample",
      summary: "Framing through final walkthrough on a modern two-story home with dramatic exterior lighting.",
      details: "Illustrative scope: engineered lumber framing, LVL beams, exterior cladding, architectural lighting plan, and full interior finishes.",
      images: ["1587582423116-ec07293f0395", "1748063578185-3d68121b11ff"],
      before: "1587582423116-ec07293f0395", after: "1748063578185-3d68121b11ff"
    },
    {
      id: "ashford-reroof", title: "Ashford Neighborhood Storm Re-Roof", cats: ["residential"],
      location: "Ashford", size: "6 homes", duration: "3 weeks", year: "Sample",
      summary: "Tear-off and replacement of architectural shingle roofs following hail damage.",
      details: "Illustrative scope: insurance documentation support, full tear-off, deck inspection, synthetic underlayment, ridge venting, and 50-year shingles.",
      images: ["1633759593085-1eaeb724fc88", "1710139323182-69622cad5c3b", "1590365876016-da05ac533e83"]
    },
    {
      id: "riverside-electrical", title: "Riverside Retail Electrical Upgrade", cats: ["commercial"],
      location: "Riverside", size: "12 suites", duration: "6 weeks", year: "Sample",
      summary: "Service upgrade and panel replacement for a multi-tenant retail center.",
      details: "Illustrative scope: utility coordination, 800A service upgrade, new distribution panels, LED retrofit, and after-hours work to keep tenants open.",
      images: ["1635335874521-7987db781153", "1621905251189-08b45d6a269e"]
    },
    {
      id: "lakeview-deck", title: "Lakeview Outdoor Living Deck", cats: ["residential"],
      location: "Lakeview", size: "640 sq ft", duration: "4 weeks", year: "Sample",
      summary: "Custom multi-level hardwood deck with built-in seating and dining area.",
      details: "Illustrative scope: helical pier footings, pressure-treated framing, hardwood decking, integrated lighting, and code-compliant railings.",
      images: ["1613544723371-23b514a78c85", "1613544723412-b331bda01e87"]
    },
    {
      id: "ashford-apartments", title: "Ashford Station Mixed-Use Apartments", cats: ["commercial"],
      location: "Ashford", size: "96 units", duration: "22 months", year: "Sample",
      summary: "Four-story mixed-use building with ground-floor retail and residential units above.",
      details: "Illustrative scope: podium construction, wood-frame residential levels, fire-rated assemblies, elevator installation, and site utilities.",
      images: ["1588148208486-a3b096a44537", "1763405739542-02991ab5416c"]
    },
    {
      id: "cedar-kitchen", title: "Cedar Ridge Kitchen Refresh", cats: ["remodeling"],
      location: "Cedar Ridge", size: "300 sq ft", duration: "4 weeks", year: "Sample",
      summary: "Open-plan kitchen update with stainless appliances and a waterfall island.",
      details: "Illustrative scope: cabinet replacement, island build, under-cabinet lighting, dedicated appliance circuits, and engineered hardwood flooring.",
      images: ["1484154218962-a197022b5858", "1785535573585-8f962fa3cda5"]
    }
  ];

  var TESTIMONIALS = [
    { name: "Dana R.", town: "Cedar Ridge", service: "residential", label: "Custom Home", rating: 5, text: "They walked us through every phase, sent weekly photo updates, and finished our home two weeks ahead of schedule. The craftsmanship shows in every detail." },
    { name: "Marcus T.", town: "Millbrook", service: "commercial", label: "Commercial Build", rating: 5, text: "Our office build-out had a tight move-in date. The project manager coordinated every trade and we opened on time without a single surprise change order." },
    { name: "Priya S.", town: "Westvale", service: "remodeling", label: "Kitchen Remodel", rating: 5, text: "The crew protected our home, cleaned up daily, and the kitchen is beyond what we imagined. Clear pricing from the first estimate to the final invoice." },
    { name: "Glen & Ruth H.", town: "Ashford", service: "roofing", label: "Roof Replacement", rating: 5, text: "After the hailstorm they documented the damage for our insurer and had a new roof on in two days. Professional from the first call." },
    { name: "Elena M.", town: "Stonebridge", service: "remodeling", label: "Bathroom Remodel", rating: 4, text: "Beautiful bathroom and great communication. One tile shipment was delayed, but they told us right away and adjusted the schedule without stress." },
    { name: "Jordan K.", town: "Riverside", service: "electrical", label: "Electrical Upgrade", rating: 5, text: "They upgraded the service for our retail center after hours so none of our tenants had to close. Organized, licensed, and safety-focused." },
    { name: "Aisha B.", town: "Harlow Springs", service: "plumbing", label: "Plumbing", rating: 5, text: "Repiped our older home and replaced the water heater. Fair quote, neat work, and they explained exactly what they found behind the walls." },
    { name: "Tom W.", town: "Lakeview", service: "residential", label: "Custom Deck", rating: 5, text: "Our new deck is where we spend every evening now. They helped with the design, pulled the permits, and the build quality is outstanding." },
    { name: "Renee L.", town: "Northgate", service: "commercial", label: "Tenant Improvement", rating: 4, text: "Solid team and a clean jobsite. Inspections passed the first time and the punch list was handled within a week of substantial completion." }
  ];

  /* ------------------------------------------------------------------
     2. Utilities
     ------------------------------------------------------------------ */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else if (k === "html") node.innerHTML = attrs[k]; // only used with static, trusted markup
      else if (k === "class") node.className = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return node;
  }
  var ICON = {
    star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/></svg>',
    pin: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    ruler: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 17L17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/></svg>',
    clock: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    camera: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
    arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };
  function starsHTML(n) {
    var s = "";
    for (var i = 1; i <= 5; i++) s += i <= n ? ICON.star : ICON.star.replace('fill="currentColor"', 'fill="currentColor" class="off"');
    return s;
  }
  function initials(name) {
    return name.replace(/&/g, " ").split(/\s+/).filter(Boolean).map(function (p) { return p[0]; }).join("").slice(0, 2).toUpperCase();
  }
  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    if (!t) { t = el("div", { id: "toast", class: "toast", role: "status", "aria-live": "polite" }); document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 4200);
  }
  function refCode(prefix) {
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", out = "";
    for (var i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return prefix + "-" + out;
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function isoDate(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function fmtHour(h) { var m = h % 1 ? ":30" : ":00"; var hh = Math.floor(h); return ((hh + 11) % 12 + 1) + m + (hh < 12 ? " AM" : " PM"); }
  function fmtLongDate(d) { return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" }); }
  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } }
  };

  /* Replace broken remote images with a neutral branded tile */
  var FALLBACK_SVG = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#2b3846"/><path d="M150 190l50-70 50 70z" fill="none" stroke="#f0a202" stroke-width="6"/><text x="200" y="232" fill="#aeb8c3" font-family="Arial" font-size="15" text-anchor="middle">Photo unavailable</text></svg>');
  function guardImage(image) {
    image.addEventListener("error", function onErr() {
      image.removeEventListener("error", onErr);
      image.src = FALLBACK_SVG;
      image.classList.add("img-fallback");
    });
  }

  /* ------------------------------------------------------------------
     3. Global UI: header, nav, back-to-top, reveal, year
     ------------------------------------------------------------------ */
  function initHeader() {
    var header = $(".site-header");
    var toggle = $(".nav-toggle");
    var nav = $("#site-nav");
    var backdrop = el("div", { class: "nav-backdrop" });
    document.body.appendChild(backdrop);

    function setOpen(open) {
      if (!toggle || !nav) return;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      nav.classList.toggle("is-open", open);
      backdrop.classList.toggle("is-open", open);
      document.body.classList.toggle("nav-open", open);
      if (open) { var first = $("a", nav); if (first) first.focus(); }
    }
    if (toggle) toggle.addEventListener("click", function () { setOpen(toggle.getAttribute("aria-expanded") !== "true"); });
    backdrop.addEventListener("click", function () { setOpen(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); }
    });
    if (nav) $$("a", nav).forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    window.addEventListener("resize", function () { if (window.innerWidth > 1060) setOpen(false); });

    var toTop = $(".to-top");
    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle("is-scrolled", y > 10);
      if (toTop) toTop.classList.toggle("show", y > 700);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (toTop) toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
  }

  function initReveal() {
    var items = $$(".reveal");
    if (!("IntersectionObserver" in window)) { items.forEach(function (i) { i.classList.add("is-visible"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (i) { io.observe(i); });
  }

  function initCounters() {
    var nums = $$("[data-count]");
    if (!nums.length) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function run(node) {
      var target = parseFloat(node.getAttribute("data-count"));
      var suffix = node.getAttribute("data-suffix") || "";
      if (reduce) { node.textContent = target.toLocaleString() + suffix; return; }
      var start = null, dur = 1400;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        node.textContent = Math.round(target * eased).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.4 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ------------------------------------------------------------------
     4. Projects: rendering, filtering, lightbox
     ------------------------------------------------------------------ */
  var CAT_LABEL = { residential: "Residential", commercial: "Commercial", remodeling: "Remodeling", "before-after": "Before & After" };

  function projectCard(p) {
    var cover = p.after || p.images[0];
    var primary = p.cats[0];
    var card = el("article", { class: "project-card", "data-cats": p.cats.join(" ") });
    var thumb = el("button", { class: "thumb", type: "button", "aria-label": "Open photo gallery: " + p.title });
    var image = el("img", { src: img(cover, 800), alt: p.title + " — illustrative project photo", loading: "lazy", width: "800", height: "600" });
    guardImage(image);
    thumb.appendChild(image);
    thumb.appendChild(el("span", { class: "tag", text: CAT_LABEL[primary] }));
    thumb.appendChild(el("span", { class: "photos", html: ICON.camera + " " + p.images.length + " photos" }));
    thumb.addEventListener("click", function () { openLightbox(p, 0); });
    card.appendChild(thumb);

    var body = el("div", { class: "body" });
    body.appendChild(el("span", { class: "sample-flag", text: "Sample project · Illustrative" }));
    body.appendChild(el("h3", { text: p.title }));
    var meta = el("div", { class: "project-meta" });
    meta.appendChild(el("span", { html: ICON.pin + " " }, [p.location]));
    meta.appendChild(el("span", { html: ICON.ruler + " " }, [p.size]));
    meta.appendChild(el("span", { html: ICON.clock + " " }, [p.duration]));
    body.appendChild(meta);
    body.appendChild(el("p", { text: p.summary }));
    var more = el("button", { type: "button", class: "link-arrow", style: "background:none;border-top:0;border-left:0;border-right:0;cursor:pointer;align-self:flex-start;font-size:.95rem", html: "View project details " + ICON.arrow });
    more.addEventListener("click", function () { openLightbox(p, 0); });
    body.appendChild(more);
    card.appendChild(body);
    return card;
  }

  function initProjects() {
    var grid = $("#project-grid");
    if (grid) {
      var limit = parseInt(grid.getAttribute("data-limit"), 10) || PROJECTS.length;
      var only = grid.getAttribute("data-ids");
      var list = only ? only.split(",").map(function (id) { return PROJECTS.filter(function (p) { return p.id === id.trim(); })[0]; }).filter(Boolean) : PROJECTS.slice(0, limit);
      var frag = document.createDocumentFragment();
      list.forEach(function (p) { frag.appendChild(projectCard(p)); });
      grid.innerHTML = "";
      grid.appendChild(frag);
    }

    var bar = $("#project-filters");
    if (bar && grid) {
      var note = $("#results-note");
      // counts
      $$(".filter-btn", bar).forEach(function (btn) {
        var f = btn.getAttribute("data-filter");
        var n = f === "all" ? PROJECTS.length : PROJECTS.filter(function (p) { return p.cats.indexOf(f) > -1; }).length;
        var c = $(".count", btn); if (c) c.textContent = n;
      });
      function apply(filter, push) {
        $$(".filter-btn", bar).forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-filter") === filter)); });
        var shown = 0;
        $$(".project-card", grid).forEach(function (card) {
          var match = filter === "all" || card.getAttribute("data-cats").split(" ").indexOf(filter) > -1;
          card.hidden = !match;
          if (match) { shown++; card.style.animation = "none"; void card.offsetWidth; card.style.animation = ""; }
        });
        if (note) note.textContent = "Showing " + shown + " " + (filter === "all" ? "sample projects" : CAT_LABEL[filter].toLowerCase() + " sample projects") + ".";
        if (push && history.replaceState) history.replaceState(null, "", filter === "all" ? location.pathname : "#" + filter);
        var baSection = $("#before-after");
        if (baSection && filter === "before-after" && push) baSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      bar.addEventListener("click", function (e) {
        var btn = e.target.closest(".filter-btn");
        if (btn) apply(btn.getAttribute("data-filter"), true);
      });
      function fromHash() { var h = (location.hash || "").replace("#", ""); return CAT_LABEL[h] ? h : "all"; }
      apply(fromHash(), false);
      window.addEventListener("hashchange", function () { apply(fromHash(), false); });
    }
  }

  var lb, lbState = { project: null, index: 0, lastFocus: null };
  function buildLightbox() {
    lb = el("div", { class: "lightbox", role: "dialog", "aria-modal": "true", "aria-labelledby": "lb-title", "aria-hidden": "true" });
    lb.innerHTML =
      '<div class="lightbox-top"><div><h2 class="lightbox-title" id="lb-title"></h2><span class="lightbox-counter"></span></div>' +
      '<button class="lb-btn lb-close" type="button" aria-label="Close gallery"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
      '<div><div class="lightbox-stage"><button class="lb-btn lb-prev" type="button" aria-label="Previous photo"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M15 6l-6 6 6 6"/></svg></button>' +
      '<img alt="" src="">' +
      '<button class="lb-btn lb-next" type="button" aria-label="Next photo"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg></button></div>' +
      '<p class="lightbox-desc"></p></div>' +
      '<div class="lightbox-thumbs" role="group" aria-label="Choose photo"></div>';
    document.body.appendChild(lb);
    guardImage($(".lightbox-stage img", lb));
    $(".lb-close", lb).addEventListener("click", closeLightbox);
    $(".lb-prev", lb).addEventListener("click", function () { showSlide(lbState.index - 1); });
    $(".lb-next", lb).addEventListener("click", function () { showSlide(lbState.index + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showSlide(lbState.index - 1);
      if (e.key === "ArrowRight") showSlide(lbState.index + 1);
      if (e.key === "Tab") { // focus trap
        var f = $$("button", lb).filter(function (b) { return b.offsetParent !== null; });
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    // swipe
    var sx = null;
    var stage = $(".lightbox-stage", lb);
    stage.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) showSlide(lbState.index + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }
  function openLightbox(project, index) {
    if (!lb) buildLightbox();
    lbState.project = project;
    lbState.lastFocus = document.activeElement;
    $(".lightbox-title", lb).textContent = project.title + " (Sample)";
    $(".lightbox-desc", lb).textContent = project.summary + " " + project.details + " Photos are licensed stock imagery used for demonstration.";
    var thumbs = $(".lightbox-thumbs", lb);
    thumbs.innerHTML = "";
    project.images.forEach(function (id, i) {
      var b = el("button", { type: "button", "aria-label": "Photo " + (i + 1) });
      var t = el("img", { src: img(id, 160), alt: "" });
      guardImage(t);
      b.appendChild(t);
      b.addEventListener("click", function () { showSlide(i); });
      thumbs.appendChild(b);
    });
    var multi = project.images.length > 1;
    $(".lb-prev", lb).hidden = !multi;
    $(".lb-next", lb).hidden = !multi;
    showSlide(index || 0);
    lb.classList.add("is-open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    $(".lb-close", lb).focus();
  }
  function showSlide(i) {
    var imgs = lbState.project.images;
    lbState.index = (i + imgs.length) % imgs.length;
    var stageImg = $(".lightbox-stage img", lb);
    stageImg.classList.remove("img-fallback");
    stageImg.src = img(imgs[lbState.index], 1600);
    stageImg.alt = lbState.project.title + " — photo " + (lbState.index + 1) + " of " + imgs.length;
    $(".lightbox-counter", lb).textContent = "Photo " + (lbState.index + 1) + " of " + imgs.length;
    $$(".lightbox-thumbs button", lb).forEach(function (b, n) { b.setAttribute("aria-current", String(n === lbState.index)); });
  }
  function closeLightbox() {
    lb.classList.remove("is-open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lbState.lastFocus) lbState.lastFocus.focus();
  }

  /* Before / After sliders */
  function initBeforeAfter() {
    var mount = $("#ba-list");
    if (mount) {
      var limit = parseInt(mount.getAttribute("data-limit"), 10) || 99;
      PROJECTS.filter(function (p) { return p.before; }).slice(0, limit).forEach(function (p) {
        var wrap = el("div", { class: "reveal" });
        wrap.innerHTML =
          '<div class="ba"><img class="ba-before" alt="Before: ' + p.title + '" loading="lazy">' +
          '<img class="ba-after" alt="After: ' + p.title + '" loading="lazy">' +
          '<span class="ba-label before">Before</span><span class="ba-label after">After</span>' +
          '<input class="ba-range" type="range" min="0" max="100" value="50" aria-label="Reveal before and after for ' + p.title + '">' +
          '<span class="ba-handle" aria-hidden="true"></span></div>' +
          '<div class="ba-caption"><h3></h3><p></p></div>';
        $(".ba-before", wrap).src = img(p.before, 1200);
        $(".ba-after", wrap).src = img(p.after, 1200);
        $(".ba-caption h3", wrap).textContent = p.title;
        $(".ba-caption p", wrap).textContent = p.summary;
        mount.appendChild(wrap);
      });
    }
    $$(".ba").forEach(function (ba) {
      $$("img", ba).forEach(guardImage);
      var range = $(".ba-range", ba);
      if (!range) return;
      function set(v) { ba.style.setProperty("--pos", v + "%"); }
      range.addEventListener("input", function () { set(range.value); });
      set(range.value);
    });
  }

  /* ------------------------------------------------------------------
     5. Testimonials: carousel, grid, filter, summary
     ------------------------------------------------------------------ */
  function testimonialCard(t) {
    var card = el("article", { class: "testimonial", "data-service": t.service });
    card.appendChild(el("div", { class: "stars", role: "img", "aria-label": t.rating + " out of 5 stars (sample rating)", html: starsHTML(t.rating) }));
    var q = el("blockquote");
    q.appendChild(el("p", { text: "“" + t.text + "”", style: "margin:0" }));
    card.appendChild(q);
    var person = el("div", { class: "testimonial-person" });
    person.appendChild(el("span", { class: "avatar", "aria-hidden": "true", text: initials(t.name) }));
    var who = el("div");
    who.appendChild(el("strong", { text: t.name }));
    who.appendChild(el("span", { text: t.label + " · " + t.town }));
    person.appendChild(who);
    card.appendChild(person);
    card.appendChild(el("span", { class: "badge-sample", text: "Fictional sample testimonial" }));
    return card;
  }

  function initTestimonials() {
    var track = $("#testimonial-track");
    if (track) {
      TESTIMONIALS.slice(0, 6).forEach(function (t) { track.appendChild(testimonialCard(t)); });
      initCarousel(track.closest(".carousel"));
    }
    var grid = $("#testimonial-grid");
    if (grid) {
      TESTIMONIALS.forEach(function (t) { grid.appendChild(testimonialCard(t)); });
      var filters = $("#testimonial-filters");
      if (filters) filters.addEventListener("click", function (e) {
        var b = e.target.closest(".filter-btn");
        if (!b) return;
        var f = b.getAttribute("data-filter");
        $$(".filter-btn", filters).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        var n = 0;
        $$(".testimonial", grid).forEach(function (c) { var m = f === "all" || c.getAttribute("data-service") === f; c.parentElement === grid && (c.hidden = !m); if (m) n++; });
        var note = $("#testimonial-note");
        if (note) note.textContent = n ? "Showing " + n + " sample testimonial" + (n === 1 ? "" : "s") + "." : "No sample testimonials in this category yet.";
      });
    }
    var summary = $("#rating-summary");
    if (summary) {
      var total = TESTIMONIALS.length;
      var avg = TESTIMONIALS.reduce(function (s, t) { return s + t.rating; }, 0) / total;
      $(".num", summary).textContent = avg.toFixed(1);
      $(".rating-big .stars", summary).innerHTML = starsHTML(Math.round(avg));
      $(".rating-big .stars", summary).setAttribute("aria-label", "Average " + avg.toFixed(1) + " out of 5 (sample data)");
      $(".total", summary).textContent = total;
      var bars = $(".rating-bars", summary);
      for (var s = 5; s >= 1; s--) {
        var c = TESTIMONIALS.filter(function (t) { return t.rating === s; }).length;
        var row = el("div", { class: "rating-bar" });
        row.appendChild(el("span", { text: s + " star" }));
        var tr = el("div", { class: "track" });
        tr.appendChild(el("div", { class: "fill", style: "width:" + (c / total * 100) + "%" }));
        row.appendChild(tr);
        row.appendChild(el("span", { text: String(c) }));
        bars.appendChild(row);
      }
    }
  }

  function initCarousel(root) {
    if (!root) return;
    var track = $(".carousel-track", root);
    var prev = $(".carousel-prev", root), next = $(".carousel-next", root), dotsWrap = $(".carousel-dots", root);
    var items = Array.prototype.slice.call(track.children);
    function perView() { var w = items[0] ? items[0].getBoundingClientRect().width : 1; return Math.max(1, Math.round(track.clientWidth / w)); }
    function pages() { return Math.max(1, Math.ceil(items.length / perView())); }
    function currentPage() { var w = items[0].getBoundingClientRect().width + 28; return Math.round(track.scrollLeft / (w * perView())); }
    function go(p) {
      p = (p + pages()) % pages();
      var target = items[Math.min(p * perView(), items.length - 1)];
      track.scrollTo({ left: target.offsetLeft - track.offsetLeft, behavior: "smooth" });
    }
    function renderDots() {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = "";
      for (var i = 0; i < pages(); i++) {
        (function (i) {
          var d = el("button", { type: "button", "aria-label": "Go to slide group " + (i + 1) });
          d.addEventListener("click", function () { go(i); });
          dotsWrap.appendChild(d);
        })(i);
      }
      sync();
    }
    function sync() { if (!dotsWrap) return; var cp = currentPage(); $$("button", dotsWrap).forEach(function (d, i) { d.setAttribute("aria-current", String(i === cp)); }); }
    if (prev) prev.addEventListener("click", function () { go(currentPage() - 1); });
    if (next) next.addEventListener("click", function () { go(currentPage() + 1); });
    var t; track.addEventListener("scroll", function () { clearTimeout(t); t = setTimeout(sync, 80); }, { passive: true });
    window.addEventListener("resize", renderDots);
    renderDots();
  }

  /* ------------------------------------------------------------------
     6. Small widgets: FAQ, tabs, service-area check, hours
     ------------------------------------------------------------------ */
  function initFAQ() {
    $$(".faq-q").forEach(function (q) {
      q.addEventListener("click", function () {
        var open = q.getAttribute("aria-expanded") === "true";
        q.setAttribute("aria-expanded", String(!open));
        var a = document.getElementById(q.getAttribute("aria-controls"));
        if (a) a.hidden = open;
      });
    });
  }

  function initTabs() {
    $$("[role='tablist']").forEach(function (list) {
      var tabs = $$("[role='tab']", list);
      function activate(tab, focus) {
        tabs.forEach(function (t) {
          var sel = t === tab;
          t.setAttribute("aria-selected", String(sel));
          t.tabIndex = sel ? 0 : -1;
          var panel = document.getElementById(t.getAttribute("aria-controls"));
          if (panel) panel.hidden = !sel;
        });
        if (focus) tab.focus();
        if (history.replaceState && tab.dataset.hash) history.replaceState(null, "", "#" + tab.dataset.hash);
      }
      tabs.forEach(function (t, i) {
        t.addEventListener("click", function () { activate(t); });
        t.addEventListener("keydown", function (e) {
          if (e.key === "ArrowRight") activate(tabs[(i + 1) % tabs.length], true);
          if (e.key === "ArrowLeft") activate(tabs[(i - 1 + tabs.length) % tabs.length], true);
        });
      });
      var hash = (location.hash || "").replace("#", "");
      var start = tabs.filter(function (t) { return t.dataset.hash === hash; })[0];
      if (start) activate(start);
      $$("[data-open-tab]").forEach(function (link) {
        link.addEventListener("click", function (e) {
          var target = tabs.filter(function (t) { return t.dataset.hash === link.getAttribute("data-open-tab"); })[0];
          if (target) { e.preventDefault(); activate(target); list.scrollIntoView({ behavior: "smooth", block: "start" }); }
        });
      });
    });
  }

  function initAreaCheck() {
    $$(".zip-check").forEach(function (form) {
      var input = $("input", form), out = form.parentElement.querySelector(".zip-result");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var v = input.value.trim();
        if (!v) { out.className = "zip-result no"; out.textContent = "Enter a ZIP code or town name."; input.focus(); return; }
        var lower = v.toLowerCase();
        var hit = CONFIG.serviceZips.indexOf(v) > -1 || CONFIG.serviceTowns.some(function (t) { return t.toLowerCase() === lower; });
        if (hit) { out.className = "zip-result ok"; out.textContent = "✓ Good news — " + v + " is inside our (demo) service area. Request a free estimate anytime."; }
        else { out.className = "zip-result no"; out.textContent = "✗ " + v + " is outside our standard area. Larger commercial projects may still qualify — contact us."; }
      });
    });
  }

  function initHours() {
    var now = new Date(), day = now.getDay(), h = now.getHours() + now.getMinutes() / 60;
    var today = CONFIG.hours[day];
    var open = !!(today && h >= today[0] && h < today[1]);
    $$(".open-status").forEach(function (s) {
      s.classList.add(open ? "open" : "closed");
      if (open) s.textContent = "Open now · until " + fmtHour(today[1]);
      else {
        var nd = day, tries = 0, label = "";
        if (today && h < today[0]) label = "today at " + fmtHour(today[0]);
        else {
          do { nd = (nd + 1) % 7; tries++; } while (!CONFIG.hours[nd] && tries < 7);
          label = (tries === 1 ? "tomorrow" : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][nd]) + " at " + fmtHour(CONFIG.hours[nd][0]);
        }
        s.textContent = "Closed now · opens " + label;
      }
    });
    $$(".hours-table tr[data-day]").forEach(function (tr) {
      if (tr.getAttribute("data-day").split(",").indexOf(String(day)) > -1) tr.classList.add("is-today");
    });
  }

  /* ------------------------------------------------------------------
     7. Form validation (shared)
     ------------------------------------------------------------------ */
  var MESSAGES = {
    required: "This field is required.",
    email: "Enter a valid email address (e.g. name@example.com).",
    tel: "Enter a valid 10-digit phone number.",
    minlength: function (n) { return "Please enter at least " + n + " characters."; },
    date: "Choose a date that is today or later.",
    choice: "Please choose an option."
  };

  function fieldWrap(input) { return input.closest(".field"); }
  function setError(input, msg) {
    var f = fieldWrap(input); if (!f) return;
    var err = $(".field-error", f);
    if (!err) { err = el("p", { class: "field-error", id: (input.id || input.name) + "-error" }); f.appendChild(err); }
    if (msg) {
      f.classList.add("has-error"); err.textContent = msg;
      input.setAttribute("aria-invalid", "true");
      var ids = (input.getAttribute("aria-describedby") || "").split(" ").filter(Boolean);
      if (ids.indexOf(err.id) < 0) { ids.push(err.id); input.setAttribute("aria-describedby", ids.join(" ")); }
    } else {
      f.classList.remove("has-error"); err.textContent = "";
      input.removeAttribute("aria-invalid");
    }
  }
  function validateInput(input) {
    if (input.disabled || input.type === "hidden") return true;
    var v = (input.value || "").trim();
    if (input.type === "radio" || input.type === "checkbox") {
      if (!input.required) return true;
      var group = input.type === "radio" ? $$("input[name='" + input.name + "']", input.form) : [input];
      var ok = group.some(function (g) { return g.checked; });
      var anchor = group[0];
      setError(anchor, ok ? "" : (input.type === "checkbox" ? "Please confirm to continue." : MESSAGES.choice));
      return ok;
    }
    var msg = "";
    if (input.required && !v) msg = input.tagName === "SELECT" ? MESSAGES.choice : MESSAGES.required;
    else if (v && input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = MESSAGES.email;
    else if (v && input.type === "tel" && v.replace(/\D/g, "").replace(/^1(?=\d{10}$)/, "").length !== 10) msg = MESSAGES.tel;
    else if (v && input.minLength > 0 && v.length < input.minLength) msg = MESSAGES.minlength(input.minLength);
    else if (v && input.type === "date" && input.min && v < input.min) msg = MESSAGES.date;
    setError(input, msg);
    return !msg;
  }
  function validateScope(scope) {
    var inputs = $$("input, select, textarea", scope);
    var seen = {}, firstBad = null, ok = true;
    inputs.forEach(function (i) {
      if (i.type === "radio") { if (seen[i.name]) return; seen[i.name] = true; }
      if (!validateInput(i)) { ok = false; if (!firstBad) firstBad = i; }
    });
    if (firstBad) firstBad.focus();
    return ok;
  }
  function liveValidate(form) {
    $$("input, select, textarea", form).forEach(function (i) {
      var evt = (i.type === "radio" || i.type === "checkbox" || i.tagName === "SELECT") ? "change" : "blur";
      i.addEventListener(evt, function () { validateInput(i); });
      i.addEventListener("input", function () { if (fieldWrap(i) && fieldWrap(i).classList.contains("has-error")) validateInput(i); });
    });
    $$("input[type='tel']", form).forEach(function (i) {
      i.addEventListener("input", function () {
        var d = i.value.replace(/\D/g, "").slice(0, 10);
        if (d.length > 6) i.value = "(" + d.slice(0, 3) + ") " + d.slice(3, 6) + "-" + d.slice(6);
        else if (d.length > 3) i.value = "(" + d.slice(0, 3) + ") " + d.slice(3);
        else i.value = d;
      });
    });
    $$("textarea[maxlength]", form).forEach(function (t) {
      var counter = t.parentElement.querySelector(".char-count");
      if (!counter) return;
      function upd() { counter.textContent = t.value.length + " / " + t.maxLength; }
      t.addEventListener("input", upd); upd();
    });
    $$("input[type='date'][data-min-today]", form).forEach(function (d) { d.min = isoDate(new Date()); });
  }
  function honeypotTripped(form) { var hp = $("input[name='company_website']", form); return hp && hp.value; }

  /* Collect values (used for demo summaries; this is where a real submit would POST) */
  function collect(form) {
    var data = {};
    $$("input, select, textarea", form).forEach(function (i) {
      if (!i.name || i.name === "company_website") return;
      if ((i.type === "radio" || i.type === "checkbox") && !i.checked) return;
      var label = i.value;
      if (i.tagName === "SELECT") label = (i.options[i.selectedIndex] || {}).text;
      else if (i.type === "radio" && i.id) { var l = form.querySelector("label[for='" + i.id + "']"); if (l) label = l.textContent.trim(); }
      data[i.name] = data[i.name] ? data[i.name] + ", " + label : label;
    });
    return data;
  }

  /*
   * submitLead — single place to connect a real backend.
   * In demo mode it resolves locally after a short delay and sends NOTHING.
   */
  function submitLead(type, data) {
    if (CONFIG.demoMode || !CONFIG.formEndpoint) {
      return new Promise(function (resolve) { setTimeout(function () { resolve({ ok: true, demo: true }); }, 700); });
    }
    return fetch(CONFIG.formEndpoint, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: type, data: data })
    }).then(function (r) { if (!r.ok) throw new Error("Request failed"); return r.json(); });
  }

  function renderSummary(dl, rows) {
    dl.innerHTML = "";
    rows.forEach(function (r) {
      if (!r[1]) return;
      dl.appendChild(el("dt", { text: r[0] }));
      dl.appendChild(el("dd", { text: r[1] }));
    });
  }

  function setBusy(btn, busy, label) {
    if (!btn) return;
    if (busy) { btn.dataset.label = btn.innerHTML; btn.disabled = true; btn.textContent = label || "Sending…"; }
    else { btn.disabled = false; if (btn.dataset.label) btn.innerHTML = btn.dataset.label; }
  }

  /* ------------------------------------------------------------------
     8. Quote form (multi-step) + estimator
     ------------------------------------------------------------------ */
  function initQuoteForm() {
    var form = $("#quote-form");
    if (!form) return;
    liveValidate(form);
    var steps = $$(".form-step", form);
    var markers = $$(".stepper li");
    var current = 0;
    var DRAFT_KEY = "gb_quote_draft";

    // Prefill from ?service= (e.g. quote.html?service=roofing)
    var params = new URLSearchParams(location.search);
    var svc = params.get("service");
    if (svc) { var r = $("input[name='project_type'][value='" + svc.replace(/[^a-z-]/g, "") + "']", form); if (r) r.checked = true; }

    // Restore draft (this browser only)
    var draft = store.get(DRAFT_KEY);
    if (draft && !svc) {
      Object.keys(draft).forEach(function (k) {
        var inputs = $$("[name='" + k + "']", form);
        inputs.forEach(function (i) {
          if (i.type === "radio" || i.type === "checkbox") i.checked = i.value === draft[k] || (draft[k] || "").split(", ").indexOf(i.value) > -1;
          else i.value = draft[k];
        });
      });
      var notice = $("#draft-notice");
      if (notice) notice.hidden = false;
    }
    var saveT;
    form.addEventListener("input", function () {
      clearTimeout(saveT);
      saveT = setTimeout(function () {
        var d = {};
        $$("input, select, textarea", form).forEach(function (i) {
          if (!i.name || i.name === "company_website" || i.name === "consent") return;
          if ((i.type === "radio" || i.type === "checkbox")) { if (i.checked) d[i.name] = d[i.name] ? d[i.name] + ", " + i.value : i.value; }
          else if (i.value) d[i.name] = i.value;
        });
        store.set(DRAFT_KEY, d);
      }, 400);
    });
    var clearDraft = $("#clear-draft");
    if (clearDraft) clearDraft.addEventListener("click", function () {
      store.del(DRAFT_KEY); form.reset(); $("#draft-notice").hidden = true; show(0, true); toast("Saved draft cleared.");
    });

    function show(i, initial) {
      current = i;
      steps.forEach(function (s, n) { s.classList.toggle("is-active", n === i); });
      markers.forEach(function (m, n) {
        m.classList.toggle("is-active", n === i);
        m.classList.toggle("is-done", n < i);
        if (n === i) m.setAttribute("aria-current", "step"); else m.removeAttribute("aria-current");
      });
      var live = $("#step-status");
      if (live) live.textContent = "Step " + (i + 1) + " of " + steps.length;
      if (initial) return;
      var top = form.closest(".form-card");
      if (top && top.getBoundingClientRect().top < 0) top.scrollIntoView({ behavior: "smooth", block: "start" });
      var h = $("h2", steps[i]); if (h) { h.tabIndex = -1; h.style.outline = "none"; h.focus({ preventScroll: true }); }
    }
    form.addEventListener("click", function (e) {
      if (e.target.closest("[data-next]")) { if (validateScope(steps[current])) show(current + 1); }
      if (e.target.closest("[data-prev]")) show(current - 1);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateScope(steps[current])) return;
      if (honeypotTripped(form)) return;
      var btn = $("button[type='submit']", form);
      var data = collect(form);
      setBusy(btn, true, "Submitting…");
      submitLead("quote", data).then(function () {
        setBusy(btn, false);
        var conf = $("#quote-confirmation");
        $(".ref-code", conf).textContent = refCode("GB-Q");
        $("[data-first-name]", conf).textContent = (data.full_name || "").split(" ")[0] || "there";
        renderSummary($("dl", conf), [
          ["Name", data.full_name], ["Email", data.email], ["Phone", data.phone],
          ["Project type", data.project_type], ["Property type", data.property_type],
          ["Location", data.project_location], ["Estimated budget", data.budget],
          ["Preferred consultation", data.consult_date ? fmtLongDate(new Date(data.consult_date + "T12:00:00")) + (data.consult_time ? " · " + data.consult_time : "") : "No preference"],
          ["Project description", data.description]
        ]);
        form.hidden = true;
        $(".stepper").hidden = true;
        conf.classList.add("show");
        conf.setAttribute("tabindex", "-1");
        conf.focus();
        conf.scrollIntoView({ behavior: "smooth", block: "start" });
        store.del(DRAFT_KEY);
      }).catch(function () {
        setBusy(btn, false);
        var a = $("#quote-alert"); a.textContent = "Something went wrong. Please try again or call us."; a.classList.add("show");
      });
    });

    var again = $("#quote-again");
    if (again) again.addEventListener("click", function () {
      form.reset(); form.hidden = false; $(".stepper").hidden = false;
      $("#quote-confirmation").classList.remove("show"); show(0);
    });
    show(0, true);
  }

  function initEstimator() {
    var est = $("#estimator");
    if (!est) return;
    // Illustrative per-sq-ft ranges (demo only — replace with the contractor's real pricing logic)
    var RATES = {
      "kitchen": { label: "Kitchen remodel", lo: 150, hi: 325, unit: "sq ft", def: 200, min: 60, max: 600 },
      "bathroom": { label: "Bathroom remodel", lo: 250, hi: 550, unit: "sq ft", def: 80, min: 30, max: 300 },
      "addition": { label: "Home addition", lo: 220, hi: 420, unit: "sq ft", def: 400, min: 100, max: 1500 },
      "new-home": { label: "Custom new home", lo: 190, hi: 380, unit: "sq ft", def: 2600, min: 1000, max: 6000 },
      "roof": { label: "Roof replacement", lo: 5, hi: 11, unit: "sq ft of roof", def: 2200, min: 800, max: 6000 },
      "deck": { label: "Custom deck", lo: 45, hi: 110, unit: "sq ft", def: 350, min: 100, max: 1200 },
      "commercial-ti": { label: "Commercial build-out", lo: 90, hi: 240, unit: "sq ft", def: 3000, min: 500, max: 20000 }
    };
    var FINISH = { standard: 0.85, premium: 1, luxury: 1.3 };
    var type = $("#est-type", est), size = $("#est-size", est), sizeVal = $("#est-size-val", est), unit = $("#est-unit", est), out = $(".range", est), note = $("#est-note", est);
    function syncSize(reset) {
      var r = RATES[type.value];
      size.min = r.min; size.max = r.max; size.step = r.max > 3000 ? 100 : 10;
      if (reset) size.value = r.def;
      unit.textContent = r.unit;
    }
    function calc() {
      var r = RATES[type.value];
      var f = FINISH[($("input[name='est-finish']:checked", est) || {}).value || "premium"];
      var s = parseFloat(size.value);
      sizeVal.textContent = s.toLocaleString();
      var lo = r.lo * s * f, hi = r.hi * s * f;
      var round = hi > 100000 ? 5000 : 500;
      out.textContent = money(Math.round(lo / round) * round) + " – " + money(Math.round(hi / round) * round);
      note.textContent = r.label + " · " + s.toLocaleString() + " " + r.unit;
    }
    type.addEventListener("change", function () { syncSize(true); calc(); });
    size.addEventListener("input", calc);
    $$("input[name='est-finish']", est).forEach(function (i) { i.addEventListener("change", calc); });
    syncSize(true); calc();
    var use = $("#est-use", est);
    if (use) use.addEventListener("click", function () {
      var desc = $("#description");
      if (desc) {
        var line = "Ballpark from online estimator: " + note.textContent + ", " + ($("input[name='est-finish']:checked", est) || {}).value + " finish — " + out.textContent + ".";
        desc.value = desc.value ? desc.value + "\n" + line : line;
        desc.dispatchEvent(new Event("input", { bubbles: true }));
        toast("Estimate added to your project description (Step 2).");
      }
    });
  }

  /* ------------------------------------------------------------------
     9. Appointment scheduler + contact form
     ------------------------------------------------------------------ */
  function initScheduler() {
    var root = $("#scheduler");
    if (!root) return;
    var form = $("#appointment-form");
    liveValidate(form);
    var grid = $(".cal-grid", root), title = $(".cal-title", root), prev = $(".cal-prev", root), next = $(".cal-next", root);
    var slotsWrap = $(".slots", root), slotsTitle = $("#slots-title"), pill = $(".selection-pill", root);
    var dateInput = $("input[name='appt_date']", form), timeInput = $("input[name='appt_time']", form);
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var view = new Date(today.getFullYear(), today.getMonth(), 1);
    var maxDate = new Date(today); maxDate.setDate(maxDate.getDate() + 60);
    var selected = null, selectedTime = null;
    var DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    $$(".cal-dow", grid).forEach(function (n) { n.remove(); });

    function available(d) {
      if (d < today || d > maxDate) return false;
      if (!CONFIG.hours[d.getDay()]) return false;
      return d.getTime() !== today.getTime(); // need 1 day notice
    }
    // Deterministic pseudo "booked" slots so the demo looks realistic
    function booked(d, h) { return ((d.getDate() * 7 + d.getMonth() * 3 + h * 5) % 9) < 2; }

    function renderCal() {
      grid.innerHTML = "";
      DOW.forEach(function (d) { grid.appendChild(el("div", { class: "cal-dow", "aria-hidden": "true", text: d })); });
      title.textContent = view.toLocaleDateString(undefined, { month: "long", year: "numeric" });
      var first = view.getDay(), days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
      for (var i = 0; i < first; i++) grid.appendChild(el("span", { class: "cal-day empty", "aria-hidden": "true" }));
      for (var day = 1; day <= days; day++) {
        (function (day) {
          var d = new Date(view.getFullYear(), view.getMonth(), day);
          var ok = available(d);
          var b = el("button", { type: "button", class: "cal-day" + (d.getTime() === today.getTime() ? " today" : ""), "aria-pressed": String(!!selected && selected.getTime() === d.getTime()), "aria-label": fmtLongDate(d) + (ok ? "" : " — unavailable"), text: String(day) });
          if (!ok) b.disabled = true;
          b.addEventListener("click", function () { selected = d; selectedTime = null; renderCal(); renderSlots(); updateSelection(); });
          grid.appendChild(b);
        })(day);
      }
      prev.disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
      next.disabled = new Date(view.getFullYear(), view.getMonth() + 1, 1) > maxDate;
    }
    function renderSlots() {
      slotsWrap.innerHTML = "";
      if (!selected) { slotsWrap.appendChild(el("p", { class: "slots-empty", text: "Select an available date to see consultation times." })); slotsTitle.textContent = "Available times"; return; }
      slotsTitle.textContent = "Available times · " + selected.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
      var hrs = CONFIG.hours[selected.getDay()];
      for (var h = hrs[0] + 1; h <= hrs[1] - 1; h += 1) {
        (function (h) {
          var label = fmtHour(h);
          var isBooked = booked(selected, h);
          var b = el("button", { type: "button", class: "slot", "aria-pressed": String(selectedTime === label), "aria-label": label + (isBooked ? " — booked" : ""), text: label });
          if (isBooked) b.disabled = true;
          b.addEventListener("click", function () { selectedTime = label; renderSlots(); updateSelection(); });
          slotsWrap.appendChild(b);
        })(h);
      }
    }
    function updateSelection() {
      dateInput.value = selected ? isoDate(selected) : "";
      timeInput.value = selectedTime || "";
      if (selected && selectedTime) {
        pill.classList.add("show");
        $("span", pill).textContent = fmtLongDate(selected) + " at " + selectedTime;
        var err = $("#slot-error"); if (err) err.hidden = true;
      } else pill.classList.remove("show");
    }
    prev.addEventListener("click", function () { view.setMonth(view.getMonth() - 1); renderCal(); });
    next.addEventListener("click", function () { view.setMonth(view.getMonth() + 1); renderCal(); });
    renderCal(); renderSlots();

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var slotOk = !!(selected && selectedTime);
      var err = $("#slot-error");
      if (!slotOk) { err.hidden = false; root.scrollIntoView({ behavior: "smooth", block: "center" }); }
      var ok = validateScope(form);
      if (!slotOk || !ok || honeypotTripped(form)) { if (!slotOk) { var firstDay = $(".cal-day:not([disabled])", grid); if (firstDay) firstDay.focus(); } return; }
      var data = collect(form), btn = $("button[type='submit']", form);
      setBusy(btn, true, "Requesting…");
      submitLead("appointment", data).then(function () {
        setBusy(btn, false);
        var conf = $("#appointment-confirmation");
        $(".ref-code", conf).textContent = refCode("GB-A");
        renderSummary($("dl", conf), [
          ["Requested time", fmtLongDate(selected) + " at " + selectedTime],
          ["Meeting type", data.appt_type], ["Name", data.appt_name], ["Email", data.appt_email], ["Phone", data.appt_phone],
          ["Project address", data.appt_address], ["Notes", data.appt_notes]
        ]);
        $("#appointment-flow").hidden = true;
        conf.classList.add("show"); conf.setAttribute("tabindex", "-1"); conf.focus();
      });
    });
    var again = $("#appointment-again");
    if (again) again.addEventListener("click", function () {
      form.reset(); selected = null; selectedTime = null; updateSelection(); renderCal(); renderSlots();
      $("#appointment-flow").hidden = false; $("#appointment-confirmation").classList.remove("show");
    });
  }

  function initSimpleForms() {
    $$("form[data-demo-form]").forEach(function (form) {
      liveValidate(form);
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validateScope(form) || honeypotTripped(form)) return;
        var data = collect(form), btn = $("button[type='submit']", form);
        var kind = form.getAttribute("data-demo-form");
        setBusy(btn, true);
        submitLead(kind, data).then(function () {
          setBusy(btn, false);
          var conf = document.getElementById(form.getAttribute("data-confirm"));
          if (conf) {
            var rc = $(".ref-code", conf); if (rc) rc.textContent = refCode(kind === "feedback" ? "GB-F" : "GB-M");
            var dl = $("dl", conf);
            if (dl) renderSummary(dl, Object.keys(data).map(function (k) { return [form.querySelector("[name='" + k + "']").getAttribute("data-label") || k, data[k]]; }));
            if (kind === "feedback") {
              var preview = $("#feedback-preview", conf);
              if (preview) {
                preview.innerHTML = "";
                var card = testimonialCard({ name: data.fb_name, town: data.fb_town || "Your town", label: data.fb_service, rating: parseInt(data.fb_rating, 10) || 5, text: data.fb_message, service: "" });
                $(".badge-sample", card).textContent = "Preview only — not published (demo)";
                preview.appendChild(card);
              }
            }
            form.hidden = true; conf.classList.add("show"); conf.setAttribute("tabindex", "-1"); conf.focus();
            var againBtn = $("[data-reset]", conf);
            if (againBtn) againBtn.onclick = function () { form.reset(); form.hidden = false; conf.classList.remove("show"); };
          } else {
            form.reset(); toast("Demo mode: your message was validated but not sent.");
          }
        });
      });
    });
  }

  /* Copy-to-clipboard buttons (e.g. phone/email placeholders) */
  function initCopy() {
    $$("[data-copy]").forEach(function (b) {
      b.addEventListener("click", function () {
        var text = b.getAttribute("data-copy");
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () { toast("Copied: " + text); }, function () { toast(text); });
        } else toast(text);
      });
    });
  }

  /* ------------------------------------------------------------------
     10. Boot
     ------------------------------------------------------------------ */
  function boot() {
    $$("img").forEach(guardImage);
    $$("[data-year]").forEach(function (n) { n.textContent = new Date().getFullYear(); });
    initHeader();
    initProjects();
    initBeforeAfter();
    initTestimonials();
    initFAQ();
    initTabs();
    initAreaCheck();
    initHours();
    initQuoteForm();
    initEstimator();
    initScheduler();
    initSimpleForms();
    initCopy();
    initCounters();
    initReveal();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
