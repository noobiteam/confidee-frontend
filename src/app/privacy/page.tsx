'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import WalletButton from '@/components/WalletButton'
import Footer from '@/components/Footer'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="fixed inset-0 bg-gradient-to-r from-blue-200/30 via-white to-blue-200/30"></div>

      <div className="relative">
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl sm:text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                Confidee
              </Link>
              <WalletButton />
            </div>
          </div>
        </nav>

        <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Privacy Policy
              </h1>
              <p className="text-sm text-gray-500">Last updated: November 2025</p>
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 md:p-10 space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-600 leading-relaxed">
                  Welcome to Confidee. We are committed to protecting your privacy and ensuring your anonymity.
                  This Privacy Policy explains how we handle information in our decentralized, blockchain-based platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Blockchain Data</h3>
                    <p>
                      Your posts, comments, and interactions are stored on the Base blockchain. This data is pseudonymous
                      and linked to your wallet address, not your personal identity.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Wallet Address</h3>
                    <p>
                      We collect your wallet address when you connect to Confidee. This is necessary for blockchain interactions
                      but does not reveal your personal identity.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Session Data</h3>
                    <p>
                      Temporary session tokens are stored locally in your browser to enable gasless transactions.
                      These expire after 24 hours and are not stored on our servers permanently.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-600 leading-relaxed">
                  <li>To provide gasless transaction services through our relayer</li>
                  <li>To generate AI-powered emotional support responses using Gemini AI</li>
                  <li>To enforce daily usage limits and prevent abuse</li>
                  <li>To improve our platform and user experience</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Anonymity & Privacy</h2>
                <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                  <p className="text-gray-700 leading-relaxed">
                    <strong className="text-blue-900">Complete Anonymity:</strong> We do not collect, store, or require
                    any personal information such as names, emails, or phone numbers. Your identity remains completely
                    anonymous on our platform.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. AI Processing</h2>
                <p className="text-gray-600 leading-relaxed">
                  When you create a post, the content is sent to Google&apos;s Gemini AI to generate supportive responses.
                  This processing is done securely and your content is not used to train AI models or shared with third parties
                  beyond Google&apos;s API service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Blockchain Transparency</h2>
                <p className="text-gray-600 leading-relaxed">
                  All posts, comments, and interactions are stored on the Base blockchain, which is public and immutable.
                  While your wallet address is visible on-chain, it does not reveal your personal identity unless you
                  choose to link it publicly.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Security</h2>
                <p className="text-gray-600 leading-relaxed">
                  We implement industry-standard security measures including encrypted connections (HTTPS), secure session
                  management, and rate limiting to protect against abuse. However, as with all blockchain applications,
                  you are responsible for securing your wallet and private keys.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Your Rights</h2>
                <p className="text-gray-600 leading-relaxed mb-3">You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 leading-relaxed">
                  <li>Access your on-chain data through blockchain explorers</li>
                  <li>Disconnect your wallet and stop using the service at any time</li>
                  <li>Delete your session data by clearing your browser storage</li>
                </ul>
                <p className="text-gray-600 leading-relaxed mt-3">
                  <strong>Note:</strong> Due to blockchain immutability, on-chain data (posts, comments) cannot be deleted
                  once published.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Third-Party Services</h2>
                <p className="text-gray-600 leading-relaxed mb-3">We use the following third-party services:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 leading-relaxed">
                  <li><strong>Base Sepolia Blockchain:</strong> For storing posts and interactions</li>
                  <li><strong>Google Gemini AI:</strong> For generating supportive AI responses</li>
                  <li><strong>RainbowKit/WalletConnect:</strong> For wallet connection services</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
                <p className="text-gray-600 leading-relaxed">
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page with
                  an updated &quot;Last updated&quot; date. We encourage you to review this policy periodically.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact</h2>
                <p className="text-gray-600 leading-relaxed">
                  If you have any questions about this Privacy Policy, please reach out through our community channels
                  or create an issue on our GitHub repository.
                </p>
              </section>
            </motion.div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
