// Типы для базы данных Vaultory
export interface Database {
  public: {
    Tables: {
      user_case_stats: {
        Row: {
          id: number;
          user_id: number; // BIGINT в базе, но number в TypeScript
          case_id: string;
          opened_count: number;
          last_opened_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: number; // BIGINT в базе, но number в TypeScript
          case_id: string;
          opened_count?: number;
          last_opened_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: number; // BIGINT в базе, но number в TypeScript
          case_id?: string;
          opened_count?: number;
          last_opened_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_case_stats_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["telegram_id"];
          },
          {
            foreignKeyName: "user_case_stats_case_id_fkey";
            columns: ["case_id"];
            isOneToOne: false;
            referencedRelation: "cases";
            referencedColumns: ["id"];
          }
        ];
      };
      user_statistics: {
        Row: {
          id: string;
          telegram_id: number; // BIGINT в базе, но number в TypeScript
          total_orders: number;
          total_spent: number;
          cases_opened: number;
          items_sold: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          telegram_id: number;
          total_orders?: number;
          total_spent?: number;
          cases_opened?: number;
          items_sold?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          telegram_id?: number;
          total_orders?: number;
          total_spent?: number;
          cases_opened?: number;
          items_sold?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_statistics_telegram_id_fkey";
            columns: ["telegram_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["telegram_id"];
          }
        ];
      };
      // Другие существующие таблицы...
      cases: {
        Row: {
          id: string; // Изменено с number на string
          name: string;
          image?: string;
          // другие поля...
        };
        Insert: {
          id?: string; // Изменено с number на string
          name: string;
          image?: string;
          // другие поля...
        };
        Update: {
          id?: string; // Изменено с number на string
          name?: string;
          image?: string;
          // другие поля...
        };
        Relationships: [];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}
