export interface Favourite {
  uniqueId: string; // Use a composite key to make sure episode is unique across shows and seasons: `${showId}-${seasonId}-${episodeId}`
  episodeId: number;
  title: string;
  description: string;
  file: string;
  showId: number;
  showTitle: string;
  addedAt: number;
}