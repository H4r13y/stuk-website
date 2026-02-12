<template>
  <section class="container" id="events">
    <header class="controls" aria-label="Event-Filter">
      <!-- Mobile Filter Button (nur auf Smartphone sichtbar) -->
      <button class="filter-toggle-mobile" @click="showFilterModal = !showFilterModal">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
        Filter
        <span v-if="activeFilters.length > 0" class="filter-count">{{ activeFilters.length }}</span>
      </button>

      <!-- Aktive Filter Anzeige (Mobile) -->
      <div v-if="activeFilters.length > 0" class="active-filters-mobile">
        <button
          v-for="tag in activeFilters"
          :key="tag"
          class="chip active-chip"
          @click="toggleFilter(tag)"
        >
          {{ tag }}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <!-- Desktop Filter (wie bisher) -->
      <div class="chips chips-desktop" role="group" aria-label="Formate">
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

    <!-- Filter Modal (Mobile) -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showFilterModal" class="filter-modal-overlay" @click="showFilterModal = false">
          <div class="filter-modal" @click.stop>
            <div class="filter-modal-header">
              <h3>Filter wählen</h3>
              <button class="close-btn" @click="showFilterModal = false">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div class="filter-modal-content">
              <button
                v-for="tag in filterTags"
                :key="tag"
                class="chip chip-modal"
                :data-active="activeFilters.includes(tag)"
                @click="toggleFilter(tag)"
                :disabled="labelsPending || !!labelsError"
              >
                {{ tag }}
              </button>
            </div>
            <div class="filter-modal-footer">
              <button class="btn" @click="resetFilters">Filter löschen</button>
              <button class="btn primary" @click="showFilterModal = false">Fertig</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

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
          @click="handleEventClick"
        />

        <p
          v-if="filteredEvents.length === 0"
          style="color: var(--muted); grid-column: 1/-1; text-align: center;"
        >
          Keine Events gefunden. Bitte später noch einmal schauen!
        </p>
      </template>
    </div>

    <!-- Event Details Modal (nur Mobile) -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="selectedEvent" class="event-modal-overlay" @click="selectedEvent = null">
          <div class="event-modal" @click.stop>
            <div class="event-modal-header">
              <div class="event-modal-date">
                <b>{{ formatEventDate(selectedEvent) }}</b>
                <small>{{ formatEventTime(selectedEvent) }}</small>
              </div>
              <button class="close-btn" @click="selectedEvent = null">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div class="event-modal-content">
              <h2>{{ selectedEvent.title }}</h2>
              <p v-if="selectedEvent.description" class="event-description">
                {{ selectedEvent.description }}
              </p>
              <p v-else class="event-description muted">
                Mehr Infos folgen bald!
              </p>

              <div v-if="selectedEvent.labels && selectedEvent.labels.length > 0" class="event-labels">
                <span v-for="label in selectedEvent.labels" :key="label.id" class="event-label">
                  {{ label.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"

type StrapiList<T> = { data: T[] }

type Label = { id: number; name: string; description?: string | null }
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
const showFilterModal = ref(false)
const selectedEvent = ref<Event | null>(null)

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
const now = new Date()
const queryStart = new Date(now)
// Zwischen 0–3 Uhr: auch Events von gestern einbeziehen (Nachtbetrieb)
if (now.getHours() < 3) {
  queryStart.setDate(queryStart.getDate() - 1)
}
queryStart.setHours(0, 0, 0, 0)
const nowIso = queryStart.toISOString()
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

function handleEventClick(event: Event) {
  selectedEvent.value = event
}

function formatEventDate(event: Event) {
  const date = new Date(event.start)
  const weekdays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
  const weekday = weekdays[date.getDay()]
  const day = date.getDate()
  const month = date.getMonth() + 1
  return `${weekday} ${day}.${month}.`
}

function formatEventTime(event: Event) {
  const date = new Date(event.start)
  const hh = String(date.getHours()).padStart(2, "0")
  const mm = String(date.getMinutes()).padStart(2, "0")
  return `ab ${hh}:${mm} Uhr`
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

@media (max-width: 640px) {
  .controls {
    top: 8px;
  }
}

@media (min-width: 641px) {
  .controls {
    -webkit-backdrop-filter: blur(16px) saturate(1.3);
    backdrop-filter: blur(16px) saturate(1.3);
  }
}

/* Mobile Filter Toggle Button */
.filter-toggle-mobile {
  display: none;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  background: #8a2420;
  color: white;
  border: none;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.filter-toggle-mobile:hover {
  background: #6e1d1a;
  transform: translateY(-1px);
}

.filter-count {
  background: white;
  color: var(--brand-red);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

@media (max-width: 640px) {
  .filter-toggle-mobile {
    display: flex;
  }

  .chips-desktop {
    display: none !important;
  }

  .controls {
    padding: 12px;
    flex-direction: column;
    align-items: stretch;
  }
}

/* Active Filters Display (Mobile) */
.active-filters-mobile {
  display: none;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}

@media (max-width: 640px) {
  .active-filters-mobile {
    display: flex;
  }
}

.active-chip {
  background: #21304d;
  color: #fff;
  border-color: #ffffff33;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
}

.active-chip svg {
  opacity: 0.7;
}

/* Filter Modal */
.filter-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  z-index: 9999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

@media (min-width: 641px) {
  .filter-modal-overlay {
    align-items: center;
  }
}

.filter-modal {
  background: #0f1013;
  border: 1px solid #ffffff22;
  border-radius: var(--radius) var(--radius) 0 0;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.4);
}

@media (min-width: 641px) {
  .filter-modal {
    border-radius: var(--radius);
    max-height: 70vh;
  }
}

.filter-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ffffff12;
}

.filter-modal-header h3 {
  margin: 0;
  color: var(--text);
  font-size: 1.2rem;
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.close-btn:hover {
  color: var(--text);
}

.filter-modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-content: flex-start;
}

.chip-modal {
  flex: 0 0 auto;
  padding: 10px 16px;
  font-size: 0.95rem;
}

.filter-modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #ffffff12;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.filter-modal-footer .btn {
  padding: 10px 20px;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--text);
}

.filter-modal-footer .btn:hover {
  background: #ffffff08;
}

.filter-modal-footer .btn.primary {
  background: var(--brand-red);
  border-color: var(--brand-red);
  color: white;
}

.filter-modal-footer .btn.primary:hover {
  background: #a02f2a;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-active .filter-modal,
.modal-leave-active .filter-modal {
  transition: transform 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .filter-modal {
  transform: translateY(100%);
}

.modal-leave-to .filter-modal {
  transform: translateY(100%);
}

@media (min-width: 641px) {
  .modal-enter-from .filter-modal,
  .modal-leave-to .filter-modal {
    transform: translateY(20px) scale(0.95);
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
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px
  }
}

/* Event Details Modal (nur Mobile) */
.event-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  z-index: 10000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0;
}

@media (min-width: 641px) {
  .event-modal-overlay {
    display: none;
  }
}

.event-modal {
  background: linear-gradient(135deg, #0f1013 0%, #1a1d24 100%);
  border: 1px solid #ffffff22;
  border-radius: var(--radius) var(--radius) 0 0;
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.6);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.event-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  border-bottom: 1px solid #ffffff12;
  background: rgba(0, 0, 0, 0.2);
}

.event-modal-date {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px 12px;
  background: rgba(188, 43, 37, 0.15);
  border: 1px solid rgba(188, 43, 37, 0.3);
  border-radius: 8px;
}

.event-modal-date b {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--brand-red);
  letter-spacing: 0.3px;
}

.event-modal-date small {
  font-size: 0.8rem;
  color: #a7abb2;
  font-weight: 500;
}

.event-modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px 20px;
}

.event-modal-content h2 {
  margin: 0 0 16px;
  color: var(--text);
  font-size: 1.5rem;
  line-height: 1.3;
}

.event-description {
  color: var(--muted);
  line-height: 1.6;
  margin: 0 0 20px;
  font-size: 0.95rem;
}

.event-description.muted {
  font-style: italic;
  opacity: 0.7;
}

.event-labels {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}

.event-label {
  display: inline-block;
  padding: 6px 12px;
  background: rgba(33, 48, 77, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 500;
}
</style>
