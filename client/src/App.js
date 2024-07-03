import React, { useMemo } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { themeSettings } from './theme'
import { useSelector } from 'react-redux'
// import Login from './components/login.jsx';
import Layout from './pages/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'

const App = () => {
  // state for mode //
  //use redux to update the global mode // from state -> index.js
  const mode = useSelector((state) => state.global.mode)
  // create a theme by using the themeSettings function then pass in the mode
  // to configure what's nessessary on the matrial ui
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])

  // use ThemeProvider to set up material UI
  // add BrowserRouter -> Routes -> Route element{</>}
  // Layout component will be main of dashboard
  return (
    <div>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
