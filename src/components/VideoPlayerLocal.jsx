import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import DownloaderButton from "./DownloaderButton";
import { navigate } from "astro/virtual-modules/transitions-router.js";
import analytics from "../scripts/analytics";

const DEFAULT_VIDEO = "https://www.youtube.com/embed/iOEsgul1Tj0?si=1-eOcOLgnJfpOUcT";

export default function Video({ title = "Video", keyName = "", defaultUrl = "" }) {
  const [duration, setDuration] = useState(0);
  const [dataUrls, setDataUrls] = useState(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const playerRef = useRef(null);
  const videoUrl = dataUrls?.[keyName] ?? defaultUrl;
  const isLocal = videoUrl !== "" && !videoUrl.includes("https") && !videoUrl.includes("youtube.com");

  useEffect(() => {
    if (typeof window !== 'undefined') analytics.init();
  }, []);

  useEffect(() => {
    const handleStorage = () => {
        setDataUrls(JSON.parse(sessionStorage.getItem('yt-vid-urls') || 'null'));
    };

    handleStorage();
    window.addEventListener('storage', handleStorage); // escucha cambios
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    const handleReady = () => {
        setDataUrls(JSON.parse(sessionStorage.getItem('yt-vid-urls') || 'null'));
    };

    handleReady(); // por si ya está en sessionStorage
    window.addEventListener('session-ready', handleReady); 
    return () => window.removeEventListener('session-ready', handleReady);
   }, []);

  const handleDuration = (event) => setDuration(event.target.duration);
  const handleDurationYoutube = (event) => setDuration(event.target.api.getDuration());

  const onStartPlayer = () => {
    analytics.trackVideoStart(title);
    setControlsVisible(false);
  };

  const onPausedPlayer = (state) => {
    const percentagePlayed = duration > 0
      ? Math.round((state.target.currentTime / duration) * 100)
      : 0;
    analytics.trackVideoPause(title, percentagePlayed);
  };

  const onEndVideo = async () => {
    analytics.trackVideoComplete(title, duration);
    try {
      const prospectData = await analytics.checkProspectData();
      navigate(prospectData.has_complete_data ? "/" : "/registro");
    } catch (error) {
      console.error('Error checking prospect data:', error);
      navigate("/registro");
    }
    setControlsVisible(true);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center my-5 md:flex-row md:items-center md:justify-center md:my-10 md:snap-start">
      <div className="md:w-full md:h-5/6 w-9/10 aspect-video rounded-2xl overflow-hidden shadow-2xl mx-10 flex items-center justify-center md:border-[40px] border-[15px] border-transparent">
        {isLocal ? (
          <div className="flex items-center justify-center flex-col md:flex-row w-full h-full">
            <ReactPlayer
              ref={playerRef}
              src={defaultUrl}
              controls={controlsVisible}
              width="100%"
              height="100%"
              onDurationChange={handleDuration}
              onStart={onStartPlayer}
              onPause={onPausedPlayer}
              onEnded={onEndVideo}
            />
            <DownloaderButton src={defaultUrl} />
          </div>
        ) : (
          <ReactPlayer
            ref={playerRef}
            src={dataUrls?.[keyName]??defaultUrl}
            controls={controlsVisible}
            width="100%"
            height="100%"
            config={{
              youtube: {
                playerVars: { rel: 0, modestbranding: 1 },
              },
            }}
            onStart={onStartPlayer}
            onPause={onPausedPlayer}
            onDurationChange={handleDurationYoutube}
            onEnded={onEndVideo}
          />
        )}
      </div>
    </div>
  );
}