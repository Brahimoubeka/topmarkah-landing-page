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
      products: {
        Row: {
          id: string
          name: string
          slug: string
          short_description: string | null
          description: string | null
          benefits: string | null
          specifications: string | null
          usage_instructions: string | null
          price: number
          old_price: number | null
          is_active: boolean
          is_featured: boolean
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          short_description?: string | null
          description?: string | null
          benefits?: string | null
          specifications?: string | null
          usage_instructions?: string | null
          price?: number
          old_price?: number | null
          is_active?: boolean
          is_featured?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          short_description?: string | null
          description?: string | null
          benefits?: string | null
          specifications?: string | null
          usage_instructions?: string | null
          price?: number
          old_price?: number | null
          is_active?: boolean
          is_featured?: boolean
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      offers: {
        Row: {
          id: string
          name: string
          short_description: string | null
          full_description: string | null
          price: number
          old_price: number | null
          discount: number | null
          quantity_included: number
          gifts: string | null
          image_url: string | null
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          short_description?: string | null
          full_description?: string | null
          price: number
          old_price?: number | null
          discount?: number | null
          quantity_included?: number
          gifts?: string | null
          image_url?: string | null
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          short_description?: string | null
          full_description?: string | null
          price?: number
          old_price?: number | null
          discount?: number | null
          quantity_included?: number
          gifts?: string | null
          image_url?: string | null
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          phone: string
          wilaya_id: string
          wilaya_name_snapshot: string | null
          offer_id: string
          offer_name_snapshot: string | null
          quantity: number
          delivery_method: string
          delivery_company_id: string
          delivery_price: number
          offer_price: number
          total_price: number
          status: string
          admin_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          phone: string
          wilaya_id: string
          wilaya_name_snapshot?: string | null
          offer_id: string
          offer_name_snapshot?: string | null
          quantity: number
          delivery_method: string
          delivery_company_id: string
          delivery_price: number
          offer_price: number
          total_price: number
          status?: string
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          phone?: string
          wilaya_id?: string
          wilaya_name_snapshot?: string | null
          offer_id?: string
          offer_name_snapshot?: string | null
          quantity?: number
          delivery_method?: string
          delivery_company_id?: string
          delivery_price?: number
          offer_price?: number
          total_price?: number
          status?: string
          admin_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      wilayas: {
        Row: {
          id: string
          code: number
          name: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      delivery_companies: {
        Row: {
          id: string
          name: string
          is_active: boolean
          is_default: boolean
          created_at: string
          updated_at: string
        }
      }
      delivery_prices: {
        Row: {
          id: string
          wilaya_id: string
          company_id: string
          home_price: number
          office_price: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      site_settings: {
        Row: {
          id: string
          company_name: string | null
          logo_url: string | null
          favicon_url: string | null
          phone: string | null
          whatsapp: string | null
          facebook: string | null
          instagram: string | null
          tiktok: string | null
          meta_pixel_id: string | null
          address: string | null
          currency: string | null
          primary_color: string | null
          secondary_color: string | null
          accent_color: string | null
          background_color: string | null
          text_color: string | null
          button_color: string | null
          button_text_color: string | null
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Update: {
          id?: string
          company_name?: string | null
          logo_url?: string | null
          favicon_url?: string | null
          phone?: string | null
          whatsapp?: string | null
          facebook?: string | null
          instagram?: string | null
          tiktok?: string | null
          meta_pixel_id?: string | null
          address?: string | null
          currency?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          accent_color?: string | null
          background_color?: string | null
          text_color?: string | null
          button_color?: string | null
          button_text_color?: string | null
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      landing_sections: {
        Row: {
          id: string
          section_id: string
          title: string | null
          subtitle: string | null
          content: string | null
          image_url: string | null
          video_url: string | null
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      place_order: {
        Args: {
          p_customer_name: string
          p_phone: string
          p_wilaya_id: string
          p_offer_id: string
          p_quantity: number
          p_delivery_method: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
