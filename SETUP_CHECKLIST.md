# ✅ Partners Management - Quick Setup Checklist

Follow these steps in order to set up the Partners Management feature:

## 1️⃣ Database Setup (5 minutes)

- [ ] Open your Supabase dashboard (https://supabase.com/dashboard)
- [ ] Navigate to your project
- [ ] Go to **SQL Editor** (left sidebar)
- [ ] Create a **New Query**
- [ ] Copy the contents of `supabase_partners_table.sql`
- [ ] Paste into the SQL editor
- [ ] Click **"Run"** to execute
- [ ] Verify: Go to **Table Editor** → you should see `partners` table with 6 sample entries

## 2️⃣ Environment Variables (Already Done ✓)

Your `.env` file should already have:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

If not, add these from your Supabase project settings.

## 3️⃣ Start the Application (1 minute)

```bash
npm install  # If you haven't already
npm run dev
```

## 4️⃣ Test Partners Management (3 minutes)

- [ ] Open browser and go to: `http://localhost:5173/admin`
- [ ] Log in with your admin credentials
- [ ] Click the **"Partners Management"** tab
- [ ] You should see 6 sample partners displayed in a grid
- [ ] Try adding a new partner:
  - Click "Add Partner"
  - Name: "Test Partner"
  - Logo URL: `https://via.placeholder.com/200x100/FF6B35/FFFFFF?text=Test`
  - Click "Add Partner"
- [ ] Try editing a partner (click Edit button)
- [ ] Try reordering (use ↑↓ arrows)
- [ ] Try deleting the test partner

## 5️⃣ Verify Front-End Display (2 minutes)

- [ ] Navigate to home page: `http://localhost:5173/`
- [ ] Scroll to the "Trusted Partners" section
- [ ] You should see logos scrolling automatically
- [ ] Navigate to: `http://localhost:5173/about`
- [ ] Scroll down - logos should also appear here

## 🎉 Success Criteria

If you can see:
- ✅ Partners Management tab in Admin Dashboard
- ✅ Grid of partner cards with logos
- ✅ Add/Edit/Delete buttons working
- ✅ Logos scrolling on Home page
- ✅ Logos scrolling on About page

**You're all set!** 🚀

## ❌ Troubleshooting

### Problem: "relation 'partners' does not exist"
**Solution**: You didn't run the SQL script. Go back to step 1️⃣

### Problem: Partners showing but can't add/edit/delete
**Solution**: Check RLS policies in Supabase. Ensure authenticated users have permissions.

### Problem: Logos not showing on Home/About pages
**Solution**: 
1. Check browser console (F12) for errors
2. Verify partners exist in Supabase Table Editor
3. Try refreshing the page

### Problem: TypeScript errors
**Solution**: Run `npm install` to ensure all dependencies are installed

## 📚 Need More Help?

- Read: `PARTNERS_SETUP_GUIDE.md` for detailed documentation
- Check: Supabase dashboard for data and logs
- Inspect: Browser console (F12) for error messages

---

**Estimated Total Time**: 10-15 minutes  
**Difficulty**: Easy 🟢
