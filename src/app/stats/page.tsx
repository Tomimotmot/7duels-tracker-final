import { createClient } from '@/lib/supabase/server'
import { getWinConditionIcon } from '@/lib/utils'

function getWinConditionColor(name: string): string {
  switch (name) {
    case 'Punkte': return 'var(--gold)'
    case 'Militär': return 'var(--card-red)'
    case 'Forschung': return 'var(--card-green)'
    case 'Senat': return 'var(--card-purple)'
    case 'Seemacht': return 'var(--teal-light)'
    default: return 'var(--bronze)'
  }
}

async function getStats() {
  const supabase = await createClient()
  const [gamesRes, winConditionsRes, playersRes] = await Promise.all([
    supabase.from('games').select('*'),
    supabase.from('win_conditions').select('*'),
    supabase.from('players').select('*')
  ])
  const games = gamesRes.data || []
  const winConditions = winConditionsRes.data || []
  const players = playersRes.data || []

  const winConditionStats = winConditions.map(wc => ({
    condition: wc,
    count: games.filter(g => g.win_condition_id === wc.id).length,
    percentage: games.length > 0 ? (games.filter(g => g.win_condition_id === wc.id).length / games.length * 100).toFixed(1) : '0'
  })).sort((a, b) => b.count - a.count)

  const h2hStats: { p1: string; p2: string; p1Wins: number; p2Wins: number; total: number }[] = []
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const p1 = players[i], p2 = players[j]
      const matchups = games.filter(g => (g.player_1_id === p1.id && g.player_2_id === p2.id) || (g.player_1_id === p2.id && g.player_2_id === p1.id))
      if (matchups.length > 0) {
        h2hStats.push({ p1: p1.name, p2: p2.name, p1Wins: matchups.filter(g => g.winner_id === p1.id).length, p2Wins: matchups.filter(g => g.winner_id === p2.id).length, total: matchups.length })
      }
    }
  }
  return { totalGames: games.length, winConditionStats, h2hStats }
}

export default async function StatsPage() {
  const { totalGames, winConditionStats, h2hStats } = await getStats()
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="section-title text-2xl mb-8">Statistiken</h1>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Win Conditions Panel */}
          <div className="antique-card p-6">
            <h2 className="text-xl font-semibold mb-6 text-[var(--gold)]">Siegbedingungen</h2>
            <div className="space-y-4">
              {winConditionStats.map(stat => {
                const color = getWinConditionColor(stat.condition.name)
                return (
                  <div key={stat.condition.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-3">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                        />
                        <span className="text-white font-medium">{stat.condition.name}</span>
                      </span>
                      <span className="text-[var(--foreground-muted)]">{stat.count} ({stat.percentage}%)</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${Math.max(parseFloat(stat.percentage), 3)}%`,
                          background: `linear-gradient(90deg, ${color}66 0%, ${color} 100%)`,
                          boxShadow: `0 0 8px ${color}40`
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-6 pt-4 border-t border-[rgba(184,115,51,0.2)] text-center text-[var(--foreground-muted)]">
              Gesamt: <span className="text-[var(--gold)] font-semibold">{totalGames}</span> Spiele
            </div>
          </div>

          {/* Head-to-Head Panel */}
          <div className="antique-card p-6">
            <h2 className="text-xl font-semibold mb-6 text-[var(--gold)]">Head-to-Head</h2>
            <div className="space-y-3">
              {h2hStats.map((h2h, index) => (
                <div key={index} className="rounded-lg p-4" style={{ background: 'var(--background)' }}>
                  <div className="flex items-center justify-between">
                    <span
                      className="font-medium flex-1"
                      style={{ color: h2h.p1Wins > h2h.p2Wins ? 'var(--card-green)' : h2h.p1Wins < h2h.p2Wins ? 'var(--foreground-muted)' : 'var(--gold)' }}
                    >
                      {h2h.p1}
                    </span>
                    <div className="flex items-center gap-3 px-4 py-2 rounded-lg" style={{ background: 'var(--background-light)' }}>
                      <span
                        className="font-bold text-xl"
                        style={{ color: h2h.p1Wins > h2h.p2Wins ? 'var(--card-green)' : 'var(--foreground)' }}
                      >
                        {h2h.p1Wins}
                      </span>
                      <span className="text-[var(--foreground-muted)]">:</span>
                      <span
                        className="font-bold text-xl"
                        style={{ color: h2h.p2Wins > h2h.p1Wins ? 'var(--card-green)' : 'var(--foreground)' }}
                      >
                        {h2h.p2Wins}
                      </span>
                    </div>
                    <span
                      className="font-medium flex-1 text-right"
                      style={{ color: h2h.p2Wins > h2h.p1Wins ? 'var(--card-green)' : h2h.p2Wins < h2h.p1Wins ? 'var(--foreground-muted)' : 'var(--gold)' }}
                    >
                      {h2h.p2}
                    </span>
                  </div>
                  <div className="text-center text-xs text-[var(--foreground-muted)] mt-2">{h2h.total} Spiele</div>
                </div>
              ))}
              {h2hStats.length === 0 && <p className="text-[var(--foreground-muted)] text-center py-4">Keine Daten</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
