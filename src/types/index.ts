// TMDB API Types
export interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  popularity: number;
  video: boolean;
}

export interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  popularity: number;
  origin_country: string[];
}

export interface TMDBSearchResponse {
  page: number;
  results: (TMDBMovie | TMDBTVShow)[];
  total_pages: number;
  total_results: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBMovieDetails extends TMDBMovie {
  genres: TMDBGenre[];
  runtime: number | null;
  status: string;
  tagline: string | null;
  budget: number;
  revenue: number;
  imdb_id: string | null;
  production_companies: Array<{
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }>;
}

export interface TMDBTVDetails extends TMDBTVShow {
  genres: TMDBGenre[];
  episode_run_time: number[];
  status: string;
  tagline: string | null;
  number_of_episodes: number;
  number_of_seasons: number;
  seasons: Array<{
    id: number;
    name: string;
    poster_path: string | null;
    season_number: number;
    episode_count: number;
    air_date: string;
  }>;
  networks: Array<{
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }>;
}

// Application Types
export type MediaType = 'movie' | 'tv';

export interface CatalogItem {
  id: number;
  type: MediaType;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  dateAdded: string;
}

export interface WatchedItem extends CatalogItem {
  userRating?: number; // 1-5 stars
  watchedDate: string;
  notes?: string;
}

export interface CustomList {
  id: string;
  name: string;
  description?: string;
  items: CatalogItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Catalog {
  watchlist: CatalogItem[];
  watched: WatchedItem[];
  customLists: CustomList[];
  lastUpdated: string;
}

// Component Props Types
export interface SearchResultsProps {
  results: (TMDBMovie | TMDBTVShow)[];
  loading: boolean;
  onItemClick: (item: TMDBMovie | TMDBTVShow, type: MediaType) => void;
}

export interface MediaCardProps {
  item: TMDBMovie | TMDBTVShow | CatalogItem;
  type: MediaType;
  onClick: () => void;
  showAddButton?: boolean;
  onAddToWatchlist?: () => void;
}

export interface CatalogContextType {
  catalog: Catalog;
  updateCatalog: (newCatalog: Catalog) => Promise<void>;
  addToWatchlist: (item: CatalogItem) => Promise<void>;
  removeFromWatchlist: (id: number, type: MediaType) => Promise<void>;
  markAsWatched: (item: WatchedItem) => Promise<void>;
  removeFromWatched: (id: number, type: MediaType) => Promise<void>;
  createCustomList: (name: string, description?: string) => Promise<string>;
  addToCustomList: (listId: string, item: CatalogItem) => Promise<void>;
  removeFromCustomList: (listId: string, itemId: number, type: MediaType) => Promise<void>;
  deleteCustomList: (listId: string) => Promise<void>;
  loading: boolean;
}

// Utility Types
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
