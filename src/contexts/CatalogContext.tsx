'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Catalog, CatalogItem, WatchedItem, CustomList, CatalogContextType, MediaType } from '@/types';
import { createEmptyCatalog, generateListId } from '@/lib/catalog';

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

interface CatalogProviderProps {
  children: ReactNode;
}

export function CatalogProvider({ children }: CatalogProviderProps) {
  const [catalog, setCatalog] = useState<Catalog>(createEmptyCatalog());
  const [loading, setLoading] = useState(true);

  // Load catalog on mount
  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/catalog');
      const result = await response.json();
      
      if (result.success && result.data) {
        setCatalog(result.data);
      } else {
        console.error('Failed to load catalog:', result.error);
        setCatalog(createEmptyCatalog());
      }
    } catch (error) {
      console.error('Error loading catalog:', error);
      setCatalog(createEmptyCatalog());
    } finally {
      setLoading(false);
    }
  };

  const updateCatalog = async (newCatalog: Catalog) => {
    try {
      const response = await fetch('/api/catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCatalog),
      });

      const result = await response.json();
      
      if (result.success) {
        setCatalog(newCatalog);
      } else {
        console.error('Failed to save catalog:', result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error saving catalog:', error);
      throw error;
    }
  };

  const addToWatchlist = async (item: CatalogItem) => {
    const newCatalog = {
      ...catalog,
      watchlist: [...catalog.watchlist.filter(w => !(w.id === item.id && w.type === item.type)), item],
    };
    await updateCatalog(newCatalog);
  };

  const removeFromWatchlist = async (id: number, type: MediaType) => {
    const newCatalog = {
      ...catalog,
      watchlist: catalog.watchlist.filter(item => !(item.id === id && item.type === type)),
    };
    await updateCatalog(newCatalog);
  };

  const markAsWatched = async (item: WatchedItem) => {
    const newCatalog = {
      ...catalog,
      watched: [...catalog.watched.filter(w => !(w.id === item.id && w.type === item.type)), item],
      // Remove from watchlist if it exists there
      watchlist: catalog.watchlist.filter(w => !(w.id === item.id && w.type === item.type)),
    };
    await updateCatalog(newCatalog);
  };

  const removeFromWatched = async (id: number, type: MediaType) => {
    const newCatalog = {
      ...catalog,
      watched: catalog.watched.filter(item => !(item.id === id && item.type === type)),
    };
    await updateCatalog(newCatalog);
  };

  const createCustomList = async (name: string, description?: string): Promise<string> => {
    const listId = generateListId();
    const newList: CustomList = {
      id: listId,
      name,
      description,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newCatalog = {
      ...catalog,
      customLists: [...catalog.customLists, newList],
    };
    
    await updateCatalog(newCatalog);
    return listId;
  };

  const addToCustomList = async (listId: string, item: CatalogItem) => {
    const newCatalog = {
      ...catalog,
      customLists: catalog.customLists.map(list => {
        if (list.id === listId) {
          const existingIndex = list.items.findIndex(i => i.id === item.id && i.type === item.type);
          const newItems = existingIndex >= 0 
            ? list.items 
            : [...list.items, item];
          
          return {
            ...list,
            items: newItems,
            updatedAt: new Date().toISOString(),
          };
        }
        return list;
      }),
    };
    
    await updateCatalog(newCatalog);
  };

  const removeFromCustomList = async (listId: string, itemId: number, type: MediaType) => {
    const newCatalog = {
      ...catalog,
      customLists: catalog.customLists.map(list => {
        if (list.id === listId) {
          return {
            ...list,
            items: list.items.filter(item => !(item.id === itemId && item.type === type)),
            updatedAt: new Date().toISOString(),
          };
        }
        return list;
      }),
    };
    
    await updateCatalog(newCatalog);
  };

  const deleteCustomList = async (listId: string) => {
    const newCatalog = {
      ...catalog,
      customLists: catalog.customLists.filter(list => list.id !== listId),
    };
    
    await updateCatalog(newCatalog);
  };

  const contextValue: CatalogContextType = {
    catalog,
    updateCatalog,
    addToWatchlist,
    removeFromWatchlist,
    markAsWatched,
    removeFromWatched,
    createCustomList,
    addToCustomList,
    removeFromCustomList,
    deleteCustomList,
    loading,
  };

  return (
    <CatalogContext.Provider value={contextValue}>
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog(): CatalogContextType {
  const context = useContext(CatalogContext);
  if (context === undefined) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
}
