import { Audio } from 'expo-av';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

type PlayerContextType = {
  isPlaying: boolean;
  play: (url?: string, title?: string) => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  toggle: (url?: string, title?: string) => Promise<void>;
  title: string | null;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

const STREAM_URL_DEFAULT = 'https://swahilipotfm.out.airtime.pro/swahilipotfm_a?_ga=2.140975346.1118176404.1720613685-1678527295.1702105127';

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [title, setTitle] = useState<string | null>(null);
  const currentUrlRef = useRef<string | null>(null);

  useEffect(() => {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});

    return () => {
      // cleanup on unmount
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, []);

  async function loadAndPlay(url: string) {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true, staysActiveInBackground: true },
      );

      soundRef.current = sound;
      currentUrlRef.current = url;
      setIsPlaying(true);

      sound.setOnPlaybackStatusUpdate(status => {
        if (!status.isLoaded) return;
        setIsPlaying(status.isPlaying ?? false);
      });
    } catch (e) {
      console.warn('Audio load error', e);
    }
  }

  async function play(url?: string, titleArg?: string) {
    const urlToUse = url ?? STREAM_URL_DEFAULT;
    if (titleArg) setTitle(titleArg);

    // if already playing same URL, do nothing
    if (isPlaying && currentUrlRef.current === urlToUse) return;

    await loadAndPlay(urlToUse);
  }

  async function pause() {
    try {
      if (soundRef.current) {
        await soundRef.current.pauseAsync();
      }
    } catch (e) {}
  }

  async function stop() {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        currentUrlRef.current = null;
        setIsPlaying(false);
        setTitle(null);
      }
    } catch (e) {}
  }

  async function toggle(url?: string, titleArg?: string) {
    const urlToUse = url ?? STREAM_URL_DEFAULT;
    if (!isPlaying) {
      await play(urlToUse, titleArg);
    } else {
      // if playing a different stream, switch
      if (currentUrlRef.current && currentUrlRef.current !== urlToUse) {
        await play(urlToUse, titleArg);
      } else {
        await pause();
      }
    }
  }

  const value: PlayerContextType = {
    isPlaying,
    play,
    pause,
    stop,
    toggle,
    title,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export default PlayerProvider;
