import type { StrapiMedia } from './strapi'

/** Enums */
export type Gebindeart =
  | 'Glas_Mehrweg'
  | 'Glas_Einweg'
  | 'PET'
  | 'Dose'
  | 'Fass'
  | 'Sonstiges'

export type Steuersatz = 'mwst_7' | 'mwst_19' | 'mwst_0'

/** Lieferant */
export type Lieferant = {
  id: number
  documentId: string
  name: string
  kundennummer?: string | null
  ansprechpartner?: string | null
  email?: string | null
  telefon?: string | null
  adresse?: string | null
  webseite?: string | null
  notiz?: string | null
  getraenke?: Getraenk[]
}

/** Kategorie */
export type Kategorie = {
  id: number
  documentId: string
  name: string
  beschreibung?: string | null
  sortierung?: number | null
  getraenke?: Getraenk[]
}

/** Lager (Standort: Saal, Keller, ...) */
export type Lager = {
  id: number
  documentId: string
  name: string
  beschreibung?: string | null
  aktiv: boolean
}

/** Lagerbestand – Menge pro Artikel pro Lagerort */
export type Lagerbestand = {
  id: number
  documentId: string
  getraenk?: Getraenk | null
  lager?: Lager | null
  menge: number
  mindestbestand?: number | null
  maximalbestand?: number | null
}

/** Getränk – Hauptartikel */
export type Getraenk = {
  id: number
  documentId: string
  name: string
  sku?: string | null
  artikelnummer_lieferant?: string | null
  ean?: string | null
  groesse_liter: number
  verkaufseinheit?: number | null
  gebindeart?: Gebindeart | null
  vpe: number
  alkoholgehalt?: number | null
  steuersatz: Steuersatz
  ek_preis_netto: number
  vk_preis_netto: number
  marge_prozent?: number | null
  pfand_einzel?: number | null
  pfand_gebinde?: number | null
  aktiv: boolean
  bild?: StrapiMedia | null
  kommentar?: string | null
  lieferant?: Lieferant | null
  kategorie?: Kategorie | null
  vertriebsgruppe?: Vertriebsgruppe | null
  lagerbestaende?: Lagerbestand[]
}

/** Inventur – Zählung pro Artikel */
export interface InventurCount {
  getraenkDocumentId: string
  lagerbestandDocumentId: string | null
  name: string
  kategorie: string
  sortierung: number
  kaesten: number
  einzelflaschen: number
  vpe: number
  bildUrl: string | null
}

/** Inventur – Gesamte Zähl-Session */
export interface InventurSession {
  lagerDocumentId: string
  lagerName: string
  startedAt: string
  counts: Record<string, InventurCount>
}

/** Vertriebsgruppe */
export type Vertriebsgruppe = {
  id: number
  documentId: string
  name: string
  ansprechpartner?: string | null
  email?: string | null
  telefon?: string | null
  adresse?: string | null
  rueckverguetungen?: string | null
  kommentar?: string | null
  getraenke?: Getraenk[]
}
