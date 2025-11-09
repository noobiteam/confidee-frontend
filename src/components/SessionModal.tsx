import BaseModal from './BaseModal'

interface SessionModalProps {
  isOpen: boolean
  onClose: () => void
  onCreateSession: () => void
  isCreating: boolean
}

export default function SessionModal({ isOpen, onClose, onCreateSession, isCreating }: SessionModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Enable Gasless Transactions">
      <div className="space-y-4">
        <p className="text-gray-700">
          Sign once to enable gasless transactions for the next 24 hours.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <h4 className="font-semibold text-blue-900 mb-2">What you get:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
            <li>No more signing for each action</li>
            <li>Like, comment, and post instantly</li>
            <li>Zero gas fees</li>
            <li>Session lasts 24 hours</li>
          </ul>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            You'll only need to sign this message once. After that, all your actions will be gasless and instant!
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={isCreating}
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Skip for Now
          </button>
          <button
            onClick={onCreateSession}
            disabled={isCreating}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Creating Session...' : 'Sign Message'}
          </button>
        </div>
      </div>
    </BaseModal>
  )
}
