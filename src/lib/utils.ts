export function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatDateShort(dateString: string) {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  })
}

export function calculateTotalScore(game: {
  p1_score_blue_cards: number
  p1_score_green_cards: number
  p1_score_yellow_cards: number
  p1_score_purple_cards: number
  p1_score_gods_cards: number
  p1_score_wonders_points: number
  p1_score_capitol_points: number
  p1_score_senator_points: number
  p1_score_military_points: number
  p1_score_progress_points: number
  p1_score_coin_points: number
  p1_score_great_temple: number
  p1_score_thalassa_points: number | null
}, player: 1 | 2): number {
  const prefix = player === 1 ? 'p1' : 'p2'
  const g = game as Record<string, number | null>

  return (
    (g[`${prefix}_score_blue_cards`] || 0) +
    (g[`${prefix}_score_green_cards`] || 0) +
    (g[`${prefix}_score_yellow_cards`] || 0) +
    (g[`${prefix}_score_purple_cards`] || 0) +
    (g[`${prefix}_score_gods_cards`] || 0) +
    (g[`${prefix}_score_wonders_points`] || 0) +
    (g[`${prefix}_score_capitol_points`] || 0) +
    (g[`${prefix}_score_senator_points`] || 0) +
    (g[`${prefix}_score_military_points`] || 0) +
    (g[`${prefix}_score_progress_points`] || 0) +
    (g[`${prefix}_score_coin_points`] || 0) +
    (g[`${prefix}_score_great_temple`] || 0) +
    (g[`${prefix}_score_thalassa_points`] || 0)
  )
}

export function getWinConditionIcon(name: string): string {
  switch (name) {
    case 'Punkte': return '🎯'
    case 'Militär': return '⚔️'
    case 'Forschung': return '🔬'
    case 'Senat': return '🏛️'
    case 'Seemacht': return '⚓'
    default: return '🏆'
  }
}

export function getWinConditionColor(name: string): string {
  switch (name) {
    case 'Punkte': return 'text-blue-400'
    case 'Militär': return 'text-red-400'
    case 'Forschung': return 'text-green-400'
    case 'Senat': return 'text-purple-400'
    case 'Seemacht': return 'text-cyan-400'
    default: return 'text-yellow-400'
  }
}
