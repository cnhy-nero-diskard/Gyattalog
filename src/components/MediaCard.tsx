'use client';

import React from 'react';
import Image from 'next/image';
import { MediaCardProps } from '@/types';
import { getPosterUrl } from '@/lib/tmdb';

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
  const posterPath = item.poster_path;
  
  const year = releaseDate ? releaseDate.split('-')[0] : '';
  const posterUrl = getPosterUrl(posterPath);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="relative aspect-[2/3] cursor-pointer" onClick={onClick}>
{/* <Image
  src={posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : '/placeholder-poster.jpg'}
  alt={title}
  width={300}
  height={450}
  className="rounded"
/> */}
      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity duration-200" />
    </div>

    <div className="p-4">
      <h3
        className="font-semibold text-sm mb-1 line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          onClick={onClick}
          title={title}
        >
          {title}
        </h3>
        
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
          <span className="capitalize">{type}</span>
          {year && <span>{year}</span>}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-medium">
              {voteAverage ? voteAverage.toFixed(1) : 'N/A'}
            </span>
          </div>
          
          {showAddButton && onAddToWatchlist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToWatchlist();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 rounded transition-colors"
            >
              Add to Watchlist
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
