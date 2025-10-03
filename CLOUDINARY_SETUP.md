# Cloudinary Setup Guide

## 🎯 Get Your Cloudinary Credentials

1. **Sign up for free**: https://cloudinary.com/users/register/free
2. **Login to your dashboard**: https://cloudinary.com/console
3. **Copy your credentials** from the Dashboard:
   - Cloud Name
   - API Key
   - API Secret

## 📝 Update Your `.env` File

Replace the placeholder values in your `.env` file with your actual Cloudinary credentials:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_actual_cloud_name"
CLOUDINARY_API_KEY="your_actual_api_key"
CLOUDINARY_API_SECRET="your_actual_api_secret"
```

## ✅ How It Works

1. **In Admin Panel** (`/admin/projects/edit/[id]`):
   - Click "Choose Image" to upload
   - Image automatically uploads to Cloudinary
   - URL is saved to database
   - Images are served via Cloudinary CDN

2. **Features**:
   - Automatic optimization
   - Fast CDN delivery
   - Image transformations
   - Free tier: 25GB storage, 25GB bandwidth/month

## 🚀 Next Steps

After adding your Cloudinary credentials:

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Login to admin panel:
   ```
   Email: admin@example.com
   Password: admin123
   ```

3. Create/Edit a project and upload an image!

## 📦 What We Set Up

- ✅ Cloudinary SDK integration
- ✅ Image upload API (`/api/upload`)
- ✅ ImageUpload component
- ✅ Integrated into project editor
- ✅ Preview before upload
- ✅ Automatic URL saving

## 🎨 Image Recommendations

- **Thumbnail**: 1200x630px (16:9 ratio)
- **Format**: JPG, PNG, WebP
- **Max size**: 5MB
- **Cloudinary automatically optimizes** your images for web!

---

**Need help?** Check Cloudinary docs: https://cloudinary.com/documentation
