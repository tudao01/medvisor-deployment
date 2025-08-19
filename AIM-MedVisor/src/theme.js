import { theme as baseTheme } from '@chakra-ui/react'

const theme = {
  ...baseTheme,
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      }
    }
  },
  colors: {
    ...baseTheme.colors,
    brand: {
      primary: '#2D3748',
      secondary: '#A0AEC0',
    },
  },
}

export default theme
