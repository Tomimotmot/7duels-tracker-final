import { createClient } from '@/lib/supabase/server'
import { GameWithPlayers } from '@/types/database.types'
import GameCard from '@/components/GameCard'
import Link from 'next/link'

async function getAllGames(): Promise<GameWithPlayers[]> {
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

  if (error) {
    console.error('Error fetching games:', error)
    return []
  }
  return data || []
}

export default async function GamesPage() {
  const games = await getAllGames()

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="section-title text-2xl">Alle Spiele</h1>
          <span className="text-[var(--foreground-muted)] text-sm">{games.length} Spiele</span>
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
      </main>
    </div>
  )
}
