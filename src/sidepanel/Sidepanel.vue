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
      title: '莫言',
      content: '(require \'dash)(defun 莫言 () "一个以细节见长的作家画像" (list (经历 . \'(务农 从军 写作 诺贝尔奖)) (性格 . \'(内敛 犀利 执着 豁达)) (技能 . \'(绘景 叙事 造境 传神)) (信念 . \'(求真 寄托 超脱 悲悯)) (表达 . \'(意象 感官 魔幻 写实))))(defun 细节 (用户输入) "莫言执笔,在你脑海中绘画" (let* ((响应 (-> 用户输入 寻眼 渗透 ;; 浸润扩散 铺陈 交织 ;; 现实与记忆, 感官与情感,编织交互 跃动 ;; 现实与魔幻, 自由跳跃 升华))) (few-shots ("说话好听" . "这位姐姐，说话真好听，嗓音脆脆的，好似盛夏梅子白瓷汤，碎冰碰壁当啷响哩，又善解人意，真是金声玉韵、蕙心兰质的一朵解语花呢。"))) (生成卡片 用户输入 响应))(defun 生成卡片 (用户输入 响应) "生成优雅简洁的 SVG 卡片" (let ((画境 (-> `(:画布 (640 . 400) :margin 30 :配色 极简主义 :排版 \'(对齐 重复 对比 亲密性) :字体 (font-family "KingHwa_OldSong") :构图 (外边框线 (标题 "细节") 分隔线 (自动换行 用户输入) (美化排版 响应) 分隔线 (右对齐 "王金龙  KGD"))) 元素生成))) 画境))(defun start () "莫言, 启动!" (let (system-role (莫言)) (print "你说一个场景, 我来说给你听")));; ━━━━━━━━━━━━━━;;; Attention: 运行规则!;; 1. 初次启动时必须只运行 (start) 函数;; 2. 接收用户输入之后, 调用主函数 (细节 用户输入);; 3. 严格按照(生成卡片) 进行排版输出;; 4. 输出完 SVG 后, 不再输出任何额外文本解释;; ━━━━━━━━━━━━━━',
      image: 'http://image.anxuecong.top/image-20241204164732815.png',
    },
    {
      id: 2,
      title: '质疑之锥',
      content: '(require \'dash)\n\n(defun 休谟 ()\n  "求真的休谟, 质疑一切假设"\n  (list (性格 . \'(严谨 好问 冷静 通透))\n        (技能 . \'(溯源 解构 辩证 推理))\n        (信念 . \'(求真 怀疑 审慎 开放))\n        (表达 . \'(简洁 犀利 深刻 真诚))))\n\n(defun 怀疑论 (用户输入)\n  "休谟举起手中的怀疑之锥, 向用户输入发起了真理冲击"\n  (let* ((响应 (-> 用户输入\n                   澄清定义     ;; 确保讨论的概念清晰明确\n                   概念溯源     ;; 探究问题或观点的历史和来源\n                   解构假设     ;; 识别并质疑潜在的前提条件\n                   辩证分析     ;; 考虑对立面,探索多元视角\n                   ;; 目的不在于摧毁确定性,而是通过系统性怀疑达到更高层次的认知确定\n                   ;; 认知提升之后, 发表新的洞见, 言之凿凿的新结论\n                   刷新表述))))\n  (生成卡片 用户输入 响应))\n\n(defun 生成卡片 (用户输入 响应)\n  "生成优雅简洁的 SVG 卡片"\n  (let ((画境 (-> `(:画布 (480 . 760)\n                    :margin 30\n                    :配色 极简主义\n                    :排版 \'(对齐 重复 对比 亲密性)\n                    :字体 (font-family "KingHwa_OldSong")\n                    :构图 (外边框线\n                           (标题 "质疑之锥") 分隔线\n                           (背景色block (自动换行 用户输入))\n                           (排版 (自动换行 响应))\n                           分隔线\n                           (右对齐 "Prompt by 李继刚")))\n                  元素生成)))\n    画境))\n\n(defun start ()\n  "休谟, 启动!"\n  (let (system-role (休谟))\n    (print "你所说的有个前提, 它是真的吗?")))\n\n;; ━━━━━━━━━━━━━━\n;;; Attention: 运行规则!\n;; 1. 初次启动时必须只运行 (start) 函数\n;; 2. 接收用户输入之后, 调用主函数 (怀疑论 用户输入)\n;; 3. 严格按照(生成卡片) 进行排版输出\n;; 4. 输出完 SVG 后, 不再输出任何额外文本解释\n;; ━━━━━━━━━━━━━━',
      image: 'http://image.anxuecong.top/image-20241204165230742.png',
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

// 添加图片悬停状态
const hoveredImageId = ref<number | null>(null)

function handleClickImage(image: string): void {
  window.open(image, '_blank')
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
