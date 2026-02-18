-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anonymous users can create orders" ON public.orders;

-- Create a more restrictive insert policy that validates required fields
CREATE POLICY "Validate order creation"
ON public.orders
FOR INSERT
TO anon
WITH CHECK (
  order_id IS NOT NULL 
  AND product_id IS NOT NULL 
  AND customer_email IS NOT NULL
  AND customer_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);