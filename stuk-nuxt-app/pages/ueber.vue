<template>
  <main>
    <!-- Slim Hero -->
    <section class="ueber-hero">
      <div class="ueber-hero__glow"></div>
      <div class="ueber-hero__content">
        <img src="/logo.svg" alt="StuK Leipzig" class="ueber-hero__logo" />
        <div class="ueber-hero__divider"></div>
        <h1 class="ueber-hero__title">Über den StuK</h1>
        <p class="ueber-hero__sub">Studentischer Klub seit den 90ern – Kultur, Bar & Gemeinschaft.</p>
      </div>
    </section>

    <section class="container glass-strong">
      <!-- Über uns: Desktop voll, Mobile gekürzt + Modal -->
      <div v-if="ueberUnsHtml" class="ueber-text">
        <!-- Desktop / Tablet: volle Länge -->
        <div class="markdown-content desktop-only" v-html="ueberUnsHtml"></div>

        <!-- Mobile: gekürzt -->
        <div class="mobile-only">
          <div class="markdown-content markdown-collapsed" v-html="ueberUnsHtml"></div>

          <button class="read-more-btn" @click="showUeberModal = true">
            …mehr
          </button>
        </div>
      </div>

    </section>
    <!-- Über uns Modal (Mobile Bottom Sheet) -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showUeberModal" class="ueber-modal-overlay" @click="showUeberModal = false">
          <div class="ueber-modal" @click.stop>
            <div class="ueber-modal-header">
              <h3>Über den StuK</h3>
              <button class="close-btn" @click="showUeberModal = false">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div class="ueber-modal-content">
              <div class="markdown-content" v-html="ueberUnsHtml"></div>
            </div>

            <!-- <div class="ueber-modal-footer">
              <button class="btn primary" @click="showUeberModal = false">Schließen</button>
            </div> -->
          </div>
        </div>
      </Transition>
    </Teleport>

    <section class="container">
      <h2>Unser Klubrat</h2>
      <p class="sub" style="margin-bottom:24px">{{ klubratCount }} engagierte Menschen, die den StuK mit Leidenschaft
        gestalten</p>

      <div v-if="klubratPending" class="loading">Lade Klubrat...</div>
      <div v-else-if="klubratError" class="error">Fehler beim Laden der Klubratsmitglieder</div>
      <div v-else class="council-grid" lang="de">
        <div v-for="member in klubrats" :key="member.id" class="council-card" :class="{ 'council-card--spitze': member.Dreierspitze }" @click="openModal(member)">
          <div class="avatar" :style="getAvatarStyle(member)"></div>
          <div class="info">
            <h3>{{ member.Name }}</h3>
            <p class="role">{{ member.Posten }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="container">
      <h2>Zu uns gehören noch viel mehr</h2>
      <p class="sub" style="margin-bottom:24px">Über 50 aktive Mitglieder gestalten den StuK – an der Bar, am Einlass,
        in der Technik und überall dazwischen</p>

      <div class="assembly-photo" style="background-image:url('/bilder/WhatsApp Image 2025-10-16 at 11.29.00.jpeg')">
        <div class="assembly-overlay">
          <p>Unsere letzte Vollversammlung – gemeinsam gestalten wir den Club</p>
        </div>
      </div>

      <div v-if="collagePending" class="loading">Lade Galerie...</div>
      <div v-else-if="collageError" class="error">Fehler beim Laden der Galerie</div>

      <!-- Desktop: Collage Grid -->
      <div v-else class="member-collage desktop-only">
        <div v-for="(image, index) in galleryImages" :key="index" class="collage-item"
          :class="getCollageItemClass(index)" :style="{ backgroundImage: `url('${image.previewSrc}')` }"
          :title="image.caption" @click="openGallery(index)"></div>
      </div>

      <!-- Mobile: Instagram-Style Carousel -->
      <div v-if="!collagePending && !collageError && galleryImages.length" class="mobile-only">
        <div class="carousel" ref="carouselRef" @scroll.passive="onCarouselScroll">
          <div v-for="(image, index) in galleryImages" :key="index" class="carousel__slide">
            <img :src="image.previewSrc" :alt="image.alt" class="carousel__image" @click="openGallery(index)" />
          </div>
        </div>

        <div class="carousel__dots">
          <span v-for="(_, index) in galleryImages" :key="index" class="carousel__dot"
            :class="{ active: index === carouselIndex }" @click="goToSlide(index)"></span>
        </div>

        <div class="carousel__counter">{{ carouselIndex + 1 }} / {{ galleryImages.length }}</div>
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
        <div v-for="(event, index) in timelineEvents" :key="index" class="timeline-item"
          :class="{ 'timeline-item--active': activeTimelineIndex === index }" :data-text="event.label">
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
  <Teleport to="body">
    <Transition name="council-sheet">
      <div v-if="selectedMember" class="council-modal" @click.self="closeModal">
        <div class="council-modal-content">
          <div class="council-modal-header">
            <h3>{{ selectedMember.Posten }}</h3>
            <button class="close-btn" @click="closeModal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <img class="modal-avatar-small" :src="getImageUrl(selectedMember.Profilbild, 'medium')"
              :alt="selectedMember.Name" />
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
    </Transition>
  </Teleport>

  <!-- Gallery Lightbox -->
  <div v-if="galleryActive" class="gallery-lightbox active" @click.self="closeGallery">
    <button class="gallery-close-btn" @click="closeGallery">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>

    <button class="gallery-nav-btn prev" @click="navigateGallery(-1)">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>

    <button class="gallery-nav-btn next" @click="navigateGallery(1)">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 18l6-6-6-6" />
      </svg>
    </button>

    <div class="gallery-click-zone gallery-click-left" @click="navigateGallery(-1)"></div>
    <div class="gallery-click-zone gallery-click-right" @click="navigateGallery(1)"></div>

    <div class="gallery-lightbox-content" @touchstart="onTouchStart" @touchend="onTouchEnd">
      <img class="gallery-lightbox-image" :src="galleryImages[currentGalleryIndex]?.fullSrc"
        :alt="galleryImages[currentGalleryIndex]?.alt" loading="eager" decoding="async" />
      <div v-if="galleryImages[currentGalleryIndex]?.caption" class="gallery-lightbox-caption">
        <p>{{ galleryImages[currentGalleryIndex].caption }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
const showUeberModal = ref(false)

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
  Dreierspitze: boolean
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

const klubrats = computed(() => {
  const all = klubratsRes.value?.data || []
  return all.slice().sort((a: Klubrat, b: Klubrat) => {
    // Dreierspitze always first
    if (a.Dreierspitze && !b.Dreierspitze) return -1
    if (!a.Dreierspitze && b.Dreierspitze) return 1
    // Then alphabetically by Posten
    return a.Posten.localeCompare(b.Posten, 'de')
  })
})
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
  if (isMobile.value) return {} // Mobile: keine tall/wide Layout-Spielereien
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

// Touch/Swipe support for gallery
let touchStartX = 0
let touchStartY = 0

function onTouchStart(e: TouchEvent) {
  touchStartX = e.changedTouches[0].clientX
  touchStartY = e.changedTouches[0].clientY
}

function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - touchStartX
  const dy = e.changedTouches[0].clientY - touchStartY
  // Only trigger if horizontal swipe is dominant and > 50px
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
    if (dx < 0) navigateGallery(1)   // swipe left → next
    else navigateGallery(-1)          // swipe right → prev
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (selectedMember.value && e.key === 'Escape') closeModal()

  if (galleryActive.value) {
    if (e.key === 'Escape') closeGallery()
    else if (e.key === 'ArrowLeft') navigateGallery(-1)
    else if (e.key === 'ArrowRight') navigateGallery(1)
  }

  if (showUeberModal.value && e.key === 'Escape') showUeberModal.value = false
}
watch(showUeberModal, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})
watch(selectedMember, (member) => {
  document.body.style.overflow = member ? 'hidden' : ''
})

// --- Mobile Detection ---
const isMobile = ref(false)

function updateIsMobile() {
  isMobile.value = window.innerWidth <= 640
}

// --- Mobile Carousel ---
const carouselDragging = ref(false)
const carouselDragOffset = ref(0)
let carouselTouchStartX = 0
let carouselTouchStartY = 0
let carouselTouchStartTime = 0
let carouselDirection: 'horizontal' | 'vertical' | null = null

function onCarouselTouchStart(e: TouchEvent) {
  carouselTouchStartX = e.touches[0].clientX
  carouselTouchStartY = e.touches[0].clientY
  carouselTouchStartTime = Date.now()
  carouselDragging.value = true
  carouselDragOffset.value = 0
  carouselDirection = null
}

function onCarouselTouchMove(e: TouchEvent) {
  if (!carouselDragging.value) return
  const dx = e.touches[0].clientX - carouselTouchStartX
  const dy = e.touches[0].clientY - carouselTouchStartY

  // Lock direction once on first significant movement
  if (carouselDirection === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
    carouselDirection = Math.abs(dx) >= Math.abs(dy) ? 'horizontal' : 'vertical'
  }

  if (carouselDirection === 'horizontal') {
    e.preventDefault()
    carouselDragOffset.value = dx
  }
}

const carouselEl = ref<HTMLElement | null>(null)

function onCarouselTouchEnd() {
  if (!carouselDragging.value) return
  carouselDragging.value = false

  const dx = carouselDragOffset.value
  const elapsed = Date.now() - carouselTouchStartTime
  const velocity = Math.abs(dx) / Math.max(elapsed, 1)

  const width = carouselEl.value?.clientWidth ?? window.innerWidth
  const minSwipe = width * 0.22 // ~22% der Breite (fühlt sich i.d.R. gut an)

  const shouldMove =
    carouselDirection === 'horizontal' &&
    (Math.abs(dx) > minSwipe || (Math.abs(dx) > 10 && velocity > 0.6))

  if (shouldMove) {
    if (dx < 0 && carouselIndex.value < galleryImages.value.length - 1) carouselIndex.value++
    else if (dx > 0 && carouselIndex.value > 0) carouselIndex.value--
  }

  // IMMER sauber zurücksetzen
  carouselDragOffset.value = 0
  carouselDirection = null
}

// Falls die Bilder (async) reinkommen und der Index out-of-range wäre:
watch(galleryImages, (imgs) => {
  if (carouselIndex.value > imgs.length - 1) carouselIndex.value = Math.max(imgs.length - 1, 0)
})

// Bei Resize auch Offset killen (verhindert “halbe” Positionen nach Rotation)
watch(isMobile, () => {
  carouselDragOffset.value = 0
  carouselDragging.value = false
  carouselDirection = null
})

const carouselRef = ref<HTMLElement | null>(null)
const carouselIndex = ref(0)

let raf = 0
function onCarouselScroll() {
  const el = carouselRef.value
  if (!el) return
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(() => {
    const w = el.clientWidth || 1
    const idx = Math.round(el.scrollLeft / w)
    carouselIndex.value = Math.min(Math.max(idx, 0), galleryImages.value.length - 1)
  })
}

function goToSlide(index: number) {
  const el = carouselRef.value
  if (!el) return
  const w = el.clientWidth
  carouselIndex.value = index
  el.scrollTo({ left: index * w, behavior: 'smooth' })
}

watch(galleryImages, (imgs) => {
  if (carouselIndex.value > imgs.length - 1) carouselIndex.value = Math.max(imgs.length - 1, 0)
})


onMounted(() => {
  updateIsMobile()
  window.addEventListener('resize', updateIsMobile)
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
  window.removeEventListener('resize', updateIsMobile)
  window.removeEventListener('scroll', checkTimelineItems)
  window.removeEventListener('resize', checkTimelineItems)
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Slim Hero */
.ueber-hero {
  position: relative;
  padding: 56px 20px 48px;
  text-align: center;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(188, 43, 37, 0.08) 0%, transparent 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.ueber-hero__glow {
  position: absolute;
  top: -60px;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  height: 200px;
  background: radial-gradient(ellipse, rgba(188, 43, 37, 0.18) 0%, transparent 70%);
  pointer-events: none;
}

.ueber-hero__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.ueber-hero__logo {
  width: 80px;
  height: auto;
  opacity: 0.85;
  filter: drop-shadow(0 2px 12px rgba(188, 43, 37, 0.25));
}

.ueber-hero__divider {
  width: 48px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--brand-red), transparent);
  margin: 16px 0;
  border-radius: 1px;
}

.ueber-hero__title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text);
  margin: 0 0 8px;
  letter-spacing: -0.02em;
}

.ueber-hero__sub {
  color: var(--muted);
  font-size: 1.05rem;
  margin: 0;
  max-width: 420px;
}

@media (max-width: 640px) {
  .ueber-hero {
    padding: 40px 16px 32px;
  }

  .ueber-hero__logo {
    width: 60px;
  }

  .ueber-hero__title {
    font-size: 1.5rem;
  }

  .ueber-hero__sub {
    font-size: 0.95rem;
  }
}

.glass-strong {
  background: rgba(12, 13, 15, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: var(--radius);
  backdrop-filter: blur(14px) saturate(1.2);
  box-shadow: var(--shadow);
  padding: 20px 24px;
  margin: 8px auto 0px auto;
}

@media (max-width: 640px) {
  .glass-strong {
    margin: 8px 4px 0px 4px;
  }
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

  .council-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .council-card .info {
    padding: 8px 6px;
  }

  .council-card h3 {
    font-size: 0.82rem;
    hyphens: auto;
  }

  .council-card .role {
    font-size: 0.7rem;
    hyphens: auto;
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

.council-card--spitze {
  border-color: rgba(188, 43, 37, 0.35);
  box-shadow: 0 4px 20px rgba(188, 43, 37, 0.15);
}

.council-card--spitze .avatar::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  border-bottom: 2px solid rgba(188, 43, 37, 0.5);
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
  z-index: 2200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.council-modal-content {
  background: linear-gradient(135deg, #0f1013 0%, #1a1d24 100%);
  border: 1px solid #ffffff22;
  border-radius: var(--radius);
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.council-modal-header {
  display: none;
}

/* Mobile: Bottom Sheet */
@media (max-width: 640px) {
  .council-modal {
    align-items: flex-end;
    padding: 0;
  }

  .council-modal-content {
    border-radius: var(--radius) var(--radius) 0 0;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.6);
    overflow: hidden;
  }

  .council-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 20px;
    border-bottom: 1px solid #ffffff12;
    background: rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
  }

  .council-modal-header h3 {
    margin: 0;
    color: var(--text);
    font-size: 1.15rem;
  }

  .council-modal-header .close-btn {
    background: none;
    border: none;
    color: var(--muted);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-bottom: calc(32px + env(safe-area-inset-bottom, 16px));
  }
}

/* Desktop: Close Button */
@media (min-width: 641px) {
  .council-modal-header {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    padding: 16px;
    border: none;
    background: none;
  }

  .council-modal-header h3 {
    display: none;
  }

  .council-modal-header .close-btn {
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
    transition: all 0.2s;
  }

  .council-modal-header .close-btn:hover {
    background: rgba(188, 43, 37, 0.9);
    transform: scale(1.1);
  }
}

/* Council Sheet Transition */
.council-sheet-enter-active,
.council-sheet-leave-active {
  transition: opacity 0.25s ease;
}

.council-sheet-enter-from,
.council-sheet-leave-to {
  opacity: 0;
}

.council-sheet-enter-active .council-modal-content,
.council-sheet-leave-active .council-modal-content {
  transition: transform 0.25s ease;
}

@media (max-width: 640px) {
  .council-sheet-enter-from .council-modal-content,
  .council-sheet-leave-to .council-modal-content {
    transform: translateY(100%);
  }
}

@media (min-width: 641px) {
  .council-sheet-enter-from .council-modal-content,
  .council-sheet-leave-to .council-modal-content {
    transform: translateY(20px) scale(0.97);
  }
}

.modal-body {
  padding: 32px;
}

.modal-avatar-small {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid rgba(188, 43, 37, 0.4);
  margin: 0 auto 20px;
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
  .assembly-photo {
    height: 300px;
  }
}

/* Mobile Carousel (Instagram-Style) */
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  border-radius: var(--radius);
  touch-action: auto;
  scrollbar-width: none;
  overflow-y: hidden;
}
.carousel::-webkit-scrollbar { display: none; }

.carousel__track {
  display: flex;
  width: 100%;
  will-change: transform;
}

.carousel__slide {
  flex: 0 0 100%;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  height: 70vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.15);
}

.carousel__image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  display: block;
  border-radius: var(--radius);
}

.carousel__counter {
  text-align: center;
  color: var(--muted);
  font-size: 0.8rem;
  margin-top: 10px;
}

.carousel__dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 12px;
  flex-wrap: wrap;
  max-width: 100%;
  padding: 0 16px;
}

.carousel__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.carousel__dot.active {
  background: var(--brand-red);
  transform: scale(1.3);
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

/* Invisible click zones – only visible on mobile (no arrows there) */
.gallery-click-zone {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 35%;
  cursor: pointer;
  z-index: 5;
  display: none;
}

.gallery-click-left {
  left: 0;
}

.gallery-click-right {
  right: 0;
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
    display: none;
  }

  .gallery-click-zone {
    display: block;
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

/* Sichtbarkeit: Mobile vs Desktop */
/* Desktop: nichts setzen -> Element behält sein eigenes display (grid/flex/block/...) */
.desktop-only {}

/* Standard: Mobile-only ist aus */
.mobile-only { display: none; }

@media (max-width: 640px) {
  .desktop-only { display: none !important; }
  .mobile-only { display: block; }
}

/* Mobile: Markdown gekürzt (Line Clamp) */
.markdown-collapsed {
  display: -webkit-box;
  -webkit-line-clamp: 6;
  /* <- Anzahl Zeilen: anpassen */
  -webkit-box-orient: vertical;
  overflow: hidden;
  position: relative;
}

/* Optional: leichter Fade unten */
.markdown-collapsed::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 48px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(12, 13, 15, 0.95));
  pointer-events: none;
}

/* Read-more Button */
.read-more-btn {
  margin-top: 12px;
  width: 100%;
  padding: 12px 14px;
  border-radius: var(--radius);
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(188, 43, 37, 0.18);
  color: var(--text);
  font-weight: 700;
  cursor: pointer;
  transition: transform .15s ease, background .15s ease, border-color .15s ease;
}

.read-more-btn:hover {
  transform: translateY(-1px);
  background: rgba(188, 43, 37, 0.28);
  border-color: rgba(188, 43, 37, 0.35);
}

/* Über-Modal (Mobile Bottom Sheet) */
.ueber-modal-overlay {
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
  .ueber-modal-overlay {
    align-items: center;
  }
}

.ueber-modal {
  background: linear-gradient(135deg, #0f1013 0%, #1a1d24 100%);
  border: 1px solid #ffffff22;
  border-radius: var(--radius) var(--radius) 0 0;
  width: 100%;
  max-width: 700px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.6);
}

@media (min-width: 641px) {
  .ueber-modal {
    border-radius: var(--radius);
    max-height: 75vh;
  }
}

.ueber-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 1px solid #ffffff12;
  background: rgba(0, 0, 0, 0.2);
}

.ueber-modal-header h3 {
  margin: 0;
  color: var(--text);
  font-size: 1.15rem;
}

.ueber-modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.ueber-modal-footer {
  padding: 14px 20px;
  border-top: 1px solid #ffffff12;
  display: flex;
  justify-content: flex-end;
}

.ueber-modal-footer .btn {
  padding: 10px 16px;
  border-radius: var(--radius);
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: transparent;
  color: var(--text);
  cursor: pointer;
  font-weight: 700;
}

.ueber-modal-footer .btn.primary {
  background: var(--brand-red);
  border-color: var(--brand-red);
  color: white;
}

/* Transition name="modal" nutzt du schon – passt direkt */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .ueber-modal,
.modal-leave-active .ueber-modal {
  transition: transform 0.25s ease;
}

.modal-enter-from .ueber-modal,
.modal-leave-to .ueber-modal {
  transform: translateY(100%);
}

@media (min-width: 641px) {

  .modal-enter-from .ueber-modal,
  .modal-leave-to .ueber-modal {
    transform: translateY(20px) scale(0.97);
  }
}
</style>
