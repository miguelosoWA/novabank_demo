"use client"

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js'
import { fs as backdropFS, vs as backdropVS } from './backdrop-shader'
import { vs as sphereVS } from './sphere-shader'
import { AudioAnalyser } from './audio-analyser'

interface SphereVisualProps {
  inputNode?: AudioNode
  outputNode?: AudioNode
  className?: string
  isActive?: boolean
}

// TODO: Check this once the sphere is showing on the screen
// export interface SphereVisualRef {
//   updateAudioNodes: (inputNode?: AudioNode, outputNode?: AudioNode) => void
// }

// export const SphereVisual = forwardRef<SphereVisualRef, SphereVisualProps>(
export const SphereVisual = forwardRef<any, SphereVisualProps>(
  ({ inputNode, outputNode, className = "", isActive = true }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const sceneRef = useRef<THREE.Scene | null>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
    const sphereRef = useRef<THREE.Mesh | null>(null)
    const backdropRef = useRef<THREE.Mesh | null>(null)
    const composerRef = useRef<EffectComposer | null>(null)
    const animationIdRef = useRef<number | null>(null)
    const inputAnalyserRef = useRef<AudioAnalyser | null>(null)
    const outputAnalyserRef = useRef<AudioAnalyser | null>(null)
    const prevTimeRef = useRef(0)
    const rotationRef = useRef(new THREE.Vector3(0, 0, 0))

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      updateAudioNodes: (newInputNode?: AudioNode, newOutputNode?: AudioNode) => {
        // Clean up existing analysers
        if (inputAnalyserRef.current) {
          inputAnalyserRef.current.disconnect()
          inputAnalyserRef.current = null
        }
        if (outputAnalyserRef.current) {
          outputAnalyserRef.current.disconnect()
          outputAnalyserRef.current = null
        }

        // Create new analysers if nodes are provided
        if (newInputNode) {
          inputAnalyserRef.current = new AudioAnalyser(newInputNode)
          console.log('[SphereVisual] Created input analyser')
        }
        if (newOutputNode) {
          outputAnalyserRef.current = new AudioAnalyser(newOutputNode)
          console.log('[SphereVisual] Created output analyser')
        }
      }
    }))

    const initThreeJS = () => {
      if (!containerRef.current || !canvasRef.current) {
        console.log('[SphereVisual] Missing refs:', { 
          hasContainer: !!containerRef.current, 
          hasCanvas: !!canvasRef.current 
        })
        return
      }

      const container = containerRef.current
      const canvas = canvasRef.current

      console.log('[SphereVisual] Initializing with dimensions:', {
        width: container.clientWidth,
        height: container.clientHeight
      })

      // Ensure container has dimensions before proceeding
      if (container.clientWidth === 0 || container.clientHeight === 0) {
        console.warn('[SphereVisual] Container has no dimensions, retrying initialization...')
        setTimeout(() => initThreeJS(), 100)
        return
      }

      // Scene setup
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0xffffff)
      sceneRef.current = scene

      console.log('[SphereVisual] Scene created with white background')

      // Add basic lighting to ensure sphere is visible
      const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
      scene.add(ambientLight)
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0)
      directionalLight.position.set(5, 5, 5)
      scene.add(directionalLight)

      console.log('[SphereVisual] Lighting added')

      // Camera setup
      const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      )
      camera.position.set(0, 0, 3) // Simpler camera position for visibility
      camera.lookAt(0, 0, 0) // Ensure camera is looking at the sphere
      cameraRef.current = camera

      console.log('[SphereVisual] Camera positioned at:', camera.position)

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: false
      })
      renderer.setSize(container.clientWidth, container.clientHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setClearColor(0xffffff, 1.0) // Ensure white background
      rendererRef.current = renderer

      console.log('[SphereVisual] Renderer created with size:', {
        width: container.clientWidth,
        height: container.clientHeight
      })

      // Create a simple sphere first (without complex shaders for debugging)
      const geometry = new THREE.SphereGeometry(0.7, 32, 32) // Use simple sphere geometry, smaller radius
      const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0xff8800,
        metalness: 0.1,
        roughness: 0.9,
        emissive: 0xff8800,
        emissiveIntensity: 0,
      });

      const sphere = new THREE.Mesh(geometry, sphereMaterial)
      scene.add(sphere)
      sphere.visible = true
      sphereRef.current = sphere

      console.log('[SphereVisual] Sphere created and added to scene')

      // Add backdrop (but make it subtle so it doesn't interfere)
      const backdrop = new THREE.Mesh(
        new THREE.IcosahedronGeometry(10, 5),
        new THREE.RawShaderMaterial({
          uniforms: {
            resolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
            rand: { value: 0 },
          },
          vertexShader: backdropVS,
          fragmentShader: backdropFS,
          glslVersion: THREE.GLSL3,
          transparent: true,
          opacity: 0.1 // Make backdrop very subtle
        })
      )
      backdrop.material.side = THREE.BackSide
      scene.add(backdrop)
      backdropRef.current = backdrop

      // Post-processing setup (simplified)
      const renderPass = new RenderPass(scene, camera)
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(container.clientWidth, container.clientHeight),
        1.5, // Reduced bloom strength
        0.4,
        0.85
      )

      const composer = new EffectComposer(renderer)
      composer.addPass(renderPass)
      composer.addPass(bloomPass)
      composerRef.current = composer

      console.log('[SphereVisual] Post-processing setup complete')

      // Handle window resize
      const handleResize = () => {
        if (!container || !camera || !renderer || !composer || !backdrop) return

        const width = container.clientWidth
        const height = container.clientHeight

        camera.aspect = width / height
        camera.updateProjectionMatrix()

        const dPR = renderer.getPixelRatio()
        const backdropMaterial = backdrop.material as THREE.RawShaderMaterial
        backdropMaterial.uniforms.resolution.value.set(width * dPR, height * dPR)

        renderer.setSize(width, height)
        composer.setSize(width, height)
      }

      window.addEventListener('resize', handleResize)
      handleResize()

      // Start animation loop
      startAnimation()

      console.log('[SphereVisual] Initialization complete, animation started')

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }

    const startAnimation = () => {
      let frameCount = 0
      const animate = () => {
        frameCount++
        const t = performance.now()
        
        // Reduced debug logging - every 5 seconds

        // Update audio analysers only when active
        if (isActive) {
          if (inputAnalyserRef.current) {
            inputAnalyserRef.current.update()
          }
          if (outputAnalyserRef.current) {
            outputAnalyserRef.current.update()
            
            // Debug: Check if we're getting real audio data
            const data = outputAnalyserRef.current.data
            if (data && data.length > 0) {
              const maxLevel = Math.max(...Array.from(data))
              if (maxLevel > 5 && Math.floor(t) % 500 < 16) {
              }
            }
          }
        }

        // Move t declaration to top for early debugging
        // const t = performance.now() - already declared above
        const dt = (t - prevTimeRef.current) / (1000 / 60)
        prevTimeRef.current = t

        // Update backdrop
        if (backdropRef.current) {
          const backdropMaterial = backdropRef.current.material as THREE.RawShaderMaterial
          backdropMaterial.uniforms.rand.value = Math.random() * 10000
        }

        // Update sphere (simplified for debugging)
        if (sphereRef.current && cameraRef.current) {
          const sphereMaterial = sphereRef.current.material as THREE.MeshStandardMaterial
          
          // Use audio data only when active, otherwise use default values for smooth animation
          const inputData = (isActive && inputAnalyserRef.current?.data) || new Uint8Array(16)
          const outputData = (isActive && outputAnalyserRef.current?.data) || new Uint8Array(16)
          
          // Basic sphere animation even without audio
          sphereRef.current.rotation.y += 0.02
          sphereRef.current.rotation.x += 0.01
          
          // Ensure sphere is always visible and has some base scale
          sphereRef.current.visible = true
          if (sphereRef.current.scale.x < 0.8) {
            sphereRef.current.scale.setScalar(1.0)
          }
          
          // Get audio levels for animation
          let inputLevel = 0
          let outputLevel = 0
          
          if (inputAnalyserRef.current && inputData.length > 0) {
            // Calculate average audio level from frequency data
            inputLevel = Array.from(inputData).reduce((a, b) => a + b, 0) / inputData.length
          }
          
          if (outputAnalyserRef.current && outputData.length > 0) {
            // Calculate average audio level from frequency data
            outputLevel = Array.from(outputData).reduce((a, b) => a + b, 0) / outputData.length
          }
          
          // Real audio processing only - no fake audio needed
          
          // Scale sphere based on audio output only
          const audioScale = Math.max(inputLevel, outputLevel) / 255
          const scaleMultiplier = 1.0 + audioScale * 1
          sphereRef.current.scale.setScalar(scaleMultiplier)

          // Update emissive intensity based on audio only
          sphereMaterial.emissiveIntensity = 0.1 + audioScale * 0.2

          // Update color based on audio activity only
          if (inputLevel > 10) {
            // Input audio detected - make sphere more red
            sphereMaterial.color.setHex(0xff4400)
          } else if (outputLevel > 10) {
            // Output audio detected - make sphere more blue
            sphereMaterial.color.setHex(0x0088ff)
          } else {
            // No audio - static orange color
            sphereMaterial.color.setHex(0xff8800)
          }
        }

        // Render scene
        if (composerRef.current) {
          composerRef.current.render()
        } else if (rendererRef.current && sceneRef.current && cameraRef.current) {
          // Fallback to direct rendering if composer fails
          rendererRef.current.render(sceneRef.current, cameraRef.current)
        }

        animationIdRef.current = requestAnimationFrame(animate)
      }

      animationIdRef.current = requestAnimationFrame(animate)
      console.log('[SphereVisual] Animation loop started')
    }

    const cleanup = () => {
      // Stop animation
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
        animationIdRef.current = null
      }

      // Clean up audio analysers
      if (inputAnalyserRef.current) {
        inputAnalyserRef.current.disconnect()
        inputAnalyserRef.current = null
      }
      if (outputAnalyserRef.current) {
        outputAnalyserRef.current.disconnect()
        outputAnalyserRef.current = null
      }

      // Clean up Three.js objects
      if (rendererRef.current) {
        rendererRef.current.dispose()
        rendererRef.current = null
      }
      if (composerRef.current) {
        composerRef.current.dispose()
        composerRef.current = null
      }
    }

    // Initialize on mount
    useEffect(() => {
      const cleanupFn = initThreeJS()
      
      return () => {
        cleanup()
        if (cleanupFn) cleanupFn()
      }
    }, [])

    // Update audio nodes when props change
    useEffect(() => {
      console.log('[SphereVisual] Audio nodes changed:', {
        hasInputNode: !!inputNode,
        hasOutputNode: !!outputNode,
        inputNodeType: inputNode?.constructor.name,
        outputNodeType: outputNode?.constructor.name,
        inputContext: inputNode?.context.state,
        outputContext: outputNode?.context.state
      })

      if (inputAnalyserRef.current) {
        inputAnalyserRef.current.disconnect()
        inputAnalyserRef.current = null
      }
      if (outputAnalyserRef.current) {
        outputAnalyserRef.current.disconnect()
        outputAnalyserRef.current = null
      }

      if (inputNode) {
        try {
        inputAnalyserRef.current = new AudioAnalyser(inputNode)
          console.log('[SphereVisual] Input analyser created successfully')
        } catch (error) {
          console.error('[SphereVisual] Failed to create input analyser:', error)
        }
      }
      if (outputNode) {
        try {
        outputAnalyserRef.current = new AudioAnalyser(outputNode)
          console.log('[SphereVisual] Output analyser created successfully')
        } catch (error) {
          console.error('[SphereVisual] Failed to create output analyser:', error)
        }
      }
    }, [inputNode, outputNode])

    return (
      <div 
        ref={containerRef}
        className={`relative w-full h-full bg-white ${className}`}
        style={{ 
          minHeight: '300px',
          minWidth: '400px',
          maxHeight: '300px',
          overflow: 'hidden'
        }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
          style={{ 
            display: 'block',
            background: 'white'
          }}
        />
      </div>
    )
  }
)

SphereVisual.displayName = "SphereVisual" 