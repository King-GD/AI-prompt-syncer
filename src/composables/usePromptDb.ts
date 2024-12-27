import Dexie, { type Table } from 'dexie'

export interface Prompt {
  id?: number
  title: string
  content: string
  image: string
  type: string // 将 type 改为字符串类型
  notionId?: string
  createdAt: Date
  updatedAt: Date
}

class PromptDatabase extends Dexie {
  prompts!: Table<Prompt>

  constructor() {
    super('promptDatabase')
    this.version(1).stores({ prompts: '++id, title, type, notionId' })
  }
}

const db = new PromptDatabase()

export function usePromptDb() {
  const addPrompt = async (prompt: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await db.prompts.add({
      ...prompt,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  const deletePrompt = async (id: number) => {
    return await db.prompts.delete(id)
  }

  const updatePrompt = async (id: number, data: Partial<Prompt>) => {
    return await db.prompts.update(id, {
      ...data,
      updatedAt: new Date(),
    })
  }

  const getAllPrompts = async () => {
    return await db.prompts.toArray()
  }

  const getPromptsByType = async (type: Prompt['type']) => {
    return await db.prompts.where('type').equals(type).toArray()
  }

  const hasData = async () => {
    const count = await db.prompts.count()
    return count > 0
  }

  const getAllTypes = async () => {
    const prompts = await db.prompts.toArray()
    const typeSet = new Set<string>()
    prompts.forEach((prompt) => {
      typeSet.add(prompt.type)
    })
    return Array.from(typeSet)
  }

  return {
    addPrompt,
    deletePrompt,
    updatePrompt,
    getAllPrompts,
    getPromptsByType,
    hasData,
    getAllTypes,
  }
}
