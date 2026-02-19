# IoT Club Website

A futuristic, high-performance website for the IoT Club, built with **React**, **Vite**, and **Tailwind CSS**.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Building for Production
To build the project for production deployment:
```bash
npm run build
```
The output will be in the `dist/` directory, ready to be deployed to any static hosting service (Vercel, Netlify, GitHub Pages).

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/       # Navbar, Footer, Layout wrapper
│   ├── ui/           # Reusable components (Button, Card, ErrorBoundary)
│   └── sections/     # Page-specific sections (if any)
├── data/             # Content data (Projects, Team)
├── pages/            # Page components (Home, About, Projects, etc.)
├── App.jsx           # Main router setup
└── main.jsx          # Entry point
```

## 📝 Editing Content

To update the website content, edit the files in `src/data/`:

- **Projects**: Edit `src/data/projects.js`
- **Team Members**: Edit `src/data/team.js`

For page-specific text:
- **Events**: Edit `src/pages/Events.jsx`
- **About/Mission**: Edit `src/pages/About.jsx`
- **Home Hero**: Edit `src/pages/Home.jsx`

## 🎨 Styling

The project uses Tailwind CSS with a custom "Neon" theme.
Configuration can be found in `tailwind.config.js`.

Global styles and animations are in `src/index.css`.

## 🛡️ Fail-Safe Features

- **Error Boundary**: Catches app crashes and shows a recovery UI.
- **404 Page**: Custom "Page Not Found" with navigation back to home.
- **Form Validation**: Contact form handles empty states and simulates submission.
- **Empty States**: Projects page handles empty filter results gracefully.
