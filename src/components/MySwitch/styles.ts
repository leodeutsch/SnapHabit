import { MD3Theme } from 'react-native-paper'
import { createThemedStyles } from '../../utils/themedStyle'

export const switchStyles = createThemedStyles((theme: MD3Theme) => ({
  container: {
    width: 51,
    height: 31,
    justifyContent: 'center',
    marginRight: 8,
  },
  track: {
    width: 51,
    height: 31,
    borderRadius: 31 / 2,
  },
  thumb: {
    position: 'absolute',
    width: 27,
    height: 27,
    borderRadius: 27 / 2,
    backgroundColor: 'white',
  },
}))
