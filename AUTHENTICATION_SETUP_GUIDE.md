# 🔐 Authentication System Setup Guide

## Current State
- ❌ Using localStorage (not secure, client-side only)
- ❌ No real user accounts
- ❌ Anyone can edit any tool
- ❌ Email verification is simulated

## Target State
- ✅ Real user authentication with email/password
- ✅ Secure database storing users and tools
- ✅ Only tool owners can edit their tools
- ✅ Email verification before submission
- ✅ Protected routes and API endpoints

---

## 🚀 Recommended Solution: Supabase

### Why Supabase?
1. **Free Forever Tier** - 50,000 monthly active users
2. **Built-in Authentication** - Email, OAuth (Google, GitHub, etc.)
3. **PostgreSQL Database** - Real relational database
4. **Row Level Security** - Built-in access control
5. **Real-time subscriptions** - Live data updates
6. **Easy to use** - Simple API and good documentation

---

## 📦 Step-by-Step Implementation

### Phase 1: Setup Supabase (15 minutes)

#### 1. Create Supabase Account
```bash
1. Go to https://supabase.com
2. Sign up for free account
3. Create a new project
4. Note down your project URL and anon key
```

#### 2. Install Supabase Client
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

#### 3. Add Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

### Phase 2: Database Schema

#### Create Tables in Supabase SQL Editor:

```sql
-- Users table (Supabase auth handles this automatically)

-- Tools table
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  overview TEXT NOT NULL,
  category TEXT NOT NULL,
  website TEXT NOT NULL,
  logo TEXT,
  video TEXT,
  pricing TEXT,
  use_cases TEXT[],
  pros TEXT[],
  cons TEXT[],
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  author_name TEXT NOT NULL,
  author_email TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  experience TEXT NOT NULL,
  pros TEXT[],
  cons TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Policies for tools table
-- Anyone can read tools
CREATE POLICY "Tools are viewable by everyone" 
  ON tools FOR SELECT 
  USING (true);

-- Only authenticated users can create tools
CREATE POLICY "Authenticated users can create tools" 
  ON tools FOR INSERT 
  WITH CHECK (auth.uid() = owner_id);

-- Only tool owners can update their tools
CREATE POLICY "Users can update their own tools" 
  ON tools FOR UPDATE 
  USING (auth.uid() = owner_id);

-- Only tool owners can delete their tools
CREATE POLICY "Users can delete their own tools" 
  ON tools FOR DELETE 
  USING (auth.uid() = owner_id);

-- Policies for reviews table
-- Anyone can read reviews
CREATE POLICY "Reviews are viewable by everyone" 
  ON reviews FOR SELECT 
  USING (true);

-- Authenticated users can create reviews
CREATE POLICY "Authenticated users can create reviews" 
  ON reviews FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews" 
  ON reviews FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews" 
  ON reviews FOR DELETE 
  USING (auth.uid() = user_id);
```

---

### Phase 3: Code Implementation

#### 1. Create Supabase Client (`src/lib/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```

#### 2. Create Auth Context (`src/context/AuthContext.tsx`)
```typescript
import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

type AuthContextType = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { name }
      }
    })
    if (error) throw error
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

#### 3. Create Login/Signup Pages
- `/pages/login.tsx` - Login form
- `/pages/signup.tsx` - Registration form
- `/pages/dashboard.tsx` - User dashboard showing their tools

#### 4. Update Submit Tool Page
- Check if user is authenticated before allowing submission
- Link tool to user's ID
- Show "Edit" button only for tool owner

#### 5. Protected Routes
```typescript
// HOC for protected pages
export function withAuth(Component: any) {
  return function ProtectedRoute(props: any) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login')
      }
    }, [loading, user])

    if (loading) return <div>Loading...</div>
    if (!user) return null

    return <Component {...props} />
  }
}
```

---

### Phase 4: Migration Strategy

#### Option A: Fresh Start (Recommended)
1. Deploy new authentication system
2. Require all users to create accounts
3. Existing tools remain as demo data
4. New tools require authentication

#### Option B: Migrate Existing Data
1. Create a migration script
2. Assign existing tools to a "demo" user
3. Send emails to tool owners to claim their tools
4. Verify ownership through email confirmation

---

## 🎯 Features After Implementation

### User Features:
- ✅ Sign up with email/password
- ✅ Email verification (automatic via Supabase)
- ✅ Login/Logout
- ✅ Password reset
- ✅ User dashboard
- ✅ View their submitted tools
- ✅ Edit only their tools
- ✅ Delete their tools

### Admin Features (Optional):
- ✅ Approve/reject tools
- ✅ Moderate reviews
- ✅ Ban users
- ✅ View analytics

---

## 💰 Cost Estimation

### Supabase Free Tier Limits:
- 50,000 monthly active users
- 500 MB database space
- 1 GB file storage
- Unlimited API requests
- Social OAuth providers

**Perfect for starting out - FREE!**

### When to Upgrade:
- Pro Plan: $25/month (100,000 MAU, 8 GB database)
- Only needed when you grow significantly

---

## 🔒 Security Benefits

### Current Issues Fixed:
1. ❌ localStorage can be manipulated → ✅ Server-side validation
2. ❌ No real user accounts → ✅ Proper authentication
3. ❌ Anyone can edit anything → ✅ Row-level security
4. ❌ Fake email verification → ✅ Real email verification
5. ❌ No data persistence → ✅ Real database

---

## 📚 Next Steps

### Immediate (Week 1):
1. Create Supabase account
2. Set up database schema
3. Install packages and configure
4. Create authentication pages (login/signup)
5. Test authentication flow

### Short-term (Week 2-3):
1. Update submit tool page to require auth
2. Link tools to user accounts
3. Add edit/delete buttons for owners only
4. Create user dashboard

### Long-term (Month 1-2):
1. Add OAuth providers (Google, GitHub)
2. Implement email notifications
3. Add admin panel
4. Analytics and insights

---

## 🆘 Need Help?

### Resources:
- Supabase Docs: https://supabase.com/docs
- Next.js Auth: https://supabase.com/docs/guides/auth/auth-helpers/nextjs
- Tutorial: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs

### Common Issues:
1. **CORS errors** → Check Supabase dashboard settings
2. **RLS policies** → Test in SQL editor first
3. **Email not sending** → Check Supabase email settings

---

## 🎉 Alternative: Quick Win with NextAuth.js

If you want to stay with your current setup but add basic auth:

```bash
npm install next-auth
```

Pros:
- Works with your current localStorage
- Quick to implement
- Multiple providers (Google, GitHub, etc.)

Cons:
- Still need a database for user data
- More manual setup than Supabase
- You handle security yourself

---

**Ready to implement? I can help you with each step!**
