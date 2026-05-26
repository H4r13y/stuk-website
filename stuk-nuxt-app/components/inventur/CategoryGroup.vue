<script setup lang="ts">
import type { InventurCount } from '~/types'

const props = defineProps<{
  name: string
  items: InventurCount[]
  compact?: boolean
}>()

const emit = defineEmits<{
  update: [getraenkDocumentId: string, field: 'kaesten' | 'einzelflaschen', value: number]
}>()

const collapsed = ref(false)

const countedInGroup = computed(
  () => props.items.filter((i) => i.kaesten > 0 || i.einzelflaschen > 0).length
)
</script>

<template>
  <div class="category-group">
    <button class="category-header" @click="collapsed = !collapsed">
      <span class="category-name">{{ name }}</span>
      <span class="category-progress">{{ countedInGroup }}/{{ items.length }}</span>
      <span class="category-chevron" :class="{ collapsed }">&rsaquo;</span>
    </button>

    <div v-if="!collapsed" class="category-items">
      <InventurArticleCard
        v-for="item in items"
        :key="item.getraenkDocumentId"
        :count="item"
        :compact="compact"
        @update="(field, value) => emit('update', item.getraenkDocumentId, field, value)"
      />
    </div>
  </div>
</template>

<style scoped>
.category-group {
  margin-bottom: 8px;
}

.category-header {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  border: none;
  background: #16181f;
  color: var(--text);
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  gap: 8px;
}

.category-header:active {
  background: #1e2029;
}

.category-name {
  font-weight: 700;
  font-size: 0.95rem;
  flex: 1;
  text-align: left;
}

.category-progress {
  font-size: 0.8rem;
  color: var(--muted);
  font-weight: 600;
}

.category-chevron {
  font-size: 1.2rem;
  color: var(--muted);
  transition: transform 0.2s;
  transform: rotate(90deg);
}

.category-chevron.collapsed {
  transform: rotate(0deg);
}

.category-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  padding-left: 4px;
}
</style>
