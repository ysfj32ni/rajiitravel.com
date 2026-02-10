# Multi-Date Trip System - Complete Guide

## 🎯 Overview

The Multi-Date Trip System allows you to offer the same trip itinerary on multiple departure dates. This is perfect for recurring tours or trips that depart on different dates throughout the year.

## 📊 Database Structure

### `trip_departures` Table

```sql
CREATE TABLE trip_departures (
  id UUID PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  departure_date DATE NOT NULL,
  available_seats INTEGER,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(trip_id, departure_date)
);
```

**Fields:**
- `trip_id`: Links to the main trip (itinerary, description, price, etc.)
- `departure_date`: Specific date when this trip instance departs
- `available_seats`: Optional - track remaining seats for this departure
- `is_available`: Toggle to enable/disable bookings for this departure

## 🔧 Setup Instructions

### 1. Run Database Migration

Execute the SQL migration in your Supabase SQL Editor:

```bash
# File: supabase_trip_departures_table.sql
```

This will:
- ✅ Create the `trip_departures` table
- ✅ Set up indexes for performance
- ✅ Configure Row Level Security (RLS)
- ✅ Allow public read access
- ✅ Restrict write access to authenticated users (admins)

### 2. Verify Database Setup

Check that:
1. Table `trip_departures` exists
2. RLS is enabled
3. Policies are active:
   - "Allow public read access to trip departures"
   - "Allow authenticated users to manage trip departures"

## 👨‍💼 Admin Features

### Manage Departure Dates

In the **Admin Dashboard** (`/admin`):

1. **View Trips**: See all your trips in the trips management table
2. **Manage Dates**: Click the 📅 **Calendar icon** next to any trip
3. **Add Departure**: 
   - Click "+ Add Departure Date"
   - Select date
   - Set available seats (optional)
   - Toggle availability
4. **Edit/Delete**: Manage existing departures as needed

### TripDeparturesManagement Component

Located at: `components/TripDeparturesManagement.tsx`

**Features:**
- ➕ Add multiple departure dates per trip
- ✏️ Toggle availability on/off
- 🎫 Track available seats (optional)
- 🗑️ Delete outdated departures
- 📊 Real-time updates

## 🌐 User-Facing Features

### HomePage

**What Users See:**
- Trips display the **next available departure date**
- Badge shows "X مواعيد متاحة" (X dates available) if multiple dates exist
- Trips without departures show legacy `trip.date`

**Code Location:** `pages/HomePage.tsx`

### TripDetailsPage

**What Users See:**
1. **Hero Section**: Shows number of available departure dates
2. **Available Dates Section**: 
   - Grid of all available departure dates
   - Click to select a date
   - Shows remaining seats (if tracked)
   - Selected date is highlighted
3. **Booking Button**: 
   - Shows selected departure date
   - WhatsApp message includes the specific date
4. **No Dates Available**: Shows message to contact via WhatsApp

**Code Location:** `pages/TripDetailsPage.tsx`

### TripCard Component

**Enhanced Display:**
- Shows next departure date if available
- Shows "+" indicator if multiple dates exist
- Adapts to show `trip.date` as fallback for trips without departures

**Code Location:** `components/TripCard.tsx`

## 🎨 UI/UX Flow

### User Journey:

1. **Browse Trips** → See next departure date on trip cards
2. **Click Trip** → Navigate to details page
3. **View Dates** → See all available departure dates in a grid
4. **Select Date** → Click to choose preferred departure
5. **Book Now** → WhatsApp message includes selected date

### Admin Journey:

1. **Login to Admin** → Navigate to Admin Dashboard
2. **Select Trip** → Click 📅 calendar icon
3. **Manage Dates** → Add/edit/delete departure dates
4. **Monitor Seats** → Track bookings (optional)

## 📝 Best Practices

### For Admins:

1. **Add Multiple Dates Early**: Add all known departure dates as soon as possible
2. **Keep Dates Updated**: Disable or delete past departures
3. **Track Seats**: Use `available_seats` to prevent overbooking
4. **Set Availability**: Toggle `is_available` to control bookings

### For Developers:

1. **Always Fetch Departures**: When showing trip details, fetch associated departures
2. **Sort by Date**: Always order departures by `departure_date ASC`
3. **Filter Available**: Only show `is_available = true` and future dates
4. **Graceful Fallback**: Show `trip.date` if no departures exist

## 🔄 Migration Strategy

### Moving from Single Date to Multi-Date:

**Option 1: Keep Legacy Date**
- Keep `trip.date` in trips table
- Add departures for new trips
- Display logic: Show departures if available, else show `trip.date`

**Option 2: Migrate All Trips**
```sql
-- For each trip, create a departure from its date
INSERT INTO trip_departures (trip_id, departure_date, is_available)
SELECT id, date, NOT is_completed
FROM trips;
```

## 🧪 Testing Checklist

### Admin Testing:
- [ ] Can add new departure date
- [ ] Can edit existing departure
- [ ] Can delete departure
- [ ] Can toggle availability
- [ ] Can set/update available seats
- [ ] Modal opens and closes correctly

### User Testing:
- [ ] HomePage shows trips with next departure
- [ ] Multiple dates badge displays correctly
- [ ] TripDetailsPage shows all available dates
- [ ] Can select different departure dates
- [ ] Selected date appears in booking button
- [ ] WhatsApp message includes correct date
- [ ] No dates message appears when no departures exist

### Edge Cases:
- [ ] Trip with no departures shows fallback date
- [ ] Past departures are filtered out
- [ ] Unavailable departures are hidden
- [ ] Empty state handles gracefully

## 📱 WhatsApp Integration

When a user clicks "احجز عبر واتساب الآن" (Book via WhatsApp Now):

**Message Format:**
```
السلام عليكم، أود الحجز في رحلة: [Trip Title]
تاريخ الانطلاق: [Selected Departure Date]
```

**Example:**
```
السلام عليكم، أود الحجز في رحلة: رحلة المالديف الفاخرة
تاريخ الانطلاق: الجمعة 15 فبراير 2026
```

## 🔐 Security

**Row Level Security (RLS) Policies:**

1. **Public Read**: Anyone can view available departures
   ```sql
   CREATE POLICY "Allow public read access to trip departures"
     ON trip_departures FOR SELECT USING (true);
   ```

2. **Admin Write**: Only authenticated users can manage departures
   ```sql
   CREATE POLICY "Allow authenticated users to manage trip departures"
     ON trip_departures FOR ALL
     USING (auth.role() = 'authenticated');
   ```

## 🚀 Advanced Features (Future Enhancements)

### Potential Additions:

1. **Booking System**: 
   - Link bookings to specific departures
   - Auto-decrement available seats on booking

2. **Price Variations**: 
   - Different prices per departure (seasonal pricing)
   - Early bird discounts

3. **Capacity Management**:
   - Set min/max participants
   - Auto-disable when full

4. **Notifications**:
   - Alert admins when seats are low
   - Notify users of new departures

5. **Analytics**:
   - Track popular departure dates
   - Booking conversion rates per date

## 📚 Related Files

### Components:
- `components/TripDeparturesManagement.tsx` - Admin management UI
- `components/TripCard.tsx` - Trip card with departure info
- `components/FeedbackSection.tsx` - Trip reviews (separate feature)

### Pages:
- `pages/AdminDashboard.tsx` - Admin panel with departures management
- `pages/HomePage.tsx` - Trip listing with next departure
- `pages/TripDetailsPage.tsx` - Full details with date selection

### Types:
- `types.ts` - TypeScript interfaces for TripDeparture, TripWithDepartures

### Database:
- `supabase_trip_departures_table.sql` - Database migration

## 🆘 Troubleshooting

### Issue: Departures not showing on homepage
**Solution**: Check that `is_available = true` and `departure_date >= today`

### Issue: Can't add departure in admin
**Solution**: Verify you're authenticated and RLS policies are active

### Issue: Duplicate departure error
**Solution**: Each trip can only have one departure per date (UNIQUE constraint)

### Issue: Old departures still visible
**Solution**: Filter: `gte('departure_date', new Date().toISOString().split('T')[0])`

## ✅ Summary

You now have a complete multi-date system that:
- ✅ Allows admins to manage multiple departure dates per trip
- ✅ Shows users all available dates to choose from
- ✅ Integrates seamlessly with WhatsApp booking
- ✅ Tracks available seats (optional)
- ✅ Maintains backward compatibility with single-date trips

**Next Steps**: Add departures to your existing trips and start offering more flexibility to your customers!
