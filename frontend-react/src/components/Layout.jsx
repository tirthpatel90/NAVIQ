import { NavLink, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { 
  HiOutlineHome, 
  HiOutlineMap, 
  HiOutlineBookOpen, 
  HiOutlineChatAlt2,
  HiOutlineChartBar,
  HiOutlineLightningBolt,
  HiOutlineMoon,
  HiOutlineSun,
  HiOutlineMenu,
  HiOutlineX
} from 'react-icons/hi'

const navItems = [
  { path: '/', label: 'Home', icon: HiOutlineHome },
  { path: '/roadmap', label: 'Roadmap', icon: HiOutlineMap },
  { path: '/study', label: 'Study', icon: HiOutlineBookOpen },
  { path: '/interview', label: 'Interview', icon: HiOutlineLightningBolt },
  { path: '/insights', label: 'Insights', icon: HiOutlineChartBar },
  { path: '/ai-guide', label: 'AI Guide', icon: HiOutlineChatAlt2 },
]

export default function Layout({ children, darkMode, toggleDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-ivory dark:bg-midnight transition-colors duration-500">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/20 dark:border-gray-700/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div 
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-white font-bold text-lg">N</span>
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="font-display font-bold text-xl tracking-wider text-gray-900 dark:text-white">
                  NAVIQ
                </h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 -mt-0.5">
                  Navigate Your Goals
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300
                    ${isActive 
                      ? 'bg-sage-400/20 text-sage-600 dark:text-sage-300' 
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <motion.button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle theme"
              >
                {darkMode ? <HiOutlineSun className="w-5 h-5" /> : <HiOutlineMoon className="w-5 h-5" />}
              </motion.button>

              {/* Mobile menu button */}
              <motion.button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
                whileTap={{ scale: 0.95 }}
              >
                {mobileMenuOpen ? <HiOutlineX className="w-5 h-5" /> : <HiOutlineMenu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{ height: mobileMenuOpen ? 'auto' : 0 }}
          className="lg:hidden overflow-hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/20 dark:border-gray-700/20"
        >
          <nav className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all
                  ${isActive 
                    ? 'bg-sage-400/20 text-sage-600 dark:text-sage-300' 
                    : 'text-gray-600 dark:text-gray-400'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </motion.div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-16 lg:pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200/20 dark:border-gray-700/20 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span className="font-display font-semibold text-gray-900 dark:text-white">NAVIQ</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2026 NAVIQ. Navigate your career with clarity.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
