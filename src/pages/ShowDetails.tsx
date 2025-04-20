import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useAudioStore} from '@store/useAudioStore';
import AudioPlayer from '@components/AudioPlayer/AudioPlayer';
import {useFavouritesStore} from '@store/useFavouritesStore';
import {Show} from "@/types/show";
import {Episode} from "@/types/episode";
import {Season} from "@/types/season";
import {fetchShowDetails} from "@/APIFunctions/api.tsx";

const ShowDetails = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState<number>(0);

  // Access the setCurrentEpisode function and audioRef from the store
  const {
    setCurrentEpisode,
    episodeProgress,
    episodeListenCount,
    audioRef,
    setIsPlaying
  } = useAudioStore();

  // Get addToFavourites from the store
  const {
    addToFavourites,
    removeFromFavourites,
    favourites
  } = useFavouritesStore(); // Access the store

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedShow = await fetchShowDetails(id!);
        setShow(fetchedShow);
      } catch (error) {
        console.error('Error fetching show details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleEpisodeClick = (episode: Episode) => {
    const episodeId = episode.episode;

    // Pause current playback if audio is already playing
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Set the clicked episode as the current episode
    setCurrentEpisode({
      episode: episodeId,
      title: episode.title,
      description: episode.description,
      file: episode.file,
      listenCount: episode.listenCount,
      isFinished: episode.isFinished,
    });

    // Update audio source and restore playback progress
    if (audioRef.current) {
      audioRef.current.src = episode.file;

      // Wait for the new source to load before setting the currentTime
      audioRef.current.onloadedmetadata = () => {
        const lastProgress = episodeProgress[episodeId]?.progress || 0;

        if (audioRef.current) {
          // Ensure audioRef.current is not null
          audioRef.current.currentTime = lastProgress;
          audioRef.current.play(); // Start playback after setting progress
          setIsPlaying(true);
        }
      };
    }
  };

  const handleAddToFavourites = (
    show: Show,
    season: Season,
    episode: Episode
  ) => {
    const favouriteEpisode = {
      uniqueId: getUniqueId(show, season, episode),
      episodeId: episode.episode,
      title: episode.title,
      description: episode.description,
      file: episode.file,
      showId: show.id,
      showTitle: show.title,
      addedAt: Date.now(),
    };
    const isAlreadyFavourite = isFavourite(favouriteEpisode.uniqueId);
    if (isAlreadyFavourite) {
      removeFromFavourites(favouriteEpisode.uniqueId); // Remove from favourites if already added
    } else {
      addToFavourites(favouriteEpisode);
    }
  };

  const isFavourite = (uniqueId: string) => {
    return favourites.some((fav) => fav.uniqueId === uniqueId); // Check if episode is in favourites
  };

  const getUniqueId = (show: Show, season: Season, episode: Episode) => {
    return show.id + '-' + season.season + '-' + episode.episode;
  };

  if (loading) return <div style={{padding: 24}}>Loading show...</div>;

  if (!show) {
    return <div style={{padding: 24}}>Failed to load show details.</div>;
  }

  if (!show.seasons || show.seasons.length === 0) {
    return <div style={{padding: 24}}>No seasons available for this show.</div>;
  }

  const episodes = show.seasons[selectedSeason]?.episodes || [];

  return (
    <div style={{padding: 24}}>
      <button onClick={() => navigate(-1)}>&larr; Back</button>

      <h1> {show.title}</h1>
      <p>{show.description}</p>

      <h2>Seasons</h2>
      <div>
        {show.seasons.map((season, index) => (
          <button
            key={season.season}
            onClick={() => setSelectedSeason(index)}
            style={{
              marginLeft: index > 0 ? 12 : 0,
            }}
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
          style={{
            width: '150px',
            height: '150px',
          }}
        />
        <p>
          <strong>Episodes:</strong>{' '}
          {show.seasons[selectedSeason].episodes.length}
        </p>

        <ul style={{padding: 0, listStyle: 'none'}}>
          {episodes.map((episode) => (
            <li
              key={episode.episode}
              style={{
                padding: '8px 12px',
                marginBottom: '8px',
                backgroundColor: '#333333',
                borderRadius: '4px',
              }}
            >
              <p style={{margin: 0, fontWeight: 'bold'}}>
                {episode.title}
                {episodeProgress[episode.episode]?.isFinished && (
                  <span style={{color: 'green'}}> - Finished</span>
                )}
              </p>
              <div style={{marginTop: '8px'}}>
                <button
                  onClick={() => handleEpisodeClick(episode)}
                  style={{
                    padding: '6px 12px',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '8px',
                  }}
                >
                  Play
                </button>
                <button
                  onClick={() =>
                    handleAddToFavourites(
                      show,
                      show.seasons[selectedSeason],
                      episode
                    )
                  }
                  style={{
                    padding: '6px 12px',
                    color: 'white',
                    backgroundColor: isFavourite(
                      getUniqueId(show, show.seasons[selectedSeason], episode)
                    )
                      ? '#FF6347' // Disabled button background
                      : '#FFD700', // Active button background
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {isFavourite(
                    getUniqueId(show, show.seasons[selectedSeason], episode)
                  )
                    ? 'Remove from Favourites'
                    : 'Add to Favourites'}
                </button>
                <p
                  style={{
                    marginTop: '4px',
                    fontSize: '0.9em',
                    color: '#555',
                  }}
                >
                  Progress:{' '}
                  {Math.floor(episodeProgress[episode.episode]?.progress || 0)}s
                </p>
                <p>
                  {' '}
                  Listen Count:{' '}
                  {episodeListenCount[episode.episode]?.listenCount > 0
                    ? `${episodeListenCount[episode.episode]?.listenCount} times`
                    : 0}{' '}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <AudioPlayer/>
    </div>
  );
};

export default ShowDetails;
