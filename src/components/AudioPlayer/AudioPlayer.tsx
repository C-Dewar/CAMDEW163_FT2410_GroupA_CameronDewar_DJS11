import {useEffect, useCallback} from 'react';
import {useAudioStore} from '@store/useAudioStore';
import styles from '@styles/audioPlayer.module.css';

const AudioPlayer = () => {
  const {
    currentEpisode,
    setIsPlaying,
    setCurrentEpisode,
    addEpisodeToFavorites,
    incrementListenCount,
    audioRef,
    setProgress,
  } = useAudioStore();

  const {isPlaying} = useAudioStore();

  //Function to handle the time update
  const handleTimeUpdate = () => {
    if (audioRef.current && currentEpisode) {
      const currentTime = audioRef.current.currentTime;
      setProgress(currentEpisode.episode, currentTime); // Update the global progress in the store
    }
  };


  //Function to handle play/pause state tracking
  const handlePlayPause = (isPlaying: boolean) => {
    setIsPlaying(isPlaying); // Sync play/pause state with the store
  };

  //Function to handle audio end for favorites tracking/recording
  const handleEnd = () => {
    if (audioRef.current && currentEpisode) {
      //Mark the episode as finished/listened to
      setCurrentEpisode({...currentEpisode, isFinished: true});
      addEpisodeToFavorites(currentEpisode.episode); //Add episode ID to favorites
      incrementListenCount(currentEpisode.episode); //Adds 1 to the listen count to show it's been listened to in its entirety
      setProgress(currentEpisode.episode, 0); //Resets the progress as the listen count shows if it's been completed
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
        onPlay={() => handlePlayPause(true)}
        onPause={() => handlePlayPause(false)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnd}
        className={styles.audioPlayer}
      />
    </div>
  );
};

export default AudioPlayer;
