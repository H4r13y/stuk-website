<template>
  <main>
    <section class="bday-hero">
      <div class="bday-content">
        <h1>30 Jahre StuK – sei dabei! 🎉</h1>

        <!-- Infotext -->
        <p class="message">
          Der StuK wird 30! Damit wir dich zur großen Geburtstagsfeier einladen können und
          gleich einen Überblick haben, wer dabei ist, trag dich hier ganz unkompliziert
          vorab ein. Egal ob (ehemaliges) Mitglied oder Freund:in des Clubs – wir freuen uns
          auf dich!
        </p>

        <!-- Link zum Bilder-Upload -->
        <div class="upload-box">
          <p>
            📸 <strong>Alte Fotos vom StuK?</strong><br>
            Lade deine Bilder und Erinnerungen hier hoch:
          </p>
          <a :href="uploadLink" target="_blank" rel="noopener noreferrer" class="btn ghost upload-link">
            Bilder hochladen
          </a>
        </div>

        <h3 style="color: var(--text); margin: 32px 0 16px;">Vor-Anmeldung</h3>

        <form class="form" style="text-align: left;" @submit.prevent="submitForm">
          <div class="input">
            <label>Vorname &amp; Name</label>
            <input v-model="formData.fullName" placeholder="Vorname Nachname" required>
          </div>
          <div class="input">
            <label>Spitzname (optional)</label>
            <input v-model="formData.nickname" placeholder="Falls wir dich so kennen">
          </div>

          <!-- Auswahl -->
          <div class="input" style="grid-column:1/-1">
            <label>Ich möchte …</label>
            <label class="check-row">
              <input type="checkbox" v-model="formData.wantInvitation">
              <span>… eine Einladung zum 30. Geburtstag bekommen</span>
            </label>
            <label class="check-row">
              <input type="checkbox" v-model="formData.planToAttend">
              <span>… voraussichtlich teilnehmen</span>
            </label>
          </div>

          <!-- Mitgliedschaft -->
          <div class="input" style="grid-column:1/-1">
            <label>Mitgliedschaft</label>
            <label class="check-row">
              <input type="radio" value="member" v-model="formData.membershipStatus">
              <span>Ich war mal Mitglied</span>
            </label>
            <label class="check-row">
              <input type="radio" value="nonMember" v-model="formData.membershipStatus">
              <span>Ich war kein Mitglied</span>
            </label>
          </div>

          <!-- Bedingtes Feld: ehemaliges Mitglied -->
          <div v-if="formData.membershipStatus === 'member'" class="input" style="grid-column:1/-1">
            <label>Ca. Zeitraum, in dem ich Mitglied war</label>
            <input v-model="formData.memberTime" placeholder="z.B. 2008–2012">
          </div>

          <!-- Bedingtes Feld: kein Mitglied -->
          <div v-if="formData.membershipStatus === 'nonMember'" class="input" style="grid-column:1/-1">
            <label>Ich möchte trotzdem eingeladen werden, weil …</label>
            <textarea v-model="formData.nonMemberReason" placeholder="Erzähl uns kurz, wie du mit dem StuK verbunden bist"></textarea>
          </div>

          <div class="input" style="grid-column:1/-1">
            <label>E-Mail-Adresse</label>
            <input v-model="formData.email" type="email" placeholder="du@beispiel.de" required>
          </div>

          <!-- DSGVO -->
          <div class="input dsgvo" style="grid-column:1/-1">
            <label class="check-row">
              <input type="checkbox" v-model="formData.dsgvo" required>
              <span>
                Ich bin damit einverstanden, dass meine hier angegebenen Daten zum Zweck der
                Organisation der 30-Jahr-Feier gespeichert und verarbeitet werden. Die Daten
                werden nicht an Dritte weitergegeben und können jederzeit durch eine formlose
                Nachricht an <a href="mailto:vorstand@stuk-leipzig.de">vorstand@stuk-leipzig.de</a>
                gelöscht werden. Weitere Informationen findest du in unserer
                <NuxtLink to="/datenschutz" style="color:var(--brand-red)">Datenschutzerklärung</NuxtLink>.
              </span>
            </label>
          </div>

          <div style="grid-column:1/-1">
            <NuxtTurnstile v-model="turnstileToken" />
          </div>
          <div style="grid-column:1/-1">
            <button class="btn" type="submit" :disabled="isSubmitting || !turnstileToken || !formData.dsgvo">
              {{ isSubmitting ? 'Wird gesendet...' : 'Vor-Anmeldung absenden' }}
            </button>
          </div>
        </form>
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
  </main>
</template>

<script setup lang="ts">
// Ziel-Mail und Mailtext: stuk-website\strapi-website\src\api\kontakt\controllers\kontakt.ts (formType 'bday30')
import { ref, watch } from 'vue'

useHead({
  title: 'StuK – 30 Jahre: Vor-Anmeldung',
  meta: [
    { name: 'description', content: 'Vor-Anmeldung zur 30-Jahr-Feier des StuK Leipzig' }
  ]
})

const config = useRuntimeConfig()
const strapiUrl = config.public.strapiUrl
const emailToken = config.public.emailStrapiToken

// TODO: Hier den echten Upload-Link (z.B. Cloud-Ordner) eintragen
const uploadLink = 'https://cloud.stuk-leipzig.de/'

// Form data
const formData = ref({
  fullName: '',
  nickname: '',
  wantInvitation: false,
  planToAttend: false,
  membershipStatus: '',
  memberTime: '',
  nonMemberReason: '',
  email: '',
  dsgvo: false,
})

// Bedingte Felder leeren, wenn sich die Auswahl ändert
watch(() => formData.value.membershipStatus, (status) => {
  if (status !== 'member') formData.value.memberTime = ''
  if (status !== 'nonMember') formData.value.nonMemberReason = ''
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

function showSuccessNotification(title: string, message: string) {
  notificationType.value = 'success'
  notificationTitle.value = title
  notificationMessage.value = message
  showNotification.value = true
  setTimeout(() => { closeNotification() }, 5000)
}

function showErrorNotification(title: string, message: string) {
  notificationType.value = 'error'
  notificationTitle.value = title
  notificationMessage.value = message
  showNotification.value = true
  setTimeout(() => { closeNotification() }, 8000)
}

function closeNotification() {
  showNotification.value = false
}

async function submitForm() {
  isSubmitting.value = true

  try {
    if (!turnstileToken.value) {
      showErrorNotification(
        'Captcha erforderlich',
        'Bitte bestätige, dass du kein Roboter bist.'
      )
      return
    }

    if (!formData.value.dsgvo) {
      showErrorNotification(
        'Einwilligung erforderlich',
        'Bitte stimme der Datenverarbeitung zu, um fortzufahren.'
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
        formType: 'bday30',
        data: formData.value,
        turnstileToken: turnstileToken.value,
      },
    })

    if (response && response.success) {
      showSuccessNotification(
        'Vor-Anmeldung erhalten!',
        'Danke! Wir haben dich vorgemerkt und melden uns mit allen Infos zur Feier.'
      )

      formData.value = {
        fullName: '',
        nickname: '',
        wantInvitation: false,
        planToAttend: false,
        membershipStatus: '',
        memberTime: '',
        nonMemberReason: '',
        email: '',
        dsgvo: false,
      }

      turnstileToken.value = null
    }
  } catch (error: any) {
    console.error('=== Frontend E-Mail Fehler (30. Bday) ===')
    console.error('Full Error:', error)
    console.error('Error Data:', error.data)

    showErrorNotification(
      'Fehler beim Senden',
      'Die Vor-Anmeldung konnte nicht versendet werden. Bitte versuche es später erneut oder schreib uns direkt an vorstand@stuk-leipzig.de.'
    )
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.bday-hero {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  padding: 24px 16px;
}
.bday-content {
  max-width: 800px;
  width: 100%;
  padding: 40px;
  background: linear-gradient(180deg, rgba(188,43,37,0.15), rgba(36,58,92,0.15));
  border: 2px solid rgba(188,43,37,0.5);
  border-radius: var(--radius);
  box-shadow: 0 20px 60px rgba(188,43,37,0.3);
}
.bday-content h1 {
  color: var(--brand-red);
  font-size: 1.6rem;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
}
.bday-content .message {
  color: var(--text);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 24px;
}
.upload-box {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--radius);
  padding: 20px;
  margin: 8px 0 8px;
}
.upload-box p {
  margin: 0 0 14px;
  color: var(--text);
  line-height: 1.5;
}
.upload-link {
  display: inline-block;
}
.check-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin: 8px 0;
  cursor: pointer;
  color: var(--text);
  font-weight: normal;
  line-height: 1.4;
}
.check-row input {
  margin-top: 3px;
  width: auto;
  flex-shrink: 0;
}
.dsgvo .check-row span {
  color: var(--muted);
  font-size: 0.85rem;
}
@media (max-width: 640px) {
  .bday-content {
    padding: 24px 18px;
  }
  .bday-content h1 {
    font-size: 1.3rem;
  }
  .bday-content .message {
    font-size: 0.9rem;
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
.notification-enter-active {
  animation: slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.notification-leave-active {
  animation: slideOutRight 0.3s cubic-bezier(0.4, 0, 1, 1);
}
@keyframes slideInRight {
  from { transform: translateX(calc(100% + 40px)); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes slideOutRight {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(calc(100% + 40px)); opacity: 0; }
}
@media (max-width: 640px) {
  .notification {
    top: 20px;
    right: 10px;
    left: 10px;
    width: auto;
    max-width: none;
  }
  .notification-content { padding: 16px; gap: 12px; }
  .notification-icon { width: 40px; height: 40px; }
  .notification-icon svg { width: 20px; height: 20px; }
  .notification-text h4 { font-size: 0.95rem; }
  .notification-text p { font-size: 0.85rem; }
}
</style>
