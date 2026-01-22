'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { GameWithPlayers } from '@/types/database.types'
import { formatDateShort, getWinConditionIcon, calculateTotalScore } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface GameCardProps {
  game: GameWithPlayers
}

function getWinBadgeClass(winCondition: string): string {
  const name = winCondition.toLowerCase()
  if (name.includes('militär') || name.includes('militar') || name.includes('military')) {
    return 'win-badge-military'
  }
  if (name.includes('forschung') || name.includes('wissenschaft') || name.includes('science')) {
    return 'win-badge-science'
  }
  if (name.includes('senat') || name.includes('senate')) {
    return 'win-badge-senate'
  }
  if (name.includes('seemacht') || name.includes('naval')) {
    return 'win-badge-naval'
  }
  return 'win-badge-points'
}

export default function GameCard({ game }: GameCardProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const p1Wins = game.winner_id === game.player_1_id
  const winnerName = p1Wins ? game.player_1?.name : game.player_2?.name
  const loserName = p1Wins ? game.player_2?.name : game.player_1?.name

  // Calculate scores
  const p1Score = calculateTotalScore(game, 1)
  const p2Score = calculateTotalScore(game, 2)
  const winnerScore = p1Wins ? p1Score : p2Score
  const loserScore = p1Wins ? p2Score : p1Score

  const handleDelete = async () => {
    setDeleting(true)
    const supabase = createClient()
    const { error } = await supabase.from('games').delete().eq('id', game.id)
    if (error) {
      console.error('Error deleting game:', error)
      setDeleting(false)
      return
    }
    router.refresh()
  }

  return (
    <>
      <div className="game-card group relative">
        {/* Action Buttons - Always visible on mobile, hover on desktop */}
        <div className="absolute top-2 right-2 flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Link
            href={`/games/${game.id}/edit`}
            className="p-2 md:p-2 p-3 rounded-lg bg-[var(--background)] hover:bg-[var(--background-light)] border border-[rgba(184,115,51,0.3)] text-[var(--gold)] transition-colors"
            title="Bearbeiten"
            onClick={(e) => e.stopPropagation()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-4 md:h-4">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setShowDeleteDialog(true)
            }}
            className="p-2 md:p-2 p-3 rounded-lg bg-[var(--background)] hover:bg-[rgba(220,38,38,0.2)] border border-[rgba(184,115,51,0.3)] text-[var(--card-red)] transition-colors"
            title="Löschen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-4 md:h-4">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>

        <Link href={`/games/${game.id}`}>
          <div className="flex items-center justify-between gap-2 md:gap-4">
            {/* Winner */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--bronze)] flex items-center justify-center text-[var(--background)] font-bold text-base md:text-lg shadow-lg flex-shrink-0">
                  {winnerName?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-[var(--gold)] font-semibold text-sm md:text-base truncate">{winnerName}</div>
                  <div className="text-xs text-[var(--foreground-muted)]">{winnerScore} Punkte</div>
                </div>
              </div>
            </div>

            {/* VS / Score */}
            <div className="flex flex-col items-center flex-shrink-0">
              {game.win_condition && (
                <div className={`win-badge text-[10px] md:text-xs whitespace-nowrap ${getWinBadgeClass(game.win_condition.name)}`}>
                  {getWinConditionIcon(game.win_condition.name)} {game.win_condition.name}
                </div>
              )}
            </div>

            {/* Loser */}
            <div className="flex-1 min-w-0 flex justify-end">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="text-right min-w-0">
                  <div className="text-[var(--foreground-muted)] font-medium text-sm md:text-base truncate">{loserName}</div>
                  <div className="text-xs text-[var(--foreground-muted)] opacity-70">{loserScore} Punkte</div>
                </div>
                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-[var(--background-light)] border border-[rgba(184,115,51,0.2)] flex items-center justify-center text-[var(--foreground-muted)] font-bold text-base md:text-lg flex-shrink-0">
                  {loserName?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Date footer */}
          <div className="mt-3 pt-2 border-t border-[rgba(184,115,51,0.15)] flex justify-center">
            <span className="text-xs text-[var(--foreground-muted)] opacity-70">{formatDateShort(game.created_at)}</span>
          </div>
        </Link>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowDeleteDialog(false)}>
          <div className="antique-card p-6 max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[var(--gold)] text-lg font-semibold mb-4">Spiel löschen?</h3>
            <p className="text-[var(--foreground-muted)] mb-6">
              Möchtest du das Spiel zwischen <span className="text-white">{game.player_1?.name}</span> und <span className="text-white">{game.player_2?.name}</span> wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 px-4 py-2 rounded-lg border border-[rgba(184,115,51,0.3)] text-[var(--foreground-muted)] hover:bg-[var(--background-light)] transition-colors"
                disabled={deleting}
              >
                Abbrechen
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 rounded-lg bg-[var(--card-red)] text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                disabled={deleting}
              >
                {deleting ? 'Löschen...' : 'Löschen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
