import { Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { 
  HiOutlineArrowRight, 
  HiOutlineMap, 
  HiOutlineBookOpen, 
  HiOutlineLightningBolt,
  HiOutlineChartBar,
  HiOutlineChatAlt2,
  HiOutlineSparkles
} from 'react-icons/hi'
import Scene3D from '../components/3d/Scene3D'
import ParticleCanvas from '../components/canvas/ParticleCanvas'
import GradientBlobCanvas from '../components/canvas/GradientBlobCanvas'
import api from '../services/api'

const features = [
  {
    icon: HiOutlineMap,
    title: 'Learning Roadmaps',
    description: 'Personalized paths that adapt to your pace and goals. Step-by-step guidance from beginner to expert.',
    link: '/roadmap',
    color: 'from-sage-400 to-sage-600'
  },
  {
    icon: HiOutlineBookOpen,
    title: 'Study Resources',
    description: 'Curated materials, documentation, and hands-on projects to accelerate your learning journey.',
    link: '/study',
    color: 'from-coral to-copper'
  },
  {
    icon: HiOutlineLightningBolt,
    title: 'Interview Prep',
    description: 'Real-world questions with detailed answers. Practice with confidence and ace your interviews.',
    link: '/interview',
    color: 'from-purple-400 to-purple-600'
  },
  {
    icon: HiOutlineChartBar,
    title: 'Career Insights',
    description: 'Data-driven analytics on your progress, market trends, and personalized recommendations.',
    link: '/insights',
    color: 'from-blue-400 to-blue-600'
  },
  {
    icon: HiOutlineChatAlt2,
    title: 'AI Career Guide',
    description: 'Intelligent assistant that understands your goals and provides contextual guidance.',
    link: '/ai-guide',
    color: 'from-pink-400 to-pink-600'
  },
]

function FeatureCard({ feature, index }) {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link to={feature.link} className="group block h-full">
        <div className="glass-card h-full p-6 lg:p-8 card-hover">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
            <feature.icon className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-xl font-display font-semibold text-gray-900 dark:text-white mb-3">
            {feature.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {feature.description}
          </p>
          <div className="flex items-center gap-2 text-sage-500 dark:text-sage-400 font-medium group-hover:gap-3 transition-all">
            <span>Explore</span>
            <HiOutlineArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function RoleCard({ role, index }) {
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: true
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="flex-shrink-0 w-64"
    >
      <Link 
        to={`/roadmap?goal=${encodeURIComponent(role.name)}`}
        className="block group"
      >
        <div 
          className="glass-card p-6 text-center card-hover"
          style={{ borderColor: role.color + '40' }}
        >
          <span className="text-4xl mb-4 block">{role.icon}</span>
          <h4 className="font-display font-semibold text-gray-900 dark:text-white mb-2">
            {role.name}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {role.description}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}

function StatsSection() {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true
  })

  const stats = [
    { value: '50+', label: 'Career Paths' },
    { value: '1000+', label: 'Interview Questions' },
    { value: '500+', label: 'Resources' },
    { value: '24/7', label: 'AI Support' },
  ]

  return (
    <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          className="text-center"
        >
          <div className="text-4xl lg:text-5xl font-display font-bold gradient-text mb-2">
            {stat.value}
          </div>
          <div className="text-gray-600 dark:text-gray-400 font-medium">
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default function Home() {
  const [roles, setRoles] = useState([])
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  useEffect(() => {
    api.getRoles().then(setRoles).catch(console.error)
  }, [])

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-sage-100 to-ivory dark:from-forest dark:to-midnight" />}>
            <Scene3D variant="hero" />
          </Suspense>
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ivory/50 to-ivory dark:via-midnight/50 dark:to-midnight pointer-events-none" />

        {/* Hero Content */}
        <motion.div 
          style={{ y, opacity }}
          className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sage-400/10 border border-sage-400/20 text-sage-600 dark:text-sage-300 text-sm font-medium mb-6">
              <HiOutlineSparkles className="w-4 h-4" />
              Powered by AI & Your Ambitions
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-gray-900 dark:text-white mb-6"
          >
            Navigate Your Career
            <br />
            <span className="gradient-text">With Clarity</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10"
          >
            Personalized roadmaps, curated resources, and an AI guide that keeps you focused 
            on what matters. Transform your potential into achievement.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/roadmap" className="btn-primary flex items-center gap-2 text-lg">
              Start Your Journey
              <HiOutlineArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/interview" className="btn-secondary text-lg">
              Practice Interviews
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-gray-400 dark:border-gray-600 flex items-start justify-center p-1"
          >
            <motion.div className="w-1.5 h-3 rounded-full bg-sage-400" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GradientBlobCanvas className="opacity-30 dark:opacity-20" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to{' '}
              <span className="gradient-text">Succeed</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              A complete toolkit designed for focused learning and career growth
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Roles Carousel */}
      {roles.length > 0 && (
        <section className="py-20 lg:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="text-3xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mb-4">
                Choose Your{' '}
                <span className="gradient-text">Path</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Explore career paths tailored to your interests and goals
              </p>
            </motion.div>
          </div>

          <div className="relative">
            <div className="horizontal-scroll gap-6 px-4 sm:px-6 lg:px-8 pb-4">
              {roles.map((role, index) => (
                <RoleCard key={role.id} role={role} index={index} />
              ))}
            </div>
            
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-ivory dark:from-midnight to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-ivory dark:from-midnight to-transparent pointer-events-none" />
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="relative py-20 lg:py-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <ParticleCanvas className="opacity-50" />
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <StatsSection />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 animated-gradient opacity-10" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 lg:p-16"
          >
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Ready to Transform Your Career?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
              Join thousands of professionals who are navigating their careers with clarity and confidence.
            </p>
            <Link to="/roadmap" className="btn-primary inline-flex items-center gap-2 text-lg">
              Get Started Now
              <HiOutlineArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
