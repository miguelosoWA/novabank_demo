"use client"

import { useRef, useEffect, useState } from "react"
import * as THREE from 'three'
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { AudioAnalyser } from './audio-analyser'
import { vs as sphereVS } from './sphere-shader'
import { fs as backdropFS, vs as backdropVS } from './backdrop-shader'

interface SphereVisualizationProps {
  inputNode?: AudioNode
  outputNode?: AudioNode
  isActive?: boolean
  className?: string
}

export const SphereVisualization: React.FC<SphereVisualizationProps> = ({
  inputNode,
  outputNode,
  isActive = true,
  className = ""
}) => {
  console.log('SphereVisualization render - props:', {
    hasInputNode: !!inputNode,
    hasOutputNode: !!outputNode,
    isActive,
    className
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    renderer?: THREE.WebGLRenderer
    scene?: THREE.Scene
    camera?: THREE.PerspectiveCamera
    sphere?: THREE.Mesh
    backdrop?: THREE.Mesh
    composer?: EffectComposer
    inputAnalyser?: AudioAnalyser
    outputAnalyser?: AudioAnalyser
    rotation?: THREE.Vector3
    animationId?: number
    isInitialized?: boolean
  }>({})
  
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize Three.js scene
  const initializeScene = () => {
    console.log('initializeScene called')
    
    if (!containerRef.current) {
      console.warn('No container ref available')
      return
    }
    
    if (sceneRef.current.isInitialized) {
      console.log('Scene already initialized')
      return
    }

    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    
    console.log('Container dimensions:', rect)
    
    // Ensure container has dimensions
    if (rect.width === 0 || rect.height === 0) {
      console.log('Container has no dimensions, retrying...')
      // Retry initialization after a short delay
      setTimeout(initializeScene, 100)
      return
    }
    
    console.log('Starting scene initialization with dimensions:', rect.width, 'x', rect.height)
    
    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x222222) // Darker background to see the sphere better
    console.log('Scene created with background')

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      rect.width / rect.height,
      0.1,
      1000
    )
    camera.position.set(0, 0, 5) // Simplified camera position
    camera.lookAt(0, 0, 0) // Look at the center where sphere is
    console.log('Camera positioned at:', camera.position)

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(rect.width, rect.height)
    renderer.setPixelRatio(window.devicePixelRatio)
    
    // Style the canvas to fill the container
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.top = '0'
    renderer.domElement.style.left = '0'
    
    container.appendChild(renderer.domElement)

    // Backdrop setup
    const backdrop = new THREE.Mesh(
      new THREE.IcosahedronGeometry(10, 5),
      new THREE.RawShaderMaterial({
        uniforms: {
          resolution: { value: new THREE.Vector2(rect.width, rect.height) },
          rand: { value: 0 },
        },
        vertexShader: backdropVS,
        fragmentShader: backdropFS,
        glslVersion: THREE.GLSL3,
      })
    )
    backdrop.material.side = THREE.BackSide
    scene.add(backdrop)

    // Add lighting for the sphere
    const ambientLight = new THREE.AmbientLight(0xffffff, 1)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(0, 0, 5)
    scene.add(directionalLight)

    // Sphere setup
    const geometry = new THREE.IcosahedronGeometry(1, 5) // Reduced subdivision for debugging
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0xff8800,
      metalness: 0.9,
      roughness: 0.9,
      emissive: 0xff8800,
      emissiveIntensity: 10,
    });

    console.log('Sphere material created:', sphereMaterial)

    // Custom shader for sphere deformation
    sphereMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.time = { value: 0 }
      shader.uniforms.inputData = { value: new THREE.Vector4() }
      shader.uniforms.outputData = { value: new THREE.Vector4() }

      sphereMaterial.userData.shader = shader
      shader.vertexShader = sphereVS
      console.log('Sphere shader compiled')
    }

    const sphere = new THREE.Mesh(geometry, sphereMaterial)
    scene.add(sphere)
    
    // Make sphere visible immediately for debugging
    sphere.visible = true
    console.log('Sphere created and made visible')

    // Load EXR texture for reflections (optional)
    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    pmremGenerator.compileEquirectangularShader()
    
    // Load texture asynchronously but don't depend on it for visibility
    new EXRLoader().load('/piz_compressed.exr', (texture: THREE.Texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      const exrCubeRenderTarget = pmremGenerator.fromEquirectangular(texture)
      sphereMaterial.envMap = exrCubeRenderTarget.texture
      console.log('EXR texture loaded and applied to sphere')
    }, undefined, (error) => {
      console.warn('Could not load EXR texture, sphere will work without it:', error)
    })

    // Set up post-processing
    const renderPass = new RenderPass(scene, camera)
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(rect.width, rect.height),
      1.5, // strength
      0.5, // radius  
      0    // threshold
    )
    
    const composer = new EffectComposer(renderer)
    composer.addPass(renderPass)
    composer.addPass(bloomPass)

    // Store references
    sceneRef.current = {
      renderer,
      scene,
      camera,
      sphere,
      backdrop,
      composer,
      rotation: new THREE.Vector3(0, 0, 0),
      isInitialized: true
    }

    console.log('Scene setup complete, all components stored:', {
      renderer: !!renderer,
      scene: !!scene,
      camera: !!camera,
      sphere: !!sphere,
      backdrop: !!backdrop,
      composer: !!composer
    })

    setIsInitialized(true)
    console.log('SphereVisualization initialized')

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return
      
      const newRect = containerRef.current.getBoundingClientRect()
      camera.aspect = newRect.width / newRect.height
      camera.updateProjectionMatrix()
      renderer.setSize(newRect.width, newRect.height)
      composer.setSize(newRect.width, newRect.height)
      
      const backdropMaterial = backdrop.material as THREE.RawShaderMaterial
      backdropMaterial.uniforms.resolution.value.set(newRect.width * renderer.getPixelRatio(), newRect.height * renderer.getPixelRatio())
    }

    window.addEventListener('resize', handleResize)
    
    // Return cleanup function
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }

  // Setup audio analysers
  useEffect(() => {
    if (!isInitialized) return

    try {
      if (inputNode && !sceneRef.current.inputAnalyser) {
        sceneRef.current.inputAnalyser = new AudioAnalyser(inputNode)
      }
      if (outputNode && !sceneRef.current.outputAnalyser) {
        sceneRef.current.outputAnalyser = new AudioAnalyser(outputNode)
      }
    } catch (error) {
      console.warn('Could not setup audio analysers:', error)
    }
  }, [inputNode, outputNode, isInitialized])

  // Animation loop
  useEffect(() => {
    // Temporarily always start animation for debugging
    if (!isInitialized) {
      console.log('Animation loop not starting - isInitialized:', isInitialized)
      return
    }
    
    console.log('Animation loop starting regardless of isActive for debugging - isActive:', isActive, 'isInitialized:', isInitialized)

    console.log('Starting animation loop')
    let prevTime = 0
    let frameCount = 0
    
    const animate = () => {
      const {
        renderer,
        scene,
        camera,
        sphere,
        backdrop,
        composer,
        inputAnalyser,
        outputAnalyser,
        rotation
      } = sceneRef.current

      if (!renderer || !scene || !camera || !sphere || !backdrop || !composer || !rotation) {
        console.warn('Missing components for animation:', {
          renderer: !!renderer,
          scene: !!scene,
          camera: !!camera,
          sphere: !!sphere,
          backdrop: !!backdrop,
          composer: !!composer,
          rotation: !!rotation
        })
        return
      }

      frameCount++
      if (frameCount % 60 === 0) { // Log every 60 frames
        console.log('Animation running, frame:', frameCount)
      }

      const t = performance.now()
      const dt = (t - prevTime) / (1000 / 60)
      prevTime = t

      // Update audio analysers
      try {
        inputAnalyser?.update()
        outputAnalyser?.update()
      } catch (error) {
        // Silently handle analyser errors
      }

      // Update backdrop
      const backdropMaterial = backdrop.material as THREE.RawShaderMaterial
      backdropMaterial.uniforms.rand.value = Math.random() * 10000

      // Update sphere if we have audio data
      const sphereMaterial = sphere.material as THREE.MeshStandardMaterial
      if (sphereMaterial.userData.shader) {
        const inputData = inputAnalyser?.data || new Uint8Array(16)
        const outputData = outputAnalyser?.data || new Uint8Array(16)

        // Scale sphere based on audio
        const scale = 1 + (0.2 * outputData[1]) / 255
        sphere.scale.setScalar(scale)

        // Rotate based on audio
        const f = 0.001
        rotation.x += (dt * f * 0.5 * outputData[1]) / 255
        rotation.z += (dt * f * 0.5 * inputData[1]) / 255
        rotation.y += (dt * f * 0.25 * inputData[2]) / 255
        rotation.y += (dt * f * 0.25 * outputData[2]) / 255

        // Update camera position
        const euler = new THREE.Euler(rotation.x, rotation.y, rotation.z)
        const quaternion = new THREE.Quaternion().setFromEuler(euler)
        const vector = new THREE.Vector3(0, 0, 5)
        vector.applyQuaternion(quaternion)
        camera.position.copy(vector)
        camera.lookAt(sphere.position)

        // Update shader uniforms
        sphereMaterial.userData.shader.uniforms.time.value += (dt * 0.1 * outputData[0]) / 255
        sphereMaterial.userData.shader.uniforms.inputData.value.set(
          (1 * inputData[0]) / 255,
          (0.1 * inputData[1]) / 255,
          (10 * inputData[2]) / 255,
          0
        )
        sphereMaterial.userData.shader.uniforms.outputData.value.set(
          (2 * outputData[0]) / 255,
          (0.1 * outputData[1]) / 255,
          (10 * outputData[2]) / 255,
          0
        )
      }

      composer.render()
      sceneRef.current.animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (sceneRef.current.animationId) {
        cancelAnimationFrame(sceneRef.current.animationId)
      }
    }
  }, [isInitialized]) // Temporarily removed isActive dependency for debugging

  // Initialize scene on mount
  useEffect(() => {
    const cleanup = initializeScene()
    
    return () => {
      // Cleanup Three.js resources
      const { renderer, composer, inputAnalyser, outputAnalyser, animationId } = sceneRef.current
      
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      
      if (inputAnalyser) {
        inputAnalyser.disconnect()
      }
      
      if (outputAnalyser) {
        outputAnalyser.disconnect()
      }
      
      if (composer) {
        composer.dispose()
      }
      
      if (renderer) {
        renderer.dispose()
        if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(renderer.domElement)
        }
      }
      
      cleanup?.()
      sceneRef.current = {}
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full ${className}`}
      style={{ 
        minHeight: '400px',
        position: 'relative',
        overflow: 'hidden'
      }}
    />
  )
} 