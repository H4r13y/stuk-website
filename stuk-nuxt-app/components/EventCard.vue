<template>
  <article class="card" :data-variant="variant">
    <div class="date-badge">
      <b>{{ formattedDate }}</b>
      <small class="time-mobile">{{ formattedTime }}</small>
    </div>

    <div class="body">
      <h3>{{ event.title }}</h3>
      <p class="sub description-desktop" style="margin:0">
        {{ event.description || "Mehr Infos folgen bald!" }}
      </p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue"

type Label = { id: number; name: string }
type Event = {
  id: number
  title: string
  description?: string | null
  start: string
  special_event?: boolean | null
  labels?: Label[] | null
}

const props = defineProps<{
  event: Event
  variant?: number
}>()

const formattedDate = computed(() => {
  const date = new Date(props.event.start)
  const weekdays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
  const weekday = weekdays[date.getDay()]
  const day = date.getDate()
  const month = date.getMonth() + 1
  return `${weekday} ${day}.${month}.`
})

const formattedTime = computed(() => {
  const date = new Date(props.event.start)
  const hh = String(date.getHours()).padStart(2, "0")
  const mm = String(date.getMinutes()).padStart(2, "0")
  return `ab ${hh}:${mm} Uhr`
})
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

/* Mobile Optimierungen */
@media (max-width: 640px) {
  /* Description auf Mobile verstecken */
  .description-desktop {
    display: none !important;
  }

  /* Date Badge kompakter */
  .date-badge {
    flex-direction: column;
    gap: 2px;
    padding: 6px 10px;
    align-items: flex-start;
  }

  .date-badge b {
    font-size: 0.85rem;
  }

  .time-mobile {
    font-size: 0.7rem;
  }

  /* Card-Body kompakter */
  .card .body {
    padding: 10px;
  }

  .card .body h3 {
    font-size: 0.95rem;
    line-height: 1.3;
    margin: 0;
  }
}
</style>
