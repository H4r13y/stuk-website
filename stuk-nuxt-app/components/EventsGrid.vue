<template>
  <section class="container" id="events">
    <header class="controls" aria-label="Event-Filter">
      <div class="chips" role="group" aria-label="Formate">
        <button
          v-for="tag in filterTags"
          :key="tag"
          class="chip"
          :data-active="activeFilters.includes(tag)"
          @click="toggleFilter(tag)"
          :disabled="labelsPending || !!labelsError"
        >
          {{ tag }}
        </button>

        <button class="chip" @click="resetFilters">
          Filter löschen
        </button>
      </div>

      <p v-if="labelsError" style="color:var(--error); margin:0">
        Filter konnten nicht geladen werden.
      </p>
    </header>

    <div class="events" aria-live="polite">
      <p v-if="eventsPending" style="color: var(--muted); grid-column: 1/-1; text-align: center;">
        Lade Events…
      </p>

      <p v-else-if="eventsError" style="color: var(--error); grid-column: 1/-1; text-align: center;">
        Events konnten nicht geladen werden. Bitte später nochmal versuchen.
      </p>

      <template v-else>
        <EventCard
          v-for="(event, index) in filteredEvents"
          :key="event.id"
          :event="event"
          :variant="index % 4"
        />

        <p
          v-if="filteredEvents.length === 0"
          style="color: var(--muted); grid-column: 1/-1; text-align: center;"
        >
          Keine Events gefunden. Bitte später noch einmal schauen!
        </p>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

type StrapiList<T> = { data: T[] }

type Label = { id: number; name: string }
type Event = {
  id: number
  title: string
  description?: string | null
  start: string
  special_event?: boolean | null
  labels?: Label[] | null
}

const config = useRuntimeConfig()
const strapiUrl = config.public.strapiUrl

// State
const activeFilters = ref<string[]>([])

// Fetch: Labels (lazy load on client)
const {
  data: labelsRes,
  pending: labelsPending,
  error: labelsError,
} = useFetch<StrapiList<Label>>(`${strapiUrl}/api/labels`, {
  lazy: true,
  server: false,
})

// Fetch: Events (lazy load on client)
const nowIso = new Date().toISOString()
const in31DaysIso = new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString()

const eventsUrl =
  `${strapiUrl}/api/events?` +
  `pagination[pageSize]=100&` +
  `sort=start:asc&` +
  `populate=labels&` +
  `filters[start][$gte]=${encodeURIComponent(nowIso)}&` +
  `filters[start][$lte]=${encodeURIComponent(in31DaysIso)}`

const {
  data: eventsRes,
  pending: eventsPending,
  error: eventsError,
} = useFetch<StrapiList<Event>>(eventsUrl, {
  lazy: true,
  server: false,
})

// Derived data
const allEvents = computed(() => eventsRes.value?.data ?? [])

const filterTags = computed(() => {
  const names = (labelsRes.value?.data ?? []).map((l) => l.name)
  return names.sort((a, b) => a.localeCompare(b, "de"))
})

const filteredEvents = computed(() => {
  const events = allEvents.value
  if (activeFilters.value.length === 0) return events

  return events.filter((event) => {
    const labels = event.labels ?? []
    return labels.some((l) => activeFilters.value.includes(l.name))
  })
})

// Expose allEvents for parent to use
defineExpose({
  allEvents,
})

// UI actions
function toggleFilter(tag: string) {
  const i = activeFilters.value.indexOf(tag)
  if (i >= 0) activeFilters.value.splice(i, 1)
  else activeFilters.value.push(tag)
}

function resetFilters() {
  activeFilters.value = []
}
</script>

<style>
/* Filter/Controls */
.controls {
  position: sticky;
  top: 72px;
  z-index: 1200;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  margin: 6px 0 18px;
  background: rgba(10, 11, 13, 0.92);
  border: 1px solid #ffffff12;
  border-radius: var(--radius);
  padding: 20px;
  transition: padding .18s ease;
}

@media (min-width: 641px) {
  .controls {
    -webkit-backdrop-filter: blur(16px) saturate(1.3);
    backdrop-filter: blur(16px) saturate(1.3);
  }
}

.search {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff15;
  border: 1px solid #ffffff35;
  border-radius: 999px;
  padding: 10px 14px;
  min-width: 240px
}

.search input {
  all: unset;
  color: var(--text);
  width: 220px
}

.search input::placeholder {
  color: #e8eaed;
  opacity: 1
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .45rem .75rem;
  background: #0f1013;
  border: 1px solid var(--border);
  color: #cfd3d9;
  border-radius: 999px;
  cursor: pointer
}

.chip[data-active="true"] {
  background: #21304d;
  color: #fff;
  border-color: #ffffff33
}

/* Events Grid */
.events {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, 1fr)
}

@media (max-width: 1000px) {
  .events {
    grid-template-columns: repeat(2, 1fr)
  }
}

@media (max-width: 640px) {
  .events {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px
  }
}
</style>
