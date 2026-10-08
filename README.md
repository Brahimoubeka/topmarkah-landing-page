# TopMarkah E-commerce Landing Page & Admin Dashboard

This is a complete, production-ready web application built with Next.js 14/15, Tailwind CSS, and Supabase.
It features a high-converting, mobile-first single landing page with an integrated order form, and a secure admin dashboard to manage products, offers, orders, and delivery settings.

## Features

- **Public Landing Page**: Beautiful, responsive, Arabic RTL layout with an embedded order form.
- **Admin Dashboard**: Manage products, create promotional offers (bundles), configure delivery pricing by wilaya, and track orders.
- **Server Actions & RPC**: Uses strict server-side validation and Supabase Security Definer RPC for creating orders safely (prevents tampering with prices from the client).
- **Row Level Security (RLS)**: Data is protected at the database level.
- **Modern Tech Stack**: Next.js App Router, Supabase Auth/DB, Zod, React Hook Form, Tailwind CSS, Lucide Icons.

## Supabase Setup Instructions

1. **Create a Supabase Project**
   Go to [Supabase](https://supabase.com/) and create a new project.

2. **Run SQL Migrations**
   - In your Supabase dashboard, go to the **SQL Editor**.
   - Open the `supabase/migrations/00000000000000_initial_schema.sql` file in this repository.
   - Copy the entire SQL content, paste it into the SQL Editor, and click **Run**.
   - This will create all tables, policies, functions, triggers, and storage buckets.

3. **Configure Storage Buckets (Optional via UI)**
   - If the SQL script didn't create buckets, go to **Storage** and create two public buckets: `products` and `landing`.

4. **Environment Variables**
   - Rename `.env.example` to `.env.local`.
   - Go to Supabase Project Settings -> API.
   - Copy the `Project URL` and `anon public` key.
   - Paste them into your `.env.local` file:
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

5. **Create the First Admin User**
   Since we don't have a public signup page for admins (for security), you must create one manually:
   - Go to Supabase **Authentication** -> **Users** and click **Add User** -> **Create New User**.
   - Enter an email (e.g., `admin@topmarkah.com`) and a strong password.
   - Copy the newly generated **User UUID**.
   - Go to the **Table Editor** -> `admins` table.
   - Insert a new row with the `id` you just copied and the email.
   - This user can now log in at `/admin/login` and access the dashboard.

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) for the public landing page.
4. Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for the admin dashboard.

## Initial Data Setup (Required for Landing Page to work)

Before the public landing page will display correctly, you must log into the Admin Dashboard and:
1. Create at least one **Delivery Company** (e.g., "Yalidine") in the database or via SQL.
2. Create **Wilayas** in the database or via SQL. (You can bulk insert Algerian wilayas in the SQL editor).
3. Go to **Delivery Configuration** in the admin dashboard and set the delivery prices.
4. Create a **Product** and mark it as active and featured.
5. Create at least one **Offer** (e.g., "1 Product for 2500 DA") and mark it as active.

## Production Deployment (Vercel)

1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import your repository.
3. In the environment variables section, add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Deploy!

## Architecture & Security Decisions

- **Embedded Order Form**: The order form is directly on the landing page. It submits data using Next.js Server Actions.
- **Price Security**: The client sends only `offer_id`, `wilaya_id`, `quantity`, and `delivery_method`. The `place_order` RPC function in Supabase calculates the actual total server-side, preventing malicious users from spoofing prices.
- **Admin Protection**: Admin routes (`/admin/*`) are protected by Next.js Middleware which checks the Supabase session and verifies the user exists in the `admins` table.
- **Row Level Security**: Public users can only read active products, offers, and delivery prices. They cannot read orders. Admins have full access.
