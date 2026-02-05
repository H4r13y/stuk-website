<template>
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