<script setup lang="ts">
import { ref } from 'vue'
import { useClipboard } from '@vueuse/core'

interface PromptCard {
  id: number
  title: string
  content: string
  image: string
}

const { copy, copied } = useClipboard()

const searchQuery = ref('')
const activeTab = ref('chatgpt')

const tabs = [
  { id: 'chatgpt', name: 'ChatGPT' },
  { id: 'claude', name: 'Claude' },
  { id: 'kimi', name: 'Kimi' },
]

const tabData = {
  chatgpt: [
    {
      id: 1,
      title: 'AI 助手',
      content: '我希望你能充当 AI 写作导师。我将为你提供一个需要帮助提高写作水平的学生我希望你能充当 AI 写作导师。我将为你提供一个需要帮助提高写作水平的学生',
      image: 'https://picsum.photos/100/100',
    },
    {
      id: 2,
      title: '前端专家',
      content: '我需要你充当高级前端开发工程师，帮助我优化代码和解决技术问题...',
      image: 'https://picsum.photos/100/100',
    },
  ],
  claude: [
    {
      id: 1,
      title: '数据分析师',
      content: '请充当数据分析师，帮助我分析和解释以下数据集...',
      image: 'https://picsum.photos/100/100',
    },
  ],
  kimi: [
    {
      id: 1,
      title: '创意写手',
      content: '请帮我以创意的方式重写以下内容...',
      image: 'https://picsum.photos/100/100',
    },
  ],
} satisfies Record<string, PromptCard[]>

function handleCopy(content: string): void {
  copy(content)
}
</script>

<template>
  <main class="w-full px-4 py-5 text-gray-700">
    <!-- 搜索框 -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索提示词..."
        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
    </div>

    <div class="mb-4">
      <div class="flex border-b">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="px-8 py-2 font-medium"
          :class="[
            activeTab === tab.id
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700',
          ]"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- 标签页内容 -->
    <div class="mt-4">
      <div v-if="tabData[activeTab]?.length" class="space-y-4">
        <div
          v-for="card in tabData[activeTab]"
          :key="card.id"
          class="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 group relative"
        >
          <div class="flex gap-4">
            <img
              :src="card.image"
              :alt="card.title"
              class="w-20 h-20 rounded-lg object-cover"
            >
            <div class="flex-1 min-w-0">
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                {{ card.title }}
              </h3>
              <p
                class="text-gray-500 text-sm line-clamp-2 cursor-pointer group-hover:text-blue-600"
                @click="handleCopy(card.content)"
              >
                {{ card.content }}
              </p>
              <button
                class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                @click="handleCopy(card.content)"
              >
                <span v-if="copied" class="text-green-600 text-sm">已复制!</span>
                <span v-else class="text-gray-600 text-sm">点击复制</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-500">
        暂无数据
      </div>
    </div>
  </main>
</template>
