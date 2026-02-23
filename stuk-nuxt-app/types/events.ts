/** Event-Label (Tag / Kategorie) */
export type Label = {
  id: number
  name: string
  description?: string | null
}

/** Einzelnes Event (Component events.events) */
export type Event = {
  id: number
  Title: string
  StartTime: string
  Public?: boolean | null
  Description?: unknown[] | null
  SpecialEvent?: boolean | null
  Lables?: Label[] | null
  Link?: string | null
  Media?: unknown[] | null
}

/** Event-Collection (Parent) mit repeatable Events */
export type EventCollection = {
  id: number
  Title: string
  Events: Event[]
}
