# GoBaltic Transport - GitHub & Domain Deployment Guide

## Phase 1: Set up Xcode Command Line Tools (Required for Git)

Run this command in Terminal:
```bash
xcode-select --install
```

Click "Install" on the dialog that appears. This will take 5-10 minutes.

After installation completes, verify with:
```bash
git --version
```

---

## Phase 2: Initialize Git Repository Locally

Once Xcode tools are installed, run these commands:

```bash
cd ~/Documents/IT-Projektai/GoBalticTransport-main

# Initialize Git
git init

# Configure your Git identity
git config user.name "klaidas"
git config user.email "klaidas@iv.lt"

# Verify configuration
git config --list
```

---

## Phase 3: Create GitHub Repository

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `GoBalticTransport` (or your preferred name)
   - **Description**: "Vehicle Transport & Logistics Platform"
   - **Visibility**: Public (recommended for client portfolio) or Private
   - **Do NOT initialize** with README or .gitignore
3. Click "Create repository"
4. You'll see instructions - copy the "...push an existing repository..." section

---

## Phase 4: Add Files and Push to GitHub

After creating the repo, in Terminal run:

```bash
cd ~/Documents/IT-Projektai/GoBalticTransport-main

# Stage all files
git add .

# Create first commit
git commit -m "Initial commit: GoBaltic Transport platform with Formspree integration"

# Add remote repository (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/GoBalticTransport.git

# Rename main branch to main (if needed)
git branch -M main

# Push code to GitHub
git push -u origin main
```

---

## Phase 5: Domain Configuration (klientas.iv.lt)

Your domain `klientas.iv.lt` is hosted at: **Interneto vizija (Hosting provider)**

You need to:

1. **Access your hosting control panel** at:
   - https://www.iv.lt (or hosting provider dashboard)
   - Login with your credentials

2. **Configure DNS/Hosting for subdomain `klientas.iv.lt`:**
   - Go to Domain Management
   - Find DNS settings for `iv.lt`
   - Add/Update DNS record for `klientas`:
     ```
     Type: A Record (or CNAME)
     Name: klientas
     Value: [Your server IP or hosting provider's server IP]
     ```

3. **If using Vercel/Netlify (Recommended for fast setup):**
   - Push code to GitHub
   - Connect repository to Vercel/Netlify
   - Set custom domain to `klientas.iv.lt`
   - They'll provide DNS settings to update

---

## Phase 6: Deployment Options

### Option A: Vercel (Easiest - Free tier available)
1. Go to https://vercel.com
2. Sign in with GitHub
3. Import your `GoBalticTransport` repository
4. Set Environment Variables (if needed):
   - `PORT=3000`
5. Add custom domain: `klientas.iv.lt`
6. Vercel will show you DNS records to add in your hosting panel

### Option B: Netlify
1. Go to https://netlify.com
2. Connect GitHub account
3. Select your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy
6. Add custom domain: `klientas.iv.lt`

### Option C: Manual VPS Deployment
1. SSH into your VPS
2. Clone your repository:
   ```bash
   git clone https://github.com/USERNAME/GoBalticTransport.git
   cd GoBalticTransport
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Start the production server:
   ```bash
   npm start
   ```
6. Use PM2 to keep it running:
   ```bash
   npm install -g pm2
   pm2 start dist/index.js --name "gobaltic"
   pm2 startup
   pm2 save
   ```

---

## Quick Commands Reference

```bash
# Check Git status
git status

# View Git log
git log

# Add a new file to git
git add filename

# Commit changes
git commit -m "Your message here"

# Push to GitHub
git push

# Pull latest changes
git pull origin main

# Check remote repository
git remote -v
```

---

## Troubleshooting

### Git says "xcode-select: error: no such file"
Solution: Run `xcode-select --install` and wait for installation

### "fatal: not a git repository"
Solution: Make sure you're in the correct directory and ran `git init`

### "Permission denied (publickey)"
Solution: Add SSH key to GitHub:
```bash
ssh-keygen -t ed25519 -C "klaidas@iv.lt"
# Then add the public key to GitHub settings
```

### Domain not pointing to your site
Solution: Check DNS records are updated (can take 24 hours to propagate)

---

## Important Files in Your Project

- `package.json` - Node dependencies and scripts
- `server/index.ts` - Express server (starts on port 3000)
- `client/src/` - React frontend code
- `vite.config.ts` - Build configuration
- `.env` - Environment variables (create if needed)

---

## What Gets Deployed Live

1. **Frontend (React)** - Built from `client/src/`
2. **Backend (Express)** - From `server/index.ts`
3. **Assets** - Images and static files
4. **Environment** - Uses production build

The app will be accessible at: **https://klientas.iv.lt**

