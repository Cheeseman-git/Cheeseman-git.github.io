# Copilot Instructions for CheeseMan Games

## Project Overview

This is a static website for "CheeseMan Games" hosted on GitHub Pages. It's a gaming portal with multiple browser-based games organized into different categories.

## Architecture

### Directory Structure
- `index.html` - Main landing page with tabbed navigation (Home, Games, Community, Socials, Credits, Settings)
- `games/` - Contains all game pages, organized into:
  - `full/` - Complete/polished games (Sketchy Casino, Cube Combat)
  - `slop/` - Experimental/prototype games (Fent Sim, GD Clone, GD Editor, Legacy Casino)
  - `test/` - Development/test games (Asset Flip 7, Cube Combat 2, UCLID-OBJ)
- `css/` - Global stylesheets
- `js/` - Global JavaScript (navigation, theming, tailwind config)
- `assets/` - Shared images

### Styling System
- Uses **Tailwind CSS via CDN** (not locally installed)
- Custom color theme defined via CSS variables in `js/tailwind-config.js`:
  - `cheeseman-base`, `cheeseman-card`, `cheeseman-highlight`, `cheeseman-primary`, `cheeseman-accent`
  - `cheeseman-muted`, `cheeseman-content` (for text)
- Theme switching is supported via `data-theme` attribute on `<html>`
- Uses Font Awesome for icons and Google Fonts (Outfit)

### Navigation Pattern
- Main site uses a SPA-like tab system via `switchTab()` function in `index.js`
- Each "view" is a hidden section toggled by ID (`view-home`, `view-games`, etc.)
- Games open as separate HTML pages, not in-page tabs

### Individual Game Structure
Each game in `games/` typically has:
- An HTML file at the category root (e.g., `games/full/sketchy-casino.html`)
- A corresponding folder with game-specific assets (e.g., `games/full/sketchy-casino/`)
- Its own `css/` and `js/` subfolders when needed

## Conventions

### File Naming (IMPORTANT for GitHub Pages)
**All paths must be lowercase** - GitHub Pages runs on Linux which is case-sensitive.
- Folders: lowercase with hyphens (`games/`, `css/`, `js/`, `assets/`)
- HTML files: lowercase with hyphens (`sketchy-casino.html`, `cube-combat-2.html`)
- CSS/JS files: lowercase with hyphens (`sketchy-casino.css`, `cube-combat.js`)

### Adding New Games
1. Create the game HTML file in the appropriate category folder (`full/`, `slop/`, or `test/`)
2. Create a corresponding asset folder (lowercase) if needed
3. Add navigation link in the parent index or hub page
4. Include Tailwind CDN for consistent styling: `<script src="https://cdn.tailwindcss.com"></script>`

### Local Storage Keys
User preferences are stored with `cheeseman-` prefix:
- `cheeseman-theme` - Selected color theme
- `cheeseman-setting-{name}` - Boolean settings (e.g., `reducedMotion`, `showFps`)
