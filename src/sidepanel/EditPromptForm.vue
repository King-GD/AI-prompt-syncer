<script setup lang="ts">
import { ref } from 'vue'
import type { Prompt } from '../composables/usePromptDb'

defineOptions({
  name: 'EditPromptForm',
})

const props = defineProps<{
  prompt: Prompt
}>()

const emit = defineEmits<{
  (e: 'submit', id: number, data: Partial<Prompt>): void
  (e: 'cancel'): void
}>()

const form = ref({
  title: props.prompt.title,
  content: props.prompt.content,
  image: props.prompt.image,
  type: props.prompt.type,
})

function handleSubmit() {
  emit('submit', props.prompt.id!, {
    title: form.value.title,
    content: form.value.content,
    image: form.value.image,
    type: form.value.type,
  })
}
</script>

<template>
  <div class="p-4 border rounded-lg mb-4">
    <h3 class="text-lg font-medium mb-4">
      编辑 Prompt
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
          <select
            v-model="form.type"
            class="w-full px-3 py-2 border rounded-lg"
          >
            <option value="chatgpt">
              ChatGPT
            </option>
            <option value="claude">
              Claude
            </option>
            <option value="kimi">
              Kimi
            </option>
          </select>
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
            保存
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
