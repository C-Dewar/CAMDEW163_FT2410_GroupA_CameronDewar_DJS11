import React, { useEffect, useState } from 'react';
import { fetchPreviews } from '../APIFunctions/api';
import { Preview } from '../types/preview';
import ShowCard from '../components/ShowDetails/ShowCard';

const Home: React.FC = () => {
  const [shows, setShows] = useState<Preview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPreviews()
      .then((data) => {
        const sorted = data.sort((a, b) => a.title.localeCompare(b.title));
        setShows(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1> All Shows</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        shows.map((show) => <ShowCard key={show.id} show={show} />)
      )}
    </div>
  );
};

export default Home;
