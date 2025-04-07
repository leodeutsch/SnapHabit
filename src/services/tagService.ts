import AsyncStorage from '@react-native-async-storage/async-storage'
import { Tag } from '../types'

const TAGS_KEY = '@tags'

export const getTags = async (): Promise<Tag[]> => {
  try {
    const tagsJson = await AsyncStorage.getItem(TAGS_KEY)
    return tagsJson ? JSON.parse(tagsJson) : []
  } catch (e) {
    console.error('Error fetching tags:', e)
    return []
  }
}

export const addTag = async (tag: Tag): Promise<Tag[]> => {
  const tags = await getTags()
  const newTags = [...tags, tag]
  await AsyncStorage.setItem(TAGS_KEY, JSON.stringify(newTags))
  return newTags
}

export const updateTag = async (updatedTag: Tag): Promise<Tag[]> => {
  const tags = await getTags()
  const newTags = tags.map((tag) =>
    tag.id === updatedTag.id ? updatedTag : tag,
  )
  await AsyncStorage.setItem(TAGS_KEY, JSON.stringify(newTags))
  return newTags
}

export const deleteTag = async (id: string): Promise<Tag[]> => {
  const tags = await getTags()
  const newTags = tags.filter((tag) => tag.id !== id)
  await AsyncStorage.setItem(TAGS_KEY, JSON.stringify(newTags))
  return newTags
}
