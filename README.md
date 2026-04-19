# DevPort - Futuristic Developer Portfolio

A modern, futuristic personal portfolio website with dual-mode UI (Terminal & Website) built with Next.js, Tailwind CSS, and Framer Motion.

## Features

- **Dual Mode UI**: Switch between Terminal mode and Website mode
- **Terminal Mode**: Interactive command-line interface with fake CLI commands
- **Website Mode**: Modern, clean portfolio UI with glassmorphism design
- **Smooth Animations**: Powered by Framer Motion
- **Responsive**: Fully responsive design

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Commands

In Terminal mode, you can use these commands:

- `help` - Show available commands
- `about` - About me
- `skills` - Technical skills
- `projects` - Featured projects
- `resume` - View/Download CV
- `contact` - Contact info
- `clear` - Clear terminal
- `gui` - Switch to Website mode

## Customization

### Update Personal Information

Edit the following files to customize content:

- `src/components/sections/Hero.tsx` - Name, role, tagline
- `src/components/sections/About.tsx` - Bio
- `src/components/sections/Skills.tsx` - Skills grid
- `src/components/sections/Projects.tsx` - Projects
- `src/components/sections/Contact.tsx` - Email, social links
- `src/components/terminal/Terminal.tsx` - Terminal data

### Update Colors

Colors are defined in `src/app/globals.css`:

```css
:root {
  --primary: #22d3ee;      /* Cyan */
  --accent: #a78bfa;       /* Purple */
  --background: #020617;      /* Dark background */
  --background-end: #0f172a; /* Lighter background */
}
```

## Keyboard Shortcuts

- `Ctrl + ``` - Toggle between Terminal and Website mode

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in Vercel
3. Deploy with default settings

### Other Platforms

Build for production:

```bash
npm run build
```

Start production server:

```bash
npm start
```

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Lucide React](https://lucide.dev/) - Icons

## License

MIT