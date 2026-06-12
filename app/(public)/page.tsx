import HeroBanner from '@/components/home/HeroBanner'
import NewsTicker from '@/components/home/NewsTicker'
import TrendingGrid from '@/components/home/TrendingGrid'
import UpcomingMatches from '@/components/home/UpcomingMatches'
import SportCard from '@/components/sports/SportCard'
import ScoreCard from '@/components/sports/ScoreCard'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-10">
      <HeroBanner />
      <NewsTicker />

      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-900">Explore Sports</h2>
        </div>
        <SportCard />
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <TrendingGrid />
        </div>
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">Recent Scores</h2>
          </div>
          <ScoreCard />
        </div>
      </div>

      <UpcomingMatches />
    </div>
  )
}
