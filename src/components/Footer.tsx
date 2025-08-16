import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-blue-100/30 via-white to-blue-100/30 z-0">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600">
                    <span>© 2025 Confidee</span>
                    <div className="flex items-center space-x-6">
                        <Link
                            href="/terms"
                            className="hover:text-blue-600 transition-colors"
                        >
                            Terms of Service
                        </Link>
                        <Link
                            href="/privacy"
                            className="hover:text-blue-600 transition-colors"
                        >
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}