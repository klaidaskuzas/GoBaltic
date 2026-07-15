# 🚀 Quick Start Checklist - GoBaltic Transport Deployment

## ✅ Phase 1: Install Git (One-time)

1. Open Terminal and run:
   ```bash
   xcode-select --install
   ```
2. Click **Install** on dialog
3. Wait 5-10 minutes
4. Verify: `git --version` (should show version)

**Time: ~10 minutes**

---

## ✅ Phase 2: Set up Git Locally (One-time)

```bash
cd ~/Documents/IT-Projektai/GoBalticTransport-main

git init
git config user.name "klaidas"
git config user.email "klaidas@iv.lt"

# Verify
git config --list | grep user
```

**Time: 2 minutes**

---

## ✅ Phase 3: Create GitHub Repository (One-time)

1. Go to https://github.com/new
2. Fill in:
   - Repository name: `GoBalticTransport`
   - Visibility: Public
3. Click Create
4. **Copy the HTTPS URL** (looks like: `https://github.com/klaidas/GoBalticTransport.git`)

**Time: 2 minutes**

---

## ✅ Phase 4: Push Code to GitHub (First time)

```bash
cd ~/Documents/IT-Projektai/GoBalticTransport-main

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: GoBaltic Transport with Formspree integration and local dev setup"

# Add remote (replace URL with your repo URL from Phase 3)
git remote add origin https://github.com/USERNAME/GoBalticTransport.git

# Rename main branch
git branch -M main

# Push to GitHub
git push -u origin main
```

**Expected output:**
```
Enumerating objects: ...
Counting objects: ...
...
To https://github.com/USERNAME/GoBalticTransport.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

**Time: 2-5 minutes (depends on internet)**

---

## ✅ Phase 5: Deploy to Vercel (Recommended)

1. Go to https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize GitHub access
4. Click "Import Project"
5. Select `GoBalticTransport` repository
6. Click "Import"
7. Wait for deployment (2-3 minutes)
8. Vercel gives you a preview URL

**Time: 5 minutes**

---

## ✅ Phase 6: Connect Your Domain

1. In Vercel dashboard, click "Settings"
2. Click "Domains"
3. Enter: `klientas.iv.lt`
4. Vercel shows DNS records
5. Go to Interneto vizija hosting panel
6. Update DNS records as shown by Vercel
7. Wait 15 min - 24 hours for propagation

**Time: 5 minutes + wait**

---

## ✅ Phase 7: Test Your Site

Visit in browser:
```
https://klientas.iv.lt
```

Should see your live GoBaltic Transport website! 🎉

---

## Future Updates (After Changes)

Every time you update code:

```bash
cd ~/Documents/IT-Projektai/GoBalticTransport-main

git add .
git commit -m "Your description of changes"
git push origin main
```

**Vercel automatically deploys! ✓**

---

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| "Git not found" | Run `xcode-select --install` |
| "Permission denied" | Check SSH keys or use HTTPS URL |
| "Repo not found" | Verify repo URL is correct |
| "Domain not working" | Wait 24h for DNS, then check https://dnschecker.org |
| "Build failed on Vercel" | Check build logs in Vercel dashboard |

---

## Important Files Reference

| File | Purpose |
|------|---------|
| `package.json` | Dependencies & build scripts |
| `server/index.ts` | Backend API server |
| `client/src/` | Frontend React code |
| `.env.example` | Environment variables template |
| `vercel.json` | Vercel deployment config |
| `GITHUB_DEPLOYMENT_GUIDE.md` | Detailed guide |
| `DOMAIN_SETUP.md` | Domain configuration details |

---

## Getting Help

- **Git issues**: Run `git status` to see current state
- **Deployment issues**: Check Vercel dashboard → Deployments
- **Domain issues**: Visit https://dnschecker.org to verify DNS
- **Code issues**: Check browser console (F12) for errors

---

## Estimated Total Time

- **First time setup**: 30-45 minutes
- **Future updates**: 2-3 minutes
- **Domain propagation**: 15 min - 24 hours (automatic)

---

**You're all set! 🚀 Once DNS propagates, your site will be live at https://klientas.iv.lt**

