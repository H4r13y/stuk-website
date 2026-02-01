<template>
  <div class="has-bottom-nav">
    <div class="bg">
      <div class="confetti"></div>
    </div>

    <!-- Header -->
    <header class="site-header">
      <div class="container nav">
        <NuxtLink to="/" class="logo" aria-label="Zur Startseite">
          <img src="/logo.svg" alt="StuK Leipzig Logo">
        </NuxtLink>
        <nav class="primary" aria-label="Navigation">
          <NuxtLink to="/ueber">Über</NuxtLink>
          <NuxtLink to="/kontakt">Kontakt</NuxtLink>
        </nav>
        <div class="spacer"></div>
        <a href="https://stuk-kalender.de/login?redirect=Lw%3D%3D" class="btn ghost" target="_blank"
          rel="noopener">Login</a>
        <NuxtLink to="/mitmachen" class="btn">Mitmachen</NuxtLink>
      </div>
    </header>

    <main>
      <!-- Hero Banner -->
      <section class="hero-banner">
        <!-- <div class="slideshow">
          <div
            v-for="(image, index) in slideImages"
            :key="index"
            class="slide"
            :class="{ active: index === currentSlide }"
            :style="{ backgroundImage: `url(${image})` }"
          ></div>
        </div> -->

        <div class="hero-content">
          <div class="hero-logo-large">
            <img src="/logo.svg" alt="StuK Leipzig Logo">
          </div>
          <div class="hero-text">
            <p>where everybody knows your name</p>
          </div>
        </div>

        <div class="scroll-indicator">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </section>

      <!-- Hero Section -->
      <section class="hero">
        <div class="container hero-grid">
          <article class="panel">
            <h1>{{ currentMonth }} im StuK</h1>
            <p class="sub">Konzerte, Kleinkunst, Quiz & Clubnächte – schnapp dir deine Woche.</p>
            <div class="badge"><span class="dot"></span> {{ todayOpeningInfo }}</div>
            <div style="margin-top:14px; display:flex; gap:12px; flex-wrap:wrap">
              <a class="btn" href="#events">Programm ansehen</a>
              <a class="btn ghost" href="https://maps.app.goo.gl/" target="_blank" rel="noopener">Anfahrt</a>
            </div>
          </article>
          <aside class="panel upcoming" aria-labelledby="upcoming-title">
            <h3 id="upcoming-title">Special Events</h3>
            <ul id="specialEventsList">
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
      <section class="container" id="events">
        <header class="controls" aria-label="Event-Filter">
          <!-- <div class="search" role="search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 21l-4.2-4.2" stroke="#cbd0d7" stroke-width="2" stroke-linecap="round"/>
              <circle cx="11" cy="11" r="7" stroke="#cbd0d7" stroke-width="2"/>
            </svg>
            <input v-model="searchQuery" placeholder="Suche im Programm" aria-label="Suche im Programm">
          </div> -->
          <div class="chips" role="group" aria-label="Formate">
            <button v-for="tag in filterTags" :key="tag" class="chip" :data-active="activeFilters.includes(tag)"
              @click="toggleFilter(tag)">
              {{ tag }}
            </button>
            <button class="chip" @click="resetFilters">Filter löschen</button>
          </div>
        </header>

        <div class="events" aria-live="polite">
          <!-- Loading State -->
          <p v-if="loading" style="color: var(--muted); grid-column: 1/-1; text-align: center;">
            Lade Events...
          </p>

          <!-- Event Cards from Strapi -->
          <article v-for="(event, index) in filteredEvents" :key="event.id" class="card" :data-variant="index % 4">
            <div class="date-badge">
              <b>{{ formatDate(event.start) }}</b>
              <small>{{ formatTime(event.start) }}</small>
            </div>
            <div class="body">
              <h3>{{ event.title }}</h3>
              <p class="sub" style="margin:0">{{ event.description || 'Mehr Infos folgen bald!' }}</p>
            </div>
          </article>

          <!-- Empty State -->
          <p v-if="!loading && filteredEvents.length === 0"
            style="color: var(--muted); grid-column: 1/-1; text-align: center;">
            Keine Events gefunden. Bitte später noch einmal schauen!
          </p>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer>
      <div class="container meta-grid">
        <div>
          <strong>StuK Leipzig</strong>
          <p class="sub">Party mit Prinzipien - Kein Platz für Hass.</p>
        </div>
        <div>
          <strong>Kontakt</strong>
          <p class="sub">
            kontakt@stuk-leipzig.de<br>
            Nürnberger Straße 42,<br>04103 Leipzig
          </p>
        </div>
        <div>
          <strong>Rechtliches</strong>
          <p class="sub">
            <NuxtLink to="/impressum">Impressum</NuxtLink> ·
            <NuxtLink to="/datenschutz">Datenschutz</NuxtLink>
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Slideshow images
const slideImages = ref([
  '/bilder/WhatsApp Image 2025-10-16 at 11.28.54.jpeg',
  '/bilder/WhatsApp Image 2025-10-16 at 11.28.54 (1).jpeg',
  '/bilder/WhatsApp Image 2025-10-16 at 11.28.58.jpeg',
  '/bilder/WhatsApp Image 2025-10-16 at 11.28.58 (1).jpeg',
  '/bilder/WhatsApp Image 2025-10-16 at 11.28.58 (2).jpeg',
  '/bilder/WhatsApp Image 2025-10-16 at 11.28.59.jpeg',
  '/bilder/WhatsApp Image 2025-10-16 at 11.28.59 (1).jpeg',
  '/bilder/WhatsApp Image 2025-10-16 at 11.28.59 (2).jpeg',
  '/bilder/WhatsApp Image 2025-10-16 at 11.29.00.jpeg',
  '/bilder/WhatsApp Image 2025-10-16 at 11.29.03.jpeg',
  '/bilder/WhatsApp Image 2025-10-16 at 11.29.04.jpeg',
  '/bilder/WhatsApp Image 2025-10-16 at 11.29.04 (1).jpeg',
  '/bilder/WhatsApp Image 2025-10-16 at 11.29.04 (2).jpeg'
])

const currentSlide = ref(0)
const searchQuery = ref('')
const activeFilters = ref<string[]>([])
const loading = ref(false)
const specialEvents = ref<any[]>([])
const allEvents = ref<any[]>([])
const filterTags = ref<string[]>([])

// Computed property for filtered events
const filteredEvents = computed(() => {
  if (activeFilters.value.length === 0) {
    return allEvents.value
  }

  return allEvents.value.filter(event => {
    if (!event.labels || event.labels.length === 0) return false

    // Check if event has any of the active filter labels
    return event.labels.some((label: any) =>
      activeFilters.value.includes(label.name)
    )
  })
})

const currentMonth = computed(() => {
  const months = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
  return months[new Date().getMonth()]
})

// Get today's opening time from first event
const todayOpeningInfo = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // Find first event today
  const todayEvent = allEvents.value.find(event => {
    const eventDate = new Date(event.start)
    return eventDate >= today && eventDate < tomorrow
  })

  if (!todayEvent) {
    return 'Heute geschlossen'
  }

  const eventDate = new Date(todayEvent.start)
  const hours = eventDate.getHours().toString().padStart(2, '0')
  const minutes = eventDate.getMinutes().toString().padStart(2, '0')

  return `Heute geöffnet ab ${hours}:${minutes}`
})

// Format helpers
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const weekdays = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
  const weekday = weekdays[date.getDay()]
  const day = date.getDate()
  const month = date.getMonth() + 1
  return `${weekday} ${day}.${month}.`
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `ab ${hours}:${minutes} Uhr`
}

// Fetch labels from Strapi
const fetchLabels = async () => {
  try {
    const strapiUrl = process.client
      ? 'http://localhost:1337' // Browser
      : (process.env.STRAPI_URL || 'http://strapi:1337') // Server/Docker

    const response = await $fetch(`${strapiUrl}/api/labels`)
    if (response && response.data) {
      // Extract label names and sort them
      filterTags.value = response.data
        .map((label: any) => label.name)
        .sort()
      console.log('Loaded labels:', filterTags.value)
    }
  } catch (error) {
    console.error('Error fetching labels:', error)
  }
}

// Fetch events from Strapi with labels populated
const fetchEvents = async () => {
  loading.value = true
  try {
    // Use env variable or fallback to localhost
    const strapiUrl = process.client
      ? 'http://localhost:1337' // Browser
      : (process.env.STRAPI_URL || 'http://strapi:1337') // Server/Docker

    const now = new Date().toISOString()
    const in31Days = new Date(Date.now() + 31 * 24 * 60 * 60 * 1000).toISOString()

    const response = await $fetch(
      `${strapiUrl}/api/events?` +
      `pagination[pageSize]=100&` +
      `sort=start:asc&` +
      `populate=labels&` +
      `filters[start][$gte]=${now}&` +
      `filters[start][$lte]=${in31Days}`
    )
    if (response && response.data) {
      allEvents.value = response.data
      specialEvents.value = response.data
        .filter((event: any) => event.special_event === true)
        .map((event: any) => ({
          id: event.id,
          title: event.title,
          date: formatDate(event.start),
          time: formatTime(event.start)
        }))
      console.log('Loaded events:', response.data.length)
    }
  } catch (error) {
    console.error('Error fetching events:', error)
  } finally {
    loading.value = false
  }
}

// Slideshow logic
let slideInterval: ReturnType<typeof setInterval>
onMounted(async () => {
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slideImages.value.length
  }, 4000)

  // Fetch labels and events from Strapi
  await fetchLabels()
  await fetchEvents()
})

const toggleFilter = (tag: string) => {
  const index = activeFilters.value.indexOf(tag)
  if (index > -1) {
    activeFilters.value.splice(index, 1)
  } else {
    activeFilters.value.push(tag)
  }
}

const resetFilters = () => {
  activeFilters.value = []
  searchQuery.value = ''
}
</script>

<style>
/* Page-specific styles */
.hero {
  padding: 70px 0 56px
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
  position: relative
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
  transition: opacity 1.5s ease-in-out
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
  font-weight: 300;
  opacity: 0.95
}

.scroll-indicator {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  animation: bounce 2s infinite
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
    font-size: 1.1rem
  }
}

/* Date Badge Styles */
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
</style>
