import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom'; // Import Link for navigation
import { fetchPreviews } from '../APIFunctions/api';
import { Preview } from '../types/preview';
import ShowCard from '../components/ShowDetails/ShowCard';
// import { useFavouritesStore } from '@store/useFavouritesStore'; // Import the favourites store

const Home: React.FC = () => {
  const [shows, setShows] = useState<Preview[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<string>('A - Z'); // Default A-Z sorting
  // const { favourites } = useFavouritesStore(); // Get favourites from the store
  useEffect(() => {
    const savedSortOption = localStorage.getItem('sortOption');
    if (savedSortOption) {
      setSortOption(savedSortOption);
    }
  }, []);

  useEffect(() => {
    fetchPreviews()
      .then((data) => {
        const sorted = sortShows(data, sortOption);
        setShows(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [sortOption]);

  //Sorting function
  const sortShows = (data: Preview[], option: string) => {
    switch (option) {
      case 'A-Z':
        return data.sort((a, b) => a.title.localeCompare(b.title));
      case 'Z-A':
        return data.sort((a, b) => b.title.localeCompare(a.title));
      case 'Most Recent':
        return data.sort(
          (a, b) =>
            new Date(b.updated).getTime() - new Date(a.updated).getTime()
        );
      case 'Oldest':
        return data.sort(
          (a, b) =>
            new Date(a.updated).getTime() - new Date(b.updated).getTime()
        );
      default:
        return data;
    }
  };
  // Function to handle sorting option change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);
    localStorage.setItem('sortOption', selectedOption); // Save the selected option to local storage
  };

  return (
    <div
      style={{
        padding: 24,
        backgroundColor: '#242424',
        color: '#ffffff',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ marginBottom: 24 }}>All Shows</h1>
      {/* Sorting dropdown */}
      <div style={{ marginBottom: 20 }}>
        <select value={sortOption} onChange={handleSortChange}>
          <option value="A-Z">A - Z</option>
          <option value="Z-A">Z - A</option>
          <option value="Most Recent">Most Recent</option>
          <option value="Oldest">Oldest</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {shows.map((show) => (
            <div
              key={show.id}
              style={{
                backgroundColor: '#333333',
                padding: 16,
                borderRadius: 8,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
            >
              <ShowCard show={show} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
