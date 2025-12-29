import { createClient } from '@/lib/supabase/server'
import { GameWithPlayers } from '@/types/database.types'
import { formatDate, calculateTotalScore, getWinConditionIcon } from '@/lib/utils'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getGame(id: string): Promise<GameWithPlayers | null> {
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
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

// Score categories with 7 Wonders Duel card colors
const scoreCategories = [
  { key: 'blue_cards', label: 'Profangebäude', color: 'var(--card-blue)' },
  { key: 'green_cards', label: 'Forschung', color: 'var(--card-green)' },
  { key: 'yellow_cards', label: 'Handel', color: 'var(--card-yellow)' },
  { key: 'purple_cards', label: 'Gilden', color: 'var(--card-purple)' },
  { key: 'wonders_points', label: 'Weltwunder', color: 'var(--gold)' },
  { key: 'progress_points', label: 'Fortschritt', color: 'var(--teal)' },
  { key: 'coin_points', label: 'Münzen', color: 'var(--bronze)' },
  { key: 'military_points', label: 'Militär', color: 'var(--card-red)' },
  { key: 'gods_cards', label: 'Götter', color: '#e67e22' },
  { key: 'senator_points', label: 'Senat', color: 'var(--card-purple)' },
  { key: 'great_temple', label: 'Großtempel', color: '#8e44ad' },
  { key: 'thalassa_points', label: 'Seemacht', color: 'var(--teal-light)' },
]

function getWinConditionBadgeClass(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('militär') || n.includes('militar')) return 'win-badge-military'
  if (n.includes('forschung') || n.includes('wissenschaft')) return 'win-badge-science'
  if (n.includes('senat')) return 'win-badge-senate'
  if (n.includes('seemacht')) return 'win-badge-naval'
  return 'win-badge-points'
}

export default async function GameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const game = await getGame(id)
  if (!game) notFound()

  const p1Total = calculateTotalScore(game, 1)
  const p2Total = calculateTotalScore(game, 2)
  const p1Wins = game.winner_id === game.player_1_id

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Link href="/games" className="text-[var(--teal)] hover:text-[var(--teal-light)] mb-6 inline-flex items-center gap-2 transition-colors">
          <span>&#8592;</span> Zurück zu allen Spielen
        </Link>

        {/* Main Score Card */}
        <div className="antique-card p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            {/* Player 1 */}
            <div className="flex-1 text-center">
              <div className={`mb-2 ${p1Wins ? 'text-[var(--gold)]' : 'text-[var(--foreground-muted)]'}`}>
                <div className="text-2xl font-bold">{game.player_1?.name}</div>
                {p1Wins && <div className="text-[var(--gold)] mt-1 text-sm">Gewinner</div>}
              </div>
            </div>

            {/* Score Display */}
            <div className="px-8">
              <div className="flex items-center gap-4 text-4xl font-bold">
                <span style={{ color: p1Total > p2Total ? 'var(--card-green)' : 'var(--foreground)' }}>{p1Total}</span>
                <span className="text-[var(--foreground-muted)]">:</span>
                <span style={{ color: p2Total > p1Total ? 'var(--card-green)' : 'var(--foreground)' }}>{p2Total}</span>
              </div>
            </div>

            {/* Player 2 */}
            <div className="flex-1 text-center">
              <div className={`mb-2 ${!p1Wins ? 'text-[var(--gold)]' : 'text-[var(--foreground-muted)]'}`}>
                <div className="text-2xl font-bold">{game.player_2?.name}</div>
                {!p1Wins && <div className="text-[var(--gold)] mt-1 text-sm">Gewinner</div>}
              </div>
            </div>
          </div>

          {/* Game Info */}
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-[var(--foreground-muted)]">{formatDate(game.created_at)}</span>
            {game.win_condition && (
              <>
                <span className="text-[var(--bronze)]">&#8226;</span>
                <span className={`win-badge ${getWinConditionBadgeClass(game.win_condition.name)}`}>
                  {getWinConditionIcon(game.win_condition.name)} {game.win_condition.name}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="antique-card p-6">
          <h2 className="text-xl font-semibold mb-6 text-[var(--gold)]">Punkteaufschlüsselung</h2>
          <div className="space-y-1">
            {scoreCategories.map(cat => {
              const p1Score = (game as unknown as Record<string, number>)[`p1_score_${cat.key}`] || 0
              const p2Score = (game as unknown as Record<string, number>)[`p2_score_${cat.key}`] || 0
              if (p1Score === 0 && p2Score === 0) return null
              return (
                <div key={cat.key} className="grid grid-cols-3 gap-4 items-center py-3 border-b border-[rgba(184,115,51,0.15)] last:border-0">
                  <div className="text-right">
                    <span
                      className="text-lg font-semibold"
                      style={{ color: p1Score > p2Score ? 'var(--card-green)' : 'var(--foreground-muted)' }}
                    >
                      {p1Score}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ background: cat.color, boxShadow: `0 0 6px ${cat.color}` }}
                    />
                    <span className="text-white">{cat.label}</span>
                  </div>
                  <div className="text-left">
                    <span
                      className="text-lg font-semibold"
                      style={{ color: p2Score > p1Score ? 'var(--card-green)' : 'var(--foreground-muted)' }}
                    >
                      {p2Score}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
