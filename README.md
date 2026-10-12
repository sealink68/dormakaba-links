# dormakaba links

Eenvoudige link-pagina (vervangt Linktree) voor GitHub Pages: https://sealink68.github.io/dormakaba-links/

Geen build-stap: `index.html`, `styles.css`, `app.js`, `links.json`, `manifest.webmanifest`, de iconen, `form.html` en de map `forms/` (interne formulieren).

## Publiceren
1. Maak een nieuwe repo `dormakaba-links` op GitHub en upload alle bestanden (in de root).
2. **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`** → Save.
3. Na ±1 minuut staat de site op https://sealink68.github.io/dormakaba-links/
4. iPhone/iPad: open in Safari → Deel → *Zet op beginscherm*.

## Links aanpassen (alleen `links.json`)
Open `links.json` op GitHub → potlood-icoon (Edit) → wijzig → **Commit changes**. Na ±1 minuut is het online (eventueel pagina vernieuwen).

Structuur: `groups` (groepen, in volgorde) → elke groep heeft `links` (in volgorde).

Een link ziet er zo uit:
```json
{ "icon": "🚪",
  "label": { "nl": "Draaideuren", "fr": "Portes battantes" },
  "description": { "nl": "Offerteaanvraag · intern formulier", "fr": "Demande d’offre · formulaire interne" },
  "url": "form.html?type=draaideuren" }
```
- `icon` (optioneel): een emoji. `description` (optioneel): kleine grijze tekst onder de naam.
- `label` / `description` mag ook gewoon één tekst zijn: `"label": "ES90"`.

**Link toevoegen:** kopieer een bestaand blokje `{ ... }`, plak het binnen `"links": [ ... ]` en pas aan. Let op de komma's: tussen twee blokjes staat een komma, na het laatste niet.

Voorbeeld – nieuwe link onderaan bij Opmeetformulieren:
```json
        { "icon": "📋", "label": { "nl": "dormakaba Opmetingsblad", "fr": "dormakaba Feuille de mesure" }, "description": { "nl": "Opmeting · intern formulier", "fr": "Mesure · formulaire interne" }, "url": "form.html?type=opmeting" },
        { "icon": "🆕", "label": { "nl": "Nieuw formulier", "fr": "Nouveau formulaire" }, "url": "https://voorbeeld.be/nieuw-formulier" }
      ]
```
**Volgorde wijzigen:** knip een blokje en plak het hoger/lager (komma's controleren).
**Verwijderen:** verwijder het blokje (en de komma ervoor of erna).
**Nieuwe groep:** voeg in `"groups": [ ... ]` toe:
```json
{ "id": "handleidingen", "title": { "nl": "Handleidingen", "fr": "Manuels" }, "links": [ ... ] }
```
Twijfel over komma's? Plak de inhoud in https://jsonlint.com om te controleren. Bij een fout in `links.json` toont de site de reservekopie uit `app.js`.

## Reservekopie (optioneel)
`app.js` bevat een kopie van de links voor als `links.json` niet laadt (bv. bestand lokaal geopend). Wil je die bijwerken: `python3 build_fallback.py` en `app.js` opnieuw uploaden. Niet verplicht.

## Overig
- Taal NL/FR via de knop rechtsboven (wordt onthouden). Zoekveld filtert live op NL- en FR-teksten.
- Geen tracking. Enkel de formulieren laden één extern script (html2pdf.js 0.10.2 via cdnjs) om de PDF te maken.

## Indeling startpagina
- Altijd zichtbaar: groepen met `"show": "always"` (Rapporten, Onderdelen).
- Daaronder twee knoppen uit `"modes"` in `links.json`: groen *Offerte met opmeting* (toont Opmeetformulier + Offertes) en rood *Offerte zonder opmeting* (toont enkel Offertes). Groepen met `"show": "mode"` zijn standaard verborgen; bij zoeken worden ze wel doorzocht.

## Interne formulieren (`form.html?type=…`)
Alle opmeet- en offerteformulieren zijn nu eigen formulieren in deze app (geen extern formulierplatform meer).

| type | formulier |
|---|---|
| `draaideuren` | Draaideuren |
| `es200` | ES200 / Easy / Easy+ / 2D / CS / EC2 / BST / FFT |
| `es90` | ES90 |
| `es400` | ES400 |
| `tane` | TANE |
| `proline` | Proline |
| `cs80` | CS 80 MAGNEO |
| `hsw` | HSW |
| `opmeting` | dormakaba Opmetingsblad |

Werking:
- **E-mailadres technieker** is verplicht en wordt onthouden op dit toestel.
- **Concept**: alles wordt automatisch bewaard (tekst in localStorage, foto's/PDF's in IndexedDB). Knop *Nieuw / wissen* begint opnieuw.
- **Foto's**: meerdere foto's, rechtstreeks met de camera of uit de fotobibliotheek; ze worden verkleind (max. 1600 px, JPEG) vóór opslag.
- **Voorbeeld & verzenden**: controleert de verplichte velden en toont de volledige PDF (gegevens, gekozen onderdelen, foto's).
  - *Delen (PDF + e-mail)*: opent het deelmenu van iOS met de PDF (+ geüploade PDF-bestanden) als bijlage; kies Mail. In de tekst staan de adressen (aan `servicesales.be@dormakaba.com`, CC technieker).
  - *E-mail opstellen*: opent Mail met aan/CC/onderwerp/tekst ingevuld en downloadt de PDF; voeg die zelf als bijlage toe (mailto kan geen bijlagen meegeven).
  - *PDF downloaden*: reserve-optie.
- PDF-naam: `Offerte_<Toestel>_<Klant>_<WO>_<dd_mm_jj>.pdf` (opmeting: `Offerte_Opmeting_<Werf>_<WO>_…`).
- *Delen* kopieert eerst de adressen (`servicesales.be@dormakaba.com; <technieker>`) naar het klembord.
- Onderwerp: `Offerteaanvraag <type> – <klant> – <datum>` (FR: `Demande d'offre …`), opmeting: `Opmetingsblad – <werf> – <datum>`.

Bestanden:
- `forms/defs/<type>.js` – definitie van velden en onderdelencatalogus (JSON in een JS-bestand, werkt ook offline/lokaal).
- `forms/img/` – lokale productfoto's van de onderdelencatalogus.
- `forms/form.js`, `forms/form.css` – formulier-logica en opmaak.

Veld aanpassen: open `forms/defs/<type>.js`; elk veld heeft `id`, `type` (`text`, `email`, `number`, `date`, `textarea`, `select`, `radio`, `checkbox`, `address`, `photos`, `file`, `products`, `info`, `link`, `image`), `label` (`nl`/`fr`), `required` en eventueel `options`.

Na een update: verhoog `?v=` (nu 3) in `form.html`/`index.html`/`forms/form.js` zodat iPad/iPhone de nieuwe versie laden.
