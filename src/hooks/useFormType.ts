import { useContext } from 'react'
import { FormTypeContext } from '../contexts/FormTypeContext'

export const useFormType = () => {
  const context = useContext(FormTypeContext)
  if (!context) {
    throw new Error('useFormType must be used within a FormTypeProvider')
  }
  return context
}
