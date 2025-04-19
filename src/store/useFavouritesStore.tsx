import { create } from 'zustand';

// Utility function to get the favourites from localStorage
const getFavouritesFromLocalStorage = (): FavouriteEpisode[] => {
  const storedFavourites = localStorage.getItem('favourites');
  return storedFavourites ? JSON.parse(storedFavourites) : [];
};

// Utility function to save the favourites to localStorage
const saveFavouritesToLocalStorage = (favourites: FavouriteEpisode[]) => {
  localStorage.setItem('favourites', JSON.stringify(favourites));
};

// Define the type of favourite episode
interface FavouriteEpisode {
  uniqueId: string; // Use a composite key to make sure episode is unique across shows and seasons: `${showId}-${seasonId}-${episodeId}`
  episodeId: number;
  title: string;
  description: string;
  file: string;
  showId: number;
  showTitle: string;
  addedAt: number;
}

// Define the state of the favourites store
interface FavouritesState {
  favourites: FavouriteEpisode[];
  addToFavourites: (episode: FavouriteEpisode) => void;
  removeFromFavourites: (uniqueId: string) => void;
  loadFavourites: () => void;
}

export const useFavouritesStore = create<FavouritesState>((set) => ({
  favourites: getFavouritesFromLocalStorage(),
  loadFavourites: () => set({ favourites: getFavouritesFromLocalStorage() }),
  addToFavourites: (episode) => {
    set((state) => {
      // Prevent duplicates
      const exists = state.favourites.some(
        (favouriteEpisode) => favouriteEpisode.uniqueId === episode.uniqueId
      );
      if (exists) return state;

      const updatedFavourites = [
        ...state.favourites,
        { ...episode, addedAt: Date.now() },
      ];
      saveFavouritesToLocalStorage(updatedFavourites); // Save to localStorage
      return { favourites: updatedFavourites };
    });
  },
  removeFromFavourites: (uniqueId) => {
    set((state) => {
      const updatedFavourites = state.favourites.filter(
        (episode) => episode.uniqueId !== uniqueId
      );
      saveFavouritesToLocalStorage(updatedFavourites); // Save to localStorage
      return { favourites: updatedFavourites };
    });
  },
}));
