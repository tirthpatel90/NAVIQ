import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Roadmap from './pages/Roadmap'
import Study from './pages/Study'
import Interview from './pages/Interview'
import Insights from './pages/Insights'
import AIGuide from './pages/AIGuide'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    // Check for system preference or saved preference
    const savedTheme = localStorage.getItem('naviq-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('naviq-theme', !darkMode ? 'dark' : 'light')
  }

  return (
    <Layout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/study" element={<Study />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/ai-guide" element={<AIGuide />} />
      </Routes>
    </Layout>
  )
}

export default App
