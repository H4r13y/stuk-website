<script setup lang="ts">
import type { InventurCount } from '~/types'

const props = defineProps<{
  count: InventurCount
  compact?: boolean
}>()

const emit = defineEmits<{
  update: [field: 'kaesten' | 'einzelflaschen', value: number]
}>()

const { getTotal } = useInventur()

const numpadVisible = ref(false)
const numpadField = ref<'kaesten' | 'einzelflaschen'>('kaesten')
const numpadInitial = ref(0)
const imageVisible = ref(false)

const total = computed(() => getTotal(props.count))
const isCounted = computed(() => props.count.kaesten > 0 || props.count.einzelflaschen > 0)

function openNumpad(field: 'kaesten' | 'einzelflaschen') {
  numpadField.value = field
  numpadInitial.value = props.count[field]
  numpadVisible.value = true
}

function confirmNumpad(value: number) {
  emit('update', numpadField.value, value)
  numpadVisible.value = false
}
</script>

<template>
  <div class="article" :class="{ counted: isCounted }">
    <div class="article-header">
      <span class="article-name">{{ count.name }}</span>
      <button
        v-if="count.bildUrl"
        class="img-btn"
        @click="imageVisible = !imageVisible"
      >
        &#128247;
      </button>
      <span class="article-vpe">{{ count.vpe }} VKE/Gebinde</span>
    </div>

    <div v-if="imageVisible && count.bildUrl" class="article-image-wrap">
      <img :src="count.bildUrl" :alt="count.name" class="article-image" />
    </div>

    <div class="article-steppers" :class="{ 'steppers-row': compact }">
      <InventurNumberStepper
        :model-value="count.kaesten"
        label="Kästen/Gebinde"
        @update:model-value="emit('update', 'kaesten', $event)"
        @open-numpad="openNumpad('kaesten')"
      />
      <InventurNumberStepper
        :model-value="count.einzelflaschen"
        label="Einzelflaschen"
        :show-five-buttons="!compact"
        @update:model-value="emit('update', 'einzelflaschen', $event)"
        @open-numpad="openNumpad('einzelflaschen')"
      />
    </div>

    <div v-if="isCounted" class="article-total">
      = {{ total }} Flaschen
    </div>

    <InventurNumberPadModal
      :visible="numpadVisible"
      :label="numpadField === 'kaesten' ? 'Kästen/Gebinde' : 'Einzelflaschen'"
      :initial-value="numpadInitial"
      @confirm="confirmNumpad"
      @cancel="numpadVisible = false"
    />
  </div>
</template>

<style scoped>
.article {
  padding: 16px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: #0f1114;
  border-left: 3px solid transparent;
  transition: border-color 0.2s;
}

.article.counted {
  border-left-color: #22c55e;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 12px;
}

.article-name {
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--text);
}

.img-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: #16181f;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  flex-shrink: 0;
}

.img-btn:active {
  background: #1e2029;
}

.article-image-wrap {
  margin-bottom: 12px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.article-image {
  width: 100%;
  height: auto;
  display: block;
}

.article-vpe {
  font-size: 0.8rem;
  color: var(--muted);
  white-space: nowrap;
}

.article-steppers {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.article-steppers.steppers-row {
  flex-direction: row;
  justify-content: space-around;
}

.article-total {
  text-align: center;
  margin-top: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #22c55e;
}
</style>
