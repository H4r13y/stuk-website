<template>
  <div class="has-bottom-nav">
    <div class="bg"><div class="confetti"></div></div>

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
        <a href="https://stuk-kalender.de/login?redirect=Lw%3D%3D" class="btn ghost" target="_blank" rel="noopener">Login</a>
        <NuxtLink to="/mitmachen" class="btn">Mitmachen</NuxtLink>
      </div>
    </header>

    <main>
      <section class="container" style="padding-top: 40px;">
        <article class="panel">
          <div v-if="pending" style="margin-top: 24px;">
            <p style="color: var(--muted); font-style: italic;">
              Lädt...
            </p>
          </div>

          <div v-else-if="error" style="margin-top: 24px;">
            <h1>Impressum</h1>
            <p style="margin-top: 24px; color: var(--error); font-style: italic;">
              Fehler beim Laden des Impressums. Bitte versuche es später erneut.
            </p>
          </div>

          <div v-else-if="impressum">
            <h1>{{ impressum.data.titel }}</h1>
            <div style="margin-top: 24px;" v-html="renderedContent"></div>
          </div>

          <div v-else style="margin-top: 24px;">
            <h1>Impressum</h1>
            <p style="margin-top: 24px; color: var(--muted); font-style: italic;">
              Kein Impressum verfügbar.
            </p>
          </div>
        </article>
      </section>
    </main>

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
            Nürnberger Straße 42, 04103 Leipzig
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
const config = useRuntimeConfig()
const strapiUrl = config.public.strapiUrl

const { data: impressum, pending, error } = await useAsyncData(
  'impressum',
  async () => {
    try {
      console.log('=== TRYING TO FETCH IMPRESSUM ===')
      console.log('Strapi URL:', strapiUrl)
      console.log('Full URL:', `${strapiUrl}/api/impressum`)

      const response = await $fetch(`${strapiUrl}/api/impressum`)
      console.log('SUCCESS! Response:', response)
      return response
    } catch (err: any) {
      console.error('FETCH ERROR:', err)
      console.error('Error status:', err.status)
      console.error('Error message:', err.message)
      console.error('Error data:', err.data)
      throw err
    }
  }
)

const { renderMarkdown } = useMarkdown()
const renderedContent = ref('')

watchEffect(async () => {
  console.log('=== IMPRESSUM WATCHEFFECT ===')
  console.log('impressum.value:', impressum.value)

  if (impressum.value?.data) {
    console.log('FULL data object:', JSON.stringify(impressum.value.data, null, 2))
    console.log('data keys:', Object.keys(impressum.value.data))
    console.log('data.titel:', impressum.value.data.titel)
    console.log('data.Titel:', impressum.value.data.Titel)
    console.log('data.inhalt:', impressum.value.data.inhalt)
    console.log('data.Inhalt:', impressum.value.data.Inhalt)

    if (impressum.value.data.inhalt || impressum.value.data.Inhalt) {
      const content = impressum.value.data.inhalt || impressum.value.data.Inhalt
      renderedContent.value = await renderMarkdown(content)
    }
  }
})

useHead({
  title: impressum.value?.data?.titel
    ? `StuK – ${impressum.value.data.titel}`
    : 'StuK – Impressum'
})
</script>
