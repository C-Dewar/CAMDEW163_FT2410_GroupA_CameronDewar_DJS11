import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Episode {
  id: number;
  title: string;
  file: string;
}

interface Season {
  id: number;
  title: string;
  image: string;
  episodes: Episode[];
}

interface Show {
  id: number;
  title: string;
  description: string;
  seasons: Season[];
}

const ShowDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<number>(0);

  useEffect(() => {
    const fetchShow = async () => {
      try {
        const res = await fetch(`https://podcast-api.netlify.app/id/${id}`);
        const data = await res.json();
        setShow(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch show:', error);
      }
    };
    fetchShow();
  }, [id]);

  if (loading || !show) return <div>Loading show...</div>;

  return (
    <div>
      <button onClick={() => navigate(-1)}>&larr; Back</button>

      <h1> {show.title}</h1>
      <p>{show.description}</p>

      <h2>Seasons</h2>
      <div>
        {show.seasons.map((season, index) => (
          <button key={season.id} onClick={() => setSelectedSeason(index)}>
            {season.title}
          </button>
        ))}
      </div>
      <div>
        <h3>{show.seasons[selectedSeason].title}</h3>
        <img
          src={show.seasons[selectedSeason].image}
          alt={show.seasons[selectedSeason].title}
        />
        <p>
          <strong>Episodes:</strong>{' '}
          {show.seasons[selectedSeason].episodes.length}
        </p>

        <ul>
          {show.seasons[selectedSeason].episodes.map((ep) => (
            <li key={ep.id}>
              <p>{ep.title}</p>
              <audio controls src={ep.file} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ShowDetails;
