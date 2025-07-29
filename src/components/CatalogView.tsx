'use client';

import React, { useState } from 'react';
import { useCatalog } from '@/contexts/CatalogContext';
import { CatalogItem, WatchedItem, CustomList, MediaType } from '@/types';
import MediaCard from './MediaCard';

interface CatalogViewProps {
  onItemClick: (id: number, type: MediaType) => void;
}

type ViewMode = 'watchlist' | 'watched' | 'lists';
type SortOption = 'dateAdded' | 'title' | 'rating' | 'releaseDate';

export default function CatalogView({ onItemClick }: CatalogViewProps) {
  const { 
    catalog, 
    removeFromWatchlist, 
    removeFromWatched, 
    deleteCustomList,
    removeFromCustomList,
    loading 
  } = useCatalog();
  
  const [viewMode, setViewMode] = useState<ViewMode>('watchlist');
  const [sortBy, setSortBy] = useState<SortOption>('dateAdded');
  const [filterType, setFilterType] = useState<'all' | MediaType>('all');
  const [selectedList, setSelectedList] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const sortItems = (items: CatalogItem[]): CatalogItem[] => {
    const sorted = [...items];
    
    switch (sortBy) {
      case 'title':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'rating':
        return sorted.sort((a, b) => b.vote_average - a.vote_average);
      case 'releaseDate':
        return sorted.sort((a, b) => {
          const dateA = new Date(a.release_date || '1900-01-01').getTime();
          const dateB = new Date(b.release_date || '1900-01-01').getTime();
          return dateB - dateA;
        });
      case 'dateAdded':
      default:
        return sorted.sort((a, b) => {
          const dateA = new Date(a.dateAdded).getTime();
          const dateB = new Date(b.dateAdded).getTime();
          return dateB - dateA;
        });
    }
  };

  const filterItems = (items: CatalogItem[]): CatalogItem[] => {
    if (filterType === 'all') return items;
    return items.filter(item => item.type === filterType);
  };

  const getDisplayItems = (): CatalogItem[] => {
    let items: CatalogItem[] = [];
    
    switch (viewMode) {
      case 'watchlist':
        items = catalog.watchlist;
        break;
      case 'watched':
        items = catalog.watched;
        break;
      case 'lists':
        if (selectedList) {
          const list = catalog.customLists.find(l => l.id === selectedList);
          items = list ? list.items : [];
        } else {
          items = [];
        }
        break;
    }
    
    return sortItems(filterItems(items));
  };

  const handleRemoveItem = async (id: number, type: MediaType) => {
    try {
      switch (viewMode) {
        case 'watchlist':
          await removeFromWatchlist(id, type);
          break;
        case 'watched':
          await removeFromWatched(id, type);
          break;
        case 'lists':
          if (selectedList) {
            await removeFromCustomList(selectedList, id, type);
          }
          break;
      }
    } catch (error) {
      console.error('Error removing item:', error);
      // Show error to user for force-watched items
      if (error instanceof Error && error.message.includes('watched seasons')) {
        alert(error.message);
      }
    }
  };

  const displayItems = getDisplayItems();

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="space-y-4">
        {/* View Mode Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setViewMode('watchlist')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'watchlist'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Watchlist ({catalog.watchlist.length})
          </button>
          <button
            onClick={() => setViewMode('watched')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'watched'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Watched ({catalog.watched.length})
          </button>
          <button
            onClick={() => setViewMode('lists')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'lists'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Custom Lists ({catalog.customLists.length})
          </button>
        </div>

        {/* Custom Lists Selector */}
        {viewMode === 'lists' && (
          <div className="flex flex-wrap gap-2">
            {catalog.customLists.map((list) => (
              <button
                key={list.id}
                onClick={() => setSelectedList(list.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedList === list.id
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {list.name} ({list.items.length})
              </button>
            ))}
          </div>
        )}

        {/* Filters and Sort */}
        <div className="flex flex-wrap gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="dateAdded">Sort by Date Added</option>
            <option value="title">Sort by Title</option>
            <option value="rating">Sort by Rating</option>
            <option value="releaseDate">Sort by Release Date</option>
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | MediaType)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="movie">Movies</option>
            <option value="tv">TV Shows</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {displayItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {displayItems.map((item) => {
            // Check if this item should disable removal
            let disableRemove = false;
            let disableReason = '';
            
            if (viewMode === 'watchlist' && item.type === 'tv') {
              // Check if TV show is in watched list with force-watched status
              const watchedTVShow = catalog.watched.find(w => w.id === item.id && w.type === 'tv' && w.forceWatched);
              if (watchedTVShow) {
                disableRemove = true;
                disableReason = 'Cannot remove: at least one season is marked as watched';
              }
            } else if (viewMode === 'watched' && item.type === 'tv' && 'forceWatched' in item && (item as WatchedItem).forceWatched) {
              disableRemove = true;
              disableReason = 'Cannot remove: at least one season is marked as watched';
            }
            
            return (
              <div key={`${item.id}-${item.type}`} className="relative group">
                <MediaCard
                  item={item}
                  type={item.type}
                  onClick={() => onItemClick(item.id, item.type)}
                />
                {/* Remove Button */}
                <button
                  onClick={() => {
                    if (!disableRemove) {
                      handleRemoveItem(item.id, item.type);
                    }
                  }}
                  className={`absolute top-2 right-2 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity
                    ${disableRemove 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  title={disableRemove ? disableReason : 'Remove from list'}
                  disabled={disableRemove}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                {/* Watched Rating */}
                {viewMode === 'watched' && 'userRating' in item && (item as WatchedItem).userRating && (
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    ★ {(item as WatchedItem).userRating}/5
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {viewMode === 'watchlist' && 'Your watchlist is empty. Search for movies and TV shows to add them!'}
          {viewMode === 'watched' && 'You haven\'t marked anything as watched yet.'}
          {viewMode === 'lists' && !selectedList && 'Select a custom list to view its contents.'}
          {viewMode === 'lists' && selectedList && 'This list is empty.'}
        </div>
      )}
    </div>
  );
}
