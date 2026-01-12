import { useEffect, useRef } from 'react'

class Particle {
  constructor(canvas, ctx) {
    this.canvas = canvas
    this.ctx = ctx
    this.reset()
  }

  reset() {
    this.x = Math.random() * this.canvas.width
    this.y = Math.random() * this.canvas.height
    this.size = Math.random() * 3 + 1
    this.speedX = (Math.random() - 0.5) * 0.5
    this.speedY = (Math.random() - 0.5) * 0.5
    this.color = Math.random() > 0.5 ? 'rgba(127, 154, 125, 0.6)' : 'rgba(217, 137, 108, 0.6)'
    this.connections = []
  }

  update(mouse) {
    this.x += this.speedX
    this.y += this.speedY

    // Mouse interaction
    if (mouse.x && mouse.y) {
      const dx = mouse.x - this.x
      const dy = mouse.y - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance < 150) {
        const force = (150 - distance) / 150
        this.x -= dx * force * 0.02
        this.y -= dy * force * 0.02
      }
    }

    // Wrap around edges
    if (this.x < 0) this.x = this.canvas.width
    if (this.x > this.canvas.width) this.x = 0
    if (this.y < 0) this.y = this.canvas.height
    if (this.y > this.canvas.height) this.y = 0
  }

  draw() {
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    this.ctx.fillStyle = this.color
    this.ctx.fill()
  }
}

export default function ParticleCanvas({ className = '' }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: null, y: null })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let particles = []

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      
      // Reinitialize particles
      const particleCount = Math.min(100, Math.floor((canvas.width * canvas.height) / 15000))
      particles = []
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas, ctx))
      }
      particlesRef.current = particles
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: (e.clientX - rect.left) * window.devicePixelRatio,
        y: (e.clientY - rect.top) * window.devicePixelRatio
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null }
    }

    const drawConnections = () => {
      const connectionDistance = 120
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          
          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.3
            ctx.beginPath()
            ctx.strokeStyle = `rgba(127, 154, 125, ${opacity})`
            ctx.lineWidth = 1
            ctx.moveTo(particles[i].x, particles[j].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(particle => {
        particle.update(mouseRef.current)
        particle.draw()
      })
      
      drawConnections()
      
      animationRef.current = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className={`w-full h-full ${className}`}
      style={{ display: 'block' }}
    />
  )
}
