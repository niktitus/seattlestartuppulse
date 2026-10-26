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
      checkins: {
        Row: {
          commitment_id: string | null
          created_at: string
          handled_at: string | null
          id: string
          match_id: string | null
          note: string | null
          person_id: string
          responded_at: string | null
          response: string | null
          sent_at: string | null
          stage: string
          token: string | null
        }
        Insert: {
          commitment_id?: string | null
          created_at?: string
          handled_at?: string | null
          id?: string
          match_id?: string | null
          note?: string | null
          person_id: string
          responded_at?: string | null
          response?: string | null
          sent_at?: string | null
          stage: string
          token?: string | null
        }
        Update: {
          commitment_id?: string | null
          created_at?: string
          handled_at?: string | null
          id?: string
          match_id?: string | null
          note?: string | null
          person_id?: string
          responded_at?: string | null
          response?: string | null
          sent_at?: string | null
          stage?: string
          token?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checkins_commitment_id_fkey"
            columns: ["commitment_id"]
            isOneToOne: false
            referencedRelation: "commitments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checkins_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checkins_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      commitments: {
        Row: {
          availability: string[] | null
          coffee_count: number | null
          created_at: string
          id: string
          linked_commitment_id: string | null
          neighborhood: string | null
          other_email: string | null
          other_name: string | null
          person_id: string
          source: string
          tags: string[]
          type: string
        }
        Insert: {
          availability?: string[] | null
          coffee_count?: number | null
          created_at?: string
          id?: string
          linked_commitment_id?: string | null
          neighborhood?: string | null
          other_email?: string | null
          other_name?: string | null
          person_id: string
          source?: string
          tags?: string[]
          type: string
        }
        Update: {
          availability?: string[] | null
          coffee_count?: number | null
          created_at?: string
          id?: string
          linked_commitment_id?: string | null
          neighborhood?: string | null
          other_email?: string | null
          other_name?: string | null
          person_id?: string
          source?: string
          tags?: string[]
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "commitments_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      cron_auth: {
        Row: {
          created_at: string
          id: string
          token: string
        }
        Insert: {
          created_at?: string
          id: string
          token?: string
        }
        Update: {
          created_at?: string
          id?: string
          token?: string
        }
        Relationships: []
      }
      deadline_sources: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          last_scraped_at: string | null
          name: string
          platform: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_scraped_at?: string | null
          name: string
          platform?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_scraped_at?: string | null
          name?: string
          platform?: string
          url?: string
        }
        Relationships: []
      }
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
      digest_send_log: {
        Row: {
          errors: Json | null
          id: string
          sent_at: string
          total_sent: number
          total_subscribers: number
          triggered_by: string | null
        }
        Insert: {
          errors?: Json | null
          id?: string
          sent_at?: string
          total_sent?: number
          total_subscribers?: number
          triggered_by?: string | null
        }
        Update: {
          errors?: Json | null
          id?: string
          sent_at?: string
          total_sent?: number
          total_subscribers?: number
          triggered_by?: string | null
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
      event_feedback: {
        Row: {
          attend_again: boolean
          contact_email: string | null
          contact_first_name: string | null
          contact_last_name: string | null
          created_at: string
          id: string
          interested_banking: boolean
          interested_sponsors: string[]
          most_valuable_part: string
          rating: number
          role: string
          wish_more: string | null
        }
        Insert: {
          attend_again: boolean
          contact_email?: string | null
          contact_first_name?: string | null
          contact_last_name?: string | null
          created_at?: string
          id?: string
          interested_banking?: boolean
          interested_sponsors?: string[]
          most_valuable_part: string
          rating: number
          role?: string
          wish_more?: string | null
        }
        Update: {
          attend_again?: boolean
          contact_email?: string | null
          contact_first_name?: string | null
          contact_last_name?: string | null
          created_at?: string
          id?: string
          interested_banking?: boolean
          interested_sponsors?: string[]
          most_valuable_part?: string
          rating?: number
          role?: string
          wish_more?: string | null
        }
        Relationships: []
      }
      event_sources: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          last_scraped_at: string | null
          name: string
          platform: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_scraped_at?: string | null
          name: string
          platform?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_scraped_at?: string | null
          name?: string
          platform?: string
          url?: string
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
      interests: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          person_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          person_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          person_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interests_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interests_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
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
      match_members: {
        Row: {
          commitment_id: string | null
          id: string
          match_id: string
          person_id: string
        }
        Insert: {
          commitment_id?: string | null
          id?: string
          match_id: string
          person_id: string
        }
        Update: {
          commitment_id?: string | null
          id?: string
          match_id?: string
          person_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_members_commitment_id_fkey"
            columns: ["commitment_id"]
            isOneToOne: false
            referencedRelation: "commitments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_members_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_members_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          approved_at: string | null
          created_at: string
          id: string
          kind: string
          other_name: string | null
          reason: string | null
          shared_tags: string[]
          status: string
        }
        Insert: {
          approved_at?: string | null
          created_at?: string
          id?: string
          kind?: string
          other_name?: string | null
          reason?: string | null
          shared_tags?: string[]
          status?: string
        }
        Update: {
          approved_at?: string | null
          created_at?: string
          id?: string
          kind?: string
          other_name?: string | null
          reason?: string | null
          shared_tags?: string[]
          status?: string
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
      organizations: {
        Row: {
          action_today: string
          contact_info: string | null
          contact_name: string | null
          contact_public: boolean
          contact_role: string | null
          created_at: string
          id: string
          logo_url: string | null
          name: string
          office_hours: string | null
          slug: string
          status: string
          tags: string[]
          themes: string[]
          url: string
          who_they_help: string
        }
        Insert: {
          action_today: string
          contact_info?: string | null
          contact_name?: string | null
          contact_public?: boolean
          contact_role?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          office_hours?: string | null
          slug: string
          status?: string
          tags?: string[]
          themes?: string[]
          url: string
          who_they_help: string
        }
        Update: {
          action_today?: string
          contact_info?: string | null
          contact_name?: string | null
          contact_public?: boolean
          contact_role?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          office_hours?: string | null
          slug?: string
          status?: string
          tags?: string[]
          themes?: string[]
          url?: string
          who_they_help?: string
        }
        Relationships: []
      }
      outbox: {
        Row: {
          body: string
          checkin_id: string | null
          created_at: string
          error: string | null
          id: string
          kind: string
          match_id: string | null
          person_id: string | null
          sent_at: string | null
          status: string
          subject: string
          to_email: string
        }
        Insert: {
          body: string
          checkin_id?: string | null
          created_at?: string
          error?: string | null
          id?: string
          kind: string
          match_id?: string | null
          person_id?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          to_email: string
        }
        Update: {
          body?: string
          checkin_id?: string | null
          created_at?: string
          error?: string | null
          id?: string
          kind?: string
          match_id?: string | null
          person_id?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          to_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "outbox_checkin_id_fkey"
            columns: ["checkin_id"]
            isOneToOne: false
            referencedRelation: "checkins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outbox_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outbox_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          badge_tags: string[] | null
          company: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          is_mentor: boolean
          linkedin_url: string | null
          mentor_status: string
          offer_tags: string[] | null
          opt_in_partner_share: boolean
          role: string | null
          short_id: string | null
          show_badge_card: boolean
          stage: string | null
        }
        Insert: {
          badge_tags?: string[] | null
          company?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          is_mentor?: boolean
          linkedin_url?: string | null
          mentor_status?: string
          offer_tags?: string[] | null
          opt_in_partner_share?: boolean
          role?: string | null
          short_id?: string | null
          show_badge_card?: boolean
          stage?: string | null
        }
        Update: {
          badge_tags?: string[] | null
          company?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_mentor?: boolean
          linkedin_url?: string | null
          mentor_status?: string
          offer_tags?: string[] | null
          opt_in_partner_share?: boolean
          role?: string | null
          short_id?: string | null
          show_badge_card?: boolean
          stage?: string | null
        }
        Relationships: []
      }
      resource_links: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          is_approved: boolean | null
          name: string
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_approved?: boolean | null
          name: string
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_approved?: boolean | null
          name?: string
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      sponsorship_waitlist: {
        Row: {
          audience_type: string
          created_at: string
          email: string
          id: string
          name: string
          organization: string | null
        }
        Insert: {
          audience_type: string
          created_at?: string
          email: string
          id?: string
          name: string
          organization?: string | null
        }
        Update: {
          audience_type?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          organization?: string | null
        }
        Relationships: []
      }
      startup_directory: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_approved: boolean | null
          name: string
          purpose: string
          updated_at: string
          website: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_approved?: boolean | null
          name: string
          purpose?: string
          updated_at?: string
          website: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_approved?: boolean | null
          name?: string
          purpose?: string
          updated_at?: string
          website?: string
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
      void_ai_state: {
        Row: {
          http_status: number | null
          id: string
          message: string | null
          paused: boolean
        }
        Insert: {
          http_status?: number | null
          id?: string
          message?: string | null
          paused?: boolean
        }
        Update: {
          http_status?: number | null
          id?: string
          message?: string | null
          paused?: boolean
        }
        Relationships: []
      }
      void_shouts: {
        Row: {
          arena: string | null
          city: string | null
          created_on: string
          id: string
          loudness: number
          needs_review: boolean
          quote_ok: boolean
          role: string | null
          seattle_tenure: string | null
          status: string
          text: string
          themes: string[]
        }
        Insert: {
          arena?: string | null
          city?: string | null
          created_on?: string
          id?: string
          loudness: number
          needs_review?: boolean
          quote_ok?: boolean
          role?: string | null
          seattle_tenure?: string | null
          status?: string
          text: string
          themes?: string[]
        }
        Update: {
          arena?: string | null
          city?: string | null
          created_on?: string
          id?: string
          loudness?: number
          needs_review?: boolean
          quote_ok?: boolean
          role?: string | null
          seattle_tenure?: string | null
          status?: string
          text?: string
          themes?: string[]
        }
        Relationships: []
      }
      vouchers: {
        Row: {
          code: string
          created_at: string
          id: string
          match_id: string | null
          person_id: string | null
          redeemed: boolean
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          match_id?: string | null
          person_id?: string | null
          redeemed?: boolean
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          match_id?: string | null
          person_id?: string | null
          redeemed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "vouchers_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vouchers_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      vouches: {
        Row: {
          confirmed_at: string | null
          created_at: string
          id: string
          mentor_id: string
          token: string
          voucher_contact: string
          voucher_name: string
        }
        Insert: {
          confirmed_at?: string | null
          created_at?: string
          id?: string
          mentor_id: string
          token: string
          voucher_contact: string
          voucher_name: string
        }
        Update: {
          confirmed_at?: string | null
          created_at?: string
          id?: string
          mentor_id?: string
          token?: string
          voucher_contact?: string
          voucher_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vouches_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      void_theme_counts: {
        Row: {
          count: number | null
          month: string | null
          theme: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_badge_card: {
        Args: { p_short_id: string }
        Returns: {
          badge_tags: string[]
          first_name: string
          is_mentor: boolean
          linkedin_url: string
          stage: string
        }[]
      }
      get_safe_void_counts: {
        Args: never
        Returns: {
          count: number
          month: string
          theme: string
        }[]
      }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
