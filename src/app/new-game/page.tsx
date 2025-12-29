import { createClient } from '@/lib/supabase/server'
import NewGameForm from './NewGameForm'
import Link from 'next/link'

async function getData() {
  const supabase = await createClient()
  const [playersRes, winConditionsRes] = await Promise.all([
    supabase.from('players').select('*').order('name'),
    supabase.from('win_conditions').select('*').order('id')
  ])
  return { players: playersRes.data || [], winConditions: winConditionsRes.data || [] }
}

export default async function NewGamePage() {
  const { players, winConditions } = await getData()
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Link href="/" className="text-[var(--teal)] hover:text-[var(--teal-light)] mb-6 inline-flex items-center gap-2 transition-colors">
          <span>&#8592;</span> Zurück
        </Link>
        <h1 className="section-title text-2xl mb-8">Neues Spiel eintragen</h1>
        <div className="antique-card p-6">
          <NewGameForm players={players} winConditions={winConditions} />
        </div>
      </main>
    </div>
  )
}
