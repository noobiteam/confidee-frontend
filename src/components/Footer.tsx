import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-blue-100/30 via-white to-blue-100/30 z-0">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col items-center justify-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                        <Link href="/privacy" className="hover:text-blue-600 transition-colors">
                            Privacy Policy
                        </Link>
                        <span className="text-gray-400">•</span>
                        <Link href="/terms" className="hover:text-blue-600 transition-colors">
                            Terms of Service
                        </Link>
                    </div>
                    <span>© 2025 Confidee. All rights reserved.</span>
                </div>
            </div>
        </footer>
    )
}