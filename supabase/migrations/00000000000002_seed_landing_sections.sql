-- Seed default landing page sections
-- Run this in Supabase SQL Editor AFTER the initial schema migration

INSERT INTO public.landing_sections (section_id, title, subtitle, content, is_active, display_order)
VALUES
  ('hero',         'اكتشف منتجنا المميز',      'جودة عالية بسعر لا يُضاهى. اطلب الآن والتوصيل عبر كامل الوطن.', NULL, true, 1),
  ('product',      'المنتج',                    NULL, NULL, true, 2),
  ('benefits',     'لماذا تختار منتجنا؟',       NULL, NULL, true, 3),
  ('offers',       'عروض حصرية',               'اختر العرض المناسب لك', NULL, true, 4),
  ('testimonials', 'آراء عملائنا',              NULL, NULL, true, 5),
  ('faq',          'الأسئلة الشائعة',           NULL, NULL, true, 6),
  ('delivery',     'معلومات التوصيل',           'نوصل لجميع ولايات الجزائر', NULL, true, 7),
  ('order',        'اطلب الآن',                'أكمل طلبك في ثوانٍ', NULL, true, 8)
ON CONFLICT (section_id) DO NOTHING;

-- Seed default site settings (one row)
INSERT INTO public.site_settings (
  company_name, currency, primary_color, secondary_color, accent_color,
  background_color, text_color, button_color, button_text_color,
  seo_title, seo_description
)
VALUES (
  'TopMarkah', 'DA', '#0f172a', '#3b82f6', '#10b981',
  '#ffffff', '#1e293b', '#3b82f6', '#ffffff',
  'TopMarkah - منتجات عالية الجودة',
  'اكتشف منتجاتنا المميزة. توصيل لجميع ولايات الجزائر. دفع عند الاستلام.'
)
ON CONFLICT DO NOTHING;
