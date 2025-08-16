'use client'

import Footer from '@/components/Footer'
import Link from 'next/link'

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-white">
            <div className="fixed inset-0 bg-gradient-to-r from-blue-200/30 via-white to-blue-200/30"></div>
            <div className="relative">
                <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/" className="text-xl sm:text-2xl font-bold text-gray-900">
                                Confidee
                            </Link>
                            <Link
                                href="/"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-colors"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </nav>

                <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                Privacy Policy
                            </h1>
                            <p className="text-gray-600">
                                Last updated: August 16, 2025
                            </p>
                        </div>

                        <div className="prose prose-lg max-w-none">
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Our Commitment to Privacy</h2>
                                <p className="text-gray-700 mb-6">
                                    Confidee is built with privacy at its core. This policy explains how we protect your privacy and what limited data we interact with to provide our anonymous emotional support platform.
                                </p>

                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">1. Information We Collect</h2>

                                <h3 className="text-xl font-medium text-gray-900 mb-4">Minimal Data Collection</h3>
                                <p className="text-gray-700 mb-4">
                                    Confidee collects only the minimum information necessary to function:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 mb-6">
                                    <li><strong>Wallet Address:</strong> Your Solana wallet public address for platform access</li>
                                    <li><strong>Username:</strong> Your chosen display name, stored locally on your device</li>
                                    <li><strong>Post Content:</strong> Text content you choose to share on the platform</li>
                                </ul>

                                <h3 className="text-xl font-medium text-gray-900 mb-4">What We Do NOT Collect</h3>
                                <ul className="list-disc pl-6 text-gray-700 mb-6">
                                    <li>Personal identifying information (name, email, phone, address)</li>
                                    <li>Browsing history or tracking cookies</li>
                                    <li>Device fingerprinting or analytics data</li>
                                    <li>IP addresses or location data</li>
                                    <li>Private keys or wallet credentials</li>
                                    <li>Social media profiles or external account connections</li>
                                </ul>

                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">2. How We Store Your Data</h2>

                                <h3 className="text-xl font-medium text-gray-900 mb-4">Local Storage</h3>
                                <p className="text-gray-700 mb-4">
                                    Your username and preferences are stored locally in your browser using localStorage. This means:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 mb-6">
                                    <li>Data stays on your device, not on our servers</li>
                                    <li>You control this data and can clear it anytime</li>
                                    <li>We cannot access this information remotely</li>
                                </ul>

                                <h3 className="text-xl font-medium text-gray-900 mb-4">Blockchain Data</h3>
                                <p className="text-gray-700 mb-6">
                                    Post content and interactions are stored on the Solana blockchain, which is public and immutable. Your wallet address is visible on-chain, but this is standard for all blockchain applications.
                                </p>

                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">3. AI Processing</h2>
                                <p className="text-gray-700 mb-4">
                                    When you create a post, our AI system processes your content to generate supportive responses:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 mb-6">
                                    <li>AI responses are generated based on content context, not personal data</li>
                                    <li>No personal profiling or behavioral tracking occurs</li>
                                    <li>AI processing is focused solely on providing emotional support</li>
                                </ul>

                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">4. Third-Party Services</h2>

                                <h3 className="text-xl font-medium text-gray-900 mb-4">Wallet Providers</h3>
                                <p className="text-gray-700 mb-4">
                                    When you connect your wallet (Phantom, Solflare, etc.), you interact directly with these services. Their privacy policies apply to that interaction.
                                </p>

                                <h3 className="text-xl font-medium text-gray-900 mb-4">Solana Network</h3>
                                <p className="text-gray-700 mb-6">
                                    Transactions and interactions occur on the public Solana blockchain. This network operates independently of Confidee and has its own transparency characteristics.
                                </p>

                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">5. Data Sharing</h2>
                                <p className="text-gray-700 mb-4">
                                    We do not sell, rent, or share your data with third parties. The only &quot;sharing&quot; that occurs is:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 mb-6">
                                    <li>Content you voluntarily post becomes visible to other platform users</li>
                                    <li>Blockchain transactions are publicly visible (standard for Web3)</li>
                                    <li>No advertising networks, analytics companies, or data brokers have access to your information</li>
                                </ul>

                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">6. Your Privacy Rights</h2>
                                <p className="text-gray-700 mb-4">
                                    You maintain full control over your privacy:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 mb-6">
                                    <li><strong>Access:</strong> You can view all data associated with your wallet address</li>
                                    <li><strong>Modify:</strong> Change your username anytime through platform settings</li>
                                    <li><strong>Delete:</strong> Clear local data by disconnecting your wallet or clearing browser storage</li>
                                    <li><strong>Portability:</strong> Your content exists on the blockchain and is not locked to our platform</li>
                                </ul>

                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">7. Security Measures</h2>
                                <p className="text-gray-700 mb-4">
                                    We protect your privacy through:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 mb-6">
                                    <li>Minimal data collection reduces exposure risk</li>
                                    <li>Local storage keeps sensitive data on your device</li>
                                    <li>No central database of personal information</li>
                                    <li>Secure blockchain infrastructure for content storage</li>
                                </ul>

                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">8. Children&quot;s Privacy</h2>
                                <p className="text-gray-700 mb-6">
                                    Confidee is not intended for users under 18. We do not knowingly collect information from minors. If you believe a minor has used our platform, please contact us immediately.
                                </p>

                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">9. International Users</h2>
                                <p className="text-gray-700 mb-6">
                                    Confidee operates globally through blockchain technology. By using the platform, you consent to the processing of your minimal data as described in this policy, regardless of your location.
                                </p>

                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">10. Changes to This Policy</h2>
                                <p className="text-gray-700 mb-6">
                                    We may update this privacy policy to reflect platform changes or legal requirements. Users will be notified of significant changes through the platform. Continued use constitutes acceptance of updated terms.
                                </p>

                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">11. Contact Us</h2>
                                <p className="text-gray-700 mb-4">
                                    For privacy-related questions or concerns, contact us through our official channels. We are committed to addressing privacy inquiries promptly and transparently.
                                </p>

                                <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                                    <h3 className="text-lg font-medium text-blue-900 mb-2">Privacy by Design</h3>
                                    <p className="text-blue-800">
                                        Confidee was built from the ground up with privacy as a fundamental principle. We believe emotional support should be available without sacrificing your personal privacy or data sovereignty.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </div>
        </main>
    )
}