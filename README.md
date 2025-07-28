# Movie & TV Catalog

A personal movie and TV show cataloging application built with Next.js. This single-user application helps you organize your watchlist, track what you've watched, and create custom lists—all stored locally in a JSON file.

## Features

- **🔍 Search**: Find movies and TV shows using the TMDB API
- **📝 Watchlist**: Add items to your personal watchlist
- **✅ Watched**: Mark items as watched with ratings, dates, and notes
- **📋 Custom Lists**: Create and manage custom lists for different categories
- **💾 Local Storage**: All data stored in a local `catalog.json` file
- **🎨 Modern UI**: Clean, responsive design with Tailwind CSS
- **🌙 Dark Mode**: Support for light and dark themes

## Architecture

This is a **Next.js application** with:
- **Frontend**: React components with TypeScript
- **Backend**: Next.js API routes for file operations
- **Storage**: Local JSON file (`data/catalog.json`)
- **External API**: TMDB (The Movie Database) for movie/TV data

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A TMDB API key (free at [themoviedb.org](https://www.themoviedb.org/settings/api))

### Installation

1. **Clone or download this project**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env.local`
   - Add your TMDB API key:
     ```
     NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
     ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** to [http://localhost:3000](http://localhost:3000)

## How to Get a TMDB API Key

1. Go to [themoviedb.org](https://www.themoviedb.org/) and create a free account
2. Navigate to your account settings
3. Click on "API" in the left sidebar
4. Request an API key (choose "Developer" option)
5. Fill out the form with your project details
6. Copy the API key to your `.env.local` file

## Usage

### Search and Discovery
- Use the search bar on the home page to find movies and TV shows
- Filter by content type (All, Movies, TV Shows)
- Click on any item to view detailed information

### Managing Your Catalog
- **Add to Watchlist**: Click the "Add to Watchlist" button on any item
- **Mark as Watched**: Use the "Mark as Watched" button to record what you've seen
  - Add your own 1-5 star rating
  - Set the date you watched it
  - Add personal notes
- **Custom Lists**: Create themed lists like "Favorites", "To Watch with Friends", etc.

### Viewing Your Catalog
- Visit the "My Catalog" page to see all your saved items
- Switch between Watchlist, Watched, and Custom Lists
- Sort by date added, title, rating, or release date
- Filter by content type (movies vs TV shows)

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── api/catalog/     # API route for data persistence
│   ├── catalog/         # Catalog view page
│   ├── details/         # Item detail pages
│   └── layout.tsx       # Root layout
├── components/          # React components
│   ├── MediaCard.tsx    # Movie/TV show card component
│   ├── SearchComponent.tsx
│   └── CatalogView.tsx
├── contexts/            # React context for state management
│   └── CatalogContext.tsx
├── lib/                 # Utility functions
│   ├── tmdb.ts         # TMDB API integration
│   └── catalog.ts      # Catalog operations
└── types/               # TypeScript type definitions
    └── index.ts
```

## Data Storage

All your catalog data is stored in `data/catalog.json` with the following structure:

```json
{
  "watchlist": [...],
  "watched": [...],
  "customLists": [...],
  "lastUpdated": "2025-01-28T..."
}
```

This file is automatically created when you first use the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Technologies Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **TMDB API** - Movie and TV show data
- **React Context** - State management
- **Node.js fs** - File system operations

## Contributing

This is a personal project template, but feel free to fork and customize it for your own needs!

## License

This project is for educational and personal use. Movie and TV show data is provided by [The Movie Database (TMDB)](https://www.themoviedb.org/).

---

**Note**: This application is designed for single-user, local use. All data is stored locally on your machine.
