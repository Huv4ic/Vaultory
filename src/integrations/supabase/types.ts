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
      accounts: {
        Row: {
          account_data: Json
          created_at: string | null
          id: string
          product_id: string | null
          sold_at: string | null
          sold_to_user_id: string | null
          status: string | null
        }
        Insert: {
          account_data: Json
          created_at?: string | null
          id?: string
          product_id?: string | null
          sold_at?: string | null
          sold_to_user_id?: string | null
          status?: string | null
        }
        Update: {
          account_data?: Json
          created_at?: string | null
          id?: string
          product_id?: string | null
          sold_at?: string | null
          sold_to_user_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_sold_to_user_id_fkey"
            columns: ["sold_to_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_sold_to_user_id_fkey"
            columns: ["sold_to_user_id"]
            isOneToOne: false
            referencedRelation: "user_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          target_id: string | null
          target_type: string
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          target_id?: string | null
          target_type: string
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          target_id?: string | null
          target_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_logs_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "user_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_products: {
        Row: {
          id: string
          name: string
          price: number
          original_price: number | null
          image_url: string
          category: string
          game: string
          rating: number
          sales: number
          description: string | null
          features: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          original_price?: number | null
          image_url: string
          category: string
          game: string
          rating: number
          sales: number
          description?: string | null
          features?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          original_price?: number | null
          image_url?: string
          category?: string
          game?: string
          rating?: number
          sales?: number
          description?: string | null
          features?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_cases: {
        Row: {
          id: string
          name: string
          price: number
          image_url: string
          game: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          image_url: string
          game: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          image_url?: string
          game?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      admin_case_items: {
        Row: {
          id: string
          case_id: string
          name: string
          image_url: string
          rarity: string
          drop_chance: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          case_id: string
          name: string
          image_url: string
          rarity: string
          drop_chance: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          case_id?: string
          name?: string
          image_url?: string
          rarity?: string
          drop_chance?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_case_items_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "admin_cases"
            referencedColumns: ["id"]
          }
        ]
      }
      case_items: {
        Row: {
          case_id: string | null
          chance: number
          created_at: string | null
          id: string
          name: string
          price: number
          rarity: Database["public"]["Enums"]["item_rarity"]
        }
        Insert: {
          case_id?: string | null
          chance: number
          created_at?: string | null
          id?: string
          name: string
          price: number
          rarity: Database["public"]["Enums"]["item_rarity"]
        }
        Update: {
          case_id?: string | null
          chance?: number
          created_at?: string | null
          id?: string
          name?: string
          price?: number
          rarity?: Database["public"]["Enums"]["item_rarity"]
        }
        Relationships: [
          {
            foreignKeyName: "case_items_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "case_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_items_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_openings: {
        Row: {
          case_id: string | null
          created_at: string | null
          id: string
          item_id: string | null
          total_cost: number
          user_id: string | null
        }
        Insert: {
          case_id?: string | null
          created_at?: string | null
          id?: string
          item_id?: string | null
          total_cost: number
          user_id?: string | null
        }
        Update: {
          case_id?: string | null
          created_at?: string | null
          id?: string
          item_id?: string | null
          total_cost?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_openings_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "case_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_openings_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_openings_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "case_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_openings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_openings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          created_at: string | null
          game_id: string | null
          gradient: string | null
          icon: string | null
          id: string
          image: string | null
          is_active: boolean | null
          name: string
          price: number
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          game_id?: string | null
          gradient?: string | null
          icon?: string | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          name: string
          price: number
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          game_id?: string | null
          gradient?: string | null
          icon?: string | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          name?: string
          price?: number
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cases_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          is_active: boolean | null
          name: string
          parent_id: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      games: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      media_files: {
        Row: {
          created_at: string | null
          file_size: number | null
          file_type: string
          filename: string
          id: string
          uploaded_by: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          file_size?: number | null
          file_type: string
          filename: string
          id?: string
          uploaded_by?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          file_size?: number | null
          file_type?: string
          filename?: string
          id?: string
          uploaded_by?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "media_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "media_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "user_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          account_data: Json | null
          created_at: string | null
          id: string
          payment_method: string | null
          product_id: string | null
          quantity: number | null
          replacement_reason: string | null
          replacement_requested: boolean | null
          status: string | null
          total_amount: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          account_data?: Json | null
          created_at?: string | null
          id?: string
          payment_method?: string | null
          product_id?: string | null
          quantity?: number | null
          replacement_reason?: string | null
          replacement_requested?: boolean | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          account_data?: Json | null
          created_at?: string | null
          id?: string
          payment_method?: string | null
          product_id?: string | null
          quantity?: number | null
          replacement_reason?: string | null
          replacement_requested?: boolean | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          discount_price: number | null
          game_id: string | null
          id: string
          images: string[] | null
          is_available: boolean | null
          is_featured: boolean | null
          metadata: Json | null
          name: string
          price: number
          sort_order: number | null
          stock_quantity: number | null
          tags: string[] | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          discount_price?: number | null
          game_id?: string | null
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          is_featured?: boolean | null
          metadata?: Json | null
          name: string
          price: number
          sort_order?: number | null
          stock_quantity?: number | null
          tags?: string[] | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          discount_price?: number | null
          game_id?: string | null
          id?: string
          images?: string[] | null
          is_available?: boolean | null
          is_featured?: boolean | null
          metadata?: Json | null
          name?: string
          price?: number
          sort_order?: number | null
          stock_quantity?: number | null
          tags?: string[] | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          balance: number | null
          cases_opened: number | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          status: string | null
          telegram_id: number | null
          total_deposited: number | null
          total_spent: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          balance?: number | null
          cases_opened?: number | null
          created_at?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: string | null
          telegram_id?: number | null
          total_deposited?: number | null
          total_spent?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          balance?: number | null
          cases_opened?: number | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          status?: string | null
          telegram_id?: number | null
          total_deposited?: number | null
          total_spent?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          value: string | null
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          value?: string | null
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          value?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      user_inventory: {
        Row: {
          id: string
          telegram_id: number
          item_name: string
          item_price: number
          item_rarity: string
          item_type: string | null
          case_id: string | null
          case_name: string | null
          item_image: string | null
          item_image_url: string | null
          status: string
          obtained_at: string
          sold_at: string | null
          withdrawn_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          telegram_id: number
          item_name: string
          item_price: number
          item_rarity: string
          item_type?: string | null
          case_id?: string | null
          case_name?: string | null
          item_image?: string | null
          item_image_url?: string | null
          status?: string
          obtained_at?: string
          sold_at?: string | null
          withdrawn_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          telegram_id?: number
          item_name?: string
          item_price?: number
          item_rarity?: string
          item_type?: string | null
          case_id?: string | null
          case_name?: string | null
          item_image?: string | null
          item_image_url?: string | null
          status?: string
          obtained_at?: string
          sold_at?: string | null
          withdrawn_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_inventory_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          }
        ]
      }
      global_case_counter: {
        Row: {
          id: number
          counter_name: string
          total_cases_opened: number
          last_reset_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          counter_name?: string
          total_cases_opened?: number
          last_reset_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          counter_name?: string
          total_cases_opened?: number
          last_reset_at?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      case_stats: {
        Row: {
          id: string | null
          name: string | null
          price: number | null
          total_openings: number | null
          total_revenue: number | null
          unique_users: number | null
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          balance: number | null
          cases_opened: number | null
          created_at: string | null
          id: string | null
          orders_total: number | null
          status: string | null
          total_deposited: number | null
          total_orders: number | null
          total_spent: number | null
          username: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_admin_action: {
        Args: {
          p_action: string
          p_target_type: string
          p_target_id?: string
          p_details?: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      item_rarity: "common" | "rare" | "epic" | "legendary"
      user_role: "user" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      item_rarity: ["common", "rare", "epic", "legendary"],
      user_role: ["user", "admin"],
    },
  },
} as const
