export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-green-50/30"></div>
      <div className="relative">
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900">
                HavenX
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
                Connect Wallet
              </button>
            </div>
          </div>
        </nav>

        <section className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
              Anonymous Support Platform
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              The only anonymous support platform your
              <span className="text-blue-600"> mental health</span> ever needs
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Share your thoughts safely, get AI-powered emotional support, and join a tokenized community where caring for others creates real value.
            </p>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-colors mb-12">
              Get Started for Free
            </button>

            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Complete anonymity</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>AI emotional support</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Tokenized rewards</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-8 rounded-2xl">
                <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Anonymous Sharing</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Share your thoughts and feelings without revealing your identity. Only your wallet address is visible to the community.
                </p>
              </div>

              <div className="bg-purple-50 p-8 rounded-2xl">
                <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Support</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Get empathetic AI responses that understand your emotional context and provide meaningful support tailored to your needs.
                </p>
              </div>

              <div className="bg-green-50 p-8 rounded-2xl">
                <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Earn & Give</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Support community members with SOL tips and earn tokens for providing helpful responses and emotional support.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Built for safe, meaningful connections
            </h2>
            <p className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto">
              Whether dealing with work stress, relationships, or life challenges, HavenX provides a judgment-free space for authentic emotional support.
            </p>

            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              <div className="flex items-start space-x-4 text-left max-w-2xl mx-auto">
                <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-gray-600">AU</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-500 mb-2">Anonymous User • 2 minutes ago</div>
                  <div className="text-gray-900 mb-4">
                    "Just got rejected from my dream job after months of interviews. Feeling really discouraged and questioning my abilities..."
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                    <div className="text-sm font-medium text-blue-900 mb-1">AI Response</div>
                    <div className="text-blue-800 text-sm">
                      "I understand how disappointing this must feel. Job rejections, especially for positions we really want, can be incredibly disheartening. Remember that this doesn't reflect your worth or abilities..."
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">💚 12 SOL received</span>
                    <span>8 supportive replies</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to join our caring community?
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Connect your Solana wallet to start sharing anonymously and become part of the first tokenized emotional support network.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-colors">
                Connect Wallet & Start
              </button>
              <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-gray-500">
                <span>✓ Free to join</span>
                <span>✓ No personal data required</span>
                <span>✓ Solana network</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}