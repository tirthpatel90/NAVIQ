import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  HiOutlineBookOpen, 
  HiOutlineExternalLink,
  HiOutlineDocument,
  HiOutlinePlay,
  HiOutlineTemplate,
  HiOutlineMicrophone
} from 'react-icons/hi'
import ParticleCanvas from '../components/canvas/ParticleCanvas'
import api from '../services/api'

const typeIcons = {
  'Docs': HiOutlineDocument,
  'Video': HiOutlinePlay,
  'Guide': HiOutlineBookOpen,
  'Template': HiOutlineTemplate,
  'Canvas': HiOutlineTemplate,
  'Audio': HiOutlineMicrophone,
  'Lab': HiOutlineExternalLink,
  'Checklist': HiOutlineDocument,
}

function TopicCard({ topic, index, isActive, onClick }) {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  const Icon = typeIcons[topic.icon] || HiOutlineBookOpen

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <div className={`
        glass-card p-6 lg:p-8 h-full transition-all duration-500 card-hover
        ${isActive ? 'ring-2 ring-sage-400 shadow-xl' : ''}
      `}>
        <div className="flex items-start gap-4 mb-4">
          <span className="text-4xl">{topic.icon || '📚'}</span>
          <div className="flex-1">
            <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-1">
              {topic.title}
            </h3>
            <p className="text-sm text-sage-600 dark:text-sage-400">{topic.subhead}</p>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {topic.summary}
        </p>

        <AnimatePresence>
          {isActive && topic.resources?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 overflow-hidden"
            >
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <HiOutlineBookOpen className="w-4 h-4" />
                Resources
              </h4>
              {topic.resources.map((resource, i) => {
                const ResourceIcon = typeIcons[resource.type] || HiOutlineDocument
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-sage-100 dark:bg-sage-900/50 flex items-center justify-center flex-shrink-0">
                      <ResourceIcon className="w-5 h-5 text-sage-600 dark:text-sage-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {resource.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {resource.detail}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium bg-sage-100 dark:bg-sage-900/50 text-sage-600 dark:text-sage-400 rounded-full">
                      {resource.type}
                    </span>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {!isActive && topic.resources?.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-sage-500 dark:text-sage-400">
            <span>{topic.resources.length} resources</span>
            <span>•</span>
            <span>Click to expand</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function Study() {
  const [topics, setTopics] = useState([])
  const [activeTopic, setActiveTopic] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getStudyTopics()
      .then(data => {
        setTopics(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <ParticleCanvas className="opacity-30" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-coral/10 text-coral text-sm font-medium mb-4">
            <HiOutlineBookOpen className="w-4 h-4" />
            Study Resources
          </span>
          <h1 className="text-3xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Deep Dive <span className="gradient-text">Knowledge</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Curated resources organized by topic to accelerate your learning journey
          </p>
        </motion.div>

        {/* Topics Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-8 animate-pulse">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : topics.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {topics.map((topic, index) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                index={index}
                isActive={activeTopic === topic.id}
                onClick={() => setActiveTopic(activeTopic === topic.id ? null : topic.id)}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-coral/10 flex items-center justify-center">
              <HiOutlineBookOpen className="w-12 h-12 text-coral" />
            </div>
            <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-2">
              No Study Topics Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for curated learning resources
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
