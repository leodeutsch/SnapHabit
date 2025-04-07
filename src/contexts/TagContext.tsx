import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useCallback, useEffect, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { Tag } from '../types'

interface TagContextType {
  tags: Tag[]
  loadTags: () => Promise<void>
  addTag: (name: string) => Promise<Tag>
  updateTag: (tag: Tag) => Promise<void>
  deleteTag: (id: string) => Promise<void>
}

export const TagContext = createContext<TagContextType | undefined>(undefined)

export const TagProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tags, setTags] = useState<Tag[]>([])

  const loadTags = useCallback(async () => {
    try {
      const storedTags = await AsyncStorage.getItem('@snaphabit_tags')
      if (storedTags) {
        setTags(JSON.parse(storedTags))
      }
    } catch (error) {
      console.error('Error loading tags:', error)
    }
  }, [])

  const saveTags = async (updatedTags: Tag[]) => {
    try {
      await AsyncStorage.setItem('@snaphabit_tags', JSON.stringify(updatedTags))
    } catch (error) {
      console.error('Error saving tags:', error)
    }
  }

  const addTag = useCallback(
    async (name: string) => {
      const newTag: Tag = {
        id: uuid(),
        name,
      }

      const updatedTags = [...tags, newTag]
      setTags(updatedTags)
      await saveTags(updatedTags)
      return newTag
    },
    [tags],
  )

  const updateTag = useCallback(
    async (updatedTag: Tag) => {
      const updatedTags = tags.map((tag) =>
        tag.id === updatedTag.id ? updatedTag : tag,
      )
      setTags(updatedTags)
      await saveTags(updatedTags)
    },
    [tags],
  )

  const deleteTag = useCallback(
    async (id: string) => {
      const updatedTags = tags.filter((tag) => tag.id !== id)
      setTags(updatedTags)
      await saveTags(updatedTags)
    },
    [tags],
  )

  useEffect(() => {
    loadTags()
  }, [])

  return (
    <TagContext.Provider
      value={{
        tags,
        loadTags,
        addTag,
        updateTag,
        deleteTag,
      }}
    >
      {children}
    </TagContext.Provider>
  )
}
