/* dormakaba links – alle links staan in links.json.
   FALLBACK_DATA hieronder is enkel een reservekopie (gebruikt als links.json niet laadt, bv. via file://). */
(function () {
  "use strict";
  var FALLBACK_DATA = {"title": {"nl": "dormakaba links", "fr": "dormakaba liens"}, "subtitle": {"nl": "Joachim · Service automatische deuren", "fr": "Joachim · Service portes automatiques"}, "groups": [{"id": "rapporten", "title": {"nl": "Rapporten", "fr": "Rapports"}, "links": [{"icon": "📝", "label": {"nl": "Werkrapport", "fr": "Rapport de travail"}, "description": {"nl": "Digitaal werkrapport invullen", "fr": "Remplir le rapport de travail digital"}, "url": "https://sealink68.github.io/werkrapport"}, {"icon": "📄", "label": {"nl": "Servicerapport digitaal", "fr": "Rapport de service digital"}, "description": {"nl": "Adobe Acrobat", "fr": "Adobe Acrobat"}, "url": "https://acrobat.adobe.com/id/urn:aaid:sc:EU:077a6c93-880e-4d88-84d6-812244a83549"}], "show": "always"}, {"id": "onderdelen", "title": {"nl": "Onderdelen", "fr": "Pièces"}, "links": [{"icon": "🔧", "label": {"nl": "GBO spareparts", "fr": "GBO pièces détachées"}, "description": {"nl": "dormakaba onderdelenportaal", "fr": "Portail pièces dormakaba"}, "url": "https://de-my.dormakaba.com/de-en/spares"}, {"icon": "📦", "label": {"nl": "Stock magazijn 3.2 (PDF)", "fr": "Stock magasin 3.2 (PDF)"}, "description": {"nl": "Google Drive", "fr": "Google Drive"}, "url": "https://drive.google.com/file/d/1_qgB0beIkwuFmuwzTMTC94ivqMKsNI3y/view?usp=sharing"}], "show": "always"}, {"id": "opmeten", "title": {"nl": "Opmeetformulier", "fr": "Formulaire de mesure"}, "show": "mode", "links": [{"icon": "📐", "label": {"nl": "Opmeting Mesure (app)", "fr": "Opmeting Mesure (app)"}, "description": {"nl": "uitgebreid", "fr": "détaillé"}, "url": "https://sealink68.github.io/Dormakaba-opmeting/"}, {"icon": "📋", "label": {"nl": "dormakaba Opmetingsblad", "fr": "dormakaba Feuille de mesure"}, "description": {"nl": "compact", "fr": "compact"}, "url": "form.html?type=opmeting", "keywords": "formulier formulaire offerte offre opmeting"}]}, {"id": "offertes", "title": {"nl": "Offertes", "fr": "Offres"}, "show": "mode", "links": [{"icon": "🚪", "label": {"nl": "Draaideuren", "fr": "Portes battantes"}, "description": {"nl": "Offerteaanvraag · intern formulier", "fr": "Demande d’offre · formulaire interne"}, "url": "form.html?type=draaideuren", "keywords": "formulier formulaire offerte offre draaideuren"}, {"icon": "↔️", "label": {"nl": "ES200 / Easy / Easy+ / 2D / CS / EC2 / BST / FFT", "fr": "ES200 / Easy / Easy+ / 2D / CS / EC2 / BST / FFT"}, "description": {"nl": "Schuifdeuren · offerteaanvraag", "fr": "Portes coulissantes · demande d’offre"}, "url": "form.html?type=es200", "keywords": "formulier formulaire offerte offre es200"}, {"icon": "↔️", "label": {"nl": "ES90", "fr": "ES90"}, "description": {"nl": "Offerteaanvraag · intern formulier", "fr": "Demande d’offre · formulaire interne"}, "url": "form.html?type=es90", "keywords": "formulier formulaire offerte offre es90"}, {"icon": "↔️", "label": {"nl": "ES400", "fr": "ES400"}, "description": {"nl": "Offerteaanvraag · intern formulier", "fr": "Demande d’offre · formulaire interne"}, "url": "form.html?type=es400", "keywords": "formulier formulaire offerte offre es400"}, {"icon": "🔄", "label": {"nl": "TANE", "fr": "TANE"}, "description": {"nl": "Offerteaanvraag · intern formulier", "fr": "Demande d’offre · formulaire interne"}, "url": "form.html?type=tane", "keywords": "formulier formulaire offerte offre tane"}, {"icon": "🔩", "label": {"nl": "Proline", "fr": "Proline"}, "description": {"nl": "Offerteaanvraag · intern formulier", "fr": "Demande d’offre · formulaire interne"}, "url": "form.html?type=proline", "keywords": "formulier formulaire offerte offre proline"}, {"icon": "🧲", "label": {"nl": "CS 80 MAGNEO", "fr": "CS 80 MAGNEO"}, "description": {"nl": "Offerteaanvraag · intern formulier", "fr": "Demande d’offre · formulaire interne"}, "url": "form.html?type=cs80", "keywords": "formulier formulaire offerte offre cs80"}, {"icon": "🪟", "label": {"nl": "HSW", "fr": "HSW"}, "description": {"nl": "Horizontale schuifwanden · offerteaanvraag", "fr": "Parois coulissantes · demande d’offre"}, "url": "form.html?type=hsw", "keywords": "formulier formulaire offerte offre hsw"}]}], "modes": [{"id": "met", "color": "green", "label": {"nl": "Offerte met opmeting", "fr": "Offre avec mesure"}, "groups": ["opmeten", "offertes"]}, {"id": "zonder", "color": "red", "label": {"nl": "Offerte zonder opmeting", "fr": "Offre sans mesure"}, "groups": ["offertes"]}]};
  var UI = {
    nl: { search: "Zoeken…", searchLabel: "Zoeken in links", noResults: "Geen resultaten voor", copy: "Link kopiëren", share: "Delen", copied: "Link gekopieerd", copyFail: "Kopiëren mislukt", opens: "opent in nieuw tabblad", offline: "links.json kon niet geladen worden – reservekopie wordt getoond. Open de pagina via een webserver (GitHub Pages) voor de actuele lijst.", error: "Links konden niet geladen worden. Open deze pagina via GitHub Pages (niet als lokaal bestand)." },
    fr: { search: "Rechercher…", searchLabel: "Rechercher dans les liens", noResults: "Aucun résultat pour", copy: "Copier le lien", share: "Partager", copied: "Lien copié", copyFail: "Échec de la copie", opens: "s'ouvre dans un nouvel onglet", offline: "links.json n'a pas pu être chargé – copie de secours affichée. Ouvrez la page via un serveur web (GitHub Pages) pour la liste à jour.", error: "Impossible de charger les liens. Ouvrez cette page via GitHub Pages (pas en fichier local)." }
  };
  var KEY = "dk-links-lang";
  var main = document.getElementById("main"), q = document.getElementById("q");
  var data = null, notice = "", lang = pickLang(), mode = null;

  function pickLang() {
    try { var s = localStorage.getItem(KEY); if (s === "nl" || s === "fr") return s; } catch (e) {}
    var langs = navigator.languages || [navigator.language || ""];
    for (var i = 0; i < langs.length; i++) { var l = String(langs[i]).toLowerCase(); if (l.indexOf("fr") === 0) return "fr"; if (l.indexOf("nl") === 0) return "nl"; }
    return "nl";
  }
  function t(v) { if (v == null) return ""; if (typeof v === "string") return v; return v[lang] || v.nl || v.fr || ""; }
  function all(v) { if (v == null) return ""; if (typeof v === "string") return v; return Object.keys(v).map(function (k) { return v[k]; }).join(" "); }
  function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) { if (k === "text") e.textContent = attrs[k]; else if (k === "html") e.innerHTML = attrs[k]; else e.setAttribute(k, attrs[k]); }
    (kids || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }
  var SVG_COPY = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  var SVG_SHARE = '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
  var SVG_CHEV = '<svg class="chev" viewBox="0 0 8 14" width="8" height="14" aria-hidden="true"><path d="M1 1l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  function toast(msg) { var x = document.getElementById("toast"); x.textContent = msg; x.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(function () { x.classList.remove("show"); }, 1800); }
  function copy(url) {
    var ok = function () { toast(UI[lang].copied); }, bad = function () { toast(UI[lang].copyFail); };
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(url).then(ok, bad);
    try { var ta = el("textarea"); ta.value = url; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); ok(); } catch (e) { bad(); }
  }

  function render() {
    var u = UI[lang];
    document.documentElement.lang = lang;
    q.placeholder = u.search; q.setAttribute("aria-label", u.searchLabel); document.getElementById("q-label").textContent = u.searchLabel;
    document.querySelectorAll(".seg button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); });
    main.innerHTML = "";
    if (!data) { main.appendChild(el("p", { "class": "msg", text: u.error })); return; }
    var title = t(data.title) || "dormakaba links";
    document.getElementById("title").textContent = title; document.title = title;
    document.getElementById("subtitle").textContent = t(data.subtitle);
    if (notice) main.appendChild(el("p", { "class": "msg", text: u.offline }));
    var terms = norm(q.value.trim()).split(/\s+/).filter(Boolean), shown = 0;
    var byId = {}; (data.groups || []).forEach(function (g) { byId[g.id] = g; });
    var always = (data.groups || []).filter(function (g) { return g.show !== "mode"; });
    var modeGroups = [];
    if (terms.length) modeGroups = (data.groups || []).filter(function (g) { return g.show === "mode"; });
    else if (mode) (data.modes || []).forEach(function (m) { if (m.id === mode) m.groups.forEach(function (id) { if (byId[id]) modeGroups.push(byId[id]); }); });
    function drawModes() {
      if (!data.modes || !data.modes.length) return;
      var box = el("div", { "class": "modes", role: "group" });
      data.modes.forEach(function (m) {
        var b = el("button", { type: "button", "class": "mode mode-" + (m.color || "green"), "data-mode": m.id, "aria-pressed": String(mode === m.id), text: t(m.label) });
        b.addEventListener("click", function () { mode = mode === m.id ? null : m.id; render(); var f = document.querySelector('.mode[data-mode="' + m.id + '"]'); if (f) f.focus(); });
        box.appendChild(b);
      });
      main.appendChild(box);
    }
    var list = always.concat(["__modes__"], modeGroups);
    list.forEach(function (g) {
      if (g === "__modes__") { drawModes(); return; }
      var links = (g.links || []).filter(function (l) {
        if (!terms.length) return true;
        var hay = norm([all(l.label), all(l.description), all(g.title), l.keywords || ""].join(" "));
        return terms.every(function (w) { return hay.indexOf(w) !== -1; });
      });
      if (!links.length) return;
      shown += links.length;
      var hid = "g-" + (g.id || Math.random().toString(36).slice(2));
      var ul = el("ul", { "class": "card", "aria-labelledby": hid });
      links.forEach(function (l) {
        var label = t(l.label), desc = t(l.description);
        var internal = !/^[a-z]+:/i.test(l.url);
        var a = el("a", internal ? { "class": "link", href: l.url, "aria-label": label + (desc ? " – " + desc : "") } : { "class": "link", href: l.url, target: "_blank", rel: "noopener noreferrer", "aria-label": label + (desc ? " – " + desc : "") + " (" + u.opens + ")" }, [
          el("span", { "class": "ico", "aria-hidden": "true", text: l.icon || "🔗" }),
          el("span", { "class": "txt" }, [el("span", { "class": "lbl", text: label }), desc ? el("span", { "class": "desc", text: desc }) : null])
        ]);
        a.insertAdjacentHTML("beforeend", SVG_CHEV);
        var li = el("li", {}, [a]);
        var cb = el("button", { type: "button", "class": "act", "aria-label": u.copy + ": " + label, title: u.copy, html: SVG_COPY });
        var abs = new URL(l.url, location.href).href;
        cb.addEventListener("click", function () { copy(abs); });
        li.appendChild(cb);
        if (navigator.share) {
          var sb = el("button", { type: "button", "class": "act", "aria-label": u.share + ": " + label, title: u.share, html: SVG_SHARE });
          sb.addEventListener("click", function () { navigator.share({ title: label, url: abs }).catch(function () {}); });
          li.appendChild(sb);
        }
        ul.appendChild(li);
      });
      main.appendChild(el("section", { "class": "group" }, [el("h2", { id: hid, text: t(g.title) }), ul]));
    });
    if (!shown) main.appendChild(el("p", { "class": "msg", text: u.noResults + " “" + q.value.trim() + "”" }));
  }

  document.querySelectorAll(".seg button").forEach(function (b) {
    b.addEventListener("click", function () { lang = b.dataset.lang; try { localStorage.setItem(KEY, lang); } catch (e) {} render(); });
  });
  q.addEventListener("input", render);
  q.addEventListener("keydown", function (e) { if (e.key === "Escape") { q.value = ""; render(); } });

  fetch("links.json", { cache: "no-cache" })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (d) { data = d; })
    .catch(function () { data = FALLBACK_DATA; notice = "offline"; })
    .then(render);
})();
