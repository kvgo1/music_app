import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const [track, setTrack] = useState(songsData[0]);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      minute: 0,
    },
    totalTime: {
      second: 0,
      minute: 0,
    },
  });

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };
  
  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };
  

  const playWithId = (id) => {
    setTrack(songsData[id]);
    audioRef.current.play();
    setPlayStatus(true);
  };

  const previous = () => {
    if (track.id > 0) {
      const newTrack = songsData[track.id - 1];
      setTrack(newTrack);
      audioRef.current.src = newTrack.file;
      audioRef.current.play();
      setPlayStatus(true);
    }
  };
  
  const next = () => {
    if (track.id < songsData.length - 1) {
      const newTrack = songsData[track.id + 1];
      setTrack(newTrack);
      audioRef.current.src = newTrack.file;
      audioRef.current.play();
      setPlayStatus(true);
    }
  };
  

  const seekSong = (e) => {
    const offsetX = e.nativeEvent.offsetX;
    const seekBarWidth = seekBg.current.offsetWidth;
    audioRef.current.currentTime = (offsetX / seekBarWidth) * audioRef.current.duration;
  };

  useEffect(() => {
    const updateTime = () => {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;

      seekBar.current.style.width = (Math.floor((currentTime / duration) * 100)) + "%";
      setTime({
        currentTime: {
          second: Math.floor(currentTime % 60),
          minute: Math.floor(currentTime / 60),
        },
        totalTime: {
          second: Math.floor(duration % 60),
          minute: Math.floor(duration / 60),
        },
      });
    };

    audioRef.current.addEventListener('timeupdate', updateTime);

    return () => {
      audioRef.current.removeEventListener('timeupdate', updateTime);
    };
  }, []);

  const contextValue = {
    audioRef,
    seekBar,
    seekBg,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
