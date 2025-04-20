import React, { useState, useEffect } from 'react';
import { useFavouritesStore } from '@store/useFavouritesStore';
import styles from '@styles/Favourites.module.css'; // Import the CSS module

const Favourites: React.FC = () => {
  const { favourites, removeFromFavourites } = useFavouritesStore();
  const [sortOrder, setSortOrder] = useState<string>('A-Z');

  const sortedFavourites = () => {
    const sorted = [...favourites];
    if (!Array.isArray(sorted)) {
      console.error('Favourites is not an array:', sorted);
      return [];
    }
    switch (sortOrder) {
      case 'A-Z':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'Z-A':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'Recently Added':
        sorted.sort(
          (a, b) =>
            new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
        );
        break;
      case 'Oldest':
        sorted.sort(
          (a, b) =>
            new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
        );
        break;
      default:
        break;
    }
    return sorted;
  };

  // Group episodes by Show
  const groupedFavourites = sortedFavourites().reduce((grouped, episode) => {
    if (!grouped[episode.showId]) {
      grouped[episode.showId] = {
        showTitle: episode.showTitle,
        episodes: [],
      };
    }
    grouped[episode.showId].episodes.push(episode);
    return grouped;
  }, {} as Record<string, { showTitle: string; episodes: typeof favourites }>);

  return (
    <div className={styles.container}>
      <h1>Favourites</h1>
      {/* Sort Options */}
      <div className={styles.sortOptions}>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="A-Z">A - Z</option>
          <option value="Z-A">Z - A</option>
          <option value="Recently Added">Recently Added</option>
          <option value="Oldest">Oldest</option>
        </select>
      </div>
      {Object.keys(groupedFavourites).length === 0 ? (
        <p>No favourites added yet.</p>
      ) : (
        Object.entries(groupedFavourites).map(
          ([showId, { showTitle, episodes }]) => (
            <div key={showId} className={styles.showContainer}>
              <h2 className={styles.showTitle}>{showTitle}</h2>
              <ul className={styles.episodeList}>
                {episodes.map((episode) => (
                  <li key={episode.episodeId} className={styles.episodeItem}>
                    <p className={styles.episodeTitle}>{episode.title}</p>
                    <p className={styles.episodeDescription}>
                      {episode.description}
                    </p>
                    <p className={styles.episodeAddedAt}>
                      Added on: {new Date(episode.addedAt).toLocaleString()}
                    </p>
                    <button
                      onClick={() => removeFromFavourites(episode.uniqueId)}
                      className={styles.removeButton}
                    >
                      Remove from Favourites
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )
        )
      )}
    </div>
  );
};

export default Favourites;
