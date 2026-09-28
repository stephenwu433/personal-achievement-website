import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, OrbitControls } from '@react-three/drei'
import { BackSide, type Group, type Mesh } from 'three'

function Ribbon({
  radius,
  color,
  speed,
  rotation,
}: {
  radius: number
  color: string
  speed: number
  rotation: [number, number, number]
}) {
  const mesh = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (!mesh.current) return
    mesh.current.rotation.z += delta * speed
  })

  return (
    <mesh ref={mesh} rotation={rotation}>
      <torusGeometry args={[radius, 0.018, 16, 140]} />
      <meshStandardMaterial color={color} metalness={0.95} roughness={0.22} />
    </mesh>
  )
}

function Core() {
  const group = useRef<Group>(null)

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.18
  })

  return (
    <group ref={group} position={[0, 0.35, 0]}>
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.4}>
        <mesh>
          <icosahedronGeometry args={[0.72, 4]} />
          <MeshDistortMaterial
            color="#e7b089"
            roughness={0.28}
            metalness={0.15}
            distort={0.32}
            speed={1.6}
          />
        </mesh>
      </Float>
      <Ribbon radius={1.45} color="#f2d7b6" speed={0.22} rotation={[1.15, 0.2, 0]} />
      <Ribbon radius={1.7} color="#d7b48a" speed={-0.16} rotation={[0.4, 0.8, 1.1]} />
      <Ribbon radius={1.15} color="#9eb6c9" speed={0.28} rotation={[1.8, 0.4, 0.6]} />
    </group>
  )
}

function Dust() {
  const group = useRef<Group>(null)
  const spots = useMemo(
    () =>
      Array.from({ length: 36 }, (_, index) => {
        const seed = (index + 1) * 12.9898
        const rand = (step: number) => {
          const value = Math.sin(seed * step) * 43758.5453
          return value - Math.floor(value)
        }
        return {
          position: [
            (rand(1) - 0.5) * 9,
            rand(2) * 3.2 - 0.4,
            (rand(3) - 0.5) * 7,
          ] as [number, number, number],
          scale: 0.015 + rand(4) * 0.03,
        }
      }),
    [],
  )

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.04
  })

  return (
    <group ref={group}>
      {spots.map((spot, index) => (
        <mesh key={index} position={spot.position}>
          <sphereGeometry args={[spot.scale, 8, 8]} />
          <meshBasicMaterial color="#f6e7d2" />
        </mesh>
      ))}
    </group>
  )
}

export default function Space() {
  return (
    <>
      <color attach="background" args={['#6a5344']} />
      <fog attach="fog" args={['#6a5344', 7, 16]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 5]} intensity={2.4} color="#fff4e8" />
      <pointLight position={[-3.2, 1.6, 2.4]} intensity={18} color="#ffb27a" distance={10} />
      <pointLight position={[3.4, 0.8, -1.5]} intensity={12} color="#9eb8d4" distance={9} />
      <mesh scale={[14, 9, 14]} position={[0, 1.2, 0]}>
        <sphereGeometry args={[1, 48, 32]} />
        <meshStandardMaterial color="#8a6b56" side={BackSide} roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.15, 0]}>
        <circleGeometry args={[7.5, 72]} />
        <meshStandardMaterial color="#4e3b30" metalness={0.35} roughness={0.62} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.14, 0]}>
        <ringGeometry args={[2.15, 2.19, 80]} />
        <meshStandardMaterial color="#f0d2ae" metalness={1} roughness={0.3} />
      </mesh>
      <Core />
      <Dust />
      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={3.6}
        maxDistance={8.5}
        minPolarAngle={0.85}
        maxPolarAngle={1.4}
        autoRotate
        autoRotateSpeed={0.55}
        target={[0, 0.2, 0]}
      />
    </>
  )
}
