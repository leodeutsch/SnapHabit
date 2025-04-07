import { ReactNode } from 'react'

// This will be our navigation service
export type SheetRoute = 'addHabit' | 'calendar' | 'tags'

// We'll store the factory functions here
const sheetFactories: Record<string, () => ReactNode> = {}

// Register a sheet component factory
export function registerSheetFactory(
  name: SheetRoute,
  factory: () => ReactNode,
) {
  sheetFactories[name] = factory
}

// Get a sheet component by name
export function getSheet(name: SheetRoute): ReactNode {
  const factory = sheetFactories[name]
  if (!factory) {
    console.warn(`No sheet registered with name: ${name}`)
    return null
  }
  return factory()
}
