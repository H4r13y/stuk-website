<template>
  <div>
    <section class="container header-section">
      <h1>Kontakt</h1>
      <p class="sub">Wähle, wie wir dir helfen können</p>
    </section>

    <section v-show="!activeForm" class="container" id="options-section">
      <div class="contact-options">
        <div class="contact-card" @click="showForm('general')">
          <div class="icon">
            <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h3>Allgemeine Anfrage</h3>
          <p>Fragen, Feedback oder sonstige Anliegen</p>
        </div>

        <div class="contact-card" @click="showForm('booking')">
          <div class="icon">
            <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
            </svg>
          </div>
          <h3>Buchungsanfrage</h3>
          <p>Künstler, DJs, Bands – ihr möchtet bei uns auftreten?</p>
        </div>

        <div class="contact-card" @click="showForm('lost')">
          <div class="icon">
            <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
          </div>
          <h3>Fundsachen</h3>
          <p>Etwas verloren? Wir helfen dir bei der Suche</p>
        </div>

        <div class="contact-card" @click="showForm('board')">
          <div class="icon">
            <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3>Vorstand kontaktieren</h3>
          <p>Offizielle Anfragen an den Vereinsvorstand</p>
        </div>

        <div class="contact-card" @click="showForm('join')">
          <div class="icon">
            <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <path d="M20 8v6M23 11h-6"/>
            </svg>
          </div>
          <h3>Mitmachen</h3>
          <p>Werde Teil unseres Teams</p>
        </div>

        <div class="contact-card" @click="showForm('awareness')">
          <div class="icon">
            <svg viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h3>Awareness (Anonym)</h3>
          <p>Vorfälle melden – vertraulich und anonym</p>
        </div>
      </div>
    </section>

    <!-- Forms -->
    <section v-if="activeForm === 'general'" class="container contact-form">
      <button class="btn ghost back-btn" @click="showOptions">← Zurück zur Übersicht</button>
      <article class="panel">
        <h2>Allgemeine Anfrage</h2>
        <p class="sub">Schreib uns deine Frage oder dein Anliegen</p>
        <form class="form" @submit.prevent="submitForm('general')">
          <div class="input"><label>Name</label><input v-model="forms.general.name" placeholder="Dein Name" required></div>
          <div class="input"><label>E-Mail</label><input v-model="forms.general.email" type="email" placeholder="du@beispiel.de" required></div>
          <div class="input" style="grid-column:1/-1"><label>Nachricht</label><textarea v-model="forms.general.message" placeholder="Worum geht's?" required></textarea></div>
          <div style="grid-column:1/-1">
            <NuxtTurnstile v-model="turnstileToken" />
          </div>
          <div style="grid-column:1/-1"><button class="btn" type="submit" :disabled="isSubmitting || !turnstileToken">{{ isSubmitting ? 'Wird gesendet...' : 'Senden' }}</button></div>
        </form>
      </article>
    </section>

    <section v-if="activeForm === 'booking'" class="container contact-form">
      <button class="btn ghost back-btn" @click="showOptions">← Zurück zur Übersicht</button>
      <article class="panel">
        <h2>Buchungsanfrage</h2>
        <p class="sub">Erzähl uns von dir und deinem Projekt</p>
        <form class="form" @submit.prevent="submitForm('booking')">
          <h3 style="grid-column:1/-1; margin:0 0 12px; color:var(--text); font-size:1rem">Persönliche Daten</h3>
          <div class="input"><label>Dein Name</label><input v-model="forms.booking.name" placeholder="Bürgerlicher Name" required></div>
          <div class="input"><label>E-Mail</label><input v-model="forms.booking.email" type="email" placeholder="kontakt@beispiel.de" required></div>
          <div class="input"><label>Telefonnummer</label><input v-model="forms.booking.phone" type="tel" placeholder="Optional, aber wünschenswert"></div>

          <h3 style="grid-column:1/-1; margin:24px 0 12px; color:var(--text); font-size:1rem">Termin</h3>
          <div class="input" style="grid-column:1/-1">
            <label>Verbindlichkeit</label>
            <select v-model="forms.booking.binding" required>
              <option value="">Bitte wählen</option>
              <option>Verbindlich für einen konkreten Termin</option>
              <option>Unverbindlich</option>
            </select>
            <small style="display:block; margin-top:6px; color:var(--muted); font-size:0.85rem">
              Wenn du einen konkreten Termin im Auge hast, dann wähle bitte "Verbindlich". Sonst wähle bitte "Unverbindlich".
            </small>
          </div>
          <div class="input"><label>Wunschdatum</label><input v-model="forms.booking.date" type="date" required></div>
          <div class="input"><label>Alternativdatum</label><input v-model="forms.booking.alternativeDate" type="date" placeholder="Falls Wunschtermin nicht möglich"></div>

          <h3 style="grid-column:1/-1; margin:24px 0 12px; color:var(--text); font-size:1rem">Die Band / Der Act</h3>
          <div class="input"><label>Name der Band / des Acts</label><input v-model="forms.booking.bandName" placeholder="Künstlername / Bandname" required></div>
          <div class="input"><label>Stilrichtung</label><input v-model="forms.booking.genre" placeholder="z.B. Techno, Rock, Comedy" required></div>
          <div class="input"><label>Heimatstadt</label><input v-model="forms.booking.hometown" placeholder="Woher kommt ihr?" required></div>
          <div class="input"><label>Anzahl Personen</label><input v-model="forms.booking.members" type="number" min="1" placeholder="Bandgröße / Team-Größe" required></div>
          <div class="input" style="grid-column:1/-1"><label>Webseite / Social Media</label><input v-model="forms.booking.website" placeholder="Instagram, Facebook, Website, SoundCloud, etc."></div>
          <div class="input" style="grid-column:1/-1">
            <label>GEMA-Pflicht</label>
            <select v-model="forms.booking.gema" required>
              <option value="">Bitte wählen</option>
              <option>Ja</option>
              <option>Nein</option>
              <option>Weiß nicht</option>
            </select>
          </div>

          <h3 style="grid-column:1/-1; margin:24px 0 12px; color:var(--text); font-size:1rem">Sonstiges</h3>
          <div class="input" style="grid-column:1/-1">
            <label>Technikrider der Band</label>
            <input type="file" accept=".pdf,.doc,.docx" style="padding:8px">
            <small style="display:block; margin-top:6px; color:var(--muted); font-size:0.85rem">
              Habt Ihr einen eigenen Technikrider? Dann ladet diesen bitte hier hoch.
            </small>
          </div>
          <div class="input" style="grid-column:1/-1"><label>Sonderwünsche / Anmerkungen</label><textarea v-model="forms.booking.notes" placeholder="Besondere Anforderungen, Vorband, weitere Infos, etc." rows="5"></textarea></div>
          <div style="grid-column:1/-1">
            <NuxtTurnstile v-model="turnstileToken" />
          </div>
          <div style="grid-column:1/-1"><button class="btn" type="submit" :disabled="isSubmitting || !turnstileToken">{{ isSubmitting ? 'Wird gesendet...' : 'Anfrage senden' }}</button></div>
        </form>
      </article>
    </section>

    <section v-if="activeForm === 'lost'" class="container contact-form">
      <button class="btn ghost back-btn" @click="showOptions">← Zurück zur Übersicht</button>
      <article class="panel">
        <h2>Fundsachen</h2>
        <p class="sub">Beschreib deinen verlorenen Gegenstand</p>
        <form class="form" @submit.prevent="submitForm('lost')">
          <div class="input"><label>Name</label><input v-model="forms.lost.name" placeholder="Dein Name" required></div>
          <div class="input"><label>E-Mail</label><input v-model="forms.lost.email" type="email" placeholder="du@beispiel.de" required></div>
          <div class="input" style="grid-column:1/-1"><label>Event / Datum</label><input v-model="forms.lost.event" placeholder="z.B. Quizlabor am 2.10." required></div>
          <div class="input" style="grid-column:1/-1"><label>Was hast du verloren?</label><textarea v-model="forms.lost.description" placeholder="Beschreibe den Gegenstand möglichst genau" required></textarea></div>
          <div style="grid-column:1/-1">
            <NuxtTurnstile v-model="turnstileToken" />
          </div>
          <div style="grid-column:1/-1"><button class="btn" type="submit" :disabled="isSubmitting || !turnstileToken">{{ isSubmitting ? 'Wird gesendet...' : 'Anfrage senden' }}</button></div>
        </form>
      </article>
    </section>

    <section v-if="activeForm === 'board'" class="container contact-form">
      <button class="btn ghost back-btn" @click="showOptions">← Zurück zur Übersicht</button>
      <article class="panel">
        <h2>Vorstand kontaktieren</h2>
        <p class="sub">Für offizielle Anfragen und Vereinsangelegenheiten</p>
        <form class="form" @submit.prevent="submitForm('board')">
          <div class="input"><label>Name / Organisation</label><input v-model="forms.board.name" placeholder="Dein Name oder Organisation" required></div>
          <div class="input"><label>E-Mail</label><input v-model="forms.board.email" type="email" placeholder="kontakt@beispiel.de" required></div>
          <div class="input" style="grid-column:1/-1"><label>Betreff</label><input v-model="forms.board.subject" placeholder="Worum geht es?" required></div>
          <div class="input" style="grid-column:1/-1"><label>Nachricht</label><textarea v-model="forms.board.message" placeholder="Dein Anliegen" required></textarea></div>
          <div style="grid-column:1/-1">
            <NuxtTurnstile v-model="turnstileToken" />
          </div>
          <div style="grid-column:1/-1"><button class="btn" type="submit" :disabled="isSubmitting || !turnstileToken">{{ isSubmitting ? 'Wird gesendet...' : 'An Vorstand senden' }}</button></div>
        </form>
      </article>
    </section>

    <section v-if="activeForm === 'join'" class="container contact-form">
      <button class="btn ghost back-btn" @click="showOptions">← Zurück zur Übersicht</button>
      <article class="panel">
        <h2>Mitmachen</h2>
        <p class="sub">Werde Teil unseres Teams</p>
        <form class="form" @submit.prevent="submitForm('join')">
          <div class="input"><label>Name</label><input v-model="forms.join.name" placeholder="Dein Name" required></div>
          <div class="input"><label>E-Mail</label><input v-model="forms.join.email" type="email" placeholder="du@uni.de" required></div>
          <div class="input" style="grid-column:1/-1"><label>Telefonnummer (freiwillig)</label><input v-model="forms.join.phone" type="tel" placeholder="Optional – falls wir dich anrufen sollen"></div>
          <div class="input" style="grid-column:1/-1">
            <label>Bereich</label>
            <select v-model="forms.join.area" required>
              <option value="">Bitte wählen</option>
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
          <div style="grid-column:1/-1"><button class="btn" type="submit" :disabled="isSubmitting || !turnstileToken">{{ isSubmitting ? 'Wird gesendet...' : 'Bewerbung senden' }}</button></div>
        </form>
      </article>
    </section>

    <section v-if="activeForm === 'awareness'" class="container contact-form">
      <button class="btn ghost back-btn" @click="showOptions">← Zurück zur Übersicht</button>
      <article class="panel">
        <h2>Awareness – Anonym melden</h2>
        <p class="sub" style="color:var(--brand-red)">Diese Meldung ist vollständig vertraulich und anonym. Deine Angaben werden nicht gespeichert oder weitergegeben.<br>Du kannst uns auch immer unter awareness@stuk-leipzig.de erreichen!</p>
        <form class="form" @submit.prevent="submitForm('awareness')">
          <div class="input" style="grid-column:1/-1"><label>Event / Datum (optional)</label><input v-model="forms.awareness.event" placeholder="z.B. Dienstagsparty am 7.10."></div>
          <div class="input" style="grid-column:1/-1"><label>Was ist passiert?</label><textarea v-model="forms.awareness.description" placeholder="Beschreibe den Vorfall. Du kannst anonym bleiben." required style="min-height:200px"></textarea></div>
          <div style="grid-column:1/-1">
            <NuxtTurnstile v-model="turnstileToken" />
          </div>
          <div style="grid-column:1/-1">
            <p style="font-size:0.85rem; color:var(--muted); margin-bottom:12px">
              <strong>Hinweis:</strong> Diese Meldung ist anonym. Wenn du eine Rückmeldung wünschst, gib bitte freiwillig eine Kontaktmöglichkeit an.
            </p>
            <button class="btn" type="submit" :disabled="isSubmitting || !turnstileToken">{{ isSubmitting ? 'Wird gesendet...' : 'Anonym senden' }}</button>
          </div>
        </form>
      </article>
    </section>

    <section class="container address-section">
      <h2>Adresse & Öffnungszeiten</h2>
      <div class="panel address-grid">
        <div>
          <h3>StuK Leipzig</h3>
          <p>Nürnberger Straße 42<br>04103 Leipzig</p>
          <p class="sub">info@stuk-leipzig.de</p>
        </div>
        <div>
          <h3>Öffnungszeiten</h3>
          <p>Abendbetrieb zu Eventzeiten<br>Infos siehe <NuxtLink to="/" style="color:var(--brand-red)">Programm</NuxtLink></p>
        </div>
      </div>
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
  </div>
</template>

<script setup lang="ts">
// Für die Ziel-Mails und die Texte: stuk-website\strapi-website\src\api\kontakt\controllers\kontakt.ts
import { ref } from 'vue'

useHead({
  title: 'StuK – Kontakt',
  meta: [
    { name: 'description', content: 'Kontaktiere den StuK Leipzig' }
  ]
})

const config = useRuntimeConfig()
const strapiUrl = config.public.strapiUrl
const emailToken = config.public.emailStrapiToken

const activeForm = ref<string | null>(null)
const isSubmitting = ref(false)
const submitError = ref<string | null>(null)
const submitSuccess = ref(false)

// Turnstile Token
const turnstileToken = ref<string | null>(null)

// Notification state
const showNotification = ref(false)
const notificationType = ref<'success' | 'error'>('success')
const notificationTitle = ref('')
const notificationMessage = ref('')

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

  // Auto-close nach 8 Sekunden (Fehler etwas länger anzeigen)
  setTimeout(() => {
    closeNotification()
  }, 8000)
}

function closeNotification() {
  showNotification.value = false
}

const forms = ref({
  general: {
    name: '',
    email: '',
    message: ''
  },
  booking: {
    name: '',
    email: '',
    phone: '',
    binding: '',
    date: '',
    alternativeDate: '',
    bandName: '',
    genre: '',
    hometown: '',
    members: '',
    website: '',
    gema: '',
    notes: ''
  },
  lost: {
    name: '',
    email: '',
    event: '',
    description: ''
  },
  board: {
    name: '',
    email: '',
    subject: '',
    message: ''
  },
  join: {
    name: '',
    email: '',
    phone: '',
    area: ''
  },
  awareness: {
    event: '',
    description: ''
  }
})

const showForm = (formType: string) => {
  activeForm.value = formType
  submitError.value = null
  submitSuccess.value = false
}

const showOptions = () => {
  activeForm.value = null
  submitError.value = null
  submitSuccess.value = false
}

const submitForm = async (formType: string) => {
  isSubmitting.value = true
  submitError.value = null
  submitSuccess.value = false

  const successMessages: Record<string, { title: string; message: string }> = {
    general: {
      title: 'Nachricht gesendet!',
      message: 'Vielen Dank für deine Nachricht. Wir melden uns bald bei dir.'
    },
    booking: {
      title: 'Buchungsanfrage erhalten!',
      message: 'Wir prüfen deine Anfrage und melden uns schnellstmöglich bei dir.'
    },
    lost: {
      title: 'Anfrage erhalten!',
      message: 'Wir schauen nach deinem verlorenen Gegenstand und melden uns bei dir.'
    },
    board: {
      title: 'An Vorstand weitergeleitet!',
      message: 'Deine Nachricht wurde erfolgreich an den Vorstand weitergeleitet.'
    },
    join: {
      title: 'Bewerbung erhalten!',
      message: 'Vielen Dank für dein Interesse! Wir melden uns zeitnah bei dir.'
    },
    awareness: {
      title: 'Meldung übermittelt',
      message: 'Deine Meldung wurde anonym übermittelt. Danke für dein Vertrauen.'
    }
  }

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
        formType,
        data: forms.value[formType as keyof typeof forms.value],
        turnstileToken: turnstileToken.value,
      },
    })

    if (response && response.success) {
      submitSuccess.value = true

      const { title, message } = successMessages[formType] || {
        title: 'Erfolgreich gesendet!',
        message: 'Deine Nachricht wurde erfolgreich versendet.'
      }

      showSuccessNotification(title, message)

      // Formular zurücksetzen
      const formKeys = Object.keys(forms.value[formType as keyof typeof forms.value])
      formKeys.forEach(key => {
        ;(forms.value[formType as keyof typeof forms.value] as any)[key] = ''
      })

      // Turnstile Token zurücksetzen
      turnstileToken.value = null

      // Nach 2 Sekunden zurück zur Übersicht
      setTimeout(() => {
        showOptions()
      }, 2000)
    }
  } catch (error: any) {
    console.error('=== Frontend E-Mail Fehler ===')
    console.error('Full Error:', error)
    console.error('Error Data:', error.data)
    console.error('Error Response:', error.response)

    const errorMessage = error.data?.error || error.data?.message || error.message || 'Unbekannter Fehler'
    submitError.value = errorMessage

    showErrorNotification(
      'Fehler beim Senden',
      'Die Nachricht konnte nicht versendet werden. Bitte versuche es später erneut oder kontaktiere uns direkt per E-Mail.'
    )
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.container {
 margin-top: 0px;
 padding-top: 0px;
}

.header-section {
  padding-top: 0px;
}

@media (max-width: 640px) {
  .header-section {
    padding-top: 0px;
  }
}

.address-section {
  margin-top: 0px;
}

@media (max-width: 640px) {
  .address-section {
    margin-top: 0px;
  }
}

.contact-options {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(3, 1fr);
  margin: 32px 0;
}

@media (max-width: 1000px) {
  .contact-options {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .contact-options {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin: 0px 0;
  }
}


.contact-card {
  background: linear-gradient(180deg, #111215, #0f1012);
  border: 1px solid #ffffff14;
  border-radius: var(--radius);
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.contact-card:hover {
  transform: translateY(-4px);
  border-color: rgba(188, 43, 37, 0.4);
  box-shadow: 0 12px 32px rgba(188, 43, 37, 0.2);
}

.contact-card .icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(188, 43, 37, 0.15), rgba(36, 58, 92, 0.15));
  border-radius: 50%;
  border: 2px solid rgba(188, 43, 37, 0.3);
}

.contact-card .icon svg {
  width: 32px;
  height: 32px;
  stroke: var(--brand-red);
  fill: none;
}

.contact-card h3 {
  color: var(--text);
  margin-bottom: 8px;
  font-size: 1.1rem;
}

.contact-card p {
  color: var(--muted);
  font-size: 0.9rem;
  margin: 0;
}

.contact-form {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.back-btn {
  margin-bottom: 20px;
}

.address-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (max-width: 640px) {
  .address-grid {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .address-grid > div {
    width: 100%;
    min-width: 0;
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
