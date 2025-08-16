'use client'

import Link from 'next/link'

export default function TermsPage() {
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
                                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
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
                                Terms of Service
                            </h1>
                            <p className="text-gray-600">
                                Last updated: August 16, 2025
                            </p>
                        </div>

                        <div className="prose prose-lg max-w-none">
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">1. Acceptance of Terms</h2>
                                <p className="text-gray-700 mb-6">
                                    By connecting your wallet and using Confidee, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using the platform.
                                </p>

                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">2. Platform Description</h2>
                                <p className="text-gray-700 mb-4">
                                    Confidee is an anonymous Web3 platform that provides:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 mb-6">
                                    <li>Anonymous emotional support and community discussions</li>
                                    <li>AI-generated supportive responses to user posts</li>
                                    <li>Peer-to-peer SOL tipping functionality</li>
                                    <li>Topic-based and geographic community channels</li>
                                </ul>
                                <p className="text-gray-700 mb-6">
                                    <strong>Important:</strong> Confidee provides peer support and community interaction. It is not a substitute for professional medical, psychological, or mental health services.
                                </p>

                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">3. Age Requirements</h2>
                                <p className="text-gray-700 mb-6">
                                    You must be at least 18 years old to use Confidee. By using the platform, you represent and warrant that you meet this age requirement.
                                </p>

                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">4. Wallet Connection and Transactions</h2>
                                <p className="text-gray-700 mb-4">
                                    By connecting your Solana wallet, you acknowledge:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 mb-6">
                                    <li>All transactions on the Solana blockchain are irreversible</li>
                                    <li>You are responsible for the security of your private keys</li>
                                    <li>Confidee does not custody your funds or have access to your private keys</li>
                                    <li>Network fees may apply to blockchain transactions</li>
                                    <li>You voluntarily participate in the tipping economy at your own risk</li>
                                </ul>

                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">5. User Conduct and Content</h2>
                                <p className="text-gray-700 mb-4">
                                    You agree not to post content that:
                                </p>
                                <ul className="list-disc pl-6 text-gray-700 mb-4">
                                    <li>Promotes violence, self-harm, or illegal activities</li>
                                    <li>Contains harassment, discrimination, or hate speech</li>
                                    <li>Violates others' privacy or intellectual property rights</li>
                                    <li>Contains spam, advertising, or promotional content</li>
                                    <li>Provides medical advice or claims to offer professional treatment</li>
                                </ul>
                                <p className="text-gray-700 mb-6">
                                    While the platform is anonymous, we reserve the right to moderate content and take action against violations.
                                </p>

                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">6. Privacy and Data</h2>
                                <p className="text-gray-700 mb-6">
                                    Confidee is designed for privacy. We only store your wallet address and chosen username locally on your device. We do not collect personal information, track your identity, or share your data with third parties.
                                </p>

                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">7. AI-Generated Content</h2>
                                <p className="text-gray-700 mb-6">
                                    AI responses are generated automatically and should not be considered professional advice. While designed to be supportive, AI responses may not always be appropriate for your specific situation. Always consult qualified professionals for serious mental health concerns.
                                </p>

                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">8. Limitation of Liability</h2>
                                <p className="text-gray-700 mb-6">
                                    Confidee is provided "as is" without warranties. We are not liable for any damages arising from your use of the platform, including but not limited to financial losses from tipping, emotional distress, or decisions made based on community interactions or AI responses.
                                </p>

                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">9. Intellectual Property</h2>
                                <p className="text-gray-700 mb-6">
                                    You retain ownership of content you post. By using Confidee, you grant us a non-exclusive license to display your content on the platform. The Confidee platform, design, and technology remain our intellectual property.
                                </p>

                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">10. Changes to Terms</h2>
                                <p className="text-gray-700 mb-6">
                                    We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify users of significant changes through the platform.
                                </p>

                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">11. Termination</h2>
                                <p className="text-gray-700 mb-6">
                                    You may stop using Confidee at any time by disconnecting your wallet. We reserve the right to restrict access to users who violate these terms.
                                </p>

                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">12. Contact</h2>
                                <p className="text-gray-700 mb-6">
                                    For questions about these terms, please contact us through our official channels.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}