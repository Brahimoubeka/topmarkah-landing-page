-- Update the foreign key constraint on orders.offer_id to ON DELETE SET NULL
-- This allows admins to safely delete an offer without causing a foreign key violation on existing orders.
-- The order history remains intact because we store a snapshot of the offer name (offer_name_snapshot) 
-- and the prices at the time of the order.

ALTER TABLE public.orders 
DROP CONSTRAINT IF EXISTS orders_offer_id_fkey;

ALTER TABLE public.orders 
ADD CONSTRAINT orders_offer_id_fkey 
FOREIGN KEY (offer_id) REFERENCES public.offers(id) ON DELETE SET NULL;
