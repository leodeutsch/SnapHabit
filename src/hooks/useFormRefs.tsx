import { createContext, useContext, useRef } from 'react'

interface FormRefs {
  titleInputRef: React.RefObject<HTMLInputElement>
  descriptionInputRef: React.RefObject<HTMLInputElement>
  focusTitle: () => void
  focusDescription: () => void
}

const FormRefsContext = createContext<FormRefs | undefined>(undefined)

export const FormRefsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const titleInputRef = useRef<HTMLInputElement>(null)
  const descriptionInputRef = useRef<HTMLInputElement>(null)

  const focusTitle = () => {
    if (titleInputRef.current) {
      titleInputRef.current.focus()
    }
  }

  const focusDescription = () => {
    if (descriptionInputRef.current) {
      descriptionInputRef.current.focus()
    }
  }

  return (
    <FormRefsContext.Provider
      value={{
        titleInputRef,
        descriptionInputRef,
        focusTitle,
        focusDescription,
      }}
    >
      {children}
    </FormRefsContext.Provider>
  )
}

export const useFormRefs = () => {
  const context = useContext(FormRefsContext)
  if (!context) {
    throw new Error('useFormRefs must be used within a FormRefsProvider')
  }
  return context
}
