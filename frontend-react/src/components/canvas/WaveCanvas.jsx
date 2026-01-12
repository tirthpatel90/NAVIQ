import { useEffect, useRef } from 'react'

export default function WaveCanvas({ className = '', color = '#7f9a7d' }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let time = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    const drawWave = (yOffset, amplitude, frequency, speed, alpha) => {
      ctx.beginPath()
      ctx.moveTo(0, canvas.height / 2)

      for (let x = 0; x <= canvas.width; x += 5) {
        const y = yOffset + Math.sin(x * frequency + time * speed) * amplitude
              + Math.sin(x * frequency * 0.5 + time * speed * 0.8) * (amplitude * 0.5)
        ctx.lineTo(x, y)
      }

      ctx.lineTo(canvas.width, canvas.height)
      ctx.lineTo(0, canvas.height)
      ctx.closePath()

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, `${color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`)
      gradient.addColorStop(1, `${color}00`)
      ctx.fillStyle = gradient
      ctx.fill()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const baseY = canvas.height * 0.6
      
      // Draw multiple wave layers
      drawWave(baseY, 30, 0.01, 0.02, 0.15)
      drawWave(baseY + 20, 25, 0.015, 0.025, 0.2)
      drawWave(baseY + 40, 20, 0.02, 0.03, 0.25)
      
      time += 0.5
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
  }, [color])

  return (
    <canvas 
      ref={canvasRef} 
      className={`w-full h-full ${className}`}
      style={{ display: 'block' }}
    />
  )
}
