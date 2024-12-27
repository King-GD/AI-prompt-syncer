<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Prompt } from '../composables/usePromptDb'
import { usePromptDb } from '../composables/usePromptDb'

defineOptions({
  name: 'AddPromptForm',
})

const emit = defineEmits<{
  (e: 'submit', data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'notionId'>): void
  (e: 'cancel'): void
}>()

const { getAllTypes } = usePromptDb()
const allTypes = ref<string[]>([])

onMounted(async () => {
  allTypes.value = await getAllTypes()
})

const form = ref({
  title: '',
  content: '',
  image: '',
  type: '', // 修改为字符串类型
})

// 移除 newType 和 addNewType 函数

function handleSubmit() {
  emit('submit', { ...form.value })
  form.value = {
    title: '',
    content: '',
    image: '',
    type: '',
  }
}
</script>

<template>
  <div class="p-4 border rounded-lg mb-4">
    <h3 class="text-lg font-medium mb-4">
      添加新的 Prompt
    </h3>
    <form @submit.prevent="handleSubmit">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">标题</label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-3 py-2 border rounded-lg"
          >
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">内容</label>
          <textarea
            v-model="form.content"
            required
            rows="3"
            class="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">图片URL</label>
          <input
            v-model="form.image"
            type="url"
            required
            class="w-full px-3 py-2 border rounded-lg"
          >
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">类型</label>
          <div class="relative">
            <input
              v-model="form.type"
              type="text"
              list="type-options"
              placeholder="选择或输入类型"
              class="w-full px-3 py-2 border rounded-lg"
            >
            <datalist id="type-options">
              <option v-for="type in allTypes" :key="type" :value="type" />
            </datalist>
          </div>
        </div>
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            @click="$emit('cancel')"
          >
            取消
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            添加
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
