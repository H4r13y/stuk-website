import type { Getraenk, Lager, InventurCount, InventurSession } from '~/types'

const STORAGE_PREFIX = 'inventur_session_'
const ACTIVE_LAGER_KEY = 'inventur_active_lager'

type Step = 'pin' | 'lager' | 'counting' | 'summary'

// Shared state (singleton across components)
const step = ref<Step>('pin')
const session = ref<InventurSession | null>(null)
const articles = ref<Getraenk[]>([])
const lagerOptions = ref<Lager[]>([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const submitProgress = ref(0)
const submitTotal = ref(0)
const isSubmitted = ref(false)
const sortMode = ref<'kategorie' | 'alphabetisch'>('kategorie')
const viewMode = ref<'gross' | 'kompakt'>('gross')

export function useInventur() {
  const config = useRuntimeConfig()
  const strapiUrl = config.public.strapiUrl as string
  const apiToken = 'ccf71576682c113dd3bbe70b635da450e18463e3273f3ce4900637d2253433c51c9b76a53483eab7c5a1dbbf65384b83f808f4ada6866d09fe7980a36f25d580e2682d7b9fc49df134836911556c7050c78c07777c4dcce6a650071759a9dcb8c7a37a612b0cc0429047c98a4a388223995ad9e2332a76fb1443f30ea2535b66'
  const pin = '1234'

  // --- Auth Headers (für alle API-Calls) ---
  function authHeaders(): Record<string, string> {
    const h: Record<string, string> = { 'Content-Type': 'application/json' }
    if (apiToken) h['Authorization'] = `Bearer ${apiToken}`
    return h
  }

  // --- PIN ---
  function verifyPin(input: string): boolean {
    return input === pin
  }

  // --- localStorage (pro Lager) ---
  function persistSession() {
    if (!session.value) return
    if (import.meta.server) return
    const key = STORAGE_PREFIX + session.value.lagerDocumentId
    localStorage.setItem(key, JSON.stringify(session.value))
    localStorage.setItem(ACTIVE_LAGER_KEY, session.value.lagerDocumentId)
  }

  function loadSession(): boolean {
    if (import.meta.server) return false
    const activeLagerId = localStorage.getItem(ACTIVE_LAGER_KEY)
    if (!activeLagerId) return false
    const raw = localStorage.getItem(STORAGE_PREFIX + activeLagerId)
    if (!raw) return false
    try {
      session.value = JSON.parse(raw) as InventurSession
      return true
    } catch {
      return false
    }
  }

  function loadSessionForLager(lagerDocumentId: string): boolean {
    if (import.meta.server) return false
    const raw = localStorage.getItem(STORAGE_PREFIX + lagerDocumentId)
    if (!raw) return false
    try {
      session.value = JSON.parse(raw) as InventurSession
      localStorage.setItem(ACTIVE_LAGER_KEY, lagerDocumentId)
      return true
    } catch {
      return false
    }
  }

  function clearSession() {
    if (!session.value) return
    if (import.meta.server) return
    localStorage.removeItem(STORAGE_PREFIX + session.value.lagerDocumentId)
    localStorage.removeItem(ACTIVE_LAGER_KEY)
    session.value = null
  }

  // --- API: Load Lager ---
  async function fetchLager() {
    try {
      const res = await $fetch<{ data: Lager[] }>(
        `${strapiUrl}/api/lagers?filters[aktiv][$eq]=true`,
        { headers: authHeaders() }
      )
      lagerOptions.value = res.data || []
    } catch (e) {
      console.error('Fehler beim Laden der Lager:', e)
      lagerOptions.value = []
    }
  }

  // --- API: Load Getränke ---
  async function fetchArticles() {
    isLoading.value = true
    try {
      const url = `${strapiUrl}/api/getraenkelagers?filters[aktiv][$eq]=true&populate[kategorie][fields][0]=name&populate[kategorie][fields][1]=sortierung&populate[lagerbestaende][populate][lager][fields][0]=documentId&populate[bild][fields][0]=url&populate[bild][fields][1]=formats&pagination[pageSize]=200&sort=name:asc`
      const res = await $fetch<{ data: Getraenk[] }>(url, { headers: authHeaders() })
      articles.value = res.data || []
    } catch (e) {
      console.error('Fehler beim Laden der Artikel:', e)
      articles.value = []
    } finally {
      isLoading.value = false
    }
  }

  // --- Artikel aus API in Session mergen (neue ergänzen, bestehende behalten) ---
  async function syncArticles() {
    if (!session.value) return
    const lagerDocumentId = session.value.lagerDocumentId

    await fetchArticles()

    let added = 0
    for (const article of articles.value) {
      if (session.value.counts[article.documentId]) continue

      const bestand = article.lagerbestaende?.find(
        (b: { lager?: { documentId?: string } }) => b.lager?.documentId === lagerDocumentId
      )
      const rawBildUrl = article.bild?.formats?.small?.url
        ?? article.bild?.formats?.thumbnail?.url
        ?? article.bild?.url
        ?? null
      const bildUrl = rawBildUrl && rawBildUrl.startsWith('/')
        ? `${strapiUrl}${rawBildUrl}`
        : rawBildUrl

      session.value.counts[article.documentId] = {
        getraenkDocumentId: article.documentId,
        lagerbestandDocumentId: bestand?.documentId ?? null,
        name: article.name,
        kategorie: article.kategorie?.name ?? 'Ohne Kategorie',
        sortierung: article.kategorie?.sortierung ?? 999,
        kaesten: 0,
        einzelflaschen: 0,
        vpe: article.vpe,
        bildUrl,
      }
      added++
    }

    if (added > 0) persistSession()
  }

  // --- Session starten / wiederherstellen ---
  async function selectLager(lager: Lager) {
    const hasExistingSession = loadSessionForLager(lager.documentId)

    if (!hasExistingSession) {
      session.value = {
        lagerDocumentId: lager.documentId,
        lagerName: lager.name,
        startedAt: new Date().toISOString(),
        counts: {},
      }
    }

    await syncArticles()
    step.value = 'counting'
  }

  // --- Zählung updaten ---
  function updateCount(
    getraenkDocumentId: string,
    field: 'kaesten' | 'einzelflaschen',
    value: number
  ) {
    if (!session.value) return
    const count = session.value.counts[getraenkDocumentId]
    if (!count) return
    count[field] = Math.max(0, value)
    persistSession()
  }

  // --- Computed: Fortschritt ---
  const progress = computed(() => {
    if (!session.value) return { done: 0, total: 0 }
    const entries = Object.values(session.value.counts)
    const total = entries.length
    const done = entries.filter(
      (c) => c.kaesten > 0 || c.einzelflaschen > 0
    ).length
    return { done, total }
  })

  // --- Computed: Total pro Artikel ---
  function getTotal(count: InventurCount): number {
    return count.kaesten * count.vpe + count.einzelflaschen
  }

  // --- Computed: Gruppierte Artikel ---
  const groupedArticles = computed(() => {
    if (!session.value) return []

    const counts = Object.values(session.value.counts)

    if (sortMode.value === 'alphabetisch') {
      return [
        {
          kategorie: 'Alle Artikel',
          sortierung: 0,
          items: [...counts].sort((a, b) => a.name.localeCompare(b.name)),
        },
      ]
    }

    // Group by category
    const groups: Record<string, { kategorie: string; sortierung: number; items: InventurCount[] }> = {}
    for (const count of counts) {
      const key = count.kategorie
      if (!groups[key]) {
        groups[key] = { kategorie: key, sortierung: count.sortierung, items: [] }
      }
      groups[key].items.push(count)
    }

    return Object.values(groups)
      .sort((a, b) => a.sortierung - b.sortierung)
      .map((g) => ({
        ...g,
        items: g.items.sort((a, b) => a.name.localeCompare(b.name)),
      }))
  })

  // --- API: Submit ---
  async function submitInventur() {
    if (!session.value) return

    isSubmitting.value = true
    submitProgress.value = 0

    const entries = Object.values(session.value.counts).filter(
      (c) => c.kaesten > 0 || c.einzelflaschen > 0
    )
    submitTotal.value = entries.length

    const headers = authHeaders()

    // Process in batches of 3
    for (let i = 0; i < entries.length; i += 3) {
      const batch = entries.slice(i, i + 3)
      const promises = batch.map((count) => {
        const total = getTotal(count)

        if (count.lagerbestandDocumentId) {
          // UPDATE existing
          return $fetch(
            `${strapiUrl}/api/lagerbestaende/${count.lagerbestandDocumentId}`,
            {
              method: 'PUT',
              headers,
              body: { data: { menge: total } },
            }
          )
        } else {
          // CREATE new
          return $fetch(`${strapiUrl}/api/lagerbestaende`, {
            method: 'POST',
            headers,
            body: {
              data: {
                getraenk: count.getraenkDocumentId,
                lager: session.value!.lagerDocumentId,
                menge: total,
              },
            },
          })
        }
      })

      await Promise.allSettled(promises)
      submitProgress.value = Math.min(i + batch.length, entries.length)
    }

    isSubmitting.value = false
    isSubmitted.value = true
    clearSession()
  }

  // --- Lager wechseln (zurück zur Auswahl, Session bleibt erhalten) ---
  function changeLager() {
    step.value = 'lager'
  }

  // --- Zählung für aktuelles Lager zurücksetzen ---
  function resetCounts() {
    if (!session.value) return
    for (const key of Object.keys(session.value.counts)) {
      session.value.counts[key].kaesten = 0
      session.value.counts[key].einzelflaschen = 0
    }
    persistSession()
  }

  // --- Reset ---
  function resetAll() {
    clearSession()
    articles.value = []
    step.value = 'pin'
    isSubmitted.value = false
    submitProgress.value = 0
    submitTotal.value = 0
  }

  return {
    // State
    step,
    session,
    articles,
    lagerOptions,
    isLoading,
    isSubmitting,
    submitProgress,
    submitTotal,
    isSubmitted,
    sortMode,
    viewMode,

    // Computed
    progress,
    groupedArticles,

    // Methods
    verifyPin,
    fetchLager,
    selectLager,
    updateCount,
    getTotal,
    submitInventur,
    loadSession,
    syncArticles,
    persistSession,
    changeLager,
    resetCounts,
    resetAll,
  }
}
