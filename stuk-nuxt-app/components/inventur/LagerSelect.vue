<script setup lang="ts">
import type { Lager } from '~/types'

defineProps<{
  lagerOptions: Lager[]
  isLoading: boolean
}>()

const emit = defineEmits<{
  select: [lager: Lager]
}>()
</script>

<template>
  <div class="lager-container">
    <div class="lager-header">
      <h1 class="lager-title">Lager wählen</h1>
      <p class="lager-subtitle">Welchen Standort zählst du?</p>
    </div>

    <div v-if="isLoading" class="lager-loading">Lade Lager...</div>

    <div v-else class="lager-grid">
      <button
        v-for="lager in lagerOptions"
        :key="lager.id"
        class="lager-card"
        @click="emit('select', lager)"
      >
        <span class="lager-name">{{ lager.name }}</span>
        <span v-if="lager.beschreibung" class="lager-desc">{{ lager.beschreibung }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.lager-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: 24px;
}

.lager-header {
  text-align: center;
  margin-bottom: 32px;
}

.lager-title {
  font-size: 1.8rem;
  font-weight: 900;
  margin: 0;
}

.lager-subtitle {
  color: var(--muted);
  margin: 8px 0 0;
}

.lager-loading {
  color: var(--muted);
}

.lager-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 400px;
}

.lager-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: linear-gradient(135deg, #ffffff0a, #ffffff05);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.15s, border-color 0.15s, background 0.15s;
}

.lager-card:active {
  transform: scale(0.96);
  border-color: var(--brand-red);
  background: linear-gradient(135deg, rgba(188, 43, 37, 0.1), rgba(36, 58, 92, 0.1));
}

.lager-name {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text);
}

.lager-desc {
  font-size: 0.9rem;
  color: var(--muted);
  margin-top: 4px;
}

@media (min-width: 640px) {
  .lager-grid {
    flex-direction: row;
    max-width: 600px;
  }

  .lager-card {
    flex: 1;
    padding: 48px 24px;
  }
}
</style>
