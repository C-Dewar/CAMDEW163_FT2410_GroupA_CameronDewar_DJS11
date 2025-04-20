import {Preview} from "@/types/preview";
import {getGenreIdByName} from "@/constants/genres.tsx";

export const filterByGenre = (data: Preview[], genre: string): Preview[] => {
  if (genre === 'All') return data;

  const genreId = getGenreIdByName(genre);
  if (genreId === null) return data;

  return data.filter((show) => show.genres.some((g) => g === genreId));
};
