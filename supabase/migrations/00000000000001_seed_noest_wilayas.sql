-- ============================================================
-- NOEST Delivery Company + All 58 Algerian Wilayas
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Insert NOEST delivery company as default
INSERT INTO public.delivery_companies (name, is_active, is_default)
VALUES ('NOEST', true, true);

-- 2. Insert all 58 Algerian wilayas
INSERT INTO public.wilayas (code, name, is_active) VALUES
(1,  'أدرار',            true),
(2,  'الشلف',            true),
(3,  'الأغواط',          true),
(4,  'أم البواقي',       true),
(5,  'باتنة',            true),
(6,  'بجاية',            true),
(7,  'بسكرة',            true),
(8,  'بشار',             true),
(9,  'البليدة',          true),
(10, 'البويرة',          true),
(11, 'تمنراست',          true),
(12, 'تبسة',             true),
(13, 'تلمسان',           true),
(14, 'تيارت',            true),
(15, 'تيزي وزو',         true),
(16, 'الجزائر',          true),
(17, 'الجلفة',           true),
(18, 'جيجل',             true),
(19, 'سطيف',             true),
(20, 'سعيدة',            true),
(21, 'سكيكدة',           true),
(22, 'سيدي بلعباس',      true),
(23, 'عنابة',            true),
(24, 'قالمة',            true),
(25, 'قسنطينة',          true),
(26, 'المدية',           true),
(27, 'مستغانم',          true),
(28, 'المسيلة',          true),
(29, 'معسكر',            true),
(30, 'ورقلة',            true),
(31, 'وهران',            true),
(32, 'البيض',            true),
(33, 'إليزي',            true),
(34, 'برج بوعريريج',     true),
(35, 'بومرداس',          true),
(36, 'الطارف',           true),
(37, 'تندوف',            true),
(38, 'تيسمسيلت',         true),
(39, 'الوادي',           true),
(40, 'خنشلة',            true),
(41, 'سوق أهراس',        true),
(42, 'تيبازة',           true),
(43, 'ميلة',             true),
(44, 'عين الدفلى',       true),
(45, 'النعامة',          true),
(46, 'عين تموشنت',       true),
(47, 'غرداية',           true),
(48, 'غليزان',           true),
(49, 'تيميمون',          true),
(50, 'برج باجي مختار',   true),
(51, 'أولاد جلال',       true),
(52, 'بني عباس',         true),
(53, 'عين صالح',         true),
(54, 'عين قزام',         true),
(55, 'توقرت',            true),
(56, 'جانت',             true),
(57, 'المغير',           true),
(58, 'المنيعة',          true);

-- ============================================================
-- (Optional) Insert default delivery prices for all wilayas
-- Replace the home/office prices with your actual rates.
-- This block sets all wilayas to 600 DA home / 400 DA office
-- as a starting point. You can adjust in the admin dashboard.
-- ============================================================
INSERT INTO public.delivery_prices (wilaya_id, company_id, home_price, office_price, is_active)
SELECT 
    w.id,
    c.id,
    600,  -- Default home delivery price (DA)
    400,  -- Default office/stop-desk price (DA)
    true  -- is_active
FROM public.wilayas w
CROSS JOIN public.delivery_companies c
WHERE c.name = 'NOEST';
