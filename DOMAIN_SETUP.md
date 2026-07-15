# Domain Configuration Guide - klientas.iv.lt

## Your Current Situation

- **Domain**: `klientas.iv.lt`
- **Registrar/Hosting**: Interneto vizija (https://www.iv.lt)
- **Current Status**: Domain active, registered to UAB "GoBaltic"

---

## Step 1: Access Your Hosting Control Panel

1. Visit: https://www.iv.lt
2. Login to your account (or use https://saugiotas.iv.lt for email access)
3. Look for "Domain Management" or "DNS Settings"

**Your domain info:**
- Domain: gobaltic.lt
- DNS Servers (shown in your info):
  - ns1.serveriai.lt (79.98.25.142)
  - ns2.serveriai.lt (79.98.29.142)
  - ns3.serveriai.lt (162.159.24.19)
  - ns4.serveriai.lt (162.159.25.253)

---

## Step 2: Choose Your Deployment Method & Configure DNS

### Option 1: Using Vercel (RECOMMENDED for beginners)

**Advantages:**
- Free tier
- Automatic HTTPS
- Simple setup
- Automatic deployments on GitHub push
- Great performance

**Steps:**

1. Go to https://vercel.com/signup (sign up with GitHub)
2. Import your `GoBalticTransport` repository
3. Vercel deploys automatically
4. Go to Project Settings → Domains
5. Add custom domain: `klientas.iv.lt`
6. Vercel shows you DNS records needed

**Update DNS in Interneto vizija panel:**
- Type: CNAME or A record
- Name: `klientas`
- Value: (as provided by Vercel)

---

### Option 2: Using Netlify

**Steps:**
1. Visit https://app.netlify.com
2. Click "Import an existing project" → "GitHub"
3. Select your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy
6. Site settings → Domain management → Add custom domain
7. Add DNS records as shown

---

### Option 3: Manual VPS (if you have a server)

**If you have a VPS with IP address:**

1. In Interneto vizija DNS panel, add:
   ```
   Type: A Record
   Name: klientas
   Value: [Your VPS IP Address]
   TTL: 3600
   ```

2. SSH into your VPS:
   ```bash
   ssh root@[your-vps-ip]
   ```

3. Clone and setup:
   ```bash
   git clone https://github.com/USERNAME/GoBalticTransport.git
   cd GoBalticTransport
   npm install
   npm run build
   npm start
   ```

4. Setup SSL with Let's Encrypt:
   ```bash
   sudo apt install certbot
   certbot certonly --standalone -d klientas.iv.lt
   ```

---

## Step 3: DNS Propagation

After adding DNS records:
- **Takes 15 minutes to 24 hours** for global propagation
- Check status: https://dnschecker.org/
- Enter: `klientas.iv.lt`

---

## Step 4: Test Your Setup

Once DNS propagates, visit in browser:
```
https://klientas.iv.lt
```

Should show your GoBaltic Transport website.

---

## Troubleshooting DNS

### Check DNS is pointing correctly:
```bash
nslookup klientas.iv.lt
dig klientas.iv.lt
```

### Check if site is live:
```bash
curl -I https://klientas.iv.lt
```

### Clear DNS cache (Mac):
```bash
sudo dscacheutil -flushcache
```

---

## SSL/HTTPS Certificate

- **Vercel/Netlify**: Automatic ✓
- **Manual VPS**: Use Let's Encrypt (free)
- **Your domain**: Should redirect to HTTPS automatically

---

## Performance Tips

1. Enable CDN (Vercel/Netlify do this automatically)
2. Optimize images in `attached_assets/`
3. Monitor at:
   - Vercel Dashboard
   - PageSpeed Insights: https://pagespeed.web.dev/

---

## Monthly Monitoring Checklist

- [ ] Check site loads on https://klientas.iv.lt
- [ ] Test contact form submissions to Formspree
- [ ] Review analytics if enabled
- [ ] Verify SSL certificate is valid
- [ ] Check GitHub is synced with deployed version

---

## Important: After First Push to GitHub

Once code is on GitHub:

```bash
# Your repo URL will be:
https://github.com/klaidas/GoBalticTransport

# To redeploy after changes:
git add .
git commit -m "description of changes"
git push origin main

# If using Vercel/Netlify - automatic deployment starts!
```

