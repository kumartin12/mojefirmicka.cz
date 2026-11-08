(function () {
  var root = document.documentElement;
  function isDark() {
    var t = root.dataset.theme;
    return t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  // přepínač světlý / tmavý vzhled
  var themeBtn = document.querySelector(".theme");
  if (themeBtn) themeBtn.addEventListener("click", function () {
    var next = isDark() ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    syncTour();
  });

  // prohlídka – záložky se snímky
  var img = document.getElementById("tour-img"), cap = document.getElementById("tour-cap"), url = document.getElementById("tour-url");
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var current = tabs[0];
  function syncTour() {
    if (!img || !current) return;
    var src = "img/" + current.dataset.shot + (isDark() ? "-dark" : "") + ".webp";
    if (img.getAttribute("src") !== src) img.setAttribute("src", src);
    img.alt = current.querySelector("b").textContent + " ve Firmičce";
    cap.textContent = current.dataset.cap;
    url.textContent = "Firmička · " + current.querySelector("b").textContent;
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () {
      tabs.forEach(function (x) { x.setAttribute("aria-selected", x === t ? "true" : "false"); x.tabIndex = x === t ? 0 : -1; });
      current = t; syncTour();
    });
    t.addEventListener("keydown", function (e) {
      var d = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      var n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); n.click();
    });
    t.tabIndex = i ? -1 : 0;
  });
  // přednačíst ostatní snímky, ať přepínání neblikne
  if (img) window.addEventListener("load", function () {
    tabs.forEach(function (t) { new Image().src = "img/" + t.dataset.shot + (isDark() ? "-dark" : "") + ".webp"; });
  });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", syncTour);
  syncTour();

  // zvětšení snímku
  var lb = document.getElementById("lb");
  if (lb && lb.showModal) {
    document.addEventListener("click", function (e) {
      var z = e.target.closest(".zoom");
      if (!z) return;
      lb.querySelector("img").src = z.currentSrc || z.src;
      lb.querySelector("img").alt = z.alt;
      lb.querySelector("p").textContent = z === img ? cap.textContent : z.alt;
      lb.showModal();
    });
    lb.addEventListener("click", function (e) { if (e.target === lb || e.target.tagName === "BUTTON") lb.close(); });
  }
})();
