<template>
  <article
    class="card"
    :data-variant="variant"
    @click="handleClick"
  >
    <div class="date-badge date-badge-desktop">
      <b>{{ formattedDate }}</b>
      <small class="time-mobile">{{ formattedTime }}</small>
    </div>

    <div class="body">
      <div class="date-info-mobile">
        <span class="date-mobile">{{ formattedDate }}</span>
        <span class="time-mobile-inline">{{ formattedTime }}</span>
      </div>
      <h3>{{ event.Title }}</h3>
      <p class="sub description-desktop" style="margin:0">
        {{ displayDescription }}
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { Event } from "~/types"

const props = defineProps<{
  event: Event
  variant?: number
}>()

const emit = defineEmits<{
  click: [event: Event]
}>()

const formattedDate = computed(() => {
  const date = new Date(props.event.StartTime)
  const weekdays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
  const weekday = weekdays[date.getDay()]
  const day = date.getDate()
  const month = date.getMonth() + 1
  return `${weekday} ${day}.${month}.`
})

const formattedTime = computed(() => {
  const date = new Date(props.event.StartTime)
  const hh = String(date.getHours()).padStart(2, "0")
  const mm = String(date.getMinutes()).padStart(2, "0")
  return `ab ${hh}:${mm} Uhr`
})

// Beschreibung: Label-Description oder Event-Description
const displayDescription = computed(() => {
  const labels = props.event.Lables || []

  // Prüfe ob "Spezialevent" Label vorhanden ist
  const hasSpecialEvent = labels.some(label => label.name.toLowerCase() === 'spezialevent')

  // Wenn Spezialevent: Zeige event.Description
  if (hasSpecialEvent) {
    return props.event.Description || "Mehr Infos folgen bald!"
  }

  // Sonst: Zeige die description vom ersten Label (falls vorhanden)
  const firstLabelWithDesc = labels.find(label => label.description)
  if (firstLabelWithDesc?.description) {
    return firstLabelWithDesc.description
  }

  // Fallback
  return "Mehr Infos folgen bald!"
})

function handleClick() {
  // Nur auf Mobile das Popup öffnen
  if (window.innerWidth <= 640) {
    emit('click', props.event)
  }
}
</script>

<style>
.date-badge {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  backdrop-filter: blur(8px);
}

.date-badge b {
  font-size: 0.9rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.3px;
}

.date-badge small {
  font-size: 0.85rem;
  color: #a7abb2;
  font-weight: 500;
}

/* Date Info Mobile (nur auf Mobile sichtbar) */
.date-info-mobile {
  display: none;
}

/* Mobile Optimierungen */
@media (max-width: 640px) {
  /* Description auf Mobile verstecken */
  .description-desktop {
    display: none !important;
  }

  /* Desktop Date Badge ausblenden */
  .date-badge-desktop {
    display: none !important;
  }

  /* Mobile Date Info einblenden */
  .date-info-mobile {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-bottom: 4px;
  }

  .date-mobile {
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--brand-red);
    letter-spacing: 0.3px;
  }

  .time-mobile-inline {
    font-size: 0.65rem;
    color: #a7abb2;
    font-weight: 500;
  }

  /* Card selbst kompakter und klickbar */
  .card {
    padding: 2px;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .card:active {
    transform: scale(0.98);
  }

  /* Card-Body kompakter */
  .card .body {
    padding: 0px 6px 8px 6px;
  }

  .card .body h3 {
    font-size: clamp(0.7rem, 2.5vw, 0.85rem);
    line-height: 1.2;
    margin: 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
  }
}
</style>
