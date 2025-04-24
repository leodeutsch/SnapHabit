import React, { createContext, useState } from 'react'

interface FilterContextType {
  isFilterVisible: boolean
  setFilterVisible: (visible: boolean) => void
}

export const FilterContext = createContext<FilterContextType | undefined>(
  undefined,
)

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isFilterVisible, setFilterVisible] = useState(false)

  return (
    <FilterContext.Provider value={{ isFilterVisible, setFilterVisible }}>
      {children}
    </FilterContext.Provider>
  )
}
