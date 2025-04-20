import {create} from 'zustand';
import React from 'react';
import {Episode} from "@/types/episode";

interface AudioStore {
  currentEpisode: Episode | null;
  episodeProgress: Record<number, { progress: number; isFinished: boolean }>; // Track progress and finished status
  episodeListenCount: Record<number, { listenCount: number }>, // Track the number of listen times
  isPlaying: boolean;
  favorites: number[];
  audioRef: React.RefObject<HTMLAudioElement | null>;

  //Actions:
  setCurrentEpisode: (episode: Episode) => void;
  setProgress: (episodeId: number, progress: number) => void; //Setting the progress for a specific episode that is being listened to
  setIsPlaying: (isPlaying: boolean) => void;
  addEpisodeToFavorites: (episodeId: number) => void;
  resetProgress: () => void; //Reset progress when starting
  incrementListenCount: (episodeId: number) => void; //Increment a listen count for a given episode to track how many times it's been listened to
}

export const useAudioStore = create<AudioStore>((set) => ({
  currentEpisode: null,
  episodeProgress: {},
  episodeListenCount: {},
  isPlaying: false,
  favorites: [], //Empty array/list initially prior to anything being played to completion
  audioRef: React.createRef(),

  setCurrentEpisode: (episode: Episode) => set((state) => ({
    currentEpisode: episode,
    episodeProgress: {
      ...state.episodeProgress,
      [episode.episode]: {progress: 0, isFinished: episode.isFinished}, // Initialize progress and finished status
    },
  })),

  setIsPlaying: (isPlaying: boolean) => set({isPlaying}),

  //Action to add the episode to favorites list
  addEpisodeToFavorites: (episodeId: number) => {
    set((state) => {
      //Logic to avoid adding duplicates
      if (!state.favorites.includes(episodeId)) {
        return {favorites: [...state.favorites, episodeId]};
      }
      return state;
    });
  },

  setProgress: (episodeId: number, progress: number) => set((state) => ({
    episodeProgress: {
      ...state.episodeProgress,
      [episodeId]: {
        progress, // Update progress
        isFinished: state.episodeProgress[episodeId]?.isFinished || false, // Preserve finished status
      },
    },
  })),

  resetProgress: () => set({episodeProgress: {}}),

  incrementListenCount: (episodeId: number) => set((state) => ({
    episodeListenCount: {
      ...state.episodeListenCount,
      [episodeId]: {
        listenCount: (state.episodeListenCount[episodeId]?.listenCount || 0) + 1, // If undefined, initialize to 0
      }
    }
  })),
}));
