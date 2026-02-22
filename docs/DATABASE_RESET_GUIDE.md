# 🔧 Database Reset Guide

## Quick Start (Easiest Method)

### Option 1: Supabase SQL Editor (Recommended)

1. **Open Supabase Dashboard**
   - Go to your Supabase project: https://supabase.com/dashboard
   - Navigate to **SQL Editor** (left sidebar)

2. **Run Reset Script**
   - Click **"New Query"**
   - Copy the entire contents of `supabase_reset_complete.sql`
   - Paste into the editor
   - Click **"Run"** button (or press F5)

3. **Verify Success**
   - You should see messages like:
     ```
     ✅ DATABASE RESET AND SEEDED SUCCESSFULLY!
     📊 Tables Created: 9 tables
     👤 Professionals: 1
     💅 Services: 3
     📋 Methodology Steps: 4
     ```

### Option 2: Command Line (Advanced)

If you have `psql` installed:

```powershell
# Extract connection details from .env
$DATABASE_URL = (Get-Content .env | Select-String 'DATABASE_URL=' | ForEach-Object { $_.ToString().Replace('DATABASE_URL=', '') })

# Run the SQL script
psql $DATABASE_URL -f supabase_reset_complete.sql
```

## After Reset

Once the database is reset, refresh your browser at http://localhost:3001/admin and you should see:

- ✅ Admin dashboard loads without errors
- ✅ `/admin/methodology` shows 4 steps
- ✅ `/admin/services` shows 3 services
- ✅ Homepage "Assinatura Técnica" section shows database data

## Troubleshooting

**Error: "permission denied"**
- Make sure you're logged into the correct Supabase project
- Verify you have admin access

**Error: "database does not exist"**
- Double-check your DATABASE_URL in `.env`
- Ensure you selected the right project in Supabase dashboard

**Tables still missing after reset**
- Clear your browser cache
- Restart the dev server: `npm run dev -- -p 3001`



