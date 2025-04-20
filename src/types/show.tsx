import {Season} from "@/types/season";

export interface Show {
  id: number;
  title: string;
  description: string;
  seasons: Season[];
}