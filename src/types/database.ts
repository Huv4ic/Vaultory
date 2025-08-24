// Типы для базы данных Vaultory
export interface Database {
  public: {
    Tables: {
      user_case_stats: {
        Row: {
          id: number;
          user_id: number;
          case_id: number;
          opened_count: number;
          last_opened_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: number;
          case_id: number;
          opened_count?: number;
          last_opened_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: number;
          case_id?: number;
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
      // Другие существующие таблицы...
      cases: {
        Row: {
          id: number;
          name: string;
          image?: string;
          // другие поля...
        };
        Insert: {
          id?: number;
          name: string;
          image?: string;
          // другие поля...
        };
        Update: {
          id?: number;
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
