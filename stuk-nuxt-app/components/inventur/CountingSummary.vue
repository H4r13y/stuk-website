<script setup lang="ts">
const {
  session,
  progress,
  isSubmitting,
  isSubmitted,
  submitProgress,
  submitTotal,
  submitInventur,
  getTotal,
  step,
  resetAll,
} = useInventur()

const items = computed(() => {
  if (!session.value) return []
  return Object.values(session.value.counts)
    .sort((a, b) => {
      // Counted items first, then alphabetical
      const aCounted = a.kaesten > 0 || a.einzelflaschen > 0
      const bCounted = b.kaesten > 0 || b.einzelflaschen > 0
      if (aCounted !== bCounted) return bCounted ? 1 : -1
      return a.name.localeCompare(b.name)
    })
})

const uncountedItems = computed(
  () => items.value.filter((i) => i.kaesten === 0 && i.einzelflaschen === 0)
)
</script>

<template>
  <div class="summary-page">
    <!-- Success Screen -->
    <div v-if="isSubmitted" class="summary-success">
      <div class="success-icon">&#10003;</div>
      <h2>Zählung abgeschlossen!</h2>
      <p class="success-detail">{{ submitTotal }} Artikel übermittelt.</p>
      <button class="btn-reset" @click="resetAll">Neue Zählung</button>
    </div>

    <!-- Summary -->
    <template v-else>
      <header class="summary-header">
        <button class="back-btn" @click="step = 'counting'">&larr;</button>
        <h2 class="summary-title">Zusammenfassung</h2>
      </header>

      <div v-if="uncountedItems.length > 0" class="summary-warning">
        &#9888; {{ uncountedItems.length }} Artikel nicht gezählt
      </div>

      <main class="summary-list">
        <div
          v-for="item in items"
          :key="item.getraenkDocumentId"
          class="summary-item"
          :class="{ uncounted: item.kaesten === 0 && item.einzelflaschen === 0 }"
        >
          <span class="item-name">{{ item.name }}</span>
          <span class="item-detail">
            <template v-if="item.kaesten > 0 || item.einzelflaschen > 0">
              {{ item.kaesten }}K + {{ item.einzelflaschen }}E = <strong>{{ getTotal(item) }}</strong>
            </template>
            <template v-else>
              <span class="not-counted">—</span>
            </template>
          </span>
        </div>
      </main>

      <div class="summary-footer">
        <div v-if="isSubmitting" class="submit-progress">
          <div class="submit-bar">
            <div
              class="submit-fill"
              :style="{ width: submitTotal > 0 ? `${(submitProgress / submitTotal) * 100}%` : '0%' }"
            />
          </div>
          <span class="submit-text">{{ submitProgress }}/{{ submitTotal }}</span>
        </div>

        <button
          v-else
          class="btn-final-submit"
          :disabled="progress.done === 0"
          @click="submitInventur"
        >
          Zählung abschließen ({{ progress.done }} Artikel)
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.summary-page {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  overflow: hidden;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid var(--border);
}

.back-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: #16181f;
  color: var(--text);
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  -webkit-tap-highlight-color: transparent;
}

.back-btn:active {
  background: #1e2029;
}

.summary-title {
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0;
}

.summary-warning {
  padding: 12px 16px;
  background: rgba(245, 158, 11, 0.1);
  border-bottom: 1px solid rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  font-size: 0.9rem;
  font-weight: 600;
}

.summary-list {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 8px 16px 100px;
  -webkit-overflow-scrolling: touch;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #ffffff0a;
}

.summary-item.uncounted {
  opacity: 0.5;
}

.item-name {
  font-weight: 600;
  font-size: 0.95rem;
  flex: 1;
  margin-right: 12px;
}

.item-detail {
  font-size: 0.85rem;
  color: var(--muted);
  white-space: nowrap;
}

.item-detail strong {
  color: var(--text);
}

.not-counted {
  color: #f59e0b;
}

.summary-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
  background: rgba(10, 11, 13, 0.95);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--border);
}

.btn-final-submit {
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
  transition: transform 0.1s, opacity 0.2s;
}

.btn-final-submit:active {
  transform: scale(0.97);
}

.btn-final-submit:disabled {
  opacity: 0.4;
  cursor: default;
}

.submit-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.submit-bar {
  flex: 1;
  height: 6px;
  background: var(--border);
  border-radius: 3px;
  overflow: hidden;
}

.submit-fill {
  height: 100%;
  background: var(--grad);
  transition: width 0.2s;
}

.submit-text {
  font-size: 0.85rem;
  color: var(--muted);
  font-weight: 600;
}

/* Success Screen */
.summary-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: 24px;
  text-align: center;
}

.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.15);
  border: 2px solid #22c55e;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #22c55e;
  margin-bottom: 20px;
}

.summary-success h2 {
  margin: 0 0 8px;
  font-size: 1.5rem;
}

.success-detail {
  color: var(--muted);
  margin: 0 0 32px;
}

.btn-reset {
  padding: 14px 32px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: #16181f;
  color: var(--text);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.btn-reset:active {
  background: #1e2029;
}
</style>
