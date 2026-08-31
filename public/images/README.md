# Image Storage Folder Structure

This directory is used to store static images for the **Building Creatives Network (BCN) Hangout** application.

## Sub-folders Created:
- `/public/images/logo/` — Upload logos, watermarks, lockup assets here (e.g. `bcn-logo.png`).
- `/public/images/speakers/` — Upload speaker headshots and profile photos here (e.g. `speaker-1.jpg`).
- `/public/images/events/` — Upload gallery images, workshop photos, or event banners here.
- `/public/images/hero/` — Upload hero background graphics, banners, or decorative illustrations here.

## How to use in Next.js:
Any image added into `public/images/` can be directly referenced in Next.js code using `src="/images/folder/filename.ext"`:

```tsx
// Example usage in components:
<img src="/images/logo/bcn-logo.png" alt="BCN Logo" />
<img src="/images/speakers/speaker-1.jpg" alt="Speaker Name" />
```
