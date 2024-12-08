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
      tasks: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          start_time: string
          end_time: string
          priority: 'High' | 'Medium' | 'Low'
          category: 'Work' | 'Personal'
          status: 'Pending' | 'InProgress' | 'Completed'
          time_spent: number
          actual_start_time: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          start_time: string
          end_time: string
          priority: 'High' | 'Medium' | 'Low'
          category: 'Work' | 'Personal'
          status?: 'Pending' | 'InProgress' | 'Completed'
          time_spent?: number
          actual_start_time?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          start_time?: string
          end_time?: string
          priority?: 'High' | 'Medium' | 'Low'
          category?: 'Work' | 'Personal'
          status?: 'Pending' | 'InProgress' | 'Completed'
          time_spent?: number
          actual_start_time?: string | null
          completed_at?: string | null
          created_at?: string
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