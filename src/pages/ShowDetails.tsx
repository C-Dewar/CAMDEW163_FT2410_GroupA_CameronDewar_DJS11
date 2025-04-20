import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAudioStore } from '@store/useAudioStore';
import AudioPlayer from '@components/AudioPlayer/AudioPlayer';
import { useFavouritesStore } from '@store/useFavouritesStore';
import { Show } from '@/types/show';
import { Episode } from '@/types/episode';
import { Season } from '@/types/season';
import { fetchShowDetails } from '@/APIFunctions/api.tsx';
import styles from '@styles/ShowDetails.module.css'; // Import the CSS module

const ShowDetails = () => {
  const { id } = useParams();
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
    setIsPlaying,
  } = useAudioStore();

  // Get addToFavourites from the store
  const { addToFavourites, removeFromFavourites, favourites } =
    useFavouritesStore(); // Access the store

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

  if (loading) return <div className={styles.container}>Loading show...</div>;

  if (!show) {
    return <div className={styles.container}>Failed to load show details.</div>;
  }

  if (!show.seasons || show.seasons.length === 0) {
    return (
      <div className={styles.container}>
        No seasons available for this show.
      </div>
    );
  }

  const episodes = show.seasons[selectedSeason]?.episodes || [];

  return (
    <div className={styles.container}>
      <button onClick={() => navigate(-1)} className={styles.backButton}>
        &larr; Back
      </button>

      <h1 className={styles.heading}>{show.title}</h1>
      <p>{show.description}</p>

      <h2>Seasons</h2>
      <div>
        {show.seasons.map((season, index) => (
          <button
            key={season.season}
            onClick={() => setSelectedSeason(index)}
            className={styles.seasonsButton}
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
          className={styles.seasonImage}
        />
        <p>
          <strong>Episodes:</strong>{' '}
          {show.seasons[selectedSeason].episodes.length}
        </p>

        <ul className={styles.episodeList}>
          {episodes.map((episode) => (
            <li key={episode.episode} className={styles.episodeItem}>
              <p className={styles.episodeTitle}>
                {episode.title}
                {episodeProgress[episode.episode]?.isFinished && (
                  <span className={styles.episodeFinished}> - Finished</span>
                )}
              </p>
              <div className={styles.episodeControls}>
                <button
                  onClick={() => handleEpisodeClick(episode)}
                  className={styles.playButton}
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
                  className={`${styles.favouriteButton} ${
                    isFavourite(
                      getUniqueId(show, show.seasons[selectedSeason], episode)
                    )
                      ? styles.favouriteButtonActive
                      : styles.favouriteButtonInactive
                  }`}
                >
                  {isFavourite(
                    getUniqueId(show, show.seasons[selectedSeason], episode)
                  )
                    ? 'Remove from Favourites'
                    : 'Add to Favourites'}
                </button>
                <p className={styles.progressText}>
                  Progress:{' '}
                  {Math.floor(episodeProgress[episode.episode]?.progress || 0)}s
                </p>
                <p className={styles.listenCount}>
                  Listen Count:{' '}
                  {episodeListenCount[episode.episode]?.listenCount > 0
                    ? `${
                        episodeListenCount[episode.episode]?.listenCount
                      } times`
                    : 0}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <AudioPlayer />
    </div>
  );
};

export default ShowDetails;
