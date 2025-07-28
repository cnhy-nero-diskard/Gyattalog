# Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a Next.js movie/TV catalog application with the following key characteristics:

- **Framework**: Next.js 15 with App Router and TypeScript
- **Styling**: Tailwind CSS
- **External API**: TMDB (The Movie Database) API for movie/TV data
- **Data Storage**: Local file-based storage using `catalog.json`
- **Architecture**: Single-user application with no authentication required

## Key Features
- Search movies/TV shows using TMDB API
- Add items to Watchlist
- Mark items as Watched (with rating and date)
- Create custom lists
- View detailed information about movies/TV shows

## Code Guidelines
- Use TypeScript strictly with proper type definitions
- Implement React Server Components where appropriate
- Use Tailwind CSS for all styling
- Follow Next.js App Router conventions
- Keep API routes minimal and focused on file operations
- Use React hooks (useState, useEffect, useContext) for state management
- Implement proper error handling for API calls
- Ensure responsive design for all components

## File Structure
- `/src/app` - App Router pages and layouts
- `/src/app/api` - API routes for catalog operations
- `/src/components` - Reusable React components
- `/src/types` - TypeScript type definitions
- `/src/lib` - Utility functions and API helpers
- `/data` - Local storage directory for catalog.json

## TMDB API Integration
- Use environment variables for API keys
- Implement proper error handling for external API calls
- Cache responses when appropriate
- Follow TMDB API rate limits and best practices
