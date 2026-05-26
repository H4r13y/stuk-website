<script setup lang="ts">
const props = defineProps<{
  modelValue: number
  label: string
  showFiveButtons?: boolean
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

function incrementFive() {
  emit('update:modelValue', props.modelValue + 5)
  vibrate()
}

function decrementFive() {
  emit('update:modelValue', Math.max(0, props.modelValue - 5))
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
        v-if="showFiveButtons"
        class="stepper-btn five minus"
        :disabled="modelValue <= 0"
        @click="decrementFive"
      >
        -5
      </button>
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
      <button
        v-if="showFiveButtons"
        class="stepper-btn five plus"
        @click="incrementFive"
      >
        +5
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
  width: 100%;
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
  justify-content: center;
  gap: 6px;
  width: 100%;
}

.stepper-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: #16181f;
  color: var(--text);
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  transition: background 0.1s, transform 0.1s;
  flex-shrink: 0;
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

.stepper-btn.five {
  width: 38px;
  height: 38px;
  font-size: 0.8rem;
  font-weight: 700;
}

.stepper-btn.five.minus {
  background: #2a1a1a;
  border-color: #4a2a2a;
}

.stepper-btn.five.plus {
  background: #1a2a1a;
  border-color: #2a4a2a;
}

.stepper-value {
  min-width: 44px;
  height: 42px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text);
  font-size: 1.2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  padding: 0 8px;
  flex-shrink: 0;
}

.stepper-value:active {
  border-color: var(--brand-red);
}
</style>
