// Supabase Database Types for 7 Wonders Duel Tracker

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      players: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      win_conditions: {
        Row: {
          id: number
          name: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          created_at?: string
        }
      }
      weltwunder: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
      player_wonders: {
        Row: {
          id: string
          player: string
          wonder1: string | null
          wonder2: string | null
          wonder3: string | null
          wonder4: string | null
        }
        Insert: {
          id?: string
          player: string
          wonder1?: string | null
          wonder2?: string | null
          wonder3?: string | null
          wonder4?: string | null
        }
        Update: {
          id?: string
          player?: string
          wonder1?: string | null
          wonder2?: string | null
          wonder3?: string | null
          wonder4?: string | null
        }
      }
      games: {
        Row: {
          id: string
          player_1_id: string
          player_2_id: string
          winner_id: string | null
          win_condition_id: number | null
          created_at: string
          p1_total_score: number
          p2_total_score: number
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
          p2_score_blue_cards: number
          p2_score_green_cards: number
          p2_score_yellow_cards: number
          p2_score_purple_cards: number
          p2_score_gods_cards: number
          p2_score_wonders_points: number
          p2_score_senator_points: number
          p2_score_military_points: number
          p2_score_progress_points: number
          p2_score_coin_points: number
          p2_score_great_temple: number
          p2_score_thalassa_points: number | null
        }
        Insert: {
          id?: string
          player_1_id: string
          player_2_id: string
          winner_id?: string | null
          win_condition_id?: number | null
          created_at?: string
          p1_total_score?: number
          p2_total_score?: number
          p1_score_blue_cards?: number
          p1_score_green_cards?: number
          p1_score_yellow_cards?: number
          p1_score_purple_cards?: number
          p1_score_gods_cards?: number
          p1_score_wonders_points?: number
          p1_score_capitol_points?: number
          p1_score_senator_points?: number
          p1_score_military_points?: number
          p1_score_progress_points?: number
          p1_score_coin_points?: number
          p1_score_great_temple?: number
          p1_score_thalassa_points?: number | null
          p2_score_blue_cards?: number
          p2_score_green_cards?: number
          p2_score_yellow_cards?: number
          p2_score_purple_cards?: number
          p2_score_gods_cards?: number
          p2_score_wonders_points?: number
          p2_score_senator_points?: number
          p2_score_military_points?: number
          p2_score_progress_points?: number
          p2_score_coin_points?: number
          p2_score_great_temple?: number
          p2_score_thalassa_points?: number | null
        }
        Update: {
          id?: string
          player_1_id?: string
          player_2_id?: string
          winner_id?: string | null
          win_condition_id?: number | null
          created_at?: string
          p1_total_score?: number
          p2_total_score?: number
          p1_score_blue_cards?: number
          p1_score_green_cards?: number
          p1_score_yellow_cards?: number
          p1_score_purple_cards?: number
          p1_score_gods_cards?: number
          p1_score_wonders_points?: number
          p1_score_capitol_points?: number
          p1_score_senator_points?: number
          p1_score_military_points?: number
          p1_score_progress_points?: number
          p1_score_coin_points?: number
          p1_score_great_temple?: number
          p1_score_thalassa_points?: number | null
          p2_score_blue_cards?: number
          p2_score_green_cards?: number
          p2_score_yellow_cards?: number
          p2_score_purple_cards?: number
          p2_score_gods_cards?: number
          p2_score_wonders_points?: number
          p2_score_senator_points?: number
          p2_score_military_points?: number
          p2_score_progress_points?: number
          p2_score_coin_points?: number
          p2_score_great_temple?: number
          p2_score_thalassa_points?: number | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper Types
export type Player = Database['public']['Tables']['players']['Row']
export type WinCondition = Database['public']['Tables']['win_conditions']['Row']
export type Weltwunder = Database['public']['Tables']['weltwunder']['Row']
export type Game = Database['public']['Tables']['games']['Row']
export type GameInsert = Database['public']['Tables']['games']['Insert']

// Extended Game type with player names
export interface GameWithPlayers extends Game {
  player_1: Player
  player_2: Player
  winner: Player | null
  win_condition: WinCondition | null
}
