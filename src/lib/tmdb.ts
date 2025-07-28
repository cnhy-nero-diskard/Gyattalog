import { TMDBSearchResponse, TMDBMovieDetails, TMDBTVDetails, MediaType, CatalogItem } from '@/types';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

if (!TMDB_API_KEY) {
  console.warn('TMDB API key not found. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local file');
}

class TMDBError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'TMDBError';
  }
}

async function makeRequest<T>(endpoint: string): Promise<T> {
  if (!TMDB_API_KEY) {
    throw new TMDBError('TMDB API key is not configured');
  }

  const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new TMDBError(`TMDB API error: ${response.statusText}`, response.status);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof TMDBError) {
      throw error;
    }
    throw new TMDBError('Failed to fetch data from TMDB API');
  }
}

export const tmdbAPI = {
  // Search for movies and TV shows
  async search(query: string, page = 1): Promise<TMDBSearchResponse> {
    const endpoint = `/search/multi?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;
    return makeRequest<TMDBSearchResponse>(endpoint);
  },

  // Search specifically for movies
  async searchMovies(query: string, page = 1): Promise<TMDBSearchResponse> {
    const endpoint = `/search/movie?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;
    return makeRequest<TMDBSearchResponse>(endpoint);
  },

  // Search specifically for TV shows
  async searchTV(query: string, page = 1): Promise<TMDBSearchResponse> {
    const endpoint = `/search/tv?query=${encodeURIComponent(query)}&page=${page}&include_adult=false`;
    return makeRequest<TMDBSearchResponse>(endpoint);
  },

  // Get movie details
  async getMovieDetails(id: number): Promise<TMDBMovieDetails> {
    const endpoint = `/movie/${id}`;
    return makeRequest<TMDBMovieDetails>(endpoint);
  },

  // Get TV show details
  async getTVDetails(id: number): Promise<TMDBTVDetails> {
    const endpoint = `/tv/${id}`;
    return makeRequest<TMDBTVDetails>(endpoint);
  },

  // Get popular movies
  async getPopularMovies(page = 1): Promise<TMDBSearchResponse> {
    const endpoint = `/movie/popular?page=${page}`;
    return makeRequest<TMDBSearchResponse>(endpoint);
  },

  // Get popular TV shows
  async getPopularTV(page = 1): Promise<TMDBSearchResponse> {
    const endpoint = `/tv/popular?page=${page}`;
    return makeRequest<TMDBSearchResponse>(endpoint);
  },

  // Get trending content
  async getTrending(mediaType: 'all' | 'movie' | 'tv' = 'all', timeWindow: 'day' | 'week' = 'day'): Promise<TMDBSearchResponse> {
    const endpoint = `/trending/${mediaType}/${timeWindow}`;
    return makeRequest<TMDBSearchResponse>(endpoint);
  },
};

// Image URL helpers
export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/placeholder-poster.jpg'; // You'll need to add a placeholder image
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};

export const getPosterUrl = (path: string | null): string => getImageUrl(path, 'w500');
export const getBackdropUrl = (path: string | null): string => getImageUrl(path, 'w1280');
export const getThumbnailUrl = (path: string | null): string => getImageUrl(path, 'w185');

// Utility functions
export const isMovie = (item: any): boolean => {
  return item.title !== undefined || item.media_type === 'movie';
};

export const isTVShow = (item: any): boolean => {
  return item.name !== undefined || item.media_type === 'tv';
};

export const getMediaType = (item: any): MediaType => {
  if (item.media_type) return item.media_type;
  return isMovie(item) ? 'movie' : 'tv';
};

export const getTitle = (item: any): string => {
  return item.title || item.name || 'Unknown Title';
};

export const getReleaseDate = (item: any): string => {
  return item.release_date || item.first_air_date || '';
};

export const formatReleaseDate = (dateString: string): string => {
  if (!dateString) return 'Unknown';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

export const formatYear = (dateString: string): string => {
  if (!dateString) return '';
  return dateString.split('-')[0];
};

// Convert TMDB item to CatalogItem
export const convertToCatalogItem = (tmdbItem: any, type: MediaType): CatalogItem => {
  return {
    id: tmdbItem.id,
    type,
    title: tmdbItem.title || tmdbItem.name,
    poster_path: tmdbItem.poster_path,
    overview: tmdbItem.overview,
    release_date: tmdbItem.release_date || tmdbItem.first_air_date || '',
    vote_average: tmdbItem.vote_average,
    dateAdded: new Date().toISOString(),
  };
};

export { TMDBError };
