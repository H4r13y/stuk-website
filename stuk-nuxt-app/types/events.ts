/** Event-Label (Tag / Kategorie) */
export type Label = {
  id: number
  name: string
  description?: string | null
}

/** Einzelnes Event aus Strapi */
export type Event = {
  id: number
  title: string
  description?: string | null
  start: string
  special_event?: boolean | null
  labels?: Label[] | null
}
