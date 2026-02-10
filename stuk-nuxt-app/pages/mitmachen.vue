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
          <p>Mitgliederpreise an der Bar während deiner Schichten</p>
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
              <div class="step-desc">Mach zwei Probedienste und schau, ob es dir gefällt</div>
            </div>
          </div>

          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <div class="step-title">Anwärter</div>
              <div class="step-desc">Du bist jetzt Anwärter und Teil des Teams</div>
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
          @click="openRoleModal(key)"
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
          <label>Bereich</label>
          <select v-model="formData.bereich" required>
            <option value="">Bitte wählen...</option>
            <option>Bar</option>
            <option>Einlass</option>
            <option>Technik</option>
            <option>Booking</option>
            <option>Design</option>
            <option>Orga</option>
          </select>
        </div>
        <div style="grid-column:1/-1">
          <NuxtTurnstile v-model="turnstileToken" />
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
    <div v-if="modalActive" class="role-modal active" @click="closeModalOnBackdrop">
      <div class="role-modal-content">
        <button class="close-role-modal" @click="closeRoleModal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
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
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

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
const formData = ref({
  name: '',
  email: '',
  phone: '',
  bereich: ''
})

// Turnstile Token
const turnstileToken = ref<string | null>(null)

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

// Role data
const roles = {
  bar: {
    title: 'Bar',
    subtitle: 'Mixen, ausschenken, Stimmung machen',
    image: '/bilder/WhatsApp Image 2025-10-16 at 11.28.59 (1).jpeg',
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
    image: '/bilder/WhatsApp Image 2025-10-16 at 11.29.04.jpeg',
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
    image: '/bilder/WhatsApp Image 2025-10-16 at 11.28.58 (2).jpeg',
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
    image: '/bilder/WhatsApp Image 2025-10-16 at 11.28.58 (1).jpeg',
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
    image: '/bilder/WhatsApp Image 2025-10-16 at 11.28.59.jpeg',
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
    image: '/bilder/WhatsApp Image 2025-10-16 at 11.29.03.jpeg',
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
}

const selectedRole = computed(() => {
  return selectedRoleKey.value ? roles[selectedRoleKey.value as keyof typeof roles] : null
})

// Methods
function openRoleModal(roleKey: string) {
  selectedRoleKey.value = roleKey
  modalActive.value = true
}

function closeRoleModal() {
  modalActive.value = false
  selectedRoleKey.value = null
}

function closeModalOnBackdrop(event: MouseEvent) {
  if ((event.target as HTMLElement).classList.contains('role-modal')) {
    closeRoleModal()
  }
}

function showSuccessNotification(title: string, message: string) {
  notificationType.value = 'success'
  notificationTitle.value = title
  notificationMessage.value = message
  showNotification.value = true

  // Auto-close nach 5 Sekunden
  setTimeout(() => {
    closeNotification()
  }, 5000)
}

function showErrorNotification(title: string, message: string) {
  notificationType.value = 'error'
  notificationTitle.value = title
  notificationMessage.value = message
  showNotification.value = true

  // Auto-close nach 8 Sekunden
  setTimeout(() => {
    closeNotification()
  }, 8000)
}

function closeNotification() {
  showNotification.value = false
}

async function submitForm() {
  isSubmitting.value = true

  try {
    // Validiere Turnstile Token
    if (!turnstileToken.value) {
      showErrorNotification(
        'Captcha erforderlich',
        'Bitte bestätige, dass du kein Roboter bist.'
      )
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
          area: formData.value.bereich,
        },
        turnstileToken: turnstileToken.value,
      },
    })

    if (response && response.success) {
      showSuccessNotification(
        'Bewerbung erhalten!',
        'Danke für dein Interesse! Wir melden uns zeitnah bei dir.'
      )

      // Formular zurücksetzen
      formData.value = {
        name: '',
        email: '',
        phone: '',
        bereich: ''
      }

      // Turnstile Token zurücksetzen
      turnstileToken.value = null
    }
  } catch (error: any) {
    console.error('=== Frontend E-Mail Fehler (Mitmachen) ===')
    console.error('Full Error:', error)
    console.error('Error Data:', error.data)

    showErrorNotification(
      'Fehler beim Senden',
      'Die Bewerbung konnte nicht versendet werden. Bitte versuche es später erneut oder kontaktiere uns direkt per E-Mail.'
    )
  } finally {
    isSubmitting.value = false
  }
}

// Handle Escape key
onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalActive.value) {
      closeRoleModal()
    }
  })
})
</script>

<style scoped>
.formular {
  margin: 0px auto 24px auto;
}

.hero-image {
  width: 100%;
  height: 350px;
  background-size: cover;
  background-position: center;
  border-radius: var(--radius);
  margin-bottom: 32px;
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
  z-index: 2000;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
  opacity: 0;
  transition: opacity 0.3s;
}
.role-modal.active {
  display: flex;
  opacity: 1;
  animation: fadeIn 0.3s ease-in-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.role-modal-content {
  background: linear-gradient(180deg, #111215, #0f1012);
  border: 1px solid #ffffff14;
  border-radius: var(--radius);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  animation: slideUp 0.3s ease-out;
}
@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
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
.close-role-modal {
  position: absolute;
  top: 16px;
  right: 16px;
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
  z-index: 10;
  transition: all 0.2s;
}
.close-role-modal:hover {
  background: rgba(188,43,37,.9);
  transform: scale(1.1);
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
  .role-modal-header {
    height: 200px;
  }
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
  margin: 48px 0;
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
  .stepper {
    flex-direction: column;
    gap: 32px;
  }
  .stepper::before {
    display: none;
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
