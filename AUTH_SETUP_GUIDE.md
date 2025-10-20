# GULL Authentication Setup Guide

## 🚀 Quick Start

GULL works out of the box in **OFFLINE MODE** - no configuration required! Just run:

```bash
npm run dev
```

Open `http://localhost:5173` and click **"Continue as Guest"** to start immediately.

---

## 🌐 Enable Online Mode (Optional)

To use Supabase for cloud authentication and future multi-device sync:

### Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up / Sign in
3. Click **"New Project"**
4. Choose organization
5. Set project name (e.g., "gull-accounting")
6. Set database password
7. Choose region
8. Click **"Create new project"**
9. Wait 1-2 minutes for provisioning

### Step 2: Get API Credentials

1. In your Supabase project dashboard
2. Click **"Settings"** (gear icon, bottom left)
3. Click **"API"** in the sidebar
4. Copy:
   - **Project URL** (`https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### Step 3: Configure GULL

1. Create a `.env` file in the project root:

```bash
# Create .env file
touch .env
```

2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ENABLE_OFFLINE_MODE=false
```

**Important:** Replace `your-project-id` and `your-anon-key-here` with your actual values!

3. Restart the dev server:

```bash
npm run dev
```

4. Done! GULL now uses Supabase authentication.

---

## 🔒 Authentication Modes

### Offline Mode (Default)

**When it activates:**
- No `.env` file exists
- `.env` file has `VITE_ENABLE_OFFLINE_MODE=true`
- Supabase URL or key is missing

**Features:**
- ✅ Works without internet
- ✅ No server required
- ✅ Guest mode works
- ✅ Email/password "registration" (local only)
- ✅ Data stored in browser localStorage
- ❌ No cross-device sync
- ❌ Data lost if localStorage cleared

**Best for:**
- Development
- Demos
- Offline use
- Quick testing

### Online Mode (with Supabase)

**When it activates:**
- `.env` file exists with valid credentials
- `VITE_ENABLE_OFFLINE_MODE=false` (or omitted)

**Features:**
- ✅ Real authentication
- ✅ Email verification
- ✅ Password reset (future)
- ✅ Secure token management
- ✅ Cross-device ready (Phase 6)
- ✅ Cloud data backup (Phase 6)
- ✅ Guest mode (if enabled in Supabase)

**Best for:**
- Production
- Multi-device use
- Cloud backup
- Real deployment

---

## 🎯 Authentication Options

### 1. Guest Mode (Anonymous)

**How to use:**
1. Click **"Continue as Guest"**
2. Instant access, no registration

**Data storage:**
- Offline mode: Browser localStorage
- Online mode: Supabase anonymous users (if enabled)

**Use case:**
- Quick trials
- Testing features
- No commitment needed

### 2. Email/Password Registration

**How to use:**
1. Click **"Create New Account"**
2. Enter display name (optional)
3. Enter email
4. Enter password (6+ characters)
5. Click **"Create Account"**

**Data storage:**
- Offline mode: Local "account" in localStorage
- Online mode: Real Supabase user with encrypted password

**Use case:**
- Regular use
- Want to identify account
- Future: cross-device sync

### 3. Email/Password Sign In

**How to use:**
1. Click **"Sign In with Email"**
2. Enter email
3. Enter password
4. Click **"Sign In"**

**Works when:**
- You previously created an account
- Offline mode: Email matches local account
- Online mode: Supabase validates credentials

---

## 🔐 Security Notes

### Offline Mode Security
- Passwords NOT encrypted in localStorage
- Data visible in browser DevTools
- **Not recommended for sensitive data**
- Only use for testing/development

### Online Mode Security
- ✅ Passwords hashed by Supabase
- ✅ Secure token management
- ✅ HTTPS encryption
- ✅ No passwords in localStorage
- ✅ Production-ready

---

## 🛠️ Troubleshooting

### "Authentication failed" error

**Offline mode:**
- Check: Is email correct?
- Try: Create new account instead
- Solution: Clear localStorage and try again

**Online mode:**
- Check: Are credentials correct?
- Check: Is `.env` file configured?
- Check: Restart dev server after .env changes
- Check: Is Supabase project active?

### "No redirect after sign in"

- Check browser console for errors
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Clear localStorage: `localStorage.clear()` in console
- Restart dev server

### "Cannot read properties of null"

- Clear localStorage
- Restart browser
- Restart dev server
- Check network tab for failed API calls

### "Offline Mode" badge always shows

**If you want online mode:**
- Check `.env` file exists
- Check `VITE_SUPABASE_URL` is set
- Check `VITE_SUPABASE_ANON_KEY` is set
- Check `VITE_ENABLE_OFFLINE_MODE` is `false` or omitted
- Restart dev server

**If offline mode is intentional:**
- This is normal! Badge shows current mode.

---

## 📱 Using the App

### After Sign In

1. **Project Selection Page**
   - See profile button (top right)
   - Shows your name/email
   - Click to go to profile

2. **Creating Projects**
   - Works exactly as before
   - Now tied to your user account
   - (Phase 6 will add cloud sync)

3. **Profile Management**
   - Click profile button
   - Edit display name
   - View account details
   - Sign out

### Signing Out

1. Go to Profile page
2. Scroll to "Danger Zone"
3. Click **"Sign Out"**
4. Confirm
5. Redirected to Welcome page

---

## 🔄 Switching Modes

### From Offline → Online

1. Create `.env` file with Supabase credentials
2. Restart dev server
3. **Warning:** Existing offline data won't auto-sync
4. You'll need to recreate projects in online mode

### From Online → Offline

1. Delete `.env` file OR set `VITE_ENABLE_OFFLINE_MODE=true`
2. Restart dev server
3. **Warning:** Online data won't be accessible offline (until Phase 6)

---

## 🚀 Deployment Notes

### Deploying to Production

When deploying (Vercel, Netlify, etc.):

1. Add environment variables in hosting platform
2. Set:
   - `VITE_SUPABASE_URL=your-url`
   - `VITE_SUPABASE_ANON_KEY=your-key`
   - `VITE_ENABLE_OFFLINE_MODE=false`

3. **Do NOT** commit `.env` to git
4. `.env` is in `.gitignore`

### Supabase Setup for Production

1. Enable Email Auth:
   - Go to Authentication → Providers
   - Enable "Email"
   - Configure email templates

2. (Optional) Enable Anonymous Sign In:
   - Go to Authentication → Providers
   - Enable "Anonymous sign-ins"

3. Configure Site URL:
   - Go to Authentication → URL Configuration
   - Set "Site URL" to your production URL
   - Add redirect URLs

---

## 📊 Data Storage

### Current (Phase 5)

**Offline Mode:**
```
localStorage
  ├── gull-auth-user (user info)
  ├── gull-projects (all projects)
  └── gull-preferences (theme, etc.)
```

**Online Mode:**
```
Supabase Auth
  └── User account (email, password hash)

localStorage (still used)
  ├── gull-auth-user (cached user info)
  ├── gull-projects (local projects)
  └── gull-preferences (theme, etc.)
```

### Future (Phase 6)

```
Supabase Database
  ├── users (profile data)
  ├── projects (user-owned)
  └── transactions (user-owned)

localStorage
  └── Only for offline cache
```

---

## 💡 Tips

1. **Development:** Use offline mode for speed
2. **Testing auth:** Use online mode with Supabase
3. **Demos:** Offline mode perfect for presentations
4. **Production:** Always use online mode with Supabase

---

## 🆘 Support

If you encounter issues:

1. Check this guide first
2. Check browser console for errors
3. Check network tab for failed requests
4. Try clearing localStorage
5. Try incognito/private mode
6. Restart dev server
7. Check Supabase dashboard logs (online mode)

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**Ready to use GULL?** Just run `npm run dev` and you're good to go! 🚀

