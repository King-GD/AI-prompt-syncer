<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import { type Prompt, usePromptDb } from '../composables/usePromptDb'
import AddPromptForm from './AddPromptForm.vue'
import EditPromptForm from './EditPromptForm.vue'

// 修改接口以匹配数据库类型
interface PromptCard {
  id?: number
  title: string
  content: string
  image: string
  type: string
  notionId?: string
  createdAt: Date
  updatedAt: Date
}
const { copy, copied } = useClipboard()
const { addPrompt, deletePrompt, updatePrompt, hasData, getAllPrompts } = usePromptDb()
const showAddForm = ref(false)
const editingPrompt = ref<Prompt | null>(null)

const searchQuery = ref('')

// 修改数据结构
const promptList = ref<PromptCard[]>([])

// 修改 loadPrompts 函数，加载所有提示词
async function loadPrompts() {
  const prompts = await getAllPrompts()
  promptList.value = prompts
}

// 修改 onMounted 钩子
onMounted(async () => {
  const dataExists = await hasData()
  if (dataExists) {
    await loadPrompts()
  }
})

function handleCopy(content: string): void {
  copy(content)
}

const hoveredImageId = ref<number | null | undefined>(null)

function handleClickImage(image: string): void {
  window.open(image, '_blank')
}

// 处理添加提示词
async function handleAddPrompt(data: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'notionId'>) {
  await addPrompt(data)
  await loadPrompts()
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
    await loadPrompts()
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
  await loadPrompts()
  editingPrompt.value = null
}

// 定义类型颜色映射
const typeColorMap = ref<{ [key: string]: string }>({})

function getTypeColor(type: string): string {
  if (!typeColorMap.value[type]) {
    // 定义一组颜色
    const colors = ['red', 'green', 'blue', 'yellow', 'purple', 'pink', 'indigo', 'teal', 'orange', 'cyan']
    const index = Object.keys(typeColorMap.value).length % colors.length
    typeColorMap.value[type] = `bg-${colors[index]}-200 text-${colors[index]}-800`
  }
  return typeColorMap.value[type]
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

    <!-- 修改提示词列表的渲染 -->
    <div class="mt-4">
      <div v-if="promptList.length" class="space-y-4">
        <div
          v-for="card in promptList"
          :key="card.id"
          class="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 group relative"
        >
          <div class="flex gap-4">
            <div
              class="relative w-32 h-32 overflow-hidden flex-shrink-0"
              @mouseenter="hoveredImageId = card.id"
              @mouseleave="hoveredImageId = null"
            >
              <img
                :src="card.image"
                :alt="card.title"
                class="rounded-lg object-cover w-full h-full transition-all duration-300 ease-out"
                @click="handleClickImage(card.image)"
              >
            </div>
            <div class="flex-1 min-w-0 group/text">
              <h3 class="text-lg font-medium text-gray-900 mb-2">
                {{ card.title }}
              </h3>
              <!-- 显示类型标签 -->
              <span
                class="px-2 py-1 rounded-full text-xs mb-2 inline-block"
                :class="getTypeColor(card.type)"
              >
                {{ card.type }}
              </span>
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
                  v-if="card.id !== undefined"
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
