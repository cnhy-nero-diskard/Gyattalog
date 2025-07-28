'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { TMDBMovie, TMDBTVShow, MediaType } from '@/types';
import { tmdbAPI, getMediaType, convertToCatalogItem } from '@/lib/tmdb';
import { useCatalog } from '@/contexts/CatalogContext';
import MediaCard from './MediaCard';

interface SearchComponentProps {
  onItemClick: (item: TMDBMovie | TMDBTVShow, type: MediaType) => void;
}

export default function SearchComponent({ onItemClick }: SearchComponentProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<(TMDBMovie | TMDBTVShow)[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchType, setSearchType] = useState<'all' | 'movie' | 'tv'>('all');
  const { addToWatchlist } = useCatalog();

  const search = useCallback(async (searchQuery: string, type: 'all' | 'movie' | 'tv') => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let response;
      switch (type) {
        case 'movie':
          response = await tmdbAPI.searchMovies(searchQuery);
          break;
        case 'tv':
          response = await tmdbAPI.searchTV(searchQuery);
          break;
        default:
          response = await tmdbAPI.search(searchQuery);
          break;
      }

      // Filter out adult content and people
      const filteredResults = response.results.filter(item => 
        !item.adult && 
        (item.hasOwnProperty('title') || item.hasOwnProperty('name'))
      );

      setResults(filteredResults);
    } catch (err) {
      setError('Failed to search. Please check your API key and try again.');
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        search(query, searchType);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchType, search]);

  const handleAddToWatchlist = async (item: TMDBMovie | TMDBTVShow) => {
    try {
      const mediaType = getMediaType(item);
      const catalogItem = convertToCatalogItem(item, mediaType);
      await addToWatchlist(catalogItem);
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search for movies and TV shows..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as 'all' | 'movie' | 'tv')}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">All</option>
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && !loading && (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Search Results ({results.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((item) => {
              const mediaType = getMediaType(item);
              return (
                <MediaCard
                  key={`${item.id}-${mediaType}`}
                  item={item}
                  type={mediaType}
                  onClick={() => onItemClick(item, mediaType)}
                  showAddButton={true}
                  onAddToWatchlist={() => handleAddToWatchlist(item)}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* No Results */}
      {query.trim() && !loading && results.length === 0 && !error && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No results found for "{query}"
        </div>
      )}

      {/* Initial State */}
      {!query.trim() && !loading && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-medium mb-2">Search for Movies and TV Shows</h3>
          <p>Enter a title to search for movies and TV shows to add to your catalog</p>
        </div>
      )}
    </div>
  );
}
