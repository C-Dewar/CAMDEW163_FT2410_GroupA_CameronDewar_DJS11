import React, {useEffect, useState} from 'react';
import {fetchPreviews} from '../APIFunctions/api.tsx';
import {Preview} from '../types/preview';
import ShowCard from '../components/ShowDetails/ShowCard';
import {sortPreview} from '@/utils/sorting';
import {filterByGenre} from '@/utils/filtering';

const Home: React.FC = () => {
  const [shows, setShows] = useState<Preview[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<string>('A - Z'); // Default A-Z sorting
  const [selectedGenre, setSelectedGenre] = useState<string>('All'); // Genre filter

  useEffect(() => {
    const savedSortOption = localStorage.getItem('sortOption');
    if (savedSortOption) {
      setSortOption(savedSortOption);
    }
  }, []);

  useEffect(() => {
    fetchPreviews()
      .then((data) => {
        const sorted = sortPreview(data, sortOption);
        const filtered = filterByGenre(sorted, selectedGenre);
        setShows(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [sortOption, selectedGenre]);

  // Function to handle sorting option change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value;
    setSortOption(selectedOption);
    localStorage.setItem('sortOption', selectedOption); // Save the selected option to local storage
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGenre = e.target.value;
    setSelectedGenre(selectedGenre);
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
      <h1 style={{marginBottom: 24}}>All Shows</h1>
      {/* Sorting dropdown */}
      <div style={{marginBottom: 20}}>
        <select value={sortOption} onChange={handleSortChange}>
          <option value="A-Z">A - Z</option>
          <option value="Z-A">Z - A</option>
          <option value="Most Recent">Most Recent</option>
          <option value="Oldest">Oldest</option>
        </select>
      </div>

      <div style={{marginBottom: 20}}>
        <select value={selectedGenre} onChange={handleGenreChange}>
          <option value="All">All Genres</option>
          <option value="Personal Growth">Personal Growth</option>
          <option value="Investigative Journalism">Investigative Journalism</option>
          <option value="History">History</option>
          <option value="Comedy">Comedy</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Business">Business</option>
          <option value="Fiction">Fiction</option>
          <option value="News">News</option>
          <option value="Kids and Family">Kids and Family</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
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
              <ShowCard show={show}/>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
