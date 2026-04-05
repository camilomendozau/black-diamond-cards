import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import Loader from "./Loader";
import usePlaybackVector from "../hooks/usePlaybackVector";
import analytics from "../scripts/analytics";
import DownloaderButton from "./DownloaderButton";
import { navigate } from "astro/virtual-modules/transitions-router.js";

export default function VideoPlayerLocal({ src, name }) {
    const [duration, setDuration] = useState(0);
    const [timeViewed, setTimeViewed] = useState(0);
    const playerRef = useRef(null);
    const [controlsVisible, setControlsVisible] = useState(true);

    // ← Inicializar analytics al montar
    useEffect(() => {
        if (typeof window !== 'undefined') {
            analytics.init();
        }
    }, []);

    const handleDurationYoutube = (event) => {
        let durationInSeconds = event.target.api.getDuration();
        setDuration(durationInSeconds);
    };

    const handleDuration = (event) => {
        let durationInSeconds = event.target.duration;
        setDuration(durationInSeconds);
    };

    const onStartPlayer = () => {
        analytics.trackVideoStart(name);
        setControlsVisible(false);
    };

    const onPausedPlayer = (state) => {
        const percentagePlayed = duration > 0 
            ? Math.round((state.target.currentTime / duration) * 100) 
            : 0;
        analytics.trackVideoPause(name, percentagePlayed);
    };

    // ← Modificar esta función para verificar antes de navegar
    const onEndVideo = async () => {
        analytics.trackVideoComplete(name, duration);
        
        // Verificar si el prospecto ya tiene datos completos
        try {
            const prospectData = await analytics.checkProspectData();
            
            if (prospectData.has_complete_data) {
                // Ya tiene datos, ir directo al material o mostrar mensaje
                console.log('✅ Prospecto ya tiene datos completos');
                // Puedes navegar a otra página o mostrar un mensaje
                navigate("/"); // O la página que corresponda
            } else {
                // No tiene datos, ir al formulario
                console.log('📝 Prospecto necesita completar datos');
                navigate("/registro");
            }
        } catch (error) {
            console.error('Error checking prospect data:', error);
            // En caso de error, ir al formulario por seguridad
            navigate("/registro");
        }
        
        setControlsVisible(true);
    };

    return (
        !src.includes("https") && !src.includes("youtube.com") ? (
            <div className="flex items-center justify-center flex-col md:flex-row">
                <div className="md:w-2/3 w-11/12 aspect-video rounded-2xl shadow-2xl flex items-center justify-center">
                    <ReactPlayer
                        src={src}
                        ref={playerRef}
                        controls={controlsVisible}
                        width={"100%"}
                        height={"100%"}
                        onPause={onPausedPlayer}
                        onStart={onStartPlayer}
                        onDurationChange={handleDuration}
                        onEnded={onEndVideo}
                    />
                </div>
                <DownloaderButton src={src} />
            </div>
        ) : (
            <div className="w-full aspect-video rounded-2xl" style={{ outline: '40px solid transparent', boxShadow: '0 35px 60px -15px rgba(0,0,0,0.25)' }}>
                <ReactPlayer
                    src={src}
                    ref={playerRef}
                    controls={controlsVisible}
                    width={"100%"}
                    height={"100%"}
                    config={{
                        youtube: {
                            playerVars: {
                                rel: 0,
                                modestbranding: 1,
                            },
                        },
                    }}
                    onStart={onStartPlayer}
                    onPause={onPausedPlayer}
                    onDurationChange={handleDurationYoutube}
                    onEnded={onEndVideo}
                />
            </div>
        )
    );
}