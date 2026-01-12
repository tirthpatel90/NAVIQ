import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HiOutlineChatAlt2, 
  HiOutlinePaperAirplane,
  HiOutlineSparkles,
  HiOutlineLightBulb
} from 'react-icons/hi'
import ParticleCanvas from '../components/canvas/ParticleCanvas'

const PROMPT_CHIPS = [
  'Guide me step by step',
  'What should I learn next?',
  'Is this career right for me?',
  'Compare two roles',
  'Prep me for tomorrow',
  'Explain a concept',
]

const INITIAL_MESSAGES = [
  { 
    role: 'assistant', 
    content: "Hello! I'm your AI career guide. I can help you navigate your learning journey, prepare for interviews, and make informed career decisions. What would you like to explore today?" 
  },
]

function Message({ message, index }) {
  const isAssistant = message.role === 'assistant'
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`flex gap-3 ${isAssistant ? '' : 'flex-row-reverse'}`}
    >
      <div className={`
        w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
        ${isAssistant 
          ? 'bg-gradient-to-br from-sage-400 to-sage-600' 
          : 'bg-gradient-to-br from-coral to-copper'
        }
      `}>
        {isAssistant ? (
          <HiOutlineSparkles className="w-5 h-5 text-white" />
        ) : (
          <span className="text-white font-bold text-sm">Y</span>
        )}
      </div>
      
      <div className={`
        max-w-[80%] rounded-2xl px-4 py-3
        ${isAssistant 
          ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none' 
          : 'bg-sage-400 text-white rounded-tr-none'
        }
      `}>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>
    </motion.div>
  )
}

export default function AIGuide() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = (userMessage) => {
    // Simulate AI response based on keywords
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('learn') || lowerMessage.includes('next')) {
      return "Based on your current progress, I'd recommend focusing on these areas:\n\n1. **Strengthen fundamentals** - Make sure you have a solid foundation in core concepts\n2. **Build projects** - Apply what you learn through hands-on practice\n3. **Practice interviews** - Use our interview prep section to build confidence\n\nWould you like me to create a personalized learning plan for you?"
    }
    
    if (lowerMessage.includes('career') || lowerMessage.includes('right')) {
      return "Choosing the right career path is a significant decision. Here are some questions to consider:\n\n• What activities make you lose track of time?\n• What problems do you enjoy solving?\n• Where do you see yourself in 5 years?\n\nLet's explore your interests together. Tell me about a project or task you've really enjoyed working on."
    }
    
    if (lowerMessage.includes('compare') || lowerMessage.includes('vs')) {
      return "I'd be happy to help you compare different career paths! To give you the most relevant comparison, please tell me:\n\n1. Which two roles are you considering?\n2. What aspects are most important to you (salary, growth, work-life balance)?\n\nThis will help me provide a detailed comparison tailored to your priorities."
    }
    
    if (lowerMessage.includes('prep') || lowerMessage.includes('interview') || lowerMessage.includes('tomorrow')) {
      return "Great initiative on preparing ahead! Here's a quick prep plan:\n\n📋 **Today:**\n• Review common questions for your target role\n• Practice 2-3 behavioral questions (STAR method)\n• Research the company\n\n💡 **Night before:**\n• Get 7-8 hours of sleep\n• Prepare your outfit\n• Review your resume\n\n🌅 **Morning of:**\n• Light breakfast\n• Arrive 10-15 minutes early\n• Take deep breaths and stay calm\n\nWant me to quiz you on some practice questions?"
    }
    
    if (lowerMessage.includes('explain') || lowerMessage.includes('concept')) {
      return "I'd be happy to explain any concept! Just tell me:\n\n• What topic you'd like to understand better\n• Your current level of understanding\n• Any specific aspects you're confused about\n\nI'll break it down in a way that makes sense for your background."
    }
    
    if (lowerMessage.includes('step') || lowerMessage.includes('guide')) {
      return "I'll guide you step by step! First, let's understand your current situation:\n\n1. **What's your goal?** (e.g., new job, skill development, career change)\n2. **What's your timeline?** (weeks, months, or just exploring)\n3. **What's your current experience level?**\n\nOnce I understand these, I can create a personalized roadmap for you."
    }
    
    return "That's a great question! I'm here to help you navigate your career journey. Here are some ways I can assist:\n\n• Create personalized learning roadmaps\n• Help prepare for interviews\n• Compare different career paths\n• Explain complex concepts\n• Provide study recommendations\n\nWhat would you like to explore first?"
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI response delay
    setTimeout(() => {
      const response = generateResponse(userMessage.content)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000)
  }

  const handleChipClick = (prompt) => {
    setInput(prompt)
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <ParticleCanvas className="opacity-20" />
      </div>

      <div className="relative flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 text-sm font-medium mb-4">
            <HiOutlineChatAlt2 className="w-4 h-4" />
            AI Career Guide
          </span>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-gray-900 dark:text-white">
            Your Personal <span className="gradient-text">Career Assistant</span>
          </h1>
        </motion.div>

        {/* Chat Container */}
        <div className="flex-1 glass-card rounded-2xl flex flex-col overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
            <AnimatePresence>
              {messages.map((message, index) => (
                <Message key={index} message={message} index={index} />
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center">
                  <HiOutlineSparkles className="w-5 h-5 text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-none px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Chips */}
          <div className="px-4 lg:px-6 py-3 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center gap-2 mb-3">
              <HiOutlineLightBulb className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Quick prompts</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PROMPT_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleChipClick(chip)}
                  className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full hover:bg-sage-100 dark:hover:bg-sage-900/30 hover:text-sage-600 dark:hover:text-sage-400 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 lg:p-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about your career journey..."
                className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-sage-400 transition-all"
              />
              <motion.button
                type="submit"
                disabled={!input.trim() || isTyping}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 rounded-xl bg-gradient-to-br from-sage-400 to-sage-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
              >
                <HiOutlinePaperAirplane className="w-5 h-5 rotate-90" />
                <span className="hidden sm:inline">Send</span>
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
