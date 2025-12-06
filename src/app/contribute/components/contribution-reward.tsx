
import { Coins } from "lucide-react"

export default function ContributionRewards() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Redeem Your Rewards</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Turn your contribution coins into valuable rewards. Each approved contribution earns you 30 coins.
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold mb-1">Your Coin Balance</h3>
            <p className="text-gray-400">Keep contributing to earn more!</p>
          </div>
          <div className="flex items-center gap-2">
            <Coins className="h-6 w-6 text-yellow-500" />
            <span className="text-2xl font-bold text-yellow-500">210</span>
          </div>
        </div>
      </div>
    </section>
  )
}
