import { create } from 'zustand';
import React from 'react';

interface Episode {
  id: number;
  title: string;
  description: string;
  file: string;
  listenCount: number;
  isFinished: boolean;
}

interface AudioStore {
  currentEpisode: Episode | null;
  episodeProgress: Record<number, { progress: number; isFinished: boolean }>; // Track progress and finished status
  isPlaying: boolean;
  favorites: string[];
  audioRef: React.RefObject<HTMLAudioElement | null>;

  //Actions:
  setCurrentEpisode: (episode: Episode) => void;
  setProgress: (episodeId: number, progress: number) => void; //Setting the progress for a specific episode that is being listened to
  setIsPlaying: (isPlaying: boolean) => void;
  addEpisodeToFavorites: (episodeId: string) => void;
  resetProgress: () => void; //Reset progress when starting
  incrementListenCount: (episodeId: number) => void; //Increment a listen count for a given episode to track how many times it's been listened to
}

export const useAudioStore = create<AudioStore>((set) => ({
  currentEpisode: null,
  episodeProgress: {},
  isPlaying: false,
  favorites: [], //Empty array/list initially prior to anything being played to completion
  audioRef: React.createRef(),

  setCurrentEpisode: (episode: Episode) =>
    set((state) => ({
      currentEpisode: episode,
      episodeProgress: {
        ...state.episodeProgress,
        [episode.id]: { progress: 0, isFinished: episode.isFinished }, // Initialize progress and finished status
      },
    })),

  setProgress: (episodeId: number, progress: number) =>
    set((state) => ({
      episodeProgress: {
        ...state.episodeProgress,
        [episodeId]: {
          progress, // Update progress
          isFinished: state.episodeProgress[episodeId]?.isFinished || false, // Preserve finished status
        },
      },
    })),

  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),

  //Action to add the episode to favorites list
  addEpisodeToFavorites: (episodeId: string) => {
    set((state) => {
      //Logic to avoid adding duplicates
      if (!state.favorites.includes(episodeId)) {
        return { favorites: [...state.favorites, episodeId] };
      }
      return state;
    });
  },

  resetProgress: () => set({ episodeProgress: {} }),

  incrementListenCount: (episodeId: number) => {
    set((state) => {
      const episode = state.currentEpisode;
      if (episode && episode.id === episodeId) {
        console.log('Before increment, listen count:', episode.listenCount);
        return {
          currentEpisode: {
            ...episode,
            listenCount: episode.listenCount + 1,
          },
          episodeProgress: {
            ...state.episodeProgress,
            [episodeId]: {
              progress: 0, // Reset progress after increment
              isFinished: true, // Mark as finished
            },
          },
        };
      }
      return state;
    });
  },
}));
