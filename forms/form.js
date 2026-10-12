/* Interne formulieren / formulaires internes – dormakaba links */
(function () {
  "use strict";
  var TO = "servicesales.be@dormakaba.com";
  var LANG_KEY = "dk-links-lang", TECH_KEY = "dk-tech-email";
  var UI = {
    nl: { back: "Links", preview: "Voorbeeld & verzenden", clear: "Nieuw / wissen", close: "Sluiten", ptitle: "PDF-voorbeeld", share: "Delen (PDF + e-mail)", mail: "E-mail opstellen", dl: "PDF downloaden",
      hint: "Delen: kies Mail – de PDF en foto's zitten erin. E-mail opstellen: voeg daarna de gedownloade PDF zelf toe.", busy: "PDF wordt gemaakt…", required: "Verplicht veld", email: "Ongeldig e-mailadres",
      fix: "Vul eerst de verplichte velden in", confirmClear: "Formulier wissen en opnieuw beginnen? (het e-mailadres van de technieker blijft bewaard)", saved: "Concept automatisch bewaard", savedAt: "Concept bewaard om ",
      camera: "📷 Foto nemen", library: "🖼️ Foto's kiezen", file: "📎 Bestand kiezen", remove: "Verwijderen", search: "Zoek onderdeel of referentie…", allCats: "Alle categorieën", onlySel: "Enkel gekozen",
      selected: "gekozen", qty: "Aantal", noShare: "Delen met bestanden wordt hier niet ondersteund – de PDF wordt gedownload.", dlDone: "PDF gedownload", subjOff: "Offerteaanvraag", subjOpm: "Opmetingsblad",
      to: "Aan", cc: "CC", subject: "Onderwerp", photos: "Foto's", products: "Gekozen onderdelen", attach: "Bijlagen", generated: "Aangemaakt op", tech: "Technieker", pdfNote: "Volledige gegevens en foto's: zie PDF in bijlage.", unknown: "onbekend", notFound: "Formulier niet gevonden.", tooBig: "Te weinig opslagruimte – concept kon niet volledig bewaard worden.", none: "—",
      mailPdfNote: "PDF in bijlage toevoegen (wordt nu gedownload).", product: "Onderdeel", ccNote: "Adressen gekopieerd naar het klembord (CC = technieker).", copiedAddr: "Adressen gekopieerd (CC = technieker)" },
    fr: { back: "Liens", preview: "Aperçu & envoi", clear: "Nouveau / effacer", close: "Fermer", ptitle: "Aperçu PDF", share: "Partager (PDF + e-mail)", mail: "Rédiger l'e-mail", dl: "Télécharger le PDF",
      hint: "Partager : choisissez Mail – le PDF et les photos sont joints. Rédiger l'e-mail : ajoutez ensuite vous-même le PDF téléchargé.", busy: "Création du PDF…", required: "Champ obligatoire", email: "Adresse e-mail invalide",
      fix: "Remplissez d'abord les champs obligatoires", confirmClear: "Effacer le formulaire et recommencer ? (l'e-mail du technicien est conservé)", saved: "Brouillon enregistré automatiquement", savedAt: "Brouillon enregistré à ",
      camera: "📷 Prendre une photo", library: "🖼️ Choisir des photos", file: "📎 Choisir un fichier", remove: "Supprimer", search: "Chercher une pièce ou référence…", allCats: "Toutes les catégories", onlySel: "Sélection uniquement",
      selected: "choisi(s)", qty: "Quantité", noShare: "Le partage de fichiers n'est pas pris en charge ici – le PDF est téléchargé.", dlDone: "PDF téléchargé", subjOff: "Demande d'offre", subjOpm: "Feuille de mesure",
      to: "À", cc: "CC", subject: "Objet", photos: "Photos", products: "Pièces choisies", attach: "Pièces jointes", generated: "Créé le", tech: "Technicien", pdfNote: "Données complètes et photos : voir PDF en pièce jointe.", unknown: "inconnu", notFound: "Formulaire introuvable.", tooBig: "Espace de stockage insuffisant – le brouillon n'a pas pu être entièrement enregistré.", none: "—",
      mailPdfNote: "Ajoutez le PDF en pièce jointe (il est téléchargé maintenant).", product: "Pièce", ccNote: "Adresses copiées dans le presse-papiers (CC = technicien).", copiedAddr: "Adresses copiées (CC = technicien)" }
  };
  var lang = (function () { try { var s = localStorage.getItem(LANG_KEY); if (s === "nl" || s === "fr") return s; } catch (e) {} return /^fr/i.test(navigator.language || "") ? "fr" : "nl"; })();
  var type = (new URLSearchParams(location.search).get("type") || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  var DKEY = "dk-form-draft-" + type;
  var def = null, state = { v: {}, p: {} }, blobs = {}, pdfBlob = null, pdfName = "", saveT = null;
  var form = document.getElementById("form");

  function u() { return UI[lang]; }
  function t(v) { return v == null ? "" : typeof v === "string" ? v : (v[lang] || v.nl || v.fr || ""); }
  function $(id) { return document.getElementById(id); }
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    for (var k in attrs || {}) { var a = attrs[k]; if (a == null || a === false) continue; if (k === "text") e.textContent = a; else if (k === "html") e.innerHTML = a; else if (k.slice(0, 2) === "on") e.addEventListener(k.slice(2), a); else e.setAttribute(k, a === true ? "" : a); }
    (kids || []).forEach(function (c) { if (c) e.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return e;
  }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function toast(msg, ms) { var x = $("toast"); x.textContent = msg; x.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(function () { x.classList.remove("show"); }, ms || 2200); }
  function busy(on) { $("busy").hidden = !on; $("busy-txt").textContent = u().busy; }
  function today() { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function fmtDate(s) { var m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(s || ""); return m ? m[3] + "-" + m[2] + "-" + m[1] : (s || ""); }

  /* ---------- IndexedDB voor foto's/bestanden ---------- */
  var dbp = null;
  function db() {
    if (!dbp) dbp = new Promise(function (res, rej) { var r = indexedDB.open("dk-forms", 1); r.onupgradeneeded = function () { r.result.createObjectStore("blobs"); }; r.onsuccess = function () { res(r.result); }; r.onerror = function () { rej(r.error); }; });
    return dbp;
  }
  function idb(mode, fn) { return db().then(function (d) { return new Promise(function (res, rej) { var tx = d.transaction("blobs", mode), st = tx.objectStore("blobs"), r = fn(st); tx.oncomplete = function () { res(r && r.result); }; tx.onerror = function () { rej(tx.error); }; }); }); }
  function putBlobs(fid) { return idb("readwrite", function (s) { return s.put(blobs[fid] || [], type + ":" + fid); }).catch(function () { toast(u().tooBig, 4000); }); }
  function getBlobs(fid) { return idb("readonly", function (s) { return s.get(type + ":" + fid); }).catch(function () { return []; }); }

  /* ---------- concept ---------- */
  function save() {
    clearTimeout(saveT);
    saveT = setTimeout(function () {
      try { localStorage.setItem(DKEY, JSON.stringify(state)); var d = new Date(); $("draft-info").textContent = u().savedAt + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); }
      catch (e) { toast(u().tooBig, 4000); }
    }, 250);
  }
  function load() { try { var s = JSON.parse(localStorage.getItem(DKEY) || "null"); if (s && s.v) state = { v: s.v, p: s.p || {} }; } catch (e) {} }

  /* ---------- foto-compressie ---------- */
  function compress(file) {
    return new Promise(function (res) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        var max = 1600, w = img.naturalWidth, h = img.naturalHeight, r = Math.min(1, max / Math.max(w, h));
        var c = document.createElement("canvas"); c.width = Math.round(w * r); c.height = Math.round(h * r);
        var g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url); res({ name: file.name || "foto.jpg", url: c.toDataURL("image/jpeg", 0.72) });
      };
      img.onerror = function () { URL.revokeObjectURL(url); res(null); };
      img.src = url;
    });
  }

  /* ---------- rendering ---------- */
  function fieldVal(f) { return state.v[f.id]; }
  function setVal(f, v) { state.v[f.id] = v; if (f.tech) { try { localStorage.setItem(TECH_KEY, v || ""); } catch (e) {} } save(); }

  function build() {
    document.documentElement.lang = lang;
    document.querySelectorAll(".seg button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); });
    $("back-txt").textContent = u().back; $("b-preview").textContent = u().preview; $("b-clear").textContent = u().clear;
    $("m-close").textContent = u().close; $("m-title").textContent = u().ptitle; $("m-share").textContent = u().share; $("m-mail").textContent = u().mail; $("m-dl").textContent = u().dl; $("m-hint").textContent = u().hint;
    if (!def) { $("ftitle").textContent = u().notFound; form.innerHTML = ""; $("bar").hidden = true; return; }
    var title = (def.kind === "opmeting" ? "" : u().subjOff + " · ") + t(def.title);
    $("ftitle").textContent = title; document.title = title; $("fsub").textContent = TO;
    form.innerHTML = "";
    var card = el("div", { "class": "sec-card" });
    def.fields.forEach(function (f) { var n = renderField(f); if (n) card.appendChild(n); });
    form.appendChild(card);
    form.appendChild(el("p", { "class": "draft", id: "draft-info", text: u().saved }));
  }

  function wrap(f, input, forId) {
    var lab = el(forId ? "label" : "div", { "class": "lab", "for": forId || null }, [t(f.label), f.required ? el("span", { "class": "req", "aria-hidden": "true", text: "*" }) : null]);
    return el("div", { "class": "fld", "data-fid": f.id }, [lab, input, el("div", { "class": "err", text: f.type === "email" ? u().email : u().required })]);
  }

  function renderField(f) {
    var id = "f-" + f.id, v = fieldVal(f);
    switch (f.type) {
      case "text": case "email": case "tel": case "number": case "date": {
        var inp = el("input", { id: id, name: f.id, type: f.type === "number" ? "text" : f.type, inputmode: f.type === "number" ? "decimal" : null, autocomplete: f.type === "email" ? "email" : "off", required: f.required, "aria-required": f.required ? "true" : null, autocapitalize: f.type === "email" ? "off" : null });
        inp.value = v == null ? "" : v;
        inp.addEventListener("input", function () { setVal(f, inp.value); inp.closest(".fld").classList.remove("invalid"); });
        return wrap(f, inp, id);
      }
      case "textarea": {
        var ta = el("textarea", { id: id, name: f.id, rows: 3, required: f.required, "aria-required": f.required ? "true" : null }); ta.value = v || "";
        ta.addEventListener("input", function () { setVal(f, ta.value); ta.closest(".fld").classList.remove("invalid"); });
        return wrap(f, ta, id);
      }
      case "select": {
        var s = el("select", { id: id, name: f.id, required: f.required }, [el("option", { value: "", text: lang === "fr" ? "Sélectionner…" : "Selecteren…" })]);
        f.options.forEach(function (o) { s.appendChild(el("option", { value: o.nl, text: t(o) })); });
        s.value = v || ""; s.addEventListener("change", function () { setVal(f, s.value); s.closest(".fld").classList.remove("invalid"); });
        return wrap(f, s, id);
      }
      case "radio": case "checkbox": {
        var box = el("div", { "class": "opts", role: f.type === "radio" ? "radiogroup" : "group" }), cur = f.type === "checkbox" ? (v || []) : v;
        f.options.forEach(function (o, i) {
          var c = el("input", { type: f.type, name: f.id, value: o.nl, id: id + "-" + i });
          c.checked = f.type === "checkbox" ? cur.indexOf(o.nl) !== -1 : cur === o.nl;
          c.addEventListener("change", function () {
            if (f.type === "radio") setVal(f, o.nl);
            else setVal(f, [].slice.call(box.querySelectorAll("input:checked")).map(function (x) { return x.value; }));
            box.closest(".fld").classList.remove("invalid");
          });
          box.appendChild(el("label", { "for": id + "-" + i }, [c, t(o)]));
        });
        return wrap(f, box);
      }
      case "address": {
        var a = v || {}, g = el("div", { "class": "addr" });
        f.sub.forEach(function (sl, i) {
          var x = el("input", { type: "text", placeholder: t(sl), "aria-label": t(sl), autocomplete: ["address-line1", "address-line2", "address-level2", "address-level1", "postal-code"][i] });
          x.value = a[i] || ""; x.addEventListener("input", function () { var c = state.v[f.id] || {}; c[i] = x.value; setVal(f, c); g.closest(".fld").classList.remove("invalid"); });
          g.appendChild(x);
        });
        return wrap(f, g);
      }
      case "info": return el("div", { "class": "fld" }, [el("div", { "class": "lab", text: t(f.label) })]);
      case "link": return el("div", { "class": "fld" }, [el("a", { href: f.url, target: "_blank", rel: "noopener", text: "📦 " + t(f.label) })]);
      case "image": return el("div", { "class": "fld" }, [el("img", { "class": "ref-img", src: "forms/" + f.src, alt: t(f.label), loading: "lazy" })]);
      case "photos": return renderPhotos(f);
      case "file": return renderFiles(f);
      case "products": return renderProducts(f);
    }
    return null;
  }

  function renderPhotos(f) {
    var grid = el("div", { "class": "photos" });
    function draw() {
      grid.innerHTML = "";
      (blobs[f.id] || []).forEach(function (p, i) {
        grid.appendChild(el("figure", {}, [el("img", { src: p.url, alt: p.name }), el("button", { type: "button", "aria-label": u().remove, text: "✕", onclick: function () { blobs[f.id].splice(i, 1); putBlobs(f.id); draw(); } })]));
      });
    }
    function add(files) {
      var list = [].slice.call(files || []); if (!list.length) return;
      busy(true);
      Promise.all(list.map(compress)).then(function (r) { blobs[f.id] = (blobs[f.id] || []).concat(r.filter(Boolean)); draw(); busy(false); return putBlobs(f.id); });
    }
    var cam = el("input", { type: "file", accept: "image/*", capture: "environment", id: "cam-" + f.id }), lib = el("input", { type: "file", accept: "image/*", multiple: true, id: "lib-" + f.id });
    cam.addEventListener("change", function () { add(cam.files); cam.value = ""; }); lib.addEventListener("change", function () { add(lib.files); lib.value = ""; });
    var pick = el("div", { "class": "pick" }, [el("label", { "for": "cam-" + f.id, text: u().camera }), cam, el("label", { "for": "lib-" + f.id, text: u().library }), lib]);
    getBlobs(f.id).then(function (r) { blobs[f.id] = r || []; draw(); });
    return wrap(f, el("div", {}, [pick, grid]));
  }

  function renderFiles(f) {
    var ul = el("ul", { "class": "files" });
    function draw() {
      ul.innerHTML = "";
      (blobs[f.id] || []).forEach(function (p, i) { ul.appendChild(el("li", {}, [el("span", { text: "📄 " + p.name }), el("button", { type: "button", text: u().remove, onclick: function () { blobs[f.id].splice(i, 1); putBlobs(f.id); draw(); } })])); });
    }
    var inp = el("input", { type: "file", accept: f.accept, multiple: true, id: "file-" + f.id });
    inp.addEventListener("change", function () {
      [].slice.call(inp.files).forEach(function (x) { (blobs[f.id] = blobs[f.id] || []).push({ name: x.name, type: x.type || "application/octet-stream", blob: x }); });
      inp.value = ""; draw(); putBlobs(f.id);
    });
    getBlobs(f.id).then(function (r) { blobs[f.id] = r || []; draw(); });
    return wrap(f, el("div", {}, [el("div", { "class": "pick" }, [el("label", { "for": "file-" + f.id, text: u().file }), inp]), ul]));
  }

  function renderProducts(f) {
    var catName = {}; f.categories.forEach(function (c) { catName[c.id] = c.name; });
    var q = el("input", { type: "search", placeholder: u().search, "aria-label": u().search });
    var cs = el("select", { "aria-label": u().allCats }, [el("option", { value: "", text: u().allCats })]);
    f.categories.forEach(function (c) { cs.appendChild(el("option", { value: c.id, text: c.name })); });
    var only = el("input", { type: "checkbox" }), list = el("div", { "class": "plist" }), count = el("div", { "class": "pcount" });
    var tools = el("div", { "class": "ptools" }, [q, el("label", { "class": "chk" }, [only, u().onlySel])]);
    if (f.categories.length) tools.appendChild(cs);
    function norm(s) { return String(s).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
    function upd() { var n = Object.keys(state.p).filter(function (k) { return f.products.some(function (p) { return p.id === k; }); }).length; count.textContent = n + " " + u().selected; }
    function draw() {
      list.innerHTML = ""; var terms = norm(q.value.trim()).split(/\s+/).filter(Boolean), lastCat = null;
      f.products.forEach(function (p) {
        var sel = state.p[p.id];
        if (only.checked && !sel) return;
        if (cs.value && p.cat !== cs.value) return;
        if (terms.length) { var hay = norm(p.name + " " + p.desc + " " + (catName[p.cat] || "")); if (!terms.every(function (w) { return hay.indexOf(w) !== -1; })) return; }
        if (p.cat && p.cat !== lastCat) { lastCat = p.cat; list.appendChild(el("div", { "class": "pcat", text: catName[p.cat] || "" })); }
        var cb = el("input", { type: "checkbox", "aria-label": p.name }); cb.checked = !!sel;
        var po = el("div", { "class": "po" });
        p.opts.forEach(function (o, i) {
          var s = el("select", {}); o.values.forEach(function (x) { s.appendChild(el("option", { value: x, text: x })); });
          s.value = sel && sel.o[i] != null ? sel.o[i] : o.values[0];
          s.addEventListener("change", function () { if (!state.p[p.id]) { cb.checked = true; toggle(true); } state.p[p.id].o[i] = s.value; save(); });
          po.appendChild(el("label", {}, [/^Quanti/i.test(o.label) ? u().qty : o.label, s]));
        });
        var row = el("div", { "class": "prod" + (sel ? " on" : "") }, [cb, p.img ? el("img", { src: "forms/" + p.img, alt: "", loading: "lazy" }) : el("span"), el("div", {}, [el("div", { "class": "pn", text: p.name }), p.desc ? el("div", { "class": "pd", text: p.desc }) : null, po])]);
        function toggle(on) {
          if (on) state.p[p.id] = { o: [].slice.call(po.querySelectorAll("select")).map(function (s) { return s.value; }) }; else delete state.p[p.id];
          row.classList.toggle("on", on); upd(); save();
        }
        cb.addEventListener("change", function () { toggle(cb.checked); });
        list.appendChild(row);
      });
      upd();
    }
    var tmr; q.addEventListener("input", function () { clearTimeout(tmr); tmr = setTimeout(draw, 150); }); cs.addEventListener("change", draw); only.addEventListener("change", draw);
    draw();
    return wrap(f, el("div", {}, [tools, list, count]));
  }

  /* ---------- validatie ---------- */
  function emailOk(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s || ""); }
  function validate() {
    var first = null;
    def.fields.forEach(function (f) {
      var v = fieldVal(f), bad = false;
      if (f.required) {
        if (f.type === "checkbox") bad = !(v && v.length);
        else if (f.type === "address") bad = !(v && v[0] && v[2] && v[4]);
        else if (f.type === "photos" || f.type === "file") bad = !(blobs[f.id] && blobs[f.id].length);
        else bad = !(v && String(v).trim());
      }
      if (!bad && f.type === "email" && v && !emailOk(v)) bad = true;
      var n = form.querySelector('[data-fid="' + f.id + '"]');
      if (n) { n.classList.toggle("invalid", bad); if (bad && !first) first = n; }
    });
    if (first) { first.scrollIntoView({ behavior: "smooth", block: "center" }); toast(u().fix); var i = first.querySelector("input,select,textarea"); if (i) setTimeout(function () { i.focus({ preventScroll: true }); }, 400); }
    return !first;
  }

  /* ---------- samenvatting ---------- */
  function display(f) {
    var v = fieldVal(f);
    if (v == null || v === "") return "";
    if (f.type === "date") return fmtDate(v);
    if (f.type === "select" || f.type === "radio") { var o = (f.options || []).filter(function (x) { return x.nl === v; })[0]; return o ? t(o) : v; }
    if (f.type === "checkbox") return (v || []).map(function (x) { var o = f.options.filter(function (y) { return y.nl === x; })[0]; return o ? t(o) : x; }).join(", ");
    if (f.type === "address") return [v[0], v[1], [v[4], v[2]].filter(Boolean).join(" "), v[3]].filter(function (x) { return x && String(x).trim(); }).join(", ");
    return String(v);
  }
  function techEmail() { var f = def.fields.filter(function (x) { return x.tech; })[0]; return f ? (fieldVal(f) || "").trim() : ""; }
  function fval(id) { var f = def.fields.filter(function (x) { return x.id === id; })[0]; return f ? display(f) : ""; }
  function chosenProducts() {
    var out = [];
    def.fields.forEach(function (f) { if (f.type !== "products") return; f.products.forEach(function (p) { var s = state.p[p.id]; if (s) out.push({ p: p, opts: p.opts.map(function (o, i) { return (/^Quanti/i.test(o.label) ? u().qty : o.label) + ": " + s.o[i]; }) }); }); });
    return out;
  }
  function subject() {
    var df = def.fields.filter(function (x) { return x.type === "date"; })[0], date = (df && display(df)) || fmtDate(today());
    if (def.kind === "opmeting") return u().subjOpm + " – " + (fval("q6") || u().unknown) + " – " + date;
    return u().subjOff + " " + t(def.title) + " – " + (fval("q29") || u().unknown) + " – " + date;
  }
  var DEVICE = { draaideuren: "Draaideuren", es200: "ES200", es90: "ES90", es400: "ES400", tane: "TANE", proline: "Proline", cs80: "CS80-MAGNEO", hsw: "HSW", opmeting: "Opmeting" };
  function part(x) { return String(x || "").normalize("NFC").replace(/[\\\/:*?"<>|#%&{}$!'`@+=,;\[\]\u0000-\u001f]+/g, "").trim().replace(/\s+/g, "-").replace(/-{2,}/g, "-").replace(/^[-_.]+|[-_.]+$/g, ""); }
  function fileName() {
    var df = def.fields.filter(function (x) { return x.type === "date"; })[0], dv = (df && fieldVal(df)) || today(), m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(dv), dd = m ? m[3] + "_" + m[2] + "_" + m[1].slice(2) : "";
    var klant = def.kind === "opmeting" ? fval("q6") : fval("q29"), wo = def.kind === "opmeting" ? fval("q5") : fval("q25");
    return ["Offerte", DEVICE[type] || part(t(def.title)), part(klant), part(wo), dd].filter(Boolean).join("_") + ".pdf";
  }
  function summaryText(maxLen) {
    var lines = [];
    def.fields.forEach(function (f) { if (/^(text|email|tel|number|date|textarea|select|radio|checkbox|address)$/.test(f.type)) { var d = display(f); if (d) lines.push(t(f.label) + ": " + d); } });
    var cp = chosenProducts();
    if (cp.length) { lines.push(""); lines.push(u().products + ":"); cp.forEach(function (c) { lines.push("- " + c.p.name + " (" + c.opts.join(", ") + ")"); }); }
    var s = lines.join("\n");
    if (maxLen && s.length > maxLen) s = s.slice(0, maxLen) + "\n…";
    return s;
  }

  /* ---------- PDF ---------- */
  function buildDoc() {
    var h = '<div class="pdoc"><div class="ph"><div><b>dormakaba</b><br>' + esc(def.kind === "opmeting" ? t(def.title) : u().subjOff + " · " + t(def.title)) + '</div><span>' + esc(u().to) + ": " + esc(TO) + "<br>" + esc(u().cc) + ": " + esc(techEmail()) + "<br>" + esc(u().generated) + " " + esc(new Date().toLocaleString(lang === "fr" ? "fr-BE" : "nl-BE")) + "</span></div>";
    h += "<h3>" + esc(subject()) + "</h3><table>";
    def.fields.forEach(function (f) {
      if (f.type === "info") { h += '<tr><td colspan="2"><b>' + esc(t(f.label)) + "</b></td></tr>"; return; }
      if (!/^(text|email|tel|number|date|textarea|select|radio|checkbox|address)$/.test(f.type)) return;
      var d = display(f); h += '<tr><td class="k">' + esc(t(f.label)) + '</td><td class="v">' + (d ? esc(d) : '<span style="color:#aaa">' + u().none + "</span>") + "</td></tr>";
    });
    h += "</table>";
    var cp = chosenProducts();
    if (def.fields.some(function (f) { return f.type === "products"; })) {
      h += "<h3>" + esc(u().products) + " (" + cp.length + ")</h3>";
      if (cp.length) { h += "<table><tr><th>" + esc(u().product) + "</th><th>" + esc(u().qty) + " / opties</th></tr>"; cp.forEach(function (c) { h += "<tr><td>" + esc(c.p.name) + (c.p.desc ? '<br><small style="color:#666">' + esc(c.p.desc) + "</small>" : "") + "</td><td>" + esc(c.opts.join("\n")).replace(/\n/g, "<br>") + "</td></tr>"; }); h += "</table>"; }
      else h += "<p>" + u().none + "</p>";
    }
    def.fields.forEach(function (f) {
      if (f.type === "image") h += '<div class="avoid"><h3>' + esc(t(f.label)) + '</h3><img class="ref" src="forms/' + esc(f.src) + '"></div>';
    });
    def.fields.forEach(function (f) {
      if (f.type === "file" && blobs[f.id] && blobs[f.id].length) h += "<h3>" + esc(u().attach) + "</h3><p>" + blobs[f.id].map(function (b) { return "📎 " + esc(b.name); }).join("<br>") + "</p>";
    });
    def.fields.forEach(function (f) {
      if (f.type !== "photos" || !(blobs[f.id] && blobs[f.id].length)) return;
      h += "<h3>" + esc(t(f.label)) + " (" + blobs[f.id].length + ')</h3><div class="pg">';
      blobs[f.id].forEach(function (p, i) { h += '<figure><img src="' + p.url + '"><figcaption>' + esc(t(f.label)) + " " + (i + 1) + "</figcaption></figure>"; });
      h += "</div>";
    });
    h += '<div class="foot">dormakaba · ' + esc(u().tech) + ": " + esc(techEmail()) + "</div></div>";
    var d = document.createElement("div"); d.innerHTML = h; return d.firstChild;
  }

  function makePdf() {
    var src = $("pdf-src"); src.innerHTML = ""; var docEl = buildDoc(); src.appendChild(docEl);
    var sx = window.scrollX, sy = window.scrollY; window.scrollTo(0, 0);
    var opt = { margin: [10, 10, 12, 10], filename: "x.pdf", image: { type: "jpeg", quality: 0.9 },
      html2canvas: { scale: 2, useCORS: true, scrollX: 0, scrollY: 0, windowWidth: 718, backgroundColor: "#ffffff" },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }, pagebreak: { mode: ["css", "legacy"], avoid: ["tr", ".avoid", "figure"] } };
    var w = html2pdf().set(opt).from(docEl).toContainer().then(function () {
      var c = this.prop.container, o = this.prop.overlay;
      if (c) { c.style.left = "0"; c.style.right = "auto"; c.style.margin = "0"; }
      if (o) { o.style.left = "0"; o.style.right = "auto"; }
    }).toCanvas().toPdf();
    var out = {};
    return w.get("canvas").then(function (c) { out.canvas = c; }).get("pageSize").then(function (ps) { out.ps = ps; }).get("pdf").then(function (pdf) {
      out.blob = pdf.output("blob"); src.innerHTML = ""; window.scrollTo(sx, sy); return out;
    });
  }
  function pageImages(canvas, ps) {
    var pxPage = Math.floor(canvas.width * ps.inner.ratio), n = Math.ceil(canvas.height / pxPage), k = canvas.width / ps.inner.width, imgs = [];
    var mt = ps.margin ? ps.margin[0] : 10, ml = ps.margin ? ps.margin[1] : 10;
    for (var i = 0; i < n; i++) {
      var pc = document.createElement("canvas"); pc.width = Math.round(ps.width * k); pc.height = Math.round(ps.height * k);
      var g = pc.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, pc.width, pc.height);
      var hgt = Math.min(pxPage, canvas.height - i * pxPage);
      g.drawImage(canvas, 0, i * pxPage, canvas.width, hgt, Math.round(ml * k), Math.round(mt * k), canvas.width, hgt);
      imgs.push(pc.toDataURL("image/jpeg", 0.8));
    }
    return imgs;
  }
  function preview() {
    if (!validate()) return;
    busy(true);
    setTimeout(function () {
      makePdf().then(function (r) {
        pdfBlob = r.blob; pdfName = fileName();
        var box = $("m-pages"); box.innerHTML = "";
        pageImages(r.canvas, r.ps).forEach(function (src, i) { box.appendChild(el("img", { src: src, alt: "PDF " + (i + 1) })); });
        $("modal").hidden = false; box.scrollTop = 0; busy(false);
      }).catch(function (e) { busy(false); toast("PDF: " + (e && e.message || e), 5000); });
    }, 30);
  }
  function download() {
    var a = el("a", { href: URL.createObjectURL(pdfBlob), download: pdfName }); document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 4000); toast(u().dlDone);
  }
  function shareText() { return u().ccNote + "\n" + u().to + ": " + TO + "\n" + u().cc + ": " + techEmail() + "\n" + u().subject + ": " + subject() + "\n\n" + summaryText(3000); }
  function copyAddr() {
    var txt = TO + "; " + techEmail(), ok = false;
    try { var ta = document.createElement("textarea"); ta.value = txt; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.top = "0"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, txt.length); ok = document.execCommand("copy"); ta.remove(); } catch (e) {}
    if (navigator.clipboard && window.isSecureContext) { try { navigator.clipboard.writeText(txt).catch(function () {}); ok = true; } catch (e) {} }
    window.__copied = txt;
    if (ok) toast(u().copiedAddr, 3000);
  }
  function share() {
    copyAddr();
    var files = [new File([pdfBlob], pdfName, { type: "application/pdf" })];
    def.fields.forEach(function (f) { if (f.type === "file") (blobs[f.id] || []).forEach(function (b) { files.push(new File([b.blob], b.name, { type: b.type })); }); });
    var data = { files: files, title: subject(), text: shareText() };
    if (navigator.share && navigator.canShare && navigator.canShare({ files: files })) navigator.share(data).catch(function (e) { if (e && e.name !== "AbortError") { toast(u().noShare, 4000); download(); } });
    else { toast(u().noShare, 4000); download(); }
  }
  function mail() {
    var body = summaryText(1500) + "\n\n" + u().pdfNote + "\n\n" + u().tech + ": " + techEmail();
    var href = "mailto:" + TO + "?cc=" + encodeURIComponent(techEmail()) + "&subject=" + encodeURIComponent(subject()) + "&body=" + encodeURIComponent(body);
    window.__lastMailto = href;
    download(); toast(u().mailPdfNote, 4000);
    setTimeout(function () { location.href = href; }, 600);
  }

  function clearAll() {
    if (!confirm(u().confirmClear)) return;
    var tech = techEmail(); state = { v: {}, p: {} };
    def.fields.forEach(function (f) { if (f.tech) state.v[f.id] = tech; if (f.type === "date") state.v[f.id] = today(); if (f.type === "photos" || f.type === "file") { blobs[f.id] = []; putBlobs(f.id); } });
    try { localStorage.removeItem(DKEY); } catch (e) {}
    save(); build(); window.scrollTo(0, 0);
  }

  /* ---------- start ---------- */
  document.querySelectorAll(".seg button").forEach(function (b) { b.addEventListener("click", function () { lang = b.dataset.lang; try { localStorage.setItem(LANG_KEY, lang); } catch (e) {} if (def) build(); else build(); }); });
  $("b-preview").addEventListener("click", preview); $("b-clear").addEventListener("click", clearAll);
  $("m-close").addEventListener("click", function () { $("modal").hidden = true; });
  $("m-share").addEventListener("click", share); $("m-mail").addEventListener("click", mail); $("m-dl").addEventListener("click", download);
  window.addEventListener("pagehide", function () { try { localStorage.setItem(DKEY, JSON.stringify(state)); } catch (e) {} });

  if (!/^[a-z0-9]+$/.test(type)) { build(); return; }
  var s = document.createElement("script"); s.src = "forms/defs/" + type + ".js?v=3";
  s.onload = function () {
    def = (window.FORM_DEFS || {})[type] || null; load();
    if (def) def.fields.forEach(function (f) {
      if (f.tech && !state.v[f.id]) { try { state.v[f.id] = localStorage.getItem(TECH_KEY) || ""; } catch (e) {} }
      if (f.type === "date" && !state.v[f.id]) state.v[f.id] = today();
    });
    build();
  };
  s.onerror = function () { build(); };
  document.head.appendChild(s);
})();
