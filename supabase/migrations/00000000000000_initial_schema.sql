-- Initial Schema for TopMarkah E-commerce

-- 1. Create Admins Table (for Authorization)
CREATE TABLE public.admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Admins
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view admins" ON public.admins FOR SELECT USING (auth.uid() = id);

-- 2. Site Settings
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT DEFAULT 'TopMarkah',
    logo_url TEXT,
    favicon_url TEXT,
    phone TEXT,
    whatsapp TEXT,
    facebook TEXT,
    instagram TEXT,
    tiktok TEXT,
    address TEXT,
    currency TEXT DEFAULT 'DA',
    primary_color TEXT DEFAULT '#0f172a',
    secondary_color TEXT DEFAULT '#3b82f6',
    accent_color TEXT DEFAULT '#10b981',
    background_color TEXT DEFAULT '#ffffff',
    text_color TEXT DEFAULT '#1e293b',
    button_color TEXT DEFAULT '#3b82f6',
    button_text_color TEXT DEFAULT '#ffffff',
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid()));

-- 3. Landing Sections Configuration
CREATE TABLE public.landing_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id TEXT NOT NULL UNIQUE, -- e.g. 'hero', 'products', 'offers', 'testimonials', 'faq'
    title TEXT,
    subtitle TEXT,
    content TEXT,
    image_url TEXT,
    video_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.landing_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active landing sections" ON public.landing_sections FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage landing sections" ON public.landing_sections FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid()));

-- 4. Delivery Companies
CREATE TABLE public.delivery_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.delivery_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active delivery companies" ON public.delivery_companies FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage delivery companies" ON public.delivery_companies FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid()));

-- 5. Wilayas
CREATE TABLE public.wilayas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code INTEGER NOT NULL UNIQUE,
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.wilayas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active wilayas" ON public.wilayas FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage wilayas" ON public.wilayas FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid()));

-- 6. Delivery Prices
CREATE TABLE public.delivery_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wilaya_id UUID REFERENCES public.wilayas(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.delivery_companies(id) ON DELETE CASCADE,
    home_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    office_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (wilaya_id, company_id)
);

ALTER TABLE public.delivery_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active delivery prices" ON public.delivery_prices FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage delivery prices" ON public.delivery_prices FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid()));

-- 7. Products
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT,
    description TEXT,
    benefits TEXT,
    specifications TEXT,
    usage_instructions TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    old_price NUMERIC(10, 2),
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    seo_title TEXT,
    seo_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid()));

-- 8. Product Media
CREATE TABLE public.product_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL, -- 'image', 'video', 'audio'
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view product media for active products" ON public.product_media FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.products WHERE products.id = product_media.product_id AND products.is_active = true)
);
CREATE POLICY "Admins can manage product media" ON public.product_media FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid()));

-- 9. Offers
CREATE TABLE public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    short_description TEXT,
    full_description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    old_price NUMERIC(10, 2),
    discount NUMERIC(5, 2),
    quantity_included INTEGER NOT NULL DEFAULT 1,
    gifts TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active offers" ON public.offers FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage offers" ON public.offers FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid()));

-- 10. Testimonials
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active testimonials" ON public.testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage testimonials" ON public.testimonials FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid()));

-- 11. FAQs
CREATE TABLE public.faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view active faqs" ON public.faqs FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage faqs" ON public.faqs FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid()));

-- 12. Orders
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    wilaya_id UUID REFERENCES public.wilayas(id) ON DELETE RESTRICT,
    wilaya_name_snapshot TEXT,
    offer_id UUID REFERENCES public.offers(id) ON DELETE RESTRICT,
    offer_name_snapshot TEXT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    delivery_method TEXT NOT NULL CHECK (delivery_method IN ('home', 'office')),
    delivery_company_id UUID REFERENCES public.delivery_companies(id) ON DELETE RESTRICT,
    delivery_price NUMERIC(10, 2) NOT NULL,
    offer_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
-- Public users can only INSERT orders, and ONLY if they don't provide restricted fields or if we rely on a secure RPC.
-- Wait, we need a secure way to insert orders. Allowing public INSERT means they might bypass price checks if they can supply arbitrary prices.
-- To fix this, we will use a Supabase RPC function (Security Definer) to place orders.
-- Thus, we can completely lock down INSERT on public.orders for public users.
CREATE POLICY "Admins can manage orders" ON public.orders FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid()));

-- 13. Create Function to Place Order Securely
CREATE OR REPLACE FUNCTION public.place_order(
    p_customer_name TEXT,
    p_phone TEXT,
    p_wilaya_id UUID,
    p_offer_id UUID,
    p_quantity INTEGER,
    p_delivery_method TEXT
) RETURNS UUID AS $$
DECLARE
    v_offer RECORD;
    v_wilaya RECORD;
    v_delivery_company UUID;
    v_delivery_price NUMERIC;
    v_total NUMERIC;
    v_order_id UUID;
BEGIN
    -- 1. Validate Offer
    SELECT * INTO v_offer FROM public.offers WHERE id = p_offer_id AND is_active = true;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid or inactive offer';
    END IF;

    -- 2. Validate Wilaya
    SELECT * INTO v_wilaya FROM public.wilayas WHERE id = p_wilaya_id AND is_active = true;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid or inactive wilaya';
    END IF;

    -- 3. Get Default Delivery Company (or you can expand this to pass company explicitly)
    SELECT id INTO v_delivery_company FROM public.delivery_companies WHERE is_active = true AND is_default = true LIMIT 1;
    IF v_delivery_company IS NULL THEN
        -- fallback to any active company
        SELECT id INTO v_delivery_company FROM public.delivery_companies WHERE is_active = true LIMIT 1;
    END IF;

    -- 4. Calculate Delivery Price
    IF v_delivery_company IS NOT NULL THEN
        SELECT 
            CASE WHEN p_delivery_method = 'home' THEN home_price ELSE office_price END
        INTO v_delivery_price
        FROM public.delivery_prices 
        WHERE wilaya_id = p_wilaya_id AND company_id = v_delivery_company AND is_active = true;
    END IF;
    
    IF v_delivery_price IS NULL THEN
        -- If no explicit pricing is found, we might reject or default to 0. 
        -- Let's raise an exception to be safe.
        RAISE EXCEPTION 'Delivery not available for this wilaya and method';
    END IF;

    -- 5. Calculate Total
    v_total := (v_offer.price * p_quantity) + v_delivery_price;

    -- 6. Insert Order
    INSERT INTO public.orders (
        customer_name, phone, wilaya_id, wilaya_name_snapshot,
        offer_id, offer_name_snapshot, quantity,
        delivery_method, delivery_company_id, delivery_price,
        offer_price, total_price, status
    ) VALUES (
        p_customer_name, p_phone, p_wilaya_id, v_wilaya.name,
        p_offer_id, v_offer.name, p_quantity,
        p_delivery_method, v_delivery_company, v_delivery_price,
        v_offer.price, v_total, 'pending'
    ) RETURNING id INTO v_order_id;

    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Indexes for performance
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_orders_phone ON public.orders(phone);
CREATE INDEX idx_offers_is_active ON public.offers(is_active);
CREATE INDEX idx_products_is_active ON public.products(is_active);

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_landing_sections_updated_at BEFORE UPDATE ON public.landing_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON public.offers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create buckets (needs to be done via SQL or dashboard, typical SQL below)
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('landing', 'landing', true) ON CONFLICT DO NOTHING;

-- Storage RLS for Admin
-- To properly secure storage we would add policies on storage.objects, but typically this is done via the Supabase UI 
-- or by referencing auth.uid() in the policies. For this script, we'll give admins full access to storage.objects.
CREATE POLICY "Admins can manage storage" ON storage.objects FOR ALL USING (EXISTS (SELECT 1 FROM public.admins WHERE admins.id = auth.uid()));
CREATE POLICY "Public can view storage" ON storage.objects FOR SELECT USING (bucket_id IN ('products', 'landing'));
