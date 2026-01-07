<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1ZvJB7-KsyCU29mXmLcATmdbkW-lzHZvP

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Configure AWS Backend:
   - Deploy the backend first (see /aws-backend/README.md)
   - Copy the API Gateway URL to your .env.local file
3. Run the app:
   `npm run dev`
