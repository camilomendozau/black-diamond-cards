import { useState } from "react";
import ReactPlayer from "react-player";
import Loader from "./Loader";

export default function VideoPlayerLocal({ src, onNext }) {
  const [showButton, setShowButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
      <div className="md:w-2/3 w-11/12 aspect-video rounded-lg overflow-hidden shadow-2xl mx-10 flex items-center justify-center bg-black">
        {/* <Loader isLoading={isLoading} /> */}
        <ReactPlayer
          src={src}
          controls
          width="100%"
          height="100%"
        />
      </div>
  );
}
