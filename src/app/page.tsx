import { createClient } from '@/lib/supabase/server'
import { GameWithPlayers, WinCondition } from '@/types/database.types'
import GameCard from '@/components/GameCard'
import Link from 'next/link'

async function getRecentGames(): Promise<GameWithPlayers[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('games')
    .select(`
      *,
      player_1:players!games_player_1_id_fkey(*),
      player_2:players!games_player_2_id_fkey(*),
      winner:players!games_winner_id_fkey(*),
      win_condition:win_conditions(*)
    `)
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error fetching games:', error)
    return []
  }
  return data || []
}

async function getWinConditions(): Promise<WinCondition[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('win_conditions').select('*').order('id')
  return data || []
}

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

export default async function Home() {
  const [games, winConditions] = await Promise.all([
    getRecentGames(),
    getWinConditions()
  ])
  const supabase = await createClient()
  const { data: allGames } = await supabase.from('games').select('*')

  // Calculate win condition statistics
  const totalGames = allGames?.length || 0
  const winConditionStats = winConditions.map(wc => {
    const count = allGames?.filter(g => g.win_condition_id === wc.id).length || 0
    const percentage = totalGames > 0 ? Math.round((count / totalGames) * 100) : 0
    return { condition: wc, count, percentage }
  }).sort((a, b) => b.count - a.count)

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        {/* Win Condition Statistics */}
        <div className="antique-card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title text-lg">Siegbedingungen</h2>
            <span className="text-[var(--foreground-muted)] text-sm">{totalGames} Spiele gesamt</span>
          </div>
          <div className="space-y-4">
            {winConditionStats.map(stat => {
              const color = getWinConditionColor(stat.condition.name)
              return (
                <div key={stat.condition.id} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          background: color,
                          boxShadow: `0 0 10px ${color}`
                        }}
                      />
                      <span className="text-white font-medium">{stat.condition.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-[var(--foreground-muted)] text-xs">{stat.count}</div>
                      <div
                        className="text-2xl font-bold"
                        style={{ color }}
                      >
                        {stat.percentage}%
                      </div>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.max(stat.percentage, 3)}%`,
                        background: `linear-gradient(90deg, ${color}66 0%, ${color} 100%)`,
                        boxShadow: `0 0 12px ${color}40`
                      }}
                    />
                  </div>
                </div>
              )
            })}
            {winConditionStats.length === 0 && (
              <p className="text-[var(--foreground-muted)] text-center py-4">Noch keine Spiele vorhanden</p>
            )}
          </div>
        </div>

        {/* Recent Games Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title text-xl">Letzte Spiele</h2>
            <Link
              href="/games"
              className="text-[var(--teal)] hover:text-[var(--teal-light)] text-sm transition-colors"
            >
              Alle anzeigen
            </Link>
          </div>
          {games.length === 0 ? (
            <div className="antique-card p-8 text-center">
              <p className="text-[var(--foreground-muted)] mb-4">Noch keine Spiele vorhanden.</p>
              <Link href="/new-game" className="btn-primary inline-block">
                Erstes Spiel eintragen
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
