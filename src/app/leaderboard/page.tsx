import { createClient } from '@/lib/supabase/server'
import { getWinConditionIcon } from '@/lib/utils'

async function getLeaderboardData() {
  const supabase = await createClient()
  const [playersRes, gamesRes, winConditionsRes] = await Promise.all([
    supabase.from('players').select('*'),
    supabase.from('games').select('*'),
    supabase.from('win_conditions').select('*')
  ])
  const players = playersRes.data || []
  const games = gamesRes.data || []
  const winConditions = winConditionsRes.data || []

  const stats = players.map(player => {
    const playerGames = games.filter(g => g.player_1_id === player.id || g.player_2_id === player.id)
    const wins = games.filter(g => g.winner_id === player.id)
    const losses = playerGames.length - wins.length
    const winsByCondition = winConditions.map(wc => ({
      condition: wc,
      count: wins.filter(w => w.win_condition_id === wc.id).length
    }))
    return {
      player, games: playerGames.length, wins: wins.length, losses,
      winRate: playerGames.length > 0 ? (wins.length / playerGames.length * 100).toFixed(1) : '0',
      winsByCondition
    }
  }).sort((a, b) => b.wins - a.wins || parseFloat(b.winRate) - parseFloat(a.winRate))
  return { stats, winConditions }
}

export default async function LeaderboardPage() {
  const { stats, winConditions } = await getLeaderboardData()
  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <h1 className="section-title text-2xl mb-8">Rangliste</h1>
        <div className="antique-card overflow-hidden overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: 'linear-gradient(180deg, var(--background-light) 0%, var(--background) 100%)' }}>
              <tr>
                <th className="px-4 py-4 text-left text-sm font-medium text-[var(--gold)]">#</th>
                <th className="px-4 py-4 text-left text-sm font-medium text-[var(--gold)]">Spieler</th>
                <th className="px-4 py-4 text-center text-sm font-medium text-[var(--foreground-muted)]">Spiele</th>
                <th className="px-4 py-4 text-center text-sm font-medium text-[var(--foreground-muted)]">Siege</th>
                <th className="px-4 py-4 text-center text-sm font-medium text-[var(--foreground-muted)]">Niederlagen</th>
                <th className="px-4 py-4 text-center text-sm font-medium text-[var(--foreground-muted)]">Quote</th>
                {winConditions.map(wc => (
                  <th key={wc.id} className="px-4 py-4 text-center text-sm font-medium text-[var(--foreground-muted)]" title={wc.name}>
                    {getWinConditionIcon(wc.name)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(184,115,51,0.15)]">
              {stats.map((stat, index) => (
                <tr key={stat.player.id} className="hover:bg-[rgba(184,115,51,0.05)] transition-colors">
                  <td className="px-4 py-4">
                    <span className={`text-lg font-bold ${index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : 'text-[var(--foreground-muted)]'}`}>
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0
                            ? 'bg-gradient-to-br from-[var(--gold)] to-[var(--bronze)] text-[var(--background)]'
                            : index === 1
                              ? 'bg-gradient-to-br from-[var(--silver)] to-gray-500 text-[var(--background)]'
                              : index === 2
                                ? 'bg-gradient-to-br from-[#cd7f32] to-[#8b4513] text-white'
                                : 'bg-[var(--background-light)] text-[var(--foreground-muted)]'
                        }`}
                      >
                        {stat.player.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-white">{stat.player.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-[var(--foreground-muted)]">{stat.games}</td>
                  <td className="px-4 py-4 text-center font-semibold text-[var(--card-green)]">{stat.wins}</td>
                  <td className="px-4 py-4 text-center text-[var(--card-red)]">{stat.losses}</td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className="font-semibold"
                      style={{ color: parseFloat(stat.winRate) >= 50 ? 'var(--card-green)' : 'var(--card-red)' }}
                    >
                      {stat.winRate}%
                    </span>
                  </td>
                  {stat.winsByCondition.map(wbc => (
                    <td key={wbc.condition.id} className="px-4 py-4 text-center text-[var(--foreground-muted)]">
                      {wbc.count > 0 ? wbc.count : '-'}
                    </td>
                  ))}
                </tr>
              ))}
              {stats.length === 0 && (
                <tr>
                  <td colSpan={6 + winConditions.length} className="px-4 py-8 text-center text-[var(--foreground-muted)]">
                    Noch keine Spieler vorhanden
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
