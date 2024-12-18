<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useClipboard } from '@vueuse/core'
import { type Prompt, usePromptDb } from '../composables/usePromptDb'
import AddPromptForm from './AddPromptForm.vue'
import EditPromptForm from './EditPromptForm.vue'

// 修改接口以匹配数据库类型
interface PromptCard extends Omit<Prompt, 'createdAt' | 'updatedAt' | 'notionId'> {}
const { copy, copied } = useClipboard()
const { addPrompt, getPromptsByType, deletePrompt, updatePrompt } = usePromptDb()
const showAddForm = ref(false)
const editingPrompt = ref<Prompt | null>(null)

const searchQuery = ref('')
const activeTab = ref('chatgpt')

const tabs = [
  { id: 'chatgpt', name: 'ChatGPT' },
  { id: 'claude', name: 'Claude' },
  { id: 'kimi', name: 'Kimi' },
]

// 修改为响应式数据
const tabData = ref<Record<string, PromptCard[]>>({
  chatgpt: [],
  claude: [],
  kimi: [],
})

// 加载特定类型的数据
async function loadPrompts(type: string) {
  const prompts = await getPromptsByType(type as Prompt['type'])
  tabData.value[type] = prompts
}

// 监听标签页切换
watch(activeTab, (newTab) => {
  loadPrompts(newTab)
})

onMounted(async () => {
  await loadPrompts(activeTab.value)
})

function handleCopy(content: string): void {
  copy(content)
}

const hoveredImageId = ref<number | null>(null)

function handleClickImage(image: string): void {
  window.open(image, '_blank')
}

// 处理添加提示词
async function handleAddPrompt(data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'notionId'>) {
  await addPrompt(data)
  await loadPrompts(activeTab.value)
  showAddForm.value = false
}

// 添加状态变量
const showDeleteDialog = ref(false)
const deletePromptId = ref<number | null>(null)

// 修改 handleDeletePrompt 函数
function handleDeletePrompt(id: number) {
  deletePromptId.value = id
  showDeleteDialog.value = true
}

// 添加确认和取消删除的函数
async function confirmDelete() {
  if (deletePromptId.value !== null) {
    await deletePrompt(deletePromptId.value)
    await loadPrompts(activeTab.value)
    deletePromptId.value = null
  }
  showDeleteDialog.value = false
}

function cancelDelete() {
  deletePromptId.value = null
  showDeleteDialog.value = false
}

// 处理编辑提示词
async function handleEditPrompt(id: number, data: Partial<Prompt>) {
  await updatePrompt(id, data)
  await loadPrompts(activeTab.value)
  editingPrompt.value = null
}
</script>

<template>
  <main class="w-full px-4 py-5 text-gray-700">
    <button
      v-if="!showAddForm && !editingPrompt"
      class="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      @click="showAddForm = true"
    >
      添加新的提示词
    </button>
    <AddPromptForm
      v-if="showAddForm"
      @submit="handleAddPrompt"
      @cancel="showAddForm = false"
    />

    <EditPromptForm
      v-if="editingPrompt"
      :prompt="editingPrompt"
      @submit="handleEditPrompt"
      @cancel="editingPrompt = null"
    />

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
            <div
              class="relative w-20 h-20 overflow-visible z-1 hover:z-10"
              @mouseenter="hoveredImageId = card.id"
              @mouseleave="hoveredImageId = null"
            >
              <img
                :src="card.image"
                :alt="card.title"
                class="rounded-lg object-cover w-20 h-20 transition-all duration-300 ease-out backface-hidden transform-gpu origin-center will-change-transform hover:shadow-xl"
                :class="[
                  hoveredImageId === card.id && 'scale-200 translate-x-4 contrast-110 brightness-110']"
                @click="handleClickImage(card.image)"
              >
            </div>
            <div class="flex-1 min-w-0 group/text">
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                {{ card.title }}
              </h3>
              <p
                class="text-gray-500 text-sm line-clamp-2 cursor-pointer hover:text-blue-600"
                @click="handleCopy(card.content)"
              >
                {{ card.content }}
              </p>
              <button
                class="absolute top-2 right-2 opacity-0 group-hover/text:opacity-100 transition-opacity duration-200 p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                @click="handleCopy(card.content)"
              >
                <span v-if="copied" class="text-green-600 text-sm">已复制！</span>
                <span v-else class="text-gray-600 text-sm">点击复制</span>
              </button>
              <div class="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                <button
                  class="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600"
                  @click="editingPrompt = card"
                >
                  编辑
                </button>
                <button
                  class="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600"
                  @click="handleDeletePrompt(card.id)"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-500">
        暂无数据
      </div>
    </div>

    <!-- 添加自定义删除确认对话框 -->
    <div
      v-if="showDeleteDialog"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white p-6 rounded-lg">
        <p class="text-lg mb-4">
          确定要删除这个提示词吗？
        </p>
        <div class="flex justify-end space-x-2">
          <button
            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            @click="cancelDelete"
          >
            取消
          </button>
          <button
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            @click="confirmDelete"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  </main>
</template>
