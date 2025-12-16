"use client";

import * as THREE from 'three'
import React, { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, DepthOfField } from '@react-three/postprocessing'
interface GalaxyProps {
  dof: React.RefObject<any>;
}

function Galaxy({ dof }: GalaxyProps) {
  const parameters = {
    count: 100000,
    size: 0.005,
    radius: 5,
    branches: 8,
    spin: 1.25,
    randomness: 1,
    randomnessPower: 10,
    insideColor: '#ff6030',
    outsideColor: '#1b3984',
    animate: true,
    mouse: true,
    opacity: 1,
    focusDistance: 0.05,
    focalLength: 0.05,
    width: 480,
    height: 480,
    focusX: 0,
    focusY: 0,
    focusZ: 0,
  }
  const particles = useRef<THREE.Points>(null)
  //const [movement] = useState(() => new THREE.Vector3())
  const [temp] = useState(() => new THREE.Vector3())
  const [focus] = useState(() => new THREE.Vector3())

  useEffect(() => {
    if (particles.current) {
      generateGalaxy()
    }
  }, [])

  useFrame((state, delta) => {
    //dof.current.target = focus.lerp(particles.current.position, 0.05)
    //movement.lerp(temp.set(state.mouse.x, state.mouse.y * 0.2, 0), 0.2)
    if (dof.current) {
      dof.current.circleOfConfusionMaterial.uniforms.focusDistance.value = parameters.focusDistance
      dof.current.circleOfConfusionMaterial.uniforms.focalLength.value = parameters.focalLength
      dof.current.resolution.height = parameters.height
      dof.current.resolution.width = parameters.width
      dof.current.target = new THREE.Vector3(parameters.focusX, parameters.focusY, parameters.focusZ)
      dof.current.blendMode.opacity.value = parameters.opacity
    }

    if (particles.current) {
      if (parameters.mouse) {
        //particles.current.position.x = THREE.MathUtils.lerp(particles.current.position.x, state.mouse.x * 20, 0.2)
        particles.current.rotation.x = THREE.MathUtils.lerp(particles.current.rotation.x, state.mouse.y / 10, 0.2)
        particles.current.rotation.y = THREE.MathUtils.lerp(particles.current.rotation.y, -state.mouse.x / 2, 0.2)
      }

      // TODO use delta instead
      if (parameters.animate) {
        const elapsedTime = state.clock.getElapsedTime()
        particles.current.rotation.y = 0.05 * elapsedTime
      }
    }
  })

  const generateGalaxy = () => {
    if (!particles.current) return;
    
    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)
    //const colorInside = new THREE.Color(parameters.insideColor)
    //const colorOutside = new THREE.Color(parameters.outsideColor)
    const colorInside = new THREE.Color(1.0, 0.3765, 0.1882)
    const colorOutside = new THREE.Color(0.10588, 0.22353, 0.51765)

    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3

      const radius = Math.random() * parameters.radius
      const spinAngle = radius * parameters.spin
      const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2

      const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
      const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius
      const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
      positions[i3 + 1] = randomY
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

      const mixedColor = colorInside.clone()
      mixedColor.lerp(colorOutside, radius / parameters.radius)

      colors[i3] = mixedColor.r
      colors[i3 + 1] = mixedColor.g
      colors[i3 + 2] = mixedColor.b
    }

    particles.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particles.current.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  }

  return (
    <points ref={particles}>
      <bufferGeometry />
      <pointsMaterial size={parameters.size} sizeAttenuation={true} depthWrite={true} vertexColors={true} blending={THREE.AdditiveBlending} />
    </points>
  )
}

interface KnotProps {
  position: [number, number, number];
}

function Knot(props: KnotProps) {
  const knotRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    //knotRef.current.rotation.y += -0.01
    //knotRef.current.position.z = Math.sin(clock.getElapsedTime()) * 10 - 10;
  })

  return (
    <mesh ref={knotRef} position={props.position}>
      <torusKnotGeometry args={[1, 0.25, 256, 32]} />
      <meshLambertMaterial color={'#8888FF'} />
    </mesh>
  )
}

interface NucleusProps {
  size: number;
}

function Nucleus({ size }: NucleusProps) {
  const nucleusRef = useRef<THREE.Mesh>(null)
  const color = new THREE.Color()
  color.setHSL(Math.random(), 0.7, Math.random() * 0.2 + 0.05)

  return (
    <mesh ref={nucleusRef} position={[0, 0, 0]} scale={[size, size, size]}>
      <sphereGeometry args={[0.5, 32, 32, 0, 6.4, 0, 6.3]} />
      <meshBasicMaterial color={'#fff'} />
    </mesh>
  )

}

const Effects = React.forwardRef<any, any>((props, ref) => {
  const bokehScale = 1;
  return (
    <EffectComposer multisampling={0}>
      <DepthOfField ref={ref} bokehScale={bokehScale} />
    </EffectComposer>
  )
})

interface GalaxyCanvasProps {
  paused?: boolean;
}

export function GalaxyCanvas({ paused = false }: GalaxyCanvasProps) {
  const dof = useRef<any>(null)
  
  return (
    <div className="absolute inset-0 z-[1] w-full h-full pointer-events-none">
      <Canvas 
        linear 
        flat 
        camera={{ position: [0, 0.8, 4] }}
        gl={{ alpha: true }}
        frameloop={paused ? "never" : "always"}
      >
        <Suspense fallback={null}>
          <Galaxy dof={dof} />
          <Nucleus size={0.125} />
        </Suspense>
        <Effects ref={dof} />
      </Canvas>
    </div>
  )
}
