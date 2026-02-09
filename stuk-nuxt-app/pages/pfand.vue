<template>
  <main>
    <section class="pfand-hero">
      <div class="pfand-content">
        <div class="pfand-icon">🤭</div>
        <h1>Hupps, du hast ne Pfandmarke geklaut!</h1>

        <p class="message" style="font-size: 1.5rem; margin-bottom: 48px;">
          Jetzt wo du etwas von uns hast, dann werde doch gleich Teil der StuK-Familie 🎉
        </p>

        <h2 style="color: var(--brand-red); margin-bottom: 24px; font-size: 1.8rem;">Warum dem StuK beitreten?</h2>

        <div class="pfand-facts">
          <div class="pfand-fact">
            <div class="number">🎉</div>
            <div class="label">Unvergessliche Partys</div>
          </div>
          <div class="pfand-fact">
            <div class="number">🤝</div>
            <div class="label">Gemeinschaft von Gleichgesinnten</div>
          </div>
          <div class="pfand-fact">
            <div class="number">💪</div>
            <div class="label">Ehrenamtlich Spaß hinter der Bar, am Einlass oder beim Gestalten des Clubs</div>
          </div>
        </div>

        <div class="serious">
          <p style="margin-bottom: 16px;"><strong>Mitgliedschafts-Vorteile:</strong></p>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="padding: 8px 0; color: var(--text);">✓ Tolle Vereinsaktivitäten (Partys, Ausflüge, etc.)</li>
            <li style="padding: 8px 0; color: var(--text);">✓ Einblick in die Leipziger Studentenclubszene</li>
            <li style="padding: 8px 0; color: var(--text);">✓ Tolle Erinnerungen (Wenn man's schafft)</li>
          </ul>
        </div>

        <h3 style="color: var(--text); margin: 48px 0 24px; font-size: 1.5rem;">Interesse? Schreibt uns hier:</h3>

        <form class="form" style="text-align: left;" @submit.prevent="submitForm">
          <div class="input">
            <label>Name</label>
            <input v-model="formData.name" placeholder="Dein Name" required>
          </div>
          <div class="input">
            <label>E-Mail</label>
            <input v-model="formData.email" type="email" placeholder="du@gmail.com" required>
          </div>
          <div class="input" style="grid-column:1/-1">
            <label>Telefonnummer (freiwillig)</label>
            <input v-model="formData.phone" type="tel" placeholder="Optional – falls wir dich anrufen sollen">
          </div>
          <div style="grid-column:1/-1">
            <NuxtTurnstile v-model="turnstileToken" />
          </div>
          <div style="grid-column:1/-1">
            <button class="btn" type="submit" :disabled="isSubmitting || !turnstileToken">
              {{ isSubmitting ? 'Wird gesendet...' : 'Bewerbung senden' }}
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
import { ref } from 'vue'

useHead({
  title: 'StuK – Pfand',
  meta: [
    { name: 'description', content: 'Hupps, du hast ne Pfandmarke geklaut! Werde Teil der StuK-Familie' }
  ]
})

const config = useRuntimeConfig()
const strapiUrl = config.public.strapiUrl
const emailToken = config.public.emailStrapiToken

// Form data
const formData = ref({
  name: '',
  email: '',
  phone: ''
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
        formType: 'pfand',
        data: formData.value,
        turnstileToken: turnstileToken.value,
      },
    })

    if (response && response.success) {
      showSuccessNotification(
        'Bewerbung erhalten!',
        'Danke für dein Interesse! Wir melden uns bald bei dir.'
      )

      // Formular zurücksetzen
      formData.value = {
        name: '',
        email: '',
        phone: ''
      }

      // Turnstile Token zurücksetzen
      turnstileToken.value = null
    }
  } catch (error: any) {
    console.error('=== Frontend E-Mail Fehler (Pfand) ===')
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
</script>

<style scoped>
.pfand-hero {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
}
.pfand-content {
  max-width: 800px;
  padding: 40px;
  background: linear-gradient(180deg, rgba(188,43,37,0.15), rgba(36,58,92,0.15));
  border: 2px solid rgba(188,43,37,0.5);
  border-radius: var(--radius);
  box-shadow: 0 20px 60px rgba(188,43,37,0.3);
}
.pfand-icon {
  font-size: 5rem;
  margin-bottom: 24px;
  animation: shake 0.5s infinite;
}
@keyframes shake {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}
.pfand-content h1 {
  color: var(--brand-red);
  font-size: 2.5rem;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 2px;
}
.pfand-content .message {
  color: var(--text);
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 32px;
}
.pfand-content .serious {
  background: rgba(188,43,37,0.2);
  border-left: 4px solid var(--brand-red);
  padding: 20px;
  margin: 32px 0;
  border-radius: 8px;
}
.pfand-content .serious p {
  margin: 0;
  color: var(--text);
  line-height: 1.7;
}
.pfand-facts {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  margin: 32px 0;
  text-align: left;
}
.pfand-fact {
  background: rgba(255,255,255,0.05);
  padding: 20px;
  border-radius: var(--radius);
  border: 1px solid rgba(255,255,255,0.1);
}
.pfand-fact .number {
  font-size: 2rem;
  font-weight: bold;
  color: var(--brand-red);
  margin-bottom: 8px;
}
.pfand-fact .label {
  color: var(--muted);
  font-size: 0.9rem;
}
@media (max-width: 640px) {
  .pfand-content h1 {
    font-size: 1.8rem;
  }
  .pfand-content .message {
    font-size: 1rem;
  }
  .pfand-icon {
    font-size: 3rem;
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
