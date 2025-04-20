import {Episode} from "@/types/episode";

export interface Season {
  season: number;
  title: string;
  image: string;
  episodes: Episode[];
}