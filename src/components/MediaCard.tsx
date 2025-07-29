'use client';

import React from 'react';
import Image from 'next/image';
import { MediaCardProps } from '@/types';
import { getThumbnailUrl } from '@/lib/tmdb';

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
  const posterPath = (item as any).poster_path || null;
  
  const year = releaseDate ? releaseDate.split('-')[0] : '';
  const thumbnailUrl = getThumbnailUrl(posterPath);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Thumbnail Image */}
      <div className="relative aspect-[2/3] bg-gray-200 dark:bg-gray-700">
        <Image
          src={thumbnailUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
        />
        
        {/* Media Type Badge - positioned on the image */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            type === 'movie' 
              ? 'bg-blue-600 text-white' 
              : 'bg-green-600 text-white'
          }`}>
            {type === 'movie' ? 'MOVIE' : 'TV'}
          </span>
        </div>
        
        {/* Rating Badge - positioned on the image */}
        {voteAverage > 0 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
            <svg className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span>{voteAverage.toFixed(1)}</span>
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-3 cursor-pointer" onClick={onClick}>
        <div className="space-y-2">
          {/* Title and Year */}
          <div>
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-2 leading-tight">
              {title}
            </h3>
            {year && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {year}
              </span>
            )}
          </div>
          
          {/* Additional metadata - only show popularity if it's significant */}
          {popularity > 100 && (
            <div className="flex items-center space-x-1 text-xs text-gray-600 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              <span>{popularity.toFixed(0)}</span>
            </div>
          )}
        </div>
        
        {/* Add to Watchlist Button */}
        {showAddButton && onAddToWatchlist && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToWatchlist();
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-2 rounded-lg transition-colors flex items-center justify-center space-x-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Add to Watchlist</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
