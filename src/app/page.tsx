'use client'

import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import WalletButton from '@/components/WalletButton'
import Footer from '@/components/Footer'
import { COMPONENTS, ANIMATIONS, getPrimaryButtonClass, getCardClass } from '@/constants/design'

export default function HomePage() {
  const { address } = useAccount()
  const router = useRouter()
  const { openConnectModal } = useConnectModal()
  const heroRef = useRef<HTMLDivElement>(null)
  const [isHoveringButton, setIsHoveringButton] = useState(false)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const blur = useTransform(scrollYProgress, [0, 0.8], [0, 10])
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.92])

  const handleMainButtonClick = () => {
    if (address) {
      router.push('/dashboard')
    } else if (openConnectModal) {
      openConnectModal()
    }
  }

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardRef: React.RefObject<HTMLDivElement | null>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2

    const rotateX = (y / rect.height) * 10
    const rotateY = (x / rect.width) * 10

    cardRef.current.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`
  }

  const handleCardMouseLeave = (cardRef: React.RefObject<HTMLDivElement | null>) => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)'
  }

  const card1Ref = useRef<HTMLDivElement>(null)
  const card2Ref = useRef<HTMLDivElement>(null)
  const card3Ref = useRef<HTMLDivElement>(null)

  const chatRef = useRef<HTMLDivElement>(null)
  const isChatInView = useInView(chatRef, { once: true, margin: "-100px" })
  const [typedText, setTypedText] = useState("")
  const [typedAIResponse, setTypedAIResponse] = useState("")

  const stickyTextRef = useRef<HTMLDivElement>(null)

  const stickyContainerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: stickyScrollProgress } = useScroll({
    target: stickyContainerRef,
    offset: ["start start", "end end"]
  })

  const textOpacity = useTransform(stickyScrollProgress, [0.1, 0.5], [0, 1])
  const textY = useTransform(stickyScrollProgress, [0.1, 0.5], [100, 0])

  const userMessage = "Just got liquidated on my ETH long position because of that surprise Fed announcement. Lost 3 months of DCA savings in 10 minutes... Why did I use 100x leverage? Feeling so stupid right now 😭"
  const aiMessage = "Ouch, that stings anon. Fed announcements are brutal for leveraged positions. Take a breather, then maybe stick to spot trading for a while? If you're gonna use leverage again, 2-3x max with proper stop losses. The market will always be here tomorrow 🫂"

  useEffect(() => {
    if (!isChatInView) return

    let userIndex = 0
    const userInterval = setInterval(() => {
      if (userIndex <= userMessage.length) {
        setTypedText(userMessage.slice(0, userIndex))
        userIndex++
      } else {
        clearInterval(userInterval)

        // Start AI response after user message complete
        setTimeout(() => {
          let aiIndex = 0
          const aiInterval = setInterval(() => {
            if (aiIndex <= aiMessage.length) {
              setTypedAIResponse(aiMessage.slice(0, aiIndex))
              aiIndex++
            } else {
              clearInterval(aiInterval)
            }
          }, 20)
        }, 500)
      }
    }, 30)

    return () => clearInterval(userInterval)
  }, [isChatInView])

  return (
    <main className="min-h-screen bg-white">
      <div className="fixed inset-0 bg-gradient-to-r from-blue-200/30 via-white to-blue-200/30"></div>

      <div className="relative">
        <nav className={COMPONENTS.nav.base}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                Confidee
              </div>
              <WalletButton />
            </div>
          </div>
        </nav>

        <section ref={heroRef} className="min-h-screen flex items-center justify-center px-4 sm:px-6">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              opacity: opacity,
              filter: useTransform(blur, (value) => `blur(${value}px)`),
              scale: scale
            }}
          >
            <motion.div
              className={`inline-block ${COMPONENTS.badge.purple}`}
              initial={ANIMATIONS.scaleIn.initial}
              animate={ANIMATIONS.scaleIn.animate}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Your safe space. Your voice. Your value.
            </motion.div>

            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              The world&apos;s first anonymous
              <span className="text-blue-600"> Web3 safe space</span> where your feelings matter
            </motion.h1>

            <motion.p
              className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Share your thoughts without fear, receive AI-powered emotional support, and earn rewards for helping others. Your care has real value.
            </motion.p>

            <motion.button
              onClick={handleMainButtonClick}
              className={`${getPrimaryButtonClass('md')} cursor-pointer relative overflow-hidden group`}
              initial={ANIMATIONS.fadeIn.initial}
              animate={ANIMATIONS.fadeIn.animate}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setIsHoveringButton(true)}
              onHoverEnd={() => setIsHoveringButton(false)}
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <motion.span
                className="absolute inset-0 bg-blue-600"
                animate={isHoveringButton ? {
                  boxShadow: [
                    '0 0 20px rgba(59, 130, 246, 0.5)',
                    '0 0 40px rgba(59, 130, 246, 0.8)',
                    '0 0 20px rgba(59, 130, 246, 0.5)',
                  ]
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="relative z-10">
                {address ? 'Go to Dashboard' : 'Connect Wallet to Start'}
              </span>
            </motion.button>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-500 max-w-md sm:max-w-none mx-auto mt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Complete anonymity</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>AI emotional support</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span>Helping others literally pays</span>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Sticky container - cards stuck at top, text reveals below */}
        <div ref={stickyContainerRef} className="relative h-[140vh]">
          <div className="sticky top-[8vh]">
            <section className="py-12 sm:py-20 px-4 sm:px-6">
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                  <motion.div
                    ref={card1Ref}
                    className={`${getCardClass('blue')} p-6 sm:p-8 relative overflow-visible group cursor-pointer`}
                    initial={{ opacity: 0, y: 60, scale: 0.85 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.9,
                      delay: 0.2,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.15s ease-out'
                    }}
                    onMouseMove={(e) => handleCardMouseMove(e, card1Ref)}
                    onMouseLeave={() => handleCardMouseLeave(card1Ref)}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-2xl"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: [0, 1, 0] }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, delay: 0.2 }}
                    />
                    <motion.div
                      className={`${COMPONENTS.card.blue.icon} w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 sm:mb-6 relative z-10`}
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.8,
                        delay: 0.5,
                        type: "spring",
                        stiffness: 150,
                        damping: 12
                      }}
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </motion.div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 relative z-10">Complete Anonymity</h3>
                    <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                      Only your wallet address is visible. Share your deepest thoughts without fear of judgment or exposure.
                    </p>
                    <motion.div
                      className="absolute inset-0 border-2 border-blue-400/0 group-hover:border-blue-400/50 rounded-2xl transition-colors duration-300"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />
                  </motion.div>

                  <motion.div
                    ref={card2Ref}
                    className={`${getCardClass('purple')} p-6 sm:p-8 relative overflow-visible group cursor-pointer`}
                    initial={{ opacity: 0, y: 60, scale: 0.85 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.9,
                      delay: 0.4,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.15s ease-out'
                    }}
                    onMouseMove={(e) => handleCardMouseMove(e, card2Ref)}
                    onMouseLeave={() => handleCardMouseLeave(card2Ref)}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-purple-600/20 rounded-2xl"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: [0, 1, 0] }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, delay: 0.4 }}
                    />
                    <motion.div
                      className={`${COMPONENTS.card.purple.icon} w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 sm:mb-6 relative z-10`}
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.8,
                        delay: 0.7,
                        type: "spring",
                        stiffness: 150,
                        damping: 12
                      }}
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </motion.div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 relative z-10">AI Emotional Support</h3>
                    <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                      Replies adapt to your tone: serious, casual, or even playful. Get support that actually understands you.
                    </p>
                    <motion.div
                      className="absolute inset-0 border-2 border-purple-400/0 group-hover:border-purple-400/50 rounded-2xl transition-colors duration-300"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />
                  </motion.div>

                  <motion.div
                    ref={card3Ref}
                    className={`${getCardClass('green')} p-6 sm:p-8 sm:col-span-2 md:col-span-1 relative overflow-visible group cursor-pointer`}
                    initial={{ opacity: 0, y: 60, scale: 0.85 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.9,
                      delay: 0.6,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.15s ease-out'
                    }}
                    onMouseMove={(e) => handleCardMouseMove(e, card3Ref)}
                    onMouseLeave={() => handleCardMouseLeave(card3Ref)}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-2xl"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: [0, 1, 0] }}
                      viewport={{ once: true }}
                      transition={{ duration: 2, delay: 0.6 }}
                    />
                    <motion.div
                      className={`${COMPONENTS.card.green.icon} w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 sm:mb-6 relative z-10`}
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.8,
                        delay: 0.9,
                        type: "spring",
                        stiffness: 150,
                        damping: 12
                      }}
                    >
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </motion.div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 relative z-10">Global Tokenized Community</h3>
                    <p className="text-gray-600 text-sm leading-relaxed relative z-10">
                      Join channels by topic or country, connect with the world, and earn ETH for supporting others in meaningful ways.
                    </p>
                    <motion.div
                      className="absolute inset-0 border-2 border-green-400/0 group-hover:border-green-400/50 rounded-2xl transition-colors duration-300"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Text reveals below stuck cards */}
            <div ref={stickyTextRef} className="px-4 sm:px-6 mt-20">
              <div className="max-w-4xl mx-auto text-center">
                <motion.h2
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 px-2 sm:px-0"
                  style={{
                    opacity: textOpacity,
                    y: textY
                  }}
                >
                  Where real support meets real value
                </motion.h2>
                <motion.p
                  className="text-base sm:text-lg text-gray-600 mb-10 sm:mb-16 max-w-2xl mx-auto px-2 sm:px-0"
                  style={{
                    opacity: textOpacity,
                    y: textY
                  }}
                >
                  Channels by topic and country for meaningful connections. Your emotional wellbeing, powered by Web3.
                </motion.p>
              </div>
            </div>
          </div>
        </div>

        <section className="py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">

            <div
              ref={chatRef}
              className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-8 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 text-left max-w-2xl mx-auto">
                <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 self-start">
                  <span className="text-sm font-medium text-gray-600">AU</span>
                </div>
                <div className="flex-1 w-full">
                  <div className="text-xs sm:text-sm text-gray-500 mb-2">
                    Anonymous User • 5 minutes ago
                  </div>
                  <div className="text-sm sm:text-base text-gray-900 mb-4">
                    {typedText}
                    {typedText.length < userMessage.length && (
                      <span className="inline-block w-0.5 h-4 bg-gray-900 ml-0.5" />
                    )}
                  </div>
                  {typedText.length === userMessage.length && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4 rounded-r-lg">
                      <div className="text-xs sm:text-sm font-medium text-blue-900 mb-1">AI Response</div>
                      <div className="text-blue-800 text-xs sm:text-sm">
                        {typedAIResponse}
                        {typedAIResponse.length < aiMessage.length && (
                          <span className="inline-block w-0.5 h-3 bg-blue-800 ml-0.5" />
                        )}
                      </div>
                    </div>
                  )}
                  {typedAIResponse.length === aiMessage.length && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">
                      <span className={COMPONENTS.badge.blue}>0.05 ETH received</span>
                      <span>12 supportive replies</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-20 px-4 sm:px-6 mt-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-6 sm:p-12 shadow-sm border border-gray-200">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2 sm:px-0">
                Ready to join the world&apos;s first tokenized emotional support network?
              </h2>
              <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg px-2 sm:px-0">
                Connect your wallet and start sharing anonymously on Base network. Your feelings matter, and your care has real value.
              </p>
              <button
                onClick={handleMainButtonClick}
                className={`${getPrimaryButtonClass('md')} cursor-pointer`}
              >
                {address ? 'Enter your safe space' : 'Connect Wallet to Start'}
              </button>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500">
                <span>Free to join</span>
                <span className="hidden sm:inline">•</span>
                <span>No personal data required</span>
                <span className="hidden sm:inline">•</span>
                <span>Powered by Base network</span>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </main>
  );
}