import { useEffect, useState, useCallback } from 'react';
import { useAudioStore } from '@store/useAudioStore';
import styles from '@styles/audioPlayer.module.css';

const AudioPlayer = () => {
  const {
    currentEpisode,
    episodeProgress,
    setIsPlaying,
    setCurrentEpisode,
    addEpisodeToFavorites,
    incrementListenCount,
    audioRef,
    setProgress,
  } = useAudioStore();
  const [isPlaying, setIsPlayingState] = useState(false);

  //Function to handle the time update
  const handleTimeUpdate = () => {
    if (audioRef.current && currentEpisode) {
      const currentTime = audioRef.current.currentTime;
      setProgress(currentEpisode.id, currentTime); //Update the global progress within the audioStore
    }
  };
  //Function to handle play/pause state tracking
  const handlePlayPause = (isPlaying: boolean) => {
    setIsPlaying(isPlaying);
    setIsPlayingState(isPlaying);
  };

  //Function to handle audio end for favorites tracking/recording
  const handleEnd = () => {
    if (audioRef.current && currentEpisode) {
      //Mark the episode as finished/listened to
      setCurrentEpisode({ ...currentEpisode, isFinished: true });
      addEpisodeToFavorites(currentEpisode.id.toString()); //Add episode i.d. to favorites
      incrementListenCount(currentEpisode.id); //Adds 1 to the listen count to show it's been listened to in its entirety
      setProgress(currentEpisode.id, 0); //Resets the progress as the listen count shows if it's been completed
    }
  };
  // Handler to prevent episode unloading/quitting midway through an episode
  const beforeQuit = useCallback(
    (e: BeforeUnloadEvent) => {
      if (isPlaying) {
        e.preventDefault();
        return 'An episode is currently in progress, are you sure you want to leave?';
      }
    },
    [isPlaying]
  );

  //Setting up the before unload event listener to prevent quitting/closing window while playing
  useEffect(() => {
    window.addEventListener('beforeunload', beforeQuit);
    return () => window.removeEventListener('beforeunload', beforeQuit);
  }, [beforeQuit]);

  if (!currentEpisode) return null;

  return (
    <div className={styles.audioPlayerWrapper}>
      <div className={styles.audioPlayerTitleWrapper}>
        <h4 className={styles.audioPlayerTitle}>{currentEpisode.title}</h4>
      </div>
      <audio
        ref={audioRef}
        src={currentEpisode.file}
        controls
        autoPlay
        onPlay={() => handlePlayPause(true)}
        onPause={() => handlePlayPause(false)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnd}
      />
      <div className={styles.audioPlayerProgress}>
        {Math.floor(episodeProgress[currentEpisode.id] || 0)}s
      </div>
    </div>
  );
};

export default AudioPlayer;
