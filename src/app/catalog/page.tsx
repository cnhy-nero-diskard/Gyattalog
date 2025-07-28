'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CatalogView from '@/components/CatalogView';
import { MediaType } from '@/types';

export default function CatalogPage() {
  const router = useRouter();

  const handleItemClick = (id: number, type: MediaType) => {
    router.push(`/details/${type}/${id}`);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          My Catalog
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Manage your watchlist, track what you've watched, and organize custom lists.
        </p>
      </div>
      
      <CatalogView onItemClick={handleItemClick} />
    </div>
  );
}
