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
            <h1>Datenschutzerklärung</h1>
            <p style="margin-top: 24px; color: var(--error); font-style: italic;">
              Fehler beim Laden der Datenschutzerklärung. Bitte versuche es später erneut.
            </p>
          </div>

          <div v-else-if="datenschutz">
            <h1>{{ datenschutz.data.titel }}</h1>
            <div style="margin-top: 24px;" v-html="renderedContent"></div>
          </div>

          <div v-else style="margin-top: 24px;">
            <h1>Datenschutzerklärung</h1>
            <p style="margin-top: 24px; color: var(--muted); font-style: italic;">
              Keine Datenschutzerklärung verfügbar.
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
import { ref, computed, watchEffect } from "vue"

const config = useRuntimeConfig()
const strapiUrl = config.public.strapiUrl
const { renderMarkdown } = useMarkdown()

// client-only fetch: NICHT awaiten
const { data: datenschutz, error, pending } = useFetch(`${strapiUrl}/api/datenschutz`, {
  server: false,
})

const renderedContent = ref("")

watchEffect(async () => {
  // nur im Browser rendern
  if (!process.client) return

  const md = datenschutz.value?.data?.Inhalt
  renderedContent.value = md ? await renderMarkdown(md) : ""
})

useHead({
  title: computed(() =>
    datenschutz.value?.data?.titel
      ? `StuK – ${datenschutz.value.data.titel}`
      : "StuK – Datenschutz"
  ),
})
</script>