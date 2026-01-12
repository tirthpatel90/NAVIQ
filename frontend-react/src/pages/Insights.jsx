import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  HiOutlineChartBar, 
  HiOutlineTrendingUp,
  HiOutlineGlobe,
  HiOutlineSparkles
} from 'react-icons/hi'
import WaveCanvas from '../components/canvas/WaveCanvas'
import api from '../services/api'

const categoryConfig = {
  readiness: {
    title: 'Interview Readiness',
    icon: HiOutlineSparkles,
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    textColor: 'text-purple-600 dark:text-purple-400'
  },
  velocity: {
    title: 'Learning Velocity',
    icon: HiOutlineTrendingUp,
    color: 'from-sage-400 to-sage-600',
    bgColor: 'bg-sage-50 dark:bg-sage-900/20',
    textColor: 'text-sage-600 dark:text-sage-400'
  },
  market: {
    title: 'Market Insights',
    icon: HiOutlineGlobe,
    color: 'from-coral to-copper',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    textColor: 'text-orange-600 dark:text-orange-400'
  }
}

function InsightCard({ insight, index }) {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="glass-card p-6 card-hover"
    >
      <div className="text-3xl font-display font-bold text-gray-900 dark:text-white mb-1">
        {insight.value}
      </div>
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {insight.label}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {insight.meta}
      </div>
    </motion.div>
  )
}

function InsightCategory({ category, insights, index }) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  const config = categoryConfig[category] || categoryConfig.readiness
  const Icon = config.icon

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="mb-12"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
          {config.title}
        </h2>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map((insight, i) => (
          <InsightCard key={insight.id || i} insight={insight} index={i} />
        ))}
      </div>
    </motion.div>
  )
}

export default function Insights() {
  const [insights, setInsights] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getCareerInsights()
      .then(data => {
        setInsights(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const categories = ['readiness', 'velocity', 'market']
  const hasInsights = Object.values(insights).some(arr => arr?.length > 0)

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <WaveCanvas className="opacity-20 dark:opacity-10" color="#d9896c" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
            <HiOutlineChartBar className="w-4 h-4" />
            Career Analytics
          </span>
          <h1 className="text-3xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Your Career <span className="gradient-text">Insights</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Data-driven analytics to track your progress and understand market trends
          </p>
        </motion.div>

        {/* Insights */}
        {loading ? (
          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl skeleton" />
                  <div className="h-8 w-48 skeleton rounded" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="glass-card p-6">
                      <div className="h-8 w-24 skeleton rounded mb-2" />
                      <div className="h-4 w-32 skeleton rounded mb-2" />
                      <div className="h-3 w-40 skeleton rounded" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : hasInsights ? (
          <div>
            {categories.map((category, index) => (
              insights[category]?.length > 0 && (
                <InsightCategory
                  key={category}
                  category={category}
                  insights={insights[category]}
                  index={index}
                />
              )
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <HiOutlineChartBar className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-2">
              No Insights Available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start your learning journey to generate personalized insights
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
