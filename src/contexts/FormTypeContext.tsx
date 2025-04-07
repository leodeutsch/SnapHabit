import React, { createContext, useState } from 'react'

type FormType = 'task' | 'habit'

interface FormTypeContextType {
  formType: FormType
  setFormType: (type: FormType) => void
}

export const FormTypeContext = createContext<FormTypeContextType | undefined>(
  undefined,
)

export const FormTypeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [formType, setFormType] = useState<FormType>('task')

  return (
    <FormTypeContext.Provider value={{ formType, setFormType }}>
      {children}
    </FormTypeContext.Provider>
  )
}
