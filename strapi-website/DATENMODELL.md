# Datenmodell – Strapi Backend

## Übersicht Beziehungen

```
┌─────────────┐       ┌──────────────┐       ┌───────────────────┐
│  Lieferant  │──1:n──│   Getränk    │──1:n──│   Lagerbestand    │
└─────────────┘       └──────────────┘       └───────────────────┘
                             │                        │
                        n:1  │                   n:1  │
                             ▼                        ▼
                      ┌──────────────┐         ┌───────────┐
                      │  Kategorie   │         │   Lager   │
                      └──────────────┘         └───────────┘

                      ┌──────────────────┐
                      │ Vertriebsgruppe  │──1:n── Getränk
                      └──────────────────┘
```

---

## Collections (Lagersystem)

### Getränk
> API: `api::getraenkelager.getraenkelager` | Display: "Getränk"

| Feld                   | Typ          | Required | Default  | Beschreibung                          |
|------------------------|--------------|----------|----------|---------------------------------------|
| name                   | string       | ✓        |          | Produktname                           |
| sku                    | uid          |          |          | Interne Artikelnummer (auto aus name) |
| artikelnummer_lieferant| string       |          |          | Artikelnr. beim Lieferanten           |
| ean                    | string       |          |          | EAN/Barcode                           |
| groesse_liter          | decimal      | ✓        |          | Gebindegröße in Liter                 |
| verkaufseinheit        | decimal      |          |          | VK-Einheit in Liter (z.B. 0,4)       |
| gebindeart             | enum         |          |          | Glas_Mehrweg, Glas_Einweg, PET, Dose, Fass, Sonstiges |
| vpe                    | integer      | ✓        | 1        | Verpackungseinheit                    |
| alkoholgehalt          | decimal      |          |          | Alkohol in %                          |
| steuersatz             | enum         | ✓        | mwst_19  | mwst_7, mwst_19, mwst_0              |
| ek_preis_netto         | decimal      | ✓        |          | Einkaufspreis Netto                   |
| vk_preis_netto         | decimal      | ✓        |          | Verkaufspreis Netto (pro VK-Einheit)  |
| marge_prozent          | decimal      |          |          | **Auto-berechnet** via Lifecycle Hook |
| pfand_einzel           | decimal      |          | 0        | Pfand pro Einzelflasche/-dose         |
| pfand_gebinde          | decimal      |          | 0        | Pfand pro Kasten/Gebinde              |
| aktiv                  | boolean      |          | true     | Artikel aktiv/inaktiv                 |
| bild                   | media        |          |          | Produktbild                           |
| kommentar              | text         |          |          | Freitext                              |
| lieferant              | relation     |          |          | → Lieferant (n:1)                     |
| kategorie              | relation     |          |          | → Kategorie (n:1)                     |
| vertriebsgruppe        | relation     |          |          | → Vertriebsgruppe (n:1)              |
| lagerbestaende         | relation     |          |          | → Lagerbestand[] (1:n)               |

**Lifecycle Hook (Marge):**
```
Wenn verkaufseinheit > 0:
  anzahl = groesse_liter / verkaufseinheit
  marge_prozent = ((anzahl × vk_preis_netto) - ek_preis_netto) / ek_preis_netto × 100

Sonst:
  marge_prozent = (vk_preis_netto - ek_preis_netto) / ek_preis_netto × 100
```

---

### Lieferant
> API: `api::lieferant.lieferant`

| Feld            | Typ      | Required | Unique | Beschreibung              |
|-----------------|----------|----------|--------|---------------------------|
| name            | string   | ✓        | ✓      | Firmenname                |
| kundennummer    | string   |          |        | Eigene Kundennr. dort     |
| ansprechpartner | string   |          |        | Kontaktperson             |
| email           | email    |          |        | E-Mail                    |
| telefon         | string   |          |        | Telefonnummer             |
| adresse         | text     |          |        | Anschrift                 |
| webseite        | string   |          |        | URL                       |
| notiz           | text     |          |        | Freitext                  |
| getraenke       | relation |          |        | → Getränk[] (1:n)         |

---

### Kategorie
> API: `api::kategorie.kategorie`

| Feld         | Typ      | Required | Unique | Beschreibung                   |
|--------------|----------|----------|--------|--------------------------------|
| name         | string   | ✓        | ✓      | z.B. Bier, Wein, Softdrinks    |
| beschreibung | text     |          |        | Optionale Beschreibung         |
| sortierung   | integer  |          | 0      | Reihenfolge in Listen          |
| getraenke    | relation |          |        | → Getränk[] (1:n)              |

---

### Vertriebsgruppe
> API: `api::vertriebsgruppe.vertriebsgruppe`

| Feld             | Typ      | Required | Unique | Beschreibung                    |
|------------------|----------|----------|--------|---------------------------------|
| name             | string   | ✓        | ✓      | Name der Vertriebsgruppe        |
| ansprechpartner  | string   |          |        | Kontaktperson                   |
| email            | email    |          |        | E-Mail                          |
| telefon          | string   |          |        | Telefonnummer                   |
| adresse          | text     |          |        | Anschrift                       |
| rueckverguetungen| text     |          |        | Rückvergütungen (Freitext)      |
| kommentar        | text     |          |        | Allgemeine Notizen              |
| getraenke        | relation |          |        | → Getränk[] (1:n)               |

---

### Lager
> API: `api::lager.lager`

| Feld         | Typ     | Required | Unique | Beschreibung           |
|--------------|---------|----------|--------|------------------------|
| name         | string  | ✓        | ✓      | z.B. "Saal", "Keller"  |
| beschreibung | text    |          |        | Optionale Beschreibung |
| aktiv        | boolean |          | true   | Lagerort aktiv/inaktiv |

---

### Lagerbestand
> API: `api::lagerbestand.lagerbestand`

| Feld           | Typ      | Required | Default | Beschreibung                  |
|----------------|----------|----------|---------|-------------------------------|
| getraenk       | relation |          |         | → Getränk (n:1, bidirektional)|
| lager          | relation |          |         | → Lager (n:1, einseitig)      |
| menge          | integer  | ✓        | 0       | Aktuelle Bestandsmenge        |
| mindestbestand | integer  |          | 0       | Meldebestand                  |
| maximalbestand | integer  |          |         | Lagerkapazität                |

---

## Berechnete Werte

| Wert            | Berechnung                                          | Wo              |
|-----------------|-----------------------------------------------------|-----------------|
| marge_prozent   | Lifecycle Hook (beforeCreate / beforeUpdate)        | Getränk-Schema  |
| Brutto-Preise   | Netto × (1 + Steuersatz/100) — nur im Frontend     | Client-seitig   |
| Gesamt-Bestand  | Summe aller Lagerbestand.menge pro Getränk          | Client-seitig   |

---

## CMS Collections (Website-Inhalte)

| Collection     | Typ          | Beschreibung                    |
|----------------|--------------|----------------------------------|
| Datenschutz    | singleType   | Datenschutz-Seite (Titel+Text)  |
| Impressum      | singleType   | Impressum-Seite (Titel+Text)    |
| Hero-Slider    | singleType   | Bilder für den Hero-Slider      |
| Über-Collage   | singleType   | Bildergalerie Über-Seite        |
| Geschichte     | singleType   | Timeline-Einträge               |
| Über-Uns       | singleType   | Freitext Über-Uns               |
| Klubrat        | collection   | Klubrat-Mitglieder + Merkmale   |
| Label          | collection   | Event-Tags/Kategorien           |
| Event          | collection   | Veranstaltungen                 |
