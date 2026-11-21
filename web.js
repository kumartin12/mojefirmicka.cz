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
  // po kliknutí na stažení: šipka ke stahování v prohlížeči + jak povolit nepodepsaný soubor
  document.addEventListener("click", function (e) {
    var a = e.target.closest('a[download][href*="soubory/Firmicka"]');
    if (!a) return;
    var old = document.getElementById("dlhint");
    if (old) old.remove();
    var box = document.createElement("div");
    box.id = "dlhint"; box.className = "dlhint"; box.setAttribute("role", "status");
    box.innerHTML = '<svg class="dlhint-arrow" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 52L52 12M24 12h28v28"/></svg>' +
      '<div class="dlhint-card"><button type="button" class="dlhint-x" aria-label="Zavřít">×</button>' +
      '<b>Stahování začalo – najdete ho vpravo nahoře</b>' +
      '<p>Pokud prohlížeč napíše, že soubor <i>může být nebezpečný</i>, klikněte na ikonu stahování (šipka vpravo nahoře) a zvolte <b>Ponechat</b> nebo <b>Stáhnout podezřelý soubor</b>.</p>' +
      '<p class="dlhint-why">Firmička je nová a zatím nemá digitální podpis, proto ji prohlížeč ještě nezná. Soubor je zkontrolovaný antivirem.</p></div>';
    document.body.appendChild(box);
    box.querySelector(".dlhint-x").addEventListener("click", function () { box.remove(); });
    setTimeout(function () { if (box.parentNode) box.classList.add("dlhint-off"); }, 40000);
    setTimeout(function () { if (box.parentNode) box.remove(); }, 40600);
  });
})();
