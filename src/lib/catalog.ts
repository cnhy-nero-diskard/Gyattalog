import { Catalog, CatalogItem, WatchedItem, CustomList, MediaType } from '@/types';

// Default empty catalog structure
export const createEmptyCatalog = (): Catalog => ({
  watchlist: [],
  watched: [],
  customLists: [],
  lastUpdated: new Date().toISOString(),
});

// Generate unique ID for custom lists
export const generateListId = (): string => {
  return `list_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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

// Check if item exists in watchlist
export const isInWatchlist = (catalog: Catalog, id: number, type: MediaType): boolean => {
  return catalog.watchlist.some(item => item.id === id && item.type === type);
};

// Check if item exists in watched list
export const isWatched = (catalog: Catalog, id: number, type: MediaType): boolean => {
  return catalog.watched.some(item => item.id === id && item.type === type);
};

// Check if a specific season is watched
export const isSeasonWatched = (catalog: Catalog, id: number, seasonNumber: number): boolean => {
  const tvShow = catalog.watched.find(item => item.id === id && item.type === 'tv');
  if (!tvShow || !tvShow.seasons) return false;
  return tvShow.seasons.some(season => season.seasonNumber === seasonNumber);
};

// Check if a TV show has any watched seasons
export const hasWatchedSeasons = (item: WatchedItem): boolean => {
  return item.type === 'tv' && !!item.seasons && item.seasons.length > 0;
};

// Find item in custom lists
export const findInCustomLists = (catalog: Catalog, id: number, type: MediaType): CustomList[] => {
  return catalog.customLists.filter(list => 
    list.items.some(item => item.id === id && item.type === type)
  );
};

// Get all items from catalog (for search/filtering)
export const getAllCatalogItems = (catalog: Catalog): CatalogItem[] => {
  const allItems: CatalogItem[] = [];
  
  // Add watchlist items
  allItems.push(...catalog.watchlist);
  
  // Add watched items
  allItems.push(...catalog.watched);
  
  // Add items from custom lists (avoiding duplicates)
  catalog.customLists.forEach(list => {
    list.items.forEach(item => {
      if (!allItems.find(existing => existing.id === item.id && existing.type === item.type)) {
        allItems.push(item);
      }
    });
  });
  
  return allItems;
};

// Sort functions
export const sortByDateAdded = (items: CatalogItem[], ascending = false) => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.dateAdded).getTime();
    const dateB = new Date(b.dateAdded).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const sortByTitle = (items: CatalogItem[], ascending = true) => {
  return [...items].sort((a, b) => {
    const comparison = a.title.localeCompare(b.title);
    return ascending ? comparison : -comparison;
  });
};

export const sortByRating = (items: CatalogItem[], ascending = false) => {
  return [...items].sort((a, b) => {
    const comparison = a.vote_average - b.vote_average;
    return ascending ? comparison : -comparison;
  });
};

export const sortByReleaseDate = (items: CatalogItem[], ascending = false) => {
  return [...items].sort((a, b) => {
    if (!a.release_date && !b.release_date) return 0;
    if (!a.release_date) return 1;
    if (!b.release_date) return -1;
    
    const dateA = new Date(a.release_date).getTime();
    const dateB = new Date(b.release_date).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

// Filter functions
export const filterByType = (items: CatalogItem[], type: MediaType) => {
  return items.filter(item => item.type === type);
};

export const filterByTitle = (items: CatalogItem[], searchTerm: string) => {
  if (!searchTerm.trim()) return items;
  const term = searchTerm.toLowerCase();
  return items.filter(item => 
    item.title.toLowerCase().includes(term) ||
    item.overview.toLowerCase().includes(term)
  );
};

// Statistics functions
export const getCatalogStats = (catalog: Catalog) => {
  const totalItems = getAllCatalogItems(catalog).length;
  const watchlistCount = catalog.watchlist.length;
  const watchedCount = catalog.watched.length;
  const customListsCount = catalog.customLists.length;
  
  const movieCount = getAllCatalogItems(catalog).filter(item => item.type === 'movie').length;
  const tvShowCount = getAllCatalogItems(catalog).filter(item => item.type === 'tv').length;
  
  const averageRating = catalog.watched.length > 0 
    ? catalog.watched
        .filter(item => item.userRating)
        .reduce((sum, item) => sum + (item.userRating || 0), 0) / 
      catalog.watched.filter(item => item.userRating).length
    : 0;
  
  return {
    totalItems,
    watchlistCount,
    watchedCount,
    customListsCount,
    movieCount,
    tvShowCount,
    averageRating: Math.round(averageRating * 10) / 10,
  };
};

// Validation functions
export const validateCatalog = (catalog: any): catalog is Catalog => {
  return (
    catalog &&
    typeof catalog === 'object' &&
    Array.isArray(catalog.watchlist) &&
    Array.isArray(catalog.watched) &&
    Array.isArray(catalog.customLists) &&
    typeof catalog.lastUpdated === 'string'
  );
};

export const validateCatalogItem = (item: any): item is CatalogItem => {
  return (
    item &&
    typeof item === 'object' &&
    typeof item.id === 'number' &&
    (item.type === 'movie' || item.type === 'tv') &&
    typeof item.title === 'string' &&
    typeof item.overview === 'string' &&
    typeof item.vote_average === 'number' &&
    typeof item.dateAdded === 'string'
  );
};
