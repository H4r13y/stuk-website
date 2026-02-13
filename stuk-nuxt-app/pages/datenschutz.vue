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
        <div class="markdown-content" v-html="renderedContent"></div>
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
import { ref, computed, watch } from "vue"

const config = useRuntimeConfig()
const strapiUrl = config.public.strapiUrl

// client-only fetch: NICHT awaiten
const { data: datenschutz, error, pending } = useFetch(`${strapiUrl}/api/datenschutz`, {
  server: false,
})

const renderedContent = ref("")

watch(() => datenschutz.value?.data?.Inhalt, async (content) => {
  if (content) {
    const { marked } = await import('marked')
    renderedContent.value = marked.parse(content) as string
  }
}, { immediate: true })

useHead({
  title: computed(() =>
    datenschutz.value?.data?.titel
      ? `StuK – ${datenschutz.value.data.titel}`
      : "StuK – Datenschutz"
  ),
})
</script>

<style scoped>
.markdown-content {
  margin-top: 24px;
  color: var(--text);
  line-height: 1.7;
  overflow-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
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
</style>