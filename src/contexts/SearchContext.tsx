import React, { createContext, ReactNode, useState } from 'react'
import { Keyboard } from 'react-native'

interface SearchContextType {
  isSearchVisible: boolean
  searchQuery: string
  showSearch: () => void
  hideSearch: () => void
  setSearchQuery: (query: string) => void
}

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined,
)

export const SearchProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const showSearch = () => {
    setIsSearchVisible(true)
  }

  const hideSearch = () => {
    setIsSearchVisible(false)
    setSearchQuery('')
    Keyboard.dismiss()
  }

  return (
    <SearchContext.Provider
      value={{
        isSearchVisible,
        searchQuery,
        showSearch,
        hideSearch,
        setSearchQuery,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}
