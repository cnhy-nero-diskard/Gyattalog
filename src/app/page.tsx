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

      </div>
      
      <SearchComponent onItemClick={handleItemClick} />
    </div>
  );
}
