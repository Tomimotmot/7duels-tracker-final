'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Player, WinCondition, GameInsert } from '@/types/database.types'

interface Props { players: Player[]; winConditions: WinCondition[] }

// Score categories matching the database fields with 7 Wonders Duel card colors
const scoreCategories = [
  { key: 'blue_cards', label: 'Blaue Karten', color: 'var(--card-blue)' },
  { key: 'green_cards', label: 'Grüne Karten', color: 'var(--card-green)' },
  { key: 'yellow_cards', label: 'Gelbe Karten', color: 'var(--card-yellow)' },
  { key: 'purple_cards', label: 'Gilden', color: 'var(--card-purple)' },
  { key: 'wonders_points', label: 'Weltwunder', color: 'var(--gold)' },
  { key: 'progress_points', label: 'Fortschritt', color: 'var(--teal)' },
  { key: 'military_points', label: 'Rote Karten', color: 'var(--card-red)' },
  { key: 'coin_points', label: 'Münzen', color: 'var(--bronze)' },
  { key: 'gods_cards', label: 'Götter', color: '#e67e22' },
  { key: 'senator_points', label: 'Senat', color: 'var(--card-purple)' },
  { key: 'great_temple', label: 'Großtempel', color: '#8e44ad' },
  { key: 'thalassa_points', label: 'Seemacht', color: 'var(--teal-light)' },
]

type ScoreKey = typeof scoreCategories[number]['key']

// Map win condition names from play page to database IDs
const winConditionMap: Record<string, string> = {
  'Punkte': 'Punkte',
  'Militär': 'Militär',
  'Wissenschaft': 'Wissenschaft',
  'Zeit abgelaufen': 'Punkte', // Time ran out counts as points victory
}

export default function NewGameForm({ players, winConditions }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')
  const [winner, setWinner] = useState('')
  const [winCond, setWinCond] = useState<number | null>(null)
  const [gameDate, setGameDate] = useState(() => new Date().toISOString().split('T')[0])
  const [fromGame, setFromGame] = useState(false)

  // Pre-fill from play page parameters
  useEffect(() => {
    const p1Id = searchParams.get('p1Id')
    const p2Id = searchParams.get('p2Id')
    const winnerId = searchParams.get('winnerId')
    const winConditionName = searchParams.get('winCondition')

    if (p1Id && p2Id) {
      setP1(p1Id)
      setP2(p2Id)
      setFromGame(true)
    }
    if (winnerId) {
      setWinner(winnerId)
    }
    if (winConditionName) {
      const mappedName = winConditionMap[winConditionName] || winConditionName
      const condition = winConditions.find(w => w.name === mappedName)
      if (condition) {
        setWinCond(condition.id)
      }
    }
  }, [searchParams, winConditions])

  // Score states for both players
  const [p1Scores, setP1Scores] = useState<Record<ScoreKey, number>>(
    Object.fromEntries(scoreCategories.map(c => [c.key, 0])) as Record<ScoreKey, number>
  )
  const [p2Scores, setP2Scores] = useState<Record<ScoreKey, number>>(
    Object.fromEntries(scoreCategories.map(c => [c.key, 0])) as Record<ScoreKey, number>
  )

  const p1Total = Object.values(p1Scores).reduce((a, b) => a + b, 0)
  const p2Total = Object.values(p2Scores).reduce((a, b) => a + b, 0)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!p1 || !p2 || !winner || !winCond) { setError('Alle Felder ausfüllen'); return }
    if (p1 === p2) { setError('Verschiedene Spieler wählen'); return }
    setLoading(true)
    const supabase = createClient()
    const data: GameInsert = {
      player_1_id: p1,
      player_2_id: p2,
      winner_id: winner,
      win_condition_id: winCond,
      created_at: new Date(gameDate).toISOString(),
      p1_score_blue_cards: p1Scores.blue_cards,
      p1_score_green_cards: p1Scores.green_cards,
      p1_score_yellow_cards: p1Scores.yellow_cards,
      p1_score_purple_cards: p1Scores.purple_cards,
      p1_score_wonders_points: p1Scores.wonders_points,
      p1_score_progress_points: p1Scores.progress_points,
      p1_score_coin_points: p1Scores.coin_points,
      p1_score_military_points: p1Scores.military_points,
      p1_score_gods_cards: p1Scores.gods_cards,
      p1_score_senator_points: p1Scores.senator_points,
      p1_score_great_temple: p1Scores.great_temple,
      p1_score_thalassa_points: p1Scores.thalassa_points,
      p1_score_capitol_points: 0,
      p2_score_blue_cards: p2Scores.blue_cards,
      p2_score_green_cards: p2Scores.green_cards,
      p2_score_yellow_cards: p2Scores.yellow_cards,
      p2_score_purple_cards: p2Scores.purple_cards,
      p2_score_wonders_points: p2Scores.wonders_points,
      p2_score_progress_points: p2Scores.progress_points,
      p2_score_coin_points: p2Scores.coin_points,
      p2_score_military_points: p2Scores.military_points,
      p2_score_gods_cards: p2Scores.gods_cards,
      p2_score_senator_points: p2Scores.senator_points,
      p2_score_great_temple: p2Scores.great_temple,
      p2_score_thalassa_points: p2Scores.thalassa_points,
    }
    const { error: err } = await supabase.from('games').insert(data)
    if (err) { setError(err.message); setLoading(false); return }
    router.push('/'); router.refresh()
  }

  const pl1 = players.find(x => x.id === p1)
  const pl2 = players.find(x => x.id === p2)

  return (
    <form onSubmit={submit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg" style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid var(--card-red)' }}>
          <span className="text-[var(--card-red)]">{error}</span>
        </div>
      )}

      {/* Game Completed Banner */}
      {fromGame && (
        <div className="p-4 rounded-lg" style={{ background: 'rgba(58, 138, 140, 0.15)', border: '1px solid var(--teal)' }}>
          <div className="text-[var(--teal)] font-semibold mb-1">Spiel beendet!</div>
          <div className="text-[var(--foreground-muted)] text-sm">
            Trage jetzt die Punkte ein, um das Spiel zu speichern.
          </div>
        </div>
      )}

      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium text-[var(--gold)] mb-3">Datum</label>
        <input
          type="date"
          value={gameDate}
          onChange={e => setGameDate(e.target.value)}
          className="rounded-lg p-3 w-full"
          required
        />
      </div>

      {/* Player Selection */}
      <div>
        <label className="block text-sm font-medium text-[var(--gold)] mb-3">Spieler auswählen</label>
        <div className="grid grid-cols-2 gap-4">
          <select
            value={p1}
            onChange={e => setP1(e.target.value)}
            className="rounded-lg p-3 w-full"
            required
            disabled={fromGame}
          >
            <option value="">Spieler 1</option>
            {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select
            value={p2}
            onChange={e => setP2(e.target.value)}
            className="rounded-lg p-3 w-full"
            required
            disabled={fromGame}
          >
            <option value="">Spieler 2</option>
            {players.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      {/* Start Game Button - only show when players selected and not coming from a game */}
      {p1 && p2 && p1 !== p2 && !fromGame && (
        <button
          type="button"
          onClick={() => {
            const params = new URLSearchParams({
              p1Id: p1,
              p2Id: p2,
              p1Name: pl1?.name || 'Spieler 1',
              p2Name: pl2?.name || 'Spieler 2',
            })
            router.push(`/play?${params.toString()}`)
          }}
          className="w-full py-4 rounded-lg font-semibold text-lg transition-all"
          style={{
            background: 'linear-gradient(135deg, var(--gold) 0%, var(--bronze) 100%)',
            color: 'var(--background)',
            boxShadow: '0 4px 16px rgba(212, 168, 83, 0.3)'
          }}
        >
          Spiel starten (mit Schachuhr)
        </button>
      )}

      {/* Divider */}
      {p1 && p2 && p1 !== p2 && !fromGame && (
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-[rgba(184,115,51,0.3)]" />
          <span className="text-[var(--foreground-muted)] text-sm">oder Ergebnis direkt eintragen</span>
          <div className="flex-1 h-px bg-[rgba(184,115,51,0.3)]" />
        </div>
      )}

      {/* Score Table */}
      {p1 && p2 && (
        <div className="simple-card overflow-hidden">
          {/* Header */}
          <div
            className="p-4 border-b border-[rgba(184,115,51,0.2)]"
            style={{ background: 'linear-gradient(180deg, var(--background-light) 0%, var(--background) 100%)' }}
          >
            <h3 className="text-[var(--gold)] font-semibold text-center text-lg">Punktetabelle</h3>
          </div>

          {/* Player Names Header */}
          <div className="grid grid-cols-3 gap-2 p-3 border-b border-[rgba(184,115,51,0.2)]" style={{ background: 'var(--background)' }}>
            <div className="text-center">
              <span className="font-bold text-[var(--gold)]">{pl1?.name}</span>
            </div>
            <div className="text-center text-[var(--foreground-muted)] text-sm">Kategorie</div>
            <div className="text-center">
              <span className="font-bold text-[var(--gold)]">{pl2?.name}</span>
            </div>
          </div>

          {/* Score Rows */}
          <div className="divide-y divide-[rgba(184,115,51,0.1)]">
            {scoreCategories.map(cat => (
              <div key={cat.key} className="grid grid-cols-3 gap-2 p-3 items-center hover:bg-[rgba(184,115,51,0.03)] transition-colors">
                <div className="flex justify-center">
                  <input
                    type="number"
                    min="0"
                    value={p1Scores[cat.key as ScoreKey] || ''}
                    onChange={e => setP1Scores(prev => ({ ...prev, [cat.key]: parseInt(e.target.value) || 0 }))}
                    className="w-16 text-center rounded p-2 text-lg font-bold score-input"
                    placeholder="0"
                  />
                </div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: cat.color, boxShadow: `0 0 8px ${cat.color}` }}
                  />
                  <span className="text-white">{cat.label}</span>
                </div>
                <div className="flex justify-center">
                  <input
                    type="number"
                    min="0"
                    value={p2Scores[cat.key as ScoreKey] || ''}
                    onChange={e => setP2Scores(prev => ({ ...prev, [cat.key]: parseInt(e.target.value) || 0 }))}
                    className="w-16 text-center rounded p-2 text-lg font-bold score-input"
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div
            className="grid grid-cols-3 gap-2 p-4 border-t border-[rgba(184,115,51,0.3)]"
            style={{ background: 'linear-gradient(180deg, var(--background-light) 0%, var(--background) 100%)' }}
          >
            <div className="text-center">
              <span
                className="text-3xl font-bold"
                style={{ color: p1Total > p2Total ? 'var(--card-green)' : p1Total < p2Total ? 'var(--card-red)' : 'var(--gold)' }}
              >
                {p1Total}
              </span>
            </div>
            <div className="text-center text-[var(--foreground-muted)] text-sm font-medium self-center">GESAMT</div>
            <div className="text-center">
              <span
                className="text-3xl font-bold"
                style={{ color: p2Total > p1Total ? 'var(--card-green)' : p2Total < p1Total ? 'var(--card-red)' : 'var(--gold)' }}
              >
                {p2Total}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Winner & Win Condition */}
      <div>
        <label className="block text-sm font-medium text-[var(--gold)] mb-3">Ergebnis</label>
        <div className="grid grid-cols-2 gap-4">
          <select
            value={winner}
            onChange={e => setWinner(e.target.value)}
            className="rounded-lg p-3 w-full disabled:opacity-50"
            required
            disabled={!p1||!p2}
          >
            <option value="">Gewinner</option>
            {p1 && <option value={p1}>{pl1?.name}</option>}
            {p2 && <option value={p2}>{pl2?.name}</option>}
          </select>
          <select
            value={winCond||''}
            onChange={e => setWinCond(Number(e.target.value))}
            className="rounded-lg p-3 w-full"
            required
          >
            <option value="">Siegbedingung</option>
            {winConditions.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full disabled:opacity-50 text-lg py-3"
      >
        {loading ? 'Speichere...' : 'Spiel speichern'}
      </button>
    </form>
  )
}
