/** Strapi Media / Upload */
export type StrapiMediaFormat = {
  url: string
}

export type StrapiMedia = {
  id: number
  url: string
  alternativeText?: string
  caption?: string
  formats?: {
    thumbnail?: StrapiMediaFormat
    small?: StrapiMediaFormat
    medium?: StrapiMediaFormat
    large?: StrapiMediaFormat
  }
}

export type MediaSize = 'thumbnail' | 'small' | 'medium' | 'large' | 'original'

/** Strapi response wrappers */
export type StrapiList<T> = { data: T[] }
export type StrapiSingle<T> = { data: T }
