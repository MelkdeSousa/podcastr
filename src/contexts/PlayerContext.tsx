import { createContext, ReactNode, useContext, useState } from 'react'

interface PlayerProviderProps {
  children: ReactNode
}

type Episode = {
  title: string
  members: string
  thumbnail: string
  duration: number
  url: string
}

type PlayerContextData = {
  episodeList: Episode[]
  currentEpisodeIndex: number
  isPlaying: boolean
  hasPrevious: boolean
  hasNext: boolean
  isLooping: boolean
  isShuffling: boolean
  play: (episodes: Episode) => void
  playList: (list: Episode[], index: number) => void
  togglePlay: () => void
  playPrevious: () => void
  playNext: () => void
  toggleLoop: () => void
  toggleShuffle: () => void
  setIsPlayingState: (state: boolean) => void
  clearPlayer: () => void
}

export const PlayerContext = createContext({} as PlayerContextData)

export const PlayerProvider = ({ children }: PlayerProviderProps) => {
  const [episodeList, setEpisodeList] = useState<Episode[]>([])
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLooping, setIsLooping] = useState(false)
  const [isShuffling, setIsShuffling] = useState(false)

  const play = (episode: Episode) => {
    setEpisodeList([episode])
    setCurrentEpisodeIndex(0)
    setIsPlaying(true)
  }

  const playList = (list: Episode[], index: number) => {
    setEpisodeList(list)
    setCurrentEpisodeIndex(index)
    setIsPlaying(true)
  }

  const togglePlay = () => setIsPlaying(!isPlaying)

  const hasPrevious = currentEpisodeIndex > 0

  const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length

  const playPrevious = () => {
    if (hasPrevious) setCurrentEpisodeIndex(currentEpisodeIndex - 1)
  }

  const playNext = () => {
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(
        Math.random() * episodeList.length
      )

      setCurrentEpisodeIndex(nextRandomEpisodeIndex)
    } else if (hasNext) setCurrentEpisodeIndex(currentEpisodeIndex + 1)
  }

  const setIsPlayingState = (state: boolean) => setIsPlaying(state)

  const toggleLoop = () => setIsLooping(!isLooping)

  const toggleShuffle = () => setIsShuffling(!isShuffling)

  const clearPlayer = () => {
    setEpisodeList([])
    setCurrentEpisodeIndex(0)
  }

  return (
    <PlayerContext.Provider
      value={{
        currentEpisodeIndex,
        episodeList,
        isPlaying,
        hasPrevious,
        hasNext,
        isLooping,
        isShuffling,
        play,
        playList,
        togglePlay,
        playPrevious,
        playNext,
        toggleLoop,
        toggleShuffle,
        setIsPlayingState,
        clearPlayer,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => useContext(PlayerContext)
