import React, { useState } from 'react';
import { useFavouritesStore } from '@store/useFavouritesStore';
// import { useNavigate } from 'react-router-dom';

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
  // const navigate = useNavigate();

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
    <div style={{ padding: 24, backgroundColor: '#242424', color: '#ffffff' }}>
      {/* <button onClick={() => navigate(-1)}>&larr; Back</button> */}
      <h1>Favourites</h1>
      {/* Sort Options */}
      <div style={{ marginBottom: 16 }}>
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
            <div key={showId} style={{ marginBottom: 24 }}>
              <h2 style={{ color: '#FFD700' }}>{showTitle}</h2>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {episodes.map((episode) => (
                  <li
                    key={episode.episodeId}
                    style={{
                      padding: '8px 12px',
                      marginBottom: '8px',
                      backgroundColor: '#333333',
                      borderRadius: '4px',
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: 'bold' }}>
                      {episode.title}
                    </p>
                    <p style={{ fontSize: '0.9em', color: '#AAA' }}>
                      {episode.description}
                    </p>
                    <button
                      onClick={() => removeFromFavourites(episode.uniqueId)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#FF6347',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginTop: '8px',
                      }}
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
