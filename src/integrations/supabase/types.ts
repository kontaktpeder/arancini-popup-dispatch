export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cms_pages: {
        Row: {
          content: Json
          id: string
          slug: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: Json
          id?: string
          slug: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: Json
          id?: string
          slug?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      finance_books: {
        Row: {
          created_at: string
          created_by: string
          currency: string
          id: string
          name: string
          owner_id: string | null
          owner_type: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          currency?: string
          id?: string
          name: string
          owner_id?: string | null
          owner_type?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          currency?: string
          id?: string
          name?: string
          owner_id?: string | null
          owner_type?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      finance_entries: {
        Row: {
          attachment_name: string | null
          attachment_url: string | null
          book_id: string
          category: string | null
          counterparty: string | null
          created_at: string
          created_by: string
          date_incurred: string
          date_paid: string | null
          description: string
          entry_type: string
          fee_amount: number | null
          gross_amount: number
          id: string
          internal_only: boolean
          invoice_status: string
          net_amount: number
          notes: string | null
          paid_amount: number | null
          payment_status: string
          pre_company_expense: boolean
          quantity: number | null
          sort_order: number | null
          source_type: string
          status: string
          subcategory: string | null
          unit_amount: number | null
          updated_at: string
          vat_amount: number | null
          vat_rate: number | null
          voucher_number: string | null
        }
        Insert: {
          attachment_name?: string | null
          attachment_url?: string | null
          book_id: string
          category?: string | null
          counterparty?: string | null
          created_at?: string
          created_by: string
          date_incurred?: string
          date_paid?: string | null
          description?: string
          entry_type: string
          fee_amount?: number | null
          gross_amount?: number
          id?: string
          internal_only?: boolean
          invoice_status?: string
          net_amount?: number
          notes?: string | null
          paid_amount?: number | null
          payment_status?: string
          pre_company_expense?: boolean
          quantity?: number | null
          sort_order?: number | null
          source_type?: string
          status?: string
          subcategory?: string | null
          unit_amount?: number | null
          updated_at?: string
          vat_amount?: number | null
          vat_rate?: number | null
          voucher_number?: string | null
        }
        Update: {
          attachment_name?: string | null
          attachment_url?: string | null
          book_id?: string
          category?: string | null
          counterparty?: string | null
          created_at?: string
          created_by?: string
          date_incurred?: string
          date_paid?: string | null
          description?: string
          entry_type?: string
          fee_amount?: number | null
          gross_amount?: number
          id?: string
          internal_only?: boolean
          invoice_status?: string
          net_amount?: number
          notes?: string | null
          paid_amount?: number | null
          payment_status?: string
          pre_company_expense?: boolean
          quantity?: number | null
          sort_order?: number | null
          source_type?: string
          status?: string
          subcategory?: string | null
          unit_amount?: number | null
          updated_at?: string
          vat_amount?: number | null
          vat_rate?: number | null
          voucher_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_entries_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "finance_books"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_receipt_drafts: {
        Row: {
          ai_suggestion: Json | null
          book_id: string
          converted_entry_id: string | null
          created_at: string
          error: string | null
          extracted_text: string | null
          file_name: string | null
          file_path: string | null
          file_url: string | null
          id: string
          mime_type: string | null
          status: string
          updated_at: string
          uploaded_by: string
        }
        Insert: {
          ai_suggestion?: Json | null
          book_id: string
          converted_entry_id?: string | null
          created_at?: string
          error?: string | null
          extracted_text?: string | null
          file_name?: string | null
          file_path?: string | null
          file_url?: string | null
          id?: string
          mime_type?: string | null
          status?: string
          updated_at?: string
          uploaded_by: string
        }
        Update: {
          ai_suggestion?: Json | null
          book_id?: string
          converted_entry_id?: string | null
          created_at?: string
          error?: string | null
          extracted_text?: string | null
          file_name?: string | null
          file_path?: string | null
          file_url?: string | null
          id?: string
          mime_type?: string | null
          status?: string
          updated_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "finance_receipt_drafts_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "finance_books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_receipt_drafts_converted_entry_id_fkey"
            columns: ["converted_entry_id"]
            isOneToOne: false
            referencedRelation: "finance_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          lang: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          lang?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          lang?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
