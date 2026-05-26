<script setup lang="ts">
definePageMeta({ layout: false })

const {
  step,
  lagerOptions,
  isLoading,
  fetchLager,
  selectLager,
  loadSession,
  syncArticles,
} = useInventur()

// Check for existing session on mount
onMounted(async () => {
  const hasSession = loadSession()
  if (hasSession) {
    step.value = 'counting'
    // Neue Artikel aus API nachladen und in Session mergen
    await syncArticles()
  }

  await fetchLager()
})

// Prevent accidental navigation
onBeforeRouteLeave(() => {
  if (step.value === 'counting') {
    return confirm('Zählung verlassen? Deine Daten bleiben gespeichert.')
  }
})

function onPinSuccess() {
  step.value = 'lager'
}
</script>

<template>
  <div class="inventur-app">
    <InventurPinEntry v-if="step === 'pin'" @success="onPinSuccess" />

    <InventurLagerSelect
      v-else-if="step === 'lager'"
      :lager-options="lagerOptions"
      :is-loading="isLoading"
      @select="selectLager"
    />

    <InventurCountingView v-else-if="step === 'counting'" />

    <InventurCountingSummary v-else-if="step === 'summary'" />
  </div>
</template>

<style>
/* Global styles for the inventur page (no scoped - need to override body) */
.inventur-app {
  min-height: 100dvh;
  background: var(--bg);
  color: var(--text);
  font: 16px/1.5 system-ui, -apple-system, Segoe UI, Roboto, Inter, Arial;
  -webkit-font-smoothing: antialiased;
}
</style>

<style scoped>
/* Reset body padding for fullscreen experience */
:deep(body) {
  padding-top: 0 !important;
}
</style>
