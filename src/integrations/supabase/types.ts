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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      deadlines: {
        Row: {
          created_at: string
          days_left: number
          description: string
          due_date: string
          id: string
          is_approved: boolean | null
          title: string
          type: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          days_left?: number
          description: string
          due_date: string
          id?: string
          is_approved?: boolean | null
          title: string
          type?: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          days_left?: number
          description?: string
          due_date?: string
          id?: string
          is_approved?: boolean | null
          title?: string
          type?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      digest_subscribers: {
        Row: {
          confirmed_at: string | null
          created_at: string
          email: string
          id: string
          is_confirmed: boolean
          role: Database["public"]["Enums"]["subscriber_role"]
          source_tab: string | null
          source_type: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          confirmed_at?: string | null
          created_at?: string
          email: string
          id?: string
          is_confirmed?: boolean
          role: Database["public"]["Enums"]["subscriber_role"]
          source_tab?: string | null
          source_type?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          confirmed_at?: string | null
          created_at?: string
          email?: string
          id?: string
          is_confirmed?: boolean
          role?: Database["public"]["Enums"]["subscriber_role"]
          source_tab?: string | null
          source_type?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      early_access_signups: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          linkedin: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          linkedin?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          linkedin?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          audience: string[] | null
          city: string | null
          cost: string | null
          created_at: string
          date: string
          description: string
          expected_size: string | null
          featured: boolean | null
          format: string
          host_type: string | null
          id: string
          is_approved: boolean | null
          is_high_signal: boolean | null
          organizer: string
          outcome_framing: string | null
          registration_deadline: string | null
          spots_available: number | null
          stage: string[] | null
          time: string
          title: string
          type: string
          url: string
        }
        Insert: {
          audience?: string[] | null
          city?: string | null
          cost?: string | null
          created_at?: string
          date: string
          description: string
          expected_size?: string | null
          featured?: boolean | null
          format?: string
          host_type?: string | null
          id?: string
          is_approved?: boolean | null
          is_high_signal?: boolean | null
          organizer: string
          outcome_framing?: string | null
          registration_deadline?: string | null
          spots_available?: number | null
          stage?: string[] | null
          time: string
          title: string
          type?: string
          url: string
        }
        Update: {
          audience?: string[] | null
          city?: string | null
          cost?: string | null
          created_at?: string
          date?: string
          description?: string
          expected_size?: string | null
          featured?: boolean | null
          format?: string
          host_type?: string | null
          id?: string
          is_approved?: boolean | null
          is_high_signal?: boolean | null
          organizer?: string
          outcome_framing?: string | null
          registration_deadline?: string | null
          spots_available?: number | null
          stage?: string[] | null
          time?: string
          title?: string
          type?: string
          url?: string
        }
        Relationships: []
      }
      job_submissions: {
        Row: {
          admin_notes: string | null
          application_url: string
          company_address: string | null
          company_name: string
          company_url: string | null
          created_at: string
          department: string
          description: string | null
          equity_max: number | null
          equity_min: number | null
          founder_linkedin: string | null
          founder_name: string | null
          funding_stage: string
          id: string
          job_title: string
          reviewed_at: string | null
          salary_max: number | null
          salary_min: number | null
          salary_type: string
          status: string | null
          submitter_email: string
          submitter_name: string | null
          work_model: string
        }
        Insert: {
          admin_notes?: string | null
          application_url: string
          company_address?: string | null
          company_name: string
          company_url?: string | null
          created_at?: string
          department?: string
          description?: string | null
          equity_max?: number | null
          equity_min?: number | null
          founder_linkedin?: string | null
          founder_name?: string | null
          funding_stage?: string
          id?: string
          job_title: string
          reviewed_at?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_type?: string
          status?: string | null
          submitter_email: string
          submitter_name?: string | null
          work_model?: string
        }
        Update: {
          admin_notes?: string | null
          application_url?: string
          company_address?: string | null
          company_name?: string
          company_url?: string | null
          created_at?: string
          department?: string
          description?: string | null
          equity_max?: number | null
          equity_min?: number | null
          founder_linkedin?: string | null
          founder_name?: string | null
          funding_stage?: string
          id?: string
          job_title?: string
          reviewed_at?: string | null
          salary_max?: number | null
          salary_min?: number | null
          salary_type?: string
          status?: string | null
          submitter_email?: string
          submitter_name?: string | null
          work_model?: string
        }
        Relationships: []
      }
      learning_resources: {
        Row: {
          course_name: string
          course_url: string
          created_at: string
          description: string | null
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          format: Database["public"]["Enums"]["learning_format"]
          has_certification: boolean | null
          id: string
          instructor_linkedin: string | null
          instructor_name: string
          is_approved: boolean | null
          is_founder_recommended: boolean | null
          is_free: boolean | null
          price_amount: number | null
          price_type: Database["public"]["Enums"]["price_type"]
          skill_category: Database["public"]["Enums"]["skill_category"]
          time_commitment: string | null
          time_to_roi: Database["public"]["Enums"]["time_to_roi"]
          updated_at: string
        }
        Insert: {
          course_name: string
          course_url: string
          created_at?: string
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          format?: Database["public"]["Enums"]["learning_format"]
          has_certification?: boolean | null
          id?: string
          instructor_linkedin?: string | null
          instructor_name: string
          is_approved?: boolean | null
          is_founder_recommended?: boolean | null
          is_free?: boolean | null
          price_amount?: number | null
          price_type?: Database["public"]["Enums"]["price_type"]
          skill_category?: Database["public"]["Enums"]["skill_category"]
          time_commitment?: string | null
          time_to_roi?: Database["public"]["Enums"]["time_to_roi"]
          updated_at?: string
        }
        Update: {
          course_name?: string
          course_url?: string
          created_at?: string
          description?: string | null
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          format?: Database["public"]["Enums"]["learning_format"]
          has_certification?: boolean | null
          id?: string
          instructor_linkedin?: string | null
          instructor_name?: string
          is_approved?: boolean | null
          is_founder_recommended?: boolean | null
          is_free?: boolean | null
          price_amount?: number | null
          price_type?: Database["public"]["Enums"]["price_type"]
          skill_category?: Database["public"]["Enums"]["skill_category"]
          time_commitment?: string | null
          time_to_roi?: Database["public"]["Enums"]["time_to_roi"]
          updated_at?: string
        }
        Relationships: []
      }
      learning_submissions: {
        Row: {
          admin_notes: string | null
          course_name: string
          course_url: string
          created_at: string
          description: string | null
          difficulty: string
          format: string
          has_certification: boolean | null
          id: string
          instructor_linkedin: string | null
          instructor_name: string
          price_amount: number | null
          price_type: string
          reviewed_at: string | null
          skill_category: string
          status: string | null
          submitter_email: string
          submitter_name: string | null
          time_commitment: string | null
          time_to_roi: string
        }
        Insert: {
          admin_notes?: string | null
          course_name: string
          course_url: string
          created_at?: string
          description?: string | null
          difficulty?: string
          format?: string
          has_certification?: boolean | null
          id?: string
          instructor_linkedin?: string | null
          instructor_name: string
          price_amount?: number | null
          price_type?: string
          reviewed_at?: string | null
          skill_category?: string
          status?: string | null
          submitter_email: string
          submitter_name?: string | null
          time_commitment?: string | null
          time_to_roi?: string
        }
        Update: {
          admin_notes?: string | null
          course_name?: string
          course_url?: string
          created_at?: string
          description?: string | null
          difficulty?: string
          format?: string
          has_certification?: boolean | null
          id?: string
          instructor_linkedin?: string | null
          instructor_name?: string
          price_amount?: number | null
          price_type?: string
          reviewed_at?: string | null
          skill_category?: string
          status?: string | null
          submitter_email?: string
          submitter_name?: string | null
          time_commitment?: string | null
          time_to_roi?: string
        }
        Relationships: []
      }
      news: {
        Row: {
          category: string
          created_at: string
          date: string
          id: string
          is_approved: boolean | null
          source: string
          summary: string
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          category?: string
          created_at?: string
          date: string
          id?: string
          is_approved?: boolean | null
          source: string
          summary: string
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          date?: string
          id?: string
          is_approved?: boolean | null
          source?: string
          summary?: string
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      startup_jobs: {
        Row: {
          application_url: string
          company_address: string | null
          company_name: string
          company_url: string | null
          created_at: string
          department: Database["public"]["Enums"]["department"]
          description: string | null
          equity_max: number | null
          equity_min: number | null
          expires_at: string
          founder_linkedin: string | null
          founder_name: string | null
          funding_stage: Database["public"]["Enums"]["funding_stage"]
          id: string
          is_approved: boolean | null
          is_expired: boolean | null
          job_title: string
          renewal_count: number | null
          salary_max: number | null
          salary_min: number | null
          salary_type: Database["public"]["Enums"]["salary_type"]
          updated_at: string
          work_model: Database["public"]["Enums"]["work_model"]
        }
        Insert: {
          application_url: string
          company_address?: string | null
          company_name: string
          company_url?: string | null
          created_at?: string
          department?: Database["public"]["Enums"]["department"]
          description?: string | null
          equity_max?: number | null
          equity_min?: number | null
          expires_at?: string
          founder_linkedin?: string | null
          founder_name?: string | null
          funding_stage?: Database["public"]["Enums"]["funding_stage"]
          id?: string
          is_approved?: boolean | null
          is_expired?: boolean | null
          job_title: string
          renewal_count?: number | null
          salary_max?: number | null
          salary_min?: number | null
          salary_type?: Database["public"]["Enums"]["salary_type"]
          updated_at?: string
          work_model?: Database["public"]["Enums"]["work_model"]
        }
        Update: {
          application_url?: string
          company_address?: string | null
          company_name?: string
          company_url?: string | null
          created_at?: string
          department?: Database["public"]["Enums"]["department"]
          description?: string | null
          equity_max?: number | null
          equity_min?: number | null
          expires_at?: string
          founder_linkedin?: string | null
          founder_name?: string | null
          funding_stage?: Database["public"]["Enums"]["funding_stage"]
          id?: string
          is_approved?: boolean | null
          is_expired?: boolean | null
          job_title?: string
          renewal_count?: number | null
          salary_max?: number | null
          salary_min?: number | null
          salary_type?: Database["public"]["Enums"]["salary_type"]
          updated_at?: string
          work_model?: Database["public"]["Enums"]["work_model"]
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
      department:
        | "Engineering"
        | "Product"
        | "Sales"
        | "Marketing"
        | "Operations"
        | "Design"
        | "Data"
        | "Finance"
        | "Legal"
        | "General Management"
      difficulty_level: "Intermediate" | "Advanced" | "Expert"
      funding_stage:
        | "Pre-seed"
        | "Seed"
        | "Series A"
        | "Series B"
        | "Series C+"
        | "Bootstrapped"
      learning_format:
        | "Self-paced"
        | "Live cohort"
        | "Workshop"
        | "Bootcamp"
        | "Certification program"
      price_type: "Free" | "Paid" | "Price on website"
      salary_type: "Range" | "Equity-heavy" | "Competitive" | "TBD"
      skill_category:
        | "Fundraising"
        | "Product"
        | "Sales"
        | "Operations"
        | "Leadership"
        | "Technical"
        | "Marketing"
        | "Legal/Compliance"
      subscriber_role:
        | "Founder"
        | "Operator"
        | "Investor"
        | "Service Provider"
        | "Accelerator/Incubator"
        | "Ecosystem Builder"
        | "Other"
      time_to_roi: "Apply immediately" | "Long-term skill building"
      work_model: "Remote" | "Hybrid" | "In-office" | "Remote-first"
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
    Enums: {
      department: [
        "Engineering",
        "Product",
        "Sales",
        "Marketing",
        "Operations",
        "Design",
        "Data",
        "Finance",
        "Legal",
        "General Management",
      ],
      difficulty_level: ["Intermediate", "Advanced", "Expert"],
      funding_stage: [
        "Pre-seed",
        "Seed",
        "Series A",
        "Series B",
        "Series C+",
        "Bootstrapped",
      ],
      learning_format: [
        "Self-paced",
        "Live cohort",
        "Workshop",
        "Bootcamp",
        "Certification program",
      ],
      price_type: ["Free", "Paid", "Price on website"],
      salary_type: ["Range", "Equity-heavy", "Competitive", "TBD"],
      skill_category: [
        "Fundraising",
        "Product",
        "Sales",
        "Operations",
        "Leadership",
        "Technical",
        "Marketing",
        "Legal/Compliance",
      ],
      subscriber_role: [
        "Founder",
        "Operator",
        "Investor",
        "Service Provider",
        "Accelerator/Incubator",
        "Ecosystem Builder",
        "Other",
      ],
      time_to_roi: ["Apply immediately", "Long-term skill building"],
      work_model: ["Remote", "Hybrid", "In-office", "Remote-first"],
    },
  },
} as const
