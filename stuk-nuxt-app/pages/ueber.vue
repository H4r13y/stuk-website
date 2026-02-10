<template>
  <main>
    <section class="container glass-strong">
      <h1>Über den StuK</h1>
      <p class="sub">Studentischer Klub seit den 90ern – Kultur, Bar & Gemeinschaft.</p>

      <div v-if="ueberUnsHtml" class="markdown-content" v-html="ueberUnsHtml"></div>
      <!-- <p v-else style="margin-top:24px; color:var(--text); line-height:1.7">
        Der StuK Leipzig ist mehr als nur ein Club – er ist ein selbstverwalteter Freiraum von Studierenden für Studierende. Seit 1997 am Bayerischen Bahnhof beheimatet,
        leben wir Basisdemokratie, Ehrenamt und Gemeinschaft. Hier gibt es keine kommerziellen Interessen, keine Türsteher mit Attitüde, sondern günstige Getränke,
        vielfältige Events und Menschen, die gemeinsam anpacken. Ob an der Bar, hinter der Technik, beim Awareness-Team oder im Clubrat – jede:r kann mitmachen,
        mitgestalten und Teil von etwas Besonderem werden. Denn der StuK gehört nicht einer Firma, sondern uns allen.
      </p> -->
    </section>

    <section class="container">
      <h2>Unser Klubrat</h2>
      <p class="sub" style="margin-bottom:24px">{{ klubratCount }} engagierte Menschen, die den StuK mit Leidenschaft gestalten</p>

      <div v-if="klubratPending" class="loading">Lade Klubrat...</div>
      <div v-else-if="klubratError" class="error">Fehler beim Laden der Klubratsmitglieder</div>
      <div v-else class="council-grid">
        <div v-for="member in klubrats" :key="member.id" class="council-card" @click="openModal(member)">
          <div class="avatar" :style="getAvatarStyle(member)"></div>
          <div class="info">
            <h3>{{ member.Name }}</h3>
            <p class="role">{{ member.Posten }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="container">
      <h2>Zu uns gehört noch viel mehr</h2>
      <p class="sub" style="margin-bottom:24px">Über 50 aktive Mitglieder gestalten den StuK – an der Bar, am Einlass, in der Technik und überall dazwischen</p>

      <div class="assembly-photo" style="background-image:url('/bilder/WhatsApp Image 2025-10-16 at 11.29.00.jpeg')">
        <div class="assembly-overlay">
          <p>Unsere letzte Vollversammlung – gemeinsam gestalten wir den Club</p>
        </div>
      </div>

      <div v-if="collagePending" class="loading">Lade Galerie...</div>
      <div v-else-if="collageError" class="error">Fehler beim Laden der Galerie</div>
      <div v-else class="member-collage">
        <div
          v-for="(image, index) in galleryImages"
          :key="index"
          class="collage-item"
          :class="getCollageItemClass(index)"
          :style="{ backgroundImage: `url('${image.previewSrc}')` }"
          :title="image.caption"
          @click="openGallery(index)"
        ></div>
      </div>
    </section>

    <div v-if="timelineEvents.length > 0" id="timeline-1" class="timeline-container">
      <div class="timeline-bg-layer" :class="{ active: activeTimelineBg === 1 }"></div>
      <div class="timeline-bg-layer" :class="{ active: activeTimelineBg === 2 }"></div>
      <div class="timeline-header">
        <h2 class="timeline-header__title">Unsere Geschichte</h2>
        <h3 class="timeline-header__subtitle">VON DER GRÜNDUNG BIS HEUTE</h3>
      </div>
      <div class="timeline" ref="timelineRef">
        <div
          v-for="(event, index) in timelineEvents"
          :key="index"
          class="timeline-item"
          :class="{ 'timeline-item--active': activeTimelineIndex === index }"
          :data-text="event.label"
        >
          <div class="timeline__content">
            <img class="timeline__img" :src="event.image" :alt="event.label" />
            <h2 class="timeline__content-title">{{ event.year }}</h2>
            <p class="timeline__content-desc">{{ event.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- Modal for council member details -->
  <div v-if="selectedMember" class="council-modal active" @click.self="closeModal">
    <div class="council-modal-content">
      <button class="close-modal" @click="closeModal">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <!-- large background image in modal header -->
      <div class="modal-header" :style="getHeaderStyle(selectedMember)"></div>

      <div class="modal-body">
        <!-- medium in modal -->
        <img class="modal-avatar-small" :src="getImageUrl(selectedMember.Profilbild, 'medium')" :alt="selectedMember.Name" />
        <h2>{{ selectedMember.Name }}</h2>
        <p class="modal-role">{{ selectedMember.Posten }}</p>
        <p class="bio">{{ selectedMember.Kurzbeschreibung }}</p>
        <div class="details">
          <div v-for="merkmal in selectedMember.KR_Merkmale" :key="merkmal.id" class="detail-item">
            <strong>{{ merkmal.Titel }}</strong>
            <span>{{ merkmal.Merkmal }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Gallery Lightbox -->
  <div v-if="galleryActive" class="gallery-lightbox active" @click.self="closeGallery">
    <button class="gallery-close-btn" @click="closeGallery">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>

    <button class="gallery-nav-btn prev" @click="navigateGallery(-1)">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>

    <button class="gallery-nav-btn next" @click="navigateGallery(1)">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>

    <div class="gallery-lightbox-content">
      <img
        class="gallery-lightbox-image"
        :src="galleryImages[currentGalleryIndex]?.fullSrc"
        :alt="galleryImages[currentGalleryIndex]?.alt"
        loading="eager"
        decoding="async"
      />
      <div v-if="galleryImages[currentGalleryIndex]?.caption" class="gallery-lightbox-caption">
        <p>{{ galleryImages[currentGalleryIndex].caption }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// Types
type StrapiMedia = {
  id: number
  url: string
  alternativeText?: string
  caption?: string
  formats?: {
    thumbnail?: { url: string }
    small?: { url: string }
    medium?: { url: string }
    large?: { url: string }
  }
}

type KRMerkmal = {
  id: number
  Titel: string
  Merkmal: string
}

type Klubrat = {
  id: number
  documentId: string
  Name: string
  Posten: string
  Kurzbeschreibung: string
  Profilbild: StrapiMedia | null
  KR_Merkmale: KRMerkmal[]
}

type UeberCollage = {
  id: number
  Bilder: StrapiMedia[]
}

type StrapiList<T> = { data: T[] }
type StrapiSingle<T> = { data: T }

// SEO
useHead({
  title: 'StuK – Über uns',
  meta: [{ name: 'description', content: 'Erfahre mehr über den StuK Leipzig - selbstverwaltet, studentisch und mit Herz seit 1997' }],
})

// Fetch data
const config = useRuntimeConfig()
const strapiUrl = config.public.strapiUrl

// Klubrat
const { data: klubratsRes, pending: klubratPending, error: klubratError } = await useFetch<StrapiList<Klubrat>>(
  `${strapiUrl}/api/klubrats?populate=*`,
  {
    lazy: true,
    server: false,
  }
)

const klubrats = computed(() => klubratsRes.value?.data || [])
const klubratCount = computed(() => klubrats.value.length)

// Über-Collage
const { data: collageRes, pending: collagePending, error: collageError } = await useFetch<StrapiSingle<UeberCollage>>(
  `${strapiUrl}/api/ueber-collage?populate=*`,
  {
    lazy: true,
    server: false,
  }
)

// Über uns Text
type UeberUnsData = {
  id: number
  Inhalt: string
}

const { data: ueberUnsRes, pending: ueberUnsPending, error: ueberUnsError } = await useFetch<StrapiSingle<UeberUnsData>>(
  `${strapiUrl}/api/ueber-uns`,
  {
    lazy: true,
    server: false,
  }
)

// Geschichte / Timeline
type GeschichteEintrag = {
  id: number
  Kurztext: string
  Jahreszahl: string
  Beschreibung?: string | null
  Bild?: StrapiMedia | null
}

type GeschichteData = {
  id: number
  Geschichteneintrag: GeschichteEintrag[]
}

const { data: geschichteRes } = await useFetch<StrapiSingle<GeschichteData>>(
  `${strapiUrl}/api/geschichte`,
  {
    query: {
      'populate[Geschichteneintrag][populate]': 'Bild',
    },
    server: true,
  }
)

// Modal state
const selectedMember = ref<Klubrat | null>(null)
function openModal(member: Klubrat) {
  selectedMember.value = member
}
function closeModal() {
  selectedMember.value = null
}

// Responsive image helper
type MediaSize = 'thumbnail' | 'small' | 'medium' | 'large' | 'original'

function getImageUrl(media: StrapiMedia | null, size: MediaSize = 'original'): string {
  const fallback = '/bilder/WhatsApp Image 2025-10-16 at 11.28.54.jpeg'
  if (!media) return fallback

  if (size === 'original') {
    return `${strapiUrl}${media.url}`
  }

  const url = media.formats?.[size]?.url || media.url
  return `${strapiUrl}${url}`
}

function getAvatarStyle(member: Klubrat) {
  // grid: small
  const imageUrl = getImageUrl(member.Profilbild, 'small')
  return {
    backgroundImage: `url('${imageUrl}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}

function getHeaderStyle(member: Klubrat) {
  // modal header: large
  const imageUrl = getImageUrl(member.Profilbild, 'large')
  return {
    backgroundImage: `url('${imageUrl}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
}

// Markdown-Rendering für Über-uns Text
const ueberUnsHtml = ref('')

watch(() => ueberUnsRes.value?.data?.Inhalt, async (content) => {
  if (content) {
    const { marked } = await import('marked')
    ueberUnsHtml.value = marked.parse(content) as string
  }
}, { immediate: true })

// Timeline data - nur aus Strapi
const timelineEvents = computed(() => {
  if (!geschichteRes.value?.data?.Geschichteneintrag) {
    return []
  }

  const eintraege = geschichteRes.value.data.Geschichteneintrag

  // Sortiere nach Jahreszahl (aufsteigend)
  return eintraege
    .slice()
    .sort((a: GeschichteEintrag, b: GeschichteEintrag) => parseInt(a.Jahreszahl) - parseInt(b.Jahreszahl))
    .map((eintrag: GeschichteEintrag) => ({
      year: eintrag.Jahreszahl,
      label: eintrag.Kurztext.toUpperCase(),
      image: eintrag.Bild ? getImageUrl(eintrag.Bild, 'medium') : '/bilder/WhatsApp Image 2025-10-16 at 11.28.54.jpeg',
      description: eintrag.Beschreibung || eintrag.Kurztext,
    }))
})

// Timeline scroll functionality
const timelineRef = ref<HTMLElement | null>(null)
const activeTimelineIndex = ref(0)
const activeTimelineBg = ref(1)
let currentBgImage = ''

function checkTimelineItems() {
  if (!timelineRef.value) return

  const items = timelineRef.value.querySelectorAll('.timeline-item')
  const viewportMiddle = window.innerHeight / 2

  items.forEach((item, index) => {
    const rect = item.getBoundingClientRect()
    const itemMiddle = rect.top + rect.height / 2

    if (itemMiddle > 0 && itemMiddle < window.innerHeight) {
      const distanceFromCenter = Math.abs(itemMiddle - viewportMiddle)
      if (distanceFromCenter < rect.height) {
        activeTimelineIndex.value = index
        changeTimelineBackground(timelineEvents.value[index].image)
      }
    }
  })
}

function changeTimelineBackground(newImage: string) {
  if (newImage === currentBgImage) return

  const bgLayer1 = document.querySelector('#timeline-1 .timeline-bg-layer:nth-child(1)') as HTMLElement
  const bgLayer2 = document.querySelector('#timeline-1 .timeline-bg-layer:nth-child(2)') as HTMLElement
  if (!bgLayer1 || !bgLayer2) return

  const targetLayer = activeTimelineBg.value === 1 ? bgLayer2 : bgLayer1
  targetLayer.style.backgroundImage = `url('${newImage}')`
  activeTimelineBg.value = activeTimelineBg.value === 1 ? 2 : 1
  currentBgImage = newImage
}

// Gallery images: preview vs full
const galleryImages = computed(() => {
  const images = collageRes.value?.data?.Bilder || []
  return images.map((img: StrapiMedia) => ({
    previewSrc: getImageUrl(img, 'small'),     // -> /uploads/small_...
    fullSrc: getImageUrl(img, 'original'),     // -> /uploads/DSC_06805....
    alt: img.alternativeText || 'StuK Galeriebild',
    caption: img.caption || '',
  }))
})

// Collage layout rules
const tallIndices = [0, 5, 11]
const wideIndices = [3, 8]
function getCollageItemClass(index: number) {
  return {
    tall: tallIndices.includes(index),
    wide: wideIndices.includes(index),
  }
}

// Lightbox state
const galleryActive = ref(false)
const currentGalleryIndex = ref(0)

function prefetchImage(url?: string) {
  if (!url) return
  const img = new Image()
  img.src = url
}

function openGallery(index: number) {
  currentGalleryIndex.value = index
  galleryActive.value = true

  // optional: prefetch next/prev full-res
  if (galleryImages.value.length > 1) {
    const next = (index + 1) % galleryImages.value.length
    const prev = (index - 1 + galleryImages.value.length) % galleryImages.value.length
    prefetchImage(galleryImages.value[next]?.fullSrc)
    prefetchImage(galleryImages.value[prev]?.fullSrc)
  }
}

function closeGallery() {
  galleryActive.value = false
}

function navigateGallery(direction: number) {
  currentGalleryIndex.value += direction

  if (currentGalleryIndex.value < 0) {
    currentGalleryIndex.value = galleryImages.value.length - 1
  } else if (currentGalleryIndex.value >= galleryImages.value.length) {
    currentGalleryIndex.value = 0
  }

  // optional: prefetch next/prev full-res
  if (galleryImages.value.length > 1) {
    const idx = currentGalleryIndex.value
    const next = (idx + 1) % galleryImages.value.length
    const prev = (idx - 1 + galleryImages.value.length) % galleryImages.value.length
    prefetchImage(galleryImages.value[next]?.fullSrc)
    prefetchImage(galleryImages.value[prev]?.fullSrc)
  }
}

// Keyboard events
function handleKeydown(e: KeyboardEvent) {
  if (selectedMember.value && e.key === 'Escape') closeModal()

  if (galleryActive.value) {
    if (e.key === 'Escape') closeGallery()
    else if (e.key === 'ArrowLeft') navigateGallery(-1)
    else if (e.key === 'ArrowRight') navigateGallery(1)
  }
}

onMounted(() => {
  window.addEventListener('scroll', checkTimelineItems)
  window.addEventListener('resize', checkTimelineItems)
  window.addEventListener('keydown', handleKeydown)
  setTimeout(checkTimelineItems, 100)

  // Initialize first timeline bg
  const bgLayer1 = document.querySelector('#timeline-1 .timeline-bg-layer:nth-child(1)') as HTMLElement
  if (bgLayer1 && timelineEvents.value.length > 0) {
    bgLayer1.style.backgroundImage = `url('${timelineEvents.value[0].image}')`
    currentBgImage = timelineEvents.value[0].image
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkTimelineItems)
  window.removeEventListener('resize', checkTimelineItems)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.glass-strong {
  background: rgba(12, 13, 15, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: var(--radius);
  backdrop-filter: blur(14px) saturate(1.2);
  box-shadow: var(--shadow);
  padding: 20px 24px;
}

/* Council Grid */
.council-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(5, 1fr);
  margin: 32px 0;
}

@media (max-width: 1200px) {
  .council-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 900px) {
  .council-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 640px) {
  .council-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
}

.council-card {
  background: linear-gradient(180deg, #111215, #0f1012);
  border: 1px solid #ffffff14;
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.council-card:hover {
  transform: translateY(-6px);
  border-color: rgba(188, 43, 37, 0.4);
  box-shadow: 0 12px 32px rgba(188, 43, 37, 0.2);
}

.council-card .avatar {
  width: 100%;
  aspect-ratio: 1;
  background: radial-gradient(circle at 30% 20%, rgba(188, 43, 37, 0.2), transparent 60%),
    radial-gradient(circle at 70% 80%, rgba(36, 58, 92, 0.2), transparent 60%), #0f1114;
  background-size: cover;
  background-position: center;
  position: relative;
}

.council-card .avatar::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 60%, rgba(15, 16, 18, 0.9) 100%);
}

.council-card .info {
  padding: 12px;
  text-align: center;
}

.council-card h3 {
  font-size: 0.95rem;
  margin: 0 0 4px;
  color: var(--text);
}

.council-card .role {
  font-size: 0.8rem;
  color: var(--muted);
  margin: 0;
}

/* Council Modal */
.council-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.council-modal-content {
  background: linear-gradient(180deg, #111215, #0f1012);
  border: 1px solid #ffffff14;
  border-radius: var(--radius);
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  position: relative;
  height: 300px;
  background: radial-gradient(circle at 30% 20%, rgba(188, 43, 37, 0.2), transparent 60%),
    radial-gradient(circle at 70% 80%, rgba(36, 58, 92, 0.2), transparent 60%), #0f1114;
  background-size: cover;
  background-position: center;
}

.modal-header::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(15, 16, 18, 1) 100%);
}

.close-modal {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(10, 11, 13, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: all 0.2s;
}

.close-modal:hover {
  background: rgba(188, 43, 37, 0.9);
  transform: scale(1.1);
}

.modal-body {
  padding: 32px;
}

.modal-avatar-small {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid rgba(188, 43, 37, 0.4);
  margin: -80px auto 20px;
  display: block;
  position: relative;
  z-index: 5;
  object-fit: cover;
}

.modal-body h2 {
  text-align: center;
  margin: 0 0 8px;
  color: var(--text);
}

.modal-body .modal-role {
  text-align: center;
  color: var(--brand-red);
  font-weight: 600;
  margin-bottom: 24px;
}

.modal-body .bio {
  color: var(--muted);
  line-height: 1.7;
  margin-bottom: 20px;
}

.modal-body .details {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 24px;
}

.detail-item {
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.detail-item strong {
  display: block;
  color: var(--text);
  margin-bottom: 4px;
  font-size: 0.85rem;
}

.detail-item span {
  color: var(--muted);
  font-size: 0.9rem;
}

/* Assembly Photo */
.assembly-photo {
  position: relative;
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center;
  border-radius: var(--radius);
  overflow: hidden;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.assembly-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(10, 11, 13, 0.95) 0%, rgba(10, 11, 13, 0.8) 50%, transparent 100%);
  padding: 32px 24px 24px;
  color: var(--text);
}

.assembly-overlay p {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 500;
  text-align: center;
}

/* Member Collage */
.member-collage {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  grid-auto-flow: dense;
}

.collage-item {
  height: 200px;
  background-size: cover;
  background-position: center;
  border-radius: var(--radius);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s;
  cursor: pointer;
}

.collage-item:hover {
  transform: scale(1.05);
  border-color: rgba(188, 43, 37, 0.4);
  box-shadow: 0 8px 24px rgba(188, 43, 37, 0.3);
  z-index: 10;
}

.collage-item.wide {
  grid-column: span 2;
}

.collage-item.tall {
  grid-row: span 2;
  height: 412px;
}

@media (max-width: 640px) {
  .collage-item.wide {
    grid-column: span 1;
  }
  .collage-item.tall {
    grid-row: span 1;
    height: 200px;
  }
  .assembly-photo {
    height: 300px;
  }
}

/* Gallery Lightbox */
.gallery-lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.92);
  backdrop-filter: blur(12px);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.gallery-lightbox-content {
  position: relative;
  max-width: 1200px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gallery-lightbox-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: var(--radius);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.gallery-lightbox-caption {
  background: linear-gradient(180deg, #111215, #0f1012);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--radius);
  padding: 20px 24px;
  margin-top: 20px;
  max-width: 600px;
  text-align: center;
}

.gallery-lightbox-caption p {
  margin: 0;
  color: var(--text);
  line-height: 1.6;
}

.gallery-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(10, 11, 13, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;
}

.gallery-nav-btn:hover {
  background: rgba(188, 43, 37, 0.9);
  transform: translateY(-50%) scale(1.1);
}

.gallery-nav-btn.prev {
  left: 20px;
}

.gallery-nav-btn.next {
  right: 20px;
}

.gallery-close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(10, 11, 13, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;
}

.gallery-close-btn:hover {
  background: rgba(188, 43, 37, 0.9);
  transform: scale(1.1);
}

@media (max-width: 640px) {
  .gallery-nav-btn {
    width: 40px;
    height: 40px;
  }
  .gallery-nav-btn.prev {
    left: 10px;
  }
  .gallery-nav-btn.next {
    right: 10px;
  }
  .gallery-close-btn {
    top: 10px;
    right: 10px;
    width: 40px;
    height: 40px;
  }
  .gallery-lightbox-caption {
    padding: 16px;
    font-size: 0.9rem;
  }
}

/* Timeline */
.timeline {
  display: flex;
  margin: 0 auto;
  flex-wrap: wrap;
  flex-direction: column;
  max-width: 700px;
  position: relative;
}

.timeline:before {
  position: absolute;
  left: 50%;
  width: 2px;
  height: 100%;
  margin-left: -1px;
  content: '';
  background: rgba(188, 43, 37, 0.3);
}

.timeline__content-title {
  font-weight: normal;
  font-size: 66px;
  margin: -10px 0 0 0;
  transition: 0.4s;
  padding: 0 10px;
  box-sizing: border-box;
  color: var(--brand-red);
  font-family: 'Pathway Gothic One', sans-serif;
}

.timeline__content-desc {
  margin: 0;
  font-size: 15px;
  box-sizing: border-box;
  color: rgba(255, 255, 255, 0.7);
  font-weight: normal;
  line-height: 25px;
}

.timeline-item {
  padding: 40px 0;
  opacity: 0.3;
  filter: blur(2px);
  transition: 0.5s;
  box-sizing: border-box;
  width: calc(50% - 40px);
  display: flex;
  position: relative;
  transform: translateY(-80px);
}

.timeline-item:before {
  content: attr(data-text);
  letter-spacing: 3px;
  width: 100%;
  position: absolute;
  color: rgba(188, 43, 37, 0.5);
  font-size: 13px;
  font-family: 'Pathway Gothic One', sans-serif;
  border-left: 2px solid rgba(188, 43, 37, 0.5);
  top: 70%;
  margin-top: -5px;
  padding-left: 15px;
  opacity: 0;
  right: calc(-100% - 56px);
}

.timeline-item:nth-child(even) {
  align-self: flex-end;
}

.timeline-item:nth-child(even):before {
  right: auto;
  text-align: right;
  left: calc(-100% - 56px);
  padding-left: 0;
  border-left: none;
  border-right: 2px solid rgba(188, 43, 37, 0.5);
  padding-right: 15px;
}

.timeline-item--active {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0px);
}

.timeline-item--active:before {
  top: 50%;
  transition: 0.3s all 0.2s;
  opacity: 1;
}

.timeline-item--active .timeline__content-title {
  margin: -50px 0 20px 0;
}

.timeline__img {
  max-width: 100%;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.4);
  border-radius: var(--radius);
}

.timeline-container {
  width: 100%;
  position: relative;
  padding: 80px 0;
  overflow: hidden;
}

.timeline-bg-layer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-attachment: fixed;
  background-size: cover;
  background-position: center;
  transition: opacity 1s ease-in-out;
  opacity: 0;
}

.timeline-bg-layer.active {
  opacity: 1;
}

.timeline-container:before {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(10, 11, 13, 0.85);
  content: '';
  z-index: 2;
}

.timeline {
  position: relative;
  z-index: 3;
}

.timeline-header {
  width: 100%;
  text-align: center;
  margin-bottom: 80px;
  position: relative;
}

.timeline-header__title {
  color: #fff;
  font-size: 46px;
  font-weight: normal;
  margin: 0;
}

.timeline-header__subtitle {
  color: rgba(188, 43, 37, 0.8);
  font-family: 'Pathway Gothic One', sans-serif;
  font-size: 16px;
  letter-spacing: 5px;
  margin: 10px 0 0 0;
  font-weight: normal;
}

@media only screen and (max-width: 767px) {
  .timeline-container {
    padding: 40px 0;
  }
  .timeline:before {
    left: 20px;
    width: 3px;
  }
  .timeline-item {
    align-self: baseline !important;
    width: 100%;
    padding: 0 20px 60px 50px;
    opacity: 1;
    filter: blur(0);
    transform: translateY(0);
  }
  .timeline-item:before {
    left: -5px !important;
    padding: 0 !important;
    top: 20px;
    text-align: left !important;
    width: auto;
    border: none !important;
    font-size: 11px;
    letter-spacing: 1px;
    opacity: 1;
  }
  .timeline-item:last-child {
    padding-bottom: 30px;
  }
  .timeline__img {
    max-width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 12px;
    margin-bottom: 12px;
  }
  .timeline__content {
    position: relative;
  }
  .timeline__content-title {
    font-size: 48px;
    margin: -10px 0 12px 0 !important;
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 10;
    background: transparent;
    padding: 0;
    border-radius: 0;
    backdrop-filter: none;
  }
  .timeline-item--active .timeline__content-title {
    margin: -10px 0 12px 0 !important;
  }
  .timeline__content-desc {
    font-size: 14px;
    line-height: 1.6;
    margin-top: 8px;
  }
  .timeline-header__title {
    font-size: 32px;
  }
  .timeline-header__subtitle {
    font-size: 13px;
    letter-spacing: 3px;
  }
  .timeline-header {
    margin-bottom: 40px;
  }
}

.loading,
.error {
  text-align: center;
  padding: 40px;
  color: var(--muted);
}

/* Markdown Content Styling */
.markdown-content {
  margin-top: 24px;
  color: var(--text);
  line-height: 1.7;
}

.markdown-content p {
  margin: 16px 0;
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3 {
  color: var(--text);
  margin-top: 24px;
  margin-bottom: 12px;
}

.markdown-content ul,
.markdown-content ol {
  margin: 16px 0;
  padding-left: 24px;
}

.markdown-content li {
  margin: 8px 0;
}

.markdown-content a {
  color: var(--brand-red);
  text-decoration: none;
  border-bottom: 1px solid rgba(188, 43, 37, 0.3);
  transition: border-color 0.2s;
}

.markdown-content a:hover {
  border-bottom-color: var(--brand-red);
}

.markdown-content strong {
  font-weight: 600;
  color: var(--text);
}

.markdown-content em {
  font-style: italic;
}

.markdown-content code {
  background: rgba(255, 255, 255, 0.08);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9em;
}

.markdown-content pre {
  background: rgba(255, 255, 255, 0.05);
  padding: 16px;
  border-radius: var(--radius);
  overflow-x: auto;
  margin: 16px 0;
}

.markdown-content pre code {
  background: none;
  padding: 0;
}

.markdown-content blockquote {
  border-left: 3px solid var(--brand-red);
  padding-left: 16px;
  margin: 16px 0;
  color: var(--muted);
  font-style: italic;
}
</style>
