import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { ContextProvider } from './src/contexts/ContextProvider'
import { Navigation } from './src/navigation'

export function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ContextProvider>
        <Navigation />
      </ContextProvider>
    </GestureHandlerRootView>
  )
}
