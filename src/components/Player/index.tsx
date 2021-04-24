import Image from 'next/image'
import Slider from 'rc-slider'

import 'rc-slider/assets/index.css'
import { useEffect, useRef, useState } from 'react'

import { usePlayer } from '../../contexts/PlayerContext'
import convertDurationToTimeString from '../../utils/convertDurationToTimeString'

import styles from './styles.module.scss'

const Player = () => {
  const [progress, setProgress] = useState(0)

  const audioRef = useRef<HTMLAudioElement>(null)

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    hasPrevious,
    hasNext,
    isLooping,
    isShuffling,
    togglePlay,
    playPrevious,
    playNext,
    setIsPlayingState,
    toggleLoop,
    toggleShuffle,
    clearPlayer,
  } = usePlayer()

  const episode = episodeList[currentEpisodeIndex]

  const setupProgressListener = () => {
    if (!audioRef.current) return

    audioRef.current.currentTime = 0

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current!.currentTime))
    })
  }

  const handleSeek = (amount: number) => {
    audioRef.current!.currentTime = amount
    setProgress(amount)
  }

  const handleEpisodeEnded = () => {
    if (hasNext) playNext()
    else clearPlayer()
  }

  useEffect(() => {
    if (!audioRef.current) return

    if (isPlaying) audioRef.current.play()
    else audioRef.current.pause()
  }, [isPlaying])

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src='/playing.svg' alt='Tocando agora' />
        <strong>Tocando agora</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit='cover'
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                trackStyle={{ backgroundColor: '#04d381' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d381', borderWidth: 4 }}
                onChange={handleSeek}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration || 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay
            loop={isLooping}
            onPlay={() => setIsPlayingState(true)}
            onPause={() => setIsPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
            onEnded={handleEpisodeEnded}
          />
        )}

        <div className={styles.buttons}>
          <button
            type='button'
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
          >
            <img src='/shuffle.svg' alt='Embaralhar' />
          </button>
          <button
            type='button'
            disabled={!episode || !hasPrevious}
            onClick={playPrevious}
          >
            <img src='/play-previous.svg' alt='Tocar anterior' />
          </button>
          <button
            type='button'
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <img src='/pause.svg' alt='Tocar' />
            ) : (
              <img src='/play.svg' alt='Tocar' />
            )}
          </button>
          <button
            type='button'
            disabled={!episode || !hasNext}
            onClick={playNext}
          >
            <img src='/play-next.svg' alt='Tocar próxima' />
          </button>
          <button
            type='button'
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src='/repeat.svg' alt='Repetir' />
          </button>
        </div>
      </footer>
    </div>
  )
}

export default Player
