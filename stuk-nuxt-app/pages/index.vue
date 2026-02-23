
<template>
  <div>
    <!-- Hero Banner -->
    <section class="hero-banner">
      <div class="slideshow" aria-hidden="true">
        <div v-for="(image, index) in slideImages" :key="image" class="slide"
          :class="{ active: index === currentSlide }" :style="{ backgroundImage: `url(${image})` }" />
      </div>

      <div class="hero-content">
        <div class="hero-logo-large">
          <img src="/logo.svg" alt="StuK Leipzig Logo" />
        </div>
        <div class="hero-text">
          <p>where everybody knows your name</p>
        </div>
      </div>

      <div class="scroll-indicator" role="button" tabindex="0" aria-label="Zum Programm scrollen"
        @click="scrollToProgram" @keydown.enter="scrollToProgram">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5v14M19 12l-7 7-7-7" />
        </svg>
      </div>
    </section>
    <!-- Hero Section -->
    <section class="hero">
      <div class="container hero-grid">
        <article class="panel">
          <!-- <h1>{{ currentMonth }} im StuK</h1> -->
           <h2>Kommende Veranstaltungen im StuK</h2>
          <p class="sub">Konzerte, Kleinkunst, Quiz, Clubnächte und mehr.</p>
          <div class="badge"><span class="dot" :class="{ open: isOpen }"></span> {{ todayOpeningInfo }}</div>

          <div style="margin-top:14px; display:flex; gap:12px; flex-wrap:wrap">
            <a class="btn" href="#events">Programm ansehen</a>
            <a class="btn ghost" :href="mapsUrl" target="_blank" rel="noopener">Anfahrt</a>
          </div>
        </article>

        <aside class="panel upcoming" aria-labelledby="upcoming-title">
          <h3 id="upcoming-title">Special Events</h3>

          <ul>
            <li v-if="specialEvents.length === 0" style="color:var(--muted); font-style:italic">
              Keine besonderen Events geplant
            </li>
            <li v-for="event in specialEvents" :key="event.id">
              {{ event.date }} <small>{{ event.title }} – {{ event.time }}</small>
            </li>
          </ul>
        </aside>
      </div>
    </section>

    <!-- Events Section -->
    <EventsGrid ref="eventsGridRef" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from "vue"
import type { Event } from "~/types"

// Alle Bilder aus assets/images/hero-slider automatisch einsammeln (egal wie benannt)
const sliderFiles = import.meta.glob(
  "~/assets/images/hero-slider/*.{png,jpg,jpeg,webp,svg}",
  { eager: true, import: "default" }
) as Record<string, string>

// Stabile Reihenfolge: nach Dateiname sortieren
const slideImages = computed(() => {
  return Object.entries(sliderFiles)
    .sort(([a], [b]) => a.localeCompare(b, "de"))
    .map(([, url]) => url)
})

const currentSlide = ref(0)

let slideInterval: ReturnType<typeof setInterval> | undefined

function startSlider() {
  stopSlider()

  // nichts tun, wenn keine Bilder da sind
  if (slideImages.value.length <= 1) return

  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slideImages.value.length
  }, 4000)
}

function stopSlider() {
  if (slideInterval) {
    clearInterval(slideInterval)
    slideInterval = undefined
  }
}

function scrollToProgram() {
  document.querySelector('.hero')?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  // Start nach Mount (Client)
  startSlider()

  // Maps URL basierend auf Device aktualisieren (nach Hydration)
  const userAgent = navigator.userAgent || ''
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream
  const isMacOS = /Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent)
  if (isIOS || isMacOS) {
    mapsUrl.value = appleMapsUrl
  }
})

// Falls Bilder z.B. beim Dev-HMR neu geladen werden: Slider neu starten
watch(slideImages, () => {
  currentSlide.value = 0
  startSlider()
})

onBeforeUnmount(() => {
  stopSlider()
})

// Ref zur EventsGrid Component, um auf Events zuzugreifen
const eventsGridRef = ref<{ allEvents: Event[] } | null>(null)

// Events von der EventsGrid Component
const allEvents = computed((): Event[] => eventsGridRef.value?.allEvents ?? [])

const specialEvents = computed(() => {
  return allEvents.value
    .filter((e) => e.SpecialEvent === true)
    .map((e) => ({
      id: e.id,
      title: e.Title,
      date: formatDate(e.StartTime),
      time: formatTime(e.StartTime),
    }))
})

const currentMonth = computed(() => {
  const months = [
    "Januar", "Februar", "März", "April", "Mai", "Juni",
    "Juli", "August", "September", "Oktober", "November", "Dezember",
  ]
  return months[new Date().getMonth()]
})

const todayOpeningInfo = computed(() => {
  const now = new Date()

  // Zwischen 0:00 und 3:00 Uhr: prüfen ob gestern ein Event war (noch geöffnet)
  if (now.getHours() < 3) {
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)
    const yesterdayEnd = new Date(yesterday)
    yesterdayEnd.setDate(yesterdayEnd.getDate() + 1)

    const yesterdayEvent = allEvents.value.find((event) => {
      const d = new Date(event.StartTime)
      return d >= yesterday && d < yesterdayEnd
    })
    if (yesterdayEvent) return "Jetzt geöffnet"
  }

  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const todayEvent = allEvents.value.find((event) => {
    const d = new Date(event.StartTime)
    return d >= today && d < tomorrow
  })

  if (!todayEvent) return "Heute geschlossen"

  const eventStart = new Date(todayEvent.StartTime)

  // Event hat bereits begonnen → jetzt geöffnet
  if (now >= eventStart) return "Jetzt geöffnet"

  // Event steht noch bevor → Öffnungszeit anzeigen
  const hh = String(eventStart.getHours()).padStart(2, "0")
  const mm = String(eventStart.getMinutes()).padStart(2, "0")
  return `Heute geöffnet ab ${hh}:${mm}`
})

const isOpen = computed(() => todayOpeningInfo.value === "Jetzt geöffnet")

// Dynamische Maps URL basierend auf Device und OS
const googleMapsUrl = 'https://maps.app.goo.gl/H2w1sCkS5DC5bTx37?g_st=ic'
const appleMapsUrl = 'https://maps.apple.com/place?q=StuK+Leipzig&ll=51.3396,12.3731&address=Kochstra%C3%9Fe+132,+04277+Leipzig'

// Starte mit Google Maps (gleich wie Server), Update nach Hydration
const mapsUrl = ref(googleMapsUrl)

// Helper functions for formatting (used by specialEvents)
function formatDate(dateString: string) {
  const date = new Date(dateString)
  const weekdays = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
  const weekday = weekdays[date.getDay()]
  const day = date.getDate()
  const month = date.getMonth() + 1
  return `${weekday} ${day}.${month}.`
}

function formatTime(dateString: string) {
  const date = new Date(dateString)
  const hh = String(date.getHours()).padStart(2, "0")
  const mm = String(date.getMinutes()).padStart(2, "0")
  return `ab ${hh}:${mm} Uhr`
}

// --- Head ---
useHead({
  title: `StuK – ${currentMonth.value} im StuK`,
})
</script>

<style>
/* Page-specific styles */
.dot.open {
  background: #22c55e;
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.65);
}

.hero {
  padding: 70px 0 56px
}

@media (max-width: 640px) {
  .hero {
    padding: 32px 0 0px;
  }

  .panel h2 {
    font-size: 1.25rem;
  }

  .panel .btn {
    font-size: 0.8rem;
    padding: 0.45rem 0.75rem;
    min-height: 36px;
  }

  .panel .badge {
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
  }
}

.hero-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: 1.2fr 1fr
}

@media (max-width: 1000px) {
  .hero-grid {
    grid-template-columns: 1fr
  }
}

.upcoming {
  position: relative;
  background: linear-gradient(135deg, rgba(188, 43, 37, .15), rgba(36, 58, 92, .15));
  border: 2px solid rgba(188, 43, 37, .4);
  border-radius: var(--radius);
  padding: 20px
}

.upcoming h3 {
  margin: 0 0 12px;
  color: var(--brand-red);
  letter-spacing: .4px;
  font-size: 1.1rem
}

.upcoming ul {
  list-style: none;
  padding: 0;
  margin: 0
}

.upcoming li {
  margin: 10px 0;
  font-weight: 600;
  color: var(--text)
}

.upcoming small {
  display: block;
  font-weight: 400;
  color: var(--muted);
  margin-top: 2px
}

/* Hero Banner */
.hero-banner {
  position: relative;
  width: 100%;
  height: 55vh;
  min-height: 300px;
  overflow: hidden;
  padding: 0;
  margin-top: -72px
}

.slideshow {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
  z-index: 1;
}

.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-position: center;
  background-size: cover;
  opacity: 0;
  transition: opacity 1.5s ease-in-out;
  -webkit-mask-image: linear-gradient(to bottom, black 70%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 70%, transparent 100%)
}

.slide.active {
  opacity: 1;
  z-index: 1
}

.slide::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgba(10, 11, 13, 0.65) 0%, rgba(10, 11, 13, 0.5) 40%, rgba(10, 11, 13, 0.2) 70%, transparent 100%)
}

.hero-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 60px;
  max-width: 1200px;
  width: 90%
}

.hero-content,
.scroll-indicator {
  z-index: 10;
  position: relative;
}

.hero-logo-large {
  width: 350px;
  height: 350px;
  transition: all 0.4s ease-out
}

.hero-logo-large img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 8px 24px rgba(188, 43, 37, 0.4))
}

.hero-text {
  color: #fff;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.6)
}

.hero-text h1 {
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 2px
}

.hero-text p {
  font-size: 1.5rem;
  margin: 16px 0 0;
  font-weight: 1000;
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  animation: bounce 2s infinite;
  cursor: pointer
}

.scroll-indicator svg {
  width: 32px;
  height: 32px;
  stroke: #fff;
  opacity: 0.7
}

@keyframes bounce {

  0%,
  100% {
    transform: translateX(-50%) translateY(0)
  }

  50% {
    transform: translateX(-50%) translateY(10px)
  }
}

@media (max-width: 640px) {
  .scroll-indicator {
    display: none
  }
}

@media (max-width: 1000px) {
  .hero-content {
    flex-direction: column;
    gap: 30px;
    padding: 20px
  }

  .hero-logo-large {
    width: 200px;
    height: 200px
  }

  .hero-text h1 {
    font-size: 2.2rem
  }

  .hero-text p {
    font-size: 0.9rem
  }
}
</style>
