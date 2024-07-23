// color design tokens export
export const darkTheme = {
  grey: {
    0: '#ffffff',
    10: '#f6f6f6',
    50: '#f0f0f0',
    100: '#e0e0e0',
    200: '#c2c2c2',
    300: '#a3a3a3',
    400: '#858585',
    500: '#666666',
    600: '#525252',
    700: '#3d3d3d',
    800: '#292929',
    900: '#141414',
    1000: '#000000',
  },
  primary: {
    // Indigo color palette for primary theme
    100: '#d7dbdd',
    200: '#afb8bb',
    300: '#889498',
    400: '#607176',
    500: '#384d54',
    600: '#2d3e43',
    700: '#222e32',
    800: '#161f22',
    900: '#0b0f11',
  },
  secondary: {
    // Orange color palette for secondary theme
    100: '#ffe5cc',
    200: '#ffca99',
    300: '#ffb066',
    400: '#ff9533',
    500: '#ff7b00',
    600: '#cc6200',
    700: '#994a00',
    800: '#663100',
    900: '#331900',
  },
}

/**
 * Reverses the color palette from dark to light theme or from light to dark theme
 * This function takes in a dark theme color palette and reverses the colors
 * to create a light theme. It iterates through each color category
 * and reverses the order of the color values.
 * @param {Object} darkTheme - The dark theme color palette object.
 * @returns {Object} - The reversed color palette object for light theme.
 */
function reverseTheme(darkTheme) {
  const reversedTokens = {}
  Object.entries(darkTheme).forEach(([key, val]) => {
    const keys = Object.keys(val)
    const values = Object.values(val)
    const length = keys.length
    const reversedObj = {}
    for (let i = 0; i < length; i++) {
      reversedObj[keys[i]] = values[length - i - 1]
    }
    reversedTokens[key] = reversedObj
  })
  return reversedTokens
}
export const lightTheme = reverseTheme(darkTheme)

// mui/icon material theme settings
/**
 * Generates the MUI/Material-UI theme settings based on the mode.
 * This function creates the theme settings for the application based on whether the mode
 * is 'dark' or 'light'. It configures the palette, including primary, secondary, neutral colors,
 * and background settings, and sets the typography options.
 * @param {string} mode - The current theme mode, either 'dark' or 'light'.
 * @returns {Object} - The theme settings object for MUI/Material-UI.
 */
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === 'dark'
        ? {
            // palette values for dark mode
            primary: {
              ...darkTheme.primary,
              main: darkTheme.primary[400],
              light: darkTheme.primary[400],
            },
            secondary: {
              ...darkTheme.secondary,
              main: darkTheme.secondary[300],
            },
            neutral: {
              ...darkTheme.grey,
              main: darkTheme.grey[500],
            },
            background: {
              default: darkTheme.primary[600],
              alt: darkTheme.primary[500],
            },
          }
        : {
            // palette values for light mode
            primary: {
              ...lightTheme.primary,
              main: darkTheme.grey[50],
              light: darkTheme.grey[100],
            },
            secondary: {
              ...lightTheme.secondary,
              main: darkTheme.secondary[600],
              light: darkTheme.secondary[700],
            },
            neutral: {
              ...lightTheme.grey,
              main: darkTheme.grey[500],
            },
            background: {
              default: darkTheme.grey[0],
              alt: darkTheme.grey[50],
            },
          }),
    },
    typography: {
      fontFamily: ['Inter', 'sans-serif'].join(','),
      fontSize: 14,
      h1: {
        fontFamily: ['Inter', 'sans-serif'].join(','),
        fontSize: 40,
      },
      h2: {
        fontFamily: ['Inter', 'sans-serif'].join(','),
        fontSize: 32,
      },
      h3: {
        fontFamily: ['Inter', 'sans-serif'].join(','),
        fontSize: 24,
      },
      h4: {
        fontFamily: ['Inter', 'sans-serif'].join(','),
        fontSize: 20,
      },
      h5: {
        fontFamily: ['Inter', 'sans-serif'].join(','),
        fontSize: 16,
      },
      h6: {
        fontFamily: ['Inter', 'sans-serif'].join(','),
        fontSize: 14,
      },
    },
  }
}
