'use client';

import React from 'react';
import { MediaCardProps } from '@/types';

export default function MediaCard({ 
  item, 
  type, 
  onClick, 
  showAddButton = false, 
  onAddToWatchlist 
}: MediaCardProps) {
  // Handle both TMDB items and CatalogItems
  const title = (item as any).title || (item as any).name || '';
  const releaseDate = (item as any).release_date || (item as any).first_air_date || '';
  const voteAverage = item.vote_average;
  const popularity = (item as any).popularity || 0;
  
  const year = releaseDate ? releaseDate.split('-')[0] : '';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700">
      <div className="p-4 cursor-pointer" onClick={onClick}>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {/* Title and Year */}
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                {title}
              </h3>
              {year && (
                <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  {year}
                </span>
              )}
            </div>
            
            {/* Media Type and Metadata Row */}
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              {/* Media Type Badge */}
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                type === 'movie' 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' 
                  : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              }`}>
                {type === 'movie' ? 'MOVIE' : 'TV SERIES'}
              </span>
              
              {/* Rating */}
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium">
                  {voteAverage ? voteAverage.toFixed(1) : 'N/A'}
                </span>
              </div>
              
              {/* Popularity */}
              {popularity > 0 && (
                <div className="flex items-center space-x-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs">
                    {popularity.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Add to Watchlist Button */}
          {showAddButton && onAddToWatchlist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToWatchlist();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ml-4"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add to Watchlist</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
