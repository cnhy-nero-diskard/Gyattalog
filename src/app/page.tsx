'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import SearchComponent from '@/components/SearchComponent';
import { TMDBMovie, TMDBTVShow, MediaType } from '@/types';

export default function HomePage() {
  const router = useRouter();

  const handleItemClick = (item: TMDBMovie | TMDBTVShow, type: MediaType) => {
    router.push(`/details/${type}/${item.id}`);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Find Your Next Watch
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Search for movies and TV shows, add them to your watchlist, and keep track of what you've watched.
        </p>
      </div>
      
      <SearchComponent onItemClick={handleItemClick} />
    </div>
  );
}
