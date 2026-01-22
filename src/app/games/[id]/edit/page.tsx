import { createClient } from '@/lib/supabase/server'
import { GameWithPlayers } from '@/types/database.types'
import EditGameForm from './EditGameForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getData(id: string) {
  const supabase = await createClient()

  const [gameRes, playersRes, winConditionsRes] = await Promise.all([
    supabase
      .from('games')
      .select(`
        *,
        player_1:players!games_player_1_id_fkey(*),
        player_2:players!games_player_2_id_fkey(*),
        winner:players!games_winner_id_fkey(*),
        win_condition:win_conditions(*)
      `)
      .eq('id', id)
      .single(),
    supabase.from('players').select('*').order('name'),
    supabase.from('win_conditions').select('*').order('id')
  ])

  return {
    game: gameRes.data as GameWithPlayers | null,
    players: playersRes.data || [],
    winConditions: winConditionsRes.data || []
  }
}

export default async function EditGamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { game, players, winConditions } = await getData(id)

  if (!game) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Link href="/games" className="text-[var(--teal)] hover:text-[var(--teal-light)] mb-6 inline-flex items-center gap-2 transition-colors">
          <span>&#8592;</span> Zurück zur Übersicht
        </Link>
        <h1 className="section-title text-2xl mb-8">Spiel bearbeiten</h1>
        <div className="antique-card p-6">
          <EditGameForm game={game} players={players} winConditions={winConditions} />
        </div>
      </main>
    </div>
  )
}
