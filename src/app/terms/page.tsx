'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import WalletButton from '@/components/WalletButton'
import Footer from '@/components/Footer'

export default function TermsPage() {
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
                Terms of Service
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
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
                <p className="text-gray-600 leading-relaxed">
                  By accessing and using Confidee, you accept and agree to be bound by these Terms of Service.
                  If you do not agree to these terms, please do not use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
                <p className="text-gray-600 leading-relaxed">
                  Confidee is a decentralized, blockchain-based platform that allows users to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 leading-relaxed mt-3">
                  <li>Share thoughts and feelings anonymously</li>
                  <li>Receive AI-powered emotional support responses</li>
                  <li>Interact with other users&apos; posts through likes and comments</li>
                  <li>Send cryptocurrency tips to support others</li>
                  <li>Earn rewards through platform fees when receiving tips</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Eligibility</h2>
                <p className="text-gray-600 leading-relaxed">
                  You must be at least 13 years old to use Confidee. By using this platform, you represent and warrant
                  that you meet this age requirement and have the legal capacity to enter into these Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. User Responsibilities</h2>
                <div className="space-y-3 text-gray-600 leading-relaxed">
                  <p className="font-semibold text-gray-900">You agree to:</p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Use the platform in a respectful and lawful manner</li>
                    <li>Not post content that is harmful, threatening, abusive, or violates others&apos; rights</li>
                    <li>Not spam, harass, or engage in any form of harmful behavior</li>
                    <li>Secure your wallet and private keys (we cannot recover lost wallets)</li>
                    <li>Comply with all applicable laws and regulations</li>
                    <li>Respect daily usage limits (10 posts, 50 likes/unlikes, 25 comments per day)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Prohibited Content</h2>
                <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-r-lg mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    <strong className="text-red-900">Strictly Prohibited:</strong> The following content is not allowed
                    and may result in content being flagged or your access being restricted.
                  </p>
                </div>
                <ul className="list-disc list-inside space-y-2 text-gray-600 leading-relaxed">
                  <li>Illegal activities or content</li>
                  <li>Hate speech, discrimination, or harassment</li>
                  <li>Explicit sexual content or pornography</li>
                  <li>Violence, threats, or self-harm content</li>
                  <li>Spam, scams, or fraudulent schemes</li>
                  <li>Impersonation or misleading information</li>
                  <li>Content that violates intellectual property rights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Blockchain & Cryptocurrency</h2>
                <div className="space-y-3 text-gray-600 leading-relaxed">
                  <p>
                    Confidee operates on the Base Sepolia testnet blockchain. You acknowledge and agree that:
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>All transactions are irreversible once confirmed on the blockchain</li>
                    <li>You are responsible for all gas fees and transaction costs</li>
                    <li>Blockchain data is public and permanent</li>
                    <li>We provide gasless transactions as a convenience, but this service may be discontinued</li>
                    <li>Cryptocurrency values are volatile and you bear all financial risks</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Platform Fees</h2>
                <p className="text-gray-600 leading-relaxed">
                  Confidee charges a 2.5% platform fee on all tips sent through the platform. When you send a tip,
                  97.5% goes to the recipient and 2.5% goes to the platform. By using the tipping feature, you
                  acknowledge and accept this fee structure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. AI-Generated Content</h2>
                <p className="text-gray-600 leading-relaxed">
                  AI responses are generated using Google&apos;s Gemini AI and are intended to provide supportive,
                  empathetic responses. However, AI responses:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 leading-relaxed mt-3">
                  <li>Are not a substitute for professional mental health services</li>
                  <li>Should not be relied upon for medical or legal advice</li>
                  <li>May not always be accurate or appropriate</li>
                  <li>Are provided &quot;as is&quot; without warranties</li>
                </ul>
                <div className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-r-lg mt-4">
                  <p className="text-gray-700 leading-relaxed">
                    <strong className="text-yellow-900">Important:</strong> If you are experiencing a mental health crisis,
                    please contact professional mental health services or emergency services in your area.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disclaimer of Warranties</h2>
                <p className="text-gray-600 leading-relaxed">
                  Confidee is provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; without warranties of any kind.
                  We do not guarantee that the platform will be error-free, secure, or continuously available.
                  Use of the platform is at your own risk.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Limitation of Liability</h2>
                <p className="text-gray-600 leading-relaxed">
                  To the maximum extent permitted by law, Confidee and its operators shall not be liable for any
                  indirect, incidental, special, consequential, or punitive damages, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 leading-relaxed mt-3">
                  <li>Loss of cryptocurrency or funds</li>
                  <li>Loss of data or content</li>
                  <li>Unauthorized access to your wallet</li>
                  <li>Platform downtime or service interruptions</li>
                  <li>Any damages arising from user-generated content</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Indemnification</h2>
                <p className="text-gray-600 leading-relaxed">
                  You agree to indemnify and hold harmless Confidee, its operators, and affiliates from any claims,
                  damages, or expenses arising from your use of the platform, violation of these Terms, or violation
                  of any rights of another party.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Content Ownership</h2>
                <p className="text-gray-600 leading-relaxed">
                  You retain ownership of content you post on Confidee. However, by posting content, you grant
                  Confidee a worldwide, non-exclusive, royalty-free license to store and display your content
                  on the blockchain and through the platform interface.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Modifications to Service</h2>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to modify, suspend, or discontinue any part of Confidee at any time without
                  notice. We may also update these Terms from time to time. Continued use of the platform after
                  changes constitutes acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Termination</h2>
                <p className="text-gray-600 leading-relaxed">
                  We reserve the right to restrict or terminate your access to Confidee if you violate these Terms
                  or engage in harmful behavior. You may stop using the platform at any time by disconnecting
                  your wallet.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Governing Law</h2>
                <p className="text-gray-600 leading-relaxed">
                  These Terms shall be governed by and construed in accordance with applicable laws. Any disputes
                  arising from these Terms or use of Confidee shall be resolved through binding arbitration.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Contact Information</h2>
                <p className="text-gray-600 leading-relaxed">
                  For questions about these Terms of Service, please reach out through our community channels
                  or create an issue on our GitHub repository.
                </p>
              </section>

              <section className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500 italic">
                  By using Confidee, you acknowledge that you have read, understood, and agree to be bound by
                  these Terms of Service and our Privacy Policy.
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
