import '../styles/global.scss'

import { AppProps } from 'next/app'

import Header from '../components/Header'
import Player from '../components/Player'

import styles from '../styles/app.module.scss'
import { PlayerProvider } from '../contexts/PlayerContext'

const MyApp = ({ Component, pageProps }: AppProps) => (
  <div className={styles.wrapper}>
    <PlayerProvider>
      <main>
        <Header />
        <Component {...pageProps} />
      </main>

      <Player />
    </PlayerProvider>
  </div>
)

export default MyApp
