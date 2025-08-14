export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="fixed inset-0 bg-gradient-to-r from-blue-100 via-white to-blue-100"></div>
      <div className="relative">
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                HavenX
              </div>
              <button className="bg-gray-400 cursor-not-allowed disabled text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-colors">
                Coming Soon
              </button>
            </div>
          </div>
        </nav>

        <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-purple-100 text-purple-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-6 sm:mb-8">
              Your safe space. Your voice. Your value.
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-2 sm:px-0">
              The world's first anonymous
              <span className="text-blue-600"> Web3 safe space</span> where your feelings matter
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-2 sm:px-0">
              Share your thoughts without fear, receive AI-powered emotional support, and earn rewards for helping others. Your care has real value.
            </p>

            <button className="bg-gray-400 cursor-not-allowed disabled text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg transition-colors mb-8 sm:mb-12">
              Coming Soon
            </button>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-500 max-w-md sm:max-w-none mx-auto">
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
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-blue-50 p-6 sm:p-8 rounded-2xl">
                <div className="bg-blue-100 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Complete Anonymity</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Only your wallet address is visible. Share your deepest thoughts without fear of judgment or exposure.
                </p>
              </div>

              <div className="bg-purple-50 p-6 sm:p-8 rounded-2xl">
                <div className="bg-purple-100 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">AI Emotional Support</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Replies adapt to your tone: serious, casual, or even playful. Get support that actually understands you.
                </p>
              </div>

              <div className="bg-green-50 p-6 sm:p-8 rounded-2xl sm:col-span-2 md:col-span-1">
                <div className="bg-green-100 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">Global Tokenized Community</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Join channels by topic or country, connect with the world, and earn SOL for supporting others in meaningful ways.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 px-2 sm:px-0">
              Where real support meets real value
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-10 sm:mb-16 max-w-2xl mx-auto px-2 sm:px-0">
              Channels by topic and country for meaningful connections. Your emotional wellbeing, powered by Web3.
            </p>

            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4 text-left max-w-2xl mx-auto">
                <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 self-start">
                  <span className="text-sm font-medium text-gray-600">AU</span>
                </div>
                <div className="flex-1 w-full">
                  <div className="text-xs sm:text-sm text-gray-500 mb-2">Anonymous User • 2 minutes ago</div>
                  <div className="text-sm sm:text-base text-gray-900 mb-4">
                    "Just got rejected from my dream job after months of interviews. Feeling really discouraged and questioning my abilities..."
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 sm:p-4 rounded-r-lg">
                    <div className="text-xs sm:text-sm font-medium text-blue-900 mb-1">AI Response</div>
                    <div className="text-blue-800 text-xs sm:text-sm">
                      "That must feel incredibly heavy after all the effort you've put in. Remember: a rejection doesn't erase your skills or your journey. The right door will open — and you're more ready than ever to walk through it."
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full font-medium">1.2 SOL received</span>
                    <span>8 supportive replies</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-6 sm:p-12 shadow-sm border border-gray-200">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 px-2 sm:px-0">
                Ready to join the world's first tokenized emotional support network?
              </h2>
              <p className="text-gray-600 mb-6 sm:mb-8 text-base sm:text-lg px-2 sm:px-0">
                Connect your Solana wallet and start sharing anonymously. Your feelings matter, and your care has real value.
              </p>
              <button className="bg-gray-400 cursor-not-allowed disabled text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg transition-colors">
                Coming Soon
              </button>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500">
                <span>Free to join</span>
                <span className="hidden sm:inline">•</span>
                <span>No personal data required</span>
                <span className="hidden sm:inline">•</span>
                <span>Powered by Solana network</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}