'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { TMDBMovieDetails, TMDBTVDetails, MediaType, CatalogItem, WatchedItem } from '@/types';
import { tmdbAPI, getPosterUrl, getBackdropUrl, convertToCatalogItem } from '@/lib/tmdb';
import { useCatalog } from '@/contexts/CatalogContext';
import { isInWatchlist, isWatched } from '@/lib/catalog';

export default function DetailsPage() {
  const params = useParams();
  const router = useRouter();
  const type = params.type as MediaType;
  const id = parseInt(params.id as string);
  
  const [details, setDetails] = useState<TMDBMovieDetails | TMDBTVDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWatchedModal, setShowWatchedModal] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [watchedDate, setWatchedDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const { 
    catalog, 
    addToWatchlist, 
    removeFromWatchlist, 
    markAsWatched, 
    removeFromWatched 
  } = useCatalog();

  const inWatchlist = details ? isInWatchlist(catalog, id, type) : false;
  const inWatched = details ? isWatched(catalog, id, type) : false;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let result;
        if (type === 'movie') {
          result = await tmdbAPI.getMovieDetails(id);
        } else {
          result = await tmdbAPI.getTVDetails(id);
        }
        
        setDetails(result);
      } catch (err) {
        setError('Failed to load details');
        console.error('Error fetching details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id && type) {
      fetchDetails();
    }
  }, [id, type]);

  const handleAddToWatchlist = async () => {
    if (!details) return;
    
    try {
      const catalogItem = convertToCatalogItem(details, type);
      await addToWatchlist(catalogItem);
    } catch (error) {
      console.error('Error adding to watchlist:', error);
    }
  };

  const handleRemoveFromWatchlist = async () => {
    try {
      await removeFromWatchlist(id, type);
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const handleMarkAsWatched = async () => {
    if (!details) return;
    
    try {
      const catalogItem = convertToCatalogItem(details, type);
      const watchedItem: WatchedItem = {
        ...catalogItem,
        userRating: userRating || undefined,
        watchedDate,
        notes: notes || undefined,
      };
      
      await markAsWatched(watchedItem);
      setShowWatchedModal(false);
      
      // Reset form
      setUserRating(0);
      setWatchedDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    } catch (error) {
      console.error('Error marking as watched:', error);
    }
  };

  const handleRemoveFromWatched = async () => {
    try {
      await removeFromWatched(id, type);
    } catch (error) {
      console.error('Error removing from watched:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !details) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error || 'Content not found'}</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const title = 'title' in details ? details.title : details.name;
  const releaseDate = 'release_date' in details ? details.release_date : details.first_air_date;
  const year = releaseDate ? releaseDate.split('-')[0] : '';
  const posterUrl = getPosterUrl(details.poster_path);
  const backdropUrl = getBackdropUrl(details.backdrop_path);

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      {/* Backdrop */}
      {details.backdrop_path && (
        <div className="relative h-64 md:h-96 -mx-4 sm:-mx-6 lg:-mx-8">
          <Image
            src={backdropUrl}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Poster */}
        <div className="md:col-span-1">
          <div className="sticky top-8">
            <div className="relative aspect-[2/3] max-w-sm mx-auto">
              <Image
                src={posterUrl}
                alt={title}
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              {!inWatchlist && !inWatched && (
                <button
                  onClick={handleAddToWatchlist}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Add to Watchlist
                </button>
              )}
              
              {inWatchlist && (
                <button
                  onClick={handleRemoveFromWatchlist}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Remove from Watchlist
                </button>
              )}
              
              {!inWatched && (
                <button
                  onClick={() => setShowWatchedModal(true)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Mark as Watched
                </button>
              )}
              
              {inWatched && (
                <button
                  onClick={handleRemoveFromWatched}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Remove from Watched
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Title and Year */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {title}
            </h1>
            {year && (
              <p className="text-lg text-gray-600 dark:text-gray-400">({year})</p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium">
                {details.vote_average.toFixed(1)}/10
              </span>
            </div>
            <span className="text-gray-600 dark:text-gray-400">
              ({details.vote_count.toLocaleString()} votes)
            </span>
          </div>

          {/* Genres */}
          {details.genres && details.genres.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {details.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Runtime/Episodes */}
          {'runtime' in details && details.runtime && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Runtime</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
              </p>
            </div>
          )}

          {'number_of_episodes' in details && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Episodes</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {details.number_of_seasons} season{details.number_of_seasons !== 1 ? 's' : ''}, {details.number_of_episodes} episodes
              </p>
            </div>
          )}

          {/* Overview */}
          {details.overview && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Overview</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {details.overview}
              </p>
            </div>
          )}

          {/* Tagline */}
          {details.tagline && (
            <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400">
              "{details.tagline}"
            </blockquote>
          )}
        </div>
      </div>

      {/* Watched Modal */}
      {showWatchedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Mark as Watched
            </h3>
            
            <div className="space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Your Rating (optional)
                </label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setUserRating(star)}
                      className={`text-2xl ${
                        star <= userRating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Watched Date
                </label>
                <input
                  type="date"
                  value={watchedDate}
                  onChange={(e) => setWatchedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Your thoughts about this..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowWatchedModal(false)}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkAsWatched}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
