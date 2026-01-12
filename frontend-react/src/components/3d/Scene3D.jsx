import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, Stars } from '@react-three/drei'
import * as THREE from 'three'

function FloatingOrb({ position, color, speed = 1, distort = 0.4, size = 1 }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.3) * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2
    }
  })

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[size, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  )
}

function ParticleField({ count = 500 }) {
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50
    }
    return positions
  }, [count])

  const pointsRef = useRef()

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.02
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.03
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#7f9a7d"
        sizeAttenuation
        transparent
        opacity={0.6}
      />
    </points>
  )
}

function AnimatedRing({ radius = 3, color = "#d9896c" }) {
  const ringRef = useRef()

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, 0.02, 16, 100]} />
      <meshBasicMaterial color={color} transparent opacity={0.5} />
    </mesh>
  )
}

export default function Scene3D({ variant = 'hero' }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 60 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
    >
      {/* Ambient light */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light */}
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#7f9a7d" />
      
      {/* Point lights for accent */}
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#d9896c" />
      <pointLight position={[-5, -5, 5]} intensity={0.3} color="#7f9a7d" />

      {variant === 'hero' && (
        <>
          {/* Main floating orbs */}
          <FloatingOrb position={[-4, 2, 0]} color="#7f9a7d" size={1.5} distort={0.3} speed={0.8} />
          <FloatingOrb position={[4, -1, -2]} color="#d9896c" size={1.2} distort={0.4} speed={1.2} />
          <FloatingOrb position={[0, -3, 1]} color="#4e6a53" size={0.8} distort={0.5} speed={1} />
          <FloatingOrb position={[-3, -2, -3]} color="#c46a4c" size={0.6} distort={0.35} speed={0.9} />
          <FloatingOrb position={[3, 3, -1]} color="#9fb99f" size={0.9} distort={0.45} speed={1.1} />
          
          {/* Animated rings */}
          <AnimatedRing radius={5} color="#7f9a7d" />
          <AnimatedRing radius={4} color="#d9896c" />
          
          {/* Particle field */}
          <ParticleField count={300} />
        </>
      )}

      {variant === 'minimal' && (
        <>
          <FloatingOrb position={[3, 1, -2]} color="#7f9a7d" size={0.8} distort={0.3} speed={0.5} />
          <FloatingOrb position={[-2, -1, -1]} color="#d9896c" size={0.5} distort={0.4} speed={0.7} />
          <ParticleField count={100} />
        </>
      )}

      {variant === 'stars' && (
        <>
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <FloatingOrb position={[0, 0, 0]} color="#7f9a7d" size={2} distort={0.2} speed={0.3} />
        </>
      )}
    </Canvas>
  )
}
