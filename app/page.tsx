"use client"
import { useState, useEffect, useRef, Suspense } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Zap, Shield, Camera, Power } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import Link from 'next/link';

function CustomDrone() {
  const droneRef = useRef<THREE.Group>(null)
  const rotorsRef = useRef<THREE.Group[]>([])
  const [hovered, setHovered] = useState(false)

  useFrame((state, delta) => {
    if (!droneRef.current) return
    
    // Hover animation
    droneRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.15 * (hovered ? 1.2 : 1)
    droneRef.current.rotation.y += delta * (hovered ? 0.35 : 0.25)

    // Rotor spin - now using group rotation
    rotorsRef.current.forEach((rotorGroup) => {
      if (rotorGroup) {
        // Rotate the entire group
        rotorGroup.rotation.x += delta * (hovered ? 25 : 20)
      }
    })
  })

  return (
    <group
      ref={droneRef}
      position={[0, 1.5, 0]}
      scale={0.8}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 0.8, 1.5]} />
        <meshStandardMaterial color="#2a2a32" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Camera Assembly */}
      <mesh position={[0, -0.3, 0.7]}>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Lens */}
      <mesh position={[0, -0.3, 0.9]}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Rotors as Groups */}
      {[-1, 1].map((x, xi) =>
        [-1, 1].map((z, zi) => (
          <group
            key={`${x}-${z}`}
            ref={el => el && (rotorsRef.current[xi * 2 + zi] = el)}
            position={[x * 1.4, 0.2, z * 1.4]}
          >
            <mesh>
              <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
              <meshStandardMaterial color="#1a1a1f" metalness={0.4} roughness={0.5} />
            </mesh>
          </group>
        ))
      )}
    </group>
  )
}

export default function DronePage() {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { scrollYProgress } = useScroll()
  const translateY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    setMounted(true)
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    document.documentElement.classList.add("dark")
    return () => {
      window.removeEventListener('resize', handleResize)
      document.documentElement.classList.remove("dark")
    }
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white overflow-hidden">
      <motion.div
        className="fixed inset-0 z-0 opacity-20"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <Navbar />

      <section className="relative min-h-screen flex items-center">
        <div className="container mx-auto px-4 pt-20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6 z-10"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                The Future of
                <span className="block bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text mt-2">
                  Aerial Innovation
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300">
                Professional-grade drone technology with AI-powered stabilization
              </p>
              <div className="flex gap-4 flex-wrap">
  <Button className="bg-cyan-400 hover:bg-cyan-500 text-black">
    Explore Features
  </Button>
  <Link href="/chat" className="inline-flex items-center border border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 px-4 py-2 rounded-md">
    Ask-AI
  </Link>
</div>

            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative h-[400px] sm:h-[500px] md:h-[600px] w-full"
            >
              <Canvas
                camera={{
                  position: isMobile ? [3, 2, 4] : [5, 3, 5],
                  fov: isMobile ? 65 : 50,
                  near: 0.1,
                  far: 1000
                }}
              >
                <ambientLight intensity={1.5} />
                <pointLight position={[10, 10, 10]} intensity={800} />
                <spotLight
                  position={[-10, 10, 10]}
                  angle={0.15}
                  penumbra={1}
                  intensity={500}
                />
                
                <Suspense fallback={
                  <mesh>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="#2a2a32" />
                  </mesh>
                }>
                  <group scale={isMobile ? 1 : 1.5}>  {/* Scale up for desktop */}
                    <CustomDrone />
                  </group>
                </Suspense>

                <OrbitControls
                  enableZoom={false}
                  enablePan={!isMobile}
                  maxPolarAngle={Math.PI / 2}
                  minPolarAngle={Math.PI / 3.5}
                  minDistance={isMobile ? 3 : 4}
                  maxDistance={isMobile ? 6 : 10}  
                />
              </Canvas>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <motion.div style={{ y: translateY }} className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center mb-12"
          >
            Advanced Features
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Lightning Fast", desc: "Unmatched speed and agility" },
              { icon: Shield, title: "Ultra Secure", desc: "Advanced protection systems" },
              { icon: Camera, title: "8K Camera", desc: "Crystal clear footage" },
              { icon: Power, title: "Long Battery", desc: "4 hours flight time" },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <feature.icon className="h-12 w-12 text-cyan-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Specs Section */}
      <section id="specs" className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Technical Specifications</h2>
            <p className="text-gray-400">Pushing the boundaries of what's possible in aerial technology</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            {[
              { label: "Flight Time", value: "4 Hours" },
              { label: "Max Speed", value: "120 km/h" },
              { label: "Camera", value: "8K Ultra HD" },
              { label: "Range", value: "10 km" },
              { label: "Weight", value: "900g" },
              { label: "Motors", value: "4x Brushless" },
            ].map((spec, i) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-lg backdrop-blur-md bg-white/5 border border-white/10"
              >
                <div className="text-sm text-gray-400">{spec.label}</div>
                <div className="text-2xl font-bold text-cyan-400">{spec.value}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <motion.div style={{ opacity }} className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center p-8 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold mb-4"
            >
              Ready to Take Flight?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-400 mb-8"
            >
              Join the future of aerial technology today
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button className="bg-cyan-400 hover:bg-cyan-500 text-black">Pre-order Now</Button>
              <Button variant="outline" className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/10">
                Contact Sales
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>
       
      <section id="testimonials" className="py-20 relative">
  <div className="container mx-auto px-4">
    <motion.h2
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="text-4xl font-bold text-center mb-12"
    >
      What Our Users Say
    </motion.h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[
        {
          name: "Alex Johnson",
          role: "Professional Photographer",
          testimonial: "The drone's 8K camera is a game-changer. The footage is crystal clear, and the stabilization is unmatched.",
          avatar: "AJ",
        },
        {
          name: "Maria Gonzalez",
          role: "Videography Enthusiast",
          testimonial: "I've never flown a drone this smooth and responsive. It's perfect for capturing cinematic shots.",
          avatar: "MG",
        },
        {
          name: "Chris Lee",
          role: "Tech Reviewer",
          testimonial: "The battery life is incredible. I flew it for hours without needing a recharge. Highly recommend!",
          avatar: "CL",
        },
      ].map((testimonial, i) => (
        <motion.div
          key={testimonial.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-cyan-400 flex items-center justify-center text-black font-bold">
              {testimonial.avatar}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{testimonial.name}</h3>
              <p className="text-sm text-gray-400">{testimonial.role}</p>
            </div>
          </div>
          <p className="text-gray-300">{testimonial.testimonial}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>


<section id="gallery" className="py-20 relative">
  <div className="container mx-auto px-4">
    <motion.h2
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="text-4xl font-bold text-center mb-12"
    >
      Gallery
    </motion.h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((item) => (
        <motion.div
          key={item}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: item * 0.1 }}
          className="relative aspect-square overflow-hidden rounded-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>
          <img
            src={`/gallede/drone-${item}.jpg`} 
            alt={`Drone Shot ${item}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </motion.div>
      ))}
    </div>
  </div>
</section>


<section id="faq" className="py-20 relative">
  <div className="container mx-auto px-4">
    <motion.h2
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="text-4xl font-bold text-center mb-12"
    >
      Frequently Asked Questions
    </motion.h2>
    <div className="max-w-3xl mx-auto space-y-4">
      {[
        {
          question: "What is the maximum flight time?",
          answer: "The drone offers up to 4 hours of flight time on a single charge.",
        },
        {
          question: "Does it come with a warranty?",
          answer: "Yes, the drone comes with a 1-year limited warranty.",
        },
        {
          question: "Can I use it for professional photography?",
          answer: "Absolutely! The 8K camera and advanced stabilization make it perfect for professional use.",
        },
        {
          question: "Is it beginner-friendly?",
          answer: "Yes, the drone includes beginner-friendly features like auto-hover and obstacle avoidance.",
        },
      ].map((faq, i) => (
        <motion.div
          key={faq.question}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
        >
          <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
          <p className="text-gray-400">{faq.answer}</p>
        </motion.div>
      ))}
    </div>
  </div>
</section>

<footer className="py-12 border-t border-white/10">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h3 className="text-lg font-bold mb-4">DroneTech</h3>
        <p className="text-gray-400">
          Pushing the boundaries of aerial innovation with cutting-edge drone technology.
        </p>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
        <ul className="space-y-2">
          <li><a href="#features" className="text-gray-400 hover:text-cyan-400 transition-colors">Features</a></li>
          <li><a href="#specs" className="text-gray-400 hover:text-cyan-400 transition-colors">Specs</a></li>
          <li><a href="#testimonials" className="text-gray-400 hover:text-cyan-400 transition-colors">Testimonials</a></li>
          <li><a href="#faq" className="text-gray-400 hover:text-cyan-400 transition-colors">FAQ</a></li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-4">Follow Us</h3>
        <div className="flex gap-4">
          <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Twitter</a>
          <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">Instagram</a>
          <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">YouTube</a>
        </div>
      </div>
    </div>
    <div className="text-center text-sm text-gray-400 mt-8">
      © {new Date().getFullYear()} DroneTech. All rights reserved.
    </div>
  </div>
</footer>
    </div>
  )
}