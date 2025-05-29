export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          organization: string | null
          role: "vendor" | "admin" | "reviewer"
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          organization?: string | null
          role?: "vendor" | "admin" | "reviewer"
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          organization?: string | null
          role?: "vendor" | "admin" | "reviewer"
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      organizations: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      organization_members: {
        Row: {
          organization_id: string
          user_id: string
          role: "owner" | "admin" | "member"
          created_at: string
        }
        Insert: {
          organization_id: string
          user_id: string
          role?: "owner" | "admin" | "member"
          created_at?: string
        }
        Update: {
          organization_id?: string
          user_id?: string
          role?: "owner" | "admin" | "member"
          created_at?: string
        }
      }
    }
  }
}

export type UserRole = "vendor" | "admin" | "reviewer"

export type Profile = Database["public"]["Tables"]["profiles"]["Row"]
