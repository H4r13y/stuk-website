<template>
  <main>
    <section class="container">
      <h1>Mitmachen</h1>
      <p class="sub">Werde Teil der Crew – Bar, Einlass, Orga, Booking, Design, Technik.</p>

      <div class="hero-image" style="background-image: url('/bilder/WhatsApp Image 2025-10-16 at 11.29.00.jpeg')">
        <div class="hero-overlay">
          <h2>Gestalte den StuK mit!</h2>
          <p>Über 50 Mitglieder machen den Klub zu dem, was er ist – ehrenamtlich, mit Leidenschaft und guter Laune</p>
        </div>
      </div>
    </section>

    <section class="container">
      <h2>Was bieten wir dir?</h2>
      <div class="benefits-grid">
        <div class="benefit-item">
          <div class="icon-large">🎉</div>
          <h4>Freier Eintritt</h4>
          <p>Bei allen StuK-Events als aktives Mitglied</p>
        </div>
        <div class="benefit-item">
          <div class="icon-large">🍺</div>
          <h4>Vergünstigte Getränke</h4>
          <p>Mitgliederpreise an der Bar bei jedem Event!</p>
        </div>
        <div class="benefit-item">
          <div class="icon-large">🤝</div>
          <h4>Tolle Community</h4>
          <p>Neue Freundschaften und gemeinsame Erlebnisse</p>
        </div>
        <div class="benefit-item">
          <div class="icon-large">💡</div>
          <h4>Lerne Neues</h4>
          <p>Ob Technik, Design oder Organisation – wir zeigen dir alles</p>
        </div>
      </div>
    </section>

    <section class="container">
      <div class="stepper-container">
        <h2 style="margin-top: 0; text-align: center;">Dein Weg zum Vollmitglied</h2>
        <p class="sub" style="text-align: center; margin-bottom: 0;">Von der Bewerbung bis zur aktiven Mitgliedschaft</p>

        <div class="stepper">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <div class="step-title">Bewerbung</div>
              <div class="step-desc">Füll das Formular aus – wir melden uns bei dir!</div>
            </div>
          </div>

          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <div class="step-title">Probedienste</div>
              <div class="step-desc">Mach Probedienste und schau, ob es dir gefällt</div>
            </div>
          </div>

          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <div class="step-title">Anwärter</div>
              <div class="step-desc">Nach 3 Probediensten und 1 Arbeitseinsatz bist du jetzt Anwärter und Teil des Teams</div>
            </div>
          </div>

          <div class="step">
            <div class="step-number">4</div>
            <div class="step-content">
              <div class="step-title">Vollmitglied</div>
              <div class="step-desc">Dein Mitgliedsbeitrag: <br>6 Dienste + 2 Arbeitseinsätze pro Semester + 1 Schulung pro Jahr</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="container">
      <h2>Finde deinen Bereich</h2>
      <p class="sub" style="margin-bottom: 24px">Klicke auf einen Bereich, um mehr zu erfahren</p>

      <div class="role-cards">
        <div
          v-for="(role, key) in roles"
          :key="key"
          class="role-card"
          @click="openRoleModal(String(key))"
        >
          <div class="role-card-image" :style="{ backgroundImage: `url('${role.image}')` }"></div>
          <div class="role-card-info">
            <h3>{{ role.title }}</h3>
            <p>{{ role.subtitle }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="container panel formular">
      <h2>Kurzbewerbung</h2>
      <p class="sub">Füll einfach das Formular aus – wir melden uns bei dir!</p>

      <form class="form" @submit.prevent="submitForm">
        <div class="input">
          <label>Name</label>
          <input v-model="formData.name" placeholder="Max Mustermann" required>
        </div>

        <div class="input">
          <label>E-Mail</label>
          <input v-model="formData.email" type="email" placeholder="max@gmail.com" required>
        </div>

        <div class="input" style="grid-column:1/-1">
          <label>Telefonnummer (freiwillig)</label>
          <input v-model="formData.phone" type="tel" placeholder="Optional – falls wir dich anrufen sollen">
        </div>

        <div class="input" style="grid-column:1/-1">
          <label>Bereich(e)</label>
          <div class="checkbox-group">
            <label v-for="option in bereichOptions" :key="option" class="checkbox-label">
              <input type="checkbox" :value="option" v-model="formData.bereiche">
              <span class="checkbox-box"></span>
              <span>{{ option }}</span>
            </label>
          </div>
        </div>

        <div style="grid-column:1/-1">
          <ClientOnly>
            <NuxtTurnstile
              :key="turnstileKey"
              v-model="turnstileToken"
            />
          </ClientOnly>
        </div>

        <div style="grid-column:1/-1">
          <button class="btn" type="submit" :disabled="isSubmitting || !turnstileToken">
            {{ isSubmitting ? 'Wird gesendet...' : 'Absenden' }}
          </button>
        </div>
      </form>
    </section>

    <!-- Success/Error Notification -->
    <Transition name="notification">
      <div v-if="showNotification" class="notification" :class="notificationType">
        <div class="notification-content">
          <div class="notification-icon">
            <svg v-if="notificationType === 'success'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div class="notification-text">
            <h4>{{ notificationTitle }}</h4>
            <p>{{ notificationMessage }}</p>
          </div>
          <button class="notification-close" @click="closeNotification">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </Transition>

    <!-- Role Modal -->
    <Teleport to="body">
      <Transition name="role-sheet">
        <div v-if="modalActive" class="role-modal" @click.self="closeRoleModal">
          <div class="role-modal-content">
            <div class="role-modal-titlebar">
              <h3 v-if="selectedRole">{{ selectedRole.title }}</h3>
              <button class="close-btn" @click="closeRoleModal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <div class="role-modal-scroll">
              <div
                class="role-modal-header"
                :style="{ backgroundImage: selectedRole ? `url('${selectedRole.image}')` : '' }"
              ></div>

              <div class="role-modal-body" v-if="selectedRole">
                <h2>{{ selectedRole.title }}</h2>
                <p class="subtitle">{{ selectedRole.subtitle }}</p>
                <p class="description">{{ selectedRole.description }}</p>

                <h3>Deine Aufgaben</h3>
                <ul>
                  <li v-for="(task, index) in selectedRole.tasks" :key="index">{{ task }}</li>
                </ul>

                <div>
                  <p class="description" v-html="selectedRole.note"></p>
                </div>
              </div>

              <div class="role-modal-footer" v-if="selectedRole">
                {{ selectedRole.footer }}
              </div>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

useHead({
  title: 'StuK – Mitmachen',
  meta: [
    { name: 'description', content: 'Werde Teil der StuK Crew – Bar, Einlass, Technik, Booking, Design, Orga' }
  ]
})

const config = useRuntimeConfig()
const strapiUrl = config.public.strapiUrl
const emailToken = config.public.emailStrapiToken

// Form data
const bereichOptions = ['Bar', 'Einlass', 'Technik', 'Booking', 'Design', 'Orga', 'Weiß ich nicht']
const formData = ref({
  name: '',
  email: '',
  phone: '',
  bereiche: [] as string[]
})

// Turnstile
const turnstileToken = ref<string | null>(null)
const turnstileKey = ref(0)

function resetTurnstile() {
  turnstileToken.value = null
  turnstileKey.value++
}

// Submission state
const isSubmitting = ref(false)

// Notification state
const showNotification = ref(false)
const notificationType = ref<'success' | 'error'>('success')
const notificationTitle = ref('')
const notificationMessage = ref('')

// Modal state
const modalActive = ref(false)
const selectedRoleKey = ref<string | null>(null)

// Role data (unverändert)
const roles = {
  bar: {
    title: 'Bar',
    subtitle: 'Mixen, ausschenken, Stimmung machen',
    image: '/bilder/DSC05029.JPG',
    description: 'An der Bar bist du das Herzstück jeder Veranstaltung. Du schenkst Getränke aus, sorgst für gute Stimmung und hast direkten Kontakt zu unseren Gästen. Die Bar ist der Ort, an dem du die meisten Leute kennenlernst und wo die Energie des Abends spürbar wird.',
    tasks: [
      'Getränke zapfen und mixen',
      'Abrechnung und Kasse',
      'Kommunikation mit Gästen',
      'Schichtplanung flexibel',
      'Lagerverwaltung und Bestellung'
    ],
    note: '<strong>Keine Vorkenntnisse nötig</strong> – wir lernen dir alles!',
    footer: 'Interessiert? Bewirb dich unten mit dem Formular!'
  },
  einlass: {
    title: 'Einlass',
    subtitle: 'Gäste empfangen & Augen offen halten',
    image: '/bilder/DSC05050.JPG',
    description: 'Am Einlass bist du das erste freundliche Gesicht für unsere Gäste. Du sorgst für einen reibungslosen Ablauf und ein sicheres Umfeld. Deine Aufgabe ist es, für eine angenehme Atmosphäre zu sorgen und gleichzeitig ein wachsames Auge zu haben.',
    tasks: [
      'Einlasskontrolle',
      'Kommunikation mit Gästen',
      'Awareness-Ansprechpartner',
      'Zusammenarbeit mit dem Team',
      'Konfliktlösung wenn nötig'
    ],
    note: '<strong>Wichtig:</strong> Freundlich aber bestimmt – wir schulen dich!',
    footer: 'Interessiert? Bewirb dich unten mit dem Formular!'
  },
  technik: {
    title: 'Technik',
    subtitle: 'Licht & Sound – wir zeigen dir alles',
    image: '/bilder/DSC06805.jpg',
    description: 'Ohne gute Technik kein gutes Event! Du kümmerst dich um Licht, Sound und alles was dazugehört. Von der Planung über den Aufbau bis zur Betreuung während des Events – du machst aus jedem Abend ein audiovisuelles Erlebnis.',
    tasks: [
      'Aufbau und Betreuung der Anlage',
      'Licht- und Tonsteuerung',
      'Support für Acts und DJs',
      'Wartung und Reparaturen',
      'Neue Equipment-Ideen entwickeln'
    ],
    note: '<strong>Technisches Interesse?</strong> Perfekt – du lernst bei uns!',
    footer: 'Interessiert? Bewirb dich unten mit dem Formular!'
  },
  booking: {
    title: 'Booking',
    subtitle: 'Acts anfragen & Programm kuratieren',
    image: '/bilder/PXL_20250328_182103563.MP.jpg',
    description: 'Du hast ein Händchen für gute Musik und spannende Acts? Dann gestalte unser Programm mit! Als Teil des Booking-Teams bist du dafür verantwortlich, Künstler zu kontaktieren, Events zu planen und das kulturelle Gesicht des StuK mitzugestalten.',
    tasks: [
      'Kontakt zu Künstlern und DJs',
      'Event-Planung und Kuration',
      'Verhandlung von Gagen',
      'Netzwerk in der Szene aufbauen',
      'Promotion und Kommunikation'
    ],
    note: '<strong>Kreativität gefragt!</strong> Bring deine Ideen ein.',
    footer: 'Interessiert? Bewirb dich unten mit dem Formular!'
  },
  design: {
    title: 'Design',
    subtitle: 'Poster, Socials & Website',
    image: '/bilder/DSC05145.JPG',
    description: 'Gib dem StuK sein visuelles Gesicht! Von Event-Postern bis Social Media – hier ist deine Kreativität gefragt. Du gestaltest die visuelle Identität des Clubs und sorgst dafür, dass unsere Events optisch genauso gut sind wie musikalisch.',
    tasks: [
      'Event-Poster und Flyer',
      'Social Media Content',
      'Website-Gestaltung',
      'Foto und Video',
      'Corporate Design pflegen'
    ],
    note: '<strong>Portfolio erweitern?</strong> Perfekter Ort dafür!',
    footer: 'Interessiert? Bewirb dich unten mit dem Formular!'
  },
  orga: {
    title: 'Orga',
    subtitle: 'Schichtpläne & Abläufe',
    image: '/bilder/DSC05033.JPG',
    description: 'Koordination ist dein Ding? In der Orga sorgst du dafür, dass alles reibungslos läuft. Du koordinierst Schichten, organisierst Meetings und behältst den Überblick über alle laufenden Projekte. Ohne dich wäre Chaos vorprogrammiert!',
    tasks: [
      'Schichtplanung koordinieren',
      'Kommunikation im Team',
      'Event-Organisation',
      'Verwaltung und Finanzen',
      'Mitgliederverwaltung'
    ],
    note: '<strong>Strukturiert arbeiten?</strong> Wir brauchen dich!',
    footer: 'Interessiert? Bewirb dich unten mit dem Formular!'
  }
} as const

const selectedRole = computed(() => {
  return selectedRoleKey.value ? roles[selectedRoleKey.value as keyof typeof roles] : null
})

// Notifications
function showSuccessNotification(title: string, message: string) {
  notificationType.value = 'success'
  notificationTitle.value = title
  notificationMessage.value = message
  showNotification.value = true
  setTimeout(closeNotification, 5000)
}

function showErrorNotification(title: string, message: string) {
  notificationType.value = 'error'
  notificationTitle.value = title
  notificationMessage.value = message
  showNotification.value = true
  setTimeout(closeNotification, 8000)
}

function closeNotification() {
  showNotification.value = false
}

// Modal
function openRoleModal(roleKey: string) {
  selectedRoleKey.value = roleKey
  modalActive.value = true

  // Turnstile ist empfindlich bei Reflow/Transform/Teleport -> sauber neu mounten
  resetTurnstile()
}

function closeRoleModal() {
  modalActive.value = false
  selectedRoleKey.value = null

  // Auch beim Schließen neu mounten (häufige Ursache für "NaN"-Spam)
  resetTurnstile()
}

// Submit
async function submitForm() {
  isSubmitting.value = true

  try {
    if (!turnstileToken.value) {
      showErrorNotification('Captcha erforderlich', 'Bitte bestätige, dass du kein Roboter bist.')
      return
    }

    const response = await $fetch(`${strapiUrl}/api/kontakt/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${emailToken}`,
      },
      body: {
        formType: 'join',
        data: {
          name: formData.value.name,
          email: formData.value.email,
          phone: formData.value.phone,
          area: formData.value.bereiche.join(', '),
        },
        turnstileToken: turnstileToken.value,
      },
    })

    if (response && (response as any).success) {
      showSuccessNotification('Bewerbung erhalten!', 'Danke für dein Interesse! Wir melden uns zeitnah bei dir.')

      formData.value = { name: '', email: '', phone: '', bereiche: [] }

      // Wichtig: Turnstile danach hart resetten
      resetTurnstile()
    }
  } catch (error: any) {
    console.error('=== Frontend E-Mail Fehler (Mitmachen) ===', error)
    showErrorNotification(
      'Fehler beim Senden',
      'Die Bewerbung konnte nicht versendet werden. Bitte versuche es später erneut oder kontaktiere uns direkt per E-Mail.'
    )

    // Optional: auch nach Fehler resetten (Token könnte "verbraucht" sein)
    resetTurnstile()
  } finally {
    isSubmitting.value = false
  }
}

// Body scroll lock + Escape
watch(modalActive, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && modalActive.value) closeRoleModal()
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Checkbox Group */
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
}
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.03);
  transition: all 0.2s;
  font-size: 0.9rem;
  color: var(--muted);
  user-select: none;
}
.checkbox-label:hover {
  border-color: rgba(188,43,37,0.4);
  background: rgba(188,43,37,0.06);
}
.checkbox-label:has(input:checked) {
  border-color: rgba(188,43,37,0.6);
  background: rgba(188,43,37,0.12);
  color: var(--text);
}
.checkbox-label input {
  display: none;
}
.checkbox-box {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid rgba(255,255,255,0.2);
  position: relative;
  flex-shrink: 0;
  transition: all 0.2s;
}
.checkbox-label:has(input:checked) .checkbox-box {
  background: var(--brand-red);
  border-color: var(--brand-red);
}
.checkbox-label:has(input:checked) .checkbox-box::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 1px;
  width: 5px;
  height: 10px;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.formular {
  margin: 0px auto 12px auto;
}

@media (max-width: 640px) {
  .formular {
    margin: 8px 4px 0px 4px;
  }
}

.hero-image {
  width: 100%;
  height: 350px;
  background-size: cover;
  background-position: center;
  border-radius: var(--radius);
  margin-bottom: 0;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);
}
.hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(10,11,13,0.95) 0%, rgba(10,11,13,0.7) 50%, transparent 100%);
  padding: 32px 24px 24px;
  color: var(--text);
}
.hero-overlay h2 {
  margin: 0 0 8px;
  font-size: 1.8rem;
}
.hero-overlay p {
  margin: 0;
  color: var(--muted);
}

.role-cards {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  margin: 32px 0;
}
.role-card {
  background: linear-gradient(180deg, #111215, #0f1012);
  border: 1px solid #ffffff14;
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}
.role-card:hover {
  transform: translateY(-6px);
  border-color: rgba(188,43,37,.4);
  box-shadow: 0 12px 32px rgba(188,43,37,.2);
}
.role-card-image {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  position: relative;
}
.role-card-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(15,16,18,0.9) 100%);
}
.role-card-info {
  padding: 16px;
  text-align: center;
}
.role-card h3 {
  margin: 0 0 8px;
  font-size: 1.2rem;
  color: var(--text);
}
.role-card p {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
}

/* Role Modal */
.role-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.85);
  backdrop-filter: blur(8px);
  z-index: 2200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}
.role-modal-content {
  background: linear-gradient(135deg, #0f1013 0%, #1a1d24 100%);
  border: 1px solid #ffffff22;
  border-radius: var(--radius);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}
.role-modal-titlebar {
  display: none;
}
.role-modal-header {
  position: relative;
  height: 300px;
  background-size: cover;
  background-position: center;
}
.role-modal-header::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(15,16,18,1) 100%);
}

/* Desktop: Close Button */
@media (min-width: 641px) {
  .role-modal-titlebar {
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 10;
    padding: 16px;
  }

  .role-modal-titlebar h3 {
    display: none;
  }

  .role-modal-titlebar .close-btn {
    background: rgba(10,11,13,.9);
    border: 1px solid rgba(255,255,255,.2);
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

  .role-modal-titlebar .close-btn:hover {
    background: rgba(188,43,37,.9);
    transform: scale(1.1);
  }
}

/* Mobile: Bottom Sheet */
@media (max-width: 640px) {
  .role-modal {
    align-items: flex-end;
    padding: 0;
  }

  .role-modal-content {
    border-radius: var(--radius) var(--radius) 0 0;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.6);
    overflow: hidden;
  }

  .role-modal-titlebar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 20px;
    border-bottom: 1px solid #ffffff12;
    background: rgba(0, 0, 0, 0.2);
    flex-shrink: 0;
  }

  .role-modal-titlebar h3 {
    margin: 0;
    color: var(--text);
    font-size: 1.15rem;
  }

  .role-modal-titlebar .close-btn {
    background: none;
    border: none;
    color: var(--muted);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .role-modal-scroll {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-bottom: calc(16px + env(safe-area-inset-bottom, 16px));
  }

  .role-modal-header {
    height: 180px;
  }
}

/* Role Sheet Transition */
.role-sheet-enter-active,
.role-sheet-leave-active {
  transition: opacity 0.25s ease;
}

.role-sheet-enter-from,
.role-sheet-leave-to {
  opacity: 0;
}

.role-sheet-enter-active .role-modal-content,
.role-sheet-leave-active .role-modal-content {
  transition: transform 0.25s ease;
}

@media (max-width: 640px) {
  .role-sheet-enter-from .role-modal-content,
  .role-sheet-leave-to .role-modal-content {
    transform: translateY(100%);
  }
}

@media (min-width: 641px) {
  .role-sheet-enter-from .role-modal-content,
  .role-sheet-leave-to .role-modal-content {
    transform: translateY(20px) scale(0.97);
  }
}
.role-modal-body {
  padding: 32px;
}
.role-modal-body h2 {
  margin: 0 0 8px;
  color: var(--brand-red);
  font-size: 2rem;
}
.role-modal-body .subtitle {
  color: var(--muted);
  margin-bottom: 24px;
  font-style: italic;
}
.role-modal-body .description {
  color: var(--text);
  line-height: 1.7;
  margin-bottom: 24px;
}
.role-modal-body h3 {
  color: var(--text);
  margin: 24px 0 12px;
  font-size: 1.3rem;
}
.role-modal-body ul {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
}
.role-modal-body ul li {
  padding: 8px 0 8px 24px;
  color: var(--muted);
  position: relative;
}
.role-modal-body ul li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--brand-red);
}
.role-modal-footer {
  background: rgba(255,255,255,0.03);
  padding: 20px 32px;
  border-top: 1px solid rgba(255,255,255,0.08);
  color: var(--text);
  font-weight: 600;
}
@media (max-width: 768px) {
  .role-modal-body {
    padding: 24px;
  }
  .hero-image {
    height: 250px;
  }
}

/* Denser mobile layout for cards */
@media (max-width: 520px) {
  .role-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .role-card-image {
    height: 120px;
  }
  .role-card-info {
    padding: 12px;
  }
  .role-card h3 {
    font-size: 1rem;
    margin-bottom: 4px;
  }
  .role-card p {
    font-size: 0.85rem;
  }
}

.benefits-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  margin: 24px 0;
}
.benefit-item {
  background: rgba(255,255,255,0.03);
  padding: 20px;
  border-radius: var(--radius);
  border: 1px solid rgba(255,255,255,0.08);
  text-align: center;
}
.benefit-item{
  /* dunkleres, frosted Glas */
  background:
    linear-gradient(135deg, rgba(188,43,37,.10), rgba(36,58,92,.10)),
    rgba(12,14,18,.62);
  border: 1px solid rgba(255,255,255,.14);
  -webkit-backdrop-filter: blur(14px) saturate(1.25);
  backdrop-filter: blur(14px) saturate(1.25);
  box-shadow: 0 10px 30px rgba(0,0,0,.28);
}
.benefit-item .icon-large {
  font-size: 2.5rem;
  margin-bottom: 12px;
}
.benefit-item h4 {
  margin: 0 0 8px;
  color: var(--brand-red);
}
.benefit-item p {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
}

/* Onboarding Stepper */
.stepper-container {
  background: linear-gradient(135deg, rgba(188,43,37,.08), rgba(36,58,92,.08));
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius);
  padding: 40px 32px;
  margin: 0;
}
.stepper-container{
  background:
    linear-gradient(135deg, rgba(188,43,37,.12), rgba(36,58,92,.12)),
    rgba(12,14,18,.60);
  border: 1px solid rgba(255,255,255,.16);
  -webkit-backdrop-filter: blur(14px) saturate(1.25);
  backdrop-filter: blur(14px) saturate(1.25);
  box-shadow: 0 12px 36px rgba(0,0,0,.30);
}

.stepper-container .stepper::before{
  background: rgba(188,43,37,.35);
}

/* Fallback, wenn kein backdrop-filter unterstützt wird */
@supports not (backdrop-filter: blur(8px)) {
  .benefit-item,
  .stepper-container{
    background: rgba(12,14,18,.88); /* etwas deckender für bessere Lesbarkeit */
  }
}
.stepper {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-top: 32px;
}
.stepper::before {
  content: '';
  position: absolute;
  top: 28px;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(188,43,37,.2);
  z-index: 1;
}
.step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
}
.step-number {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(188,43,37,.3), rgba(36,58,92,.3));
  border: 3px solid rgba(188,43,37,.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--brand-red);
  margin-bottom: 16px;
  transition: all 0.3s;
}
.step:hover .step-number {
  transform: scale(1.1);
  background: linear-gradient(135deg, rgba(188,43,37,.5), rgba(36,58,92,.5));
  border-color: rgba(188,43,37,.8);
}
.step-content {
  text-align: center;
  max-width: 200px;
}
.step-title {
  font-weight: 600;
  color: var(--text);
  margin-bottom: 8px;
  font-size: 1rem;
}
.step-desc {
  font-size: 0.85rem;
  color: var(--muted);
  line-height: 1.5;
}
@media (max-width: 768px) {
  .stepper-container {
    padding: 32px 0;
    overflow: hidden;
  }
  .stepper-container h2,
  .stepper-container .sub {
    padding: 0 24px;
  }
  .stepper {
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    gap: 0;
    margin-top: 24px;
    padding: 0 calc(50% - 120px);
  }
  .stepper::-webkit-scrollbar {
    display: none;
  }
  .stepper::before {
    display: none;
  }
  .step {
    flex: 0 0 240px;
    scroll-snap-align: center;
    padding: 0 12px;
  }
  .step-content {
    max-width: 100%;
  }
}

/* Make benefits grid denser on small screens */
@media (max-width: 520px) {
  .benefits-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .benefit-item {
    padding: 14px;
  }
  .benefit-item .icon-large {
    font-size: 1.8rem;
    margin-bottom: 8px;
  }
  .benefit-item p {
    font-size: 0.85rem;
  }
}

/* Notification Styles */
.notification {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 9999;
  max-width: 420px;
  width: calc(100% - 40px);
  backdrop-filter: blur(12px);
  border-radius: var(--radius);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.notification.success {
  background: linear-gradient(135deg, rgba(34, 139, 34, 0.15), rgba(50, 205, 50, 0.08));
  border: 1px solid rgba(50, 205, 50, 0.3);
}

.notification.error {
  background: linear-gradient(135deg, rgba(188, 43, 37, 0.15), rgba(220, 53, 69, 0.08));
  border: 1px solid rgba(188, 43, 37, 0.3);
}

.notification-content {
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.notification-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.notification.success .notification-icon {
  background: rgba(34, 139, 34, 0.2);
  color: #32cd32;
}

.notification.error .notification-icon {
  background: rgba(188, 43, 37, 0.2);
  color: var(--brand-red);
}

.notification-text {
  flex: 1;
  min-width: 0;
}

.notification-text h4 {
  margin: 0 0 6px;
  color: var(--text);
  font-size: 1rem;
  font-weight: 600;
}

.notification-text p {
  margin: 0;
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.5;
}

.notification-close {
  flex-shrink: 0;
  background: transparent;
  border: none;
  color: var(--muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification-close:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
}

/* Notification Transitions */
.notification-enter-active {
  animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.notification-leave-active {
  animation: slideOutRight 0.3s cubic-bezier(0.4, 0, 1, 1);
}

@keyframes slideInRight {
  from {
    transform: translateX(calc(100% + 40px));
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(calc(100% + 40px));
    opacity: 0;
  }
}

@media (max-width: 640px) {
  .notification {
    top: 20px;
    right: 10px;
    left: 10px;
    width: auto;
    max-width: none;
  }

  .notification-content {
    padding: 16px;
    gap: 12px;
  }

  .notification-icon {
    width: 40px;
    height: 40px;
  }

  .notification-icon svg {
    width: 20px;
    height: 20px;
  }

  .notification-text h4 {
    font-size: 0.95rem;
  }

  .notification-text p {
    font-size: 0.85rem;
  }
}
</style>
