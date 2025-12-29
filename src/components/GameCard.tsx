import { GameWithPlayers } from '@/types/database.types'
import { formatDateShort, getWinConditionIcon, calculateTotalScore } from '@/lib/utils'
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
  const p1Wins = game.winner_id === game.player_1_id
  const winnerName = p1Wins ? game.player_1?.name : game.player_2?.name
  const loserName = p1Wins ? game.player_2?.name : game.player_1?.name

  // Calculate scores
  const p1Score = calculateTotalScore(game, 1)
  const p2Score = calculateTotalScore(game, 2)
  const winnerScore = p1Wins ? p1Score : p2Score
  const loserScore = p1Wins ? p2Score : p1Score

  return (
    <Link href={`/games/${game.id}`}>
      <div className="game-card group">
        <div className="flex items-center justify-between gap-4">
          {/* Winner */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--bronze)] flex items-center justify-center text-[var(--background)] font-bold text-lg shadow-lg">
                {winnerName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-[var(--gold)] font-semibold">{winnerName}</div>
                <div className="text-xs text-[var(--foreground-muted)]">{winnerScore} Punkte</div>
              </div>
            </div>
          </div>

          {/* VS / Score */}
          <div className="flex flex-col items-center">
            {game.win_condition && (
              <div className={`win-badge ${getWinBadgeClass(game.win_condition.name)}`}>
                {getWinConditionIcon(game.win_condition.name)} {game.win_condition.name}
              </div>
            )}
          </div>

          {/* Loser */}
          <div className="flex-1 flex justify-end">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[var(--foreground-muted)] font-medium">{loserName}</div>
                <div className="text-xs text-[var(--foreground-muted)] opacity-70">{loserScore} Punkte</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[var(--background-light)] border border-[rgba(184,115,51,0.2)] flex items-center justify-center text-[var(--foreground-muted)] font-bold text-lg">
                {loserName?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Date footer */}
        <div className="mt-3 pt-2 border-t border-[rgba(184,115,51,0.15)] flex justify-center">
          <span className="text-xs text-[var(--foreground-muted)] opacity-70">{formatDateShort(game.created_at)}</span>
        </div>
      </div>
    </Link>
  )
}
