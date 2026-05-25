import type { Getraenk, Lager, InventurCount, InventurSession } from '~/types'

const STORAGE_KEY = 'inventur_session'

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

export function useInventur() {
  const config = useRuntimeConfig()
  const strapiUrl = config.public.strapiUrl as string
  const apiToken = config.public.inventurApiToken as string
  const pin = config.public.inventurPin as string

  // --- PIN ---
  function verifyPin(input: string): boolean {
    return input === pin
  }

  // --- localStorage ---
  function persistSession() {
    if (!session.value) return
    if (import.meta.server) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session.value))
  }

  function loadSession(): boolean {
    if (import.meta.server) return false
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return false
    try {
      session.value = JSON.parse(raw) as InventurSession
      return true
    } catch {
      return false
    }
  }

  function clearSession() {
    session.value = null
    if (import.meta.server) return
    localStorage.removeItem(STORAGE_KEY)
  }

  // --- API: Load Lager ---
  async function fetchLager() {
    const { data } = await useFetch<{ data: Lager[] }>(
      `${strapiUrl}/api/lagers?filters[aktiv][$eq]=true`,
      { server: false }
    )
    if (data.value?.data) {
      lagerOptions.value = data.value.data
    }
  }

  // --- API: Load Getränke ---
  async function fetchArticles(lagerDocumentId: string) {
    isLoading.value = true
    try {
      const url = `${strapiUrl}/api/getraenkelagers?filters[aktiv][$eq]=true&populate[kategorie][fields][0]=name&populate[kategorie][fields][1]=sortierung&populate[lagerbestaende][populate][lager][fields][0]=documentId&pagination[pageSize]=200&sort=name:asc`
      const res = await $fetch<{ data: Getraenk[] }>(url)
      articles.value = res.data || []
    } catch (e) {
      console.error('Fehler beim Laden der Artikel:', e)
      articles.value = []
    } finally {
      isLoading.value = false
    }
  }

  // --- Session starten ---
  async function selectLager(lager: Lager) {
    session.value = {
      lagerDocumentId: lager.documentId,
      lagerName: lager.name,
      startedAt: new Date().toISOString(),
      counts: {},
    }

    await fetchArticles(lager.documentId)

    // Initialize counts for all articles
    for (const article of articles.value) {
      const bestand = article.lagerbestaende?.find(
        (b) => b.lager?.documentId === lager.documentId
      )
      session.value.counts[article.documentId] = {
        getraenkDocumentId: article.documentId,
        lagerbestandDocumentId: bestand?.documentId ?? null,
        name: article.name,
        kategorie: article.kategorie?.name ?? 'Ohne Kategorie',
        sortierung: article.kategorie?.sortierung ?? 999,
        kaesten: 0,
        einzelflaschen: 0,
        vpe: article.vpe,
      }
    }

    persistSession()
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

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (apiToken) {
      headers['Authorization'] = `Bearer ${apiToken}`
    }

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
    persistSession,
    resetAll,
  }
}
