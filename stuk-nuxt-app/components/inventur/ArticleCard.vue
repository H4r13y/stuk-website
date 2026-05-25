<script setup lang="ts">
import type { InventurCount } from '~/types'

const props = defineProps<{
  count: InventurCount
}>()

const emit = defineEmits<{
  update: [field: 'kaesten' | 'einzelflaschen', value: number]
}>()

const { getTotal } = useInventur()

const numpadVisible = ref(false)
const numpadField = ref<'kaesten' | 'einzelflaschen'>('kaesten')
const numpadInitial = ref(0)

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
      <span class="article-vpe">{{ count.vpe }} Fl./Kasten</span>
    </div>

    <div class="article-steppers">
      <InventurNumberStepper
        :model-value="count.kaesten"
        label="Kästen"
        @update:model-value="emit('update', 'kaesten', $event)"
        @open-numpad="openNumpad('kaesten')"
      />
      <InventurNumberStepper
        :model-value="count.einzelflaschen"
        label="Einzeln"
        @update:model-value="emit('update', 'einzelflaschen', $event)"
        @open-numpad="openNumpad('einzelflaschen')"
      />
    </div>

    <div v-if="isCounted" class="article-total">
      = {{ total }} Flaschen
    </div>

    <InventurNumberPadModal
      :visible="numpadVisible"
      :label="numpadField === 'kaesten' ? 'Kästen' : 'Einzelflaschen'"
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

.article-vpe {
  font-size: 0.8rem;
  color: var(--muted);
  white-space: nowrap;
}

.article-steppers {
  display: flex;
  justify-content: space-around;
  gap: 12px;
}

.article-total {
  text-align: center;
  margin-top: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #22c55e;
}
</style>
