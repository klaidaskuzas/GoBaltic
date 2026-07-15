# 🚚 GoBaltic Transport Platform

A modern, multilingual vehicle transportation and logistics management platform built with React, TypeScript, Express, and Drizzle ORM.

**Live Site**: https://klientas.iv.lt

---

## 📋 Quick Start Guides

Choose your path based on what you need:

1. **Just deploying for the first time?**
   - Start here: [QUICK_START.md](QUICK_START.md) ⭐ **Recommended**
   - Takes 30-45 minutes from zero to live

2. **Need detailed GitHub setup?**
   - Read: [GITHUB_DEPLOYMENT_GUIDE.md](GITHUB_DEPLOYMENT_GUIDE.md)
   - Full step-by-step with all options

3. **Setting up your domain?**
   - Check: [DOMAIN_SETUP.md](DOMAIN_SETUP.md)
   - Configure `klientas.iv.lt` to work with your site

---

## 🌟 Features

### Frontend
- ✅ Responsive React UI with TailwindCSS
- ✅ Multi-language support (EN, LT, FR, DE, PL)
- ✅ Real-time quote requests with Formspree
- ✅ Vehicle tracking system
- ✅ Admin dashboard
- ✅ Mobile-optimized

### Backend
- ✅ Express API server
- ✅ PostgreSQL database (optional for dev)
- ✅ In-memory storage for easy local development
- ✅ Authentication with Passport.js
- ✅ Email notifications via SendGrid
- ✅ Quote management system
- ✅ Shipment tracking

### Integrations
- ✅ Formspree for quote forms → [maqrnrnr](https://formspree.io)
- ✅ SendGrid for email notifications
- ✅ Mapbox for mapping features
- ✅ Stripe ready (payment infrastructure)

---

## 🛠 Local Development

### Prerequisites
- Node.js 20+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# The app runs on http://127.0.0.1:3000
```

### Environment Variables (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in any services you want to use (all optional for local dev).

---

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
```

Generates optimized bundle in `dist/` folder.

### Start Production Server
```bash
npm start
```

Runs on port specified in `PORT` environment variable (default: 3000).

---

## 📋 Available Scripts

```bash
# Development
npm run dev          # Start dev server on port 3000

# Production
npm run build        # Build optimized bundle
npm start            # Run production server

# Utilities
npm run stop         # Kill any process using port 3000/5000
npm run dev:clean    # Stop and restart dev server
npm run check        # Type check with TypeScript

# Database (if using PostgreSQL)
npm run db:push      # Push schema changes to database
```

---

## 🚀 Deployment Options

### Vercel (Recommended - Free tier)
1. Push to GitHub
2. Connect to Vercel
3. Auto-deploys on push
4. Add custom domain `klientas.iv.lt`

See [QUICK_START.md](QUICK_START.md) for step-by-step.

### Netlify
1. Connect GitHub repo
2. Build: `npm run build`
3. Publish: `dist`
4. Add domain

### Manual VPS
1. Clone repo
2. `npm install && npm run build`
3. `npm start`
4. Configure domain DNS

---

## 📁 Project Structure

```
GoBalticTransport/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page routes
│   │   ├── contexts/      # React contexts
│   │   └── lib/           # Utilities
│   └── index.html         # Entry HTML
├── server/                # Express backend
│   ├── index.ts           # Server entry
│   ├── routes.ts          # API routes
│   ├── auth.ts            # Authentication
│   ├── db.ts              # Database config
│   └── storage.ts         # Data layer
├── shared/                # Shared types/schemas
├── package.json           # Dependencies
├── vercel.json           # Vercel config
└── QUICK_START.md        # Deployment guide
```

---

## 🔐 Security

- Passwords hashed with bcrypt
- Session management with express-session
- Authentication with Passport.js
- CORS configured for security
- Environment variables for secrets

---

## 📞 Contact Form Integration

Quote requests go directly to:
**Formspree**: https://formspree.io/f/maqrnrnr

This integrates automatically - customers see success confirmation.

---

## 🌍 Languages Supported

- 🇬🇧 English
- 🇱🇹 Lithuanian
- 🇫🇷 French
- 🇩🇪 German
- 🇵🇱 Polish

---

## 🐛 Troubleshooting

### "Port 3000 already in use"
```bash
npm run stop
npm run dev
```

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### "Build fails"
```bash
npm run check        # Check for TypeScript errors
npm run build        # Try building again
```

### "Database connection error (optional)"
Database is optional for development. If you don't have PostgreSQL:
- Leave `DATABASE_URL` empty
- App uses in-memory storage automatically

---

## 📊 Performance

- Production bundle: ~150KB gzipped
- React optimized with code splitting
- Vite for fast dev server
- CDN ready (Vercel/Netlify)

---

## 📄 License

MIT License - See LICENSE file

---

## 👤 Author

GoBaltic - Vehicle Transport & Logistics

---

## 🎯 Next Steps

1. **For local development**: `npm run dev`
2. **For deployment**: See [QUICK_START.md](QUICK_START.md)
3. **For domain setup**: See [DOMAIN_SETUP.md](DOMAIN_SETUP.md)
4. **For detailed guide**: See [GITHUB_DEPLOYMENT_GUIDE.md](GITHUB_DEPLOYMENT_GUIDE.md)

---

**Ready to deploy? Follow the [QUICK_START.md](QUICK_START.md) guide!** 🚀

