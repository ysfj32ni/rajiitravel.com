# 📋 Travel Program Details Feature - Setup Guide

## Overview

The "Details & Program" button has replaced the "Reserve via WhatsApp" button on trip cards. When clicked, it shows a beautiful popup modal displaying the complete day-by-day travel itinerary.

## ✨ What Changed

### Before
- Button text: "احجز عبر واتساب" (Reserve via WhatsApp)
- Action: Direct link to WhatsApp
- No program details visible

### After
- Button text: "التفاصيل والبرنامج" (Details & Program)
- Action: Opens popup modal with full itinerary
- WhatsApp booking button is inside the modal
- Admins can add detailed programs via Admin Dashboard

---

## 🗄️ Database Setup

### Step 1: Add Program Column to Database

1. Open your Supabase dashboard
2. Go to **SQL Editor** → **New Query**
3. Copy and paste the contents of `supabase_add_program_column.sql`
4. Click **"Run"**

This adds a new `program` column to the `trips` table to store the day-by-day itinerary.

---

## 📝 How to Add Travel Programs (Admin)

### Step 1: Access Admin Dashboard

1. Go to `/admin` and log in
2. Click on **"Trips Management"** tab
3. Click **"Edit"** on any existing trip, or **"Add New Trip"**

### Step 2: Add Program Details

In the trip form, you'll see a new large text area:

**"Travel Program (Day-by-day itinerary)"**

Here's the format you should use:

```
✌️❤️✌️
⬅️ الجمعة 

-- 17:00 : الإنطلاق من الرباط أمام محطة القطار الرباط أكدال 
-- 19:30 : الإنطلاق من الدار البيضاء امام محطة القطار الدار البيضاء المسافرين من الباب الخلفي 
-- تناول وجبة العشاء بأحد محطات الإستراحة
-- 22:00 : الإنطلاق من خريبكة ( من أمام مطعم الأخوين )
-- 02:00 : الوصول للمأوى و المبيت 

⬅️ السبت

-- الإستيقاظ و تناول وجبة الفطور
-- التوجه بالحافلة إلى نقطة الصعود نحو قمة باب نوياد 
-- بداية مسارنا نحو القمة ( طول المسار 3 ساعات مع عدة توقفات ، درجة الصعوبة 2/5 ) 
-- الوصول للقمة و الإستمتاع بالمنظر الجميل

⬅️ الأحد

-- الإستيقاظ و تناول وجبة الفطور
-- العودة إلى المأوى و تناول وجبة الغداء 
-- طريق العودة

⚠️ قائمة بأهم الحاجيات التي يجب إحضارها:
- أحذية المشي الجبلي   
- حقيبة ظهر من 10 إلى 20 لتر 
- نظارة شمسية
- قبعة

⭕ ثمن الرحلة 1190 درهم و تتضمن : 
- نقل سياحي مكيف و مريح 
- المبيت ليلتين بمأوى بإيملشيل  
- جميع الوجبات من فطور يوم السبت إلى غداء يوم الأحد 
- واجب التأمين على النقل

⭕ للحجز المرجو إرسال المبلغ بالكامل أو تسبيق 500 درهم

⚠️ ملاحظات مهمة:
1.) الحجز مفتوح في حدود المقاعد المتوفرة
2.) من لم يحضر وقت السفر لا تقبل منه شكاية
3.) البرنامج قابل للتعديلات الطفيفة
```

### Step 3: Formatting Tips

✅ **Use Emojis**: Makes the program more attractive
- ⬅️ for day headers
- ⚠️ for warnings/important notes
- ⭕ for pricing/booking info
- ✌️❤️ for decorative elements

✅ **Use Double Dashes**: `--` for bullet points/activities

✅ **Blank Lines**: Add blank lines between sections for readability

✅ **Right-to-Left (RTL)**: The text area supports Arabic RTL automatically

✅ **Time Format**: Use 24-hour format (17:00, 19:30, etc.)

---

## 🎨 User Experience

### What Users See

1. **Trip Card**: Shows basic info (title, date, price, short description)
2. **Button**: "التفاصيل والبرنامج" (Details & Program) - orange/red gradient
3. **Modal Popup**: 
   - Trip title in header (orange/red gradient)
   - Full program text with proper formatting
   - "احجز عبر واتساب" button (green, opens WhatsApp)
   - "إغلاق" button (gray, closes modal)

### Modal Features

✨ **Sticky Header**: Title stays visible while scrolling
✨ **Responsive**: Works on mobile, tablet, desktop
✨ **RTL Support**: Arabic text displays correctly
✨ **Scrollable**: Long programs scroll within the modal
✨ **Click Outside**: Clicking backdrop closes modal
✨ **Close Button**: X button in header to close
✨ **WhatsApp Integration**: Quick booking button at bottom

---

## 📱 Responsive Design

### Desktop (1024px+)
- Modal: Max width 768px, centered
- Text: Large and comfortable reading size
- Two buttons side-by-side (WhatsApp | Close)

### Tablet (768px - 1023px)
- Modal: Takes 90% width
- Text: Medium size
- Buttons remain side-by-side

### Mobile (< 768px)
- Modal: Takes 95% width
- Text: Optimized for mobile reading
- Buttons stack or stay side-by-side based on content

---

## 🔧 Technical Details

### Files Modified

1. **`types.ts`**
   - Added `program?: string` to `Trip` interface

2. **`components/TripCard.tsx`**
   - Changed button from WhatsApp link to Details button
   - Added modal popup component
   - Added state management for modal visibility
   - WhatsApp button moved inside modal

3. **`pages/AdminDashboard.tsx`**
   - Added `program` field to form state
   - Added large textarea for program input
   - Updated all form reset logic
   - Added placeholder text with example format

4. **`supabase_add_program_column.sql`** (NEW)
   - SQL migration to add program column

### Database Schema Update

```sql
ALTER TABLE trips 
ADD COLUMN program TEXT;
```

### Component State

```typescript
const [showProgram, setShowProgram] = useState(false);
```

---

## 🎯 Testing Checklist

### Admin Testing
- [ ] Open Admin Dashboard
- [ ] Edit an existing trip
- [ ] See the new "Travel Program" textarea
- [ ] Paste a sample program (use the format above)
- [ ] Save the trip
- [ ] Verify no errors

### User Testing
- [ ] Go to home page
- [ ] Find a trip with a program
- [ ] Click "التفاصيل والبرنامج" button
- [ ] Modal opens with program details
- [ ] Text is properly formatted (RTL, line breaks work)
- [ ] Emojis display correctly
- [ ] Click "احجز عبر واتساب" → Opens WhatsApp
- [ ] Click "إغلاق" → Modal closes
- [ ] Click outside modal → Modal closes
- [ ] Test on mobile device

### Edge Cases
- [ ] Trip without program → Shows "لم يتم إضافة البرنامج بعد"
- [ ] Very long program → Scrolls within modal
- [ ] Very short program → Modal adjusts height
- [ ] Special characters → Display correctly

---

## 🎨 Customization

### Change Modal Colors

Edit `TripCard.tsx`:

```tsx
// Header gradient (line ~70)
className="sticky top-0 bg-gradient-to-r from-orange-500 to-red-500 ..."

// Change to blue:
className="sticky top-0 bg-gradient-to-r from-blue-500 to-indigo-500 ..."
```

### Change Button Text

```tsx
// Details button (line ~56)
<span>التفاصيل والبرنامج</span>

// Change to:
<span>برنامج الرحلة</span> // "Trip Program"
<span>التفاصيل الكاملة</span> // "Full Details"
```

### Change Modal Size

```tsx
// Modal container (line ~66)
className="bg-white rounded-3xl shadow-2xl max-w-3xl ..."

// Smaller:
max-w-2xl

// Larger:
max-w-4xl or max-w-5xl
```

---

## 📊 Sample Programs

### Mountain Trip (3 Days)

```
✌️❤️✌️
⬅️ الجمعة 

-- 17:00 : الإنطلاق من الرباط
-- 19:30 : الإنطلاق من الدار البيضاء
-- تناول وجبة العشاء بأحد محطات الإستراحة
-- 02:00 : الوصول للمأوى و المبيت

⬅️ السبت

-- الإستيقاظ و تناول وجبة الفطور
-- التوجه نحو قمة الجبل
-- الوصول للقمة و الإستمتاع بالمنظر
-- تناول وجبة الغذاء
-- وقت حر للإكتشاف المنطقة
-- العودة للمأوى
-- تناول وجبة العشاء
-- سهرة ليلية
-- المبيت

⬅️ الأحد

-- الإستيقاظ و تناول وجبة الفطور
-- زيارة معالم المنطقة
-- تناول وجبة الغداء
-- طريق العودة

⭕ السعر: 1190 درهم
⚠️ يرجى إحضار ملابس دافئة
```

### Beach Trip (2 Days)

```
🏖️ ⛱️ 🌊

⬅️ السبت

-- 08:00 : الإنطلاق من نقطة التجمع
-- 11:00 : الوصول إلى الشاطئ
-- تسجيل الدخول إلى الفندق
-- وقت حر للإستمتاع بالشاطئ
-- 19:00 : تناول وجبة العشاء
-- سهرة على البحر

⬅️ الأحد

-- الإستيقاظ و الفطور
-- رياضات مائية (اختياري)
-- 13:00 : تناول الغداء
-- 15:00 : بداية طريق العودة

⭕ السعر: 850 درهم
🏊 أنشطة مائية متوفرة بتكلفة إضافية
```

---

## ❓ FAQ

### Q: Is the program field required?
**A:** No, it's optional. If empty, users will see a message: "لم يتم إضافة البرنامج بعد"

### Q: Can I use HTML in the program?
**A:** No, it's plain text. Use emojis and formatting (dashes, line breaks) instead.

### Q: How long can the program be?
**A:** The TEXT column supports up to ~1GB of text, but keep it reasonable (1,000-3,000 characters recommended).

### Q: Can users book directly from the modal?
**A:** Yes! There's a green "احجز عبر واتساب" button that opens WhatsApp with a pre-filled message.

### Q: Will old trips work without programs?
**A:** Yes! The program field is optional. Old trips will show "No program added yet" message.

### Q: Can I copy/paste from Word/Google Docs?
**A:** Yes, but it's better to paste plain text. Remove any special formatting first.

---

## 🚀 Deployment

### Production Checklist

1. **Database**:
   - [ ] Run `supabase_add_program_column.sql` on production database
   - [ ] Verify column added successfully

2. **Code**:
   - [ ] Deploy updated code to production
   - [ ] Clear cache/CDN if needed

3. **Testing**:
   - [ ] Add program to at least one trip
   - [ ] Test modal on production
   - [ ] Test WhatsApp booking link

4. **Admin Training**:
   - [ ] Show admin how to add programs
   - [ ] Provide sample program templates
   - [ ] Explain formatting guidelines

---

## 📞 Support

If you encounter issues:

1. **Modal not opening**: Check browser console for errors
2. **Text not formatting**: Ensure proper line breaks and RTL
3. **Emojis not showing**: Use Unicode emojis (✌️ ❤️ ⬅️)
4. **Database error**: Ensure `program` column exists in `trips` table

---

## ✨ Future Enhancements

Potential features to add:

1. **Rich Text Editor**: WYSIWYG editor for program formatting
2. **Program Templates**: Pre-made templates for common trip types
3. **Image Gallery**: Add photos to each day of the program
4. **Downloadable PDF**: Generate PDF version of the program
5. **Multi-language**: Support English/French programs
6. **Itinerary Timeline**: Visual timeline view of the program

---

**Last Updated**: January 2026  
**Version**: 2.0  
**Status**: Production Ready ✅
