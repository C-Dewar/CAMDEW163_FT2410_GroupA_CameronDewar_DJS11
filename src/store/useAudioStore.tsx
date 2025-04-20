import { create } from 'zustand';
import React from 'react';
import { Episode } from '@/types/episode';

interface AudioStore {
  currentEpisode: Episode | null; //Current episode being played
  episodeProgress: Record<number, { progress: number; isFinished: boolean }>; // Track progress and finished status
  episodeListenCount: Record<number, { listenCount: number }>; // Track the number of listen times
  isPlaying: boolean; //Flag to check if the audio is playing
  favorites: number[]; //Array to store the IDs of favorite episodes
  audioRef: React.RefObject<HTMLAudioElement | null>; //Ref to the audio element

  //Actions:
  setCurrentEpisode: (episode: Episode) => void; //Set the current episode
  setProgress: (episodeId: number, progress: number) => void; //Setting the progress for a specific episode that is being listened to
  setIsPlaying: (isPlaying: boolean) => void; //Set the playing state (whether the audio is playing or paused)
  addEpisodeToFavorites: (episodeId: number) => void; //Add an episode to the favorites list
  resetProgress: () => void; //Reset progress when starting
  incrementListenCount: (episodeId: number) => void; //Increment a listen count for a given episode to track how many times it's been listened to
}

export const useAudioStore = create<AudioStore>((set) => ({
  currentEpisode: null, // Initially null until an episode is selected
  episodeProgress: {}, //Empty object to track progress of episodes
  episodeListenCount: {}, //Empty object to track listen counts
  isPlaying: false, // Initially false until an episode is played
  favorites: [], //Empty array/list initially prior to anything being played to completion
  audioRef: React.createRef(), //Create a reference for the audio element

  //Action to set the current episode
  setCurrentEpisode: (episode: Episode) =>
    set((state) => ({
      currentEpisode: episode, //Set the current episode to the passed episode
      episodeProgress: {
        ...state.episodeProgress, //Retain previous progress using a spread operator
        [episode.episode]: { progress: 0, isFinished: episode.isFinished }, // Initialize progress and finished status
      },
    })),

  //Action to toggle whether the audio is playing or not
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),

  //Action to add the episode to favorites list
  addEpisodeToFavorites: (episodeId: number) => {
    set((state) => {
      //Logic to avoid adding duplicates
      if (!state.favorites.includes(episodeId)) {
        return { favorites: [...state.favorites, episodeId] }; //Add to the favourites list if not already present
      }
      return state; //Return the state if the episode is already in the favorites list
    });
  },

  setProgress: (episodeId: number, progress: number) =>
    set((state) => {
      //Save the episode progress to localStorage for persistence
      localStorage.setItem(`progress_${episodeId}`, JSON.stringify(progress));
      return {
        episodeProgress: {
          ...state.episodeProgress, //Retain the progress of other episodes
          [episodeId]: {
            progress, // Update progress for this episode
            isFinished: state.episodeProgress[episodeId]?.isFinished || false, // Preserve finished status
          },
        },
      };
    }),

  //Action to reset all episode progress
  resetProgress: () => set({ episodeProgress: {} }),
  //Action to increment the listen count for a specific episode
  incrementListenCount: (episodeId: number) =>
    set((state) => ({
      episodeListenCount: {
        ...state.episodeListenCount,
        [episodeId]: {
          listenCount:
            (state.episodeListenCount[episodeId]?.listenCount || 0) + 1, // Increment the listen count, if undefined, initialize to 0
        },
      },
    })),
}));
