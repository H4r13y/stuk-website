<script setup lang="ts">
const props = defineProps<{
  visible: boolean
  label: string
  initialValue: number
}>()

const emit = defineEmits<{
  confirm: [value: number]
  cancel: []
}>()

const display = ref(String(props.initialValue || ''))

watch(
  () => props.visible,
  (v) => {
    if (v) display.value = props.initialValue > 0 ? String(props.initialValue) : ''
  }
)

function press(digit: string) {
  if (display.value.length >= 4) return
  display.value += digit
  if (navigator?.vibrate) navigator.vibrate(5)
}

function backspace() {
  display.value = display.value.slice(0, -1)
}

function confirm() {
  emit('confirm', parseInt(display.value) || 0)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="numpad">
      <div v-if="visible" class="numpad-overlay" @click.self="emit('cancel')">
        <div class="numpad-sheet">
          <div class="numpad-header">
            <span class="numpad-label">{{ label }}</span>
            <button class="numpad-cancel" @click="emit('cancel')">Abbrechen</button>
          </div>

          <div class="numpad-display">
            {{ display || '0' }}
          </div>

          <div class="numpad-grid">
            <button v-for="d in ['1','2','3','4','5','6','7','8','9']" :key="d" class="numpad-key" @click="press(d)">
              {{ d }}
            </button>
            <button class="numpad-key" @click="backspace">&larr;</button>
            <button class="numpad-key" @click="press('0')">0</button>
            <button class="numpad-key confirm" @click="confirm">&check;</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.numpad-overlay {
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.numpad-sheet {
  width: 100%;
  max-width: 400px;
  background: #111316;
  border-top: 1px solid var(--border);
  border-radius: 20px 20px 0 0;
  padding: 20px 16px calc(20px + env(safe-area-inset-bottom, 0px));
}

.numpad-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.numpad-label {
  font-weight: 700;
  color: var(--text);
}

.numpad-cancel {
  background: none;
  border: none;
  color: var(--muted);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 8px;
}

.numpad-display {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--text);
  padding: 16px;
  margin-bottom: 12px;
  background: var(--bg);
  border-radius: 12px;
  border: 1px solid var(--border);
  min-height: 72px;
}

.numpad-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.numpad-key {
  height: 60px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: #16181f;
  color: var(--text);
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.1s, transform 0.1s;
}

.numpad-key:active {
  transform: scale(0.94);
  background: #1e2029;
}

.numpad-key.confirm {
  background: #1a3a1a;
  border-color: #2a5a2a;
  color: #4ade80;
  font-size: 1.6rem;
}

.numpad-key.confirm:active {
  background: #2a4a2a;
}

/* Transition */
.numpad-enter-active,
.numpad-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.numpad-enter-active .numpad-sheet,
.numpad-leave-active .numpad-sheet {
  transition: transform 0.25s cubic-bezier(0.32, 0.72, 0, 1);
}

.numpad-enter-from,
.numpad-leave-to {
  opacity: 0;
}

.numpad-enter-from .numpad-sheet,
.numpad-leave-to .numpad-sheet {
  transform: translateY(100%);
}
</style>
