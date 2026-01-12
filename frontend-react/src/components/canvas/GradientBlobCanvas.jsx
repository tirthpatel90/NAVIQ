import { useEffect, useRef } from 'react'

export default function GradientBlobCanvas({ className = '' }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let time = 0

    const colors = [
      { r: 127, g: 154, b: 125 }, // sage
      { r: 217, g: 137, b: 108 }, // coral
      { r: 78, g: 106, b: 83 },   // sage deep
      { r: 196, g: 106, b: 76 },  // copper
    ]

    class Blob {
      constructor(x, y, radius, color, speed) {
        this.x = x
        this.y = y
        this.baseX = x
        this.baseY = y
        this.radius = radius
        this.color = color
        this.speed = speed
        this.offset = Math.random() * Math.PI * 2
      }

      update(time) {
        this.x = this.baseX + Math.sin(time * this.speed + this.offset) * 50
        this.y = this.baseY + Math.cos(time * this.speed * 0.8 + this.offset) * 40
      }

      draw(ctx) {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        )
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.6)`)
        gradient.addColorStop(0.5, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.3)`)
        gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`)
        
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    let blobs = []

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

      // Create blobs
      blobs = [
        new Blob(canvas.width * 0.2, canvas.height * 0.3, 200, colors[0], 0.0008),
        new Blob(canvas.width * 0.8, canvas.height * 0.2, 180, colors[1], 0.001),
        new Blob(canvas.width * 0.5, canvas.height * 0.7, 220, colors[2], 0.0006),
        new Blob(canvas.width * 0.15, canvas.height * 0.8, 160, colors[3], 0.0012),
        new Blob(canvas.width * 0.85, canvas.height * 0.6, 190, colors[0], 0.0009),
      ]
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Apply blur effect
      ctx.filter = 'blur(60px)'
      
      blobs.forEach(blob => {
        blob.update(time)
        blob.draw(ctx)
      })
      
      ctx.filter = 'none'
      
      time++
      animationRef.current = requestAnimationFrame(animate)
    }

    resize()
    window.addEventListener('resize', resize)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
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
