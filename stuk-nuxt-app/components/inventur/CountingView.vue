<script setup lang="ts">
import type { Lager } from '~/types'

const {
  session,
  progress,
  groupedArticles,
  sortMode,
  viewMode,
  isLoading,
  lagerOptions,
  updateCount,
  selectLager,
  resetCounts,
  step,
} = useInventur()

const showLagerModal = ref(false)

function onSelectLager(lager: Lager) {
  showLagerModal.value = false
  selectLager(lager)
}

function confirmResetCounts() {
  if (confirm('Alle Zählungen für dieses Lager zurücksetzen?')) {
    resetCounts()
  }
}
</script>

<template>
  <div class="counting-page">
    <!-- Sticky Header -->
    <header class="counting-header">
      <div class="header-row">
        <span class="header-lager">{{ session?.lagerName }}</span>
        <span class="header-progress">{{ progress.done }}/{{ progress.total }}</span>
        <button
          class="header-toggle"
          @click="viewMode = viewMode === 'gross' ? 'kompakt' : 'gross'"
        >
          {{ viewMode === 'gross' ? 'Kompakt' : 'Groß' }}
        </button>
        <button
          class="header-toggle"
          @click="sortMode = sortMode === 'kategorie' ? 'alphabetisch' : 'kategorie'"
        >
          {{ sortMode === 'kategorie' ? 'A-Z' : 'Kat.' }}
        </button>
      </div>
      <div class="header-actions">
        <button class="header-action" @click="showLagerModal = true">
          Lager wechseln
        </button>
        <button class="header-action danger" @click="confirmResetCounts">
          Zurücksetzen
        </button>
      </div>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: progress.total > 0 ? `${(progress.done / progress.total) * 100}%` : '0%' }"
        />
      </div>
    </header>

    <!-- Articles -->
    <main class="counting-list">
      <div v-if="isLoading" class="counting-loading">Lade Artikel...</div>

      <template v-else>
        <InventurCategoryGroup
          v-for="group in groupedArticles"
          :key="group.kategorie"
          :name="group.kategorie"
          :items="group.items"
          :compact="viewMode === 'kompakt'"
          @update="(docId, field, value) => updateCount(docId, field, value)"
        />
      </template>
    </main>

    <!-- Floating action -->
    <div class="counting-footer">
      <button class="btn-submit" @click="step = 'summary'">
        Zur Zusammenfassung ({{ progress.done }})
      </button>
    </div>

    <!-- Lager wechseln Modal -->
    <div v-if="showLagerModal" class="lager-modal-overlay" @click.self="showLagerModal = false">
      <div class="lager-modal">
        <h3 class="lager-modal-title">Lager wechseln</h3>
        <div class="lager-modal-options">
          <button
            v-for="lager in lagerOptions"
            :key="lager.id"
            class="lager-modal-btn"
            :class="{ active: lager.documentId === session?.lagerDocumentId }"
            @click="onSelectLager(lager)"
          >
            {{ lager.name }}
          </button>
        </div>
        <button class="lager-modal-cancel" @click="showLagerModal = false">
          Abbrechen
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.counting-page {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
}

.counting-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10, 11, 13, 0.95);
  backdrop-filter: blur(10px);
  padding: 12px 16px 0;
  border-bottom: 1px solid var(--border);
}

.header-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.header-lager {
  font-weight: 800;
  font-size: 1.1rem;
  flex: 1;
}

.header-progress {
  font-size: 0.9rem;
  color: var(--muted);
  font-weight: 600;
}

.header-toggle {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: #16181f;
  color: var(--text);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.header-toggle:active {
  background: #1e2029;
}

.header-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.header-action {
  padding: 4px 10px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--muted);
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.header-action:active {
  background: #1e2029;
}

.header-action.danger {
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.header-action.danger:active {
  background: rgba(239, 68, 68, 0.1);
}

.progress-bar {
  height: 3px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--grad);
  transition: width 0.3s ease;
}

.counting-list {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 12px 12px 100px;
  -webkit-overflow-scrolling: touch;
}

.counting-loading {
  text-align: center;
  color: var(--muted);
  padding: 40px;
}

.counting-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
  background: rgba(10, 11, 13, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--border);
}

.btn-submit {
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  border: none;
  background: var(--grad);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.1s;
}

.btn-submit:active {
  transform: scale(0.97);
}

/* Lager Modal */
.lager-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.lager-modal {
  background: #13151a;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 340px;
}

.lager-modal-title {
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0 0 16px;
  text-align: center;
}

.lager-modal-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lager-modal-btn {
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: linear-gradient(135deg, #ffffff0a, #ffffff05);
  color: var(--text);
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 0.1s, border-color 0.15s;
}

.lager-modal-btn:active {
  transform: scale(0.96);
}

.lager-modal-btn.active {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.08);
}

.lager-modal-cancel {
  width: 100%;
  margin-top: 12px;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: var(--muted);
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.lager-modal-cancel:active {
  background: #1e2029;
}
</style>
