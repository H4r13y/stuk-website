import type { StrapiMedia } from './strapi'

/** Klubrat – Merkmal (Key-Value) */
export type KRMerkmal = {
  id: number
  Titel: string
  Merkmal: string
}

/** Klubrat-Mitglied */
export type Klubrat = {
  id: number
  documentId: string
  Name: string
  Posten: string
  Kurzbeschreibung: string
  Profilbild: StrapiMedia | null
  KR_Merkmale: KRMerkmal[]
}

/** Über-Collage (Galerie auf der Über-Seite) */
export type UeberCollage = {
  id: number
  Bilder: StrapiMedia[]
}

/** Über-uns Freitext */
export type UeberUnsData = {
  id: number
  Inhalt: string
}

/** Einzelner Geschichteneintrag (Timeline) */
export type GeschichteEintrag = {
  id: number
  Kurztext: string
  Jahreszahl: string
  Beschreibung?: string | null
  Bild?: StrapiMedia | null
}

/** Geschichte-Collection (wrapper) */
export type GeschichteData = {
  id: number
  Geschichteneintrag: GeschichteEintrag[]
}

/** Datenschutz-Seite */
export type DatenschutzData = {
  titel: string
  Inhalt: string
}

/** Impressum-Seite */
export type ImpressumData = {
  titel: string
  Inhalt: string
}
