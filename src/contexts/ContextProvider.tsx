import React from 'react'
import { StatusBar } from 'react-native'
import { PaperProvider } from 'react-native-paper'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { BottomSheetProvider } from './BottomSheetContext'
import { FormTypeProvider } from './FormTypeContext'
import { HabitProvider } from './HabitContext'
import { HabitFormProvider } from './HabitFormContext'
import { TagProvider } from './TagContext'
import { TaskProvider } from './TaskContext'
import { TaskFormProvider } from './TaskFormContext'
import { ThemeContext, ThemeProvider } from './ThemeContext'

export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThemeProvider>
      <ThemeContext.Consumer>
        {({ theme }) => (
          <PaperProvider theme={theme}>
            <SafeAreaProvider
              style={[
                {
                  backgroundColor: theme.colors.background,
                  flex: 1,
                  paddingTop: 32,
                },
              ]}
            >
              <StatusBar
                barStyle={theme.dark ? 'light-content' : 'dark-content'}
                // backgroundColor={theme.colors.background}
                backgroundColor="transparent"
                translucent
              />
              <HabitProvider>
                <TaskProvider>
                  <FormTypeProvider>
                    <HabitFormProvider>
                      <TaskFormProvider>
                        <TagProvider>
                          <BottomSheetProvider>{children}</BottomSheetProvider>
                        </TagProvider>
                      </TaskFormProvider>
                    </HabitFormProvider>
                  </FormTypeProvider>
                </TaskProvider>
              </HabitProvider>
            </SafeAreaProvider>
          </PaperProvider>
        )}
      </ThemeContext.Consumer>
    </ThemeProvider>
  )
}
