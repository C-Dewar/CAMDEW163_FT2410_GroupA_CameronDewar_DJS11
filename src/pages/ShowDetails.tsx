import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAudioStore } from '@store/useAudioStore';
import AudioPlayer from '@components/AudioPlayer/AudioPlayer';

interface Episode {
  episode: number;
  title: string;
  description: string;
  file: string;
  listenCount: number;
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

  //Access the setCurrentEpisode function from the store
  const { setCurrentEpisode, setProgress, episodeProgress } = useAudioStore();

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

  const handleEpisodeClick = (episode: Episode) => {
    console.log('Selected Episode:', episode);
    const episodeId = episode.episode;
    if (typeof episodeId !== 'number') {
      console.error('Episode ID is missing or invalid', episode);
    }
    //Setting the clicked episode as the current episode within the store
    setCurrentEpisode({
      id: episodeId,
      title: episode.title,
      description: episode.description,
      file: episode.file,
      listenCount: 0,
      isFinished: false,
    });
    setProgress(episodeId, 0);
  };

  if (loading || !show) return <div>Loading show...</div>;

  return (
    <div>
      <button onClick={() => navigate(-1)}>&larr; Back</button>

      <h1> {show.title}</h1>
      <p>{show.description}</p>

      <h2>Seasons</h2>
      <div>
        {show.seasons.map((season, index) => (
          <button
            key={`{season.id}-${index}`}
            onClick={() => setSelectedSeason(index)}
          >
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
            <li key={ep.episode}>
              <p>{ep.title}</p>
              <button onClick={() => handleEpisodeClick(ep)}>Play</button>
              <p>Progress: {Math.floor(episodeProgress[ep.episode] || 0)}s</p>
            </li>
          ))}
        </ul>
      </div>
      <AudioPlayer />
    </div>
  );
};

export default ShowDetails;
