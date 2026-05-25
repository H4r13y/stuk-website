<script setup lang="ts">
const emit = defineEmits<{
  success: []
}>()

const { verifyPin } = useInventur()

const entered = ref('')
const error = ref(false)
const PIN_LENGTH = 4

function press(digit: string) {
  if (entered.value.length >= PIN_LENGTH) return
  entered.value += digit
  if (navigator?.vibrate) navigator.vibrate(8)

  if (entered.value.length === PIN_LENGTH) {
    if (verifyPin(entered.value)) {
      emit('success')
    } else {
      error.value = true
      if (navigator?.vibrate) navigator.vibrate([50, 50, 50])
      setTimeout(() => {
        entered.value = ''
        error.value = false
      }, 600)
    }
  }
}

function backspace() {
  entered.value = entered.value.slice(0, -1)
}
</script>

<template>
  <div class="pin-container">
    <div class="pin-header">
      <h1 class="pin-title">Inventur</h1>
      <p class="pin-subtitle">PIN eingeben</p>
    </div>

    <div class="pin-dots" :class="{ shake: error }">
      <span
        v-for="i in PIN_LENGTH"
        :key="i"
        class="dot"
        :class="{ filled: i <= entered.length, error }"
      />
    </div>

    <div class="pin-pad">
      <button v-for="d in ['1','2','3','4','5','6','7','8','9']" :key="d" class="pin-key" @click="press(d)">
        {{ d }}
      </button>
      <div class="pin-key empty" />
      <button class="pin-key" @click="press('0')">0</button>
      <button class="pin-key delete" @click="backspace">&larr;</button>
    </div>
  </div>
</template>

<style scoped>
.pin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100dvh;
  padding: 24px;
}

.pin-header {
  text-align: center;
  margin-bottom: 40px;
}

.pin-title {
  font-size: 1.8rem;
  font-weight: 900;
  margin: 0;
  background: var(--grad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.pin-subtitle {
  color: var(--muted);
  margin: 8px 0 0;
}

.pin-dots {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
}

.pin-dots.shake {
  animation: shake 0.4s ease-in-out;
}

.dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid var(--border);
  transition: background 0.15s, border-color 0.15s;
}

.dot.filled {
  background: var(--text);
  border-color: var(--text);
}

.dot.error {
  background: var(--brand-red);
  border-color: var(--brand-red);
}

.pin-pad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  width: 100%;
  max-width: 280px;
}

.pin-key {
  height: 64px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: #16181f;
  color: var(--text);
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.1s, transform 0.1s;
}

.pin-key:active {
  transform: scale(0.9);
  background: #1e2029;
}

.pin-key.empty {
  border: none;
  background: transparent;
  cursor: default;
}

.pin-key.delete {
  font-size: 1.3rem;
  color: var(--muted);
  border-color: transparent;
  background: transparent;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-6px); }
  80% { transform: translateX(6px); }
}
</style>
