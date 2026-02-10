# How to Add Your Logo

To display your custom logo in the navbar:

1. Save your logo image file as `logo.png` in the `public` folder
   Path: `C:\Users\yjaad\Downloads\RJ-travel-agency\public\logo.png`

2. The logo should be a square image (recommended size: 512x512px or 1024x1024px)

3. Supported formats: PNG (with transparency recommended), JPG, SVG, WebP

4. The navbar will automatically display your logo with:
   - Height: 40px (adjustable in Navbar.tsx)
   - Maintains aspect ratio
   - Fallback gradient box if image fails to load

## Current Setup:

✅ Navbar has been updated to use your logo
✅ Compass icon replaced with image logo
✅ Brand text is "RJ TRAVEL"
✅ Fallback gradient design if logo doesn't load

## Next Steps:

1. Save the attached logo image as `public/logo.png`
2. Refresh your browser to see the changes
3. If you need to adjust the logo size, edit line 24 in `components/Navbar.tsx`:
   Change `h-10 w-10` to your preferred size (e.g., `h-12 w-12` for larger)
