import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  HiOutlineAcademicCap, 
  HiOutlineCheckCircle, 
  HiOutlineBookOpen,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineClock
} from 'react-icons/hi'
import WaveCanvas from '../components/canvas/WaveCanvas'
import api from '../services/api'

function MilestoneCard({ milestone, index, isActive, onClick }) {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={onClick}
      className={`relative cursor-pointer group ${isActive ? 'z-10' : ''}`}
    >
      {/* Timeline connector */}
      {index > 0 && (
        <div className="absolute left-6 -top-8 w-0.5 h-8 bg-gradient-to-b from-sage-200 to-sage-400 dark:from-sage-800 dark:to-sage-600" />
      )}
      
      <div className={`
        relative glass-card p-6 lg:p-8 transition-all duration-500
        ${isActive 
          ? 'border-2 border-sage-400 shadow-lg shadow-sage-400/20' 
          : 'hover:border-sage-300 dark:hover:border-sage-600'
        }
      `}>
        {/* Step number */}
        <div className={`
          absolute -left-4 top-6 w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg
          ${isActive 
            ? 'bg-gradient-to-br from-sage-400 to-sage-600 text-white shadow-lg' 
            : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-sage-100 dark:group-hover:bg-sage-900'
          }
        `}>
          {index + 1}
        </div>

        <div className="pl-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-mono text-sage-500 dark:text-sage-400 bg-sage-100 dark:bg-sage-900/50 px-2 py-1 rounded">
              {milestone.duration}
            </span>
          </div>
          
          <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-3">
            {milestone.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {milestone.details}
          </p>

          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Outcomes */}
                {milestone.outcomes?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <HiOutlineCheckCircle className="w-4 h-4 text-sage-500" />
                      Learning Outcomes
                    </h4>
                    <ul className="space-y-2">
                      {milestone.outcomes.map((outcome, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-sage-400 mt-1.5 flex-shrink-0" />
                          {outcome}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Resources */}
                {milestone.resources?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <HiOutlineBookOpen className="w-4 h-4 text-coral" />
                      Resources
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {milestone.resources.map((resource, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 text-sm bg-coral/10 text-coral dark:bg-coral/20 rounded-full"
                        >
                          {resource}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

export default function Roadmap() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [goals, setGoals] = useState([])
  const [roadmap, setRoadmap] = useState(null)
  const [selectedGoal, setSelectedGoal] = useState(searchParams.get('goal') || '')
  const [selectedDays, setSelectedDays] = useState(30)
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.getRoadmapGoals().then(setGoals).catch(console.error)
  }, [])

  useEffect(() => {
    if (selectedGoal) {
      setLoading(true)
      api.getRoadmap(selectedGoal, selectedDays)
        .then(data => {
          setRoadmap(data)
          setActiveStep(0)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [selectedGoal, selectedDays])

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal)
    setSearchParams({ goal })
  }

  const handlePrev = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1)
  }

  const handleNext = () => {
    if (roadmap && activeStep < roadmap.milestones.length - 1) {
      setActiveStep(activeStep + 1)
    }
  }

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <WaveCanvas className="opacity-20 dark:opacity-10" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-400/10 text-sage-600 dark:text-sage-300 text-sm font-medium mb-4">
            <HiOutlineAcademicCap className="w-4 h-4" />
            Learning Roadmap
          </span>
          <h1 className="text-3xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
            Your Path to <span className="gradient-text">Mastery</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Select a career goal and timeline to generate your personalized learning roadmap
          </p>
        </motion.div>

        {/* Goal Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 lg:p-8 mb-12"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Career Goal
              </label>
              <select
                value={selectedGoal}
                onChange={(e) => handleGoalSelect(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-sage-400 focus:border-transparent transition-all"
              >
                <option value="">Select a goal...</option>
                {goals.map((goal) => (
                  <option key={goal.name} value={goal.name}>
                    {goal.icon} {goal.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timeline
              </label>
              <div className="flex gap-3">
                {[30, 60, 90].map((days) => (
                  <button
                    key={days}
                    onClick={() => setSelectedDays(days)}
                    className={`
                      flex-1 px-4 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2
                      ${selectedDays === days
                        ? 'bg-sage-400 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <HiOutlineClock className="w-4 h-4" />
                    {days} Days
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Roadmap Display */}
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
              <p className="text-gray-600 dark:text-gray-400">Generating your roadmap...</p>
            </motion.div>
          ) : roadmap ? (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 lg:p-8 mb-8"
              >
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
                  {roadmap.goal}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{roadmap.overview}</p>
              </motion.div>

              {/* Milestones */}
              <div className="space-y-8 ml-4">
                {roadmap.milestones?.map((milestone, index) => (
                  <MilestoneCard
                    key={index}
                    milestone={milestone}
                    index={index}
                    isActive={activeStep === index}
                    onClick={() => setActiveStep(index)}
                  />
                ))}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 glass-card p-4">
                <button
                  onClick={handlePrev}
                  disabled={activeStep === 0}
                  className="btn-ghost flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <HiOutlineChevronLeft className="w-5 h-5" />
                  Previous
                </button>
                
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Step {activeStep + 1} of {roadmap.milestones?.length || 0}
                </span>
                
                <button
                  onClick={handleNext}
                  disabled={!roadmap.milestones || activeStep === roadmap.milestones.length - 1}
                  className="btn-ghost flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <HiOutlineChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-sage-100 dark:bg-sage-900/30 flex items-center justify-center">
                <HiOutlineMap className="w-12 h-12 text-sage-400" />
              </div>
              <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-2">
                Select a Goal to Begin
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose your career goal above to generate a personalized roadmap
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
