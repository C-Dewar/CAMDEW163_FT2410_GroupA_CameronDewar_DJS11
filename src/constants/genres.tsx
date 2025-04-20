export const GENRE_MAP: Record<number, string> = {
  1: 'Personal Growth',
  2: 'Investigative Journalism',
  3: 'History',
  4: 'Comedy',
  5: 'Entertainment',
  6: 'Business',
  7: 'Fiction',
  8: 'News',
  9: 'Kids and Family',
};

export const getGenreIdByName = (genreName: string): number | null => {
  const genreEntry = Object.entries(GENRE_MAP).find(
    ([, name]) => name === genreName
  );
  return genreEntry ? parseInt(genreEntry[0]) : null;
};