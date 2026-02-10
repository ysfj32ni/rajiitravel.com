# 🚀 Partners Management Setup Guide

This guide will help you set up the Partners Management feature for the RJ TRAVEL website.

## 📋 Overview

The Partners Management feature allows admins to:
- ✅ Add, edit, and delete partner/client logos
- ✅ Reorder logos to control display order
- ✅ Preview logos before saving
- ✅ Automatically display logos in the sliding carousel on Home and About pages

## 🗄️ Database Setup

### Step 1: Create the Partners Table

1. Go to your Supabase project dashboard
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New Query"**
4. Copy and paste the contents of `supabase_partners_table.sql` into the editor
5. Click **"Run"** to execute the SQL

This will:
- Create the `partners` table with proper structure
- Set up indexes for performance
- Enable Row Level Security (RLS)
- Create policies for public read access
- Add 6 sample partner logos to get you started

### Step 2: Verify Table Creation

1. In Supabase dashboard, click **"Table Editor"**
2. Look for the `partners` table in the list
3. You should see 6 sample partners pre-loaded

### Optional: Remove Sample Data

If you want to start fresh without the sample partners:
```sql
DELETE FROM partners;
```

## 🎨 Using Partners Management

### Accessing the Admin Panel

1. Navigate to `/admin` in your browser
2. Log in with your admin credentials
3. Click the **"Partners Management"** tab at the top

### Adding a New Partner

1. Click the **"Add Partner"** button (orange gradient)
2. Fill in the form:
   - **Partner Name**: The name of the company/partner
   - **Logo URL**: Direct link to the logo image
3. Preview the logo to ensure it looks good
4. Click **"Add Partner"**

### Best Practices for Logo URLs

- ✅ Use high-quality PNG or SVG logos with transparent backgrounds
- ✅ Recommended size: 200-400px width
- ✅ Ensure the URL is publicly accessible
- ✅ Consider using:
  - Wikimedia Commons (https://commons.wikimedia.org)
  - Your own CDN or cloud storage (AWS S3, Cloudinary, etc.)
  - Direct URLs from partner websites (ensure permission)

### Example Logo Sources

**Wikimedia Commons** (free, high-quality logos):
- Search: `https://commons.wikimedia.org/wiki/File:COMPANY_NAME_logo.svg`
- Right-click the logo → Copy image address

**Cloudinary** (free tier available):
1. Upload logos to Cloudinary
2. Copy the public URL
3. Use in Partners Management

### Editing Partners

1. Find the partner in the grid view
2. Click the **"Edit"** button
3. Update the name or logo URL
4. Click **"Update Partner"**

### Reordering Partners

- Use the **↑** (up arrow) button to move a partner higher in the order
- Use the **↓** (down arrow) button to move a partner lower
- The order reflects how logos appear in the carousel (left to right)

### Deleting Partners

1. Click the **"Delete"** button on a partner card
2. Confirm the deletion in the popup

## 🎭 How Partners Display on Your Website

Once you add partners in the admin panel, they automatically appear:

### Home Page
- Scroll down to the "Trusted Partners" section
- Logos scroll continuously from right to left
- Infinite loop animation

### About Page
- Below the company values section
- Same smooth scrolling animation
- Shows all active partners

### Technical Details
- The `ClientsSlider` component fetches partners from Supabase
- Logos are sorted by `display_order`
- Falls back to hardcoded logos if database is empty
- Responsive design works on all screen sizes

## 🔧 Troubleshooting

### Partners not showing up?

1. **Check Supabase Connection**:
   - Ensure `.env` file has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
   - Restart the development server after changing `.env`

2. **Check Table Exists**:
   - Go to Supabase → Table Editor
   - Verify `partners` table exists

3. **Check RLS Policies**:
   - Go to Supabase → Authentication → Policies
   - Ensure "Allow public read access to partners" policy exists

4. **Check Browser Console**:
   - Open DevTools (F12)
   - Look for any error messages
   - Common issue: CORS errors or authentication problems

### Logo images not loading?

1. **Verify URL**: Paste the logo URL directly in browser to check it works
2. **Check CORS**: Some websites block hotlinking - use your own hosting
3. **Use HTTPS**: Mixed content (HTTP images on HTTPS site) may be blocked

### Can't add/edit/delete partners?

1. **Authentication**: Ensure you're logged in as an admin
2. **Supabase Policies**: Check the RLS policies allow authenticated users to modify data
3. **Network**: Check browser console for 401/403 errors

## 📱 Mobile Responsiveness

The Partners Management UI is fully responsive:
- **Desktop**: 3-column grid
- **Tablet**: 2-column grid  
- **Mobile**: 1-column stack

## 🎨 Customization

### Change Animation Speed

Edit `components/ClientsSlider.tsx`:
```tsx
// Line ~40, change animation duration
animate={{ x: [0, -slideWidth] }}
transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
//                      ↑ Change this number (seconds)
```

### Change Logo Size

Edit `components/ClientsSlider.tsx`:
```tsx
// Line ~35, adjust height
<div className="h-16 min-w-[150px] flex items-center justify-center mx-8">
//              ↑ h-16 = 64px height, adjust as needed
```

### Change Number of Visible Logos

The component automatically adjusts based on screen width. To show more/fewer:
- Decrease `min-w-[150px]` value to fit more logos
- Increase to make logos larger and show fewer

## 🔐 Security Notes

The current setup allows:
- ✅ **Anyone** to view partners (public read access)
- ✅ **Authenticated users** to add/edit/delete partners

To restrict admin actions to specific users:
1. Add a `role` column to your users table
2. Update the RLS policy to check for admin role
3. Modify the policy in Supabase SQL Editor

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review the Supabase documentation
3. Check browser console for errors
4. Verify all environment variables are set

## ✨ Features Summary

✅ **Admin Interface**: Beautiful, intuitive UI for managing partners  
✅ **Live Preview**: See logos before saving  
✅ **Drag-free Reordering**: Simple up/down buttons  
✅ **Responsive Design**: Works on all devices  
✅ **Automatic Integration**: Logos appear instantly on Home/About pages  
✅ **Smooth Animations**: Professional infinite scroll effect  
✅ **Fallback System**: Shows default logos if database is empty  
✅ **Color-coded UI**: Matches RJ TRAVEL orange/red branding  

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Compatibility**: React 18, Supabase 2.x, Vite 5.x
