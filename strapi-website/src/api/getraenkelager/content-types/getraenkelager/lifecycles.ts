/**
 * Berechnet die Marge in Prozent.
 * Formel: ((Anzahl VK-Einheiten * VK-Preis) - EK-Preis) / EK-Preis * 100
 *
 * Wenn keine verkaufseinheit gesetzt ist, wird 1:1 verglichen
 * (VK-Preis vs. EK-Preis direkt).
 */
function berechneMarge(data: Record<string, unknown>): number | null {
  const ek = Number(data.ek_preis_netto)
  const vk = Number(data.vk_preis_netto)
  const groesse = Number(data.groesse_liter)
  const einheit = Number(data.verkaufseinheit)

  if (!ek || ek <= 0 || !vk || vk <= 0) return null

  if (einheit > 0 && groesse > 0) {
    const anzahl = groesse / einheit
    const umsatz = anzahl * vk
    return Math.round(((umsatz - ek) / ek) * 10000) / 100
  }

  return Math.round(((vk - ek) / ek) * 10000) / 100
}

export default {
  async beforeCreate(event) {
    const marge = berechneMarge(event.params.data)
    if (marge !== null) {
      event.params.data.marge_prozent = marge
    }
  },

  async beforeUpdate(event) {
    const { where, data } = event.params

    const existing = await strapi.db
      .query('api::getraenkelager.getraenkelager')
      .findOne({ where })

    if (existing) {
      const merged = { ...existing, ...data }
      const marge = berechneMarge(merged)
      if (marge !== null) {
        event.params.data.marge_prozent = marge
      }
    }
  },
}
