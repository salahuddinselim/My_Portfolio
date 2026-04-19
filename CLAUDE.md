# DevPort - Futuristic Interactive Developer Portfolio

## Project Overview

DevPort is a modern, dual-mode personal portfolio website for developers. It features a unique **Terminal Mode** (interactive command-line interface) and a **Website Mode** (visual portfolio UI) with full admin panel for content management.

- **Tech Stack**: Next.js 16, TypeScript, Tailwind CSS, Framer Motion, Supabase
- **Target Users**: Developers showcasing their work to potential employers/clients

---

## Key Features

### 1. Dual Mode Interface

| Mode | Description |
|------|-------------|
| Terminal | Interactive CLI with fake terminal commands |
| Website | Visual portfolio with Hero, About, Skills, Projects, Contact |

- Toggle with floating button or `Ctrl + `` keyboard shortcut

### 2. Terminal Mode Commands

```
help      - Show all commands
about     - Display bio
skills    - List technical skills  
projects  - Show projects with tech stack
resume    - View/Download CV
contact   - Contact information
clear     - Clear terminal
gui       - Switch to Website mode
```

### 3. Website Sections

1. **Hero** - Name, role, tagline, CTA buttons
2. **About** - Bio paragraph with tech tags
3. **Skills** - Grid by category (Frontend, Backend, Tools)
4. **Projects** - Cards with image, description, tech stack, GitHub/Live links
5. **Resume** - Download CV button
6. **Contact** - Email contact form + social links (GitHub, LinkedIn, Twitter/X, Facebook, Instagram)

---

## Admin Panel

**Base URL**: `/admin`

### Pages

| Page | Path | Function |
|------|------|----------|
| Login | `/admin/login` | Supabase auth sign in |
| Dashboard | `/admin/dashboard` | Overview stats |
| Profile | `/admin/profile` | Personal info editor |
| Projects | `/admin/projects` | Project CRUD |
| Blog Posts | `/admin/blogs` | Blog CRUD |

### Admin Features

- **Dual image upload**: URL link OR file upload (PNG/JPG/GIF up to 5MB)
- **Profile fields**: Name, Role, Bio, Vision, Location, Profile Image, Email, Contact Email, Social Links
- **Social platforms**: GitHub, LinkedIn, Twitter/X, Facebook, Instagram
- **Contact email**: Separate from login email for receiving messages

---

## Database Schema (Supabase)

### Tables

```sql
profiles (
  id uuid PRIMARY KEY,
  name text,
  role text,
  bio text,
  vision text,
  location text,
  profile_image text,
  email text,
  contact_email text,
  github_link text,
  linkedin_link text,
  twitter_link text,
  facebook_link text,
  instagram_link text,
  created_at timestamptz,
  updated_at timestamptz
)

projects (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  description text,
  tech_stack text[],
  github_link text,
  live_link text,
  image text,
  category text,
  featured boolean,
  created_at timestamptz,
  updated_at timestamptz
)

blogs (
  id uuid PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text,
  excerpt text,
  cover_image text,
  tags text[],
  published boolean,
  created_at timestamptz,
  updated_at timestamptz
)
```

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel settings
4. Deploy

### Build Commands

```bash
npm install     # Install dependencies
npm run dev     # Development server (http://localhost:3000)
npm run build   # Production build
npm start       # Production server
```

---

## File Structure

```
src/
├── app/
│   ├── page.tsx              # Main portfolio page
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   │
│   ├── admin/
│   │   ├── layout.tsx       # Admin layout with auth
│   │   ├── login/          # Login page
│   │   ├── dashboard/      # Admin dashboard
│   │   ├── profile/       # Profile editor
│   │   ├── projects/      # Projects CRUD
│   │   └── blogs/         # Blog posts CRUD
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx      # Site header
│   │   └── ModeToggle.tsx  # Mode switcher
│   │
│   ├── sections/
│   │   ├── Hero.tsx        # Hero section
│   │   ├── About.tsx       # About section
│   │   ├── Skills.tsx      # Skills section
│   │   ├── Projects.tsx    # Projects grid
│   │   ├── Resume.tsx      # Resume section
│   │   └── Contact.tsx     # Contact section
│   │
│   ├── terminal/
│   │   └── Terminal.tsx    # Interactive terminal
│   │
│   └── ui/
│       └── Icons.tsx      # Icon components
│
├── context/
│   └── AdminContext.tsx    # Auth context
│
└── lib/
    └── supabase.ts        # Supabase client
```

---

## Customization Guide

### 1. Update Personal Info

Edit in `/admin/profile`:
- Name, Role, Bio, Vision
- Profile image (URL or upload)
- Contact email (for messages)

### 2. Add Projects

Go to `/admin/projects` → "Add Project":
- Title, Description
- Tech stack (comma separated)
- Image (URL or upload)
- Category, Featured flag
- GitHub & Live links

### 3. Write Blog Posts

Go to `/admin/blogs` → "Add Post":
- Title, Slug (auto-generated)
- Content (Markdown)
- Excerpt, Tags
- Cover image (URL or upload)
- Published/Draft toggle

### 4. Colors & Styling

Modify in `src/app/globals.css`:

```css
:root {
  --primary: #22d3ee;      /* Cyan */
  --accent: #a78bfa;       /* Purple */
  --background: #020617;    /* Dark background */
}
```

---

## Design System

- **Background**: Dark gradient (#020617 → #0f172a)
- **Primary**: Cyan (#22d3ee)
- **Accent**: Purple (#a78bfa)
- **Typography**: JetBrains Mono (terminal), Geist (UI)
- **Effects**: Glassmorphism, glow shadows, smooth animations
- **Border Radius**: xl to 2xl
- **Animations**: Framer Motion (fade, slide, scale)

---

## Credits

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lucide React](https://lucide.dev/) - Icons
- [Supabase](https://supabase.com/) - Database & Auth

---

## License

MIT