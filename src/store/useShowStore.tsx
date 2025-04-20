import { create } from 'zustand';

interface Episode {
  episodeId: number;
  title: string;
  file: string;
}

interface ShowStore {
  episodes: Episode[];
  setEpisodes: (episodes: Episode[]) => void;
}

export const useShowStore = create<ShowStore>((set) => ({
  episodes: [],
  setEpisodes: (episodes: Episode[]) => set({ episodes }),
}));
