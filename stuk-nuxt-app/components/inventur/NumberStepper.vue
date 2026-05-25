<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  label: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
  'open-numpad': []
}>()

let longPressTimer: ReturnType<typeof setInterval> | null = null

function increment() {
  emit('update:modelValue', props.modelValue + 1)
  vibrate()
}

function decrement() {
  if (props.modelValue <= 0) return
  emit('update:modelValue', props.modelValue - 1)
  vibrate()
}

function startLongPress(direction: 'up' | 'down') {
  let count = 0
  longPressTimer = setInterval(() => {
    count++
    if (direction === 'up') {
      emit('update:modelValue', props.modelValue + 1)
    } else if (props.modelValue > 0) {
      emit('update:modelValue', props.modelValue - 1)
    }
    if (count === 1) vibrate()
  }, 120)
}

function stopLongPress() {
  if (longPressTimer) {
    clearInterval(longPressTimer)
    longPressTimer = null
  }
}

function vibrate() {
  if (navigator?.vibrate) navigator.vibrate(8)
}
</script>

<template>
  <div class="stepper">
    <span class="stepper-label">{{ label }}</span>
    <div class="stepper-controls">
      <button
        class="stepper-btn minus"
        :disabled="modelValue <= 0"
        @click="decrement"
        @pointerdown="startLongPress('down')"
        @pointerup="stopLongPress"
        @pointerleave="stopLongPress"
      >
        &minus;
      </button>
      <button class="stepper-value" @click="emit('open-numpad')">
        {{ modelValue }}
      </button>
      <button
        class="stepper-btn plus"
        @click="increment"
        @pointerdown="startLongPress('up')"
        @pointerup="stopLongPress"
        @pointerleave="stopLongPress"
      >
        +
      </button>
    </div>
  </div>
</template>

<style scoped>
.stepper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stepper-label {
  font-size: 0.75rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stepper-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stepper-btn {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: #16181f;
  color: var(--text);
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.1s, transform 0.1s;
}

.stepper-btn:active {
  transform: scale(0.92);
  background: #1e2029;
}

.stepper-btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.stepper-btn.plus {
  background: #1a2a1a;
  border-color: #2a4a2a;
}

.stepper-btn.plus:active {
  background: #2a3a2a;
}

.stepper-value {
  min-width: 48px;
  height: 44px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  padding: 0 12px;
}

.stepper-value:active {
  border-color: var(--brand-red);
}
</style>
