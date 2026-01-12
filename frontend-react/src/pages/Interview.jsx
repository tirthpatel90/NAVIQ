import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  HiOutlineLightningBolt, 
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineStar,
  HiOutlineAcademicCap,
  HiOutlineFilter
} from 'react-icons/hi'
import GradientBlobCanvas from '../components/canvas/GradientBlobCanvas'
import api from '../services/api'

const difficultyColors = {
  'Beginner': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Intermediate': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  'Advanced': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

function QuestionCard({ question, index, isOpen, onToggle }) {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <div className="glass-card overflow-hidden">
        <button
          onClick={onToggle}
          className="w-full p-6 text-left flex items-start gap-4 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center flex-shrink-0 text-white font-bold">
            {index + 1}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${difficultyColors[question.difficulty] || difficultyColors['Intermediate']}`}>
                {question.difficulty}
              </span>
              <span className="px-2 py-1 text-xs font-medium bg-sage-100 text-sage-700 dark:bg-sage-900/30 dark:text-sage-400 rounded-full">
                {question.focus}
              </span>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 dark:text-white pr-8">
              {question.question}
            </h3>
          </div>
          
          <div className="flex-shrink-0 text-gray-400">
            {isOpen ? (
              <HiOutlineChevronUp className="w-5 h-5" />
            ) : (
              <HiOutlineChevronDown className="w-5 h-5" />
            )}
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-2 border-t border-gray-100 dark:border-gray-800">
                <div className="ml-14">
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-sage-600 dark:text-sage-400 mb-2 flex items-center gap-2">
                      <HiOutlineStar className="w-4 h-4" />
                      Answer
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {question.answer}
                    </p>
                  </div>
                  
                  {question.followUp && (
                    <div className="p-4 rounded-xl bg-coral/10 dark:bg-coral/5 border border-coral/20">
                      <h4 className="text-sm font-semibold text-coral mb-2 flex items-center gap-2">
                        <HiOutlineAcademicCap className="w-4 h-4" />
                        Follow-up Question
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {question.followUp}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default function Interview() {
  const [roles, setRoles] = useState([])
  const [selectedRole, setSelectedRole] = useState('')
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [openQuestions, setOpenQuestions] = useState(new Set())
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.getRoles().then(setRoles).catch(console.error)
  }, [])

  useEffect(() => {
    if (selectedRole) {
      setLoading(true)
      setOpenQuestions(new Set())
      api.getInterviewQuestions(selectedRole)
        .then(data => {
          setQuestions(data)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        })
    }
  }, [selectedRole])

  const toggleQuestion = (index) => {
    const newOpen = new Set(openQuestions)
    if (newOpen.has(index)) {
      newOpen.delete(index)
    } else {
      newOpen.add(index)
    }
    setOpenQuestions(newOpen)
  }

  const filteredQuestions = filter === 'all' 
    ? questions 
    : questions.filter(q => q.difficulty === filter)

  const expandAll = () => {
    setOpenQuestions(new Set(filteredQuestions.map((_, i) => i)))
  }

  const collapseAll = () => {
    setOpenQuestions(new Set())
  }

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <GradientBlobCanvas className="opacity-20" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm font-medium mb-4">
            <HiOutlineLightningBolt className="w-4 h-4" />
            Interview Prep
          </span>
          <h1 className="text-3xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Ace Your <span className="gradient-text">Interview</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Practice with real-world questions and detailed answers from industry experts
          </p>
        </motion.div>

        {/* Role Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 mb-8"
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Select a Role
          </label>
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.name)}
                className={`
                  px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-2
                  ${selectedRole === role.name
                    ? 'bg-sage-400 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                <span>{role.icon}</span>
                {role.name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Questions */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 mx-auto mb-4 border-4 border-sage-400/30 border-t-sage-400 rounded-full animate-spin" />
              <p className="text-gray-600 dark:text-gray-400">Loading questions...</p>
            </motion.div>
          ) : questions.length > 0 ? (
            <motion.div
              key="questions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <HiOutlineFilter className="w-5 h-5 text-gray-400" />
                  <div className="flex gap-2">
                    {['all', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                      <button
                        key={level}
                        onClick={() => setFilter(level)}
                        className={`
                          px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                          ${filter === level
                            ? 'bg-sage-400 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }
                        `}
                      >
                        {level === 'all' ? 'All' : level}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button onClick={expandAll} className="btn-ghost text-sm">
                    Expand All
                  </button>
                  <button onClick={collapseAll} className="btn-ghost text-sm">
                    Collapse All
                  </button>
                </div>
              </div>

              {/* Question count */}
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {filteredQuestions.length} question{filteredQuestions.length !== 1 ? 's' : ''}
              </p>

              {/* Questions list */}
              <div className="space-y-4">
                {filteredQuestions.map((question, index) => (
                  <QuestionCard
                    key={question.id || index}
                    question={question}
                    index={index}
                    isOpen={openQuestions.has(index)}
                    onToggle={() => toggleQuestion(index)}
                  />
                ))}
              </div>
            </motion.div>
          ) : selectedRole ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <HiOutlineLightningBolt className="w-12 h-12 text-purple-500" />
              </div>
              <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-2">
                No Questions Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Interview questions for {selectedRole} are coming soon
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <HiOutlineLightningBolt className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-2">
                Select a Role
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose a role above to see interview questions
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
