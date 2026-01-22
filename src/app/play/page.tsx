'use client'

import { useState, useEffect, useCallback, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { WinCondition } from '@/types/database.types'

const INITIAL_TIME = 25 * 60 // 25 minutes in seconds

interface GameState {
  p1Time: number
  p2Time: number
  activePlayer: 1 | 2 | null
  age: 1 | 2 | 3
  isRunning: boolean
  winner: 1 | 2 | null
  winCondition: string | null
  p1Name: string
  p2Name: string
  p1Id: string
  p2Id: string
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-[var(--gold)]">Laden...</div></div>}>
      <PlayPageContent />
    </Suspense>
  )
}

function PlayPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const [gameState, setGameState] = useState<GameState>({
    p1Time: INITIAL_TIME,
    p2Time: INITIAL_TIME,
    activePlayer: null,
    age: 1,
    isRunning: false,
    winner: null,
    winCondition: null,
    p1Name: searchParams.get('p1Name') || 'Spieler 1',
    p2Name: searchParams.get('p2Name') || 'Spieler 2',
    p1Id: searchParams.get('p1Id') || '',
    p2Id: searchParams.get('p2Id') || '',
  })

  const [showVictoryModal, setShowVictoryModal] = useState(false)
  const [showEndAgeModal, setShowEndAgeModal] = useState(false)
  const [victoryStep, setVictoryStep] = useState<'winner' | 'condition'>('winner')
  const [selectedWinner, setSelectedWinner] = useState<1 | 2 | null>(null)
  const [winConditions, setWinConditions] = useState<WinCondition[]>([])

  // Fetch win conditions
  useEffect(() => {
    const fetchWinConditions = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('win_conditions')
        .select('*')
        .order('id')
      if (data) {
        // Filter out "Punkte" since that's not an instant victory
        setWinConditions(data.filter(w => w.name !== 'Punkte'))
      }
    }
    fetchWinConditions()
  }, [])

  // Timer logic
  useEffect(() => {
    if (gameState.isRunning && gameState.activePlayer && !gameState.winner) {
      intervalRef.current = setInterval(() => {
        setGameState(prev => {
          const timeKey = prev.activePlayer === 1 ? 'p1Time' : 'p2Time'
          const newTime = prev[timeKey] - 1

          // Time ran out
          if (newTime <= 0) {
            return {
              ...prev,
              [timeKey]: 0,
              isRunning: false,
              winner: prev.activePlayer === 1 ? 2 : 1,
              winCondition: 'Zeit abgelaufen'
            }
          }

          return { ...prev, [timeKey]: newTime }
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [gameState.isRunning, gameState.activePlayer, gameState.winner])

  // Switch player turn
  const switchPlayer = useCallback(() => {
    if (gameState.winner) return

    setGameState(prev => ({
      ...prev,
      activePlayer: prev.activePlayer === 1 ? 2 : 1,
      isRunning: true
    }))
  }, [gameState.winner])

  // Start game (first move)
  const startGame = useCallback((startingPlayer: 1 | 2) => {
    setGameState(prev => ({
      ...prev,
      activePlayer: startingPlayer,
      isRunning: true
    }))
  }, [])

  // Pause/Resume
  const togglePause = useCallback(() => {
    if (gameState.winner) return
    setGameState(prev => ({ ...prev, isRunning: !prev.isRunning }))
  }, [gameState.winner])

  // End age
  const endAge = useCallback(() => {
    if (gameState.age < 3) {
      setShowEndAgeModal(true)
    } else {
      // End of age 3 - go to scoring
      goToScoring('Punkte')
    }
  }, [gameState.age])

  const confirmEndAge = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      age: (prev.age + 1) as 1 | 2 | 3
    }))
    setShowEndAgeModal(false)
  }, [])

  // Victory conditions
  const declareVictory = useCallback((winner: 1 | 2, condition: string) => {
    setGameState(prev => ({
      ...prev,
      isRunning: false,
      winner,
      winCondition: condition
    }))
    setShowVictoryModal(false)
  }, [])

  // Go to scoring page
  const goToScoring = useCallback((winCondition: string) => {
    const winnerId = gameState.winner === 1 ? gameState.p1Id : gameState.p2Id
    const params = new URLSearchParams({
      p1Id: gameState.p1Id,
      p2Id: gameState.p2Id,
      p1Name: gameState.p1Name,
      p2Name: gameState.p2Name,
      winnerId: winnerId,
      winCondition: winCondition,
      p1TimeUsed: String(INITIAL_TIME - gameState.p1Time),
      p2TimeUsed: String(INITIAL_TIME - gameState.p2Time),
    })
    router.push(`/new-game?${params.toString()}`)
  }, [gameState, router])

  // No players selected
  if (!gameState.p1Id || !gameState.p2Id) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="antique-card p-8 text-center max-w-md">
          <h2 className="text-[var(--gold)] text-xl mb-4">Keine Spieler ausgewählt</h2>
          <p className="text-[var(--foreground-muted)] mb-6">
            Bitte wähle zuerst die Spieler aus.
          </p>
          <Link href="/new-game" className="btn-primary inline-block">
            Spieler auswählen
          </Link>
        </div>
      </div>
    )
  }

  // Game ended
  if (gameState.winner && gameState.winCondition) {
    const winnerName = gameState.winner === 1 ? gameState.p1Name : gameState.p2Name
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="antique-card p-8 text-center max-w-md">
          <h2 className="text-[var(--gold)] text-3xl mb-2">Spiel beendet!</h2>
          <div className="text-[var(--card-green)] text-2xl font-bold mb-2">
            {winnerName} gewinnt!
          </div>
          <div className="text-[var(--foreground-muted)] mb-6">
            Siegbedingung: {gameState.winCondition}
          </div>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => goToScoring(gameState.winCondition!)}
              className="btn-primary"
            >
              Punkte eintragen
            </button>
            <Link href="/new-game" className="btn-gold">
              Neues Spiel
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Age Indicator */}
      <div className="bg-[var(--background-light)] border-b border-[rgba(184,115,51,0.3)] p-4">
        <div className="flex justify-center items-center gap-4">
          {[1, 2, 3].map(age => (
            <div
              key={age}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
                gameState.age === age
                  ? 'bg-[var(--teal)] text-white scale-110'
                  : gameState.age > age
                  ? 'bg-[var(--gold)] text-[var(--background)]'
                  : 'bg-[rgba(184,115,51,0.2)] text-[var(--foreground-muted)]'
              }`}
            >
              {age}
            </div>
          ))}
        </div>
        <div className="text-center mt-2 text-[var(--gold)] font-semibold">
          Zeitalter {gameState.age}
        </div>
      </div>

      {/* Chess Clock */}
      <div className="flex-1 flex flex-col">
        {/* Player 2 (top, rotated 180deg for face-to-face play) */}
        <button
          onClick={() => gameState.activePlayer === 2 ? switchPlayer() : (gameState.activePlayer === null && startGame(2))}
          disabled={gameState.activePlayer === 1 || !!gameState.winner}
          className={`flex-1 flex flex-col items-center justify-center p-8 transition-all ${
            gameState.activePlayer === 2
              ? 'bg-[var(--teal)] text-white'
              : 'bg-[var(--background-light)] text-[var(--foreground-muted)]'
          } ${gameState.activePlayer === 2 ? 'cursor-pointer' : ''}`}
          style={{ transform: 'rotate(180deg)' }}
        >
          <div className="text-2xl font-semibold mb-4">{gameState.p2Name}</div>
          <div className={`text-7xl font-mono font-bold ${gameState.p2Time < 60 ? 'text-[var(--card-red)]' : ''}`}>
            {formatTime(gameState.p2Time)}
          </div>
          {gameState.activePlayer === 2 && (
            <div className="mt-4 text-lg opacity-80">Tippen zum Wechseln</div>
          )}
        </button>

        {/* Center Controls */}
        <div className="bg-[var(--background)] border-y border-[rgba(184,115,51,0.3)] p-4 flex justify-center items-center gap-4">
          <button
            onClick={togglePause}
            className="btn-gold px-6 py-3"
            disabled={!gameState.activePlayer}
          >
            {gameState.isRunning ? '⏸ Pause' : '▶ Weiter'}
          </button>

          <button
            onClick={endAge}
            className="btn-primary px-6 py-3"
          >
            {gameState.age < 3 ? `Zeitalter ${gameState.age} beenden` : 'Spiel beenden (Punkte)'}
          </button>

          <button
            onClick={() => setShowVictoryModal(true)}
            className="px-6 py-3 rounded-lg font-semibold transition-all"
            style={{
              background: 'linear-gradient(135deg, var(--card-red) 0%, #991b1b 100%)',
              color: 'white'
            }}
          >
            Sofortsieg
          </button>
        </div>

        {/* Player 1 (bottom) */}
        <button
          onClick={() => gameState.activePlayer === 1 ? switchPlayer() : (gameState.activePlayer === null && startGame(1))}
          disabled={gameState.activePlayer === 2 || !!gameState.winner}
          className={`flex-1 flex flex-col items-center justify-center p-8 transition-all ${
            gameState.activePlayer === 1
              ? 'bg-[var(--teal)] text-white'
              : 'bg-[var(--background-light)] text-[var(--foreground-muted)]'
          } ${gameState.activePlayer === 1 ? 'cursor-pointer' : ''}`}
        >
          <div className="text-2xl font-semibold mb-4">{gameState.p1Name}</div>
          <div className={`text-7xl font-mono font-bold ${gameState.p1Time < 60 ? 'text-[var(--card-red)]' : ''}`}>
            {formatTime(gameState.p1Time)}
          </div>
          {gameState.activePlayer === 1 && (
            <div className="mt-4 text-lg opacity-80">Tippen zum Wechseln</div>
          )}
        </button>
      </div>

      {/* Victory Modal */}
      {showVictoryModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="antique-card p-6 max-w-md w-full">
            {/* Step 1: Select Winner */}
            {victoryStep === 'winner' && (
              <>
                <h3 className="text-[var(--gold)] text-xl font-semibold mb-6 text-center">
                  Wer hat gewonnen?
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setSelectedWinner(1)
                      setVictoryStep('condition')
                    }}
                    className="p-6 rounded-lg text-white font-semibold text-lg transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, var(--teal) 0%, var(--teal-dark) 100%)' }}
                  >
                    {gameState.p1Name}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedWinner(2)
                      setVictoryStep('condition')
                    }}
                    className="p-6 rounded-lg text-white font-semibold text-lg transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, var(--teal) 0%, var(--teal-dark) 100%)' }}
                  >
                    {gameState.p2Name}
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Select Win Condition */}
            {victoryStep === 'condition' && selectedWinner && (
              <>
                <h3 className="text-[var(--gold)] text-xl font-semibold mb-2 text-center">
                  Siegbedingung
                </h3>
                <p className="text-[var(--foreground-muted)] text-center mb-6">
                  {selectedWinner === 1 ? gameState.p1Name : gameState.p2Name} gewinnt durch...
                </p>
                <div className="space-y-3">
                  {winConditions.map(condition => (
                    <button
                      key={condition.id}
                      onClick={() => declareVictory(selectedWinner, condition.name)}
                      className="w-full p-4 rounded-lg text-white font-semibold transition-all hover:scale-[1.02]"
                      style={{
                        background: condition.name === 'Militär'
                          ? 'linear-gradient(135deg, var(--card-red) 0%, #991b1b 100%)'
                          : condition.name === 'Wissenschaft'
                          ? 'linear-gradient(135deg, var(--card-green) 0%, #15803d 100%)'
                          : 'linear-gradient(135deg, var(--card-purple) 0%, #6d28d9 100%)'
                      }}
                    >
                      {condition.name}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setVictoryStep('winner')}
                  className="w-full mt-4 p-3 rounded-lg border border-[rgba(184,115,51,0.3)] text-[var(--foreground-muted)] hover:bg-[rgba(184,115,51,0.1)] transition-colors"
                >
                  Zurück
                </button>
              </>
            )}

            <button
              onClick={() => {
                setShowVictoryModal(false)
                setVictoryStep('winner')
                setSelectedWinner(null)
              }}
              className="w-full mt-4 p-3 rounded-lg border border-[rgba(184,115,51,0.3)] text-[var(--foreground-muted)] hover:bg-[rgba(184,115,51,0.1)] transition-colors"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {/* End Age Modal */}
      {showEndAgeModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="antique-card p-6 max-w-md w-full text-center">
            <h3 className="text-[var(--gold)] text-xl font-semibold mb-4">
              Zeitalter {gameState.age} beenden?
            </h3>
            <p className="text-[var(--foreground-muted)] mb-6">
              Weiter zu Zeitalter {gameState.age + 1}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={confirmEndAge}
                className="btn-primary px-6"
              >
                Ja, weiter
              </button>
              <button
                onClick={() => setShowEndAgeModal(false)}
                className="btn-gold px-6"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Start Game Hint */}
      {gameState.activePlayer === null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-40 pointer-events-none">
          <div className="antique-card p-8 text-center">
            <h3 className="text-[var(--gold)] text-2xl mb-4">Spiel starten</h3>
            <p className="text-[var(--foreground)]">
              Tippe auf den Bereich des Spielers, der beginnt
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
